const env = process.env.NODE_ENV;
const isBuild = process.env.IS_BUILD;
import Consts from './consts'
//note 设置项目子目录路径
// const baseURL =  env == "local" || env == "test" || env == "localTest" || env == "uat" || env == "production" || env == "development" ? '/zdpyc/door/' : "/";
// const baseURL = '/zdpyc/door/';
const baseURL='/';
//note 接口访问地址前缀
//如果和域名加二级目录不一致则需要设置prefix,否则只需要设置baseURL
const prefix = '';
//note 获取环境地址
function getEnvURL() {
  if (isBuild === 'true') {
    // console.log('isBuild:' + isBuild, 'url:' + location.origin + baseURL);
    // return location.origin + baseURL;
    return Consts.envURL[env] + baseURL;
  } else {
    // console.log('isBuild:' + isBuild, 'url:' + Consts.envURL[env]);
    return Consts.envURL[env] + baseURL;
  }
};
const config = {
  //note 是否是编译模式
  isBuild: isBuild,
  //note 环境
  env: env,
  envURL:Consts.envURL,
  //note 设置项目子目录路径
  baseURL: baseURL,
  //note mock地址
  mock_uri: 'http://39.107.52.108:8001/app/mock/30/',
  loginTarget: isBuild ? '_self' : '_blank',
  //note 退出地址
  logoutUrl: `${getEnvURL()}logout`,
  logoutTarget: isBuild ? '_self' : '_blank',
  //note 接口基础路径
  apiBaseUrl: getEnvURL(),
  //note 接口前缀
  prefix: prefix,
  //note 是否使用市登录,应急才开启,
  useCityLogin(){
    console.log(`%c 运行环境 `,'background:blue;color:white',env)
    switch (env) {
      //添加需要开启应急登录的环境
      case "development":
      case "test":
      case "uat":
        return true;
      default:
        return false;
    }
  },
  //note 登录地址 默认mode=1,普通登录
  loginUrl(mode=1) {
    console.log('登录方式mode:',mode)
    //默认为false,不在回跳黑名单中
    let result = false;
    const currentTime = new Date().getTime();
    //case地址拼接前缀
    let casePrefixUrl = `${getEnvURL()}casRoute/skip?mode=`;
    //返回首页
    let backhome = '&currentTime='+ currentTime + '&callBackUrl=' + location.origin;
    //返回当前页面
    let backCurrentPage = '&currentTime='+ currentTime + '&callBackUrl=' + location.href
    const path = location.href;
    PagePermission.callBacBlackList.forEach(item => {
      if (path.match(item)) {
        //在回跳黑名单中,设置result为true
        result = true;
      }
    });
    //如果在回跳黑名单中跳转到首页
    if (result) {
      //mode为2 时，是支付宝登陆；不为2时，是普通登陆
      return casePrefixUrl + mode + backhome + baseURL;
    }
    //如果不在回跳黑名单中跳转到当前页
    return casePrefixUrl + mode + backCurrentPage;
  },
  //note 注册地址
  registerUrl() {
    switch (env) {
      case "test":
        return "http://sfrz.shaanxi.gov.cn/sysauth-v3/index/register?client_id=000000047&redirect_uri=" + location.origin + baseURL;
      case "uat":
        // return "http://61.185.238.209:10003/sysauth-v3/index/register?client_id=000000047&redirect_uri=" + location.origin + baseURL;
        return "http://sfrz.shaanxi.gov.cn/sysauth-v3/index/register?client_id=000000047&redirect_uri=" + location.origin + baseURL
      case "production":
        return "http://sfrz.shaanxi.gov.cn/sysauth-v3/index/register?client_id=000000047&redirect_uri=" + location.origin + baseURL
    }
  },
  //note 修改用户信息跳转
  editUserInfo() {
    const token = localStorage.getItem('token');
    let result = PagePermission.isCallBack();
    const testUrl = "http://61.185.238.225:11980/sysauth-v3/oauth2-modify?access_token=";
    const proUrl = "http://sfrz.shaanxi.gov.cn/sysauth-v3/oauth2-modify?access_token=";
    switch (env) {
      case "test":
        return result ? testUrl + token + '&redirect_uri=' + location.origin + baseURL
          : testUrl + token + '&redirect_uri=' + location.href + "&menuType=resetInfo";
      case "production":
        return result ? proUrl + token + '&redirect_uri=' + location.origin + baseURL
          : proUrl + token + '&redirect_uri=' + location.href + "&menuType=resetInfo";
    }
  },

  //note 获取环境地址
  getEnvURL: getEnvURL,
  getSysUrl: function(sysId){
    switch(sysId){
      case 'custorm-service':
        return this.customURL
      default:
        return ''
    }
  },
  declareURL(service, type, mock = false) {
    if(env==='production'){
      mock=false;
    }
    if (service.match(/^((http|https|file)?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/)) {
      return service;
    }
    if (mock) {
      return `${this.mock_uri}${type || service}`;
    }
    switch (type) {
      case 'menu':
        return this.apiBaseUrl + 'pages/user/menus';
      case 'upload':
        return this.apiBaseUrl + 'file/upload'
      case 'down':
        return this.apiBaseUrl + 'rest/download' + service
      default:
        return this.apiBaseUrl + this.prefix + service
    }
  },
};
export default config
