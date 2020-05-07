import _ from 'lodash'
import config from './config'
import validator from '@tydic-group/plugin-regular-check'
// import service from './service'
import {
  Spin
} from 'view-design';
import cookies from 'browser-cookies'
import service2 from './http2.js'

const util = {
  //view DatePicker 日期转换
  dateTurnTime(dataTime) {
    let time = new Date(dataTime);
    if (time instanceof Date && !isNaN(time.getTime())) {
      return moment(time).format('YYYY-MM-DD');
    }
    return dataTime;
  },
  //view DatePicker 日期转换
  dateTurnTimeQ(dataTime,gs) {
    let time = new Date(dataTime);
    if (time instanceof Date && !isNaN(time.getTime())) {
      return moment(time).format(gs);
    }
    return dataTime;
  },
  //note 判断是否是ie浏览器
  isIELLQ() { //ie?
    let navigatorName = "Microsoft Internet Explorer";
    console.log(navigatorName);
    if (navigator.appName == navigatorName) {
      return true;
    } else {
      return false;
    }
  },
  //note  获取文件类型
  getFileType: function(name) {
    let fileType = true; //默认true是图片，false是文件
    let nameSplitLength = name.split('.').length - 1; //分割文件名，取最后一个
    if (name.split('.')[nameSplitLength].toLowerCase() == 'png' || name.split('.')[nameSplitLength].toLowerCase() ==
      'jpg' || name.split('.')[nameSplitLength].toLowerCase() == 'jpeg') {

    } else {
      fileType = false;
    }
    return fileType;
  },
  //note  获取文件名称
  getFileName(str) {

    str = str.substring(str.lastIndexOf("/") + 1);
    return str;
  },

  //检测字数
  DataLength(fData) {
    let intLength = 0
    for (let i = 0; i < fData.length; i++) {
      if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)) {
        //汉字
        intLength = intLength + 1
      } else {
        intLength = intLength + 1
      }
    }
    return intLength
  },

  //note  下载文件
  downloadIamge(imgsrc, name) { //下载图片地址和图片名

    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      var a = document.createElement("a"); // 生成一个a元素
      var event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.target = '_blank';
      a.href = imgsrc; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
  },

  //note  下载判断到底是图片还是文件
  download(imgurl) {

    let name = this.getFileName(imgurl);
    if (this.getFileType(name)) {
      //img
      this.downloadIamge(imgurl, name);
    } else {
      //file
      window.open(imgurl);
    }
  },
  clearCookies() {
    const allCookies = cookies.all();
    for (let cookieName in allCookies) {
      if (allCookies.hasOwnProperty(cookieName)) {
        cookies.erase(cookieName);
      }
    }
  },
  //note 关闭浏览器时清除cookie
  clearCookieWhenClose() {
    window.cookies = cookies;
    window.allcookies = function() {
      return document.cookie;
    };
    window.clearCookie = util.clearCookies;
    //执行onbeforeunload的开始时间
    let beginTime = 0;
    //时间差
    let differTime = 0;
    window.onunload = function(event) {
      differTime = new Date().getTime() - beginTime;
      if (differTime <= 5) {
        console.log("浏览器关闭");
        clearCookies();
      } else {
        console.log("浏览器刷新");
      }

    }
    window.onbeforeunload = function() {
      beginTime = new Date().getTime();
    };
  }
};


