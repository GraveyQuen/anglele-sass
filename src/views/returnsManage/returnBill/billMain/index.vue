<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover :title="isEdit ? '编辑退货单':'新增退货单'">
      <Button type="primary" slot="extra" @click="save(2)" class="extra-button" style="margin-right:15px;">保存</Button>
      <Button type="warning" slot="extra" @click="save(1)" class="extra-button" style="margin-right:15px;">暂存</Button>
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
        <div class="order-main-content">
          <Table ref="orderItems" border :data="returnData" :columns="tableHeader">
            <!-- 退货数量 -->
            <template slot="refundNum" slot-scope="props">
                        <Form :ref="'formRow'+props.idx" :model="props.row">
                          <FormItem prop="num" :rules="{required: true, message: '请输入数量', trigger: 'blur',type: 'number'}">
                            <InputNumber :min="0" :max="props.row.realNum" v-model.number="props.row.refundNum" size="small" style="width:80px;"></InputNumber>{{props.row.unit}}
                          </FormItem>
                        </Form>
</template>
          </Table>
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
        },
        tableHeader: [{
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
          key: 'overplusNum',
          render: (h, params) => {
            this.returnData[params.index] = params.row
            return h(
              'div',
              this.$refs.orderItems.$scopedSlots.refundNum({
                row: params.row,
                idx: params.row._index
              })
            )
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
            if (!this.isEdit) {
              this.orders = res.data.order;
              this.returnData = res.data.order.orderItems.map(el => {
                el.refundNum = 0;
                el.returnMoney = 0;
                el.overplusNum = 0;
                el.overplusMoney = 0;
                return el
              })
            } else {
              this.orders = res.data.order;
              this.returnData = res.data.refundOrder.refundOrderItems.map(el => {
                el.refundNum = el.refundNum;
                el.returnMoney = 0;
                el.overplusNum = 0;
                el.overplusMoney = 0;
                return el
              })
              this.dataApi.remark = res.data.refundOrder.remark;
              this.dataApi.newOrderDate = dateformat(res.data.refundOrder.newOrderDate);
            }
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