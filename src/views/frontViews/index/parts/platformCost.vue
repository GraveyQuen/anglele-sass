<template>
  <div class="platform-cost">
    <div class="platform-cost-main">
      <div class="title">平台使用费用</div>
      <div class="price-main">
        <div class="price-main-item">
          <div class="price-main-item-title">基础版</div>
          <div class="price-main-item-main">
            <div class="price-main-item-main-cell">
              <div class="cell-title">使用费</div>
              <div class="cell-price green">18000元</div>
            </div>
            <div class="price-main-item-main-cell">
              <div class="cell-title">维护费</div>
              <div class="cell-price green">5800/年</div>
            </div>
          </div>
          <div class="price-main-item-btn">
            <a href="">服务功能</a>
          </div>
        </div>
        <div class="price-main-item">
          <div class="price-main-item-title">旗舰版</div>
          <div class="price-main-item-main">
            <div class="price-main-item-main-cell">
              <div class="cell-title">使用费</div>
              <div class="cell-price orange">158000元</div>
            </div>
            <div class="price-main-item-main-cell">
              <div class="cell-title">维护费</div>
              <div class="cell-price orange">12000/年</div>
            </div>
          </div>
          <div class="price-main-item-btn">
            <a href="" class="orange">服务功能</a>
          </div>
        </div>
      </div>
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
        background-color: rgba(0, 0, 0, .7);
        height: 300px;
        display: flex;
        &::after {
          content: '';
          position: absolute;
          top: 5px;
          left: calc(50% - 1px);
          width: 2px;
          height: 295px;
          background-color: rgba(255, 255, 255, .5)
        }
        .price-main-item {
          flex: 1;
          &:first-child {
            border-top: 5px solid #23D5C0;
          }
          &:last-child {
            border-top: 5px solid #FF743D;
          }
        }
        .price-main-item-title {
          font-size: 24px;
          color: #fff;
          text-align: center;
          padding: 40px 0 45px;
        }
        .price-main-item-main {
          display: flex;
          .price-main-item-main-cell {
            flex: 1;
            text-align: center;
            &:first-child {
              border-right: 1px solid rgba(255, 255, 255, .5);
            }
            .cell-title {
              font-size: 16px;
              color: #fff;
              margin-bottom: 20px;
            }
            .cell-price {
              font-size: 24px;
              &.green {
                color: #23D5C0;
              }
              &.orange {
                color: #FF6326;
              }
            }
          }
        }
      }
      .price-main-item-btn {
        text-align: center;
        padding-top: 30px;
        a {
          text-align: center;
          display: inline-block;
          width: 100px;
          height: 24px;
          color: #fff;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          background: linear-gradient(90deg, rgba(106, 225, 255, 1) 0%, rgba(22, 208, 255, 1) 100%);
          border-radius: 12px;
          &.orange {
            background: linear-gradient(90deg, rgba(255, 160, 123, 1) 0%, rgba(255, 111, 54, 1) 100%);
          }
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