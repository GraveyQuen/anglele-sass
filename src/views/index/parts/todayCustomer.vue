<template>
  <div class="today">
    <div class="header">今日客户下单分布
      <Select v-model="pageApi.categoryName" style="margin-left:10px;width:200px;" placeholder="产品分类">
                  <Option v-for="(item,index) in stroeList" :value="item.name" :key="index">{{ item.name }}</Option>
                </Select>
    </div>
    <div class="pie">
      <Row>
        <Col span="12">
        <div class="nums">销售额(元)</div>
        <div class="nums">{{total.prices}}</div>
        <VePie :data="chartPrice" :settings="chartSettings"></VePie>
        </Col>
        <Col span="12">
        <div class="nums">销售量</div>
        <div class="nums">{{total.nums}}</div>
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
          categoryName: ''
        },
        stroeList: [],
        chartNum: {
          columns: ['客户名称', '数量'],
          rows: []
        },
        chartPrice: {
          columns: ['客户名称', '金额'],
          rows: []
        },
        list: []
      }
    },
    watch: {
      'pageApi.categoryName': {
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
        this.$http.post(this.$api.todayCategoryPie, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
            this.chartNum.rows = [];
            this.chartPrice.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let num = {
                  '客户名称': el.customerName,
                  '数量': el.num
                }
                let price = {
                  '客户名称': el.customerName,
                  '金额': el.price
                }
                this.chartNum.rows.push(num)
                this.chartPrice.rows.push(price)
              })
            }
          }
        })
      },
      getStore() {
        this.$http.post(this.$api.findAllCategory).then(res => {
          if (res.code === 1000) {
            this.stroeList = res.data;
          }
        })
      }
    },
    created() {
      this.getData();
      this.getStore();
    }
  }
</script>

<style lang='less' scoped>
  .today {
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