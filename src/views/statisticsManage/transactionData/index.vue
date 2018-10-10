<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="交易汇总报表">
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <DatePicker type="daterange" :options="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div>
        <Row class="row">
          <Col span="6" class="row-col">
            <div class="title">销售单总数</div>
            <div class="num">{{item.orderNum}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">销售总金额</div>
            <div class="num">￥{{item.saleAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">销售成本金额</div>
            <div class="num">￥{{item.costAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">销售利润金额</div>
            <div class="num">￥{{item.profitAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">损耗金额</div>
            <div class="num">￥{{item.wastageAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">有效订单数</div>
            <div class="num">{{item.effectiveNum}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">有效订单金额</div>
            <div class="num">￥{{item.effectiveAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">未结算金额</div>
            <div class="num">￥{{item.unSettleAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">已结算金额</div>
            <div class="num">￥{{item.settleAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">无效订单金额</div>
            <div class="num">￥{{item.cancelAmount}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">成交订单数</div>
            <div class="num">{{item.dealNum}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">取消订单数</div>
            <div class="num">{{item.cancelNum}}</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">成交率</div>
            <div class="num">{{item.dealRate}}%</div>
          </Col>
          <Col span="6" class="row-col">
            <div class="title">取消率</div>
            <div class="num">{{item.cancelRate}}%</div>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          startTime: '',
          endTime: ''
        },
        dateValue: ['', ''],
        daterange: {
          shortcuts: [{
              text: '最近1个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '最近3个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: '最近1年',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                return [start, end];
              }
            }
          ]
        },
        item: {}
      }
    },
    computed: {
      pageFilter() {
        return {
          startTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : ''
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          this.getData(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      resetFilter(){
        this.dateValue = ['',''];
      },
      getData(params) {
        this.$http.post(this.$api.summaryStatistics, params).then(res => {
          if (res.code === 1000) {
            this.item = Object.assign({}, res.data)
          }
        })
      }
    },
    created() {
      this.getData(this.pageFilter);
    }
  }
</script>

<style lang='less' scoped>
  .row{
    .row-col{
      text-align: center;
      margin: 30px 0;
      .title{
        font-size: 16px;
        margin-bottom: 10px;
      }
      .num{
        font-size: 24px;
        font-weight: 700;
      }
    }
  }
</style>