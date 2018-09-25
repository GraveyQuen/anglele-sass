import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import VueLocalStorage from 'vue-ls';
import {getBreadCrumbList,getHomeRoute} from '@/utils/tools'
import routers from '../router/routers'


Vue.use(VueLocalStorage);
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: undefined,
    base: '',
    authorization: Vue.ls.get('authorization'),
    breadCrumbList: [],
    homeRoute: getHomeRoute(routers),
  },
  getters: {
    isLogin: state => {
      return state.user != undefined
    },
    ajaxHead: state => {
      return {
        authorization: state.authorization
      }
    },
    user: state => {
      return state.user
    },
    base: state => {
      return state.base
    }
  },
  mutations: {
    [types.LOGIN]: (state, payload) => {
      Vue.ls.set('authorization', payload.authorization);
      state.authorization = payload.authorization;
    },
    [types.LOGOUT]: (state) => {
      Vue.ls.remove('authorization');
      state.authorization = '';
      state.user = undefined;
      state.base = '';
    },
    [types.SET_USER_INFO]: (state, payload) => {
      state.user = payload.loginInfo;
      state.base = payload;
    },
    [types.UPDATE_USER_INFO]: (state, payload) => {
      state.user = payload;
    },
    [types.UPDATE_PRO_INFO]: (state, payload) => {
      state.user.proInfo = payload;
    },
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
  },
  actions: {
    loginOut(context) {
      context.commit(types.LOGOUT);
    }
  }
});