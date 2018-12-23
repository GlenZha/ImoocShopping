// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScrill from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
//引用Vuex
import Vuex from 'vuex'
//金额格式化
import  {currency} from './util/currency'


import VueLayLoad from 'vue-lazyload'//图片懒加载
Vue.use(VueLayLoad,{
  loading:'/static/loading/loading-balls.svg'
});
Vue.use(infiniteScrill);
//将Vuex应用到vue全局中
Vue.use(Vuex);
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
});

const  store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0

  },
  mutations:{
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
});

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

Vue.config.productionTip = false;
//定义一个全局过滤器
Vue.filter('currency',currency);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  //将Vuex的实例store注册到Vue中

  store,
  router,
  components: { App },
  template: '<App/>'

});
