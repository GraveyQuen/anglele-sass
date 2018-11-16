<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover :title="isEdit ? '编辑退货单':'新增退货单'">
      <Button type="primary" slot="extra" @click="save(2)" class="extra-button" style="margin-right:15px;">保存</Button>
      <!-- <Button type="warning" slot="extra" @click="save(1)" class="extra-button" style="margin-right:15px;">暂存</Button> -->
      <Button slot="extra" class="extra-button" @click="goBack">取消</Button>
      <Form :mode="dataApi" :label-width="100" inline>
        <FormItem label="开单日期：">
          <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="dataApi.newOrderDate" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="dataApi.remark" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="开单人：">
          {{user ? user.userName: '' }}
        </FormItem>
      </Form>
      <div class="order-main">
        <div class="order-main-header">订单基本信息</div>
        <div class="order-main-content">
          <Row class="order-row">
            <Col span="6" class="order-row-col">客户名称：{{orders.customerName}}</Col>
            <Col span="6" class="order-row-col">下单金额：￥{{orders.amount}}</Col>
            <Col span="6" class="order-row-col">{{orders.realAmount != '' ? `实单金额：￥${orders.realAmount}`:''}}</Col>
            <Col span="6" class="order-row-col">下单日期：{{orders.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="6" class="order-row-col">客户联系人：{{orders.contactPeople}}</Col>
            <Col span="6" class="order-row-col">客户联系方式：{{orders.contactPhone}}</Col>
            <Col span="6" class="order-row-col">送货地址：{{orders.address}}</Col>
            <Col span="6" class="order-row-col">备注：{{orders.remark != '' ? orders.remark :'暂无'}}</Col>
          </Row>
        </div>
      </div>
      <div class="order-main">
        <div class="order-main-header">订单明细</div>
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
              <Row v-for="(item,index) in returnData" :key="index">
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
                <Col class-name="col" span="2">
                  <InputNumber :min="0" :max="sub.realNum" v-model.number="sub.refundNum" size="small" style="width:80px;"></InputNumber>{{sub.unit}}
                </Col>
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
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        orders: {},
        returnData: [],
        dataApi: {
          newOrderDate: '',
          remark: '',
          orderId: '',
          status: '',
          refundOrderItems: []
        }
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      user() {
        return this.$store.state.user
      },
      isRefundNum() {
        let isOk = true
        this.returnData.map(el => {
          if (el.refundNum === null || el.refundNum === 'null') {
            isOk = false
          }
        })
        return isOk
      },
      //  全部为0时不能提交
      isAllZero(){
        let arr = []
        arr = this.returnData.filter(el => el.refundNum === 0 || el.refundNum === null)
        return arr
      },
      newDate(){
        return this.dataApi.newOrderDate != '' ? this.dataApi.newOrderDate.getTime() : ''
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.findOneRefund, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
              this.orders = res.data.order;
              this.returnData = [...res.data.refundOrder.refundOrderItems]
          }
        })
      },
      //  获取当前服务器时间
      currentTime() {
        this.$http.post(this.$api.serverTime).then(res => {
          if (res.code === 1000) {
            if (!this.isEdit) {
              this.dataApi.newOrderDate = new Date(res.data);
            }
          }
        })
      },
      save(status) {
        if (this.isRefundNum) {
          if(this.isAllZero.length != this.returnData.length){
          if (this.dataApi.newOrderDate != '') {
            this.$Modal.confirm({
              title: '订单退货',
              content: `确认${status === 1 ? '暂存':'保存'}退货？`,
              onOk: () => {
                let params = this.$clearData(this.dataApi);
                params.newOrderDate = this.newDate;
                params.status = status;
                params.orderId = this.orders.id;
                params.refundOrderItems = JSON.stringify(this.returnData);
                this.$http.post(this.$api.orderRefund, params).then(res => {
                  if (res.code === 1000) {
                    this.$router.push({
                      name: 'returnBill'
                    })
                    this.$Message.success('退货成功!');
                  } else {
                    this.$Message.error(res.message);
                  }
                })
              }
            })
          } else {
            this.$Message.error('请选择开单日期')
          }
          }else{
            this.$Message.error('退货数量不能全为0')
          }
        } else {
          this.$Message.error('退货数量不能为空')
        }
      },
      goBack() {
        this.$router.go(-1)
      }
    },
    created() {
      this.getData();
      if (!this.isEdit) {
        this.currentTime();
      }
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