<template>
  <div class="openBill">
    <!-- 已添加的货物列表 -->
    <Card class="goods-list" dis-hover title="入库开单">
      <div class="base-info">
        <Form :model="baseApi" ref="baseForm" :rules="baseRule" :label-width="110" inline>
          <FormItem label="开单日期：">
            <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="baseApi.newOrderDate" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="入库类型：" prop="inType">
            <Select v-model="baseApi.inType" style="width: 180px;">
              <Option v-for="(item,index) in [{id:1,name: '采购入库'},{id:2,name: '退货入库'},{id:3,name:'其他入库'}]" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="送货人：">
            <Input v-model="baseApi.driver" placeholder="请输入" style="width: 180px;"></Input>
          </FormItem>
          <FormItem label="送货人联系方式：">
            <Input v-model="baseApi.driverPhone" placeholder="请输入" style="width: 180px;"></Input>
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="baseApi.remark" placeholder="请输入" style="width: 180px;"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="goods-info page-inner">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="5">产品名称</Col>
                <Col class-name="col" span="5">所属分类</Col>
                <Col class-name="col" span="5">入库数量</Col>
                <Col class-name="col" span="5">成本价</Col>
                <Col class-name="col" span="4">操作</Col>
              </Row>
              <Row v-for="(item,index) in baseApi.wareHouseInItem" :key="index">
                <Row>
                  <Col span="24" class="wareHouseName">{{item.wareHouseName}} <Button style="margin-left:20px;" size="small" type="primary" @click="chooseProducts(index,item)">选择产品</Button></Col>
                </Row>
                <Row v-for="(sub,idx) in item.items" :key="idx">
                <Col class-name="col" span="5">{{sub.name}}</Col>
                <Col class-name="col" span="5">{{sub.categoryName}}</Col>
                <Col class-name="col" span="5">
                  <InputNumber :min="0"  v-model.number="sub.num" size="small" style="width:80px;"></InputNumber>{{sub.unit}}
                </Col>
                <Col class-name="col" span="5">
                  <InputNumber :min="0" v-model.number="sub.cost" size="small" style="width:80px;"></InputNumber>元/{{sub.unit}}
                </Col>
                <Col class-name="col" span="4">
                  <Button type="primary" size="small" @click="delRow(index,idx)">删除</Button>
                </Col>
                </Row>
              </Row>
              </Row>
            </div>
          </div>
      </div>
      <div class="bottom-options">
        <div class="btn-block">
        <Button type="primary" @click="save(1,'baseForm')">保存</Button>
        </div>
        <div class="btn-block">
        <Button type="warning" @click="save(0,'baseForm')">暂存</Button>
        </div>
        <div class="btn-block">
        <Button @click="goback">返回</Button>
        </div>
      </div>
    </Card>
    <Modal title="选择产品" width="800" v-model="show" :mask-closable="false">
      <selectGoods v-if="show" @on-select="onselect" :checkList="goodsList" :wareHouseId="wareHouseId" :hasSelect="productIds"></selectGoods>
      <div slot="footer">
        <Button type="primary" @click="chooseGoods">选择</Button>
        <Button @click="resetGoods">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import selectGoods from '../../../components/selectGoods/index'
  export default {
    components: {
      selectGoods
    },
    data() {
      return {
        baseApi: {
          remark: '',
          newOrderDate: '',
          inType: 1,
          driver: '',
          driverPhone: '',
          status: '',
          wareHouseInItem: []
        },
        detailItem: {},
        baseRule: {
          inType: [{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'number'
          }]
        },
        date: '',
        formRow: {},
        selectGoods: [],
        show: false,
        goodsList: [],
        act: false, // 用于触发渲染
        storeList: [],
        wareHouseId: '',
        currentIndex: 0
      }
    },
    computed: {
      isEdit() {
        return this.$route.query.status === 2; // 是否编辑
      },
      isId() {
        return this.$route.query.id
      },
      itemId() {
        return this.$route.query.rkid
      },
      hasWareHouse() {
        return this.wareHouseId != ''
      },
      productIds() {
        let arr = [];
        this.goodsList.map(el => {
          arr.push(el.productId)
        })
        return arr.toString();
      }
    },
    watch: {
      'baseApi.newOrderDate' (val) {
        if (val != '') {
          this.date = val.getTime()
        }
      },
      'detailItem' (val) {
        val.purchaseOrderItems.map(el => {
          el.items.map(sub => {
            sub.cost = null;
          })
        })
        this.baseApi.wareHouseInItem = [...val.purchaseOrderItems]
      }
    },
    methods: {
      // 返回
      goback() {
        this.$router.go(-1);
      },
      onselect(data) {
        this.selectGoods = [...data];
        this.$nextTick(() => {
          this.act = !this.act;
        })
      },
      // 编辑时获取详情
      getDetail() {
        this.$http.post(this.$api.wareHouseInDetail, {
          id: this.isId
        }).then(res => {
          if (res.code === 1000) {
            this.baseApi = {
              remark: res.data.remark,
              newOrderDate: new Date(Date.parse(res.data.newOrderDate.replace(/-/g, "/"))),
              inType: res.data.inType,
              driver: res.data.driver,
              driverPhone: res.data.driverPhone,
              status: res.data.status
            }
            res.data.wareHouseInItems.map(el => {
              el.name = el.productName;
              el.categoryName = el.productCategory;
            })
            this.baseApi.wareHouseInItem = [...res.data.wareHouseInItems]
          }
        })
      },
      chooseProducts(index,item) {
        this.currentIndex = index;
        this.wareHouseId = item.wareHouseId;
        this.goodsList = [...item.items];
        if (this.hasWareHouse) {
          this.show = true;
        } else {
          this.$Message.error('请先选择仓库')
        }
      },
      // 选择产品
      chooseGoods() {
        if (this.selectGoods.length > 0) {
          this.baseApi.wareHouseInItem[this.currentIndex].items = [...this.selectGoods];
          this.show = false;
        } else {
          this.$Message.error('请选择产品')
        }
      },
      // 取消选择产品
      resetGoods() {
        this.show = false;
      },
      //  删除行
      delRow(index,idx) {
        this.baseApi.wareHouseInItem[index].items.splice(idx, 1)
        this.$nextTick(() => {
          this.act = !this.act
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
      //  获取当前服务器时间
      currentTime() {
        this.$http.post(this.$api.serverTime).then(res => {
          if (res.code === 1000) {
            this.baseApi.newOrderDate = new Date(res.data);
          }
        })
      },
      //  验证入库数量、成本价不能为空
      checkItems(){
        let isOk = true;
        this.baseApi.wareHouseInItem.map(el =>{
          if(el.items.length){
            el.items.map(sub =>{
              if(sub.cost === null || sub.num === null){
                isOk = false
                console.log(sub.cost)
              }
            })
          }
        })
        return isOk
      },
      // 保存编辑
      save(status, name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.baseApi.wareHouseInItem.length > 0) {
              if (this.checkItems()) {
                const params = this.$clearData(this.baseApi);
                params.wareHouseInItem = JSON.stringify(params.wareHouseInItem);
                params.status = status;
                params.newOrderDate = params.newOrderDate != '' ? this.date : '';
                params.purchaseOrderId = this.itemId;
                if (this.isEdit) {
                  params.id = this.isId
                }
                const urlApi = this.isEdit ? this.$api.wareHouseupdateIn : this.$api.wareHouseIn;
                this.$http.post(urlApi, params).then(res => {
                  if (res.code === 1000) {
                    this.$Modal.confirm({
                      title: '入库成功',
                      content: '确认是否需要继续采购入库？',
                      onOk: () => {
                        this.$router.push({
                          name: 'purchasingList'
                        });
                      },
                      onCancel: () => {
                        this.$router.push({
                          name: 'inventoryList'
                        });
                      }
                    })
                  } else {
                    this.$Message.error(res.message)
                  }
                })
              } else {
                this.$Message.error('表单验证失败')
              }
            } else {
              this.$Message.error('请选择货物')
            }
          } else {
            this.$Message.error('表单验证失败')
          }
        })
      },
      details() {
        this.$http.post(this.$api.findPurchaseOrderIn, {
          id: this.itemId
        }).then(res => {
          if (res.code === 1000) {
            res.data.purchaseOrderItems.map(el => {
              el.items.map(sub => {
                sub.name = sub.productName;
                sub.categoryName = sub.productCategory
              })
            })
            this.detailItem = Object.assign({}, res.data)
          }
        })
      },
    },
    created() {
      this.getWareHouse();
      if (this.isEdit) {
        this.getDetail();
      } else {
        this.currentTime();
      }
      this.details();
    },
    mounted() {
      this.$nextTick(() => {
        this.act = !this.act;
      })
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../../assets/less/base.less');
  .order-main {
    margin-top: 20px;
    .order-main-header {
      height: 46px;
      line-height: 46px;
      background-color: #f8f8f9;
      padding: 0 15px;
      margin-bottom: 15px;
      font-weight: 700;
      span {
        float: right;
      }
    }
    .order-row-col {
      margin-bottom: 10px;
    }
  }
  .wareHouseName{
    text-align: left;
    padding-left: 20px;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec
  }
  .openBill {
    .goods-list {
      margin-bottom: 15px;
    }
    .goods-info {
      .add-goods {
        padding-bottom: 15px;
      }
    }
    .bottom-options {
      padding: 20px 0;
      .btn-block {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
</style>