<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="采购单管理">
      <Button type="primary" slot="extra" class="extra-button" @click="goRouter(false)">新增采购单</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="采购单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="采购日期：">
          <DatePicker type="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="采购员：">
          <Select v-model="pageApi.operatePerson" style="width: 200px;">
            <Option v-for="(item,index) in purchaseMan" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
          <FormItem label="仓库名称：">
            <Select v-model="pageApi.wareHouseId" style="width: 200px;">
              <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
        <FormItem label="采购状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
            <Option v-for="(item,index) in [{id:0,name:'进行中'},{id:1,name:'完成'}]" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-start" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除筛选</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="purchasTable" :columns="tableHeader" border :data="list">
          <template slot="wareHouse" slot-scope="props">
            <div class="wareHouse"><span v-for="(item,index) in props.row.wareHouse" :key="index">{{item.name}}</span></div>
          </template>
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                          <Button type="info" size="small" @click="print(props.row)" style="margin-right:8px;">打印</Button>
                          <Button type="info" size="small" @click="details(props.row)" style="margin-right:8px;">查看</Button>
                          <Button type="success" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="goRouter(true,props.row)">编辑</Button>
                          <Button type="success" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="del(props.row)">删除</Button>
                          <Button type="info" size="small"v-if="props.row.status === 0" @click="inHouse(props.row)">入库</Button>
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
          id: '',
          purchaseStartTime: '',
          purchaseEndTime: '',
          operatePerson: '',
          status: '',
          updateUser: '',
          updateStartTime: '',
          updateEndTime: '',
          wareHouseId: ''
        },
        storeList: [],
        list: [],
        totalCount: 0,
        purchaseMan: [],
        dateValue: ['', ''],
        dateValue2: ['', ''],
        tableHeader: [{
          title: '采购单号',
          key: 'id',
          minWidth: 220
        }, {
          title: '采购日期',
          key: 'purchaseDate',
          minWidth: 120
        }, {
          title: '状态',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            return h('div', params.row.status === 0 ? '采购中' : '完成')
          }
        }, {
          title: '采购员',
          key: 'operatePerson',
          minWidth: 100
        }, {
          title: '联系方式',
          key: 'operatePersonPhone',
          minWidth: 120
        }, {
          title: '仓库',
          key: 'wareHouse',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.purchasTable.$scopedSlots.wareHouse({
                row: params.row
              })
            )
          }
        },{
          title: '备注',
          key: 'remark',
          minWidth: 120
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 120
        }, {
          title: '最近更新时间',
          key: 'updateTime',
          minWidth: 120,
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
        }, {
          title: '操作',
          key: 'action',
          minWidth: 240,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.purchasTable.$scopedSlots.action({
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
          purchaseStartTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          purchaseEndTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          status: this.pageApi.status,
          updateUser: this.pageApi.updateUser,
          updateStartTime: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          updateEndTime: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          wareHouseId: this.pageApi.wareHouseId
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
          id: '',
          purchaseStartTime: '',
          purchaseEndTime: '',
          operatePerson: '',
          status: '',
          updateUser: '',
          updateStartTime: '',
          updateEndTime: '',
          wareHouseId: ''
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      getList(params) {
        this.$http.post(this.$api.findPurchaseOrderList, params).then(res => {
          if (res.code === 1000) {
            res.data.data.map(el =>{
              el.wareHouse = el.wareHouse !='' ? JSON.parse(el.wareHouse) : []
            })
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeList = res.data;
          }
        })
      },
      getPurchaMan() {
        this.$http.post(this.$api.findDeliveryManList, {
          pageIndex: 1,
          pageSize: 10,
          manType: 2
        }).then(res => {
          if (res.code === 1000) {
            this.purchaseMan = res.data.data;
          }
        })
      },
      //  打印
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
              h('div', '正在生成采购单...')
            ])
          }
        });
        this.$http.post(this.$api.printPurchaseOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
      //  查看
      details(item) {
        this.$router.push({
          name: 'purchasingDetail',
          query: {
            id: item.id
          }
        })
      },
      //  编辑
      goRouter(isEdit, item) {
        if (!isEdit) {
          this.$router.push({
            name: 'purchasingAdd'
          })
        } else {
          this.$router.push({
            name: 'purchasingEdit',
            query: {
              id: item.id
            }
          })
        }
      },
      // 删除
      del(item) {
        this.$Modal.confirm({
          title: '删除采购单',
          content: '确认删除采购单？',
          onOk: () => {
            this.$http.post(this.$api.delPurchaseOrder, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功')
                this.getList(this.pageFilter)
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      //  入库
      inHouse(item) {
        this.$router.push({
          name: 'purchasingIn',
          query: {
            rkid: item.id,
            status: 1
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getPurchaMan();
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../../assets/less/base.less');
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .wareHouse{
    span{
      display: inline-block;
      border-right: 1px solid #e6e6e6;
      padding: 0 5px;
      &:last-child{
        border-right: 0;
      }
    }
  }
</style>