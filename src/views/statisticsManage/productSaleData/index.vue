<template>
  <div class="page-inner">
    <div class="hole-row">
      <productSummary></productSummary>
    </div>
    <Row>
      <Col span="24" class="hole-row">
      <producrSummaryPie></producrSummaryPie>
      </Col>
      <Col span="24">
      <categorySummaryPie></categorySummaryPie>
      </Col>
    </Row>
  </div>
</template>

<script>
  import productSummary from './parts/productSummary.vue' // 产品销售汇总
  import producrSummaryPie from './parts/producrSummaryPie' // 产品分类
  import categorySummaryPie from './parts/categorySummaryPie.vue' // 分类
  export default {
    components: {
      productSummary,
      producrSummaryPie,
      categorySummaryPie
    },
    data() {
      return {
  
      }
    },
    methods: {
  
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .hole-row{
    margin-bottom: 20px;
  }
</style>