<template>
  <div class="page-inner">
    <Card :bordered="true" class="card" dis-hover :title="this.old ? '历史订单':'进行中'">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="产品名称：">
          <Input v-model="pageApi.productName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="订单金额：">
          <InputNumber :min="0" v-model.number="pageApi.amountMin" style="width: 93px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.amountMax" style="width: 93px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="实单金额：">
          <InputNumber :min="0" v-model.number="pageApi.realAmountMin" style="width: 93px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.realAmountMax" style="width: 93px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="下单方式：">
          <Select v-model="pageApi.orderType" style="width: 200px;">
                          <Option v-for="(item,index) in [{value: 1,name:'客户下单'},{value: 2,name: '代客下单'}]" :value="item.value" :key="index">{{ item.name }}</Option>
                        </Select>
        </FormItem>
        <FormItem label="是否有其他费用：">
          <Select v-model="pageApi.hasFee" style="width: 200px;">
                          <Option v-for="(item,index) in [{value: 0,name:'无回收费用'},{value: 1,name: '未回收完成'},{value: 2,name: '回收完成'}]" :value="item.value" :key="index">{{ item.name }}</Option>
                        </Select>
        </FormItem>
        <FormItem label="配送人：">
          <Select v-model="pageApi.deliveryManId" style="width: 200px;">
                          <Option v-for="(item,index) in deliveryList" :value="item.id" :key="index">{{ item.name }}</Option>
                        </Select>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
              <Option v-for="(item,index) in orderStatus" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="下单日期：">
          <DatePicker type="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-start" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click="resetFilter">清除筛选</Button>
        </FormItem>
        <FormItem>
          <Button type="warning" v-show="old && pageApi.status === 5" @click="exportExcel">导出</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="orderTable" :columns="tableHeader" border :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                  <!-- <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 4" @click="overOrder(props.row)">完成订单</Button> -->
                  <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看订单</Button>
                  <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" @click="confirm(props.row)">确认订单</Button>
                  <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2 || props.row.status === 3 || props.row.status === 4" @click="cancelOrder(props.row)">取消订单</Button>
                  <Button type="info" size="small" v-if="props.row.status === 5 && props.row.settlementStatus === 0 && props.row.hasRefund === 0" @click="returnBill(props.row)">退货</Button>
                  <Button type="info" size="small" v-if="props.row.status === 5 && props.row.settlementStatus === 0 && props.row.hasRefund === ''" @click="returnBill(props.row)">退货</Button>
                  <Button type="info" size="small" v-if="props.row.status === 5 && props.row.settlementStatus === 0 && props.row.hasRefund === 1" @click="edit(props.row)">编辑退货</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="取消订单" width="500" v-model="cancelShow" :mask-closable="false" @on-cancel="cancelReset('formCancel')">
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
    <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
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
            <Col span="8" class="order-row-col">下单日期：{{detailItem.order.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="8" class="order-row-col">客户联系人：{{detailItem.order.contactPeople}}</Col>
            <Col span="8" class="order-row-col">客户联系方式：{{detailItem.order.contactPhone}}</Col>
            <Col span="8" class="order-row-col">{{detailItem.order.realAmount != '' ? `实单金额：￥${detailItem.order.realAmount}`:''}}</Col>
            <Col span="8" class="order-row-col">配送人：{{detailItem.order.deliveryManName}}</Col>
          </Row>
          <Row class="order-row">
            <Col span="8" class="order-row-col">送货地址：{{detailItem.order.address}}</Col>
            <Col span="8" class="order-row-col">备注：{{detailItem.order.remark != '' ? detailItem.order.remark : '暂无'}}</Col>
            <Col span="8" class="order-row-col" v-show="detailItem.order.status === 9">取消备注：{{detailItem.order.cancelReason}}</Col>
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
                <Col class-name="col" :span="detailItem.order.status === 5 ? 3 : 8">下单金额小计</Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5">实单数量</Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5">实单单价</Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5">实单金额</Col>
              </Row>
              <Row v-for="(item,index) in detailItem.orderItem" :key="index">
                <Col class-name="col" span="4">{{item.productName}}</Col>
                <Col class-name="col" span="4">{{item.price}}元/{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 4 : 8" style="height: auto;overflow: inherit;">
                {{item.num}}{{item.unit}}
                <Tooltip placement="top" v-if="detailItem.order.status != 1">
                    <Button size="small">明细</Button>
                    <div slot="content">
                  <div class="Tooltip" v-for="(sub,idx) in item.wareHouseOutItems" :key="idx">{{sub.wareHouseName}}：{{sub.num}}{{sub.unit}}</div>
                    </div>
                </Tooltip>
                </Col>
                <Col class-name="col" :span="detailItem.order.status === 5 ? 3 : 8">￥{{item.totalPrice}}</Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5" style="height: auto;overflow: inherit;">
                {{item.realNum}}{{item.unit}}
                <Tooltip placement="top">
                    <Button size="small">明细</Button>
                    <div slot="content">
                      <div class="Tooltip" >
                        <div v-for="(sub,subIdx) in item.wareHouseOutItems" :key="subIdx">{{sub.wareHouseName}}：{{sub.realNum}}{{sub.unit}}</div>
                        <div v-for="refund in item.refundOrderItems" :key="refund.id">{{refund.wareHouseName}}：退货数量{{refund.refundNum}}{{item.unit}}</div>
                      </div>
                    </div>
                </Tooltip>
                </Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5">{{item.realPrice}}元/{{item.unit}}</Col>
                <Col class-name="col" span="3" v-if="detailItem.order.status === 5">￥{{item.realTotalPrice}}</Col>
              </Row>
            </div>
          </div>
          </div>
        </div>
        <div class="logList" v-if="detailItem.order.status === 5">
         <div class="order-detail-title">
          <span>其他费用</span>
        </div>
        <div class="order-detail-main">
        <div class="page-inner">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="4">费用名称</Col>
                <Col class-name="col" span="4">单价</Col>
                <Col class-name="col" span="4">数量</Col>
                <Col class-name="col" span="4">金额</Col>
                <Col class-name="col" span="4">待回收数量</Col>
                <Col class-name="col" span="4">待回收金额</Col>
              </Row>
              <Row v-for="(item,index) in detailItem.order.orderFees" :key="index">
                <Col class-name="col" span="4">{{item.feeName}}</Col>
                <Col class-name="col" span="4">￥{{item.feeAmount}}</Col>
                <Col class-name="col" span="4">{{item.totalNum}}</Col>
                <Col class-name="col" span="4">￥{{item.feeTotalAmount}}</Col>
                <Col class-name="col" span="4">{{item.currentNum}}</Col>
                <Col class-name="col" span="4">￥{{item.totalAmount}}</Col>
              </Row>
              <Row v-if="detailItem.order.orderFees.length == 0">
                <Col class-name="col" span="24">暂无其他费用</Col>
              </Row>
        </div></div></div></div></div>
        <div class="logList" v-if="detailItem.order.status === 5">
         <div class="order-detail-title">
          <span>历史其他费用明细</span>
        </div>
        <div class="order-detail-main">
        <div class="page-inner">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="3">费用名称</Col>
                <Col class-name="col" span="2">单价</Col>
                <Col class-name="col" span="2">数量</Col>
                <Col class-name="col" span="2">金额</Col>
                <Col class-name="col" span="2">回收数量</Col>
                <Col class-name="col" span="2">回收金额</Col>
                <Col class-name="col" span="2">剩余金额</Col>
                <Col class-name="col" span="3">备注</Col>
                <Col class-name="col" span="3">操作人</Col>
                <Col class-name="col" span="3">操作时间</Col>
              </Row>
              <Row v-for="(item,index) in logList" :key="index">
                <Col class-name="col" span="3">{{item.feeName}}</Col>
                <Col class-name="col" span="2">￥{{item.feeAmount}}</Col>
                <Col class-name="col" span="2">{{item.totalNum}}</Col>
                <Col class-name="col" span="2">￥{{item.feeTotalAmount}}</Col>
                <Col class-name="col" span="2">{{item.changeNum}}</Col>
                <Col class-name="col" span="2">￥{{item.changeAmount}}</Col>
                <Col class-name="col" span="2">￥{{item.totalAmount}}</Col>
                <Col class-name="col" span="3" :style="item.remark != '' ? 'height: auto;overflow: inherit;':''">
                <Tooltip placement="top" v-show="item.remark != ''">
                    <Button size="small">查看备注</Button>
                    <div slot="content">
                        <div class="Tooltip">{{item.remark}}</div>
                    </div>
                </Tooltip>
                </Col>
                <Col class-name="col" span="3">{{item.updateUser}}</Col>
                <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
              </Row>
              <Row v-if="logList.length == 0">
                <Col class-name="col" span="24">暂无历史费用</Col>
              </Row>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
    <!-- 多仓确认订单分仓出库 -->
    <Modal title="确认订单" width="800" v-model="checkOrderShow" :mask-closable="false">
      <p class="check-warm">因检测到产品存在多个仓库，故需要进行分仓出库</p>
      <Table ref="checkOrderTable" disabled-hover border :columns="checkOrderHeader" :data="checkOrderApi.items" >
      <!-- 实单数量 -->
      <template slot="wareHouseNum" slot-scope="props">
        <div v-for="(item,index) in props.row.wareHouseNum">
          {{item.wareHouseName}}：{{item.num}}{{item.unit}}
        </div>
      </template>
      <!-- 实单单价 -->
      <template slot="wareHouseProducts" slot-scope="props">
        <div v-for="(item,index) in props.row.wareHouseProducts" class="checkNum-item">
          {{item.wareHouseName}}：
          <InputNumber :min="0" :disabled="item.disabledCheckNum" @on-change="checkNumChange(index,$event)" @on-blur="checkNumBlur(props.row,index)" v-model.number="item.checkNum" size="small" style="width:80px;"></InputNumber>{{props.row.unit}}
        </div>
      </template>
        </Table>
        <div slot="footer">
          <Button type="primary" @click="saveCheckOrder" :loading="loading">保存</Button>
          <Button @click="cancelCheckOrder">取消</Button>
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
          amountMin: null,
          amountMax: null,
          realAmountMin: null,
          realAmountMax: null,
          status: '',
          orderType: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: '',
          finishStatus: this.old ? 1 : 0,
          deliveryManId: '',
          hasFee: '',
          productName: ''
        },
        detailItem: {},
        cancelShow: false,
        act: false, // 更新渲染
        logList: [],
        overApi: {
          id: '',
          outItems: [],
          orderFees: []
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
        feeList: [],
        feeIndex: 1,
        totalCount: 0,
        show: false,
        warmProductName: '',
        deliveryList: [],
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
          key: 'newOrderDate',
          render: (h, params) => {
            return h('div', dateformat(params.row.newOrderDate, 'yyyy-MM-dd'))
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
          title: '退货状态',
          key: 'hasRefund',
          minWidth: 120,
          render: (h, params) => {
            const hasRefund = params.row.hasRefund;
            if (hasRefund === 1) {
              return h('div', '暂存')
            } else if (hasRefund === 2) {
              return h('div', '退货完成')
            } else {
              return h('div', '无退货')
            }
          },
        }, {
          title: '结算状态',
          key: 'settlementStatus',
          minWidth: 120,
          render: (h, params) => {
            const settlementStatus = params.row.settlementStatus;
            if (settlementStatus === 0) {
              return h('div', '未结算')
            } else if (settlementStatus === 1) {
              return h('div', '预结算')
            } else {
              return h('div', '已结算')
            }
          },
        }, {
          title: '下单方式',
          key: 'orderType',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.orderType === 1 ? '客户下单' : '代客下单';
            return h('div', str)
          },
        }, {
          title: '是否有其他费用',
          key: 'hasFee',
          minWidth: 140,
          render: (h, params) => {
            let str = params.row.hasFee;
            if (str === 0) {
              return h('div', '无回收费用')
            } else if (str === 1) {
              return h('div', '未回收完成')
            } else {
              return h('div', '回收完成')
            }
          },
        }, {
          title: '配送人',
          key: 'deliveryManName',
          minWidth: 150
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
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }],
        orderTotalPrice: 0,
        checkOrderItem: {}, // 多仓产品需要确认订单
        checkOrderShow: false,
        checkOrderApi: {
          id: '',
          items: []
        },
        checkOrderHeader: [{
          title: '产品名称',
          key: 'productName'
        }, {
          title: '产品分类',
          key: 'productCategory'
        }, {
          title: '订单数量',
          key: 'num',
          render: (h, params) => {
            const str = `${params.row.num}${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '现有库存',
          key: 'wareHouseNum',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.checkOrderTable.$scopedSlots.wareHouseNum({
                row: params.row
              })
            )
          }
        }, {
          title: '分仓出库',
          key: 'wareHouseProducts',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.checkOrderTable.$scopedSlots.wareHouseProducts({
                row: params.row
              })
            )
          }
        }],
        currentNum: 0,
        currentIndex: 0,
        exportApi: {
          startCreateTime: '',
          endCreateTime: '',
          deliveryManId: ''
        }
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
          finishStatus: this.old ? 1 : 0,
          deliveryManId: this.pageApi.deliveryManId,
          hasFee: this.pageApi.hasFee,
          productName: this.pageApi.productName
        }
      },
      getId() {
        return this.$route.query.orderStatus;
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
          amountMin: null,
          amountMax: null,
          realAmountMin: null,
          realAmountMax: null,
          status: '',
          orderType: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: '',
          finishStatus: this.old ? 1 : 0,
          deliveryManId: '',
          hasFee: '',
          productName: ''
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size) {
        this.pageApi.pageSize = size;
      },
      getItem(item, key) {
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data);
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
        this.getLog(item)
      },
      //  其他费用
      getLog(item) {
        if (item.hasFee != 0) {
          this.$http.post(this.$api.orderFeeHistory, {
            orderId: item.id
          }).then(res => {
            if (res.code === 1000) {
              this.logList = res.data;
            }
          })
        } else {
          this.logList = [];
        }
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
                this.cancelReset('formCancel');
                this.getList(this.pageFilter);
                this.$Message.success('取消成功');
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('原因不能为空')
          }
        })
      },
      //  取消订单
      cancelReset(name) {
        this.cancelApi.cancelReason = '';
        this.cancelShow = false,
          this.loading = false;
        this.$refs[name].resetFields();
      },
      //  确认订单      
      confirm(item) {
        this.$http.post(this.$api.findCheckOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            res.data.orderItems.map(el => {
              el.wareHouseNum = el.wareHouseProducts
              //  不是多个库存添加disable
              if (el.wareHouseProducts.length === 1) {
                el.wareHouseProducts.map(sub => {
                  sub.disabledCheckNum = true;
                })
              } else {
                el.wareHouseProducts.map(sub => {
                  sub.disabledCheckNum = false;
                })
              }
            })
            this.checkOrderItem = Object.assign({}, res.data);
            this.checkOrderApi.id = res.data.id;
            this.checkOrderApi.items = res.data.orderItems;
          }
        })
        this.checkOrderShow = true;
      },
      // 取消确认订单
      cancelCheckOrder() {
        this.checkOrderShow = false
      },
      //  检测出库数量
      checkNumOk() {
        let isOk = true;
        this.checkOrderApi.items.map(el => {
          let total = 0;
          el.wareHouseProducts.map(sub => {
            total += sub.checkNum;
          })
          if (el.num != total) {
            this.warmProductName = el.productName;
            isOk = false
          }
        })
        return isOk
      },
      //  保存确认订单
      saveCheckOrder() {
        if (this.checkNumOk()) {
          const params = this.$clearData(this.checkOrderApi);
          params.items = JSON.stringify(params.items)
          this.$http.post(this.$api.checkOrder, params).then(res => {
            if (res.code === 1000) {
              this.getList(this.pageFilter);
              this.$Message.success('订单确认成功');
              this.checkOrderShow = false;
            } else {
              this.$Message.error(res.message);
            }
          })
        } else {
          this.$Message.error(`${this.warmProductName}分仓数量与下单数量不相等`)
        }
      },
      getDelivery() {
        this.$http.post(this.$api.findAllDeliveryMan, {
          manType: 1
        }).then(res => {
          if (res.code === 1000) {
            this.deliveryList = res.data;
          }
        })
      },
      //  赋值当前输入的分仓出库数量
      checkNumBlur(item, itemIndex) {
        if (itemIndex === this.currentIndex) {
          this.checkOrderApi.items.map((el, index) => {
            if (el.id === item.id) {
              this.checkOrderApi.items[index].wareHouseProducts[itemIndex].checkNum = this.currentNum;
            }
          })
        }
      },
      checkNumChange(index, data) {
        this.currentIndex = index;
        this.currentNum = data;
      },
      // 重置其他费用不可选
      clearFee() {
        this.feeList.map(el => {
          el.disabled = false;
        })
      },
      getFee() {
        this.$http.post(this.$api.findAllFee).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data.map(el => {
              el.disabled = false;
              return el;
            });
          }
        })
      },
      //   新增退货单
      returnBill(item) {
        this.$router.push({
          name: 'returnBillAdd',
          query: {
            id: item.id
          }
        })
      },
      //  编辑退货单
      edit(item) {
        this.$router.push({
          name: 'returnBillEdit',
          query: {
            id: item.id
          }
        })
      },
      // 导出
      exportExcel() {
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
              h('div', '正在生成导出订单...')
            ])
          }
        });
        let params = this.$clearData(this.exportApi);
        params.startCreateTime = this.dateValue[0] != '' ? this.dateValue[0].getTime() : '';
        params.endCreateTime = this.dateValue[1] != '' ? this.dateValue[1].getTime() : '';
        params.deliveryManId = this.pageApi.deliveryManId;
        this.$http.post(this.$api.exportOrderExcel, params).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
          }else{
            this.$Message.error(res.message)
          }
          this.$Spin.hide();
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getDelivery();
      this.getFee();
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
  
      // 订单状态
      if (this.getId) {
        this.pageApi.status = this.getId;
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
  @deep: ~'>>>';
  .order-ok-header,
  .check-warm {
    margin-bottom: 15px;
    color: #ed4014;
  }
  
  .card {
    margin-top: -17px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    min-height: 600px;
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
  
  .add-fee {
    padding-top: 20px;
  }
  
  .price-total {
    padding-top: 20px;
    text-align: right;
    span {
      display: inline-block;
      color: #ed4014;
    }
  }
  
  .Tooltip {
    width: atuo;
    min-width: 100px;
    word-break: break-all;
    white-space: normal;
  }
  
  .checkNum-item {
    margin: 10px 0;
    @{deep} .ivu-input-number-handler-wrap {
      display: none;
    }
  }
</style>