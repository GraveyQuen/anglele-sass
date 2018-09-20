<template>
  <div class="page-inner">
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="产品名称：">
        <Input v-model="pageApi.name" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="所属分类：">
        <Select v-model="pageApi.categoryId" style="width: 160px;">
            <Option v-for="(item,index) in categoryList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="resetFilter">清除筛选</Button>
      </FormItem>
    </Form>
    <div class="card-contnet">
      <div class="table-contnet">
        <Row class-name="head">
          <Col class-name="col" span="3"><span class="iconfont" @click="checkAll" :class="isAll ? 'icon-yduifuxuankuangxuanzhong':'icon-yduifuxuankuang'"></span></Col>
          <Col class-name="col" span="7">产品名称</Col>
          <Col class-name="col" span="7">所属分类</Col>
          <Col class-name="col" span="7">现有库存</Col>
        </Row>
        <Row v-for="(item,index) in list" :key="index">
          <Col class-name="col" span="3"><span class="iconfont" @click="checkItem(item,index)" :class="item.isCheck ? 'icon-yduifuxuankuangxuanzhong':'icon-yduifuxuankuang'"></span></Col>
          <Col class-name="col" span="7">{{item.name}}</Col>
          <Col class-name="col" span="7">{{item.categoryName}}</Col>
          <Col class-name="col" span="7">{{item.total}}</Col>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 20,
          name: '',
          categoryId: '',
          wareHouseId: '',
          status: '',
          updateUser: ''
        },
        list: [],
        totalCount: 0,
        categoryList: [],
        selectList: []
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
      isAll() {
        return this.selectList.length === this.list.length;
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
        this.$http.post(this.$api.findProductList, params).then(res => {
          res.data.data.map(el => {
            el.num = '';
            el.cost = '';
            el.isCheck = false;
            el.productId = el.id;
            delete el.businessId;
            delete el.id;
            delete el.categoryId;
            delete el.createTime;
            delete el.createUser;
            delete el.createUserId;
            delete el.productDes;
            delete el.productImg;
            delete el.remark;
            delete el.sortIndex;
            delete el.status;
            delete el.updateTime;
            delete el.updateUser;
            delete el.updateUserId;
            delete el.wareHouseProductSet;
            delete el.warnNum;
          })
          this.list = res.data.data;
          this.totalCount = res.data.totalCount;
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      // 所有分类
      getAllCategory() {
        this.$http.post(this.$api.findAllCategory).then(res => {
          if (res.code === 1000) {
            this.categoryList = res.data;
          }
        })
      },
      checkAll() {
        if (this.isAll) {
          this.list.map(el => {
            el.isCheck = false;
            this.selectList = [];
          })
        } else {
          this.selectList = [];
          this.list.map(el => {
            el.isCheck = true;
            this.selectList.push(el);
          })
        }
        this.$emit('on-select', this.selectList)
      },
      checkItem(items, index) {
        if (items.isCheck) {
          this.selectList.splice(this.selectList.findIndex(item => item.id === items.id), 1);
        } else {
          this.selectList.push(items)
        }
        items.isCheck = !items.isCheck;
        this.$emit('on-select', this.selectList)
      }
    },
    created() {
      this.getList(this.pageFilter)
      this.getAllCategory();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .iconfont {
    font-size: 16px;
    color: #dcdee2;
    cursor: pointer;
    &.icon-yduifuxuankuangxuanzhong {
      color: #2d8cf0;
    }
  }
</style>