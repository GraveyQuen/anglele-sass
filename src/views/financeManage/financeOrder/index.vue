<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="订单管理">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.orderId" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="下单时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue1" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="下单金额：" v-if="pageApi.tab === 1 || pageApi.tab === 2">
          <Input v-model="pageApi.amountBegin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.amountEnd" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="实单金额：" v-if="pageApi.tab === 1 || pageApi.tab === 2">
          <Input v-model="pageApi.realAmountBegin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.realAmountEnd" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="预结算金额：" v-if="pageApi.tab === 3 || pageApi.tab === 4">
          <Input v-model="pageApi.settlementAmountBegin" placeholder="请输入" style="width: 93px;"></Input>
          <span class="split"></span>
          <Input v-model="pageApi.settlementAmountEnd" placeholder="请输入" style="width: 93px;"></Input>
        </FormItem>
        <FormItem label="状态：" v-if="pageApi.tab === 1">
          <Select v-model="pageApi.settlementStatus" style="width: 200px;">
              <Option v-for="(item,index) in orderStatus" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="预结算时间：" v-if="pageApi.tab === 3 || pageApi.tab === 4">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除筛选</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="tabs-main">
          <tabs :tab="pageApi.tab" :tabData="tabData" @on-change="tabChange"></tabs>
        </div>
        <div class="options-btn" v-show="pageApi.tab === 2">
          <Button type="primary" @click="unsettledAction(2)" style="margin-right: 15px;">批量预结算</Button>
          <Button type="primary" @click="unsettledAction(1)">批量结算</Button>
        </div>
        <allTable :lists="list" v-show="pageApi.tab === 1"></allTable>
        <unsettledTable :lists="list" v-show="pageApi.tab === 2" @on-change="unsettledChange"></unsettledTable>
        <preSettledTable :lists="list" v-show="pageApi.tab === 3" @on-cancel="cancelSettle"></preSettledTable>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import tabs from './parts/tab' //  tab切换
  import allTable from './parts/allTable' //全部
  import unsettledTable from './parts/unsettledTable.vue' //  未结算
  import preSettledTable from './parts/preSettledTable.vue' //  预结算
  export default {
    components: {
      tabs,
      allTable,
      unsettledTable,
      preSettledTable
    },
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          tab: 1,
          orderId: '',
          customerName: '',
          createTimeBegin: '',
          createTimeEnd: '',
          amountBegin: '',
          amountEnd: '',
          realAmountBegin: '',
          realAmountEnd: '',
          settlementStatus: '',
          updateUser: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          settlementAmountBegin: '',
          settlementAmountEnd: ''
        },
        dateValue: ['', ''],
        dateValue1: ['', ''],
        dateValue2: ['', ''],
        list: [],
        totalCount: 0,
        tabData: [{
          id: 1,
          name: '全部'
        }, {
          id: 2,
          name: '未结算'
        }, {
          id: 3,
          name: '预结算'
        }, {
          id: 4,
          name: '已结算'
        }],
        orderStatus: [{
          id: 0,
          name: '未结算'
        }, {
          id: 1,
          name: '预结算'
        }, {
          id: 2,
          name: '已结算'
        }],
        unsettledList: [],
        settleApi: {
          orderIds: [],
          finish: null
        }
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          tab: this.pageApi.tab,
          orderId: this.pageApi.orderId,
          customerName: this.pageApi.customerName,
          createTimeBegin: this.dateValue1[0] != '' ? this.dateValue1[0].getTime() : '',
          createTimeEnd: this.dateValue1[1] != '' ? this.dateValue1[1].getTime() : '',
          amountBegin: this.pageApi.amountBegin,
          amountEnd: this.pageApi.amountEnd,
          realAmountBegin: this.pageApi.realAmountBegin,
          realAmountEnd: this.pageApi.realAmountEnd,
          settlementStatus: this.pageApi.settlementStatus,
          updateUser: this.pageApi.updateUser,
          updateTimeBegin: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          updateTimeEnd: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          settlementAmountBegin: this.pageApi.settlementAmountBegin,
          settlementAmountEnd: this.pageApi.settlementAmountEnd
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
  
      },
      tabChange(tab) {
        this.pageApi.tab = tab;
      },
      getList(params) {
        this.$http.post(this.$api.settlementPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.page.data;
            this.totalCount = res.data.page.totalCount;
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      /// 取消结算 刷新列表
      cancelSettle() {
        this.getList(this.pageFilter)
      },
      unsettledChange(data) {
        this.settleApi.orderIds = [...data]
      },
      /// 保存批量结算、预结算
      unsettledAction(data) {
        if (this.settleApi.orderIds.length > 0) {
          this.saveSettle(data)
        } else {
          this.$Message.error(`请选择${data === 1 ? '结算订单':'预结算订单'}`)
        }
      },
      saveSettle(data) {
        this.$Modal.confirm({
          title: `批量${data === 1 ? '结算订单':'预结算订单'}`,
          content: `是否确认执行${data === 1 ? '结算订单':'预结算订单'}操作？`,
          onOk: () => {
            let params = this.$clearData(this.settleApi);
            params.orderIds = params.orderIds.toString();
            params.finish = data;
            this.$http.post(this.$api.toSettle, params).then(res => {
              if (res.code === 1000) {
                // this.getList(this.pageFilter);
                // this.$Message.success('成功!');
                this.successConfirm(data);
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      successConfirm(data) {
        this.$Modal.confirm({
          title: '操作执行成功',
          content: `是否进入${data === 1 ? '结算页面':'预结算页面'}进行查看？`,
          onOk: () => {
            this.pageApi.tab = data === 1 ? 4 : 3
          },
          onCancel: () => {
  
          }
        })
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
  
  .tabs-main {
    margin-bottom: 20px;
  }
  
  .options-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>