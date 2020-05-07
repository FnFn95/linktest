const Consts = {
  //NOTE 路由列表  地址链接
  ROUTES: {
    //NOTE 常用,公共路由
    COM_HOME: "Home", //首页
    COM_REGISIT: "", //注册
    COM_LOGIN: "login", //登录
    COM_LOGOUT: "logout", //退出
    COM_USER_GUIDE: "test2", //会员中心
    COM_HELP_CENTER: "XXX", //帮助中心
    //NOTE 模块路由
    MODULE_ZWDT: "", //政务动态
    MODULE_ZWGK: "", //政务公开
    MODULE_WSBS: "", //网上办事
    MODULE_ZWSJ: "", //政务数据
    MODULE_XNGC: "", //效能观察
    MODULE_ZXHD: "", //咨询互动
    MODULE_YHZX: "", //用户中心
    //事项模块路由
    PROCESS_GG_MH: "" //门户广告申请
  },
  //NOTE VUEX actions
  DISPATCHS: {
    UPDATE_USER_INFO: "updateUserInfo", //更新用户信息
    UPDATE_MENU_DATA: "updateMenuData", //更新菜单信息
    UPDATE_NAV_MENU_ACTIVE: "updateNavMenuActive" //更新导航菜单激活项
  },
  // note 一网
  envURL: {
    production: "http://vpn_shop.cn/api/v1",
    uat: "http://vpn_shop.cn/api/v1",
    test: "http://vpn_shop.cn/api/v1",
    //压测环境
    testPressure: "http://vpn_shop.cn/api/v1",
    development: "http://vpn_shop.cn/api/v1",
    local: "http://vpn_shop.cn/api/v1",
    localTest: "http://vpn_shop.cn/api/v1"
  },
  CODEDESC: {
    RESP_SUCCESS: "1000", // 请求成功
    RESP_USERNAME_DUPLICATE: "1024", // 用户名已经被注册了
    RESP_USEREMAIL_DUPLICATE: "1025", // 用户名邮箱已经被注册了
    RESP_ERRORCODE_1015: "1015", // 产品无效!
    RESP_ERRORCODE_1016: "1016", // 订单创建失败!
    RESP_ERRORCODE_1017: "1017", // 余额不足
    RESP_ERRORCODE_1017_DESC: "余额不足", // 余额不足
    RESP_ERRORCODE_1018: "1018", // 订单不存在！
    RESP_ERRORCODE_1018_DESC: "订单不存在", // 订单不存在
    RESP_ERRORCODE_1019: "1019", // 用户未同意购买协议！
    RESP_ERRORCODE_1003: "1003", // 验证码发送失败!
    RESP_ERRORCODE_1003_DESC: "验证码发送失败!", // 验证码发送失败!
    RESP_ERRORCODE_1005: "1005", // 邮箱未注册！
    RESP_ERRORCODE_1005_DESC: "邮箱未注册！", // 邮箱未注册！
    RESP_ERRORCODE_1006: "1006", // 无效的验证码！
    RESP_ERRORCODE_1006_DESC: "无效的验证码！", // 无效的验证码！
    RESP_ERRORCODE_1007: "1007", // 两次输入的密码不一致！
    RESP_ERRORCODE_1007_DESC: "两次输入的密码不一致！", // 两次输入的密码不一致！
    RESP_ERRORCODE_1008: "1008", // 请输入正确的邮箱！
    RESP_ERRORCODE_1008_DESC: "请输入正确的邮箱！", // 请输入正确的邮箱！
  },
  TIMESETTING: {
    LOGIN_DISPLAY_DELAY: 1000
  },
  languageDEFINE: {
    zhCN: 'zh-CN',
    zhTW: 'zh-TW',
    enUS: 'en-US',
  }
};
export default Consts;
