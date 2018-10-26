<template>
  <div class="front">
    <headerBar></headerBar>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {
    mapMutations,
    mapActions
  } from 'vuex'
    import Footer from './parts/footer'
    import headerBar from './parts/header'
    export default {
      components: {
        Footer,
        headerBar
      },
      data() {
        return {}
      },
      methods: {}
    }
</script>

<style lang='less' scoped>
  
</style>