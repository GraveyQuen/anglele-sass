<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="订单管理">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="订单金额：">
          <Input v-model="pageApi.amountMin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.amountMax" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="实单金额：">
          <Input v-model="pageApi.realAmountMin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.realAmountMax" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="下单方式：">
          <Select v-model="pageApi.status" style="width: 200px;">
                <Option v-for="(item,index) in [{value: 1,name:'自主下单'},{value: 2,name: '代客下单'}]" :value="item.value" :key="index">{{ item.name }}</Option>
              </Select>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                <Option v-for="(item,index) in orderStatus" :value="item.value" :key="index">{{ item.name }}</Option>
              </Select>
        </FormItem>
        <FormItem label="下单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="orderTable" :columns="tableHeader" border :data="list">
          <template slot="action" slot-scope="props">
              <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 4">完成</Button>
              <Button type="success" size="small" style="margin-right:8px;">查看</Button>
              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1">确认</Button>
              <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2 || props.row.status === 3 || props.row.status === 4" @click="cancel(props.row)">取消</Button>
          </template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {
    dateformat,orderStatus
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          id: '',
          customerName: '',
          startCreateTime: '',
          endCreateTime: '',
          amountMin: '',
          amountMax: '',
          realAmountMin: '',
          realAmountMax: '',
          status: '',
          orderType: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: ''
        },
        orderStatus: [{
          value: 1,
          name: '已下单'
        }, {
          value: 2,
          name: '已确认'
        }, {
          value: 3,
          name: '配送中'
        }, {
          value: 4,
          name: '配送中'
        }, {
          value: 5,
          name: '已完成'
        }, {
          value: 9,
          name: '已取消'
        }],
        dateValue: ['', ''],
        dateValue2: ['', ''],
        list: [],
        totalCount: 0,
        tableHeader: [{
          title: '订单编号',
          key: 'id',
          minWidth: 160
        }, {
          title: '客户名称',
          key: 'customerName',
          minWidth: 160
        }, {
          title: '下单日期',
          key: 'createTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.createTime, 'yyyy-MM-dd'))
          },
          minWidth: 120
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
          minWidth: 180
        }, {
          title: '下单金额',
          key: 'amount',
          minWidth: 120,
          render: (h, params) => {
            return h('div', `￥${params.row.amount}`)
          },
        }, {
          title: '实单金额',
          key: 'realAmount',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.realAmount != '' ? `￥${params.row.realAmount}` : '暂无'
            return h('div', str)
          },
        }, {
          title: '状态',
          key: 'status',
          minWidth: 120,
          render: (h, params) => {
            return h('div', orderStatus(params.row.status))
          },
        }, {
          title: '下单方式',
          key: 'orderType',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.orderType === 1 ? '客户' : '代开';
            return h('div', str)
          },
        }, {
          title: '备注',
          key: 'remark',
          minWidth: 150
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 120
        }, {
          title: '最近操作时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
          minWidth: 140
        }, {
          title: '操作',
          key: 'action',
          minWidth: 190,
          fixed: 'right',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }]
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          id: this.pageApi.id,
          customerName: this.pageApi.customerName,
          startCreateTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endCreateTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          startUpdateTime: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          endUpdateTime: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          amountMin: this.pageApi.amountMin,
          amountMax: this.pageApi.amountMax,
          realAmountMin: this.pageApi.realAmountMin,
          realAmountMax: this.pageApi.realAmountMax,
          status: this.pageApi.status,
          orderType: this.pageApi.orderType,
          updateUser: this.pageApi.updateUser
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.pageIndex == oldVal.pageIndex)
            this.pageApi.pageIndex = 1;
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      getList(params) {
        this.$http.post(this.$api.orderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      }
    },
    created() {
      this.getList(this.pageFilter);
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .split {
    display: inline-block;
    vertical-align: middle;
    width: 5px;
    height: 1px;
    margin: 0 4px;
    background-color: #e6e6e6;
  }
</style>