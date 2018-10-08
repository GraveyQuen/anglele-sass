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
        <Table width="100%" ref="goodsTable" border :columns="tableHeader" :data="list">
          <!-- 操作 -->
          <template slot="action" slot-scope="props">
                            <Button type="warning" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="openPanel(true,props.row)">编辑</Button>
                            <Button type="success" size="small" style="margin-right:8px;" v-if="props.row.status === 1 || props.row.status === 2" @click="detail(props.row)">查看</Button>
                            <Button type="error" size="small" style="margin-right:8px;" v-if="props.row.status === 0" @click="delWastage(props.row)">删除</Button>
                            <Button type="info" size="small" style="margin-right:8px;" v-if="props.row.status === 1" @click="cancelWastage(props.row)">取消</Button>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal :title="this.isEdit ? '编辑损耗单':'新增损耗单'" width="800" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100" inline>
        <FormItem label="仓库：" prop="wareHouseId">
          <Select v-model="dataApi.wareHouseId" style="width: 200px;">
              <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="开单日期：">
            <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="dataApi.newOrderDate" style="width: 200px"></DatePicker>
          </FormItem>
        <FormItem label="备注：">
          <Input v-model="dataApi.remark" placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="开单人：">
          <div v-if="base">{{base.loginInfo.userName}}</div>
        </FormItem>
        <div class="choose-product">
          <div class="choose-product-btn"><Button type="primary" @click="chooseBtn">选择产品</Button></div>
          <div class="choose-product-table">
            <Table ref="productTable" border :columns="goodsHeader" :data="dataApi.items">
              <!-- 操作 -->
            <template slot="action" slot-scope="props">
              <Poptip @on-ok="delProductRow(props.idx)" confirm title="确认删除此条产品？" transfer>
                <Button type="warning" size="small">删除</Button>
              </Poptip>
            </template>
                            <!-- 损失数量 -->
            <template slot="num" slot-scope="props">
              <Form :ref="'formRow'+props.idx" :model="props.row">
                <FormItem prop="num" :rules="{required: true, message: '请输入数量', trigger: 'blur',type: 'number'}">
                  <!-- <Input v-model="props.row.num" size="small" style="width:60px;" placeholder="请输入"></Input> -->
                  <InputNumber :min="0" v-model.number="props.row.num" size="small" style="width:60px;"></InputNumber>{{props.row.unit}}
                </FormItem>
              </Form>
            </template>
            </Table>
          </div>
        </div>
      </Form>
       <div slot="footer">
          <Button type="primary" @click="save('formModel',1)">保存</Button>
          <Button type="warning" @click="save('formModel',0)">暂存</Button>
          <Button @click="reset('formModel')">取消</Button>
        </div>
    </Modal>
    <Modal title="选择产品" width="800" v-model="pshow" :mask-closable="false">
      <selectGoods v-if="pshow" @on-select="onselect" :checkList="dataApi.items" :hasSelect="productIds"></selectGoods>
      <div slot="footer">
        <Button type="primary" @click="chooseGoods">选择</Button>
        <Button @click="resetGoods">取消</Button>
      </div>
    </Modal>
    <Modal title="损耗单详情" width="800" v-model="detailShow" :mask-closable="false">
      <Form :label-width="100" inline>
        <FormItem label="开单日期：">
          {{editItem.newOrderDate}}
        </FormItem>
        <FormItem label="开单人：">
          {{editItem.createUser}}
        </FormItem>
        <FormItem label="仓库：">
          {{editItem.warehouseName}}
        </FormItem>
        <FormItem label="状态：">
          {{editItem.status | toStatus}}
        </FormItem>
        <FormItem label="备注：">
          {{editItem.remark}}
        </FormItem>
        <div class="choose-product">
          <div class="choose-product-table">
            <Table  border :columns="wastageHeader" :data="editItem.wastageItems"></Table>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="detailShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  import {
    mapGetters
  } from 'vuex';
  import selectGoods from '../../components/selectGoods/index.vue'
  export default {
    components: {
      selectGoods
    },
    data() {
      return {
        act: false, // 用于触发渲染
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
        dataApi: {
          wareHouseId: '',
          newOrderDate: '',
          remark: '',
          status: '',
          items: []
        },
        list: [],
        totalCount: 0,
        dateValue: ['', ''],
        dateValue2: ['', ''],
        storeList: [],
        isEdit: false,
        show: false,
        pshow: false, // 显示隐藏选择产品
        detailShow: false,
        editItem: {},
        selectProduct: [],
        date: '',
        rule: {
          wareHouseId: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }]
        },
        wastageHeader: [{
            title: '产品名称',
            key: 'name',
          },
          {
            title: '分类名称',
            key: 'categoryName',
          },
          {
            title: '售价',
            key: 'price',
            render: (h,params) =>{
              return h('div',`${params.row.price}/${params.row.unit}`)
            }
          },
          {
            title: '损耗数量',
            key: 'num',
            render: (h,params) =>{
              return h('div',`${params.row.num}${params.row.unit}`)
            }
          },
          {
            title: '损耗金额',
            key: 'wast',
            maxWidth: 100,
            render: (h,params) =>{
              return h('div',`${params.row.wast}元`)
            }
          }
        ],
        goodsHeader: [{
          title: '产品名称',
          key: 'name',
          maxWidth: 100
        }, {
          title: '分类名称',
          key: 'categoryName',
          maxWidth: 100
        }, {
          title: '现有库存',
          key: 'total',
          maxWidth: 100,
          render: (h, params) => {
            let str = `${params.row.total}${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '售价',
          key: 'price',
          maxWidth: 100,
          render: (h, params) => {
            let str = `${params.row.price}/${params.row.unit}`
            return h('div', str)
          }
        }, {
          title: '损耗数量',
          key: 'num',
          render: (h, params) => {
            this.dataApi.items[params.index] = params.row
            return h(
              'div',
              this.$refs.productTable.$scopedSlots.num({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        }, {
          title: '损耗金额',
          key: 'totalMoney',
          render: (h, params) => {
            let str = params.row.num != '' ? (params.row.price * Number(params.row.num)).toFixed(2) : 0;
            return h('div', str)
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
            return h('div', dateformat(params.row.newOrderDate, 'yyyy-MM-dd'))
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
        firstWareHouseId: '',
        serverTime: ''
      }
    },
    computed: {
      ...mapGetters(['base']),
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
      },
      isOk() {
        let isOk = true;
        this.dataApi.items.map(el => {
          if (el.num === null) {
            isOk = false
          }
        })
        return isOk;
      },
      productIds(){
        let arr = [];
        this.dataApi.items.map(el =>{
          arr.push(el.productId)
        })
        return arr.toString();
      }
    },
    filters:{
      toStatus(val){
        return ['暂存', '完成', '取消'][val]
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
      },
      'dataApi.newOrderDate' (val) {
        if(val != ''){
          this.date = val.getTime()
        }
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
        this.dateValue = ['', ''];
        this.dateValue2 = ['', ''];
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeList = res.data;
            res.data.map((el, index) => {
              if (index === 0) {
                this.firstWareHouseId = el.id;
              }
            })
          }
        })
      },
      //  获取当前服务器时间
      currentTime(){
        this.$http.post(this.$api.serverTime).then(res =>{
          if(res.code === 1000){
            this.serverTime = new Date(res.data);
          }
        })
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.getItem(item, true);
        } else {
          Object.keys(this.dataApi).forEach(key => {
            this.dataApi[key] = '';
          })
          this.dataApi.newOrderDate = this.serverTime;
          this.dataApi.wareHouseId = this.firstWareHouseId;
          this.dataApi.items = [];
        };
        this.show = true;
      },
      //  损耗单详情
      getItem(item, isEdit) {
        this.$http.post(this.$api.findWastage, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.editItem = Object.assign({}, res.data)
            if (isEdit) {
              this.dataApi = {
                wareHouseId: res.data.wareHouseId,
                newOrderDate: new Date(Date.parse(res.data.newOrderDate.replace(/-/g, "/"))),
                remark: res.data.remark,
                status: res.data.status,
                items: res.data.wastageItems
              }
            }
          }
        })
      },
      chooseBtn() {
        this.pshow = true;
      },
      delProductRow(idex) {
        this.dataApi.items.splice(idex, 1);
        this.$nextTick(() => {
          this.act = !this.act;
        })
      },
      // 已选中产品
      onselect(data) {
        this.selectProduct = [...data];
      },
      chooseGoods() {
        if (this.selectProduct.length > 0) {
          this.dataApi.items = [...this.selectProduct];
          this.pshow = false;
        } else {
          this.$Message.error('请选择产品')
        }
      },
      resetGoods() {
        this.pshow = false;
      },
      //  保存、编辑损耗单
      save(name, st) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.dataApi.items.length > 0) {
              if (this.isOk) {
                let params = this.$clearData(this.dataApi);
                params.items = JSON.stringify(params.items);
                params.status = st;
                params.newOrderDate = this.date;
                if (this.isEdit) {
                  params.id = this.editItem.id
                };
                let apiUrl = this.isEdit ? this.$api.updateWastage : this.$api.saveWastage;
                this.$http.post(apiUrl, params).then(res => {
                  if (res.code === 1000) {
                    this.show = false;
                    this.getList(this.pageFilter)
                    this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                  } else {
                    this.$Message.error(res.message)
                  }
                })
              } else {
                this.$Message.error('请输入损耗数量')
              }
            } else {
              this.$Message.error('请选择产品')
            }
          } else {
            this.$Message.error('请选择仓库')
          }
        })
      },
      //  取消保存、编辑损耗单
      reset(name) {
        this.show = false;
        this.$refs[name].resetFields();
      },
      detail(item) {
        this.detailShow = true;
        this.getItem(item, false);
      },
      // 取消损耗单
      cancelWastage(item){
        this.$Modal.confirm({
          title: '取消损耗',
          content: '确认取消损耗单？',
          onOk: () => {
            this.$http.post(this.$api.cancelWastage, {
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
      },
      // 删除损耗单
      delWastage(item){
        this.$Modal.confirm({
          title: '删除损耗单',
          content: '确认删除损耗单？',
          onOk: () => {
            this.$http.post(this.$api.delWastage, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('删除成功');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getWareHouse();
      this.currentTime();
    },
    mounted() {
      this.$nextTick(() => {
        this.act = !this.act;
      })
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .choose-product {
    .choose-product-table {
      padding: 20px 0;
    }
  }
</style>