<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="供应商管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增供应商</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="供应商名称：">
          <Input v-model="pageApi.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="联系人：">
          <Input v-model="pageApi.contactPeople" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="联系电话：">
          <Input v-model="pageApi.contactPhone" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 200px;">
                      <Option v-for="(item,index) in [{id: 1,name: '启用'},{id: 2,name:'禁用'}]" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="7">供应商名称</Col>
            <Col class-name="col" span="3">联系人</Col>
            <Col class-name="col" span="3">联系电话</Col>
            <Col class-name="col" span="2">状态</Col>
            <Col class-name="col" span="2">传真</Col>
            <Col class-name="col" span="2">QQ</Col>
            <Col class-name="col" span="5">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="7">{{item.name}}</Col>
            <Col class-name="col" span="3"> {{item.contactPeople}}
            </Col>
            <Col class-name="col" span="3">{{item.contactPhone}}</Col>
            <Col class-name="col" span="2">
            <Button size="small" @click="changeStatus(item)">{{item.status === 1 ? '启用':'禁用'}}</Button>
            </Col>
            <Col class-name="col" span="2">{{item.fax}}</Col>
            <Col class-name="col" span="2">{{item.qq}}</Col>
            <Col class-name="col" span="5">
            <Button type="warning" size="small" @click="openPanel(true,item)">编辑</Button>
            <Button type="warning" size="small" @click="bindAccount(item)" style="margin:0 10px;">查看</Button>
            <Button type="warning" size="small" @click="userManage(item)">用户管理</Button>
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
    <Modal :title="this.isEdit ? '编辑供应商':'新增供应商'" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="供应商名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="联系人：" prop="contactPeople">
          <Input v-model="dataApi.contactPeople" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="联系电话：" prop="contactPhone">
          <Input v-model="dataApi.contactPhone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="传真：">
          <Input v-model="dataApi.fax" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="QQ：">
          <Input v-model="dataApi.qq" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('formModel')" :loading="loading">保存</Button>
        <Button @click="reset('formModel')">取消</Button>
      </div>
    </Modal>
    <Modal title="禁用备注" width="500" v-model="statusShow" :mask-closable="false">
      <Form ref="formStatus" :model="statusApi" :rules="statusRule" :label-width="100">
        <FormItem label="禁用备注：" prop="remark">
          <Input v-model="statusApi.remark" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitStatus('formStatus')" :loading="loading">保存</Button>
        <Button @click="resetStatus('formStatus')">取消</Button>
      </div>
    </Modal>
    <Modal title="绑定账号" width="500" v-model="detailShow" :mask-closable="false">
      <Form :label-width="100">
        <FormItem label="用户名称：">
          {{accountDetail.userName | emptyHlod}}
        </FormItem>
        <FormItem label="手机号：">
          {{accountDetail.phone | emptyHlod}}
        </FormItem>
        <FormItem label="生日：">
          <div v-if="accountDetail.birth != ''">{{accountDetail.birth | dateformat('yyyy-MM-dd')}}</div>
          <div v-else>{{accountDetail.birth | emptyHlod}}</div>
        </FormItem>
        <FormItem label="性别：">
          {{accountDetail.sex | emptyHlod}}
        </FormItem>
        <FormItem label="头像：">
          <div v-if="accountDetail.avatar != ''">
            <img :src="accountDetail.avatar" width="100">
          </div>
          <div v-else>暂无</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal title="用户管理" width="1000" v-model="userShow" :mask-closable="false">
      <div class="user-options">
        <Button type="primary" @click="addNew(false)">新增用户</Button>
      </div>
      <div class="page-inner">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="4">登录账号</Col>
              <Col class-name="col" span="3">昵称</Col>
              <Col class-name="col" span="3">真实名称</Col>
              <Col class-name="col" span="3">角色</Col>
              <Col class-name="col" span="3">性别</Col>
              <Col class-name="col" span="3">生日</Col>
              <Col class-name="col" span="5">操作</Col>
            </Row>
            <Row v-for="(item,index) in userList" :key="index">
              <Col class-name="col" span="4">{{item.phone}}</Col>
              <Col class-name="col" span="3">{{item.userName}}</Col>
              <Col class-name="col" span="3"> {{item.realName}}</Col>
              <Col class-name="col" span="3">{{item.roleCode | toRole}}</Col>
              <Col class-name="col" span="3">{{item.sex | toSex}}</Col>
              <Col class-name="col" span="3" v-if="item.birth != ''">{{item.birth | dateformat('yyyy-MM-dd')}}</Col>
              <Col class-name="col" span="3" v-else></Col>
              <Col class-name="col" span="5">
              <Button type="warning" size="small" @click="addNew(true,item)" style="margin:0 10px;">编辑</Button>
              <Button type="warning" size="small" @click="delUser(item)">删除</Button>
              </Col>
            </Row>
            </Row>
            <Row v-if="list.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
        </div>
      </div>
      <div></div>
      <div slot="footer">
        <Button @click="userShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal :title="this.userEdit ? '编辑用户':'新增用户'" width="500" v-model="userEditshow" :mask-closable="false">
      <Form ref="formUser" :model="userApi" :rules="useRule" :label-width="100">
        <FormItem label="登录账号：" prop="phone">
          <Input v-model="userApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="密码：" prop="password">
          <Input v-model="userApi.password" :disabled="userEdit" type="password" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="所属角色：" prop="roleCode">
          <Select v-model="userApi.roleCode">
              <Option v-for="(item,index) in [{value: 'ADMIN',name:'管理员'},{value: 'FINANCIAL',name: '财务'},{value:'WAREHOUSE_KEEPER',name:'库管'}]" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="昵称：" prop="userName">
          <Input v-model="userApi.userName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="真实姓名：" prop="realName">
          <Input v-model="userApi.realName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="性别：">
          <RadioGroup v-model="userApi.sex">
            <Radio v-for="(item,index) in [{id:0,name: '女'},{id:1,name: '男'},{id:2,name: '未知'}]" :key="index" :label="item.id">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="生日：">
          <DatePicker v-model="userApi.birth" type="date" placeholder="请选择" style="width: 100%"></DatePicker>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="userApi.remark" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="userSubmit('formUser')">保存</Button>
        <Button @click="useReset('formUser')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          contactPeople: '',
          contactPhone: '',
          status: ''
        },
        list: [],
        totalCount: 0,
        dataApi: {
          name: '',
          contactPeople: '',
          contactPhone: '',
          fax: '',
          qq: ''
        },
        detailShow: false,
        statusShow: false,
        show: false,
        isEdit: false,
        editItem: {},
        loading: false,
        accountDetail: {},
        statusApi: {
          id: '',
          remark: ''
        },
        statusItem: {},
        statusRule: {
          remark: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
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
          }]
        },
        useRule: {
          phone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          password:[{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          roleCode:[{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          userName:[{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          realName:[{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        userShow: false,
        userApi: {
          businessId: '',
          phone: '',
          userName: '',
          password: '',
          sex: 2,
          realName: '',
          roleCode: '',
          birth: '',
          qq: '',
          remark: ''
        },
        userList: [],
        userEdit: false,
        userEditshow: false,
        userEditItem: {},
        businessId: ''
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          name: this.pageApi.name,
          contactPeople: this.pageApi.contactPeople,
          contactPhone: this.pageApi.contactPhone,
          status: this.pageApi.status
        }
      },
      birthDate(){
        return this.userApi.birth != '' ? this.userApi.birth.getTime() : ''
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
    filters: {
      toSex(val){
        return ['女','男','未知'][val]
      },
      toRole(val){
        switch (val) {
          case 'ADMIN':
            return '管理员'
            break;
          case 'FINANCIAL':
            return '财务'
            break;
          case 'WAREHOUSE_KEEPER':
            return '库管'
            break;
          default:
            break;
        }
      }
    },
    methods: {
      // 列表
      getList(params) {
        this.$http.post(this.$api.findBusinessList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 分页
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          contactPeople: '',
          contactPhone: '',
          status: ''
        }
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (this.isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            name: item.name,
            contactPeople: item.contactPeople,
            contactPhone: item.contactPhone,
            fax: item.fax,
            qq: item.qq
          }
        } else {
          this.dataApi = {
            name: '',
            contactPeople: '',
            contactPhone: '',
            fax: '',
            qq: ''
          }
        }
        this.show = true;
      },
      // 保存、编辑供应商信息
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateBusiness : this.$api.saveBusiness;
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
        this.show = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      //  保存状态
      status(item) {
        let params = this.$clearData(this.statusApi);
        params.id = item.id;
        if (item.status === 1) {
          params.remark = params.remark;
        }
        this.$http.post(this.$api.delBusiness, params).then(res => {
          if (res.code === 1000) {
            this.getList(this.pageFilter);
            this.$Message.success('更改成功!');
            this.statusShow = false;
            this.loading = false;
          } else {
            this.$Message.error(res.message);
          }
        })
      },
      changeStatus(item) {
        this.statusItem = item || {};
        let status = item.status;
        if (status === 1) {
          this.statusShow = true;
        } else {
          this.$Modal.confirm({
            title: '更改状态',
            content: `确定将供应商状态更改为${item.status === 1 ? '禁用':'启用'}`,
            onOk: () => {
              this.status(item)
            }
          })
        }
      },
      submitStatus(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.status(this.statusItem)
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      resetStatus(name) {
        this.statusShow = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      //  查看绑定账号
      bindAccount(item) {
        this.$http.post(this.$api.findBusinessUser, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailShow = true;
            this.accountDetail = res.data;
          }
        })
      },
      //   用户管理
      userManage(item) {
        this.businessId = item.id;
        this.userShow = true;
        this.getUserList(item.id)
      },
      getUserList(id){
        this.$http.post(this.$api.findBusinessUser, {
          id: id
        }).then(res => {
          if (res.code === 1000) {
            this.userList = res.data;
          }
        })
      },
      addNew(userEdit, item) {
        this.userEdit = userEdit;
        if (this.userEdit) {
          this.userEditItem = Object.assign({}, item)
          this.userApi = {
            businessId: item.businessId,
            phone: item.phone,
            userName: item.userName,
            password: item.password,
            sex: item.sex,
            realName: item.realName,
            roleCode: item.roleCode,
            birth: item.birth != '' ? new Date(item.birth) : '',
            remark: item.remark
          }
        } else {
          this.userApi = {
            businessId: '',
            phone: '',
            userName: '',
            password: '',
            sex: 2,
            realName: '',
            roleCode: '',
            birth: '',
            remark: ''
          }
        }
        this.userEditshow = true;
      },
      // 删除用户
      delUser(item) {
        this.$Modal.confirm({
          title: '删除提示',
          content: '确定删除用户？',
          onOk: () => {
            this.$http.post(this.$api.businessDeleteUser, {
              userId: item.userId
            }).then(res => {
              if (res.code === 1000) {
                this.getUserList(item.businessId)
                this.$Message.success('删除成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      userSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.userApi);
            params.birth = this.birthDate;
            if (!this.userEdit) {
              params.password = this.$md5(params.password)
              params.businessId = this.businessId;
            }
            this.$http.post(this.$api.businessAddUser, params).then(res => {
              if (res.code === 1000) {
                this.getUserList(params.businessId)
                this.$Message.success(this.userEdit ? '编辑成功' : '保存成功')
                this.userEditshow = false;
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
      useReset(name) {
        Object.keys(this.userApi).forEach(key => {
          this.userApi[key] = '';
        })
        this.userApi.sex = 2;
        this.userEditshow = false;
        this.loading = false;
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .user-options {
    text-align: right;
    margin-bottom: 15px;
  }
</style>