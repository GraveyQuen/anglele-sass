<template>
  <div class="footer">
    <div class="footer-section">
      <div class="footer-main">
        <div class="footer-col">
          <div class="col-title">苏州安基利尔数据科技有限公司</div>
          <div class="col-info">服务电话：0512-58588922</div>
          <div class="col-info">服务QQ群:511653089</div>
          <div class="col-info">企业邮箱：anglele@188.com</div>
          <div class="col-info">公司地址：苏州市张家港市杨舍镇滨河路2号华东国际大厦4F</div>
          <div class="col-info">服务时间：9:00-18:00（周一至周五）</div>
        </div>
        <div class="footer-col footer-col-imgs">
          <div class="footer-col-img"><img src="https://resource.anglele.com/saas/porta/wx_dyh.jpg"></div>
          <div class="text">智慧安农订阅号</div>
        </div>
        <div class="footer-col footer-col-imgs">
          <div class="footer-col-img"><img src="https://resource.anglele.com/saas/porta/wx_custom.jpg"></div>
          <div class="text">微信小程序用户端</div>
        </div>
        <div class="footer-col footer-col-imgs">
          <div class="footer-col-img"><img src="https://resource.anglele.com/saas/porta/wx_business.jpg"></div>
          <div class="text">微信小程序商户端</div>
        </div>
        <div class="footer-col footer-col-imgs">
          <div class="footer-col-img"><img src="https://resource.anglele.com/saas/porta/APP.png"></div>
          <div class="text">用户端APP下载</div>
        </div>
      </div>
    </div>
    <p class="copyright">COPYRIFHT © 2018 苏州安基利尔数据科技有限公司 版权所有 苏ICP备18053267号</p>
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
  .footer {
    padding: 60px 0 30px;
    background-color: #24252A;
    .footer-section {
      width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    .footer-main {
      font-size: 14px;
      color: #fff;
      height: auto;
      zoom: 1;
      display: block;
      &::after {
        content: "";
        display: table;
        clear: both;
        visibility: hidden;
        font-size: 0;
        height: 0;
      }
      &:before {
        content: "";
        display: table;
      }
      .footer-col {
        float: left;
        width: 12%;
        .col-title {
          font-size: 24px;
          margin-bottom: 15px;
        }
        &:first-child {
          width: 50%;
        }
        .col-info {
          line-height: 30px;
        }
        .footer-col-img {
          img {
            width: 128px;
            height: 128px;
          }
        }
        .text {
          font-size: 14px;
          color: #fff;
          margin-top: 10px;
        }
        &.footer-col-imgs {
          text-align: center;
        }
      }
    }
  }
  .copyright{
    padding-top: 20px;
    text-align: center;
  }
</style>