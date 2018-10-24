<template>
  <div class="front-wrapper">
    <div class="index-banner"></div>
    <div class="sections">
      <div class="front-section">
        <dividerTitle title="行业现状"></dividerTitle>
        <div class="section-main">
          <div class="industry">
            <div class="industry-item">
              <div class="item-title left orange">
                <div class="index">01.</div>
                <div class="title-text">人力浪费</div>
              </div>
              <div class="item-title right green">
                <div class="index">02.</div>
                <div class="title-text">人工结算</div>
              </div>
              <div class="item-content left">
                <p style="padding-top: 66px;">采购、配送等作业效率低下</p>
              </div>
              <div class="item-content right">
                <p style="padding-top: 53px;">采购数量、库存余量、 财务结算、<br/>销售统计等多模块</p>
              </div>
            </div>
            <div class="industry-item">
              <div class="item-title left green">
                <div class="index">03.</div>
                <div class="title-text">效率低下</div>
              </div>
              <div class="item-title right blue">
                <div class="index">04.</div>
                <div class="title-text">信息不对称</div>
              </div>
              <div class="item-content left">
                <p style="padding-top: 39px;">单据手写，流程不标准，环节冗余，<br/>仓库物流监管困难，销售数据无法及<br/>时获取</p>
              </div>
              <div class="item-content right">
                <p style="padding-top: 39px;">订单下单数量和实配数量不对称，手<br/>抄采购单和实际数量不对称，纸质结<br/>算单信息不对称</p>
              </div>
            </div>
            <div class="industry-item">
              <div class="item-title left blue">
                <div class="index">05.</div>
                <div class="title-text">下单麻烦</div>
              </div>
              <div class="item-title right orange">
                <div class="index">06.</div>
                <div class="title-text">发展瓶颈</div>
              </div>
              <div class="item-content left">
                <p style="padding-top: 53px;">客户通过电话、微信、手抄单下单，<br/>大大降低订单准确率，容易发生扯皮</p>
              </div>
              <div class="item-content right">
                <p style="padding-top: 39px;">订单增加，货品种类变多，人力无<br/>法快速解决等原因造 成难以扩大经<br/>营规模</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sections">
      <processingOrders></processingOrders>
    </div>
    <div class="sections">
      <div class="front-section">
        <dividerTitle title="我们的功能"></dividerTitle>
        <div class="section-main">
          <ourFunction></ourFunction>
        </div>
      </div>
    </div>
    <div class="sections">
      <brightProduct></brightProduct>
    </div>
    <div class="sections">
      <div class="front-section">
        <dividerTitle title="我们的服务"></dividerTitle>
        <div class="section-main">
          <ourService></ourService>
        </div>
      </div>
    </div>
    <div class="sections">
      <platformCost></platformCost>
    </div>
  </div>
</template>

<script>
  import dividerTitle from './parts/dividerTitle'
  import ourFunction from './parts/ourFunction'
  import ourService from './parts/ourService'
  import processingOrders from './parts/processingOrders'
  import brightProduct from './parts/brightProduct'
  import platformCost from './parts/platformCost'
  export default {
    components: {
      dividerTitle,
      ourFunction,
      ourService,
      processingOrders,
      brightProduct,
      platformCost
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less'>
  .sections {
    padding: 60px 0;
    .front-section {
      width: 1200px;
      margin-left: auto;
      margin-right: auto;
      .section-main {
        padding-top: 80px;
      }
    }
  }
  
  .industry {
    .industry-item {
      position: relative;
      margin-bottom: 60px;
      background-color: #E0E0E0;
      height: 240px;
      padding: 0 280px;
      &:last-child {
        margin-bottom: 0;
      }
      &::after {
        content: '';
        position: absolute;
        top: 40px;
        left: 50%;
        height: 160px;
        border-left: 1px solid #CCC;
      }
      .item-content {
        font-size: 18px;
        color: #666;
        position: absolute;
        top: 40px;
        bottom: 40px;
        &.left {
          left: 280px;
          text-align: left;
        }
        &.right {
          right: 280px;
          text-align: right;
        }
      }
      .item-title {
        position: absolute;
        width: 240px;
        height: 240px;
        top: 0;
        color: #fff;
        text-align: center;
        &.left {
          left: 0;
          &::after {
            position: absolute;
            top: 100px;
            right: -20px;
            content: '';
            width: 0;
            height: 0;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
          }
          &.orange {
            &::after {
              border-left: 20px solid #F97946;
            }
          }
          &.green {
            &::after {
              border-left: 20px solid #ABED5D;
            }
          }
          &.blue {
            &::after {
              border-left: 20px solid #60B7F8;
            }
          }
        }
        &.right {
          right: 0;
          &::after {
            position: absolute;
            top: 100px;
            left: -20px;
            content: '';
            width: 0;
            height: 0;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
          }
          &.orange {
            &::after {
              border-right: 20px solid #F97946;
            }
          }
          &.green {
            &::after {
              border-right: 20px solid #ABED5D;
            }
          }
          &.blue {
            &::after {
              border-right: 20px solid #60B7F8;
            }
          }
        }
        .index {
          font-size: 48px;
          margin: 45px 0 10px;
        }
        .title-text {
          font-size: 36px;
        }
      }
      .orange {
        background-color: #F97946;
      }
      .green {
        background-color: #ABED5D;
      }
      .blue {
        background-color: #60B7F8;
      }
    }
  }
  
  .index-banner {
    position: relative;
    height: 680px;
    background: top center url('../../../assets/images/index-banner.png') no-repeat;
  }
</style>