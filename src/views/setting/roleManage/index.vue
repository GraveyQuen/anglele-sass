<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="角色管理">
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">登录账号</Col>
            <Col class-name="col" span="6">真实姓名</Col>
            <Col class-name="col" span="6">昵称</Col>
            <Col class-name="col" span="6">角色</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="6">{{item.phone}}</Col>
            <Col class-name="col" span="6">{{item.realName}}</Col>
            <Col class-name="col" span="6">{{item.userName}}</Col>
            <Col class-name="col" span="6">{{item.roleCode | toRole}}</Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <div class="paging">
          <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0
      }
    },
    filters: {
      toRole(val) {
        switch (val) {
          case 'ADMIN':
            return '供应商管理员'
            break;
          case 'WAREHOUSE_KEEPER':
            return '库管员'
            break;
          case 'FINANCIAL':
            return '财务管理员'
            break;
          default:
            break;
        }
      }
    },
    methods: {
      getList() {
        this.$http.post(this.$api.findEmployeeList, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      changePage(page){
        this.pageApi.pageIndex = page;
        this.getList();
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang='less'>
  @import url('../../../assets/less/base.less');
</style>