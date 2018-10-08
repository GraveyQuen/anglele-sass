<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="代客开单">
      <Form :label-width="100" style="max-width: 900px;" inline>
        <FormItem label="选择客户：">
          <Select v-model="dataApi.customerId" filterable remote clearable :remote-method="remote" :loading="loading" style="width:300px;">
            <Option v-for="(option, index) in customerList" :value="option.id" :key="index">{{option.name}}</Option>
          </Select>
        </FormItem>
        <div class="other-info-wrapper" v-if="hasCustonmer">
        <div class="other-info">
          <FormItem label="客户名称：">
            {{customerData.name}}
          </FormItem>
          <FormItem label="客户联系人：">
            {{customerData.contactPeople}}
          </FormItem>
          <FormItem label="客户联系电话：">
            {{customerData.contactPhone}}
          </FormItem>
        </div>
        <div class="other-info">
          <FormItem label="送货地址：">
            {{customerData.provinceName}}{{customerData.cityName}}{{customerData.districtName}}{{customerData.address}}
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="dataApi.remark" placeholder="请输入..."></Input>
          </FormItem>
        </div>
        <div class="other-info">
          <Button type="primary" @click="show = true">选择产品</Button>
          <div class="table">
            <Table ref="goodsTable" border :columns="goodsHeader" :data="goodsList" style="max-width: 752px;">
              <!-- 下单数量 -->
              <template slot="num" slot-scope="props">
                <Form :ref="'formRow'+props.idx" :model="props.row">
                  <FormItem prop="num" :rules="{required: true, message: '请输入数量', trigger: 'blur',type:'number'}">
                    <!-- <Input v-model.number="props.row.num" size="small" placeholder="请输入" style="width:80px;"></Input> -->
                    <InputNumber :min="1" v-model.number="props.row.num" size="small" style="width:80px;"></InputNumber>{{props.row.unit}}
                  </FormItem>
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
          <div class="btns">
            <Button type="primary" @click="save" style="margin-right: 20px;">保存</Button>
            <Button @click="reset">取消</Button>
          </div>
        </div>
        </div>
      </Form>
    </Card>
    <Modal title="选择产品" width="800" v-model="show" :mask-closable="false">
      <selectGoods v-if="show" @on-select="onselect" :isBill="true" :hasSelect="productIds" :wareHouseId="wareHouseId" :checkList="goodsList"></selectGoods>
      <div slot="footer">
        <Button type="primary" @click="chooseGoods">选择</Button>
        <Button @click="resetGoods">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import selectGoods from '../../components/selectGoods/index.vue'
  export default {
    components: {
      selectGoods
    },
    data() {
      return {
        act: false, // 用于触发渲染
        show: false,
        customerList: [],
        customerApi: {
          pageIndex: 1,
          pageSize: 15,
          param: ''
        },
        loading: false,
        dataApi: {
          customerId: '',
          remark: '',
          items: ''
        },
        customerData: {},
        selectList: [],
        goodsList: [],
        formRow: {},
        wareHouseId: '', // 选择产品需要将仓库id传入
        goodsHeader: [{
          title: '产品名称',
          key: 'name',
          maxWidth: 150
        }, {
          title: '所属分类',
          key: 'categoryName',
          maxWidth: 150
        }, {
          title: '单价',
          key: 'price',
          maxWidth: 150,
          render: (h, params) => {
            let str = `${params.row.price}/${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '下单数量',
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
      hasCustonmer() {
        return this.dataApi.customerId != '' && this.dataApi.customerId != undefined
      },
      checkNum(){ // 验证下单数量不能为空
        let isOK = true;
        this.goodsList.map(el =>{
          if(el.num === null){
            isOK = false
          }
        })
        return isOK;
      },
      productIds(){
        let arr = [];
        this.goodsList.map(el =>{
          arr.push(el.productId)
        })
        return arr.toString();
      }
    },
    watch: {
      'dataApi.customerId' (val) {
        if (val != '' || val != undefined) {
          this.customerList.map(el => {
            if (el.id === val) {
              this.customerData = Object.assign({}, el)
            }
          })
        }
      },
      'customerData.defaultWareHouseId'(val){
        this.wareHouseId = val;
      }
    },
    methods: {
      // 查询客户
      remote(query) {
        if (query != '') {
          this.loading = true;
          let params = this.$clearData(this.customerApi);
          params.param = query;
          this.$http.post(this.$api.findCustomerList, params).then(res => {
            if (res.code === 1000) {
              this.customerList = res.data.data;
            }
            this.loading = false;
          })
        } else {
          this.customerList = [];
        }
      },
      // 选择产品
      onselect(data) {
        this.selectList = [...data];
      },
      // 确认选择产品
      chooseGoods() {
        this.goodsList = [...this.selectList];
        this.show = false;
      },
      // 取消选择产品
      resetGoods() {
        this.selectList = [];
        this.show = false;
      },
      //  删除行
      delRow(idx) {
        this.goodsList.splice(idx, 1)
        this.$nextTick(() => {
          this.act = !this.act
        })
      },
      save() {
        if (this.goodsList.length > 0) {
          if (this.checkNum) {
            let params = this.$clearData(this.dataApi);
            params.items = JSON.stringify(this.goodsList);
            this.$http.post(this.$api.businessSaveOrder,params).then(res =>{
              if(res.code === 1000){
                this.$Message.success('下单成功')
                this.$router.push({name: 'orderManage'})
              }else{
                this.$Message.error(res.message);
              }
            })
          } else {
            this.$Message.error('下单数量不能为空')
          }
        } else {
          this.$Message.error('请选择货物')
        }
      },
      reset() {
        this.$router.go(-1);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.act = !this.act;
      })
    }
  }
</script>

<style lang='less' scoped>
  .other-info {
    .table {
      padding: 20px 0;
    }
  }
</style>