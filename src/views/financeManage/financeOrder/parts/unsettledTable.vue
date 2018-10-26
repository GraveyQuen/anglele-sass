<template>
  <div class="tables">
    <Table width="100%" ref="settledTable" border :columns="tableHeader" :data="lists" @on-selection-change="selectRow">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
            <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看</Button>
</template>
    </Table>
        <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
      <detailPage :order="detailItem" :logList="logList"></detailPage>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat,
    settlementStatus
  } from '@/utils/filters'
  import detailPage from './detailPage.vue'
  export default {
    components: {
      detailPage
    },
    props: {
      lists: {
        type: Array
      }
    },
    data() {
      return {
        logList: [],
        tableHeader: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '订单编号',
          key: 'id',
          minWidth: 220
        }, {
          title: '客户名称',
          key: 'customerName',
          minWidth: 220
        }, {
          title: '下单日期',
          key: 'newOrderDate',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.newOrderDate != '' ? dateformat(params.row.newOrderDate, 'yyyy-MM-dd') : '暂无')
          }
        }, {
          title: '客户联系人',
          key: 'contactPeople',
          minWidth: 120
        }, {
          title: '客户联系方式',
          key: 'contactPhone',
          minWidth: 120
        }, {
          title: '送货地址',
          key: 'address',
          minWidth: 220
        }, {
          title: '下单金额',
          key: 'amount',
          minWidth: 120,
          render: (h, params) => {
            return h('div', `￥${params.row.amount}`)
          }
        }, {
          title: '实单金额',
          key: 'realAmount',
          minWidth: 120,
          render: (h, params) => {
            return h('div', `￥${params.row.realAmount}`)
          }
        }, {
          title: '状态',
          key: 'settlementStatus',
          minWidth: 100,
          render: (h, params) => {
            return h('div', settlementStatus(params.row.settlementStatus))
          }
        }, {
          title: '备注',
          key: 'remark',
          minWidth: 220
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 120
        }, {
          title: '最近更新时间',
          key: 'updateTime',
          minWidth: 170,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime, 'yyyy-MM-dd hh:mm:ss') : '暂无')
          }
        }, {
          title: '操作',
          key: 'action',
          minWidth: 120,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.settledTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }],
        detailItem: {},
        show: false
      }
    },
    watch: {
      lists(val) {
        this.$refs.settledTable.selectAll(false);
      }
    },
    methods: {
      selectRow(data) {
        let arr = [];
        data.map(el => {
          arr.push(el.id)
        })
        this.$emit('on-change', arr)
      },
      detail(item) {
        this.show = true;
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
        this.getLog(item)
      },
      getLog(item) {
        this.$http.post(this.$api.orderFeeHistory, {
          orderId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.logList = res.data;
          }
        })
      },
    }
  }
</script>

<style lang='less' scoped>
  
</style>