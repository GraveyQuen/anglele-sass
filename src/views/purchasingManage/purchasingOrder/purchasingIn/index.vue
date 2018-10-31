<template>
  <div class="openBill">
    <!-- 已添加的货物列表 -->
    <Card class="goods-list" dis-hover title="入库开单">
      <div class="base-info">
        <Form :model="baseApi" ref="baseForm" :rules="baseRule" :label-width="110" inline>
          <FormItem label="开单日期：">
            <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="baseApi.newOrderDate" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="仓库名称：" prop="wareHouseId">
            <Select v-model="baseApi.wareHouseId" style="width: 180px;">
                                    <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
                                  </Select>
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
      <div class="goods-info">
        <div class="add-goods">
          <Button type="primary" @click="chooseProducts">选择产品</Button>
        </div>
        <Table ref="goodsTable" border :columns="goodsHeader" :data="goodsList" style="max-width: 752px;">
          <!-- 入库数量 -->
          <template slot="num" slot-scope="props">
                  <Form :ref="'formRow'+props.idx" :model="props.row">
                    <FormItem prop="num" :rules="{required: true, message: '请输入数量', trigger: 'blur',type: 'number'}">
                      <InputNumber :min="0" v-model.number="props.row.num" size="small" style="width:60px;"></InputNumber>{{props.row.unit}}
                    </FormItem>
                  </Form>
</template>
          <!-- 成本价 -->
<template slot="cost" slot-scope="props">
  <Form :model="props.row">
    <FormItem>
      <InputNumber :min="0" v-model.number="props.row.cost" size="small" style="width:60px;"></InputNumber>元/{{props.row.unit}}
    </FormItem>
  </Form>
  </Form>
</template>
           <!-- 操作 -->
<template slot="action" slot-scope="props">
  <Poptip @on-ok="delRow(props.idx)" confirm title="确认删除此条产品？" transfer>
    <Button type="warning" size="small">删除</Button>
  </Poptip>
</template>
        </Table>
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
      <selectGoods v-if="show" @on-select="onselect" :checkList="goodsList" :hasSelect="productIds"></selectGoods>
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
          wareHouseId: '',
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
          wareHouseId: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
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
        goodsHeader: [{
          title: '产品名称',
          key: 'name',
          maxWidth: 150
        }, {
          title: '所属分类',
          key: 'categoryName',
          maxWidth: 150
        }, {
          title: '入库数量',
          key: 'nums',
          maxWidth: 140,
          render: (h, params) => {
            this.goodsList[params.index] = params.row
            return h(
              'div',
              this.$refs.goodsTable.$scopedSlots.num({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '成本价',
          key: 'cost',
          maxWidth: 130,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.goodsTable.$scopedSlots.cost({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '操作',
          key: 'action',
          maxWidth: 180,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.goodsTable.$scopedSlots.action({
                idx: params.row._index
              })
            )
          }
        }]
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
      isOk() {
        let isOk = true;
        this.goodsList.map(el => {
          if (el.num === null) {
            isOk = false
          }
        })
        return isOk;
      },
      hasWareHouse() {
        return this.baseApi.wareHouseId != ''
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
        let arr = [];
        val.purchaseOrderItems.map(el => {
          el.items.map(sub => {
            sub.cost = null;
            arr.push(sub)
          })
        })
        this.goodsList = [...arr]
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
              wareHouseId: res.data.wareHouseId,
              remark: res.data.remark,
              newOrderDate: new Date(Date.parse(res.data.newOrderDate.replace(/-/g, "/"))),
              inType: res.data.inType,
              driver: res.data.driver,
              driverPhone: res.data.driverPhone,
              status: res.data.status
            }
            let arr = [];
            res.data.wareHouseInItems.map(el => {
              el.name = el.productName;
              el.categoryName = el.productCategory;
            })
            this.goodsList = [...res.data.wareHouseInItems]
          }
        })
      },
      chooseProducts() {
        if (this.hasWareHouse) {
          this.show = true;
        } else {
          this.$Message.error('请先选择仓库')
        }
      },
      // 选择产品
      chooseGoods() {
        if (this.selectGoods.length > 0) {
          this.goodsList = [...this.selectGoods];
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
      delRow(idx) {
        this.goodsList.splice(idx, 1)
        this.$nextTick(() => {
          this.act = !this.act
        })
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            if (!this.isEdit) {
              res.data.map((el, index) => {
                if (index === 0) {
                  this.baseApi.wareHouseId = el.id;
                }
              })
            }
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
      // 保存编辑
      save(status, name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.goodsList.length > 0) {
              if (this.isOk) {
                const params = this.$clearData(this.baseApi);
                params.wareHouseInItem = JSON.stringify(this.goodsList);
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
        this.$http.post(this.$api.findPurchaseOrder, {
          id: this.itemId
        }).then(res => {
          if (res.code === 1000) {
            let arr = [];
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