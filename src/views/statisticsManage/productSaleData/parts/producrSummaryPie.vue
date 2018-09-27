<template>
  <div>
    <Card :bordered="true" dis-hover title="客户销售">
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <Input v-model="pageApi.customerName" style="width: 200px;" placeholder="请输入客户名称"></Input>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange" :options="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <Row :gutter="16">
        <Col span="12">
        <div>客户销售金额</div>
        <ve-pie :data="chartAmount" :settings="chartSettings"></ve-pie>
        </Col>
        <Col span="12">
        <div>客户销售数量</div>
        <ve-pie :data="chartNum" :settings="chartSettings"></ve-pie>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      this.chartSettings = {
        hoverAnimation: false  //禁用hover 在扇区上的放大动画效果
      }
      return {
        pageApi: {
          customerName: '',
          endTime: '',
          startTime: ''
        },
        chartAmount: {
          columns: ['产品名称', '金额'],
          rows: []
        },
        chartNum: {
          columns: ['产品名称', '数量'],
          rows: []
        },
        daterange: {
          shortcuts: [{
              text: '本月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '3个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: '本年',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                return [start, end];
              }
            }
          ]
        },
        dateValue: ['', '']
      }
    },
    computed: {
      pageFilter() {
        return {
          customerName: this.pageApi.customerName,
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
      resetFilter() {
        this.pageApi.customerName = '';
        this.dateValue = ['', '']
      },
      getData(params) {
        this.$http.post(this.$api.producrSummaryPieCustomer, params).then(res => {
          if (res.code === 1000) {
            this.chartAmount.rows = [];
            this.chartNum.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let amount = {
                  '产品名称': el.productCategory,
                  '金额': el.amount
                }
                let num = {
                  '产品名称': el.productCategory,
                  '数量': el.num
                }
                this.chartAmount.rows.push(amount)
                this.chartNum.rows.push(num)
              })
            }
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
  
</style>