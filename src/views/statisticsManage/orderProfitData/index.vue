<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="仓库管理">
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="订单编号：">
          <Input v-model="pageApi.orderId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="销售利润：">
          <Input v-model="pageApi.profitBegin" style="width: 60px;" placeholder="请输入..."></Input>
          <span class="split"></span>
          <Input v-model="pageApi.profitEnd" style="width: 60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="销售金额：">
          <Input v-model="pageApi.sellPriceBegin" style="width: 60px;" placeholder="请输入..."></Input>
          <span class="split"></span>
          <Input v-model="pageApi.sellPriceEnd" style="width: 60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="下单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="all-money"><span>销售额：￥{{money.sale}}</span><span>销售成本：￥{{money.cost}}</span><span>销售利润：￥{{money.profit}}</span></div>
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
            <Col class-name="col" span="3">{{item.createTime | dateformat('yyyy-MM-dd')}}</Col>
            <Col class-name="col" span="2">￥{{item.amount}}</Col>
            <Col class-name="col" span="2">￥{{item.realAmount}}</Col>
            <Col class-name="col" span="2">￥{{item.amount}}</Col>
            <Col class-name="col" span="2">￥{{item.amount}}</Col>
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
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
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
          sellPriceBegin: '',
          sellPriceEnd: '',
          profitBegin: '',
          profitEnd: '',
          pageIndex: 1,
          pageSize: 10
        },
        dateValue: ['', ''],
        list: [],
        totalCount: 0,
        money: {
          sale: 0,
          cost: 0,
          profit: 0,
        }
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
          sellPriceBegin: '',
          sellPriceEnd: '',
          profitBegin: '',
          profitEnd: '',
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
      details(item) {
  
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .all-money{
    margin-bottom: 15px;
    font-size: 14px;
    span{
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
</style>