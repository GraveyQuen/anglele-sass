<template>
  <div>
    <purchase :isEdit="true"></purchase>
  </div>
</template>

<script>
import purchase from '../purchase/index'
  export default {
    components:{
      purchase
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  
</style>