import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


// 引入页面文件
import Home from '@/pages/home/index'                         // 首页
import User from '@/pages/user/index'                         // 用户资料
import Address from '@/pages/user/address'                    // 用户资料
import Goods from '@/pages/goods/index'                       // 商品详情
import Help from '@/pages/other/help'                         // 帮助
import News from '@/pages/news/index'                         // 新闻
import Details from '@/pages/news/details'                    // 新闻详情
import Orders from '@/pages/orders/box-orders'                // 订单 - 盒子订单
import noConsignmentOrders from '@/pages/orders/no-consignment'  // 订单 - 盒子订单
import noPayMent from '@/pages/orders/no-payment'             // 订单 - 盒子订单
import isGet from '@/pages/orders/isget'                      // 订单 - 盒子订单
import noGet from '@/pages/orders/noGet'                      // 订单 - 盒子订单
import cancellationOrders from '@/pages/orders/cancellation-orders'  // 订单 - 盒子订单
import ordersDetail from '@/pages/orders/order-detail'        // 订单 - 订单详情
import timeOrders from '@/pages/orders/time-orders'           // 订单 - 时长订单
import privacyPolicy from '@/pages/reading/privacyPolicy'     // 阅读 - 隐私政策
import userProtocol from '@/pages/reading/userProtocol'       // 阅读 - 用户协议



// 配置跳转路由
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/user/address',
      name: 'address',
      component: Address
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/other/help',
      name: 'help',
      component: Help
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/news/details',
      name: 'details',
      component: Details
    },
    {
      path: '/orders/box-orders',
      name: 'boxOrders',
      component: Orders
    },
    {
      path: '/orders/no-consignment',
      name: 'no-consignment',
      component: noConsignmentOrders
    },
    {
      path: '/orders/cancellation-orders',
      name: 'cancellationOrders',
      component: cancellationOrders
    },
    {
      path: '/orders/no-payment',
      name: 'noPayMent',
      component: noPayMent
    },
    {
      path: '/orders/isget',
      name: 'isGet',
      component: isGet
    },
    {
      path: '/orders/noget',
      name: 'noGet',
      component: noGet
    },
    {
      path: '/orders/order-detail',
      name: 'ordersDetail',
      component: ordersDetail
    },
    {
      path: '/orders/time-orders',
      name: 'timeOrders',
      component: timeOrders
    },
    {
      path: '/reading/privacyPolicy',
      name: 'privacyPolicy',
      component: privacyPolicy
    },
    {
      path: '/reading/userProtocol',
      name: 'userProtocol',
      component: userProtocol
    },
  ],
  scrollBehavior(to, from,savedPosition) {
    return { x: 0, y: 0 }
  }
})
