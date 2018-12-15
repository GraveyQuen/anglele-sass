<template>
  <div class="front-wrapper">
    <indexBanner></indexBanner>
    <div class="sections">
      <div class="front-section">
        <dividerTitle title="行业现状"></dividerTitle>
        <div class="section-main">
          <industryStatus></industryStatus>
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
  import indexBanner from './parts/indexBanner'
  import dividerTitle from './parts/dividerTitle'
  import ourFunction from './parts/ourFunction'
  import ourService from './parts/ourService'
  import processingOrders from './parts/processingOrders'
  import brightProduct from './parts/brightProduct'
  import platformCost from './parts/platformCost'
  import industryStatus from './parts/industryStatus'
  export default {
    components: {
      indexBanner,
      dividerTitle,
      ourFunction,
      ourService,
      processingOrders,
      brightProduct,
      platformCost,
      industryStatus
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style lang='less'>
  .front-wrapper {
    margin-top: -80px;
  }
  
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
</style>