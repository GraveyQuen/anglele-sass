<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="入库管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openBill(1)">新增入库</Button>
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="入库单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="开单人：">
          <Input v-model="pageApi.createUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="送货人：">
          <Input v-model="pageApi.driver" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Select v-model="pageApi.wareHouseId" style="width: 200px;">
                      <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
        </FormItem>
        <FormItem label="入库类型：">
          <Select v-model="pageApi.inType" style="width: 200px;">
                      <Option v-for="(item,index) in [{name:'采购入库',id: 1},{name:'退货入库',id: 2},{name:'其他入库',id: 3}]" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
        </FormItem>
        <FormItem label="入库状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                      <Option v-for="(item,index) in [{name:'完成',id: 1},{name:'暂存',id: 0},{name:'取消',id: 9}]" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
        </FormItem>
        <FormItem label="开单日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="最近操作人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近操作时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="goodsTable" :columns="tableHeader" border :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                    <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="openBill(2,props.row.id)">编辑</Button>
                    <Button type="success" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 9" @click="inDetail(props.row)">查看</Button>
                    <Button type="error" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="del(props.row)">删除</Button>
                    <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" @click="cancel(props.row)">取消</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="入库单详情" width="800" v-model="show" :mask-closable="false">
      <div class="in-detail">
        <Row>
          <Col class="in-col" span="6">开单日期：{{detailItem.newOrderDate}}</Col>
          <Col class="in-col" span="6">类型：{{detailItem.inType | inCategray}}</Col>
          <Col class="in-col" span="6">送货人：{{detailItem.driver}}</Col>
          <Col class="in-col" span="6">送货人电话：{{detailItem.driverPhone}}</Col>
          <Col class="in-col" span="6">开单人：{{detailItem.createUser}}</Col>
          <Col class="in-col" span="6">仓库：{{detailItem.wareHouseName}}</Col>
          <Col class="in-col" span="6">备注：{{detailItem.remark}}</Col>
        </Row>
        <div class="in-title">入库产品列表</div>
        <div class="page-inner">
        <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">产品名称</Col>
            <Col class-name="col" span="6">所属分类</Col>
            <Col class-name="col" span="6">入库数量</Col>
            <Col class-name="col" span="6">成本价</Col>
          </Row>
          <Row v-for="(item,index) in detailItem.wareHouseInItems" :key="index">
            <Col class-name="col" span="6">{{item.productName}}</Col>
            <Col class-name="col" span="6">{{item.productCategory}}</Col>
            <Col class-name="col" span="6">{{item.num}}{{item.unit}}</Col>
            <Col class-name="col" span="6">{{item.cost !='' ? `${item.cost}元/${item.unit}` : '无'}}</Col>
          </Row>
        </div></div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    inStatus,
    dateformat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          id: '',
          categoryId: '',
          wareHouseId: '',
          inType: '',
          status: '',
          updateUser: '',
          createUser: '',
          driver: '',
          pageIndex: 1,
          pageSize: 10,
          updateTimeBegin: '',
          updateTimeEnd: '',
          orderDateBegin: '',
          orderDateEnd: ''
        },
        list: [],
        totalCount: 0,
        tableHeader: [{
          title: '入库单号',
          key: 'id',
          minWidth: 210
        }, {
          title: '仓库名称',
          key: 'wareHouseName',
          minWidth: 120
        }, {
          title: '入库类型',
          key: 'inType',
          render: (h, params) => {
            let str = ['采购入库', '退货入库', '其他入库'][params.row.inType - 1];
            return h('div', str)
          },
          minWidth: 120
        }, {
          title: '开单日期',
          key: 'newOrderDate',
          minWidth: 120
        }, {
          title: '开单人',
          key: 'createUser',
          minWidth: 120
        }, {
          title: '送货人',
          key: 'driver',
          minWidth: 120
        }, {
          title: '送货人联系方式',
          key: 'driverPhone',
          minWidth: 130
        }, {
          title: '入库状态',
          key: 'status',
          render: (h, params) => {
            return h('div', inStatus(params.row.status))
          },
          minWidth: 120
        }, {
          title: '最近操作人',
          key: 'updateUser',
          minWidth: 120
        }, {
          title: '最近操作时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
          minWidth: 120
        }, {
          title: '操作',
          key: 'action',
          minWidth: 150,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.goodsTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }],
        storeList: [],
        dateValue: ['', ''],
        dateValue2: ['', ''],
        detailItem: {},
        show: false
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          id: this.pageApi.id,
          categoryId: this.pageApi.categoryId,
          inType: this.pageApi.inType,
          updateTimeBegin: this.dateValue2[0] != '' ? this.dateValue2[0].getTime() : '',
          updateTimeEnd: this.dateValue2[1] != '' ? this.dateValue2[1].getTime() : '',
          orderDateBegin: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          orderDateEnd: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          status: this.pageApi.status,
          createUser: this.pageApi.createUser,
          driver: this.pageApi.driver,
          updateUser: this.pageApi.updateUser,
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
    filters: {
      inCategray(val) {
        return ['采购入库', '退货入库', '其他入库'][val - 1]
      }
    },
    methods: {
      // 入库开单
      openBill(status, id) {
        if (!id) {
          this.$router.push({
            name: 'openBill',
            query: {
              status: status
            }
          })
        }else{
          this.$router.push({
            name: 'openBill',
            query: {
              status: status,
              id: id
            }
          })
        }
      },
      resetFilter() {
        this.pageApi = {
          id: '',
          categoryId: '',
          wareHouseId: '',
          inType: '',
          status: '',
          updateUser: '',
          createUser: '',
          driver: '',
          pageIndex: 1,
          pageSize: 10,
          updateTimeBegin: '',
          updateTimeEnd: '',
          orderDateBegin: '',
          orderDateEnd: ''
        }
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      getList(params) {
        this.$http.post(this.$api.wareHouseInPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      //  翻页
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeList = res.data;
          }
        })
      },
      /// 查看详情
      inDetail(item) {
        this.detailItem = Object.assign({}, item);
        this.show = true;
      },
      //删除
      del(item) {
        this.$Modal.confirm({
          title: '删除入库单',
          content: '确认是否删除暂存入库单？',
          onOk: () => {
            this.$http.post(this.$api.wareHouseInDelete, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('删除成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      // 取消 
      cancel(item) {
        this.$Modal.confirm({
          title: '取消入库单',
          content: '入库单取消后，商品库存会被扣减，确认是否继续？',
          onOk: () => {
            this.$http.post(this.$api.wareHouseInCancel, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('取消成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter)
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../../assets/less/base.less');
  .in-detail {
    font-size: 14px;
    .in-col {
      margin-bottom: 15px;
    }
    .in-title {
      font-weight: 800;
      margin-bottom: 15px;
    }
  }
</style>