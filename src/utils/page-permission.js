/**
 *@author       刘文军
 *@date         2019/8/5 17:37
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description
 */
const pagePermission = {
  //note 路由白名单 此名单路由优先不拦截
  whiteList:{
    default: [
      /home-procceeds-list/,
    ],
    //为需要的环境添加个性化配置
    local: [
      /home-procceeds-list/,
    ],
    localTest: [
      /home-procceeds-list/,
    ]
  },
  //note 第三方登录未认证白名单 此名单内路由不会跳转至第三方登录认证页面
  authoWhiteList:[
    /home-new-index/
  ],
  //note 路由黑名单 此名单路由拦截
  blackList:[
    // /test2/,
  ],
  //note 回调地址黑名单 此名单地址回调为首页
  callBacBlackList:[
    /home-fast-regisiter/,
  ],
//note 白名单
  inList(path, whiteOrBlack) {
    let result = false;
    whiteOrBlack.forEach(item => {
      if (path.match(item)) {
        result = true;
      }
    });
    return result;
  },
  inWhite(path) {
    return this.inList(path, this.whiteList[appConfig.env] || this.whiteList['default']);
  },
  inBlack(path) {
    return this.inList(path, this.blackList);
  },
  inAuthorWhite(path) {
    return this.inList(path, this.authoWhiteList)
  },
  // note 回到地址是否在黑名单,返回true在黑名单
  isCallBack() {
    let result = false;
    const path = location.href;
    this.callBacBlackList.forEach(item => {
      if (path.match(item)) {
        result = true;
      }
    });
    return result
  },
};
export default pagePermission;
