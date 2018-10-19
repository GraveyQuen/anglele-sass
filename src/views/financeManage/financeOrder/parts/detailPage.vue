<template>
      <div class="order-detail" v-if="order.orderItems">
        <div class="order-detail-title">
          <span>基本信息</span>
        </div>
        <div class="order-detail-main">
          <Row class="order-row">
            <Col span="8" class="order-row-col">客户名称：{{order.customerName}}</Col>
            <Col span="8" class="order-row-col">订单编号：{{order.id}}</Col>
            <Col span="8" class="order-row-col" v-if="order.settlementId != ''">结算单号：{{order.settlementId}}</Col>
            <Col span="8" class="order-row-col">下单金额：￥{{order.amount}}</Col>
            <Col span="8" class="order-row-col">{{order.realAmount != '' ? `实单金额：￥${order.realAmount}`:''}}</Col>
            <Col span="8" class="order-row-col">订单状态：{{order.settlementStatus | settlementStatus}}</Col>
            <Col span="8" class="order-row-col">下单日期：{{order.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="8" class="order-row-col">客户联系人：{{order.contactPeople}}</Col>
            <Col span="8" class="order-row-col">客户联系方式：{{order.contactPhone}}</Col>
            <Col span="8" class="order-row-col">备注：{{order.remark}}</Col>
          </Row>
          <Row class="order-row">
            <Col span="10" class="order-row-col">送货地址：{{order.address}}</Col>
        </Row>
        </div>
         <div class="order-detail-title">
          <span>订单明细</span>
        </div>
        <div class="order-detail-main">
          <div class="page-inner">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="6">产品名称</Col>
                <Col class-name="col" span="3">单价</Col>
                <Col class-name="col" span="3">下单数量</Col>
                <Col class-name="col" span="3">下单金额小计</Col>
                <Col class-name="col" span="3" >实单数量</Col>
                <Col class-name="col" span="3">实单单价</Col>
                <Col class-name="col" span="3">实单金额小计</Col>
              </Row>
              <Row v-for="(item,index) in order.orderItems" :key="index">
                <Col class-name="col" span="6">{{item.productName}}</Col>
                <Col class-name="col" span="3">{{item.price}}元/{{item.unit}}</Col>
                <Col class-name="col" span="3">{{item.num}}{{item.unit}}</Col>
                <Col class-name="col" span="3">￥{{item.totalPrice}}</Col>
                <Col class-name="col" span="3">{{item.realNum}}{{item.unit}}</Col>
                <Col class-name="col" span="3">{{item.realPrice}}元/{{item.unit}}</Col>
                <Col class-name="col" span="3">￥{{item.realTotalPrice}}</Col>
              </Row>
            </div>
          </div>
          </div>
        </div>
      </div>
</template>

<script>
  export default {
    props: {
      order: Object
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  @import url('../../../../assets/less/base.less');
    .order-detail {
    .order-detail-title {
      padding: 0 10px;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      background-color: rgba(17, 194, 109, 0.15);
      span {
        display: inline-block;
        margin-right: 20px;
      }
    }
    .order-detail-main {
      margin: 20px 0;
      .order-row {
        .order-row-col {
          margin-bottom: 15px;
        }
      }
    }
  }
</style>