util.login = (mode) => {
  if (isNaN(mode)) {
    //如果使用市登录设置mode为3
    if (config.useCityLogin()) {
      mode = 1
    } else {
      mode = 3
    }
  }
  //window.open(appConfig.loginUrl(mode), appConfig.loginTarget);
};
util.register = () => {
  window.open(appConfig.registerUrl());
};
util.logout = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "test":
      break;
    case "production":
      break;
    default:
      break;
  }
}
util.getlogoutFileostfix = function() {
  let subDir = '';
  if (config.baseURL !== '/') {
    subDir = '-sub-dir'
  }
  return subDir;
};
//note 深度JSON
// util.jsonDeepToStr=function(obj){
//   _.forIn(obj,value=>{
//     if(typeof(value)==='array'){
//
//     }
//   })
// };
//note 数据适配方法
util.dataAdapter = function(data, arr1, arr2, flag) {
  let dll = {};
  _.each(arr1, (v1, i) => {
    _.each(arr2, (v2, k) => {
      if (i === k) {
        dll[v1] = v2;
      }
    });
  });
  const str = JSON.stringify(data);
  const reg = eval('/(' + arr1.join('|') + ')/g');
  const result = str.replace(reg, ($0, $1) => {
    return dll[$1];
  });
  let last = '';
  if (flag === false) {
    last = _.assign(data, JSON.parse(result));
  } else {
    last = JSON.parse(result);
  }
  return last;
};
//note 解析表单数据为get请求参数字符串
util.parseToGet = function(data) {
  let result = '';
  _.keys(data).forEach(value => {
    result += `${value}=${data[value]}&`
  })
  return result;
};
//数字加逗号
util.formatNum=function(str){
var newStr = "";
var count = 0;

if(str.indexOf(".")==-1){
   for(var i=str.length-1;i>=0;i--){
 if(count % 3 == 0 && count != 0){
   newStr = str.charAt(i) + "," + newStr;
 }else{
   newStr = str.charAt(i) + newStr;
 }
 count++;
   }
   str = newStr + ""; //自动补小数点后两位
}
else
{
   for(var i = str.indexOf(".")-1;i>=0;i--){
 if(count % 3 == 0 && count != 0){
   newStr = str.charAt(i) + "," + newStr;
 }else{
   newStr = str.charAt(i) + newStr; //逐个字符相接起来
 }
 count++;
   }
   str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
   console.log(str)
 }
 return str;
}
/**
 * 获取本地字典表
 * @param name 字典名
 * @param name 字典值
 */
util.getLocalDic = function(name, code) {
  return this.localDic[name][code];
};
util.getLocalDicOfList = function(name) {
  var list = [];
  $.each(this.localDic[name], function(label, value) {
    list.push({
      value,
      label
    })
  })
  return list;
};
util.showPart = function(store, display) {
  const dp = display || {};
  util.showShortCut(store, dp.shortCut)
  util.showNav(store, dp.nav)
  util.showLeftMenu(store, dp.left)
  util.showCrumb(store, dp.crumb)
  util.showFooter(store, dp.footer)
};
//note 显示/隐藏shortCut
util.showShortCut = function(store, state = true) {
  store.dispatch('updateShortCutDisplay', state)
};
//note 显示/隐藏主导航
util.showNav = function(store, state = true) {
  store.dispatch('updateNavDisplay', state)
};
//note 显示/隐藏左侧菜单
util.showLeftMenu = function(store, state = true) {
  store.dispatch('updateLeftMenuDisplay', state)
};
//note 显示/隐藏面包屑
util.showCrumb = function(store, state = true) {
  store.dispatch('updateCrumbDisplay', state)
};
//note 显示/隐藏底部
util.showFooter = function(store, state = true) {
  store.dispatch('updateFooterDisplay', state)
};
//note 获取计算公式替换后的字符串
util.getMathFormatStr = function(model, str) {
  if (!!str && !!model) {
    const temp = str.split('|');
    let expression = temp[0];
    const params = temp[1].split(',');
    params.forEach(item => {
      expression = expression.replace('%s', model[item] || 0);
    });
    return expression;
  }
  return '';
};
//note 计算公式
util.mathFormatStr = function(model, str) {
  if (!!str && !!model) {
    const temp = str.split('|');
    let expression = temp[0];
    const params = temp[1].split(',');
    params.forEach(item => {
      expression = expression.replace('%s', model[item] || 0);
    });
    try {
      return eval(expression);
    } catch (e) {
      console.log(e)
    }
    return;
  }
  return 0;
};
//note 统一提示框
util.alert = function(opts) {
  const defaultOpts = {
    scrollable: true,
    type: "info",
  };
  const option = { ...defaultOpts,
    ...opts
  };
  $Modal[option.type]({ ...option,
    ...{
      title: util.lang.alertTitle[option.type]
    }
  });
};
//note 克隆对象
util.clone = function(obj) {
  return _.assign({}, obj);
};
util.clone2 = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

