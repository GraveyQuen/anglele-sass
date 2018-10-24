<template>
  <div class="processing">
    <div class="front-section">
      <div class="processing-title">如何快速处理订单</div>
      <div class="processing-text">客户通过手机APP、小程序快速下单，商家高效处理订单，一键打印报表，订单一目了然</div>
      <div class="processing-icon">
        <img src="../../../../assets/images/processing-icon.png" />
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
  .processing {
    height: 720px;
    background: radial-gradient(circle, rgba(255, 72, 0, 1), rgba(255, 188, 161, 1));
    color: #fff;
    text-align: center;
    .processing-title {
      padding: 37px 0 24px;
      font-size: 36px;
    }
    .processing-text {
      font-size: 18px;
    }
    .processing-icon {
      margin-top: 54px;
      img {
        max-width: 100%;
      }
    }
  }
</style>