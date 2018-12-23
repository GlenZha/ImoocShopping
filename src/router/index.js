import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import GoolsList from './../views/GoodsList'
import Cart from './../views/Cart'
import Address from './../views/Address'
import OrderConfirm from './../views/OrderConfirm'
import OrderSuccess from './../views/OrderSuccess'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      //path: '/goods/:goodsId/user/:userId',//动态路由
      path:'/',
      name: 'GoodsList',
      component: GoolsList,
    },{
      path:'/cart',
      name: 'Cart',
      component: Cart,
    },{
      path:'/address',
      name: 'Address',
      component: Address,
    },{
      path:'/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm,
    },{
      path:'/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess,
    }
  ]
})