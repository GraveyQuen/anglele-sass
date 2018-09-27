<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="热门销售报表">
      <Form :mode="pageApi" :label-width="15" inline>
        <Select v-model="pageApi.type" style="width:200px;" placeholder="请选择仓库">
                <Option v-for="(option, index) in [{id: 1,name:'产品'},{id:2,name: '客户'}]" :value="option.id" :key="index">{{option.name}}</Option>
              </Select>
        <FormItem>
          排名前
          <InputNumber :min="10" v-model="pageApi.pageSize"></InputNumber>
        </FormItem>
        <Select v-model="pageApi.wareHouseId" style="width:200px;" placeholder="请选择仓库">
            <Option v-for="(option, index) in wareHouseList" :value="option.id" :key="index">{{option.name}}</Option>
          </Select>
        <FormItem>
          <DatePicker type="daterange" :options="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" border :columns="tableHeader" :data="list"></Table>
      </div>
    </Card>
    <Modal title="查看图表" width="800" v-model="show" :mask-closable="false">
      <hotSaleSummaryInfo v-if="show" :type="pageApi.type" :typeId="typeId"></hotSaleSummaryInfo>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import hotSaleSummaryInfo from './parts/hotSaleSummaryInfo'
  export default {
    components: {
      hotSaleSummaryInfo
    },
    data() {
      return {
        pageApi: {
          type: 1,
          wareHouseId: '',
          pageSize: 10,
          startTime: '',
          endTime: ''
        },
        dateValue: ['', ''],
        typeId: '',
        list: [],
        show: false,
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
        tableHeader: [{
          title: '排名',
          key: 'index',
          render: (h, params) => {
            return h('span', params.row._index + 1)
          }
        }, {
          title: '产品名称',
          key: 'type'
        }, {
          title: '下单数',
          key: 'orderNum'
        }, {
          title: '成交订单数',
          key: 'dealNum',
        }, {
          title: '取消订单数',
          key: 'cancalNum',
        }, {
          title: '销售总额',
          key: 'saleAmount',
          render: (h, params) => {
            return h('span', `￥${params.row.saleAmount}`)
          }
        }, {
          title: '成交金额',
          key: 'dealAmount',
          render: (h, params) => {
            return h('span', `￥${params.row.dealAmount}`)
          }
        }, {
          title: '取消金额',
          key: 'cancelAmount',
          render: (h, params) => {
            let str = params.row.cancelAmount != '' ? `￥${params.row.cancelAmount}` : ''
            return h('span', str)
          }
        }, {
          title: '成交率',
          key: 'dealRate',
          render: (h, params) => {
            return h('span', `${params.row.dealRate}%`)
          }
        }, {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.detail(params.row)
                  }
                }
              }, '查看图表'),
            ]);
          }
        }]
      }
    },
    computed: {
      pageFilter() {
        return {
          type: this.pageApi.type,
          wareHouseId: this.pageApi.wareHouseId,
          pageSize: this.pageApi.pageSize,
          startTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : ''
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      },
      'pageApi.type' (val) {
        this.tableHeader[1].title = val === 1 ? '产品名称' : '客户名称'
      }
    },
    methods: {
      getList(params) {
        this.$http.post(this.$api.hotSaleSummary, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        })
      },
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.wareHouseList = res.data;
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          type: 1,
          wareHouseId: '',
          pageSize: 10,
          startTime: '',
          endTime: ''
        }
        this.dateValue = ['', ''];
      },
      detail(item) {
        this.typeId = item.typeId;
        this.show = true;
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