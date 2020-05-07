/**
 *@desc     组件加载
 *@author   全易
 *@date     2020.03.17 12:22
 */

// 引入组件文件
import zrHeader from './header';  // 全局顶部导航栏
import zrFooter from './footer';  // 全局底部版权条
import zrPagination from './pagination';  // 分页器

//注册组件
export default {
  zrHeader,
  zrFooter,
  zrPagination
};

// 在页面调用组件时的标签就用组件文件里name字段的名












/*
import Layout from "iview/src/components/layout/layout";

const components = {
  Layout,
};

const tydic = {
  ...components
};

const install = function(Vue, opts = {}) {
  if (install.installed) return;

  Object.keys(tydic).forEach(key => {
    Vue.component(key, tydic[key]);
    if (tydic[key].name) {
      Vue.component(tydic[key].name, tydic[key]);
    }
  });
};

const API = {
  install,
  ...components
};

export default API;
 */