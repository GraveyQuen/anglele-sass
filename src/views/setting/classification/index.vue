<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="分类管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增分类</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="分类名称：">
          <Input v-model="pageApi.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="分类代码：">
          <Input v-model="pageApi.code" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input v-model="pageApi.updateUser" placeholder="请输入"></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="3">分类名称</Col>
            <Col class-name="col" span="3">分类代码</Col>
            <Col class-name="col" span="3">排序</Col>
            <Col class-name="col" span="3">状态</Col>
            <Col class-name="col" span="3">备注</Col>
            <Col class-name="col" span="3">最近更新时间</Col>
            <Col class-name="col" span="3">最近更新人</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="3">{{item.name}}</Col>
            <Col class-name="col" span="3">{{item.code}}</Col>
            <Col class-name="col" span="3">{{item.sortIndex}}</Col>
            <Col class-name="col" span="3">{{item.status === 1 ? '启用':'禁用'}}</Col>
            <Col class-name="col" span="3">{{item.remark}}</Col>
            <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="3">{{item.updateUser}}</Col>
            <Col class-name="col" span="3">
            <Button type="warning" size="small" @click="openPanel(true,item)" style="margin-right: 10px;">编辑</Button>
            <Button type="warning" size="small" @click="delCategory(item)">删除</Button>
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
    <Modal :title="this.isEdit ? '编辑分类':'新增分类'" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="分类名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="分类代码：">
          <Input v-model="dataApi.code" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：" v-if="isEdit">
          <RadioGroup v-model="dataApi.status">
            <Radio v-for="(item,index) in [{id: 1,name: '启用'},{id: 0,name:'禁用'}]" :key="index" :label="item.id">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序：" prop="sortIndex">
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
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          code: '',
          updateUser: ''
        },
        list: [],
        totalCount: 0,
        dataApi: {
          name: '',
          code: '',
          sortIndex: 0,
          remark: '',
          status: 1
        },
        rule: {
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
          }]
        },
        show: false,
        isEdit: false,
        loading: false,
        editItem: {}
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          name: this.pageApi.name,
          code: this.pageApi.code,
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
      getList(params) {
        this.$http.post(this.$api.findCategoryList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
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
          code: '',
          updateUser: ''
        }
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            name: item.name,
            code: item.code,
            sortIndex: item.sortIndex,
            status: item.status,
            remark: item.remark
          }
        } else {
          this.dataApi = {
            name: '',
            code: '',
            sortIndex: 0,
            status: 1,
            remark: ''
          }
        }
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateCategory : this.$api.saveCategory;
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
      //  删除分类
      delCategory(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delCategory, {
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