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
          <Input v-model="pageApi.status" placeholder="请输入"></Input>
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
            <Col class-name="col" span="3">传真</Col>
            <Col class-name="col" span="3">QQ</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="7">{{item.name}}</Col>
            <Col class-name="col" span="3"> {{item.contactPeople}}
            </Col>
            <Col class-name="col" span="3">{{item.contactPhone}}</Col>
            <Col class-name="col" span="2">
            <Button size="small" @click="changeStatus(item)">{{item.status === 1 ? '启用':'禁用'}}</Button>
            </Col>
            <Col class-name="col" span="3">{{item.fax}}</Col>
            <Col class-name="col" span="3">{{item.qq}}</Col>
            <Col class-name="col" span="3">
            <Button type="warning" size="small" @click="openPanel(true,item)" style="margin-right: 10px;">编辑</Button>
            <Button type="warning" size="small" @click="bindAccount(item)">查看绑定账号</Button>
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
        }
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
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
</style>