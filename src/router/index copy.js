import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import config from '../utils/config'
import util from '../utils/util'
import Service from '../service/common-service'

Vue.use(Router)

function importRoutes(r) {
  let routes = r.keys().map(key => r(key).default);
  return _.flatten(routes);
};
const router = new Router({
  mode: 'hash',
  base: config.baseURL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: require('@/pages/index').default,
      children: importRoutes(require.context('@/', true, /^\.\/pages\/((?!\/)[\s\S])+\/route\.js$/)),
      meta: { auth: true },
      redirect:{path:"/home"}
    },
    {
      path: '*',   // 错误路由[写在最后一个]
      redirect: '/index'   //重定向
    }
  ]
});

//note 更新用户信息
function updateUserInfo(to, from, next, callback) {
  const commonState = router.app.$options.store.state.common;
  if(!commonState.loadedInfo){

    //note 获取用户信息
    // Service.getUserInfo().then(data => {
    //   //如果开启则双开网页,其中一个退出后,另一个还是登录状态
    //   commonState.loadedInfo = true;
    //   router.app.$options.store.dispatch('updateUserInfo', data);
    //   if (data.userId == '999999999') {
    //     util.alert({content: '系统异常，请联系客服'})
    //   }
    //   callback && callback()
    // }).catch(error => {
    //   util.alert('获取用户信息失败,请刷新重试');
    // })
    callback && callback()
  }else{
    if (commonState.userInfo.userId == '999999999') {
      util.alert({content: '系统异常，请联系客服'})
    }
    callback && callback()
  }
}
//note 更新当前路由页面状态信息
function updateRouterState(router, meta) {
  // console.log("更新当前路由页面状态信息:");

  // console.log('meta2222',meta);
  router.app.$options.store.dispatch('updateActive', meta);
  document.title = meta.title || '';
  if (typeof(meta.display.shortCut) === 'undefined') {
    meta.display.shortCut = true;
  } else {
    Object.assign(meta.display, {shortCut: meta.display.shortCut})
  }
  util.showPart(router.app.$options.store, meta.display)
}
let tokenInited=false;
//note 获取token
function getToken(isLogin) {
  if (isLogin == 1 && !tokenInited) {
    Service.getToken().then(data => {
      tokenInited=true;
      localStorage.setItem('token', data.token);
      localStorage.setItem('code', data.code);
    })
  }
};

//note 是否绑定第三方账号
function checkBindUser(to, userInfo, next) {
  // console.log("校验否绑定第三方账号:", userInfo.result, userInfo.isLogin)
  /*if (userInfo.result == false && userInfo.isLogin == 1) {
    if (to.name !== 'home-fast-register' && !PagePermission.inAuthorWhite(to.name)) {
      next({
        name: 'home-fast-register',
        query: {
          userId: userInfo.userId,
          type: userInfo.extSystemType,//返回的绑定登录的类型
          name: userInfo.name
        }
      });
      return;
    }
  }*/
  next();
}
//note 导航守卫
router.beforeEach((to, from, next) => {
  updateUserInfo(to, from, next, () => {
    //note 判断页面是否需要登录
    // 如果是home直接跳home-index
    //公共状态
    const commonState = router.app.$options.store.state.common;
    if (to.name === 'home') {
      next({name: Consts.ROUTES.COM_HOME})
    } else if (PagePermission.inWhite(to.name) || !PagePermission.inBlack(to.name)) {
      //如果在白名单或不在黑名单则无需登录页不用获取用户信息
      //获取token
      getToken(commonState.userInfo.isLogin);
      //添加了第三方认证的判断需求
      checkBindUser(to, router.app.$options.store.state.common.userInfo, next)
    } else {
      //如果没有登录
      if (commonState.userInfo.isLogin == 0) {
        util.login();
      } else {
        //获取token
        getToken(commonState.userInfo.isLogin);
        checkBindUser(to, router.app.$options.store.state.common.userInfo, next)
      }
    }
    // next();
  })
});
router.afterEach((to, from) => {
  //通过meta设置判断是否禁用浏览器后退按钮
  if (to.meta.forbiddenBackBtn) {
    util.fobiddenBackBtn();
  } else {
    util.enableBackBtn();
  }
  window.scrollTo(0, 0);
});
export default router
