import axios from "axios";
import { Spin, Message } from "iview";
import qs from "qs";
import util from "./util";
import config from "./config";
import CommonFunc from "@/utils/common";
import { setCookie, getCookie, removeCookie } from "@/libs/util";
import { localRead } from '@/libs/util'
import Consts from "./consts";
axios.defaults.timeout = 1000 * 15;
// axios.defaults.withCredentials=true;
//添加一个请求拦截器
axios.interceptors.request.use(
  function(config) {
    //在请求发出之前进行一些操作
    if (config.headers["Show-Loading"] === false) {
      delete config.headers["Show-Loading"];
    } else {
      util.showLoading();
    }
    // const token = CommonFunc.getCookie("authorization");
    const token = getCookie("authorization");
    const lang = localRead("local");
    if (lang === Consts.languageDEFINE.enUS) {
      config.headers["x-language"] = 'english';
    }
    // const uid = CommonFunc.getCookie("uid");
    // console.log("token:", token);
    if (token) {
      config.headers["authorization"] = token;
    }
    // if (uid) {
    // config.headers["uid"] = uid;
    // }
    // console.log('请求接口:' + config.url)
    if (config.method == "post") {
      if (config.headers["notQs"]) {
      } else {
        config.data = qs.stringify(config.data);
        config.headers["Content-Type"] =
          "application/x-www-form-urlencoded;charset=utf-8";
        config.headers["X-Requested-With"] = "XMLHttpRequest";
      }
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
//添加一个响应拦截器
axios.interceptors.response.use(
  function(res) {
    util.closeLoading();
    let result;
    // console.log('------------------------------------------')
    //谷歌浏览器内可以res.request.responseURL也可以获取接口地址,但是为了兼容ie所以使用res.config.url
    // console.log("请求成功:", res.config.url);
    // console.log('返回数据:',res.data);
    if (res.data.code) {
      // if (typeof res.data.data === "undefined") {
      //   result = res.data;
      // } else {
      //   result = res.data;
      // }
      if (
        res.data.code != "1000" &&
        res.data.code != "1017" &&
        res.data.code != "1018" &&
        res.data.code != "1005" &&
        res.data.code != "1006" &&
        res.data.code != "1007" &&
        res.data.code != "1008" &&
        res.data.code != "1024" &&
        res.data.code != "1001"
      ) {
        if (res.data.hasOwnProperty("msg")) {
          let message = res.data.msg || "接口报错";

          // Message.error(message)
          Message.error({
            content: message,
            duration: 3,
            closable: true
          });
        }
      }
      result = res.data;
      //下拉列表类型数据提取,如果data下只有一个对象且类型为数组,提取数组到data下返回
      // const values = Object.values(result);
      // if (values.length === 1 && (values[0] instanceof Array)) {
      //   result = values[0];
      // }
      return result;
    }
    if (res.data && res.data.hasOwnProperty("access_token")) {
      return res.data;
    }
    //code 不为0是按错误处理
    let code = 1000,
      message;
    if (res.config.mock) {
      message = res.data.errMsg;
    } else if (
      res.data instanceof Object &&
      Object.keys(_.pick(res.data, ["code", "message"])).length === 2
    ) {
      code = res.data.code;
      message = res.data.message;
    } else {
      message = "报文基本格式错误";
    }
    if (res.config.url.includes("custDatum/autoFindAttr")) {
      return;
    }
    errorHandler(message);
    return Promise.reject({ code, message });
  },
  function(error) {
    util.closeLoading();
    if (error.code) {
      // errorHandler(error.message);
      console.log("------------------------------------------");
      console.log("请求失败:", error);
      if (
        error.code == "ECONNABORTED" &&
        error.config.url.includes("ocr/ocrAbility")
      ) {
        return Promise.reject(error);
      }
      errorHandler();
      return Promise.reject(error);
    }
    if (error.response) {
      switch (error.response.status) {
        case 302:
          if (config.env == "local:test" || config.env == "local") {
            return;
          }
          sessionStorage.clear();
          removeCookie("invelinkUserInfo");
          removeCookie("uid");
          removeCookie("invelinkUserName");
          removeCookie("invelinkUserRest");
          util.alert({
            type: "error",
            content: "登录失效, 请重新登录"
          });
          // if (this.$route.name != Consts.ROUTES.COM_HOME) {
          //   this.$router.push({
          //     name: Consts.ROUTES.COM_HOME
          //   });
          // }
          // util.login();
          break;
        //未登录
        case 401:
          localStorage.removeItem("authorization");
          // console.log("未登录:",error);
          // util.alert({
          //   type: 'warning',
          //   content: '请先登录...'
          // });
          if (config.env == "local:test" || config.env == "local") {
            return;
          }
          sessionStorage.clear();
          removeCookie("invelinkUserInfo");
          removeCookie("uid");
          removeCookie("invelinkUserName");
          removeCookie("invelinkUserRest");
          util.login();
          break;
        //未授权
        case 403:
          errorHandler("服务未授权!");
          break;
        default:
          // errorHandler(error.message)
          break;
      }
    }
    return Promise.reject(error);
  }
);

function errorHandler(message, title = "错误") {
  console.log(`%c 接口错误 `, "background:red;color:white", message);
  if (message) {
    console.log(message || "网络繁忙,请稍后重试!");
    // util.alert({
    //   type: 'error',
    //   content: message || '网络繁忙,请稍后重试!'
    // });
  }
}

export default axios;
