<template>
  <div>
    <billMain :isEdit="true"></billMain>
  </div>
</template>

<script>
import billMain from '../billMain/index'
  export default {
    components:{
      billMain
    },
    data() {
      return {
      }
    },

    methods: {
    },
    created(){
    }
  }
</script>

<style lang='less' scoped>
  
</style>