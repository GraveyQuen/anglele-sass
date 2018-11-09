<template>
  <div class="page-inner">
    <Form :mode="pageApi" :label-width="100" inline @submit.native.prevent>
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
          <Col class-name="col" span="3"><span class="iconfont" @click="checkAll" :class="isAll ? 'ang-yduifuxuankuangxuanzhong':'ang-yduifuxuankuang'"></span></Col>
          <Col class-name="col" span="7">产品名称</Col>
          <Col class-name="col" span="7">所属分类</Col>
          <Col class-name="col" span="7">现有库存</Col>
        </Row>
        <Row v-for="(item,index) in list" :key="index">
          <Col class-name="col" span="3"><span class="iconfont" @click="checkItem(item,index)" :class="item.isCheck ? 'ang-yduifuxuankuangxuanzhong':'ang-yduifuxuankuang'"></span></Col>
          <Col class-name="col" span="7"><div class="item-title" :title="item.name">{{item.name}}</div></Col>
          <Col class-name="col" span="7">{{item.categoryName}}</Col>
          <Col class-name="col" span="7">{{item.total}}{{item.unit}}</Col>
        </Row>
        </Row>
        <Row v-if="list.length == 0">
          <Col class-name="col" span="24">暂无数据</Col>
        </Row>
      </div>
      <div class="paging">
        <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: ''
      },
      checkList: {
        type: Array
      },
      isBill: { //是否代客开单
        type: Boolean,
        default: false
      },
      wareHouseId: {
        type: String,
        default: ''
      },
      hasSelect: { // 用户将已选中的产品排在最前面
        type: String
      }
    },
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          categoryId: '',
          wareHouseId: this.wareHouseId,
          status: 1,
          updateUser: '',
          checkIds: ''
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
          updateUser: this.pageApi.updateUser,
          checkIds: this.hasSelect
        }
      },
      isAll() {
        let arr = [];
        this.list.map((item, itemIndex) => {
          this.selectList.map((sub, subIndex) => {
            if (item.productId === sub.productId) {
              arr.push(sub)
            }
          })
        })
        if (this.list.length === arr.length) {
          return true;
        } else {
          return false
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
      'selectList' () {
        this.$emit('on-select', this.selectList)
      }
    },
    methods: {
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          categoryId: '',
          wareHouseId: this.wareHouseId,
          status: 1,
          updateUser: '',
          checkIds: this.hasSelect
        }
      },
      getList(params) {
        this.$http.post(this.$api.findProductList, params).then(res => {
          res.data.data.map(el => {
            el.num = null;
            el.refundNum = null;
            el.cost = null;
            el.isCheck = false;
            el.productId = el.id;
            el.totalMoney = '';
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
          this.checkSelect();
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      // 所有分类
      getAllCategory() {
        this.$http.post(this.$api.findAllCategory).then(res => {
          if (res.code === 1000) {
            this.categoryList = res.data;
          }
        })
      },
      // 全选、反全选
      checkAll() {
        if (this.isAll) {
          this.list.map(el => {
            this.selectList.splice(this.selectList.findIndex(item => item.productId === el.productId), 1);
            el.isCheck = false;
          })
        } else {
          this.list.map(el => {
            this.selectList.map((sub, i) => {
              if (el.productId === sub.productId) {
                this.selectList.splice(i, 1);
              }
            })
            el.isCheck = true;
            this.selectList.push(el)
          })
        }
        this.checkVal();
        this.$emit('on-select', this.selectList)
      },
      // 已选中赋值
      checkVal(){
        this.selectList.map(el =>{
          this.checkList.map(item =>{
            if(el.productId === item.productId){
              el.refundNum = item.refundNum;
              el.num = item.num;
              el.cost = item.cost;
            }
          })
        })
      },
      // 选择、取消选择
      checkItem(items, index) {
        if (items.isCheck) {
          this.selectList.splice(this.selectList.findIndex(item => item.productId === items.productId), 1);
        } else {
          this.selectList.push(items)
        }
        items.isCheck = !items.isCheck;
        this.checkVal();
        this.$emit('on-select', this.selectList)
      },
      // 已选中的
      checkSelect() {
        this.list.map(el => {
          this.selectList.map((sub, i) => {
            if (el.productId === sub.productId) {
              this.selectList.splice(i, 1);
              this.selectList.push(sub)
              el.isCheck = true;
            }
          })
        })
      }
    },
    created() {
      this.getList(this.pageFilter)
      this.getAllCategory();
    },
    mounted() {
      this.selectList = [...this.checkList]
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .iconfont {
    font-size: 16px;
    color: #dcdee2;
    cursor: pointer;
    &.ang-yduifuxuankuangxuanzhong {
      color: #2d8cf0;
    }
  }
  .item-title{
        overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>