<template>
  <div class="qn-container">
    <div class="qn-item-group open">
      <div class="qn-ac-items">
        <a class="ac-item" :href='"http://wpa.qq.com/msgrd?v=3&uin=1485585629&site=qq&menu=yes"'>
          <span class="iconfont ang-wodekefu"></span>
          <div class="ac-item-desc">在线客服</div>
        </a>
      </div>
    </div>
    <div class="qn-item-group open">
      <div class="qn-ac-items">
        <div class="ac-item" @click="experience">
          <span class="iconfont ang-kujialeqiyezhan_mianfeishiyong"></span>
          <div class="ac-item-desc">免费体验</div>
        </div>
      </div>
    </div>
    <div class="qn-item-group open">
      <div class="qn-ac-items">
        <div class="ac-item" @click="backToTop">
          <span class="iconfont ang-icon3"></span>
          <div class="ac-item-desc">回到顶部</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {};
  },
  methods: {
    backToTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    experience() {
      this.$emit("on-change", true);
    }
  }
};
</script>
<style lang='less' scoped>
.qn-container {
  position: fixed;
  right: 10px;
  bottom: 50px;
  z-index: 902;
  user-select: none;
}

.qn-item-group {
  width: 50px;
  margin-top: 10px;
  &.open {
    .qn-ac-items {
      height: auto;
      overflow: inherit;
    }
    .count {
      display: none;
    }
  }
}

.qn-ac-items {
  width: 50px;
  height: 0;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  .ac-item {
    position: relative;
    display: block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    &:hover .ac-item-desc {
      display: block;
    }
  }
  .iconfont {
    font-size: 24px;
    padding: 5px;
    color: #bdbdbd;
    border-radius: 2px;
    background-color: #f7f4f4;
    &:hover {
      color: #23D5C0;
    }
  }
  .ac-item-count {
    position: absolute;
    width: 18px;
    height: 18px;
    right: 5px;
    top: 5px;
    background-color: #e6e6e6;
    color: #fff;
    text-align: center;
    line-height: 18px;
    font-size: 12px;
    border-radius: 9px;
    pointer-events: none;
    span {
      display: block;
      width: 100%;
      height: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transform: scale(0.8);
      -webkit-transform: scale(0.8);
      -moz-transform: scale(0.8);
      -o-transform: scale(0.8);
      -ms-transform: scale(0.8);
    }
  }
  .ac-item-desc {
    position: absolute;
    display: none;
    height: 34px;
    line-height: 24px;
    top: 8px;
    right: 55px;
    padding: 5px 10px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    word-break: keep-all;
    white-space: nowrap;
    border-radius: 4px;
    &:after {
      position: absolute;
      content: "";
      right: -5px;
      top: 10px;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-left: 5px solid #fff;
      border-bottom: 5px solid transparent;
    }
  }
}
</style>