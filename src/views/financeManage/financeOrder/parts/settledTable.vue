<template>
  <div class="tables">
  
    <Table class="fake-table-header" ref="settledTable" border :columns="tableHeader" :data="[]">
      <template slot="action" slot-scope="props">
          <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看</Button>
          <Button type="warning" size="small"  @click="updateId(props.row)">更新结算单号</Button>
</template>
  </Table>
  <Table class="real-table-body" ref ="settledRow" stripe highlight-row :show-header="false" :columns="fakeHead" :data="listData">
<template slot="options" slot-scope="props">
  <Button type="success" size="small" style="margin-right:8px;" @click="print(props.row)">打印</Button>
</template>
<template slot="info" slot-scope="props">
  <div class="info">
    <span>结算单号：{{props.row.id}}</span>
    <span>结算日期：{{props.row.createTime | dateformat}}</span>
    <span>结算金额：{{props.row.totalPrice}}</span>
  </div>
</template>
  </Table>
    <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
      <detailPage :order="detailItem"></detailPage>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
    </div>
    </Modal>
    <Modal title="更新结算单号" width="500" v-model="updateShow" :mask-closable="false">
      <Form ref="formCancel" :model="updateApi" :rules="updateRule" :label-width="100">
        <FormItem label="结算单号：" prop="settlementId">
          <Input v-model="updateApi.settlementId" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updateSubmit('formCancel')" :loading="loading">确认</Button>
        <Button @click="updateReset('formCancel')">取消</Button>
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
        isCancel: false,
        updateApi: {
          orderId: '',
          settlementId: ''
        },
        updateRule: {
          settlementId: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
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
          key: 'newOrderDate',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.newOrderDate != '' ? dateformat(params.row.newOrderDate, 'yyyy-MM-dd') : '暂无')
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
          minWidth: 100,
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
        fakeHead: [{
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('Table', {
                class: 'sub-table',
                props: {
                  columns: this.tableHeader,
                  data: params.row.orders,
                  showHeader: false
                }
              })
            }
          },
          {
            title: '预结算单号',
            minWidth: 260,
            key: 'id',
            render: (h, params) => {
              return h(
                'div',
                this.$refs.settledRow.$scopedSlots.info({
                  row: params.row
                })
              )
            }
          },
          {
            title: '操作',
            maxWidth: 200,
            key: 'createTime',
            align: 'center',
            render: (h, params) => {
              return h(
                'div',
                this.$refs.settledRow.$scopedSlots.options({
                  row: params.row
                })
              )
            }
          }
        ],
        show: false,
        detailItem: {},
        updateShow: false
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
        this.show = true;
        this.detailItem = Object.assign({}, item)
      },
      // 更新结算
      updateId(item) {
        this.updateShow = true;
        this.updateApi.orderId = item.id;
      },
      updateSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.updateApi);
            this.$http.post(this.$api.changeSettlementId, params).then(res => {
              if (res.code === 1000) {
                this.$emit('on-cancel', !this.isCancel)
                this.updateShow = false;
                this.$Message.success('更新成功');
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('结算单号不能为空')
          }
        })
      },
      updateReset(name) {
        Object.keys(this.updateApi).forEach(key => {
          this.updateApi[key] = '';
        })
        this.loading = false;
        this.updateShow = false;
        this.$refs[name].resetFields();
      },
      // 打印
      print(item) {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '正在生产打印结算单...')
            ])
          }
        });
        this.$http.post(this.$api.settlementPrint, {
          settlementId: item.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
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
  .info{
    span{
      display: inline-block;
      margin-right: 30px;
    }
  }
</style>