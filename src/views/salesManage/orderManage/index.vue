<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="订单管理">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="订单金额：">
          <Input v-model="pageApi.amountMin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.amountMax" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="实单金额：">
          <Input v-model="pageApi.realAmountMin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.realAmountMax" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="下单方式：">
          <Select v-model="pageApi.orderType" style="width: 200px;">
                        <Option v-for="(item,index) in [{value: 1,name:'自主下单'},{value: 2,name: '代客下单'}]" :value="item.value" :key="index">{{ item.name }}</Option>
                      </Select>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                        <Option v-for="(item,index) in orderStatus" :value="item.value" :key="index">{{ item.name }}</Option>
                      </Select>
        </FormItem>
        <FormItem label="下单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除筛选</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="orderTable" :columns="tableHeader" border :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
              <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 4">完成</Button>
              <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看</Button>
              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1">确认</Button>
              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2 || props.row.status === 3 || props.row.status === 4" @click="cancelOrder(props.row)">取消</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="取消订单" width="500" v-model="cancelShow" :mask-closable="false">
      <Form ref="formCancel" :model="cancelApi" :rules="cancelRule" :label-width="100">
        <FormItem label="取消原因：" prop="cancelReason">
          <Input v-model="cancelApi.cancelReason" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelSubmit('formCancel')" :loading="loading">保存</Button>
        <Button @click="cancelReset('formCancel')">取消</Button>
      </div>
    </Modal>
    <Modal title="订单详情" width="800" v-model="show" :mask-closable="false">
      <div class="order-detail" v-if="detailItem.order">
        <div class="order-detail-title">
          <span>基本信息</span>
          <span>订单单号：{{detailItem.order.id}}</span>
          <span>订单状态：{{detailItem.order.status | orderStatus}}</span>
          <span>下单金额：￥{{detailItem.order.amount}}</span>
          <span>{{detailItem.order.realAmount != '' ? `实单金额：￥${detailItem.order.realAmount}`:''}}</span>
        </div>
        <div class="order-detail-main">
          <Row class="order-row">
            <Col span="6" class="order-row-col">客户名称：{{detailItem.order.customerName}}</Col>
            <Col span="6" class="order-row-col">下单日期：{{detailItem.order.createTime | dateformat}}</Col>
            <Col span="6" class="order-row-col">客户联系人：{{detailItem.order.contactPeople}}</Col>
            <Col span="6" class="order-row-col">客户联系方式：{{detailItem.order.contactPhone}}</Col>
          </Row>
          <Row class="order-row">
            <Col span="10" class="order-row-col">送货地址：{{detailItem.order.address}}</Col>
            <Col span="4" class="order-row-col">备注：{{detailItem.order.remark}}</Col>
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
                <Col class-name="col" span="4">产品名称</Col>
                <Col class-name="col" span="4">单价</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">下单数量</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">下单金额小计</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">实单数量</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">实单数量小计</Col>
              </Row>
              <Row v-for="(item,index) in detailItem.orderItem" :key="index">
                <Col class-name="col" span="4">{{item.productName}}</Col>
                <Col class-name="col" span="4">￥{{item.price}}</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">{{item.num}}/{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">￥{{item.totalPrice}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">{{item.realNum}}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">{{item.realTotalPrice}}</Col>
              </Row>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat,
    orderStatus
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          id: '',
          customerName: '',
          startCreateTime: '',
          endCreateTime: '',
          amountMin: '',
          amountMax: '',
          realAmountMin: '',
          realAmountMax: '',
          status: '',
          orderType: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: ''
        },
        detailItem: {},
        cancelShow: false,
        cancelApi: {
          id: '',
          cancelReason: ''
        },
        loading: false,
        cancelRule: {
          cancelReason: {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        },
        orderStatus: [{
          value: 1,
          name: '已下单'
        }, {
          value: 2,
          name: '已确认'
        }, {
          value: 3,
          name: '配送中'
        }, {
          value: 4,
          name: '配送中'
        }, {
          value: 5,
          name: '已完成'
        }, {
          value: 9,
          name: '已取消'
        }],
        dateValue: ['', ''],
        dateValue2: ['', ''],
        list: [],
        totalCount: 0,
        show: false,
        tableHeader: [{
          title: '订单编号',
          key: 'id',
          minWidth: 180
        }, {
          title: '客户名称',
          key: 'customerName',
          minWidth: 160
        }, {
          title: '下单日期',
          key: 'createTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.createTime, 'yyyy-MM-dd'))
          },
          minWidth: 120
        }, {
          title: '客户联系人',
          key: 'contactPeople',
          minWidth: 120
        }, {
          title: '客户联系方式',
          key: 'contactPhone',
          minWidth: 120
        }, {
          title: '送货地址',
          key: 'address',
          minWidth: 180
        }, {
          title: '下单金额',
          key: 'amount',
          minWidth: 120,
          render: (h, params) => {
            return h('div', `￥${params.row.amount}`)
          },
        }, {
          title: '实单金额',
          key: 'realAmount',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.realAmount != '' ? `￥${params.row.realAmount}` : '暂无'
            return h('div', str)
          },
        }, {
          title: '状态',
          key: 'status',
          minWidth: 120,
          render: (h, params) => {
            return h('div', orderStatus(params.row.status))
          },
        }, {
          title: '下单方式',
          key: 'orderType',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.orderType === 1 ? '客户' : '代开';
            return h('div', str)
          },
        }, {
          title: '备注',
          key: 'remark',
          minWidth: 150
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 120
        }, {
          title: '最近操作时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
          minWidth: 140
        }, {
          title: '操作',
          key: 'action',
          minWidth: 190,
          fixed: 'right',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }]
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          id: this.pageApi.id,
          customerName: this.pageApi.customerName,
          startCreateTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endCreateTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          startUpdateTime: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          endUpdateTime: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          amountMin: this.pageApi.amountMin,
          amountMax: this.pageApi.amountMax,
          realAmountMin: this.pageApi.realAmountMin,
          realAmountMax: this.pageApi.realAmountMax,
          status: this.pageApi.status,
          orderType: this.pageApi.orderType,
          updateUser: this.pageApi.updateUser
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.pageIndex == oldVal.pageIndex)
            this.pageApi.pageIndex = 1;
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      getList(params) {
        this.$http.post(this.$api.orderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          id: '',
          customerName: '',
          startCreateTime: '',
          endCreateTime: '',
          amountMin: '',
          amountMax: '',
          realAmountMin: '',
          realAmountMax: '',
          status: '',
          orderType: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: ''
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      getItem(item) {
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
      },
      cancelOrder(item) {
        this.detailItem = Object.assign({}, item)
        this.cancelShow = true;
      },
      detail(item) {
        this.show = true;
        this.getItem(item);
      },
      /// 提交取消订单
      cancelSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.cancelApi);
            params.id = this.detailItem.id;
            this.$http.post(this.$api.orderCancel, params).then(res => {
              if (res.code === 1000) {
                this.cancelShow = false;
                this.getList(this.pageFilter);
                this.$Message.success('取消成功');
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('原因不能为空')
          }
        })
      },
      //  取消取消订单
      cancelReset(name) {
        this.cancelApi.cancelReason = '';
        this.cancelShow = false,
          this.loading = false;
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getList(this.pageFilter);
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .split {
    display: inline-block;
    vertical-align: middle;
    width: 5px;
    height: 1px;
    margin: 0 4px;
    background-color: #e6e6e6;
  }
  
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