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
            <Col span="6" class="order-row-col">状态：{{orders.refundOrder.status === 2 ? "退货成功":"取消退货"}}</Col>
            <Col span="6" class="order-row-col">备注：{{orders.order.remark != '' ? orders.order.remark :'暂无'}}</Col>
          </Row>
        </div>
      </div>
      <div class="order-main">
        <div class="order-main-header"><span>退货总金额：￥{{orders.refundOrder.refundAmount}}</span>退货明细</div>
        <div class="order-main-content page-inner">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="4">产品名称</Col>
                <Col class-name="col" span="2">下单单价</Col>
                <Col class-name="col" span="2">下单数量</Col>
                <Col class-name="col" span="2">下单金额	</Col>
                <Col class-name="col" span="2">实单单价</Col>
                <Col class-name="col" span="2">实单数量</Col>
                <Col class-name="col" span="2">实单金额	</Col>
                <Col class-name="col" span="2">退货数量</Col>
                <Col class-name="col" span="2">退货金额</Col>
                <Col class-name="col" span="2">剩余数量</Col>
                <Col class-name="col" span="2">剩余金额</Col>
              </Row>
              <Row v-for="(item,index) in orders.refundOrder.refundOrderItems" :key="index">
                <Row>
                  <Col span="24" class="wareHouseName">{{item.wareHouseName}}</Col>
                </Row>
                <Row v-for="(sub,idx) in item.item" :key="idx">
                <Col class-name="col" span="4">{{sub.productName}}</Col>
                <Col class-name="col" span="2">{{sub.price}}/{{sub.unit}}</Col>
                <Col class-name="col" span="2">{{sub.num}}{{sub.unit}}</Col>
                <Col class-name="col" span="2">￥{{sub.totalPrice}}</Col>
                <Col class-name="col" span="2">{{sub.realPrice}}/{{sub.unit}}</Col>
                <Col class-name="col" span="2">{{sub.realNum}}{{sub.unit}}</Col>
                <Col class-name="col" span="2">￥{{sub.realTotalPrice}}	</Col>
                <Col class-name="col" span="2">{{sub.refundNum}}{{sub.unit}}</Col>
                <Col class-name="col" span="2">{{`￥${(sub.refundNum * sub.realPrice).toFixed(2)}`}}</Col>
                <Col class-name="col" span="2">{{`${(sub.realNum - sub.refundNum).toFixed(2)}${sub.unit}`}}</Col>
                <Col class-name="col" span="2">{{`￥${((sub.realNum - sub.refundNum)*sub.realPrice).toFixed(2)}`}}</Col>
                </Row>
              </Row>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orders: {},
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.findOneRefund, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
            // 退货数量为零不显示
            res.data.refundOrder.refundOrderItems[0].item = res.data.refundOrder.refundOrderItems[0].item.filter(keys => keys.refundNum != 0);
            this.orders = Object.assign({}, res.data)
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
  @import url('../../../../assets/less/base.less');
  .order-main {
    margin-top: 20px;
    .order-main-header {
      height: 46px;
      line-height: 46px;
      background-color: #f8f8f9;
      padding: 0 15px;
      margin-bottom: 15px;
      font-weight: 700;
      span {
        float: right;
      }
    }
    .order-row-col {
      margin-bottom: 10px;
    }
  }
  .wareHouseName{
    text-align: left;
    padding-left: 20px;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec
  }
</style>