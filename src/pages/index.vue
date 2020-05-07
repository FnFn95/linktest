<template>
  <div>
    <router-view></router-view>
      <!--
    <zr-footer :infos="infos" v-if="update"></zr-footer>
    -->

      <!-- <div class="zr-tip">为获得最佳浏览体验，本平台推荐使用Chrome、火狐、IE9以上浏览器</div> -->
      <!--
    <div class="zr-foot-row">
      <div class="zr-tip-bg">
        <div class="zr-tip">为获得最佳浏览体验，本平台推荐使用Chrome、火狐、IE9以上浏览器</div>
      </div>
    </div>
    -->
  </div>
</template>
<script>/**
 *@desc
 *@author  谢辉
 *@date    2018.8.31
 */

import Consts from "../utils/consts";
import Service from "@/service/common-service";

export default {
    data(){
      return {
        infos:{},
        update:true
      }
    },
    created(){
      //this.getFooterInfo();
    },
    methods:{
      reload(){
        this.update = false;
        this.$nextTick(function(){
          this.update = true;
        })
      },
      //获取公共尾部信息
      getFooterInfo(){
        let params = {propertyKey:'pageBottom'};
        this.infos = {};
        Service.SelectPropertiesMes(params).then(data=>{
           for(let item of data){
             if(item.propertyKey=='主办单位'){
               this.infos.unit = item.propertyValue;
             }
             if(item.propertyKey=="技术支持单位"){
               this.infos.support = item.propertyValue;
             }
             if(item.propertyKey=="网站标识"){
               this.infos.www = item.propertyValue;
             }
             if(item.propertyKey=="备案序号"){
               this.infos.card = item.propertyValue;
             }
             if(item.propertyKey=="咨询电话"){
               this.infos.tel = item.propertyValue;
             }
             if(item.propertyKey=="联系邮箱"){
               this.infos.email = item.propertyValue;
             }
           }
           this.reload();
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      if(to.name==='index'){
        next({name:Consts.ROUTES.COM_HOME})
      }
      next()

    }
  }
</script>
<style lang="less" scoped="scoped">
  .zr-tip-bg{
    width:100%;
    height:33px;
    line-height:33px;
    background: rgba(228,228,228,0.8);
    // background: #061d33;
    position: fixed;
    bottom: 0px;
    text-align: center;
  }
  .zr-tip{
    width:1200px;
    background: #e4e4e4;
    color:#999999;
    height:33px;
    line-height:33px;
    // position: fixed;
    // bottom: 0px;
    text-align: center;
    margin: 0 auto;
  }
</style>
