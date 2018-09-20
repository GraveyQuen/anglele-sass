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
const LOGIN_PAGE_NAME = 'login'
const token = store.state.authorization;
router.beforeEach((to, from, next) => {
  if (token === '' && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
    console.log('nologind')
  } else if (token != '' && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
    console.log('login')
  } else if (token != '' && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: '_home' // 跳转到home页
    })
    console.log('logined')
  } else{
    next();
  }

  // if (to.meta.requireAuth) {
  //   next();
  // } else {
  // if (store.state.authorization) {
  //   next();
  // } else {
  //   Modal.confirm({
  //     content: '您还没有登录，请登录',
  //     onOk() {
  //       next({
  //         name: 'login',
  //         query: {
  //           redirect: to.fullPath
  //         }
  //       })
  //     },
  //     onCancel() {
  //       router.replace({
  //         path: '/'
  //       })
  //     }
  //   });
  // }
  // }
});

router.afterEach((to, from) => {

})

export default router;