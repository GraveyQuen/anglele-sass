<template>
  <div class="warms">
    <div class="warms-list" v-for="(item,index) in list" :key="index">
      <div class="warms-list-inner">
        <div class="title">{{item.name}}({{item.unit}})</div>
        <div class="warehouse">
          <div class="warehouse-list" v-for="(sub,i) in item.wareHouse">{{sub.wareHouse}}：{{sub.warn}}</div>
        </div>
        <div class="warnNum"><i class="iconfont ang-yujing"></i>预警值：{{item.warnNum}}</div>
      </div>
    </div>
    <div v-if="list.length === 0" class="no-data">
      <img src="../../../assets/images/no-warn.png">
      <p>暂无预警</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: []
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.todayProductWarn).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        })
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .warms {
    margin: 0 -16px;
    padding: 0 10px;
    min-height: 368px;
    &:after {
      content: '';
      display: table;
      clear: both;
      visibility: hidden;
      font-size: 0;
      height: 0;
    }
    .warms-list {
      float: left;
      width: 20%;
      padding: 5px;
      .warms-list-inner {
        padding: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, .1);
        .title {
          font-size: 18px;
          color: #17D6BA;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .warehouse {
          padding: 15px 0;
          text-align: center;
          color: #FF6060;
          min-height: 72px;
        }
        .warnNum {
          text-align: center;
          color: #FF6060;
          font-size: 18px;
          .iconfont {
            color: #FF6060;
            font-size: 18px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  
  .no-data {
    padding-top: 30px;
    text-align: center;
  }
</style>