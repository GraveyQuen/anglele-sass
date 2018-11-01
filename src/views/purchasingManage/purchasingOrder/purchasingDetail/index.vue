<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="采购单详情">
      <Button type="primary" slot="extra" @click="print" class="extra-button" style="margin-right:15px;">打印</Button>
      <Button slot="extra" class="extra-button" @click="goBack">返回</Button>
      <Row v-if="detailItem.purchaseOrder">
        <Col class="col" span="6">制单人：{{detailItem.purchaseOrder.createUser}}</Col>
        <Col class="col" span="6">采购员：{{detailItem.purchaseOrder.operatePerson}}</Col>
        <Col class="col" span="6">联系方式：{{detailItem.purchaseOrder.operatePersonPhone}}</Col>
        <Col class="col" span="6">采购日期：{{detailItem.purchaseOrder.purchaseDate}}</Col>
        <Col class="col" span="6">备注：{{detailItem.purchaseOrder.remark != '' ? detailItem.purchaseOrder.remark : '暂无'}}</Col>
        <Col class="col" span="6" v-show="detailItem.purchaseOrder.status === 1">采购总金额：{{detailItem.purchaseOrder.totalAmount}}元</Col>
      </Row>
      <div class="order-main">
        <div class="order-main-header">
          订单明细
        </div>
        <Table border :columns="orderHeader" :data="detailItem.orders"></Table>
        <div class="order-main-header">
          采购明细
        </div>
        <div class="purchaseOrder">
          <div class="purchaseOrder-header">
            <div class="purchaseOrder-list">分类</div>
            <div class="purchaseOrder-list">产品名称</div>
            <div class="purchaseOrder-list big">客户下单明细</div>
            <div class="purchaseOrder-list">小计</div>
          </div>
          <div class="purchaseOrder-main" v-for="(item,index) in detailItem.purchaseOrderItems" :key="index">
            <div class="purchaseOrder-main-list">{{item.category}}</div>
            <div class="purchaseOrder-main-list big">
              <div class="purchaseOrder-main-list-inner" v-for="(sub,i) in item.items">
                <div class="inner-list">{{sub.productName}}</div>
                <div class="inner-list more" :class="detailItem.purchaseOrder.status === 1 ? 'lang':''">{{sub.detail}}</div>
                <div class="inner-list last">
                  <div class="">采购数量：{{sub.num}}{{sub.unit}}</div>
                  <div class="" v-show="detailItem.purchaseOrder.status === 1 && sub.cost !=''">采购单价：{{sub.cost}}元/{{sub.unit}}</div>
                  <div class="" v-show="detailItem.purchaseOrder.status === 1 && sub.realAmount !=''">采购金额：{{sub.realAmount}}元</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        detailItem: {},
        orderHeader: [{
          title: '订单编号',
          key: 'id'
        }, {
          title: '客户名称',
          key: 'customerName'
        }, {
          title: '下单时间',
          key: 'newOrderDate',
          render: (h, params) => {
            return h('div', dateformat(params.row.newOrderDate))
          },
          minWidth: 120
        }]
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      details() {
        this.$http.post(this.$api.findPurchaseOrder, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
      },
      print(item) {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '正在生产采购单...')
            ])
          }
        });
        this.$http.post(this.$api.printPurchaseOrder, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
      goBack() {
        this.$router.push({
          name: 'purchasingList'
        })
      }
    },
    created() {
      this.details();
    }
  }
</script>

<style lang='less' scoped>
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .order-main-header {
    height: 46px;
    line-height: 46px;
    background-color: #f8f8f9;
    padding: 0 15px;
    margin: 15px 0;
    font-weight: 700;
  }
  
  .col {
    margin-bottom: 15px;
  }
  
  .purchaseOrder {
    padding-bottom: 30px;
    .purchaseOrder-header {
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      background-color: #f8f8f9;
      border: 1px solid #e8eaec;
      .purchaseOrder-list {
        display: inline-block;
        width: 15%;
        padding: 0 15px;
        border-right: 1px solid #e8eaec;
        &.big {
          width: 55%;
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
    .purchaseOrder-main {
      position: relative;
      border-right: 1px solid #e8eaec;
      border-left: 1px solid #e8eaec;
      padding-left: 15%;
      .purchaseOrder-main-list {
        display: inline-block;
        width: 15%;
        border-right: 1px solid #e8eaec;
        &.big {
          width: 100%;
        }
        &:first-child {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-bottom: 1px solid #e8eaec;
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
        }
        &:last-child {
          border-right: 0;
        }
        .purchaseOrder-main-list-inner {
          border-bottom: 1px solid #e8eaec;
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
          .inner-list {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            width: 17.6%;
            padding: 0 15px;
            &.last{
              height: auto;
              min-height: 40px;
            }
            &.more {
              height: auto;
              min-height: 40px;
              width: 64.9%;
              border-right: 1px solid #e8eaec;
              border-left: 1px solid #e8eaec;
              &.lang{
                min-height: 120px;
              }
            }
            &:last-child {
              border-right: 0;
            }
          }
        }
      }
    }
  }
</style>