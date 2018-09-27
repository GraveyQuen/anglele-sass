<template>
  <div class="page-inner">
    <Card :bordered="true" class="card" dis-hover :title="this.old ? '历史订单':'进行中'">
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
                              <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 4" @click="overOrder(props.row)">完成订单</Button>
                              <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看订单</Button>
                              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" @click="confirm(props.row)">确认订单</Button>
                              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2 || props.row.status === 3 || props.row.status === 4" @click="cancelOrder(props.row)">取消订单</Button>
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
        </div>
        <div class="order-detail-main">
          <Row class="order-row">
            <Col span="8" class="order-row-col">客户名称：{{detailItem.order.customerName}}</Col>
            <Col span="8" class="order-row-col">订单单号：{{detailItem.order.id}}</Col>
            <Col span="8" class="order-row-col">下单金额：￥{{detailItem.order.amount}}</Col>
            <Col span="8" class="order-row-col">订单状态：{{detailItem.order.status | orderStatus}}</Col>
            <Col span="8" class="order-row-col">下单日期：{{detailItem.order.createTime | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="8" class="order-row-col">客户联系人：{{detailItem.order.contactPeople}}</Col>
            <Col span="8" class="order-row-col">客户联系方式：{{detailItem.order.contactPhone}}</Col>
            <Col span="8" class="order-row-col">{{detailItem.order.realAmount != '' ? `实单金额：￥${detailItem.order.realAmount}`:''}}</Col>
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
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">实单金额</Col>
              </Row>
              <Row v-for="(item,index) in detailItem.orderItem" :key="index">
                <Col class-name="col" span="4">{{item.productName}}</Col>
                <Col class-name="col" span="4">{{item.price}}元/{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">{{item.num}}{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8">￥{{item.totalPrice}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">{{item.realNum}}{{item.unit}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.order.status === 5">￥{{item.realTotalPrice}}</Col>
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
    <Modal title="完成订单" width="800" v-model="overShow" :mask-closable="false">
      <div class="">请仔细核对订单中的产品实际销售数量后进行确认</div>
      <Table ref="overTable" border :columns="goodsHeader" :data="overApi.outItems" style="width: 100%;">
        <!-- 实单数量 -->
<template slot="realNum" slot-scope="props">
  <Form :ref="'formRow'+props.idx" :model="props.row">
    <FormItem prop="realNum" :rules="{required: true, message: '请输入数量', trigger: 'blur', type: 'number'}">
      <Input v-model.number="props.row.realNum" size="small" placeholder="请输入" style="width:60px;"></Input>{{props.row.unit}}
    </FormItem>
  </Form>
</template>
      </Table>
      <div slot="footer">
        <Button type="primary" @click="overSubmit" :loading="loading">保存</Button>
        <Button @click="overReset">取消</Button>
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
    props: {
      old: {
        type: Boolean,
        default: false
      }
    },
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
          endUpdateTime: '',
          finishStatus: this.old ? 1 : 0
        },
        detailItem: {},
        cancelShow: false,
        overShow: false,
        act: false, // 更新渲染
        overApi: {
          id: '',
          outItems: []
        },
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
        orderStatus: [],
        dateValue: ['', ''],
        dateValue2: ['', ''],
        list: [],
        totalCount: 0,
        show: false,
        formRow: {},
        goodsHeader: [{
          title: '产品名称',
          key: 'productName',
          maxWidth: 150
        }, {
          title: '所属分类',
          key: 'productCategory',
          maxWidth: 150
        }, {
          title: '单价',
          key: 'price',
          maxWidth: 150,
          render: (h, params) => {
            let str = `${params.row.price}/${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '下单数量',
          key: 'num',
          maxWidth: 150,
          render: (h, params) => {
            let str = `${params.row.num}${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '实单数量',
          key: 'realNum',
          maxWidth: 140,
          render: (h, params) => {
            this.overApi.outItems[params.index] = params.row
            return h(
              'div',
              this.$refs.overTable.$scopedSlots.realNum({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '金额',
          key: 'totalPrice',
          maxWidth: 150,
          render: (h, params) => {
            let str = `￥${params.row.totalPrice}`;
            return h('div', str)
          }
        }],
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
          title: '最近更新时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
          minWidth: 140
        }, {
          title: '操作',
          key: 'action',
          minWidth: 260,
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
          updateUser: this.pageApi.updateUser,
          finishStatus: this.old ? 1 : 0
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
          endUpdateTime: '',
          finishStatus: this.old ? 1 : 0
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      getItem(item, key) {
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data);
            if (key === 'over') { //完成订单
              res.data.orderItem.map(el => {
                el.realNum = el.num;
              })
              this.overApi.outItems = [...this.detailItem.orderItem]
            }
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
      },
      //  确认订单      
      confirm(item) {
        this.getItem(item, 'confirm')
      },
      // 完成订单
      overOrder(item) {
        this.getItem(item, 'over')
        this.overShow = true;
        this.overApi.id = item.id;
      },
      // 确认完成订单
      overSubmit() {
        this.loading = true;
        let params = this.$clearData(this.overApi);
        params.outItems = JSON.stringify(params.outItems)
        this.$http.post(this.$api.wareHouseOutfinishOut, params).then(res => {
          if (res.code === 1000) {
            this.overShow = false;
            this.$Message.success('确认成功')
            this.getList(this.pageFilter)
          } else {
            this.$Message.error(res.message)
          }
          this.loading = false;
        })
      },
      overReset() {
        this.overShow = false;
      }
    },
    created() {
      this.getList(this.pageFilter);
      if (this.old) {
        this.orderStatus = [{
            value: 5,
            name: '已完成'
          },
          {
            value: 9,
            name: '已取消'
          }
        ]
      } else {
        this.orderStatus = [{
          value: 1,
          name: '已下单'
        }, {
          value: 2,
          name: '已确认'
        }, {
          value: 3,
          name: '配货中'
        }, {
          value: 4,
          name: '配送中'
        }]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.act = !this.act;
      })
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .card{
    margin-top: -17px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
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