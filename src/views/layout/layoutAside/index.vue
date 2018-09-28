<template>
  <div class="layout-aside">
    <leftMenu :nav="menus"></leftMenu>
  </div>
</template>

<script>
  import leftMenu from '../components/leftMenu/index'
  // import menu from '@/utils/m.js'
  import {
    mapGetters
  } from 'vuex';
  export default {
    components: {
      leftMenu
    },
    data() {
      return {
        menu: [],
      }
    },
    computed: {
      ...mapGetters(['base']),
      menus(){
        let arr = [];
        this.menu.map(el =>{
          el.isOpen = false;
          arr.push(el);
        })
        return arr;
      }
    },
    watch: {
      base(val){
        this.menu = [...val.menu[0].children]
      }
    },
    methods: {
  
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .layout-aside {
    position: fixed;
    z-index: 200;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 150px;
    padding: 30px 0 0;
    background: #31354B;
  }
</style>