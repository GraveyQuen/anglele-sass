<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="计量单位管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增计量单位</Button>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">单位名称(中文)</Col>
            <Col class-name="col" span="6">单位名称(英文)</Col>
            <Col class-name="col" span="6">最近操作时间</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="6">{{item.cName}}</Col>
            <Col class-name="col" span="6">{{item.eName != '' ? item.eName:'暂无'}}</Col>
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
      <Modal :title="this.isEdit ? '编辑计量单位':'新增计量单位'" @on-cancel="reset('formModel')" width="500" v-model="show" :mask-closable="false">
        <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
          <FormItem label="中文单位：" prop="cName">
            <Input v-model="dataApi.cName" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="英文单位：">
            <Input v-model="dataApi.eName" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="submit('formModel')" :loading="loading">保存</Button>
          <Button @click="reset('formModel')">取消</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        show: false,
        pageApi: {
          pageIndex: 1,
          pageSize: 10
        },
        dataApi: {
          cName: '',
          eName: ''
        },
        rule: {
          cName: [{
            required: true,
            message: '中文名称不能为空',
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
        this.$http.post(this.$api.findUnitList, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 分页
      changePage(page){
        this.pageApi.pageIndex = page;
        this.getList();
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.eidtItem = item || {};
          this.dataApi.eName = item.eName
          this.dataApi.cName = item.cName
        } else {
          this.dataApi.eName = '';
          this.dataApi.cName = ''
        }
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let paramsUrl = this.isEdit ? this.$api.updateUnit : this.$api.saveUnit;
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
        this.dataApi.cName = '';
        this.dataApi.eName = '';
        this.show = false;
        this.$refs[name].resetFields();
      },
      // 删除
      delUnit(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delUnit, {
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
</style>