<template>
  <div class="service">
    <div class="icon">
      <img src="https://resource.anglele.com/saas/static/service-icon.png">
    </div>
    <div class="service-main">
      <div class="service-item" v-for="(item,index) in list" :key="index">
        <div class="service-item-title">{{item.title}}</div>
        <div class="service-item-text" v-for="(sub,subIndex) in item.desc" :key="subIndex">{{sub}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
          title: '系统初始化',
          desc: ['供应商账号添加', '供应商角色分配', '系统参数配置']
        }, {
          title: '数据整理',
          desc: ['现有产品管理', '配套产品图库', '产品数据刷入系统']
        }, {
          title: '线下培训',
          desc: ['系统流程说明', '岗位操作培训', '运行流程跟踪']
        }, {
          title: '系统保障',
          desc: ['定制化客户服务体系', '系统问题及时检修与反馈', '运行稳定、数据安全']
        }]
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .service {
    .icon {
      text-align: center;
    }
    .service-main {
      padding-top: 50px;
      position: relative;
      height: auto;
      zoom: 1;
      display: block;
      &::after {
        content: "";
        display: table;
        clear: both;
        visibility: hidden;
        font-size: 0;
        height: 0;
      }
      &:before {
        content: "";
        display: table;
      }
      .service-item {
        float: left;
        width: 25%;
        padding: 0 50px;
        text-align: center;
        .service-item-title {
          font-size: 24px;
          color: #666;
          margin-bottom: 16px;
        }
        .service-item-text {
          font-size: 14px;
          color: #666;
          margin-top: 24px;
        }
      }
    }
  }
</style>