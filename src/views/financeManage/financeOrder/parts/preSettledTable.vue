<template>
  <div class="tables">
  
    <Table class="fake-table-header" ref="settledTable" :columns="tableHeader" :data="[]">
      <template slot="action" slot-scope="props">
    <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看</Button>
    <Button type="warning" size="small"  @click="cancelSettled(props.row)">取消结算</Button>
</template>
  </Table>
  <Table class="real-table-body" stripe highlight-row :show-header="false" :columns="fakeHead" :data="listData"></Table>
  </div>
</template>

<script>
  import {
    dateformat,
    settlementStatus
  } from '@/utils/filters'
  export default {
    props: {
      lists: {
        type: Array
      }
    },
    data() {
      return {
        isCancel: false,
        tableHeader: [{
          title: '订单编号',
          key: 'id',
          minWidth: 220
        }, {
          title: '客户名称',
          key: 'customerName',
          minWidth: 220
        }, {
          title: '下单日期',
          key: 'createTime',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.createTime != '' ? dateformat(params.row.createTime, 'yyyy-MM-dd') : '暂无')
          }
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
          title: '操作',
          key: 'action',
          minWidth: 120,
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
        fakeHead: [{
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('Table', {
                class: 'sub-table',
                props: {
                  columns: this.tableHeader,
                  data: params.row.orders.map(item => {
                    item.distributeAccount = params.row.distributeAccount
                    return item
                  }),
                  showHeader: false
                }
              })
            }
          },
          {
            title: '预结算单号',
            minWidth: 380,
            key: 'id',
            // render: (h,params) =>{
            //   return ('span',`预结算单号：${params.row.id}`)
            // }
          },
          {
            title: '金额',
            key: 'totalPrice',
            render: (h, params) => {
              return h('span', {
                style: {
                  color: '#FF4C53',
                }
              }, `${params.row.totalPrice}`)
            }
          }
        ]
      }
    },
    computed: {
      listData() {
        let arr = [];
        if (this.lists) {
          this.lists.map(el => {
            el._expanded = true;
            arr.push(el)
          })
        }
        return arr;
      }
    },
    methods: {
      detail(item) {
        console.log(item)
      },
      // 取消结算
      cancelSettled(item) {
        this.$Modal.confirm({
          title: '取消结算确认',
          content: `是否确认取消结算？`,
          onOk: () => {
            this.$http.post(this.$api.settleCancel, {
              orderId: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.$emit('on-cancel', !this.isCancel)
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  .tables {
    .fake-table-header .ivu-table-tip {
      display: none;
    }
    .real-table-body {
      border-top: 0;
      td.ivu-table-expanded-cell {
        padding: 0;
      }
    }
    .sub-table {
      border: 0;
    }
    .ivu-table {
      td {
        &.ivu-table-expanded-cell {
          padding: 0;
        }
      }
    }
  }
</style>