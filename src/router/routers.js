import Main from '../views/layout/layoutTmp/Vlayout.vue'
export default [{
  path: '/login',
  name: 'login',
  component: resolve => require(['@/views/login/index.vue'], resolve),
  meta: {
    title: '登录',
    hideInMenu: true
  }
}, {
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/home',
    name: 'home',
    component: resolve => require(['@/views/index/index.vue'], resolve),
    meta: {
      title: '首页',
      hideInMenu: true
    }
  },{
    path: '/account/userInfo',
    name: 'userInfo',
    component: resolve => require(['@/views/account/userInfo/user/index.vue'], resolve),
    meta: {
      title: '用户信息',
    }
  }, {
    path: '/setting',
    name: 'setting',
    component: resolve => require(['@/views/setting/index.vue'], resolve),
    meta: {
      title: '系统设置',
    },
    children: [{
      path: '/setting/unitSetting',
      name: 'unitSetting',
      component: resolve => require(['@/views/setting/unitSetting/index.vue'], resolve),
      meta: {
        title: '计量单位设置',
      },
    }, {
      path: '/setting/storehouse',
      name: 'storehouse',
      component: resolve => require(['@/views/setting/storehouse/index.vue'], resolve),
      meta: {
        title: '仓库管理',
      },
    }, {
      path: '/setting/classification',
      name: 'classification',
      component: resolve => require(['@/views/setting/classification/index.vue'], resolve),
      meta: {
        title: '分类管理',
      },
    }]
  }, {
    path: '/staffManage',
    name: 'staffManage',
    component: resolve => require(['@/views/staffManage/index.vue'], resolve),
    meta: {
      title: '人员管理',
    },
    children: [{
      path: '/staffManage/custom',
      name: 'custom',
      component: resolve => require(['@/views/staffManage/custom/index.vue'], resolve),
      meta: {
        title: '客户管理',
      },
    }, {
      path: '/staffManage/supplier',
      name: 'supplier',
      component: resolve => require(['@/views/staffManage/supplier/index.vue'], resolve),
      meta: {
        title: '供应商管理',
      },
    }]
  }, {
    path: '/inventoryManage',
    name: 'inventoryManage',
    component: resolve => require(['@/views/inventoryManage/index.vue'], resolve),
    meta: {
      title: '库存管理',
    },
    children: [{
      path: '/inventoryManage/products',
      name: 'products',
      component: resolve => require(['@/views/inventoryManage/products/index.vue'], resolve),
      meta: {
        title: '产品管理',
      },
    }, {
      path: '/inventoryManage/inventoryIn',
      name: 'inventory',
      component: resolve => require(['@/views/inventoryManage/inventoryIn/index.vue'], resolve),
      meta: {
        hideInMenu: true
      },
      redirect: '/inventoryManage/inventoryIn/inventoryList',
      children: [{
        path: '/inventoryManage/inventoryIn/inventoryList',
        name: 'inventoryList',
        component: resolve => require(['@/views/inventoryManage/inventoryIn/inventoryInList/index.vue'], resolve),
        meta: {
          title: '入库管理',
        }
      }, {
        path: '/inventoryManage/inventoryIn/openBill',
        name: 'openBill',
        component: resolve => require(['@/views/inventoryManage/inventoryIn/openBill/index.vue'], resolve),
        meta: {
          title: '入库开单',
        }
      }]
    }, {
      path: '/inventoryManage/inventoryOut',
      name: 'inventoryOut',
      component: resolve => require(['@/views/inventoryManage/inventoryOut/index.vue'], resolve),
      meta: {
        title: '出库管理',
      },
    }, {
      path: '/inventoryManage/wastage',
      name: 'wastage',
      component: resolve => require(['@/views/inventoryManage/wastage/index.vue'], resolve),
      meta: {
        title: '损耗管理',
      },
    }]
  }, {
    path: '/salesManage',
    name: 'salesManage',
    component: resolve => require(['@/views/salesManage/index.vue'], resolve),
    meta: {
      title: '销售管理',
    },
    children: [{
      path: '/salesManage/orderManage',
      name: 'orderManage',
      component: resolve => require(['@/views/salesManage/orderManage/index.vue'], resolve),
      meta: {
        title: '订单管理',
      },
    }, {
      path: '/salesManage/billForGuests',
      name: 'billForGuests',
      component: resolve => require(['@/views/salesManage/billForGuests/index.vue'], resolve),
      meta: {
        title: '代客开单',
      },
    }]
  }, {
    path: '/financeManage',
    name: 'financeManage',
    component: resolve => require(['@/views/financeManage/index.vue'], resolve),
    meta: {
      title: '财务管理',
    },
    children: [{
      path: '/financeManage/financeOrder',
      name: 'financeOrder',
      component: resolve => require(['@/views/financeManage/financeOrder/index.vue'], resolve),
      meta: {
        title: '订单管理',
      },
    }]
  }, {
    path: '/statisticsManage',
    name: 'statisticsManage',
    component: resolve => require(['@/views/statisticsManage/index.vue'], resolve),
    meta: {
      title: '数据分析',
    },
    children: [{
      path: '/statisticsManage/transactionData',
      name: 'transactionData',
      component: resolve => require(['@/views/statisticsManage/transactionData/index.vue'], resolve),
      meta: {
        title: '交易汇总报表',
      }
    }, {
      path: '/statisticsManage/productSaleData',
      name: 'productSaleData',
      component: resolve => require(['@/views/statisticsManage/productSaleData/index.vue'], resolve),
      meta: {
        title: '产品销售报表',
      }
    }, {
      path: '/statisticsManage/hotSaleData',
      name: 'hotSaleData',
      component: resolve => require(['@/views/statisticsManage/hotSaleData/index.vue'], resolve),
      meta: {
        title: '热门销售报表',
      }
    }, {
      path: '/statisticsManage/inventoryData',
      name: 'inventoryData',
      component: resolve => require(['@/views/statisticsManage/inventoryData/index.vue'], resolve),
      meta: {
        title: '库存货品报表',
      }
    }]
  }]
}]