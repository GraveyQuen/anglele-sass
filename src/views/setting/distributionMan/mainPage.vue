<template>
  <div class="page-inner">
    <div class="extra-buttons">
      <Button type="primary"  @click="openPanel(false)">{{`新增${title}`}}</Button>
    </div>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">{{`${title}姓名`}}</Col>
            <Col class-name="col" span="6">{{`${title}电话`}}</Col>
            <Col class-name="col" span="6">最近操作时间</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="6">{{item.name}}</Col>
            <Col class-name="col" span="6">{{item.phone}}</Col>
            <Col class-name="col" span="6">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="6">
            <Button type="warning" size="small" @click="openPanel(true,item)" style="margin-right:10px;">编辑</Button>
            <Button type="error" size="small" @click="delUnit(item)">删除</Button>
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
      <Modal :title="this.isEdit ? `编辑${title}`:`新增${title}`" @on-cancel="reset('formModel')" width="500" v-model="show" :mask-closable="false">
        <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
          <FormItem label="姓名：" prop="name">
            <Input v-model="dataApi.name" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input v-model="dataApi.phone" placeholder="请输入..."></Input>
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
    props: {
      type: Number,
      title: String
    },
    data() {
      return {
        list: [],
        show: false,
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          manType: this.type
        },
        dataApi: {
          name: '',
          phone: '',
          plate: '',
          remark: '',
          idCardNo: '',
          manType: this.type
        },
        rule: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        isEdit: false,
        eidtItem: {},
        totalCount: 0
      }
    },
    methods: {
      getList() {
        this.$http.post(this.$api.findDeliveryManList, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 分页
      changePage(page) {
        this.pageApi.pageIndex = page;
        this.getList();
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.eidtItem = item || {};
          this.dataApi = {
            name: item.name,
            phone: item.phone,
            plate: item.plate,
            remark: item.remark,
            idCardNo: item.idCardNo,
            manType: item.manType
          }
        } else {
          this.dataApi = {
            name: '',
            phone: '',
            plate: '',
            remark: '',
            idCardNo: '',
            manType: this.type
          }
        }
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateDeliveryMan : this.$api.saveDeliveryMan;
            if (this.isEdit) params.id = this.eidtItem.id;
            this.$http.post(paramsUrl, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getList();
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
        this.show = false;
        this.$refs[name].resetFields();
      },
      // 删除
      delUnit(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delDeliveryMan, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList();
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
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .extra-buttons{
    text-align: right;
    padding-bottom: 16px;
  }
</style>