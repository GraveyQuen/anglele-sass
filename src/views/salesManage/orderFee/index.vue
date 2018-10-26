<template>
  <div class="page-inner">
    <Card :bordered="true" class="card" dis-hover title="订单回收管理">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.orderId" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="订单金额：">
          <InputNumber :min="0" v-model.number="pageApi.amountBegin" style="width: 93px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.amountEnd" style="width: 93px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="实单金额：">
          <InputNumber :min="0" v-model.number="pageApi.realAmountBegin" style="width: 93px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.realAmountEnd" style="width: 93px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="费用名称：">
          <Select v-model="pageApi.feeId" style="width: 200px;">
                                <Option v-for="(option,i) in feeList" :value="option.id" :key="option.id">{{ option.feeName }}</Option>
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
          <template slot="orderFees" slot-scope="props">
                      <div>
                        <span class="fee" v-for="(fee,i) in props.row.orderFees" :key="i">{{`${fee.feeName},${fee.currentNum},￥${fee.totalAmount}`}}</span>
                      </div>
</template>
              <!-- 操作 -->
<template slot="action" slot-scope="props">
  <Button type="warning" size="small" @click="details(props.row)">费用回收</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
        <Modal title="订单详情" width="900" v-model="show" :mask-closable="false">
      <div class="order-detail" v-if="detailItem.customerName">
        <div class="order-detail-title">
          <span>基本信息</span>
        </div>
        <div class="order-detail-main">
          <Row class="order-row">
            <Col span="8" class="order-row-col">客户名称：{{detailItem.customerName}}</Col>
            <Col span="8" class="order-row-col">订单单号：{{detailItem.id}}</Col>
            <Col span="8" class="order-row-col">下单金额：￥{{detailItem.amount}}</Col>
            <Col span="8" class="order-row-col">订单状态：{{detailItem.status | orderStatus}}</Col>
            <Col span="8" class="order-row-col">下单日期：{{detailItem.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="8" class="order-row-col">客户联系人：{{detailItem.contactPeople}}</Col>
            <Col span="8" class="order-row-col">客户联系方式：{{detailItem.contactPhone}}</Col>
            <Col span="8" class="order-row-col">{{detailItem.realAmount != '' ? `实单金额：￥${detailItem.realAmount}`:''}}</Col>
            <Col span="8" class="order-row-col">配送人：{{detailItem.deliveryMan.name}}</Col>
          </Row>
          <Row class="order-row">
            <Col span="10" class="order-row-col">送货地址：{{detailItem.address}}</Col>
            <Col span="4" class="order-row-col">备注：{{detailItem.remark}}</Col>
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
                <Col class-name="col" :span="detailItem.status === 5 ? 4 : 8">下单数量</Col>
                <Col class-name="col" :span="detailItem.status === 5 ? 4 : 8">下单金额小计</Col>
                <Col class-name="col" span="4" v-if="detailItem.status === 5">实单数量</Col>
                <Col class-name="col" span="4" v-if="detailItem.status === 5">实单金额</Col>
              </Row>
              <Row v-for="(item,index) in detailItem.orderItems" :key="index">
                <Col class-name="col" span="4">{{item.productName}}</Col>
                <Col class-name="col" span="4">{{item.price}}元/{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.status === 5 ? 4 : 8">{{item.num}}{{item.unit}}</Col>
                <Col class-name="col" :span="detailItem.status === 5 ? 4 : 8">￥{{item.totalPrice}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.status === 5">{{item.realNum}}{{item.unit}}</Col>
                <Col class-name="col" span="4" v-if="detailItem.status === 5">￥{{item.realTotalPrice}}</Col>
              </Row>
            </div>
          </div>
          </div>
        </div>
         <div class="order-detail-title">
          <span>其他费用明细</span>
        </div>
        <div class="order-detail-main">
        <div class="page-inner">
        <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">费用名称</Col>
            <Col class-name="col" span="3">金额</Col>
            <Col class-name="col" span="3">数量</Col>
            <Col class-name="col" span="3">总金额</Col>
            <Col class-name="col" span="3">回收数量</Col>
            <Col class-name="col" span="4">回收金额</Col>
            <Col class-name="col" span="4">备注</Col>
          </Row>
          <Row v-for="(item,index) in feeApi.changeFees" :key="index">
            <Col class-name="col" span="4" style="height: auto;overflow: inherit;">
            {{item.feeName}}
            </Col>
            <Col class-name="col" span="3">
            {{item.feeAmount}}
            </Col>
            <Col class-name="col" span="3">
            {{item.currentNum}}
            </Col>
            <Col class-name="col" span="3">
            {{item.totalAmount}}
            </Col>
            <Col class-name="col" span="3">
              <InputNumber :min="1" :max="item.currentNum" @on-change="numChange(index,$event)" v-model.number="item.changeNum" size="small" style="width:80px;"></InputNumber>
            </Col>
            <Col class-name="col" span="4">
              <InputNumber :min="0" :max="item.totalAmount" v-model.number="item.changeAmount" size="small" style="width:80px;"></InputNumber>
            </Col>
            <Col class-name="col" span="4">
            <Input v-model="item.remark" placeholder="请输入" size="small"></Input>
            </Col>
          </Row>
          </Row>
          <Row v-if="feeApi.changeFees.length == 0">
            <Col class-name="col" span="24">暂无费用</Col>
          </Row>
        </div>
      </div>
      </div>
        </div>
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
                <Col class-name="col" span="2">￥{{item.totalAmount}}</Col>
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
      <div slot="footer">
          <Button type="primary" @click="submit" :loading="loading">保存</Button>
        <Button @click="show = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        list: [],
        pageApi: {
          orderId: '',
          customerName: '',
          orderDateBegin: '',
          orderDateEnd: '',
          amountBegin: null,
          amountEnd: null,
          realAmountBegin: null,
          realAmountEnd: null,
          feeId: '',
          updateUser: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        },
        detailItem: {},
        totalCount: 0,
        dateValue: ['', ''],
        dateValue2: ['', ''],
        feeList: [],
        show: false,
        tableHeader: [{
          title: '订单编号',
          key: 'id',
          minWidth: 120
        }, {
          title: '客户名称',
          key: 'customerName'
        }, {
          title: '下单日期',
          key: 'newOrderDate',
          key: 'newOrderDate',
          render: (h, params) => {
            return h('div', dateformat(params.row.newOrderDate, 'yyyy-MM-dd'))
          }
        }, {
          title: '下单金额',
          key: 'amount',
          render: (h, params) => {
            let str = `￥${params.row.amount}`;
            return h('div', str)
          }
        }, {
          title: '实单金额',
          key: 'realAmount',
          render: (h, params) => {
            let str = `￥${params.row.realAmount}`;
            return h('div', str)
          }
        }, {
          title: '费用金额',
          key: 'feeAmount',
          render: (h, params) => {
            let str = `￥${params.row.feeAmount}`;
            return h('div', str)
          }
        }, {
          title: '待回收费用明细',
          key: 'orderFees',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.orderFees({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '最近更新人',
          key: 'updateUser'
        }, {
          title: '最近更新时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
        }, {
          title: '操作',
          key: 'action',
          maxWidth: 180,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }],
        feeApi: {
          orderId: '',
          changeFees: []
        },
        logList: [],
        loading: false
      }
    },
    computed: {
      pageFilter() {
        return {
          orderId: this.pageApi.orderId,
          customerName: this.pageApi.customerName,
          orderDateBegin: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          orderDateEnd: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          amountBegin: this.pageApi.amountBegin,
          amountEnd: this.pageApi.amountEnd,
          realAmountBegin: this.pageApi.realAmountBegin,
          realAmountEnd: this.pageApi.realAmountEnd,
          feeId: this.pageApi.feeId,
          updateUser: this.pageApi.updateUser,
          updateTimeBegin: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          updateTimeEnd: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize
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
      resetFilter() {
        this.pageApi = {
          orderId: '',
          customerName: '',
          orderDateBegin: '',
          orderDateEnd: '',
          amountBegin: null,
          amountEnd: null,
          realAmountBegin: null,
          realAmountEnd: null,
          feeId: '',
          updateUser: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          pageIndex: 1,
          pageSize: 10
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      getList(params) {
        this.$http.post(this.$api.orderFeePage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size) {
        this.pageApi.pageSize = size;
      },
      getFee() {
        this.$http.post(this.$api.findAllFee).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data;
          }
        })
      },
      details(item) {
        this.detailItem = Object.assign({}, item);
        this.show = true;
        const res = item.orderFees.map(el => {
          el.changeNum = el.currentNum;
          el.changeAmount = el.totalAmount;
          return el
        })
        this.feeApi.orderId = item.id;
        this.feeApi.changeFees = [...res]
        this.getLog(item.id)
      },
      getLog(id) {
        this.$http.post(this.$api.orderFeeHistory, {
          orderId: id
        }).then(res => {
          if (res.code === 1000) {
            this.logList = res.data;
          }
        })
      },
      numChange(idx, eve) {
        const amount = Number((this.feeApi.changeFees[idx].feeAmount * eve).toFixed(0));
        const item = this.feeApi.changeFees[idx];
        item.changeAmount = amount;
        this.$set(this.feeApi.changeFees, idx, Object.assign({}, item))
      },
      submit() {
        let params = this.$clearData(this.feeApi);
        params.changeFees = JSON.stringify(params.changeFees);
        console.log(params)
        this.loading = true;
        this.$http.post(this.$api.orderFeeChange, params).then(res => {
          if (res.code === 1000) {
            this.show = false;
            this.$Message.success('费用回收成功');
            this.getList(this.pageFilter)
          } else {
            this.$Message.error(res.message);
          }
          this.loading = false;
        })
      },
    },
    created() {
      this.getList(this.pageFilter)
      this.getFee();
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
  
  .fee {
    display: inline-block;
    padding: 0 8px;
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
  
  .Tooltip {
    word-break: break-all;
    white-space: normal;
  }
</style>