import Vue from 'vue'
import App from './App.vue'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import router from './router/index'
import store from './store/store'
import clickoutside from './directives/clickoutside'
import * as filters from './utils/filters' //过滤器
import axios from './http'
import * as api from './api'
import _ from 'lodash'
import md5 from 'js-md5'
import VeLine from 'v-charts/lib/line.common' // 折线图
import VePie from 'v-charts/lib/pie.common'  // 饼图

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)

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