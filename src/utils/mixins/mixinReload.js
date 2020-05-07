/**
 *@author       谢辉
 *@date         2019/3/4 16:43
 *@Copyright    天源迪科信息技术股份有限公司
 *@Description
 */
export const ReloadMixin={
  inject:['reload'],
  watch:{
    $route(){
      this.reload();
    }
  },
}
