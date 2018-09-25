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

const LOGIN_PAGE_NAME = 'login'
const token = store.state.authorization;
router.beforeEach((to, from, next) => {
  if (token === '' && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token != '' && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token != '' && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: '_home' // 跳转到home页
    })
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