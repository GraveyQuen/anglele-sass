<template>
  <div class="paging-inner">
    <Tabs type="card" :animated="false">
      <TabPane label="配送员管理">
        <mainPage :type="1" title="配送员"></mainPage>
      </TabPane>
      <TabPane label="采购员管理">
        <mainPage :type="2" title="采购员"></mainPage>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import mainPage from './mainPage'
  export default {
    components: {
      mainPage
    },
    data() {
      return {
        
      }
    },
    methods: {},
    created() {}
  }
</script>

<style lang='less'>
  .paging-inner>.ivu-tabs-card>.ivu-tabs-content {
    margin-top: -16px;
  }
  
  .paging-inner>.ivu-tabs-card>.ivu-tabs-content>.ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }
  
  .paging-inner>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }
  
  .paging-inner>.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }
</style>