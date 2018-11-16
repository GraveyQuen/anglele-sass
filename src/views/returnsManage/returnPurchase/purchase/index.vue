<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover :title="isEdit ? '编辑退货采购':'新增退货采购'">
      <Button type="primary" slot="extra" @click="save(1)" class="extra-button" style="margin-right:15px;">保存</Button>
      <Button type="primary" slot="extra" @click="save(0)" class="extra-button" style="margin-right:15px;">暂存</Button>
      <Button slot="extra" class="extra-button" @click="goBack">取消</Button>
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="110" inline>
        <FormItem label="开单日期：">
          <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="dataApi.orderDate" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="仓库：" prop="wareHouseId">
          <Select v-model="dataApi.wareHouseId" style="width: 200px;">
              <Option v-for="(item,index) in wareHouseList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="供货商：">
          <Input v-model="dataApi.provider" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="供货商联系方式：">
          <Input v-model="dataApi.providerPhone" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="开单人：">
          <div v-if="base">{{base.loginInfo.userName}}</div>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="dataApi.remark" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
      </Form>
      <div class="choose-product">
        <div class="choose-product-btn">
          <Button type="primary" @click="chooseBtn">选择产品</Button>
        </div>
        <div class="choose-product-table">
          <Table ref="productTable" border :columns="goodsHeader" :data="dataApi.items">
            <!-- 操作 -->
            <template slot="action" slot-scope="props">
                    <Poptip @on-ok="delProductRow(props.idx)" confirm title="确认删除此条产品？" transfer>
                      <Button type="warning" size="small">删除</Button>
                    </Poptip>
</template>
            <!-- 退货数量 -->
<template slot="refundNum" slot-scope="props">
  <Form :ref="'formRow'+props.idx" :model="props.row">
    <FormItem prop="refundNum" :rules="{required: true, message: '请输入数量', trigger: 'blur',type: 'number'}">
      <InputNumber :min="0" v-model.number="props.row.refundNum" size="small" style="width:60px;"></InputNumber>{{props.row.unit}}
    </FormItem>
  </Form>
