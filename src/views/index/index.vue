<template>
  <div>
    <div class="row-list">
      <Row>
        <Col span="16" class="col-left">
        <Card class="goods-list" dis-hover title="最新预警">
          <newWarm></newWarm>
        </Card>
        </Col>
        <Col span="8" class="col-right">
        <Card class="goods-list" dis-hover>
          <newMessage></newMessage>
          <todayOrder></todayOrder>
        </Card>
        </Col>
      </Row>
    </div>
    <div>
      <Row>
        <Card class="goods-list" dis-hover>
          <todaySales></todaySales>
          <todayCustomer></todayCustomer>
        </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import newWarm from './parts/newWarm';
  import newMessage from './parts/newMessage';
  import todayOrder from './parts/todayOrder';
  import todaySales from './parts/todaySales';
  import todayCustomer from './parts/todayCustomer'
  export default {
    components: {
      newWarm,
      newMessage,
      todayOrder,
      todaySales,
      todayCustomer
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
  .row-list {
    margin: 30px 0;
  }
  
  .col-left {
    padding-right: 10px;
  }
  
  .col-right {
    padding-left: 10px;
  }
</style>