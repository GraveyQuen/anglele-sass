<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="损耗管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增损耗</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="损耗单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Select v-model="pageApi.wareHouseId" style="width: 200px;">
            <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="损耗状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
            <Option v-for="(item,index) in [{name:'暂存',id: 0},{name:'完成',id: 1},{name:'取消',id: 1}]" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="开单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="开单人：">
          <Input v-model="pageApi.createUser" placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近操作人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近操作时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="goodsTable" :columns="tableHeader" :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 0">编辑</Button>
                <Button type="success" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2">查看</Button>
                <Button type="error" size="small" style="margin-right:8px;" v-if="props.row.status === 0" >删除</Button>
                <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" >取消</Button>
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
    dateformat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          id: '',
          wareHouseId: '',
          startCreateTime: '',
          endCreateTime: '',
          createUser: '',
          status: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: ''
        },
        list: [],
        totalCount: 0,
        dateValue: ['', ''],
        dateValue2: ['', ''],
        storeList: [],
        tableHeader: [{
          title: '损耗单号',
          key: 'id'
        }, {
          title: '仓库名称',
          key: 'wareHouseName'
        }, {
          title: '开单日期',
          key: 'newOrderDate',
          render: (h, params) => {
            return h('div', dateformat(params.row.newOrderDate))
          }
        }, {
          title: '开单人',
          key: 'createUser'
        }, {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let str = ['暂存', '完成', '取消'][params.row.status]
            return h('span', str)
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
          render: (h, params) => {
            return h(
              'div',
              this.$refs.goodsTable.$scopedSlots.action({
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
          wareHouseId: this.pageApi.wareHouseId,
          startUpdateTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endUpdateTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          startCreateTime: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          endCreateTime: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          status: this.pageApi.status,
          createUser: this.pageApi.createUser,
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
        this.$http.post(this.$api.findWastageList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          id: '',
          wareHouseId: '',
          startCreateTime: '',
          endCreateTime: '',
          createUser: '',
          status: '',
          updateUser: '',
          startUpdateTime: '',
          endUpdateTime: ''
        }
        this.dateValue = ['',''];
        this.dateValue2 = ['',''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeList = res.data;
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
  @import url('../../../assets/less/base.less');
</style>