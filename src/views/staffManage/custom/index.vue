<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="客户管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增客户</Button>
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <Input v-model="pageApi.param" style="width: 300px;" placeholder="请输入客户名称或客户账号查询"></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">客户名称</Col>
            <Col class-name="col" span="6">客户地址</Col>
            <Col class-name="col" span="2">登录账号</Col>
            <Col class-name="col" span="2">联系人</Col>
            <Col class-name="col" span="2">联系电话</Col>
            <Col class-name="col" span="2">状态</Col>
            <Col class-name="col" span="3">备注</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="6">{{`${item.provinceName}${item.cityName}${item.districtName}${item.address}`}}</Col>
            <Col class-name="col" span="2">{{item.phone}}</Col>
            <Col class-name="col" span="2"> {{item.contactPeople}}
            </Col>
            <Col class-name="col" span="2">{{item.contactPhone}}</Col>
            <Col class-name="col" span="2">
            <Button size="small" @click="changeStatus(item)">{{item.status === 1 ? '启用':'禁用'}}</Button>
            </Col>
            <Col class-name="col" span="3">{{item.remark}}</Col>
            <Col class-name="col" span="3">
            <Button type="warning" size="small" @click="openPanel(true,item)" style="margin-right: 10px;">编辑</Button>
            <Button type="warning" size="small" @click="resetPsd(item)">重置密码</Button>
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
    <Modal :title="this.isEdit ? '编辑客户':'新增客户'" width="500" v-model="show" @on-cancel="reset('formModel')" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="登录账号：" prop="phone">
          <Input v-model="dataApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="联系人：" prop="contactPeople">
          <Input v-model="dataApi.contactPeople" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="联系电话：" prop="contactPhone">
          <Input v-model="dataApi.contactPhone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="地址：" prop="cityName">
          <cityPick v-model="city" @on-pick="onPick"></cityPick>
        </FormItem>
        <FormItem label="详细地址：" prop="address">
          <Input v-model="dataApi.address" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="配送仓库：">
          <Select v-model="dataApi.defaultWareHouseId">
            <Option v-for="(item,index) in storeList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
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
          param: ''
        },
        city: [],
        dataApi: {
          name: '',
          remark: '',
          address: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: '',
          contactPeople: '',
          contactPhone: '',
          phone: '',
          defaultWareHouseId: ''
        },
        loading: false,
        show: false,
        rule: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          contactPeople: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          contactPhone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          address:[{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          cityName:[{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }]
        },
        list: [],
        totalCount: 0,
        isEdit: false,
        editItem: {},
        storeList: []
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          param: this.pageApi.param
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
      onPick(data) {
        this.dataApi.provinceId = data.provinceId;
        this.dataApi.provinceName = data.provinceName;
        this.dataApi.cityId = data.cityId;
        this.dataApi.cityName = data.cityName;
        this.dataApi.districtId = data.districtId;
        this.dataApi.districtName = data.districtName;
      },
      getList(params) {
        this.$http.post(this.$api.findCustomerList, params).then(res => {
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
          param: ''
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
            remark: item.remark,
            address: item.address,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            cityId: item.cityId,
            cityName: item.cityName,
            districtId: item.districtId,
            districtName: item.districtName,
            phone: item.phone,
            contactPeople: item.contactPeople,
            contactPhone: item.contactPhone,
            defaultWareHouseId: item.defaultWareHouseId
          }
          this.city.push(item.provinceId);
          this.city.push(item.cityId);
          this.city.push(item.districtId);
        } else {
          this.dataApi = {
            name: '',
            remark: '',
            address: '',
            provinceId: '',
            provinceName: '',
            cityId: '',
            cityName: '',
            districtId: '',
            districtName: '',
            phone: '',
            contactPeople: '',
            contactPhone: ''
          }
          this.city = [];
          this.setWareHouse();
        }
        this.show = true;
      },
      // 保存、编辑仓库
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateCustomer : this.$api.saveCustomer;
            if (this.isEdit) {
              params.id = this.editItem.id;
              params.userId = this.editItem.userId;
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
        this.setWareHouse()
        this.city = [];
        this.show = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      //  更改客户状态
      changeStatus(item) {
        let status = item.status;
        this.$Modal.confirm({
          title: '更改状态',
          content: `确定将客户状态更改为${item.status === 1 ? '禁用':'启用'}`,
          onOk: () => {
            this.$http.post(this.$api.modifyCustomer, {
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
      // 重置密码
      resetPsd(item) {
        this.$Modal.confirm({
          title: '重置密码',
          content: '确定将客户重置？',
          onOk: () => {
            this.$http.post(this.$api.defaultPassword, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('重置成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      setWareHouse() {
        this.storeList.map((el, index) => {
          // 默认绑定第一个仓库
          if (index === 0) this.dataApi.defaultWareHouseId = el.id;
        })
      },
      // 所有仓库
      getWareHouse() {
        this.$http.post(this.$api.findWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeList = res.data;
            this.setWareHouse()
          }
        })
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
</style>