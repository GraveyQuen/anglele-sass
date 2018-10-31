<template>
  <div class="page-inner" v-if="orders.order">
    <Card :bordered="true" dis-hover title="退货单详情">
      <Button slot="extra" class="extra-button" @click="goBack">返回</Button>
      <Form :label-width="100" inline>
        <FormItem label="开单日期：">
          {{orders.refundOrder.newOrderDate | dateformat('yyyy-MM-dd')}}
        </FormItem>
        <FormItem label="备注：">
          {{orders.refundOrder.remark}}
        </FormItem>
        <FormItem label="开单人：">
          {{orders.refundOrder.newOrderUser}}
        </FormItem>
      </Form>
      <div class="order-main">
        <div class="order-main-header">订单基本信息</div>
        <div class="order-main-content">
          <Row class="order-row">
            <Col span="6" class="order-row-col">客户名称：{{orders.order.customerName}}</Col>
            <Col span="6" class="order-row-col">下单金额：￥{{orders.order.amount}}</Col>
            <Col span="6" class="order-row-col">{{orders.order.realAmount != '' ? `实单金额：￥${orders.order.realAmount}`:''}}</Col>
            <Col span="6" class="order-row-col">下单日期：{{orders.order.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="6" class="order-row-col">客户联系人：{{orders.order.contactPeople}}</Col>
            <Col span="6" class="order-row-col">客户联系方式：{{orders.order.contactPhone}}</Col>
            <Col span="6" class="order-row-col">送货地址：{{orders.order.address}}</Col>
            <Col span="6" class="order-row-col">备注：{{orders.order.remark != '' ? orders.order.remark :'暂无'}}</Col>
          </Row>
        </div>
      </div>
      <div class="order-main">
        <div class="order-main-header">订单明细</div>
        <div class="order-main-content">
          <Table ref="orderItems" border :data="orders.refundOrder.refundOrderItems" :columns="tableHeader"></Table>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orders: {},tableHeader: [{
          title: '产品名称',
          key: 'productName'
        }, {
          title: '下单单价',
          key: 'price',
          render: (h, params) => {
            const str = `${params.row.price}/${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '下单数量',
          key: 'num',
          render: (h, params) => {
            const str = `${params.row.num}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '下单金额',
          key: 'totalPrice',
          render: (h, params) => {
            const str = `${params.row.totalPrice}元`
            return h('div', str)
          }
        }, {
          title: '实单单价',
          key: 'realPrice',
          render: (h, params) => {
            const str = `${params.row.realPrice}/${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '实单数量',
          key: 'realNum',
          render: (h, params) => {
            const str = `${params.row.realNum}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '实单金额',
          key: 'productName',
          render: (h, params) => {
            const str = `${params.row.realTotalPrice}元`
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
          key: 'overplusMoney',
          render: (h, params) => {
            const str = `￥${(params.row.refundNum * params.row.realPrice).toFixed(2)}`
            return h('div', str)
          }
        }, {
          title: '剩余数量',
          key: 'overplusNum',
          render: (h, params) => {
            const str = `${(params.row.realNum - params.row.refundNum).toFixed(2)}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '剩余金额',
          key: 'returnMoney',
          render: (h, params) => {
            const str = `${((params.row.realNum - params.row.refundNum)*params.row.realPrice).toFixed(2)}${params.row.unit}`
            return h('div', str)
          }
        }]
      }
    },
    computed:{
      id(){
        return this.$route.query.id
      }
    },
    methods: {
      getData(){
        this.$http.post(this.$api.findOneRefund,{id: this.id}).then(res =>{
          if(res.code === 1000){
            this.orders = Object.assign({},res.data)
          }
        })
      },
      goBack(){
        this.$router.go(-1)
      }
      
    },
    created(){
      this.getData();
    }
  }
</script>
<style lang='less' scoped>
  .order-main {
    margin-top: 20px;
    .order-main-header {
      height: 46px;
      line-height: 46px;
      background-color: #f8f8f9;
      padding: 0 15px;
      margin-bottom: 15px;
      font-weight: 700;
    }
    .order-row-col {
      margin-bottom: 10px;
    }
  }
</style>