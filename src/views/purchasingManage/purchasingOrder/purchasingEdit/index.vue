<template>
  <div>
    <purchasingPage :isEdit="true" :itemId="id"></purchasingPage>
  </div>
</template>

<script>
import purchasingPage from '../purchasing/index'
  export default {
    components:{
      purchasingPage
    },
    data() {
      return {}
    },
    computed:{
      id(){
        return this.$route.query.id
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  
</style>