<template>
  <div>
    <Form :mode="pageApi" :label-width="0" inline>
      <FormItem>
        <Select v-model="pageApi.wareHouseId" style="width:200px;" placeholder="请选择仓库">
              <Option v-for="(option, index) in wareHouseList" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
      </FormItem>
      <FormItem>
        <DatePicker type="daterange" :options="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
    <VeLine :data="chartData"></VeLine>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    props: {
      id: String
    },
    data() {
      return {
        pageApi: {
          productId: this.id,
          startTime: '',
          endTime: '',
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
          columns: ['日期', '出库', '入库', '库存'],
          rows: []
        }
      }
    },
    computed: {
      pageFilter() {
        return {
          productId: this.pageApi.productId,
          startTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          wareHouseId: this.pageApi.wareHouseId
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      resetFilter() {
        this.pageApi = {
          productId: this.id,
          startTime: '',
          endTime: '',
          wareHouseId: ''
        }
        this.dateValue = ['', '']
      },
      getList(params) {
        this.$http.post(this.$api.pruductInOut, params).then(res => {
          if (res.code === 1000) {
            this.chartData.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let row = {
                  '日期': dateformat(el.time, 'yyyy-MM-dd'),
                  '出库': el.inNum,
                  '入库': el.outNum,
                  '库存': el.storeNum
                }
                this.chartData.rows.push(row)
              })
            }
          }
        })
      },
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.wareHouseList = res.data;
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  
</style>