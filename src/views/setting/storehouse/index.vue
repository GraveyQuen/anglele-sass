<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="仓库管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增仓库</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="仓库名称：">
          <Input v-model="pageApi.wareHouseName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库状态：">
          <Select v-model="pageApi.status" :clearable="false" style="width: 160px;">
                <Option v-for="(item,index) in [{id:'0',name:'禁用'},{id:'1',name:'启用'}]" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">仓库名称</Col>
            <Col class-name="col" span="8">仓库地址</Col>
            <Col class-name="col" span="3">仓库状态</Col>
            <Col class-name="col" span="3">排序</Col>
            <Col class-name="col" span="3">备注</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="8">{{`${item.provinceName}${item.cityName}${item.districtName}${item.address}`}}</Col>
            <Col class-name="col" span="3">
            <Button size="small" @click="changeStatus(item)">{{item.status === 1 ? '启用':'禁用'}}</Button>
            </Col>
            <Col class-name="col" span="3">{{item.sortIndex}}</Col>
            <Col class-name="col" span="3">{{item.remark}}</Col>
            <Col class-name="col" span="3">
            <Button type="warning" size="small" @click="openPanel(true,item)" style="margin-right: 10px;">编辑</Button>
            <Button type="error" size="small" @click="del(item)">删除</Button>
            </Col>
          </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal :title="this.isEdit ? '编辑仓库':'新增仓库'" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="地址：" prop="cityName">
          <cityPick v-model="city" @on-pick="onPick"></cityPick>
        </FormItem>
        <FormItem label="详细地址：" prop="address">
          <Input v-model="dataApi.address" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库管理员：" prop="wareHouseManId">
          <Select v-model="dataApi.wareHouseManId" multiple :clearable="false" style="width: 100%;">
            <Option v-for="(item,index) in roleList" :value="item.userId" :key="index">{{ item.userName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序：">
          <InputNumber :min="1" v-model.number="dataApi.sortIndex" style="width:100%;"></InputNumber>
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
    mapGetters
  } from 'vuex'
  import cityPick from '@/components/cityPick/index'
  export default {
    components: {
      cityPick
    },
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          status: '',
          wareHouseName: ''
        },
        city: [],
        dataApi: {
          name: '',
          sortIndex: 0,
          remark: '',
          address: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: '',
          wareHouseManId: []
        },
        loading: false,
        show: false,
        rule: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          cityName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          address: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          wareHouseManId:[{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'array'
          }]
        },
        list: [],
        totalCount: 0,
        isEdit: false,
        editItem: {},
        roleList: []
      }
    },
    computed: {
      ...mapGetters(['base']),
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          status: this.pageApi.status,
          wareHouseName: this.pageApi.wareHouseName
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
      },
      base(){
        this.findBusinessUser();
      }
    },
    methods: {
      onPick(data) {
        this.dataApi.provinceId = data.provinceId;
        this.dataApi.provinceName = data.provinceName;
        this.dataApi.cityId = data.cityId;
        this.dataApi.cityName = data.cityName;
        this.dataApi.districtId = data.districtId;
        this.dataApi.districtName = data.districtName;
      },
      getList(params) {
        this.$http.post(this.$api.findWareHouseList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      //  清除筛选
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          status: '',
          wareHouseName: ''
        }
      },
      // 分页
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            name: item.name,
            sortIndex: item.sortIndex,
            remark: item.remark,
            address: item.address,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            cityId: item.cityId,
            cityName: item.cityName,
            districtId: item.districtId,
            districtName: item.districtName,
            wareHouseManId: item.wareHouseManId != '' ? item.wareHouseManId.split(',') : []
          }
          this.city.push(item.provinceId);
          this.city.push(item.cityId);
          this.city.push(item.districtId);
        } else {
          this.dataApi = {
            name: '',
            sortIndex: 0,
            remark: '',
            address: '',
            provinceId: '',
            provinceName: '',
            cityId: '',
            cityName: '',
            districtId: '',
            districtName: '',
            wareHouseManId: []
          }
          this.city = [];
        }
        this.show = true;
      },
      // 保存、编辑仓库
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            params.wareHouseManId = params.wareHouseManId.toString();
            let paramsUrl = this.isEdit ? this.$api.updateWareHouse : this.$api.saveWareHouse;
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
      reset(name) {
        Object.keys(this.dataApi).forEach(key => [
          this.dataApi[key] = ''
        ])
        this.dataApi.sortIndex = 0;
        this.dataApi.wareHouseManId = [];
        this.city = [];
        this.show = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      changeStatus(item) {
        let status = item.status;
        this.$Modal.confirm({
          title: '更改状态',
          content: `确定将仓库状态更改为${item.status === 1 ? '禁用':'启用'}`,
          onOk: () => {
            this.$http.post(this.$api.modifyWareHouse, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('更改成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      del(item) {
        this.$Modal.confirm({
          title: '删除提示',
          content: '确认删除该仓库？',
          onOk: () => {
            this.$http.post(this.$api.deleteWareHouse, {
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
      findBusinessUser(){
        this.$http.post(this.$api.findBusinessUser,{id: this.base.loginInfo.extraInfo.businessId,roleCode:'WAREHOUSE_KEEPER'}).then(res =>{
          if(res.code === 1000){
            this.roleList = res.data;
          }
        })
      }
    },
    created() {
      this.findBusinessUser();
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
</style>