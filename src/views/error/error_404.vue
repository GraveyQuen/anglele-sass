<template>
  <div class="nopage">
    <dl>
      <dt>咦~页面不见了~</dt>
      <dd>请核对您输入的页面地址是否正确哦~</dd>
      <dd>
        <a class="btn btn-primary" href="/index">返回首页</a>
      </dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {},
    created() {
      document.querySelector('body').className = 'error'
    }
  }
</script>

<style lang='less'>
  body.error {
    background-color: #fff!important;
  }
  
  .nopage {
    width: 520px;
    height: 530px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -260px;
    margin-top: -265px;
    text-align: center;
    dl {
      font-size: 20px;
      color: #6d6d6d;
    }
    dt {
      padding: 35px 0 0;
      font-size: 40px;
      color: #010101;
    }
    .btn {
      display: inline-block;
      margin-bottom: 0;
      font-size: 14px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
      background-color: #17D6BA;
      border: 1px solid #17D6BA;
      color: #FFF;
      padding: 0;
      width: 148px;
      text-decoration: none;
      margin-top: 35px;
    }
    .btn-primary:hover {
      color: #fff;
    }
    .nopage dl dd a {
      margin-top: 35px;
    }
  }
</style>