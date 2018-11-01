<template>
  <div class="today-sales">
    <div class="header">今日产品销售分布
      <Input v-model="pageApi.customerName" placeholder="请输入客户名称" style="margin:0 10px;width: 200px;"></Input>
      <Button type="warning"@click="resetFilter">清除</Button>
    </div>
    <div class="pie">
      <Row>
        <Col span="12">
        <div class="nums">销售额(元)</div>
        <div class="nums">{{total.prices.toFixed(2)}}</div>
        <VePie :data="chartPrice" :settings="chartSettings"></VePie>
        </Col>
        <Col span="12">
        <div class="nums">销售量</div>
        <div class="nums">{{total.nums.toFixed(2)}}</div>
        <VePie :data="chartNum" :settings="chartSettings"></VePie>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      this.chartSettings = {
        hoverAnimation: false //禁用hover 在扇区上的放大动画效果
      }
      return {
        pageApi: {
          customerName: ''
        },
        chartNum: {
          columns: ['分类名称', '数量'],
          rows: []
        },
        chartPrice: {
          columns: ['分类名称', '金额'],
          rows: []
        },
        list: []
      }
    },
    watch: {
      'pageApi.customerName': {
        handler: _.debounce(function(val, oldVal) {
          this.getData();
        }, 200),
        deep: true
      }
    },
    computed: {
      total() {
        let all = {
          nums: 0,
          prices: 0
        };
        this.list.map(el => {
          all.nums += el.num;
          all.prices += el.price;
        })
        return all;
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.todayCustomerPie, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
            this.chartNum.rows = [];
            this.chartPrice.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let num = {
                  '分类名称': el.productCategory,
                  '数量': el.num
                }
                let price = {
                  '分类名称': el.productCategory,
                  '金额': el.price
                }
                this.chartNum.rows.push(num)
                this.chartPrice.rows.push(price)
              })
            }
          }
        })
      },
      resetFilter(){
        this.pageApi.customerName = ''
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .today-sales {
    .header {
      display: inline-block;
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #17233d;
      font-weight: 700;
      overflow: hidden;
      margin-bottom: 15px;
    }
    .nums {
      text-align: center;
      font-size: 16px;
    }
  }
</style>