</template>
            </Table>
          </div>
        </div>
    </Card>
    <Modal title="选择产品" width="800" v-model="pshow" :mask-closable="false">
      <selectGoods v-if="pshow" @on-select="onselect" :wareHouseId="dataApi.wareHouseId" :checkList="dataApi.items" :hasSelect="productIds"></selectGoods>
      <div slot="footer">
        <Button type="primary" @click="chooseGoods">选择</Button>
        <Button @click="resetGoods">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import selectGoods from '../../../components/selectGoods/index.vue'
  export default {
    components: {
      selectGoods
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dataApi: {
          id: '',
          orderDate: '',
          refundOrderId: '',
          wareHouseId: '',
          provider: '',
          providerPhone: '',
          remark: '',
          status: '',
          items: []
        },
        goodsHeader: [{
          title: '产品名称',
          key: 'productName',
        }, {
          title: '分类名称',
          key: 'productCategory',
        }, {
          title: '现有库存',
          key: 'total',
          render: (h, params) => {
            let str = `${params.row.total}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '退货数量',
          key: 'refundNum',
          render: (h, params) => {
            this.dataApi.items[params.index] = params.row
            return h(
              'div',
              this.$refs.productTable.$scopedSlots.refundNum({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '退货金额',
          key: 'totalMoney',
          render: (h, params) => {
            let str = params.row.refundNum != '' ? (params.row.price * Number(params.row.refundNum)).toFixed(2) : 0;
            return h('div', '￥'+str)
          }
        }, {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.productTable.$scopedSlots.action({
                idx: params.row._index
              })
            )
          }
        }],
        rule: {
          wareHouseId: [{
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }]
        },
        wareHouseList: [],
        serverTime: '',
        pshow: false,
        selectProduct: [],
        selectList: [],
        act: false
      }
    },
    computed: {
      currentData() {
        return this.dataApi.orderDate != '' ? this.dataApi.orderDate.getTime() : ''
      },
      base() {
        return this.$store.state.base
      },
      productIds() {
        let arr = [];
        this.dataApi.items.map(el => {
          arr.push(el.productId)
        })
        return arr.toString();
      },
      isOk() {
        let isOk = true;
        this.dataApi.items.map(el => {
          if (el.refundNum === null) {
            isOk = false
          }
        })
        return isOk;
      },
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      save(status) {
        if (this.dataApi.items.length) {
          if (this.isOk) {
            const params = this.$clearData(this.dataApi);
            params.status = status;
            params.items = JSON.stringify(params.items);
            params.orderDate = this.currentData;
            this.$Modal.confirm({
              title: status === 0 ? '暂存退货采购':'保存退货采购',
              content: status === 0 ? '确认暂存退货采购？':'确认保存退货采购？',
              onOk: () => {
                this.$http.post(this.$api.purchaseRefund,params).then(res => {
                  if (res.code === 1000) {
                    this.$Message.success(status === 0 ? '暂存成功':'保存成功');
                    this.$router.push({name: 'returnPurchaseList'})
                  } else {
                    this.$Message.error(res.message);
                  }
                })
              }
            })
          } else {
            this.$Message.error('退货数量不能为空')
          }
        } else {
          this.$Message.error('请选择产品')
        }
      },
      goBack() {
        this.$router.go(-1)
      },
      findWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (!this.isEdit) {
            this.dataApi.wareHouseId = res.data[0].id
          }
          this.wareHouseList = res.data;
        })
      },
      //  获取当前服务器时间
      currentTime() {
        this.$http.post(this.$api.serverTime).then(res => {
          if (res.code === 1000) {
            this.serverTime = new Date(res.data);
            if (!this.isEdit) {
              this.dataApi.orderDate = new Date(res.data);
            }
          }
        })
      },
      chooseBtn() {
        this.pshow = true;
      },
      // 选择产品
      onselect(data) {
        this.selectList = [...data];
      },
      // 确认选择产品
      chooseGoods() {
        this.dataApi.items = [...this.selectList];
        this.pshow = false;
      },
      // 取消选择产品
      resetGoods() {
        this.selectList = [];
        this.pshow = false;
      },
      delProductRow(idex) {
        this.dataApi.items.splice(idex, 1);
        this.$nextTick(() => {
          this.act = !this.act;
        })
      },
      getDetail(){
        this.$http.post(this.$api.findPurchaseRefund, {
          id: this.id
        }).then(res => {
          if (res.code === 1000) {
            res.data.items.map(el =>{
              el.categoryName = el.productCategory;
              el.name = el.productName;
              el.price = el.cost;
            });
            this.dataApi = {
              id: res.data.order.id,
              orderDate: new Date(Date.parse(res.data.order.orderDate.replace(/-/g, "/"))),
              refundOrderId: res.data.order.refundOrderId,
              wareHouseId: res.data.order.wareHouseId,
              provider: res.data.order.provider,
              providerPhone: res.data.order.providerPhone,
              remark: res.data.order.remark,
              status: res.data.order.status,
              items: res.data.items
            }
          }
        })
      },
      getRefund(){
        this.$http.post(this.$api.findOneRefund,{id: this.id}).then(res =>{
          if(res.code === 1000){
            res.data.refundOrder.refundOrderItems = res.data.refundOrder.refundOrderItems.filter(item => item.refundNum != 0);
            res.data.refundOrder.refundOrderItems.map(el =>{
              el.categoryName = el.productCategory;
              el.name = el.productName;
              el.price = el.cost;
            });
            this.dataApi = {
              id: '',
              orderDate: this.dataApi.orderDate,
              refundOrderId: res.data.refundOrder.id,
              wareHouseId: this.dataApi.wareHouseId,
              provider: '',
              providerPhone: '',
              remark: res.data.refundOrder.remark,
              status: '',
              items: res.data.refundOrder.refundOrderItems[0].item
            }
          }
        })
      }
    },
    created() {
      this.currentTime();
      this.findWareHouse();
      if(this.isEdit){
        this.getDetail();
      }else{
        if(this.id != ''){
          this.getRefund();
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  @import url("../../../../assets/less/base.less");
  .choose-product {
    .choose-product-table {
      padding: 20px 0;
    }
  }
</style>