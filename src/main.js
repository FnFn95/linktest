// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
// import store from './vuex/'
import store from './store'
import App from './App'
import Bus from './utils/bus'
import axios from 'axios'
import lodash from 'lodash'
import moment from 'moment'
import accounting from 'accounting'
import vuelazyload from 'vue-lazyload';
Vue.use(vuelazyload, {
  loading: '/assets/img/loading.png'   // 图片没加载出来之前显示的图片
})

// 引入轮播图
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import Viewer from 'v-viewer';
Vue.use(Viewer);

import 'viewerjs/dist/viewer.css'
import './assets/css/bootstrap.min.css'   // 引入bootstrap 4.4.1 样式库
import 'animate.css'   // 引入animate.css动画库
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import locale from 'view-design/dist/locale/zh-CN'
import i18n from '@/locale'
import config from '@/config'
//加载自定义工具模块
import Consts from './utils/consts'
window.Consts = Consts;
import appConfig from './utils/config'
import util from './utils/util'
import ServiceRequest from './utils/service'
//import ServiceRequest from 'plugin-service'
// 黑名单, 白名单配置
import PagePermission from './utils/page-permission'
import regexp from './utils/regexp'
import tyValidator from "@tydic-group/plugin-regular-check"
import './utils/filters'
import './styles/index.less'
//router引用必须放在最后,否则会引发样式问题：  因为router-link标签会渲染为a标签，而系统默认有a标签的样式
import router from './router'

import VueCarouselCard from 'vue-carousel-card'
Vue.use(VueCarouselCard);
Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
//引入字体
import '@/common/font/font.css';
Vue.use(ViewUI, {
  locale,
  transfer: true,
  size: 'default'
});

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  next();
});

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});

Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.axios = axios;
window.tyValidator = Vue.prototype.tyValidator = tyValidator;
window.appConfig = Vue.prototype.appConfig = appConfig;
window.moment = Vue.prototype.moment = moment;
Vue.prototype.accounting = accounting;
window.Bus = Vue.prototype.$bus = Bus;
window.util = Vue.prototype.util = util;
window.PagePermission = PagePermission;
window._ = Vue.prototype._ = lodash;
window.axios = axios;
window.$alert = Vue.prototype.$alert;
window.$Modal = Vue.prototype.$Modal;
window.ServiceRequest = ServiceRequest;
window.regexp = regexp;
window.ServiceRequest = ServiceRequest;

// util.clearCookieWhenClose();

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app');

// 兼容ie10不认识location.origin
if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

/* 报错   先注掉
//引入自定义全局组件
import components from '@/components/';
Object.keys(components).forEach(key => {
  Vue.component(components[key].name,components[key]);
  if(components[key].name){
    Vue.component(components[key].name,components[key]);
  }
}); */
