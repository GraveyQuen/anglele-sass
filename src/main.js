import Vue from 'vue'
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import router from './router/index'
import store from './store/store'
import clickoutside from './directives/clickoutside'
import * as filters from './filters/index' //过滤器
import axios from './http'
import * as api from './api'
import _ from 'lodash'
import md5 from 'js-md5'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('clickoutside', clickoutside);
Vue.use(iView);


Vue.prototype.$md5 = md5
Vue.prototype.$api = api; //所有接口列表挂载
Vue.prototype.$http = axios;
Vue.prototype.$clearData = (data) => JSON.parse(JSON.stringify(data));
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')