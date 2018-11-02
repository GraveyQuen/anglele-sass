<template>
  <div class="index-banner">
    <div class="front-section">
      <div class="banner-main">
        <div class="banner-main-item">
          <div class="banner-main-item-title">智慧安农生鲜配送系统</div>
          <div class="banner-main-item-text">让生鲜配送更简单</div>
          <div class="banner-app">
            <div class="app-item">
              <span class="app-item-img">
                <img src="https://resource.anglele.com/saas/porta/wx_dyh.jpg">
              </span>
              <span class="app-item-text">智慧安农订阅号</span>
            </div>
            <div class="app-item">
              <span class="app-item-img">
                <img src="https://resource.anglele.com/saas/porta/wx_custom.jpg">
              </span>
              <span class="app-item-text">微信小程序用户端</span>
            </div>
            <div class="app-item">
              <span class="app-item-img">
                <img src="https://resource.anglele.com/saas/porta/wx_business.jpg">
              </span>
              <span class="app-item-text">微信小程序商户端</span>
            </div>
            <div class="app-item">
              <span class="app-item-img">
                <img src="https://resource.anglele.com/saas/porta/APP.png">
              </span>
              <span class="app-item-text">用户端APP下载</span>
            </div>
          </div>
        </div>
        <div class="banner-main-item">
          <div class="banner-main-item-right">
            <img src="https://resource.anglele.com/saas/static/banner-right-pic.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .index-banner {
    position: relative;
    height: 680px;
    background: top center url('https://resource.anglele.com/saas/static/index-banner.png') no-repeat;
    .front-section {
      width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    .banner-main {
      padding-top: 170px;
      display: flex;
      .banner-main-item {
        flex: 1;
      }
      .banner-main-item-title {
        font-size: 36px;
        color: #23D5C0;
      }
      .banner-main-item-text {
        font-size: 24px;
        color: #23D5C0;
        margin: 5px 0 80px;
      }
    }
    .banner-main-item-right {
      text-align: right;
    }
    .app-item {
      display: inline-block;
      width: 128px;
      height: 128px;
      margin-right: 22px;
      vertical-align: top;
      .app-item-img {
        vertical-align: top;
        display: inline-block;
        width: 128px;
        height: 128px;
        font-size: 0;
        img {
          max-width: 100%;
          vertical-align: middle;
        }
      }
      .app-item-text {
        display: block;
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>