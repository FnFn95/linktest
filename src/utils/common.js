/**
 *@author       周君
 *@date         2019/8/15 08:03
 *@Copyright
 *@Description  通用方法
 */

import _ from "lodash";
import config from '@/config'
const { cookieExpires } = config

const common = {};

//note 克隆对象
common.clone = function(obj) {
  return _.assign({}, obj);
};
common.clone2 = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};
common.clone3 = function(obj, addobj) {
  return _.assign({}, obj, addobj);
};
//note 提示
common.displayMessageTip = function(msg, type = "success", that) {
  that.$Message.destroy();
  if (type === "error") {
    that.$Message.error({
      content: msg,
      duration: 3,
      closable: true
    });
  } else if (type === "warning") {
    that.$Message.warning({
      content: msg,
      duration: 3,
      closable: true
    });
  } else if (type === "info") {
    that.$Message.info({
      content: msg,
      duration: 3,
      closable: true
    });
  } else {
    that.$Message.success({
      content: msg,
      duration: 2,
      closable: true
    });
  }
};

//note 是否是空对象
common.isEmptyObject = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};

//note 是否是空数组
common.isEmptyArray = function(array) {
  if (Array.prototype.isPrototypeOf(array) && array.length === 0) {
    return true;
  } else {
    return false;
  }
};

//note 删除字符串的头尾空格
common.myTrim = function(x) {
  if (typeof x != "string") {
    return x;
  }
  if (x == "" || x == null || typeof x === "undefined") {
    return x;
  }
  return x.replace(/^\s+|\s+$/gm, "");
};

//note 判断是否是空值（不含全空格）
common.isEmptyCommon = function(param) {
  if (param) {
    var param_type = typeof param;
    if (param_type == "object") {
      //要判断的是【对象】或【数组】或【null】等
      if (typeof param.length == "undefined") {
        if (JSON.stringify(param) == "{}") {
          return true; //空值，空对象
        }
      } else if (param.length == 0) {
        return true; //空值，空数组
      }
    } else if (param_type == "string") {
      //如果要过滤空格等字符
      // var new_param = param.trim();
      // if (new_param.length == 0) {
      //   //空值，例如:带有空格的字符串" "。
      //   return true;
      // }
      if (param.length == 0) {
        return true;
      }
    } else if (param_type == "boolean") {
      if (!param) {
        return true;
      }
    } else if (param_type == "number") {
      if (!param) {
        return true;
      }
    }
    return false; //非空值
  } else {
    //空值,例如：
    //(1)null
    //(2)可能使用了js的内置的名称，例如：var name=[],这个打印类型是字符串类型。
    //(3)空字符串''、""。
    //(4)数字0、00等，如果可以只输入0，则需要另外判断。
    return true;
  }
};

/**
 * 设置cookie
 * @param {[type]} key   [键名]
 * @param {[type]} value [键值]
 * @param {[type]} days  [保存的时间（天）]
 */
common.setCookie = function(key, value, days) {
  // 设置过期原则
  if (!value) {
    sessionStorage.removeItem(key);
  } else {
    var Days = days || cookieExpires; // 默认保留7天
    var exp = new Date();
    sessionStorage[key] = JSON.stringify({
      value,
      // expires: exp.getTime() +  1 * 60 * 60 * 1000
      expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
    });
  }
};
common.getCookie = function(name) {
  try {
    if (sessionStorage[name]) {
      let o = JSON.parse(sessionStorage[name]);
      // console.log(o);
      // console.log(o.expires < Date.now());
      if (!o || o.expires < Date.now()) {
        // console.log(111);
        // localStorage.removeItem('auth-token')
        sessionStorage.removeItem("authorization");
        sessionStorage.removeItem("uid");
        return null;
      } else {
        return o.value;
      }
    } else {
      return null;
    }
  } catch (e) {
    // 兼容其他localstorage
    console.log(e);
    return sessionStorage[name];
  } finally {
  }
};

common.getLoginUserInfo = function() {
  return JSON.parse(window.sessionStorage.getItem("invelinkUserInfo"));
};

common.setLoginUserInfo = function(data) {
  window.sessionStorage.setItem("invelinkUserInfo", JSON.stringify(data));
  return true;
};

common.cleartLoginUserInfo = function() {
  window.sessionStorage.removeItem("invelinkUserInfo");
  return true;
};

common.getLoginUserName = function() {
  const username = window.sessionStorage.getItem("invelinkUserName");
  return username ? username : "";
};

common.setLoginUserName = function(name) {
  window.sessionStorage.setItem("invelinkUserName", name);
  return true;
};

common.cleartLoginUserName = function() {
  window.sessionStorage.removeItem("invelinkUserName");
  return true;
};

common.getLoginUserId = function() {
  const userid = window.sessionStorage.getItem("invelinkUserId");
  return userid ? userid : "";
};

common.setLoginUserId = function(id) {
  window.sessionStorage.setItem("invelinkUserId", id);
  return true;
};

common.cleartLoginUserId = function() {
  window.sessionStorage.removeItem("invelinkUserId");
  return true;
};

common.getLoginUserRest = function() {
  const userRest = window.sessionStorage.getItem("invelinkUserRest");
  return userRest ? userRest : "0";
};

common.setLoginUserRest = function(value) {
  window.sessionStorage.setItem("invelinkUserRest", value);
  return true;
};

common.cleartLoginUserRest = function() {
  window.sessionStorage.removeItem("invelinkUserRest");
  return true;
};

common.isLoginByCheck = function() {
  let res = false;
  const dataUser = JSON.parse(window.sessionStorage.getItem("invelinkUserInfo"));
  if (dataUser) {
    const { username, id } = dataUser;

    if (username && id) {
      res = true;
    }
  }
  return res;
};

common.errorDescBranch = function(errorCode, errorMsg, defaultDesc) {
  let errorText = "";
  if (errorCode) {
    // if (errorCode == Consts.CODEDESC.RESP_ERRORCODE_1017) {
    //   errorText = Consts.CODEDESC.RESP_ERRORCODE_1017_DESC;
    // } else if (errorCode == Consts.CODEDESC.RESP_ERRORCODE_1018) {
    //   errorText = Consts.CODEDESC.RESP_ERRORCODE_1018_DESC;
    // } else {
    //   errorText = defaultDesc || "";
    // }
    errorText = errorMsg || defaultDesc || ""
  }

  return errorText;
};

common.cutOutNum = function(num, decimals) {
  if (isNaN(_.toNumber(num)) || (!num && num !== 0)) {
    return '--'
  }

  // 默认为保留的小数点后两位
  let dec = decimals ? decimals : 2
  let tempNum = Number(num)
  let pointIndex = String(tempNum).indexOf('.') + 1 // 获取小数点的位置 + 1
  let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0 // 获取小数点后的个数(需要保证有小数位)
  // 源数据为整数或者小数点后面小于decimals位的作补零处理
  if (pointIndex === 0 || pointCount <= dec) {
    let tempNumA = tempNum
    if (pointIndex === 0) {
      tempNumA = `${tempNumA}.`
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    } else {
      for (let index = 0; index < dec - pointCount; index++) {
        tempNumA = `${tempNumA}0`
      }
    }
    return tempNumA
  }

  let realVal = ''
  // 截取当前数据到小数点后decimals位
  realVal = `${String(tempNum).split('.')[0]}.${String(tempNum)
    .split('.')[1]
    .substring(0, dec)}`
  // 判断截取之后数据的数值是否为0
  if (realVal == 0) {
    realVal = 0
  }
  return realVal
};

export default common;