//note 只获取一级目录
util.getMenuItemFromNameOne = function(menu, name) {
  if (menu && menu.length !== 0) {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].menuCode === name) {
        return menu[i]
      }
    }
    return null;
  }
  return null;
};


//note 根据菜单名获取菜单对象
util.getMenuItemFromName = function(menu, name) {
  if (menu && menu.length !== 0) {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].menuCode === name) {
        return menu[i]
      }
      if (menu[i].subMenus && menu[i].subMenus.length > 0) {
        let result = util.getMenuItemFromName(menu[i].subMenus, name);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
  return null;
};
//note 本地字典表添加
util.localDic = {
  //FIXME 示例字典项
  exampleItem: [{
    'key': 'value'
  }, ]
};
//note 显示文本配置
util.lang = {
  exampleMsg: "显示文本配置",
  alertTitle: {
    info: '提示',
    success: '提示',
    warning: '警告',
    error: '错误'
  }
};
util.getCaptcha = function() {
  return config.declareURL('captcha/verification');
};
util.regexp = validator;
// util.service = service;
let loadingIndex = 0;
//note 加载中
util.showLoading = (message) => {
  loadingIndex++;
  Spin.show({
    render: (h) => {
      return h('div', {}, [
        h('Icon', {
          'class': 'spin-icon-load',
          props: {
            type: 'ios-loading',
            size: 30
          }
        }),
        // h('div', message || '加载中')
        h('div', message || '')
      ])
    }
  });
}
util.closeLoading = () => {
  loadingIndex--;
  if (loadingIndex <= 0) {
    loadingIndex = 0;
    Spin.hide()
  }
}
//note 禁止复制
util.forbiddenCopy = (event) => {
  if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() == 'c' || event.key.toLowerCase() == 'v')) {
    event.preventDefault();
  }
};
// note 判断当前浏览器的名称和版本号
util.checkBrowser = function() {
  const ua = navigator.userAgent.toLocaleLowerCase();
  const browser = {
    name: null,
    version: null
  };
  if (ua.match(/chrome/) != null) {
    //判断是否是360极速模式
    var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");

    function _mime(option, value) {
      var mimeTypes = navigator.mimeTypes;
      for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
          return true;
        }
      }
      return false;
    }

    if (is360) {
      browser.is360 = true;
      browser.name = '360';
    } else {
      browser.isChrome = true;
      browser.name = "Chrome";
    }

  } else if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browser.isIE = true;
    browser.name = "IE";
    browser.version = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1];
  } else if (ua.match(/edge/) != null) {
    browser.isEdge = true;
    browser.name = "Edge";
  } else if (ua.match(/firefox/) != null) {
    browser.isFirefox = true;
    browser.name = "FireFox"; //火狐
  } else if (ua.match(/safari/) != null) {
    browser.isSafari = true;
    browser.name = "Safari"; //苹果
  } else if (ua.match(/ubrowser/) != null) {
    browser.isUC = true;
    browser.name = "UC"; //UC
  } else if (ua.match(/opera|opr/) != null) {
    browser.isOpera = true;
    browser.name = "Opera"; //欧朋
  } else if (ua.match(/bidubrowser/) != null) {
    browser.isBaidu = true;
    browser.name = "Baidu"; //百度
  } else if (ua.match(/metasr/) != null) {
    browser.isSogou = true;
    browser.name = "Sogou"; //搜狗
  } else if (ua.match(/qqbrowse|tencenttraveler/)) {
    browser.isQQ = true;
    browser.name = "QQ";
  } else if (ua.match(/maxthon/) != null) {
    browser.isMaxthon = true;
    browser.name = "Maxthon"; //遨游
  };
  return browser;
};
//是否是推荐浏览器
util.isSupportExplore = function() {
  const browser = this.checkBrowser();
  //edeg 谷歌 ie10以上
  return (browser.isEdge || browser.isChrome || browser.is360 || (browser.isIE && browser.version >= 10));
}

//note 金额转换为汉字
util.DX = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  let unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分",
    str = "";
  n += "00";
  let p = n.indexOf('.');
  if (p >= 0)
    n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(
    /(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/^元零?|零分/g, "").replace(
    /(元|角)$/g, "$1整");
};
//note 监听所有a标签打开新页面
document.addEventListener("click", tagHandler);

