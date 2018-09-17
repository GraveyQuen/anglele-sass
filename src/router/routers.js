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
      }]
    }, {
      path: '/staffManageMent',
      name: 'staffManageMent',
      component: resolve => require(['@/views/staffManageMent/index.vue'], resolve),
      meta: {
        title: '人员管理',
      },
      children: [{
        path: '/staffManageMent/custom',
        name: 'custom',
        component: resolve => require(['@/views/staffManageMent/custom/index.vue'], resolve),
        meta: {
          title: '客户管理',
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