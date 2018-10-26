<template>
  <div class="funtions">
    <div class="funtions-item" v-for="(item,index) in list" :key="index">
      <div class="funtions-item-icon">
        <span class="icon" :class="'icon-'+ index"></span>
      </div>
      <div class="funtions-item-title">{{item.title}}</div>
      <div class="funtions-item-text">{{item.desc}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
          icon: '',
          title: '商品管理',
          desc: '录入商品基本信息，实时修改商品单价'
        }, {
          icon: '',
          title: '采购管理',
          desc: '自动汇总订单数据，自动分拣订单数据'
        }, {
          icon: '',
          title: '销售管理',
          desc: '控制用户下单时间，实时查看用户下单数据，代替用户后台下单，实配为准，不同用户不同价格'
        }, {
          icon: '',
          title: '客户管理',
          desc: '维护现有客户，方便客户登录APP下单'
        }, {
          icon: '',
          title: '库存管理',
          desc: '一键入库、高效管理，实时查看商品库存量，自动报损、报缺、及时报警'
        }, {
          icon: '',
          title: '财务结算',
          desc: '多维度结算系统，结算单打印，结算方便快捷，线上线下结算数据同步'
        }, {
          icon: '',
          title: '移动端应用',
          desc: 'APP、微信小程序，随时随地查看订单、购物车、个人中心、查询结算单等'
        }, {
          icon: '',
          title: '数据分析',
          desc: '数据汇总、多维度销售分析、多维度利润分析，海量数据精确统计、精准分析，让您一目了然'
        }]
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .funtions {
    position: relative;
    margin-left: -40px;
    padding-bottom: -40px;
    margin-right: 0;
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
    .funtions-item {
      margin-bottom: 40px;
      margin-left: 40px;
      padding: 55px 50px 0;
      text-align: center;
      float: left;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      width: 270px;
      height: 340px;
      background: url('https://resource.anglele.com/saas/static/function-bg.png') no-repeat;
      transition: all .2s linear;
      &:hover {
        background: #fff;
        box-shadow: 0px 0px 32px 8px rgba(0, 0, 0, 0.2);
      }
      .funtions-item-icon {
        .icon {
          display: inline-block;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: url('https://resource.anglele.com/saas/static/function-icon.png') no-repeat;
          &.icon-0 {
            background-position: 0 0;
          }
          &.icon-1 {
            background-position: 0 -80px;
          }
          &.icon-2 {
            background-position: 0 -160px;
          }
          &.icon-3 {
            background-position: 0 -240px;
          }
          &.icon-4 {
            background-position: 0 -320px;
          }
          &.icon-5 {
            background-position: 0 -400px;
          }
          &.icon-6 {
            background-position: 0 -480px;
          }
          &.icon-7 {
            background-position: 0 -560px;
          }
          &.icon-8 {
            background-position: 0 -640px;
          }
        }
      }
      .funtions-item-title {
        font-size: 24px;
        color: #333;
        padding: 24px 0;
      }
      .funtions-item-text {
        font-size: 14px;
        color: #666;
      }
    }
  }
</style>