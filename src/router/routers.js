import Main from '../views/layout/layoutTmp/Vlayout.vue';
import indexMain from '../views/layout/layoutIndex/Vfront.vue'
export default [{
  path: '/login',
  name: 'login',
  component: resolve => require(['@/views/login/index.vue'], resolve),
  meta: {
    title: '登录',
    hideInMenu: true
  }
}, {
  path: '*',
  name: 'error_404',
  component: resolve => require(['@/views/error/error_404.vue'], resolve),
  meta: {
    hideInMenu: true
  }
}, {
  path: '/',
  name: '_index',
  redirect: '/index',
  component: indexMain,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/index',
    name: 'index',
    component: resolve => require(['@/views/frontViews/index/index.vue'], resolve),
    meta: {
      hideInMenu: true,
      isFront: true
    }
  }, {
    path: '/pricing',
    name: 'pricing',
    component: resolve => require(['@/views/frontViews/pricing/index.vue'], resolve),
    meta: {
      hideInMenu: true,
      isFront: true
    }
  }]
}, {
  path: '/_home',
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
  }, {
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
    }, {
      path: '/setting/distributionMan',
      name: 'distributionMan',
      component: resolve => require(['@/views/setting/distributionMan/index.vue'], resolve),
      meta: {
        title: '配送人员管理',
      },
    }, {
      path: '/setting/parameterConfig',
      name: 'parameterConfig',
      component: resolve => require(['@/views/setting/parameterConfig/index.vue'], resolve),
      meta: {
        title: '基础参数配置',
      },
    }, {
      path: '/setting/cost',
      name: 'cost',
      component: resolve => require(['@/views/setting/cost/index.vue'], resolve),
      meta: {
        title: '费用管理',
      },
    }, {
      path: '/setting/roleManage',
      name: 'roleManage',
      component: resolve => require(['@/views/setting/roleManage/index.vue'], resolve),
      meta: {
        title: '角色管理',
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
    }, {
      path: '/staffManage/apply',
      name: 'apply',
      component: resolve => require(['@/views/staffManage/apply/index.vue'], resolve),
      meta: {
        title: '申请试用管理',
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
    }, {
      path: '/salesManage/orderFee',
      name: 'orderFee',
      component: resolve => require(['@/views/salesManage/orderFee/index.vue'], resolve),
      meta: {
        title: '订单回收管理',
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
      }
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
    }, {
      path: '/statisticsManage/orderProfitData',
      name: 'orderProfitData',
      component: resolve => require(['@/views/statisticsManage/orderProfitData/index.vue'], resolve),
      meta: {
        title: '销售利润报表',
      }
    }]
  }, {
    path: '/purchasingManage',
    name: 'purchasingManage',
    component: resolve => require(['@/views/purchasingManage/index.vue'], resolve),
    meta: {
      title: '采购管理',
    },
    children: [{
      path: '/purchasingManage/purchasingOrder',
      name: 'purchasingOrder',
      component: resolve => require(['@/views/purchasingManage/purchasingOrder/index.vue'], resolve),
      meta: {
        hideInMenu: true
      },
      redirect: '/purchasingManage/purchasingOrder/purchasingList',
      children: [{
        path: '/purchasingManage/purchasingOrder/purchasingList',
        name: 'purchasingList',
        component: resolve => require(['@/views/purchasingManage/purchasingOrder/list/index.vue'], resolve),
        meta: {
          title: '采购单管理',
        }
      }, {
        path: '/purchasingManage/purchasingOrder/purchasingAdd',
        name: 'purchasingAdd',
        component: resolve => require(['@/views/purchasingManage/purchasingOrder/purchasingAdd/index.vue'], resolve),
        meta: {
          title: '新增采购单',
        }
      }, {
        path: '/purchasingManage/purchasingOrder/purchasingEdit',
        name: 'purchasingEdit',
        component: resolve => require(['@/views/purchasingManage/purchasingOrder/purchasingEdit/index.vue'], resolve),
        meta: {
          title: '编辑采购单',
        }
      }, {
        path: '/purchasingManage/purchasingOrder/purchasingIn',
        name: 'purchasingIn',
        component: resolve => require(['@/views/purchasingManage/purchasingOrder/purchasingIn/index.vue'], resolve),
        meta: {
          title: '采购入库',
        }
      }, {
        path: '/purchasingManage/purchasingOrder/purchasingDetail',
        name: 'purchasingDetail',
        component: resolve => require(['@/views/purchasingManage/purchasingOrder/purchasingDetail/index.vue'], resolve),
        meta: {
          title: '采购详情',
        }
      }]
    }]
  }, {
    path: '/returnsManage',
    name: 'returnsManage',
    component: resolve => require(['@/views/returnsManage/index.vue'], resolve),
    meta: {
      title: '退货管理',
    },
    children: [{
      path: '/returnsManage/returnBill',
      name: 'returnBill',
      component: resolve => require(['@/views/returnsManage/returnBill/index.vue'], resolve),
      meta: {
        hideInMenu: true
      },
      redirect: '/returnsManage/returnBill/returnBillList',
      children: [{
        path: '/returnsManage/returnBill/returnBillList',
        name: 'returnBillList',
        component: resolve => require(['@/views/returnsManage/returnBill/list/index.vue'], resolve),
        meta: {
          title: '退货单管理',
        }
      }, {
        path: '/returnsManage/returnBill/returnBillAdd',
        name: 'returnBillAdd',
        component: resolve => require(['@/views/returnsManage/returnBill/add/index.vue'], resolve),
        meta: {
          title: '新增退货单',
        }
      }, {
        path: '/returnsManage/returnBill/returnBillEdit',
        name: 'returnBillEdit',
        component: resolve => require(['@/views/returnsManage/returnBill/edit/index.vue'], resolve),
        meta: {
          title: '编辑退货单',
        }
      }, {
        path: '/returnsManage/returnBill/returnBillDetail',
        name: 'returnBillDetail',
        component: resolve => require(['@/views/returnsManage/returnBill/detail/index.vue'], resolve),
        meta: {
          title: '退货单详情',
        }
      }]
    }, {
      path: '/returnsManage/returnPurchase',
      name: 'returnPurchase',
      component: resolve => require(['@/views/returnsManage/returnPurchase/index.vue'], resolve),
      meta: {
        hideInMenu: true
      },
      redirect: '/returnsManage/returnPurchase/returnPurchaseList',
      children: [{
        path: '/returnsManage/returnPurchase/returnPurchaseList',
        name: 'returnPurchaseList',
        component: resolve => require(['@/views/returnsManage/returnPurchase/list/index.vue'], resolve),
        meta: {
          title: '采购退货管理',
        }
      }, {
        path: '/returnsManage/returnPurchase/returnPurchaseAdd',
        name: 'returnPurchaseAdd',
        component: resolve => require(['@/views/returnsManage/returnPurchase/add/index.vue'], resolve),
        meta: {
          title: '新增采购退货',
        }
      }, {
        path: '/returnsManage/returnPurchase/returnPurchaseEdit',
        name: 'returnPurchaseEdit',
        component: resolve => require(['@/views/returnsManage/returnPurchase/edit/index.vue'], resolve),
        meta: {
          title: '编辑采购退货',
        }
      }, {
        path: '/returnsManage/returnPurchase/returnPurchaseDetail',
        name: 'returnPurchaseDetail',
        component: resolve => require(['@/views/returnsManage/returnPurchase/detail/index.vue'], resolve),
        meta: {
          title: '采购退货详情',
        }
      }]
    }]
  }]
}]