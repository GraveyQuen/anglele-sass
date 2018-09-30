<template>
  <div class="today-order">
    <div class="header">今天订单汇总</div>
    <Row>
      <Col span="12">
      <div class="inner">
        <div class="inner-main inner-1">
          <span class="iconfont icon1 ang-dashangzonge"></span>
          <div class="title">下单总金额(元)</div>
          <div class="num">{{item.amount}}</div>
        </div>
      </div>
      </Col>
      <Col span="12">
      <div class="inner">
        <div class="inner-main inner-2">
          <span class="iconfont icon2 ang-lvzhou_zongshu"></span>
          <div class="title">下单总数</div>
          <div class="num">{{item.orderNum}}</div>
        </div>
      </div>
      </Col>
    </Row>
    <Row>
      <Col span="12">
      <div class="inner">
        <div class="inner-main inner-3">
          <span class="iconfont icon1 ang-dashangzonge"></span>
          <div class="title">成交金额(元)</div>
          <div class="num">{{item.dealAmount}}</div>
        </div>
      </div>
      </Col>
      <Col span="12">
      <div class="inner">
        <div class="inner-main inner-4">
          <span class="iconfont icon2 ang-lvzhou_zongshu"></span>
          <div class="title">成交率(%)</div>
          <div class="num">{{item.dealRate}}</div>
        </div>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        item: {}
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.todayOrderSummary).then(res => {
          if (res.code === 1000) {
            this.item = Object.assign({}, res.data)
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
  .today-order {
    margin: 0 -16px;
    overflow: hidden;
    .header {
      margin: 10px 16px;
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
    .inner {
      position: relative;
      padding: 0 20px;
      .inner-main {
        position: relative;
        height: 88px;
        color: #fff;
        padding: 15px 20px;
        .iconfont {
          &.icon1 {
            position: absolute;
            right: 0;
            bottom: 10px;
            height: 80px;
            font-size: 80px;
            color: rgba(255, 255, 255, .1)
          }
          &.icon2 {
            position: absolute;
            right: 26px;
            top: 0;
            height: 80px;
            font-size: 88px;
            color: rgba(255, 255, 255, .1);
            transform: rotate(-90deg);
          }
        }
        .num {
          font-size: 18px;
          margin-top: 10px;
        }
        &.inner-1 {
          background-color: #FF6060;
          margin-bottom: 10px;
        }
        &.inner-2 {
          background-color: #17D6BA;
          margin-bottom: 10px;
        }
        &.inner-3 {
          background-color: #FF9935;
        }
        &.inner-4 {
          background-color: #D99CFF
        }
      }
    }
  }
</style>