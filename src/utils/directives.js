/**
 *@author       谢辉
 *@date         2019/1/29 11:36
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description
 */
import Vue from 'vue'

Vue.directive('anchor',{
  inserted : function(el,binding){
    el.onclick = function(){
      document.documentElement.scrollTop = document.getElementById(binding.value).offsetTop
    }
  }
})
