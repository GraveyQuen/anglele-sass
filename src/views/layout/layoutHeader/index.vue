<template>
  <div class="layout-header">
    <a class="logo" href="/bg/home">
      <!-- <img src="../../../assets/images/logo.png"> -->
      <p class="name">安农</p>
      <p>后台管理系统</p>
    </a>
    <ul class="header-ul">
      <li class="hasChild">
        <Dropdown @on-click="onClick">
          <a href="javascript:void(0)">
                    {{userInfo ? userInfo.userName : ''}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
          <DropdownMenu slot="list">
            <DropdownItem name="account">账户管理</DropdownItem>
            <DropdownItem name="logOut">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  export default {
    data() {
      return {}
    },
    computed: {
      userInfo() {
        return this.$store.state.base.loginInfo;
      }
    },
    methods: {
      ...mapActions(['loginOut']),
      onClick(data) {
        if (data === 'logOut') {
          this.loginOut();
          window.location.href = '/bg/login';
        } else if(data === 'account'){
          this.$router.push({name: 'userInfo'})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .layout-header {
    position: fixed;
    z-index: 300;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1200px;
    height: 50px;
    background: #2d303b;
    .logo {
      float: left;
      width: 150px;
      height: 50px;
      text-align: center;
      margin: 0;
      padding: 0;
      color:#515a6e;
      .name{
        padding: 4px 0;
        font-size: 14px;
      }
      &:after {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
      img {
        max-width: 120px;
        max-height: 26px;
        vertical-align: middle;
      }
    }
    .header-ul {
      text-align: right;
      padding-right: 20px;
      li{
        list-style: none;
      }
      .hasChild {
        line-height: 50px;
        a {
          color: #fff;
        }
      }
      ul {
        li {
          text-align: center;
        }
      }
    }
  }
</style>