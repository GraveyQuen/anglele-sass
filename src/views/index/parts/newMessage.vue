<template>
  <div class="message-main">
    <div class="title">最新消息</div>
    <div class="message-list" v-for="(item,index) in messageList" @click="goRoute(item)" :class="item.num > 0 ? 'active':''">
      <span class="iconfont ang-jiantou"></span>
      您有<span class="nums">{{item.num}}</span>{{item.msg}}
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        messageList: [{
          num: 0,
          msg: '条订单需要处理',
          route:{
            path: '/salesManage/orderManage',
            query: {
              orderStatus: 4
            }
          }
        },{
          num: 0,
          msg: '条入库单需要处理',
          route:{
            path: '/inventoryManage/inventoryIn/'
          }
        },{
          num: 0,
          msg: '条出库单需要处理',
          route:{
            path: '/inventoryManage/inventoryOut'
          }
        },{
          num: 0,
          msg: '条损耗单需要处理',
          route:{
            path: '/inventoryManage/wastage'
          }
        },{
          num: 0,
          msg: '条未结算单需要处理',
          route:{
            path: '/financeManage/financeOrder',
            query: {
              status: 2
            }
          }
        },{
          num: 0,
          msg: '条预结算单需要处理',
          route:{
            path: '/financeManage/financeOrder',
            query: {
              status: 3
            }
          }
        }]
      }
    },
    methods: {
      getList() {
        this.$http.post(this.$api.newMessage).then(res => {
          if (res.code === 1000) {
            this.messageList[0].num = res.data.orderNum;
            this.messageList[1].num = res.data.inNum;
            this.messageList[2].num = res.data.outNum;
            this.messageList[3].num = res.data.wastageNum;
            this.messageList[4].num = res.data.unsettleNum;
            this.messageList[5].num = res.data.preSettleNum;
          }
        })
      },
      goRoute(item){
        if(item.num > 0) this.$router.push(item.route)
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
  .message-main {
    .title {
      display: inline-block;
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #17233d;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .message-list {
      font-size: 14px;
      margin-bottom: 5px;
      cursor: pointer;
      .iconfont {
        float: right;
        color: #23D5C0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border: 1px solid #23D5C0;
        border-radius: 100%;
      }
      &:last-child {
        margin: 0;
      }
      &.active{
        .nums{
          color: #23D5C0;
        }
      }
    }
  }
</style>