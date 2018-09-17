import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import {
  Modal
} from 'iview'
import routes from './routers'

Vue.use(Router);

const router = new Router({
  routes,
  mode: 'history',
  base: '/bg/',
  linkActiveClass: 'active',
})

// const router = new Router({
//   mode: 'history',
//   base: '/bg/',
//   linkActiveClass: 'active',
//   routes: [{
//       path: '/',
//       name: 'home',
//       redirect: '/index',
//       component: resolve => require(['@/views/layout/layoutTmp/Vlayout.vue'], resolve),
//       children: [{
//         path: '/index',
//         name: 'index',
//         component: resolve => require(['@/views/index/index.vue'], resolve),
//         meta: {
//           title: '首页',
//         }
//       }, {
//         path: '/setting',
//         name: 'setting',
//         component: resolve => require(['@/views/setting/index.vue'], resolve),
//         meta: {
//           title: '系统设置',
//         },
//         children: [{
//           path: '/setting/unitSetting',
//           name: 'unitSetting',
//           component: resolve => require(['@/views/setting/unitSetting/index.vue'], resolve),
//           meta: {
//             title: '计量单位设置',
//           },
//         },{
//           path: '/setting/storehouse',
//           name: 'storehouse',
//           component: resolve => require(['@/views/setting/storehouse/index.vue'], resolve),
//           meta: {
//             title: '仓库管理',
//           },
//         }]
//       }]
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: resolve => require(['@/views/login/index.vue'], resolve)
//     }
//   ]
// });

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next();
  } else {
    if (store.state.authorization) {
      next();
    } else {
      Modal.confirm({
        content: '您还没有登录，请登录',
        onOk() {
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        },
        onCancel() {
          router.replace({
            path: '/'
          })
        }
      });
    }
  }
});

router.afterEach((to, from) => {

})

export default router;