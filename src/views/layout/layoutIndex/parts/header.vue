<template>
  <div class="header-bar">
    <div class="header-inner">
      <div class="header-logo">
        <a href="/index">智慧安农</a>
      </div>
      <div class="header-logo-text">
        <span>智慧安农</span>
      </div>
      <div class="header-operation">
        <a class="operation-item" href="/login" v-if="!isLogin"><span class="iconfont ang-user"></span>供应商登录</a>
        <a class="operation-item" href="/home" v-if="isLogin"><span class="iconfont ang-user"></span>供应商后台</a>
        <a class="operation-item" href="http://anglele.com/" target="_blank"><span class="iconfont ang-home"></span>官网</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed:{
      isLogin(){
        return this.$store.state.authorization != null;
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .header-bar {
    position: relative;
    background: rgba(0, 0, 0, .4);
    z-index: 9;
    .header-inner {
      position: relative;
      width: 1200px;
      margin: 0 auto;
      height: 80px;
      font-size: 0;
      white-space: nowrap;
      .header-logo {
        vertical-align: top;
        margin-top: 20px;
        display: inline-block;
        margin-right: 10px;
        a {
          width: 68px;
          height: 40px;
          background: url('../../../../assets/images/front-logo.png') no-repeat;
          background-size: 100%;
          display: block;
          text-indent: -100px;
        }
      }
      .header-logo-text {
        vertical-align: top;
        display: inline-block;
        font-size: 14px;
        color: #fff;
        line-height: 80px;
      }
      .header-operation {
        position: absolute;
        right: 0;
        top: 0;
        height: 80px;
        color: #fff;
        z-index: 10;
        .operation-item {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          color: #fff;
          margin-right: 20px;
          line-height: 80px;
          cursor: pointer;
          .iconfont{
            display: inline-block;
            margin-right: 6px;
            font-size: 18px;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>