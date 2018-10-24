<template>
  <div class="platform-cost">
    <div class="platform-cost-main">
      <div class="title">平台使用费用</div>
      <div class="price-main">平台使用费用</div>
      <div class="btn">
        <a>免费体验</a>
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
  .platform-cost {
    position: relative;
    height: 700px;
    background: url('../../../../assets/images/platform-cost-bg.png');
    .platform-cost-main {
      position: absolute;
      top: 80px;
      left: calc(50% - 300px);
      width: 600px;
      .title {
        text-align: center;
        font-size: 36px;
        color: #fff;
      }
      .price-main {
        position: relative;
        margin: 36px 0 70px;
        border-top: 3px solid #23D5C0;
        background-color: rgba(0, 0, 0, .7);
        height: 300px;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: calc(50% - 1px);
          width: 2px;
          height: 297px;
          background-color: rgba(255, 255, 255, .5)
        }
      }
      .btn {
        text-align: center;
        a {
          display: inline-block;
          width: 300px;
          height: 60px;
          color: #fff;
          line-height: 60px;
          text-align: center;
          font-size: 24px;
          background: linear-gradient(90deg, rgba(255, 99, 38, 1) 0%, rgba(240, 141, 103, 1) 100%);
          border-radius: 30px;
        }
      }
    }
  }
</style>