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
          <FormItem label="仓库名称：">
            <Select v-model="pageApi.wareHouseId" style="width: 180px;">
                              <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
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
                                    <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 2" @click="out(false,props.row)">出库</Button>
                                    <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 3" @click="out(true,props.row)">完成出库</Button>
                                    <Button type="info" size="small" v-if="props.row.status != 9" @click="print(props.row)">打印</Button>
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
            <Col class-name="col" :span="detailItem.status === 4 || detailItem.status === 3 ? 6 : 12">下单出库数量</Col>
            <Col class-name="col" span="6" v-if="detailItem.status === 4 || detailItem.status === 3">实际出库数量</Col>
          </Row>
          <Row v-for="(item,index) in detailItem.wareHouseOutItems" :key="index">
            <Col class-name="col" span="6">{{item.productName}}</Col>
            <Col class-name="col" span="6">{{item.productCategory}}</Col>
            <Col class-name="col" :span="detailItem.status === 4 || detailItem.status === 3 ? 6 : 12">{{item.num}}{{item.unit}}</Col>
            <Col class-name="col" span="6" v-if="detailItem.status === 4 || detailItem.status === 3">{{item.realNum}}{{item.unit}}</Col>
          </Row>
        </div></div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal title="选择配送人" width="1000" v-model="outShow" :mask-closable="false">
         <Form :model="outApi" ref="baseForm" :rules="baseRule" :label-width="110" >
          <FormItem label="配送人：" prop="deliveryManId">
            <Select v-model="outApi.deliveryManId" style="width: 200px;">
              <Option v-for="(item,index) in deliveryList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          </Form>
          <Table ref="overTable" disabled-hover border :columns="goodsHeader" :data="outApi.outItems" >
          <!-- 实单数量 -->
          <template slot="realNum" slot-scope="props">
            <Form :ref="'formRow'+props.idx" :model="props.row">
              <FormItem prop="realNum" :rules="{required: true, message: '请输入数量', trigger: 'blur', type: 'number'}">
                <InputNumber :min="0" v-model.number="props.row.realNum" size="small" style="width:60px;"></InputNumber>{{props.row.unit}}
              </FormItem>
            </Form>
          </template>
        <!-- 实单单价 -->
          <template slot="realPrice" slot-scope="props">
            <Form :ref="'formRow'+props.idx" :model="props.row">
              <FormItem prop="realPrice" :rules="{required: true, message: '请输入单价', trigger: 'blur', type: 'number'}">
                <InputNumber :min="0" v-model.number="props.row.realPrice" size="small" style="width:60px;"></InputNumber>元/{{props.row.unit}}
              </FormItem>
            </Form>
          </template>
        </Table>
              <div class="add-fee page-inner">
        <Button type="primary" @click="addFee" style="margin-bottom:20px;">添加其他费用</Button>
        <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">费用名称</Col>
            <Col class-name="col" span="4">金额</Col>
            <Col class-name="col" span="4">数量</Col>
            <Col class-name="col" span="4">小计</Col>
            <Col class-name="col" span="4">备注</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in outApi.orderFees" :key="index">
            <Col class-name="col" span="4" style="height: auto;overflow: inherit;">
            <Select v-model="item.feeName" size="small" @on-change="feeNameSelect(index,$event)">
                <Option v-for="(option,i) in feeList" :value="option.feeName"  :disabled="option.disabled" :key="option.id">{{ option.feeName }}</Option>
            </Select>
            </Col>
            <Col class-name="col" span="4">
              <InputNumber :min="0"v-model.number="item.feeAmount" size="small" style="width:80px;"></InputNumber>
            </Col>
            <Col class-name="col" span="4">
              <InputNumber :min="0" v-model.number="item.totalNum" size="small" style="width:80px;"></InputNumber>
            </Col>
            <Col class-name="col" span="4">
              {{`￥${(item.feeAmount * item.totalNum).toFixed(2)}`}}
            </Col>
            <Col class-name="col" span="4">
            <Input v-model="item.remark" placeholder="请输入" size="small"></Input>
            </Col>
            <Col class-name="col" span="4">
            <Button type="error" size="small" @click="delRow(index,item)">删除</Button>
            </Col>
          </Row>
          </Row>
          <Row v-if="outApi.orderFees.length == 0">
            <Col class-name="col" span="24">暂无费用</Col>
          </Row>
        </div>
      </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveOut('baseForm')">{{isEdit ? '完成出库':'出库'}}</Button>
        <Button @click="cancelOut('baseForm')">取消</Button>
      </div>
    </Modal>
    <Modal title="打印出库单" width="500" v-model="printShow" :mask-closable="false" @on-cancel="printCancel">
         <Form :label-width="220" >
          <FormItem label="实配数量、单价、金额是否显示打印：">
            <RadioGroup v-model="withReal">
                <Radio :label="0">
                    <span>不显示</span>
                </Radio>
                <Radio :label="1">
                    <span>显示</span>
                </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="打印出库单：">
            <RadioGroup v-model="printMore">
                <Radio :label="1" :disabled="this.role === 'ADMIN' ? false : true">
                    <span>按销售单打印</span>
                </Radio>
                <Radio :label="2">
                    <span>按出库单打印</span>
                </Radio>
            </RadioGroup>
          </FormItem>
          </Form>
      <div slot="footer">
        <Button type="primary" @click="printMuti">打印</Button>
        <Button @click="printCancel">取消</Button>
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
          deliveryManId: '',
          wareHouseId: ''
        },
        storeList: [],
        outApi: {
          id: '',
          deliveryManId: '',
          outItems: [],
          orderFees: []
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
        goodsHeader: [{
          title: '产品名称',
          key: 'productName',
          maxWidth: 150
        }, {
          title: '所属分类',
          key: 'productCategory',
          maxWidth: 150
        }, {
          title: '单价',
          key: 'price',
          maxWidth: 100,
          render: (h, params) => {
            let str = `${params.row.price}元/${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '下单数量',
          key: 'num',
          maxWidth: 100,
          render: (h, params) => {
            let str = `${params.row.num}${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '实单数量',
          key: 'realNum',
          minWidth: 70,
          render: (h, params) => {
            this.outApi.outItems[params.index] = params.row
            return h(
              'div',
              this.$refs.overTable.$scopedSlots.realNum({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '实单单价',
          key: 'realPrice',
          minWidth: 70,
          render: (h, params) => {
            this.outApi.outItems[params.index] = params.row
            return h(
              'div',
              this.$refs.overTable.$scopedSlots.realPrice({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '金额',
          key: 'totalPrice',
          maxWidth: 100,
          render: (h, params) => {
            let str = `￥${(params.row.price*params.row.num).toFixed(2)}`;
            return h('div', str)
          }
        }, {
          title: '实单金额',
          key: 'realTotalPrice',
          maxWidth: 100,
          render: (h, params) => {
            let str = `￥${(params.row.realPrice*params.row.realNum).toFixed(2)}`;
            return h('div', str)
          }
        }],
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
            return h('div', params.row.customerName)
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
        },{
          title: '仓库',
          key: 'wareHouseName',
          minWidth: 120
        }, {
          title: '配送人',
          key: 'deliveryMan',
          minWidth: 130,
          render: (h, params) => {
            return h('div', params.row.deliveryManName)
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
          minWidth: 230,
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
        detailShow: false,
        printShow: false,
        printMore: 1,
        printId: '',
        feeIndex: 0,
        feeList: [],
        isEdit: false,
        withReal: 0
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
          deliveryManId: this.pageApi.deliveryManId,
          wareHouseId: this.pageApi.wareHouseId
        }
      },
      role(){
        return this.$store.state.base ?  this.$store.state.base.loginInfo.currentRoleCode : '';
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
          deliveryManId: '',
          wareHouseId: ''
        }
        this.dateValue = ['', '']
      },
      getList(params) {
        this.$http.post(this.$api.wareHouseOrderPage1, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size) {
        this.pageApi.pageSize = size;
      },
      // 出库单详情
      getItem(isEdit,item) {
        this.$http.post(this.$api.wareHouseOutDetail, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
            res.data.wareHouseOutItems.map(el =>{
              if(el.realNum === ''){
                el.realNum = el.num;
              }
            })
            this.outApi.outItems = [...res.data.wareHouseOutItems];
            if(isEdit){
              this.outApi.deliveryManId = res.data.deliveryMan.id;
              this.outApi.orderFees = [...res.data.orderFeeList]
            }
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
      // 出库 isEdit  出库or完成出库
      out(isEdit,item) {
        this.isEdit = isEdit;
        this.getItem(isEdit,item)
        this.outApi.id = item.id;
        this.outShow = true;
      },
      cancelOut(name) {
        this.outApi.deliveryManId = '';
        this.$refs[name].resetFields();
        this.clearFee();
        this.outApi.outItems = [];
        this.outApi.orderFees = [];
        this.outShow = false;
      },
      saveOut(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.outApi);
            params.orderFees = JSON.stringify(params.orderFees);
            params.outItems = JSON.stringify(params.outItems);
            const saveUrl = this.isEdit ? this.$api.wareHouseOutfinishOut : this.$api.wareHouseOutproductOut
            this.$http.post(saveUrl, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '完成出库':'出库成功')
                this.getList(this.pageFilter);
                this.outShow = false;
                this.outApi.id = '';
                this.outApi.deliveryManId = '';
                this.clearFee();
                this.outApi.outItems = [];
                this.outApi.orderFees = [];
                this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('请选择配送人');
          }
        })
      },
      // 打印出库单
      print(item) {
        const isMulti = item.multiWareHouseOutOrder === 1 ? true : false;
          this.printShow = true;
          this.printId = item.id;
      },
      printMuti() {
        this.printMethod(this.printId);
      },
      printMethod(id) {
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
          wareHouseOutId: id,
          multiWareHouseOutOrder: this.printMore,
          withReal: this.withReal
        }).then(res => {
          if (res.code === 1000) {
            this.printCancel();
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
      //  取消打印
      printCancel(){
        this.printShow = false;
        this.withReal = 0;
        if(this.role != 'ADMIN'){
          this.printMore = 2;
        }else{
          this.printMore = 1
        }
      },
      getDelivery() {
        this.$http.post(this.$api.findAllDeliveryMan, {
          manType: 1
        }).then(res => {
          if (res.code === 1000) {
            this.deliveryList = res.data;
          }
        })
      },
      // 重置其他费用不可选
      clearFee() {
        this.feeList.map(el => {
          el.disabled = false;
        })
      },
      getFee() {
        this.$http.post(this.$api.findAllFee).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data.map(el => {
              el.disabled = false;
              return el;
            });
          }
        })
      },
      //  增加费用行
      addFee() {
        this.feeIndex++;
        this.outApi.orderFees.push({
          feeId: '',
          feeName: '',
          feeAmount: 0,
          totalNum: 1,
          amount: 0,
          remark: ''
        })
      },
      //  删除费用行
      delRow(idx, item) {
        this.outApi.orderFees.splice(idx, 1);
        this.feeList.map(el => {
          if (el.feeName === item.feeName) {
            el.disabled = false;
          }
        })
      },
      feeNameSelect(idx, eve) {
        this.feeList.map(el => {
          if (el.feeName === eve) {
            el.disabled = true;
            this.outApi.orderFees[idx].feeId = el.id;
            this.outApi.orderFees[idx].feeAmount = el.feeAmount;
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
    },
    created() {
      this.getList(this.pageFilter);
      this.getDelivery();
      this.getFee();
      this.getWareHouse();
      if(this.role != 'ADMIN'){
        this.printMore = 2;
      }
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .add-fee {
    padding-top: 20px;
  }
</style>