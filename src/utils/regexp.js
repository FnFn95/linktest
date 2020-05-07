/**
 *@author       谢辉
 *@date         2019/2/23 20:08
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description
 */
export default {
  areaCode: {
    province: /[1-9]0{10}$/, //省
    city: /[1-9]0{8,9}$/, //市
    county: /[1-9]0{6,7}$/, //县
    street: /[1-9]0{0,5}$/ //街道
  },
  location:{
    href:/^((http|https|file)?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
  }
}
