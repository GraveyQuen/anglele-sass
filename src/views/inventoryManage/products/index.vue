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
        <Table width="100%" ref="productTable" border :columns="tableHeader" :data="list">
          <template slot="wareHouseProductSet" slot-scope="props">
                                            <div v-for="(item,index) in props.row.wareHouseProductSet" :key="index" >
                                              <div :class="item.warn === 'true' ? 'warn':''">{{item.wareHouseName}}：{{item.num}}{{item.unit}}</div>
                                            </div>
</template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal :title="this.isEdit ? '编辑产品':'新增产品'" width="800" @on-cancel="reset('formModel')" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100" class="product-form">
        <div class="product-img">
          <div class="product-img-title">产品图片:</div>
          <div class="product-img-main">
            <Button type="primary" @click.native="cropperShow = true">上传图片</Button>
            <div class="preview-imgs" style="margin-top:20px;">
              <img :src="dataApi.productImg">
            </div>
            <!-- <uploadFile single :showPreview="true" v-model="dataApi.productImg"></uploadFile> -->
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
          <InputNumber :min="0" v-model.number="dataApi.price" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="计量单位：" prop="unit">
          <Select v-model="dataApi.unit">
            <Option v-for="(item,index) in unitList" :value="item.cName" :key="index">{{ item.cName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属仓库：" prop="wareHouseIds">
          <Select v-model="dataApi.wareHouseIds" multiple>
              <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="排序：" prop="sortIndex">
          <InputNumber :min="0" v-model.number="dataApi.sortIndex" style="width:100%;"></InputNumber>
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
    <Modal v-model="cropperShow" width="830" title="上传图片">
      <div class="cropper-body-main">
      <!-- <vueCropper ref="cropper3" :img="cropperData.img" :original="cropperData.original" :centerBox="cropperData.centerBox" :outputType ="cropperData.outputType" :autoCrop="cropperData.autoCrop" :autoCropWidth="cropperData.autoCropWidth" :autoCropHeight="cropperData.autoCropHeight" :fixedBox="cropperData.fixedBox"></vueCropper> -->
      <div>
        <label class="btn" for="uploads">选择图片</label>
        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)">
      <button @click="finish('blob')" class="btn">上传图片</button>
      </div>
      <div class="cropper-body" v-if="cropperShow">
      <vueCropper
        ref="cropperFef"
        :outputType="cropperData.outputType"
        :outputSize="cropperData.outputSize"
        :full="cropperData.full"
        :img="cropperData.img"
        :autoCrop="cropperData.autoCrop"
        :autoCropWidth="cropperData.autoCropWidth"
        :autoCropHeight="cropperData.autoCropHeight"
        :fixedBox="cropperData.fixedBox"
      ></vueCropper>
    </div>
      </div>
      <div slot="footer">
        <!-- <Button type="primary">添加</Button> -->
        <Button @click="cropperShow = false">取消</Button>
      </div>
      <Spin fix v-if="spinShow">
          <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
          <div>正在上传...</div>
      </Spin>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    dateformat
  } from '@/utils/filters'
  import uploadFile from '@/components/upload/index'
  import vueCropper from 'vue-cropper'
  export default {
    components: {
      uploadFile,
      vueCropper
    },
    data() {
      return {
        cropperData: {
          img: '',
          autoCrop: true,
          autoCropWidth: 240,
          autoCropHeight: 240,
          fixedBox: true,
          outputType: 'png',
          outputSize: 1, //剪切后的图片质量（0.1-1）
          full: false, //输出原图比例截图 props名full
        },
        fileName: '',
        cropperShow: false,
        spinShow: false,
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
          price: null,
          sortIndex: 0,
          unit: '',
          warnNum: '',
          wareHouseIds: []
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
          }],
          wareHouseIds: [{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'array'
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
          key: 'cost',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.cost != '' ? `${params.row.cost}/${params.row.unit}` : '暂无';
            return h('div', str)
          }
        }, {
          title: '排序',
          key: 'sortIndex',
          minWidth: 100,
        }, {
          title: '总库存数',
          key: 'total',
          minWidth: 120,
          render: (h, params) => {
            let str = `${params.row.total}${params.row.unit}`;
            return h('div', str)
          }
        }, {
          title: '仓库库存',
          key: 'wareHouseProductSet',
          minWidth: 200,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.productTable.$scopedSlots.wareHouseProductSet({
                row: params.row
              })
            )
          }
        }, {
          title: '库存预警',
          key: 'warnNum',
          minWidth: 120,
          render: (h, params) => {
            let str = params.row.warnNum != '' ? `${params.row.warnNum}${params.row.unit}` : '0';
            return h('div', str)
          }
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
          align: 'center',
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
      },
      token() {
        return this.$store.state.authorization
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
      cropperShow(val) {
        if (!val) {
          this.cropperData.img = '';
          this.$refs.cropperFef.clearCrop()
        }
      }
    },
    methods: {
      uploadImg(e) {
        var _this = this;
        var file = e.target.files[0]
        _this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$Message.error('请上传正确的图片格式')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.cropperData.img = data;
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      },
      finish(type) {
        let _this = this;
        let fd = new FormData();
        if (type === 'blob') {
          this.$refs.cropperFef.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data)
            fd.append('file', data, this.fileName)
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': this.token,
              }
            }
            let host = "";
            if (window.location.hostname == "localhost") host = "http://192.168.0.252:8082";
            let instance = axios.create({
              baseURL: host,
            });
            _this.spinShow = true;
            instance.post('/api/file/upload', fd, config).then(res => {
              if (res.data.code === 1000) {
                _this.cropperData.img = '';
                _this.$refs.cropperFef.clearCrop()
                _this.cropperShow = false;
                _this.$Message.success('上传成功')
                _this.dataApi.productImg = res.data.data;
              }
              _this.spinShow = false;
            })
          })
        } else {
          this.$refs.cropperFef.getCropData((data) => {
            // console.log(data)
            // test.location.href = data
          })
        }
      },
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
        this.$http.post(this.$api.findWarnProductList, params).then(res => {
          this.list = res.data.data;
          this.totalCount = res.data.totalCount;
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size) {
        this.pageApi.pageSize = size;
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          // this.cropperData.img = item.productImg;
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
            warnNum: item.warnNum,
            wareHouseIds: item.wareHouseIds.split(',')
          }
        } else {
          this.dataApi = {
            name: '',
            categoryId: '',
            status: 1,
            productImg: '',
            productDes: '',
            remark: '',
            price: null,
            sortIndex: 0,
            unit: '',
            warnNum: '',
            wareHouseIds: []
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
            params.wareHouseIds = params.wareHouseIds.toString();
            let paramsUrl = this.isEdit ? this.$api.updateProduct : this.$api.saveProduct;
            if (this.isEdit) {
              params.id = this.editItem.id;
            }
            this.$http.post(paramsUrl, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getList(this.pageFilter);
                this.show = false;
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
  
  .warn {
    color: #ed4014;
  }
  
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0 10px 0px 0px;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  
  .cropper-body {
    position: relative;
    width: 100%;
    height: 400px;
    margin-top: 10px;
  }
  
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>