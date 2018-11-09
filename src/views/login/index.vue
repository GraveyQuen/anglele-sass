<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-logo">
        <img src="https://resource.anglele.com/saas/static/logo.png">
        <div class="name">智慧安农后台管理系统</div>
      </div>
      <div class="login-form">
        <div class="form-box">
          <div class="form-item">
            <div class="form-item-label">用户名：</div>
            <div class="form-item-content">
              <input type="text" v-model.trim="loginApi.userName" @blur="blurInput" @keyup.enter="submit" class="form-input" placeholder="请输入用户名">
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-label">密码：</div>
            <div class="form-item-content">
              <input type="password" v-model.trim="loginApi.password" @blur="blurInput" @keyup.enter="submit" class="form-input" placeholder="请输入密码">
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-label">验证码：</div>
            <div class="form-item-content">
              <input type="text" v-model.trim="loginApi.code" @keyup.enter="submit" class="form-input small" placeholder="请输入验证码">
              <img :src="picCodeUrl" @click="getUid()" class="picCode">
            </div>
          </div>
          <div class="form-item" v-if="moreRole">
            <div class="form-item-label">角色：</div>
            <div class="form-item-content">
              <Select v-model="loginApi.roleCode" style="width:200px">
            <Option v-for="item in roleList" :value="item.code" :key="item.id">{{ item.name }}</Option>
        </Select> </div>
          </div>
          <div class="form-item">
            <div class="form-item-label"></div>
            <div class="form-item-content">
              <Button type="success" @click="submit" style="width: 100%;">登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {
    getuuId
  } from '@/utils/tools'
  export default {
    data() {
      return {
        loginApi: {
          userName: '',
          password: '',
          code: '',
          r: '',
          roleCode: ''
        },
        random: '',
        rule: {
          userName: [{
            required: true,
            message: '用户名/手机号不能为空',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '验证码不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        roleList: [],
        moreRole: false
      }
    },
    computed: {
      picCodeUrl() {
        let host = "";
        if (window.location.hostname == "localhost")
          host = "http://192.168.0.252:8082";
        if(this.random != '')
          return host + this.$api.captcha + "?r=" + this.random;
      },
      valid() {
        return this.loginApi.userName != '' && this.loginApi.password != '' && this.loginApi.code != ''
      },
      isValid() {
        return this.loginApi.userName != '' && this.loginApi.password != '';
      }
    },
    methods: {
      blurInput(e) {
        if (this.isValid) this.validUser();
      },
      getUid() {
        this.random = getuuId();
      },
      setUser(data) {
        this.$store.commit(types.LOGIN, data);
        let redirect = decodeURIComponent(this.$route.query.redirect || '/home');
        this.$router.push({
          path: redirect
        })
      },
      validUser() {
        let params = this.$clearData(this.loginApi);
        params.password = this.$md5(params.password)
        this.$http.post(this.$api.login, params).then(res => {
          if (res.code === 1000) {
            if (!res.data.token) {
              this.roleList = res.data.roles.filter(item => item.code !== 'CUSTOMER');
              if (this.roleList.length === 1) {
                this.loginApi.roleCode = this.roleList[0].code;
                this.moreRole = false;
              } else {
                this.moreRole = true;
              }
            }
          } else {
            this.moreRole = false;
            this.loginApi.roleCode = '';
            // this.$Message.error(res.message);
          }
        })
      },
      submit() {
        console.log(this.loginApi)
        if (this.valid) {
          let params = this.$clearData(this.loginApi);
          params.r = this.random;
          params.password = this.$md5(params.password)
          this.$http.post(this.$api.login, params).then(res => {
            if (res.code === 1000) {
              if (res.data.token) {
                this.setUser({
                  authorization: res.data.token,
                });
                this.$Notice.success({
                  title: '登录成功！',
                  desc: '恭喜你登录成功！'
                })
              } else {
                this.$Message.error('请选择一种角色登录');
              }
            } else {
              this.loginApi.code = '';
              this.getUid();
              this.$Message.error(res.message);
            }
          })
        } else {
          this.$Message.error('表单验证失败');
        }
      },
      reset(name) {
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getUid();
    }
  }
</script>

<style lang='less'>
  html {
    height: 100%;
  }
  
  body {
    height: 100%;
  }
  
  #app {
    height: 100%;
  }
  
  .login-wrapper {
    align-items: center;
    background-position: 50%;
    background-size: cover;
    display: flex;
    height: 100vh;
    justify-content: center;
    position: relative;
    background-image: url('https://resource.anglele.com/saas/static/login_bg.png');
    .login-box {
      position: relative;
      padding: 100px 60px;
      background-color: rgba(0, 0, 0, .2);
      border-radius: 20px;
      width: 860px;
      .login-logo {
        position: absolute;
        left: 80px;
        top: 100px;
        text-align: center;
        .name {
          font-size: 24px;
          color: #fff;
          margin-top: 10px;
        }
      }
      .login-form {
        padding-left: 370px;
      }
      .form-item {
        margin-bottom: 24px;
        vertical-align: top;
        zoom: 1;
        &:after {
          content: "";
          display: table;
          clear: both;
          visibility: hidden;
          font-size: 0;
          height: 0;
        }
        .form-item-label {
          text-align: right;
          vertical-align: middle;
          float: left;
          font-size: 14px;
          color: #fff;
          line-height: 1;
          padding: 10px 12px 10px 0;
          box-sizing: border-box;
          width: 80px;
        }
        .form-item-content {
          position: relative;
          line-height: 32px;
          font-size: 12px;
          margin-left: 90px;
        }
        .form-input {
          display: inline-block;
          width: 100%;
          height: 32px;
          line-height: 1.5;
          padding: 4px 7px;
          font-size: 14px;
          border: 0;
          border-bottom: 1px solid #dcdee2;
          color: #fff;
          background-color: transparent;
          background-image: none;
          position: relative;
          cursor: text;
          outline: none;
          &.small {
            width: 63%;
          }
        }
        .picCode {
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }
  }
  
  input::-webkit-input-placeholder {
    color: #fff;
  }
  
  input:-ms-input-placeholder {
    color: #fff;
  }
  
  input:-moz-placeholder {
    color: #fff;
  }
  
  input::-moz-placeholder {
    color: #fff;
  }
</style>