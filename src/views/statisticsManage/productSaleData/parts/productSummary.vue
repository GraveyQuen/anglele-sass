<template>
  <div>
    <Card :bordered="true" dis-hover title="产品销售汇总">
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <Input v-model="pageApi.customerName" style="width: 200px;" placeholder="请输入客户名称"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="pageApi.productName" style="width: 200px;" placeholder="请输入产品名称"></Input>
        </FormItem>
        <FormItem>
          <Select v-model="pageApi.wareHouseId" style="width:200px;" placeholder="请选择仓库">
              <Option v-for="(option, index) in wareHouseList" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange" :options="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <ve-line :data="chartData"></ve-line>
    </Card>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          startTime: '',
          endTime: '',
          customerName: '',
          productName: '',
          wareHouseId: ''
        },
        dateValue: ['', ''],
        wareHouseList: [],
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
        chartData: {
          // columns: ['日期', '销售总额', '作废金额', '有效数量', '订单数量', '作废数量', '有效金额'],
          columns: ['日期', '销售额'],
          rows: []
        }
      }
    },
    computed: {
      pageFilter() {
        return {
          customerName: this.pageApi.customerName,
          productName: this.pageApi.productName,
          wareHouseId: this.pageApi.wareHouseId,
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
        this.pageApi = {
          startTime: '',
          endTime: '',
          customerName: '',
          productName: '',
          wareHouseId: ''
        }
        this.dateValue = ['', '']
      },
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.wareHouseList = res.data;
          }
        })
      },
      getData(params) {
        this.$http.post(this.$api.productSummary, params).then(res => {
          if (res.code === 1000) {
            this.chartData.rows = [];
            if (res.data.length) {
              res.data.map(item => {
                let row = {
                  '日期': dateformat(item.time, 'yyyy-MM-dd'),
                  '销售额': item.saleAmount,
                  // '作废金额': item.cancelAmount,
                  // '有效数量': item.effectiveNum,
                  // '订单数量': item.orderNum,
                  // '作废数量': item.cancelNum,
                  // '有效金额': item.effectiveAmount
                }
                this.chartData.rows.push(row)
              })
            }
          }
        })
      }
    },
    created() {
      this.getWareHouse();
      this.getData(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  
</style>