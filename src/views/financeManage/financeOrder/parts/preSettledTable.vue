<template>
  <div class="page-inner">
    <div class="card-contnet">
      <div class="table-contnet">
        <Row class-name="head">
          <Col class-name="col" span="4">订单编号</Col>
          <Col class-name="col" span="4">客户名称</Col>
          <Col class-name="col" span="4">下单日期</Col>
          <Col class-name="col" span="3">下单金额</Col>
          <Col class-name="col" span="3">实单金额 </Col>
          <Col class-name="col" span="3">状态 </Col>
          <Col class-name="col" span="3">操作</Col>
        </Row>
        <div v-for="(items ,idx) in list" :key="idx">
          <div class="settle-info">
            <Button type="warning" class="okSettled" size="small" @click="okSettled(items)">完成结算</Button>
            <Button type="warning" class="okSettled" style="margin-left:10px;" size="small" @click="cancelSettled(true,items)">批量取消</Button>
            <Button type="warning" class="okSettled" style="margin-left:10px;" size="small" @click="print(items)">打印</Button>
            <span class="cell pointer" @click="toggleItem(items,idx)"><Icon :type="items.isShow ? 'ios-arrow-down':'ios-arrow-forward'" /></span>
            <span class="cell">预结算单号：{{items.id}}</span>
            <span class="cell">预结算日期：{{items.createTime | dateformat}}</span>
            <span class="cell">预结算金额：￥{{items.totalPrice}}</span>
          </div>
          <Row class="row-body" v-for="(item,index) in items.orders" :key="index">
            <div v-show="items.isShow">
              <Col class-name="col" span="4">{{item.id}}</Col>
              <Col class-name="col" span="4">{{item.customerName}}</Col>
              <Col class-name="col" span="4">{{item.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
              <Col class-name="col" span="3">￥{{item.amount}}</Col>
              <Col class-name="col" span="3">￥{{item.realAmount}}</Col>
              <Col class-name="col" span="3">{{item.settlementStatus | settlementStatus}}</Col>
              <Col class-name="col" span="3">
              <Button type="success" size="small" style="margin-right:8px;" @click="cancelSettled(false,item)">取消结算</Button>
              <Button type="success" size="small" @click="detail(item)">查看</Button>
              </Col>
            </div>
          </Row>
        </div>
      </div>
    </div>
    <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
      <detailPage :order="detailItem" :logList="logList"></detailPage>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat,
    settlementStatus
  } from '@/utils/filters'
  import detailPage from './detailPage.vue'
  export default {
    components: {
      detailPage
    },
    props: {
      lists: {
        type: Array
      }
    },
    data() {
      return {
        isCancel: false,
        logList: [],
        show: false,
        detailItem: {},
        list: []
      }
    },
    watch: {
      lists(val) {
        this.list = [...val]
      }
    },
    methods: {
      /// 展开收起
      toggleItem(item, idx) {
        this.list[idx].isShow = !this.list[idx].isShow;
      },
      detail(item) {
        this.show = true;
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
        this.getLog(item)
      },
      getLog(item) {
        this.$http.post(this.$api.orderFeeHistory, {
          orderId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.logList = res.data;
          }
        })
      },
      // 取消结算
      cancelSettled(isPl, item) {
        this.$Modal.confirm({
          title: '取消结算确认',
          content: `是否确认取消结算？`,
          onOk: () => {
            let params = {}
            if (isPl) {
              let ids = [];
              item.orders.forEach(el => {
                ids.push(el.id);
              })
              params.orderId = ids.toString();
            } else {
              params.orderId = item.id;
            }
            this.$http.post(this.$api.settleCancel, params).then(res => {
              if (res.code === 1000) {
                this.$emit('on-cancel', !this.isCancel)
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      // 完成结算
      okSettled(item) {
        this.$Modal.confirm({
          title: '完成结算确认',
          content: `是否确认完成结算？`,
          onOk: () => {
            this.$http.post(this.$api.settleFinish, {
              settlementId: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.$emit('on-cancel', !this.isCancel)
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      // 打印
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
              h('div', '正在生成打印结算单...')
            ])
          }
        });
        this.$http.post(this.$api.settlementPrint, {
          settlementId: item.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
    }
  }
</script>

<style lang='less'>
  .settle-info {
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
    text-align: left;
    .pointer {
      cursor: pointer;
    }
    .okSettled {
      float: right;
      margin-top: 8px;
      margin-right: 20px;
      text-align: center;
    }
    span {
      &.cell {
        display: inline-block;
        margin-left: 20px;
      }
    }
  }
  
  .row-body {
    background-color: #f8f8f9;
  }
</style>