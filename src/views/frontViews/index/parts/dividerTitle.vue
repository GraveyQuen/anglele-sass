<template>
  <div class="divider">
    <span class="divider-text">{{title}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      title: String
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .divider {
    position: relative;
    width: 100%;
    height: 54px;
    line-height: 54px;
    color: #333;
    text-align: center;
    .divider-text {
      font-size: 36px;
      display: inline-block;
    }
    &::after {
      right: 0;
      background: linear-gradient(to right, transparent,#23D5C0); 
    }
    &:before {
      left: 0;
      background: linear-gradient(to right, #23D5C0, transparent); 
    }
  }
  
  .divider::after,
  .divider::before {
    position: absolute;
    content: "";
    top: 50%;
    width: 40%;
    height: 3px;
  }
</style>