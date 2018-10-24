<template>
  <div class="index-banner">
    <div class="front-section">
      <div class="banner-main">
        <div class="banner-main-item">
          <div class="banner-main-item-title">智慧安农生鲜配送系统</div>
          <div class="banner-main-item-text">让生鲜配送更简单</div>
          <div class="banner-app">
            <div class="app-item">
              <span class="app-item-text wechat">微信小程序</span>
              <span class="app-item-img">
                  <img src="../../../../assets/images/sun-qr.png">
                </span>
            </div>
            <div class="app-item">
              <span class="app-item-text qr">扫一扫下载<span>APP</span></span>
              <span class="app-item-img">
                  <img src="../../../../assets/images/sun-qr.png">
                </span>
            </div>
          </div>
        </div>
        <div class="banner-main-item">
          <div class="banner-main-item-right">
            <img src="../../../../assets/images/banner-right-pic.png" alt="">
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
    background: top center url('../../../../assets/images/index-banner.png') no-repeat;
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
      width: 198px;
      height: 158px;
      margin-right: 30px;
      vertical-align: top;
      .app-item-img {
        vertical-align: top;
        display: inline-block;
        width: 158px;
        height: 158px;
        font-size: 0;
        img {
          max-width: 100%;
          vertical-align: middle;
        }
      }
      .app-item-text {
        display: inline-block;
        padding: 0 10px;
        width: 40px;
        text-align: center;
        height: 158px;
        font-size: 16px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        line-height: 18px;
        &.wechat {
          padding-top: 30px;
        }
        &.qr {
          padding-top: 15px;
        }
        span {
          padding-left: 5px;
          padding-top: 15px;
          display: inline-block;
          -moz-transform: rotate(90deg);
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
        }
      }
    }
  }
</style>