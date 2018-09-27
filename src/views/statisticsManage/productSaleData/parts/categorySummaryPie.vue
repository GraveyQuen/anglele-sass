<template>
  <div>
    <Card :bordered="true" dis-hover title="分类销售">
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <Select v-model="pageApi.categoryName" style="width:200px;" placeholder="请选择分类">
              <Option v-for="(option, index) in categoryList" :value="option.name" :key="index">{{option.name}}</Option>
            </Select>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange" :options="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      </Form>
      <Row :gutter="16">
        <Col span="12">
        <div>分类销售额</div>
        <VePie :data="chartAmount" :settings="chartSettings"></VePie>
        </Col>
        <Col span="12">
        <div>分类销售量</div>
        <VePie :data="chartNum" :settings="chartSettings"></VePie>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      this.chartSettings = {
        hoverAnimation:  false  //禁用hover 在扇区上的放大动画效果
      }
      return {
        pageApi: {
          categoryName: '',
          endTime: '',
          startTime: ''
        },
        chartAmount: {
          columns: ['客户名称', '金额'],
          rows: []
        },
        chartNum: {
          columns: ['客户名称', '数量'],
          rows: []
        },
        categoryList: [],
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
        dateValue: ['', '']
      }
    },
    computed: {
      pageFilter() {
        return {
          categoryName: this.pageApi.categoryName,
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
        this.pageApi.categoryName = '';
        this.dateValue = ['', '']
      },
      getData(params) {
        this.$http.post(this.$api.producrSummaryPieCategory, params).then(res => {
          if (res.code === 1000) {
            this.chartAmount.rows = [];
            this.chartNum.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let amount = {
                  '客户名称': el.customerName,
                  '金额': el.amount
                }
                let num = {
                  '客户名称': el.customerName,
                  '数量': el.num
                }
                this.chartAmount.rows.push(amount)
                this.chartNum.rows.push(num)
              })
            }
          }
        })
      },
      getAllCategory() {
        this.$http.post(this.$api.findAllCategory).then(res => {
          if (res.code === 1000) {
            this.categoryList = res.data;
          }
        })
      }
    },
    created() {
      this.getData(this.pageFilter);
      this.getAllCategory();
    }
  }
</script>

<style lang='less' scoped>
  
</style>