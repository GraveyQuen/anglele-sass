<template>
  <div class="order-page">
    <Tabs v-model="page" :animated="false" class="tab-main" @on-click="changeTabs" style="overflow:inherit">
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
    computed: {
      getId(){
        return this.$route.query.status
      }
    },
    watch:{
      getId(val){
        if(val === undefined || val === 1){
          this.page = 'order';
        }else{
          this.page = 'order-history';
        }
      }
    },
    methods: {
      changeTabs(data){
        if(data === 'order'){
          this.$router.push({
            path: '/salesManage/orderManage',
            query: {status: 1}
          })
        }else{
          this.$router.push({
            path: '/salesManage/orderManage',
            query: {status: 2}
          })
        }
      }
    },
    created(){
      this.page =  Number(this.getId) === 2 ? 'order-history' : 'order'
    }
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