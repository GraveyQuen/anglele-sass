<template>
  <div class="order-page">
    <Tabs v-model="page" :animated="false" class="tab-main">
      <TabPane label="进行中" name="order">
        <orderList :old="false" v-if="page === 'order'"></orderList>
      </TabPane>
      <TabPane label="历史订单" name="order-history">
        <orderList :old="true" v-if="page === 'order-history'"></orderList>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import orderList from './orderList'
  export default {
    components: {
      orderList
    },
    data() {
      return {
        page: 'order'
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .order-page {
    background-color: #fff;
    border: 1px solid #dcdee2;
    border-color: #e8eaec;
    border-bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-top: 0;
  }
</style>