function tagHandler(event) {
  switch (event.target.tagName) {
    case "A":
      let href = event.target.getAttribute("href")
      if (!event.target.onclick && href && !href.startsWith('#')) {
        window.open(event.target.href)
      }
      break;
  }
}

//note 禁用/启用浏览器返回
let forbiddenBackURL = '';
util.setFobiddenBackURL = function(path) {
  if (config.isBuild) {
    forbiddenBackURL = location.origin + config.baseURL + '#' + path;
  } else {
    forbiddenBackURL = location.origin + '#' + path;
  }
};

function backCommon() {
  // 因ie9不支持pushstate方法所以注释掉
  // history.pushState(null, null, forbiddenBackURL);
};
//禁用浏览器返回
util.fobiddenBackBtn = function() {
  if (config.env === 'local' || config.env === 'localTest') {
    return;
  }
  //防止页面后退
  forbiddenBackURL = document.URL;
  addEventListener('popstate', backCommon)
};
//note 启用浏览器返回
util.enableBackBtn = function() {
  removeEventListener('popstate', backCommon)
};
//note 禁用浏览器状态下跳转href
util.navigate = function(opts) {
  let option = { ...{
      location: location,
      href: ''
    },
    ...opts
  };
  util.enableBackBtn();
  option.location.href = option.href;
  location.reload();
};
util.navigateRoute = function(context, opts) {
  context.$router.replace(opts);
  util.enableBackBtn();
  location.reload();
};
// note 获取分辨率等信息
util.getResolutionRatio = function() {
  return {
    clientHeight: document.documentElement.clientHeight,
    clientWidth: document.documentElement.clientWidth,
  }
}
//note 根据key值获取RUL参数值
/**
 * 根据key值获取RUL参数值
 * @param key    要获取的字段名
 * @param search 可选参数,不传则从链接地址获取
 * @return {*}
 */
