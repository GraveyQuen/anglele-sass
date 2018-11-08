<template>
  <div class="page-inner">
    <Card :bordered="true" class="card" dis-hover title="采购退货管理">
      <Button type="primary" slot="extra" class="extra-button" @click="goAdd">新增采购退货</Button>
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="退货单号：">
          <Input v-model="pageApi.thId" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="供应商名称：">
          <Input v-model="pageApi.provider" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                      <Option v-for="(option,i) in [{id:0,name: '暂存'},{id:1,name: '完成'},{id:9,name: '取消'}]" :value="option.id" :key="option.id">{{ option.name }}</Option>
                  </Select>
        </FormItem>
        <FormItem label="开单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue1" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近操作人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="orderTable" :columns="tableHeader" border :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
            <Button type="warning" size="small" v-if="props.row.status === 0" @click="edit(props.row)">编辑</Button>
            <Button type="warning" size="small" style="margin: 0 5px;" @click="details(props.row)">查看</Button>
            <Button type="warning" size="small" v-if="props.row.status  != 9" @click="cancel(props.row)">取消</Button>
        </template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
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
          pageIndex: 1,
          pageSize: 10,
          thId: '',
          provider: '',
          updateUser: '',
          orderDateStart: '',
          orderDateEnd: '',
          status: '',
          updateTimeStart: '',
          updateTimeEnd: ''
        },
        dateValue1: ['', ''],
        dateValue2: ['', ''],
        list: [],
        totalCount: 0,
        tableHeader: [{
          title: '退货单号',
          key: 'id',
          minWidth: 120
        }, {
          title: '供应商名称',
          key: 'provider',
          minWidth: 120
        }, {
          title: '供应商联系方式',
          key: 'providerPhone'
        }, {
          title: '退货金额',
          key: 'totalAmount',
          render: (h, params) => {
            return h('div', `￥${params.row.totalAmount}`)
          }
        }, {
          title: '仓库',
          key: 'wareHouseName'
        }, {
          title: '开单日期',
          key: 'orderDate'
        }, {
          title: '开单人',
          key: 'createUser'
        }, {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let status = params.row.status;
            if (status === 0) {
              return h('div', '暂存')
            } else if (status === 1) {
              return h('div', '完成')
            } else {
              return h('div', '取消')
            }
          }
        }, {
          title: '最近操作人',
          key: 'updateUser'
        }, {
          title: '最近操作时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          }
        }, {
          title: '操作',
          key: 'action',
          minWidth: 70,
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row,
                idx: params.row._index
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
          thId: this.pageApi.thId,
          provider: this.pageApi.provider,
          orderDateStart: this.dateValue1[0] != '' ? this.dateValue1[0].getTime() : '',
          orderDateEnd: this.dateValue1[1] != '' ? this.dateValue1[1].getTime() : '',
          status: this.pageApi.status,
          updateUser: this.pageApi.updateUser,
          updateTimeStart: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          updateTimeEnd: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : ''
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
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          thId: '',
          provider: '',
          updateUser: '',
          orderDateStart: '',
          orderDateEnd: '',
          status: '',
          updateTimeStart: '',
          updateTimeEnd: ''
        }
        this.dateValue1 = ['', ''];
        this.dateValue2 = ['', ''];
      },
      getList(params) {
        this.$http.post(this.$api.findPurchaseRefundList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      changeSize(size) {
        this.pageApi.pageSize = size;
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      goAdd() {
        this.$router.push({
          name: 'returnPurchaseAdd'
        })
      },
      cancel(item){
        this.$Modal.confirm({
          title: '取消退货采购',
          content: '确认取消退货采购？',
          onOk: () => {
            this.$http.post(this.$api.cancelPurchaseOrder,{id: item.id}).then(res => {
              if (res.code === 1000) {
                this.$Message.success('取消成功');
                this.getList(this.pageFilter)
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      details(item){
        this.$router.push({name: 'returnPurchaseDetail',query: {id: item.id}})
      },
      edit(item){
        this.$router.push({name: 'returnPurchaseEdit',query: {id: item.id}})
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../../assets/less/base.less');
</style>