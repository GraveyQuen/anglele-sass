<template>
  <div class="menu-box">
    <ul>
      <li v-for="(item,index) in inMenus" :key="index" :class="item.isOpen ? 'on':''">
        <a :title="item.title" @click="toggle(item,index)">
          <i class="arrow"></i>
          <span class="node-name">{{item.title}}</span>
        </a>
        <div :style="{height: item.isOpen ? item.children.length * 40 +'px' : '0px'}">
          <ul>
            <li v-for="(sub,i) in item.children" :key="i">
              <router-link :to="sub.url" :title="sub.title">
                <i class="iconfont" :class="sub.icon"></i>
                <span class="node-name">{{sub.title}}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      nav: {
        type: Array
      }
    },
    data() {
      return {
        inMenus: [],
        currentRoute: ''
      }
    },
    watch: {
      nav: {
        handler: function(newVal, oldVal) {
          this.initMenu();
        },
        deep: true
      },
      '$route' (val) {
        if (val.matched.length > 2) {
          this.currentRoute = val.matched[2].path;
        } else {
          this.currentRoute = '';
        }
        this.initMenu();
      },
      currentRoute: {
        handler: function() {
          this.initMenu();
        },
        deep: true
      }
    },
    methods: {
      initMenu() {
        let arr = this.$clearData(this.nav)
        this.inMenus = arr.map(item => {
          item.children.map(el => {
            if (el.url === this.currentRoute) {
              item.isOpen = true
            }
          })
          return item
        })
      },
      toggle(item, i) {
        if (item.isOpen) {
          item.isOpen = false;
        } else {
          Object.keys(this.inMenus).forEach(key => {
            this.inMenus[key].isOpen = false;
          })
          item.isOpen = !item.isOpen;
        }
      }
    },
    created() {
      this.initMenu();
    },
    mounted() {
      this.currentRoute = this.$route.path;
      this.initMenu();
    }
  }
</script>

<style lang='less' scoped>
  .menu-box {
    overflow: hidden;
    ul {
      width: 150px;
      li {
        a {
          display: block;
          background: rgba(63, 69, 91, .4);
          color: #adb3c4;
          &:hover {
            background: #4bd3b7;
            color: #fff;
            span {
              color: #fff
            }
            i {
              &.arrow {
                &:after {
                  border-color: transparent transparent transparent #fff;
                }
              }
            }
          }
          i {
            display: inline-block;
            width: 50px;
            height: 40px;
            color: #adb3c4;
            text-align: center;
            line-height: 40px;
            vertical-align: top;
            &.arrow {
              &:after {
                content: '';
                display: inline-block;
                margin: 0 -4px 0 0;
                border: 4px solid #adb3c4;
                border-color: transparent transparent transparent #adb3c4;
                vertical-align: middle;
              }
            }
          }
          span {
            display: inline-block;
            width: 100px;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
            white-space: nowrap;
            box-sizing: border-box;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        div {
          height: 0;
          overflow: hidden;
          transition: height 0.2s;
          -moz-transition: height 0.2s;
          -ms-transition: height 0.2s;
          -o-transition: height 0.2s;
          -webkit-transition: height 0.2s;
        }
        &.on {
          a {
            i {
              &:after {
                transform: rotate(90deg);
              }
            }
          }
        }
        li {
          a {
            background: rgba(45, 47, 59, .6);
            color: #7f87ab;
            &:hover {
              background: rgba(45, 47, 59, .6);
              color: #fff;
              i {
                color: #fff;
              }
            }
            i {
              color: #7f87ab;
              font-family: "iconfont" !important;
              font-size: 14px;
              font-style: normal;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            &.active {
              background: #4bd3b7;
              color: #fff;
              i {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>