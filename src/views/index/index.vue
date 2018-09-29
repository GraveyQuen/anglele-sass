<template>
  <div>
    <div class="row-list">
      <Row>
        <Col span="16" class="col-left">
          <Card class="goods-list" dis-hover title="最新预警"></Card>
        </Col>
        <Col span="8" class="col-right">
          <Card class="goods-list" dis-hover title="最新消息"></Card>
        </Col>
      </Row>
    </div>
    <div>
      <Row>
        <Col span="16" class="col-left">
          <Card class="goods-list" dis-hover title="最新预警"></Card>
        </Col>
        <Col span="8" class="col-right">
          <Card class="goods-list" dis-hover title="今天订单汇总"></Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  export default {
    components: {

    },
    data() {
      return {}
    },
    methods: {

    },
    created() {

    }
  }
</script>

<style lang='less' scoped>
  .row-list{
    margin: 30px 0;
  }
  .col-left{
    padding-right: 30px;
  }
  .col-right{
    padding-left: 30px;
  }
</style>