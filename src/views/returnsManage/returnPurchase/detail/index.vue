<template>
  <div class="page-inner" v-if="detail.order">
    <Card :bordered="true" dis-hover title="采购退货详情">
      <Button slot="extra" class="extra-button" @click="goBack">返回</Button>
      <Row class="orders">
        <Col span="8" class="row-span"> 开单日期：{{detail.order.orderDate}}
        </Col>
        <Col span="8" class="row-span"> 供应商名称：{{detail.order.provider !='' ? detail.order.provider : '暂无'}}
        </Col>
        <Col span="8" class="row-span"> 供应商联系方式：{{detail.order.providerPhone !='' ? detail.order.providerPhone : '暂无'}}
        </Col>
        <Col span="8" class="row-span"> 仓库：{{detail.order.wareHouseName}}
        </Col>
        <Col span="8" class="row-span"> 状态：{{detail.order.status | toStatus}}
        </Col>
        <Col span="8" class="row-span"> 备注：{{detail.order.remark !='' ? detail.order.remark : '暂无'}}
        </Col>
      </Row>
      <div class="product-header"><span>退货总金额：￥{{detail.order.totalAmount}}</span>退货产品</div>
      <Table border :columns="goodsHeader" :data="detail.items"></Table>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        detail: {},
        goodsHeader: [{
          title: '产品名称',
          key: 'productName',
        }, {
          title: '分类名称',
          key: 'productCategory',
        }, {
          title: '成本价',
          key: 'cost',
          render: (h, params) => {
            let str = `${params.row.cost}元/${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '退货数量',
          key: 'refundNum',
          render: (h, params) => {
            const str = `${params.row.refundNum}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '退货金额',
          key: 'refundAmount',
          render: (h, params) => {
            const str = `￥${params.row.refundAmount}`
            return h('div', str)
          }
        }]
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 0:
            return '暂存'
            break;
          case 1:
            return '完成'
            break;
          case 9:
            return '取消'
            break;
        }
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.findPurchaseRefund, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
            this.detail = Object.assign({}, res.data)
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .product-header {
    margin: 20px 0;
    background-color: #f8f8f9;
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    font-size: 14px;
    color: #17233d;
    font-weight: 700;
    span{
      float: right;
    }
  }
  .row-span{
    margin-bottom: 10px;
  }
</style>