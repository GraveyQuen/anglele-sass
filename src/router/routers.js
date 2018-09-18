import Main from '../views/layout/layoutTmp/Vlayout.vue'
export default [{
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      component: resolve => require(['@/views/index/index.vue'], resolve),
      meta: {
        title: '首页',
        hideInMenu: true,
        notCache: true
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
        name: 'inventoryIn',
        component: resolve => require(['@/views/inventoryManage/inventoryIn/index.vue'], resolve),
        meta: {
          title: '入库管理',
        },
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
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/views/login/index.vue'], resolve)
  }
]