<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="销售利润报表">
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="订单编号：">
          <Input v-model="pageApi.orderId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="销售利润：">
          <InputNumber :min="0" v-model.number="pageApi.profitBegin" style="width: 95px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.profitEnd" style="width: 95px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="销售金额：">
          <InputNumber :min="0" v-model.number="pageApi.sellPriceBegin" style="width: 95px;" placeholder="请输入"></InputNumber>
          <span class="split"></span>
          <InputNumber :min="0" v-model.number="pageApi.sellPriceEnd" style="width: 95px;" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="下单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="all-money"><span>销售额：￥{{money.sale != '' ? money.sale : 0}}</span><span>销售成本：￥{{money.cost != '' ? money.cost : 0}}</span><span>销售利润：￥{{money.profit != '' ? money.profit : 0}}</span></div>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="5">订单编号</Col>
            <Col class-name="col" span="6">客户名称</Col>
            <Col class-name="col" span="3">下单日期</Col>
            <Col class-name="col" span="2">下单金额</Col>
            <Col class-name="col" span="2">销售金额</Col>
            <Col class-name="col" span="2">销售成本</Col>
            <Col class-name="col" span="2">销售利润</Col>
            <Col class-name="col" span="2">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="5">{{item.id}}</Col>
            <Col class-name="col" span="6">{{item.customerName}}</Col>
            <Col class-name="col" span="3">{{item.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col class-name="col" span="2">￥{{item.amount}}</Col>
            <Col class-name="col" span="2">￥{{item.realAmount}}</Col>
            <Col class-name="col" span="2">￥{{item.cost}}</Col>
            <Col class-name="col" span="2">￥{{item.profit}}</Col>
            <Col class-name="col" span="2">
            <Button type="primary" size="small" @click="details(item)">查看明细</Button>
            </Col>
          </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
      <div class="order-detail" v-if="detailItem.order">
        <div class="order-detail-title">
          <span>基本信息</span>
        </div>
        <div class="order-detail-main">
          <Row class="order-row">
            <Col span="8" class="order-row-col">订单单号：{{detailItem.order.id}}</Col>
            <Col span="8" class="order-row-col">下单日期：{{detailItem.order.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col span="8" class="order-row-col">下单金额：￥{{detailItem.order.amount}}</Col>
            <Col span="8" class="order-row-col">销售金额：￥{{detailItem.order.realAmount}}</Col>
            <Col span="8" class="order-row-col">销售成本：￥{{detailItem.order.cost}}</Col>
            <Col span="8" class="order-row-col">销售利润：￥{{detailItem.order.profit}}</Col>
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
                  <Col class-name="col" span="3">产品名称</Col>
                  <Col class-name="col" span="2">单价</Col>
                  <Col class-name="col" span="2">下单数量</Col>
                  <Col class-name="col" span="3">下单金额小计</Col>
                  <Col class-name="col" span="2" >实单单价</Col>
                  <Col class-name="col" span="3" >实单数量</Col>
                  <Col class-name="col" span="3" >销售金额小计</Col>
                  <Col class-name="col" span="3" >销售成本小计</Col>
                  <Col class-name="col" span="3" >销售利润小计</Col>
                </Row>
                <Row v-for="(item,index) in detailItem.orderItem" :key="index">
                  <Col class-name="col" span="3">{{item.productName}}</Col>
                  <Col class-name="col" span="2">{{item.price}}元/{{item.unit}}</Col>
                  <Col class-name="col" span="2">{{item.num}}{{item.unit}}</Col>
                  <Col class-name="col" span="3">{{item.totalPrice}}</Col>
                  <Col class-name="col" span="2" >{{item.realPrice}}元/{{item.unit}}</Col>
                  <Col class-name="col" span="3" >{{item.realNum}}{{item.unit}}</Col>
                  <Col class-name="col" span="3" >{{item.realTotalPrice}}元</Col>
                  <Col class-name="col" span="3" >{{item.totalCost}}元</Col>
                  <Col class-name="col" span="3" >{{item.totalProfit}}元</Col>
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
              <Row v-for="(item,index) in detailItem.order.orderFees">
                <Col class-name="col" span="4">{{item.feeName}}</Col>
                <Col class-name="col" span="4">￥{{item.feeAmount}}</Col>
                <Col class-name="col" span="4">{{item.totalNum}}</Col>
                <Col class-name="col" span="4">￥{{item.totalAmount}}</Col>
                <Col class-name="col" span="4">{{item.currentNum}}</Col>
                <Col class-name="col" span="4">{{item.totalAmount}}</Col>
              </Row>
        </div></div></div></div></div>
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
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          orderId: '',
          customerName: '',
          createOrderTimeBegin: '',
          createOrderTimeEnd: '',
          sellPriceBegin: null,
          sellPriceEnd: null,
          profitBegin: null,
          profitEnd: null,
          pageIndex: 1,
          pageSize: 10
        },
        dateValue: ['', ''],
        list: [],
        totalCount: 0,
        logList: [],
        money: {
          sale: 0,
          cost: 0,
          profit: 0,
        },
        show: false,
        detailItem: {}
      }
    },
    computed: {
      pageFilter() {
        return {
          orderId: this.pageApi.orderId,
          customerName: this.pageApi.customerName,
          createOrderTimeBegin: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          createOrderTimeEnd: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          sellPriceBegin: this.pageApi.sellPriceBegin,
          sellPriceEnd: this.pageApi.sellPriceEnd,
          profitBegin: this.pageApi.profitBegin,
          profitEnd: this.pageApi.profitEnd,
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
          createOrderTimeBegin: '',
          createOrderTimeEnd: '',
          sellPriceBegin: null,
          sellPriceEnd: null,
          profitBegin: null,
          profitEnd: null,
          pageIndex: 1,
          pageSize: 10
        }
        this.dateValue = ['', '']
      },
      getList(params) {
        this.$http.post(this.$api.orderProfit, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.page.data;
            this.totalCount = res.data.page.totalCount;
            this.money.sale = res.data.totalRealAmount;
            this.money.cost = res.data.totalCost;
            this.money.profit = res.data.totalProfit;
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      details(item) {
        this.show = true;
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
        this.getLog(item);
      },
      getLog(item) {
        this.$http.post(this.$api.orderFeeHistory, {
          orderId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.logList = res.data;
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .all-money {
    margin-bottom: 15px;
    font-size: 14px;
    span {
      display: inline-block;
      margin-right: 30px;
    }
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
    .Tooltip {
    word-break: break-all;
    white-space: normal;
  }
</style>