util.getUrlParamByName = function(key, search) {
  const locSearch = location.href.match(/\?\S+/);
  const params = decodeURI(search || (locSearch ? locSearch[0] : ''));
  // 截取？号后面的部分    index.html?act=doctor,截取后的字符串就是?act=doctor
  const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  const r = params.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
//note 获取RUL参数集合
/**
 * 获取RUL参数集合
 * @param search     可选参数,不传则从链接地址获取
 * @return {Object}
 */
util.getUrlParams = function(search) {
  const locSearch = search.match(/\?\S+/) || location.href.match(/\?\S+/);
  const url = (locSearch ? locSearch[0] : ''); //获取url中"?"符后的字串
  let params = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      params[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  return params;
};
//note 获取地址?号以前的字符串
util.getHostPath = function(href) {
  if (href) {
    if (href.split('?').length > 1) {
      return href.split('?')[0]
    }
    return href;
  }
  return location.href.split('?') ? location.href.split('?')[0] : '';
};
//note 统计表数据集合
/**
 * 统计表数据集合
 * @param {keys,data,init,iteratee,fixDotMode,fixNumber}
 *        keys Array(String)        要统计的字段key集合
 *        data Collection           表格数据
 *        fixDotMode String         保留小数位数的方式 auto:默认,自动判断,有效则启用,always:一直启用,none:不启用
 *        fixNumber Number          保留小数的位数
 *        fixType                   舍入方式 round:默认四舍五入  ceil: 向上舍入  floor: 向下舍入
 *        init Function             初始化统计数据对象回调函数
 *        iteratee Function         累计计算回调函数
 *        result Function           结果处理回调函数
 * @return Collection               包含统计结果数据填的新的表格数据集合
 */
util.countTable = function(option) {
  //默认参数数据
  const defaultOpts = {
    keys: [],
    //默认表格数据
    data: [],
    //保留小数位数的方式 auto:默认,自动判断,有效则启用,always:一直启用,none:不启用
    fixDotMode: 'auto',
    //保留小数的位数
    fixNumber: 2,
    //舍入方式 round:默认四舍五入  ceil: 向上舍入  floor: 向下舍入
    fixType: 'round',
    //合计字段key
    totalKey: '',
    //合计字段title
    totalTitle: '合计',
    //是否将统计数据融合进源数据
    mix: 'true',
    //默认累计key集合
    //默认初始化回调函数 赋值0
    init: function(total, key) {
      //total  累计的数据
      //key    当前字段
      total[key] = 0;
    },
    //默认累计计算回调函数,累加
    iteratee: function(total, item, key) {
      //total  累计的数据
      //item   遍历的当前表格数据元素
      //key    当前字段
      total[key] += Number(item[key]);
    },
    result: null
  };
  //入参和默认参数融合
  const opts = { ...defaultOpts,
    ...option
  };
  //判断必要字段是否是有效数组
  if (_.isArray(opts.keys) && _.isArray(opts.data)) {
    //定义统计初始数据
    let total = {};
    //遍历key集合初始化
    opts.keys.forEach((key) => {
      //初始化统计数据对象回调函数
      opts.init(total, key, opts)
    });
    //遍历表格数据
    opts.data.forEach((item) => {
      //遍历keys,相对应的字段累加
      opts.keys.forEach((key) => {
        //计算各字段值,例如累加
        opts.iteratee(total, item, key, opts);
      });
    });
    //四舍五入函数
    const fixlCall = _[opts.fixType];
    for (let key in total) {
      //进行保留小数的计算
      switch (opts.fixDotMode) {
        case 'auto': //自动判断,是小数则保留,整数则不处理
          if (total[key].toString().indexOf('.') !== -1) {
            total[key] = fixlCall(total[key], opts.fixNumber);
          }
          break;
        case 'always': //一直做小数保留位数处理
          total[key] = fixlCall(total[key], opts.fixNumber);
          break;
        case 'none':
        default:
          break;
      }
    };
    //处理统计结果数据
    opts.result && opts.result(total, opts);
    if (opts.totalKey && opts.totalTitle) {
      total[opts.totalKey] = opts.totalTitle;
    }
    //将最终统计结果数据填入数据字段
    if (opts.mix) {
      return opts.data.push(total);
    }
    return total;
  } else {
    console.log("util.countTable:参数错误!");
    return null;
  }
};

// 判断一个外链能否访问通
util.isAllowAccess = async function(url) {
  let result;
  await service2.get(url).then((response) => {
    result = response.status == 200
  }).catch(() => {
    result = false
  });
  return result
};
util.getAreaCode = function(vm) {
  const params = util.getUrlParams(location.href);
  return params.areaCode || vm.$store.state.common.areaInfo.code;
};
//去除字符串前后空格
util.trim = function(arg) {
  let temp = arg.replace(/(^\s*)|(\s*)$/g, "");
  return temp;
}
util.getNow = function() {
  var date = new Date();
  var year = date.getFullYear();
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minu = date.getMinutes();
  var sec = date.getSeconds();

  return year + '-' + mon + '-' + day + ' ' + hours + ':' + minu + ':' + sec;
}
//解析入参对象
util.parseReq = function(obj) {
  let tempObj = JSON.parse(obj);
  console.log(tempObj);
  //结果集
  let result = [];
  //解析对象
  let properties = tempObj.properties;
  let required = tempObj.required;
  //遍历对象
  util.getOne(properties, required, result);
  return result;
}
//获取一个数据
util.getOne = function(properties, required, result) {
  let req = '';
    console.log(required);
  for (let key in properties) {
    if (required != false) {
      req = util.isRequired(key, required);
    } else {
      req = '否';
    }
    let item = {
      title: key,
      req: req,
      type: properties[key].type,
      description: properties[key].description,
    }
    result.push(item);
    let type = properties[key].type;
    if (type == 'object') {
      let prop = properties[key].properties;
      let req = properties[key].required;
      util.getOne(prop, req, result);
    } else if (type == 'array') {
      let prop = properties[key].items.properties;
      if(properties[key].items.type=='object'){
        let req = properties[key].items.required;
        util.getOne(prop, req, result);
      }else{
        util.getOne(prop, false, result);
      }
    }
  }
  return result;
}
//是否必填项
util.isRequired = function(data, required) {
  if (required.indexOf(data) == -1) {
    return '否';
  }
  return '是';
}
export default util;
