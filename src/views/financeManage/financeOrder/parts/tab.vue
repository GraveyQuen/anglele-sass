<template>
  <div class="switch-tabs">
    <ul>
      <li v-for="(item,index) in tabData" :key="index" :class="item.id === tab ? 'current': ''" @click="switchTab(item)">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      tab: {
        type: Number,
        default: 1
      },
      tabData: {
        type: Array
      }
    },
    data() {
      return {}
    },
    methods: {
      switchTab(item){
        this.$emit('on-change',item.id)
      }
    }
  }
</script>

<style lang='less' scoped>
  .switch-tabs {
    border-bottom: 1px solid #dcdee2;
    ul {
      li {
        list-style: none;
        display: inline-block;
        height: 100%;
        padding: 8px 16px;
        margin-right: 16px;
        box-sizing: border-box;
        cursor: pointer;
        text-decoration: none;
        position: relative;
        transition: color .3s ease-in-out;
        &.current {
          color: #2d8cf0;
          &:after {
            content: '';
            height: 2px;
            box-sizing: border-box;
            background-color: #2d8cf0;
            position: absolute;
            left: 0;
            bottom: -1px;
            z-index: 1;
            width: 70px;
          }
        }
      }
    }
  }
</style>