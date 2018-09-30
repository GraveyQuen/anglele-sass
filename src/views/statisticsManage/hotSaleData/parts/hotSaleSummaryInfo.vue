<template>
  <div>
    <Form :mode="pageApi" :label-width="0" inline>
      <FormItem>
        <DatePicker type="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
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
      type: Number,
      typeId: String
    },
    data() {
      return {
        pageApi: {
          type: this.type,
          typeId: this.typeId,
          startTime: '',
          endTime: ''
        },
        dateValue: ['', ''],
        chartData: {
          columns: ['日期', '销售金额(元)', '销售重量'],
          rows: []
        }
      }
    },
    computed: {
      pageFilter() {
        return {
          type: this.pageApi.type,
          typeId: this.pageApi.typeId,
          startTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
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
        this.pageApi = {
          type: this.type,
          typeId: this.typeId,
          startTime: '',
          endTime: ''
        }
        this.dateValue = ['','']
      },
      getData(params) {
        this.$http.post(this.$api.hotSaleSummaryInfo, params).then(res => {
          if (res.code === 1000) {
            this.chartData.rows = [];
            if (res.data.length) {
              res.data.map(el => {
                let row = {
                  '日期': dateformat(el.time, 'yyyy-MM-dd'),
                  '销售金额(元)': el.amount,
                  '销售重量': el.orderNum,
                }
                this.chartData.rows.push(row)
              })
            }
          }
        })
      }
    },
    created() {
      this.getData(this.pageApi);
    }
  }
</script>

<style lang='less' scoped>
  
</style>