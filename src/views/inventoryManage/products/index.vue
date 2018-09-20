<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="产品管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增产品</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="产品名称：">
          <Input v-model="pageApi.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="所属分类：">
          <Select v-model="pageApi.categoryId" style="width: 160px;">
                  <Option v-for="(item,index) in categoryList" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
        </FormItem>
        <FormItem label="所属仓库：">
          <Select v-model="pageApi.wareHouseId" style="width: 160px;">
                  <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 160px;">
                  <Option v-for="(item,index) in [{name:'上架',id: 1},{name:'下架',id: 0}]" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" :columns="tableHeader" :data="list"></Table>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal :title="this.isEdit ? '编辑产品':'新增产品'" width="800" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100" class="product-form">
        <div class="product-img">
          <div class="product-img-title">产品图片:</div>
          <div class="product-img-main">
            <uploadFile single :showPreview="true" v-model="dataApi.productImg"></uploadFile>
          </div>
        </div>
        <FormItem label="名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="所属分类：" prop="categoryId">
          <Select v-model="dataApi.categoryId">
                        <Option v-for="(item,index) in categoryList" :value="item.id" :key="index">{{ item.name }}</Option>
                      </Select>
        </FormItem>
        <FormItem label="单价：" prop="price">
          <Input v-model.number="dataApi.price" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="计量单位：" prop="unit">
          <Select v-model="dataApi.unit">
                        <Option v-for="(item,index) in unitList" :value="item.cName" :key="index">{{ item.cName }}</Option>
                      </Select>
        </FormItem>
        <FormItem label="排序：" prop="sortIndex">
          <Input v-model.number="dataApi.sortIndex" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="预警值：">
          <Input v-model.number="dataApi.warnNum" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：">
          <RadioGroup v-model="dataApi.status">
            <Radio v-for="(item,index) in [{id: 1,name: '上架'},{id: 0,name:'下架'}]" :key="index" :label="item.id">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="产品描述：">
          <Input v-model="dataApi.productDes" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="dataApi.remark" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('formModel')" :loading="loading">保存</Button>
        <Button @click="reset('formModel')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  import uploadFile from '@/components/upload/index'
  export default {
    components:{
      uploadFile
    },
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          categoryId: '',
          wareHouseId: '',
          status: '',
          updateUser: ''
        },
        list: [],
        totalCount: 0,
        show: false,
        isEdit: false,
        editItem: {},
        dataApi: {
          name: '',
          categoryId: '',
          status: 1,
          productImg: '',
          productDes: '',
          remark: '',
          price: '',
          sortIndex: '',
          unit: '',
          warnNum: ''
        },
        rule: {
          price: [{
            required: true,
            message: '请输入单价',
            trigger: 'blur',
            type: 'number'
          }],
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          sortIndex: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'number'
          }],
          categoryId: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          unit: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }]
        },
        loading: false,
        categoryList: [], // 分类列表
        unitList: [], // 单位列表
        storeList: [], //仓库列表
        tableHeader: [{
          title: '产品名称',
          key: 'name',
          minWidth: 120,
        }, {
          title: '所属分类',
          key: 'categoryName',
          minWidth: 120,
        }, {
          title: '售价',
          key: 'price',
          minWidth: 120,
          render: (h, params) => {
            let str = `${params.row.price}/${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '成本价',
          key: 'price',
          minWidth: 120,
          render: (h, params) => {
            let str = `${params.row.cost}/${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '排序',
          key: 'price',
          minWidth: 100,
        }, {
          title: '总库存数',
          key: 'total',
          minWidth: 120,
        }, {
          title: '仓库库存',
          key: 'total',
          minWidth: 120,
        }, {
          title: '库存预警',
          key: 'warnNum',
          minWidth: 120,
        }, {
          title: '产品描述',
          key: 'productDes',
          minWidth: 120,
        }, {
          title: '状态',
          key: 'status',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.status === 1 ? '上架' : '下架';
            return h('div', str)
          }
        }, {
          title: '备注',
          key: 'remark',
          minWidth: 120,
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 120,
        }, {
          title: '最近更新时间',
          key: 'updateTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime, 'yyyy-MM-dd hh:mm:ss') : '暂无')
          }
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.openPanel(true, params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteItem(params.row)
                  }
                }
              }, '删除')
            ]);
          }
        }]
      }
    },
    computed: {
      pageFilter() {
        return {
          name: this.pageApi.name,
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          status: this.pageApi.status,
          categoryId: this.pageApi.categoryId,
          wareHouseId: this.pageApi.wareHouseId,
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
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          categoryId: '',
          wareHouseId: '',
          status: '',
          updateUser: ''
        }
      },
      getList(params) {
        this.$http.post(this.$api.findProductList, params).then(res => {
          this.list = res.data.data;
          this.totalCount = res.data.totalCount;
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            name: item.name,
            categoryId: item.categoryId,
            status: item.status,
            productImg: item.productImg,
            productDes: item.productDes,
            remark: item.remark,
            price: item.price,
            sortIndex: item.sortIndex,
            unit: item.unit,
            warnNum: item.warnNum
          }
        } else {
          this.dataApi = {
            name: '',
            categoryId: '',
            status: 1,
            productImg: '',
            productDes: '',
            remark: '',
            price: '',
            sortIndex: '',
            unit: '',
            warnNum: ''
          }
        }
        this.show = true;
      },
      // 保存新增、编辑产品
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateProduct : this.$api.saveProduct;
            if (this.isEdit) {
              params.id = this.editItem.id;
            }
            this.$http.post(paramsUrl, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getList(this.pageFilter);
                this.show = false;
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
      //  删除产品
      deleteItem(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delProduct, {
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
      // 取消保存新增、编辑产品
      reset(name) {
        Object.keys(this.dataApi).forEach(key => [
          this.dataApi[key] = ''
        ])
        this.dataApi.status = 1;
        this.show = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      // 所有分类
      getAllCategory() {
        this.$http.post(this.$api.findAllCategory).then(res => {
          if (res.code === 1000) {
            this.categoryList = res.data;
          }
        })
      },
      // 所有单位
      getUnit() {
        this.$http.post(this.$api.findUnit).then(res => {
          if (res.code === 1000) {
            this.unitList = res.data;
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
      }
    },
    created() {
      this.getList(this.pageFilter)
      this.getAllCategory();
      this.getUnit();
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .product-form {
    max-width: 400px;
    position: relative;
    .product-img {
      position: absolute;
      left: 420px;
      top: 0;
      width: 340px;
    }
    .product-img-main {
      padding: 15px 0;
    }
  }
</style>