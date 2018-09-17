<template>
  <div class="layout">
    <layoutHeader></layoutHeader>
    <div class="wrapper">
      <layoutAside></layoutAside>
      <div class="layout-content">
        <breadCrumb></breadCrumb>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {
    mapMutations,
    mapActions
  } from 'vuex'
  import layoutHeader from '../layoutHeader/index'
  import layoutAside from '../layoutAside/index.vue'
  import breadCrumb from '../components/bread-crumb/bread-crumb.vue'
  export default {
    components: {
      layoutHeader,
      layoutAside,
      breadCrumb
    },
    data() {
      return {}
    },
    watch: {
      '$route' (newRoute) {
        this.setBreadCrumb(newRoute.matched)
      },
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
      ]),
      getUserInfo() {
        this.$http.post(this.$api.findCurrentUser).then(res => {
          if (res.code === 1000) {
            this.$store.commit(types.SET_USER_INFO, res.data);
          }
        })
      },
      getSet() {
        this.$http.post(this.$api.authSettings).then(res => {
          if (res.code === 1000) {
            // console.log(res)
          }
        })
      }
    },
    mounted() {
      this.setBreadCrumb(this.$route.matched)
    },
    created() {
      this.getUserInfo();
      this.getSet();
    }
  }
</script>

<style lang='less' scoped>
  .wrapper {
    min-width: 1200px;
    margin: 50px 0 0;
    overflow: hidden;
    .layout-content {
      position: absolute;
      left: 150px;
      right: 0;
      top: 50px;
      bottom: 0;
      padding: 15px;
      min-width: 1000px;
      margin: 0;
      background: #ebf1f5;
    }
  }
</style>