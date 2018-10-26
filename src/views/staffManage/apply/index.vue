<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="申请试用管理">
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="姓名：">
          <Input v-model="pageApi.userName" style="width: 200px;" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="联系方式：">
          <Input v-model="pageApi.userContact" style="width: 200px;" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width:200px">
            <Option v-for="item in [{id:'0',name:'未处理'},{id: '1',name:'已处理'}]" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="pageApi.remark" style="width: 200px;" placeholder="请输入"></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">姓名</Col>
            <Col class-name="col" span="4">联系方式</Col>
            <Col class-name="col" span="4">状态</Col>
            <Col class-name="col" span="6">备注</Col>
            <Col class-name="col" span="3">最近更新时间</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="4">{{item.userName}}</Col>
            <Col class-name="col" span="4">{{item.userContact}}</Col>
            <Col class-name="col" span="4">{{item.status === 0 ? '未处理':'已处理'}}</Col>
            <Col class-name="col" span="6">{{item.remark}}</Col>
            <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="3">
            <Button type="warning" size="small" @click="deal(item)">处理</Button>
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
    <Modal title="处理" width="500" v-model="show" @on-cancel="reset('formModel')" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :label-width="100">
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
          userName: '',
          userContact: '',
          status: '',
          remark: '',
          pageIndex: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0,
        dataApi: {
          id: '',
          remark: ''
        },
        show: false,
        loading: false
      }
    },
    computed: {
      pageFilter() {
        return {
          userName: this.pageApi.userName,
          userContact: this.pageApi.userContact,
          status: this.pageApi.status,
          remark: this.pageApi.remark,
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize
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
          userName: '',
          userContact: '',
          status: '',
          remark: '',
          pageIndex: 1,
          pageSize: 10
        }
      },
      getList(params) {
        this.$http.post(this.$api.productApplyPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      deal(item) {
        this.show = true;
        this.dataApi.id = item.id;
        this.dataApi.remark = item.remark;
      },
      reset(name) {
        this.dataApi = {
          id: '',
          remark: ''
        }
        this.show = false;
        this.loading = false;
        this.$refs[name].resetFields();
      },
      submit(name) {
        this.loading = true;
        let params = this.$clearData(this.dataApi)
        this.$http.post(this.$api.productApplyFinish, params).then(res => {
          if (res.code === 1000) {
            this.$Message.success('处理成功');
            this.getList(this.pageFilter);
            this.show = false;
          } else {
            this.$Message.error(res.message)
          }
          this.loading = false;
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