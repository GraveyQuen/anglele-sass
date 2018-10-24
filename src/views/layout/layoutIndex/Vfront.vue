<template>
  <div class="front">
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from './parts/footer'
  export default {
    components:{
      Footer
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>

</style>