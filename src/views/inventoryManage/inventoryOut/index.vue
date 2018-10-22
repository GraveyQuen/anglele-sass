<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="出库管理">
      <Form :mode="pageApi" :label-width="110" inline>
        <FormItem label="出库单号：">
          <Input v-model="pageApi.id" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="订单单号：">
          <Input v-model="pageApi.orderId" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input v-model="pageApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                              <Option v-for="(item,index) in orderStatus" :value="item.value" :key="index">{{ item.name }}</Option>
                            </Select>
        </FormItem>
        <FormItem label="配送人：">
          <Select v-model="pageApi.deliveryManId" style="width: 200px;">
                            <Option v-for="(item,index) in deliveryList" :value="item.id" :key="index">{{ item.name }}</Option>
                          </Select>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-start" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除筛选</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="orderTable" :columns="tableHeader" border :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                                <Button type="success" size="small" style="margin-right:8px;" @click="detail(props.row)">查看明细</Button>
                                <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" @click="confirm(props.row)">确认</Button>
                                <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 2" @click="out(props.row)">出库</Button>
                                <Button type="info" size="small" v-if="props.row.status === 1 || props.row.status === 2 || props.row.status === 3" @click="print(props.row)">打印</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
      </Card>
    <Modal title="出库单详情" width="800" v-model="detailShow" :mask-closable="false">
      <div class="in-detail" v-if="detailItem.wareHouseOutItems">
        <div class="page-inner">
        <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">产品名称</Col>
            <Col class-name="col" span="6">所属分类</Col>
            <Col class-name="col" :span="detailItem.status === 4 ? 6 : 12">下单出库数量</Col>
            <Col class-name="col" span="6" v-if="detailItem.status === 4">实际出库数量</Col>
          </Row>
          <Row v-for="(item,index) in detailItem.wareHouseOutItems" :key="index">
            <Col class-name="col" span="6">{{item.productName}}</Col>
            <Col class-name="col" span="6">{{item.productCategory}}</Col>
            <Col class-name="col" :span="detailItem.status === 4 ? 6 : 12">{{item.num}}{{item.unit}}</Col>
            <Col class-name="col" span="6" v-if="detailItem.status === 4">{{item.realNum}}{{item.unit}}</Col>
          </Row>
        </div></div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal title="选择配送人" width="500" v-model="outShow" :mask-closable="false">
         <Form :model="outApi" ref="baseForm" :rules="baseRule" :label-width="110" >
          <FormItem label="配送人：" prop="deliveryManId">
            <Select v-model="outApi.deliveryManId" style="width: 100%;">
                    <Option v-for="(item,index) in deliveryList" :value="item.id" :key="index">{{ item.name }}</Option>
                  </Select>
          </FormItem>
          </Form>
      <div slot="footer">
        <Button type="primary" @click="saveOut('baseForm')">出库</Button>
        <Button @click="cancelOut('baseForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat,
    outStatus
  } from '@/utils/filters'
  export default {
    data() {
      return {
        pageApi: {
          id: '',
          orderId: '',
          customerName: '',
          status: '',
          updateUser: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          pageIndex: 1,
          pageSize: 10,
          deliveryManId: ''
        },
        outApi: {
          id: '',
          deliveryManId: ''
        },
        baseRule: {
          deliveryManId: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }]
        },
        deliveryList: [],
        outShow: false,
        dateValue: ['', ''],
        orderStatus: [{
          value: 1,
          name: '待确认'
        }, {
          value: 2,
          name: '已确认'
        }, {
          value: 3,
          name: '已出库'
        }, {
          value: 4,
          name: '已完成'
        }, {
          value: 9,
          name: '已取消'
        }],
        list: [],
        totalCount: 0,
        tableHeader: [{
          title: '出库单号',
          key: 'id',
          minWidth: 220
        }, {
          title: '订单单号',
          key: 'orderId',
          minWidth: 220
        }, {
          title: '客户名称',
          key: 'customerName',
          minWidth: 180,
          render: (h, params) => {
            return h('div', params.row.customer.name)
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
          minWidth: 180
        }, {
          title: '配送人',
          key: 'deliveryMan',
          minWidth: 130,
          render: (h,params)=>{
            return h('div', params.row.deliveryMan.name)
          }
        }, {
          title: '状态',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            return h('div', outStatus(params.row.status))
          }
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 110
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
          minWidth: 220,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.orderTable.$scopedSlots.action({
                row: params.row
              })
            )
          }
        }],
        detailItem: {},
        detailShow: false
      }
    },
    computed: {
      pageFilter() {
        return {
          id: this.pageApi.id,
          orderId: this.pageApi.orderId,
          customerName: this.pageApi.customerName,
          status: this.pageApi.status,
          updateUser: this.pageApi.updateUser,
          updateTimeBegin: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          updateTimeEnd: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          deliveryManId: this.pageApi.deliveryManId
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
          id: '',
          orderId: '',
          customerName: '',
          status: '',
          updateUser: '',
          updateTimeBegin: '',
          updateTimeEnd: '',
          pageIndex: 1,
          pageSize: 10,
          deliveryManId: ''
        }
        this.dateValue = ['', '']
      },
      getList(params) {
        this.$http.post(this.$api.wareHouseOrderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      // 出库单详情
      getItem(item) {
        this.$http.post(this.$api.wareHouseOutDetail, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
      },
      // 查看明细
      detail(item) {
        this.detailShow = true;
        this.detailItem = Object.assign({}, item)
      },
      // 确认出库单
      confirm(item) {
        this.$Modal.confirm({
          title: '确认出库',
          content: '确认出库？',
          onOk: () => {
            this.$http.post(this.$api.wareHouseOutconfirmOut, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('确认成功')
                this.getList(this.pageFilter)
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      // 出库
      out(item) {
        this.outApi.id = item.id;
        this.outShow = true;
      },
      cancelOut(name){
        this.outApi.deliveryManId = '';
        this.$refs[name].resetFields();
        this.outShow = false;
      },
      saveOut(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.outApi);
            this.$http.post(this.$api.wareHouseOutproductOut, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('出库成功')
                this.getList(this.pageFilter);
                this.outShow = false;
                this.outApi.id = '';
                this.outApi.deliveryManId = '';
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      // 打印出库单
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
              h('div', '正在生成打印出库单...')
            ])
          }
        });
        this.$http.post(this.$api.wareHouseOutPrint, {
          wareHouseOutId: item.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
      getDelivery(){
        this.$http.post(this.$api.findAllDeliveryMan,{manType: 1}).then(res =>{
          if(res.code === 1000){
            this.deliveryList = res.data;
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getDelivery();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>