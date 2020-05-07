<template>
  <div class="htmleaf-container">
    <div id="wrapper">
      <div class="menu">
        <ul>
          <li><span @click="fu('')">主页</span></li>
          <li><span  @click="fu('product')">产品购买</span></li>
          <li><span  @click="fu('renewals')">续费</span></li>
          <li><span  @click="fu('intros')">产品介绍</span></li>
          <li><span  @click="fu('campaigns')">推广活动</span></li>
        </ul>

      </div>

      <div class="screen">
        <div class="burger" @click="run(no)">
          <div class="x"></div>
          <div class="y"></div>
          <div class="z"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "left-nav",
  data() {
    return {
      no: false,

    };
  },
  mounted:function(){//解决跳转到新页面不默认固定在顶部的bug

    this.$router.afterEach((to, from, next) => {

      window.scrollTo(0, 0)

    })

  },
  methods:{
    // 跳转至锚点
    fu(anchorName) {
      this.$emit("fu", anchorName);
      this.closeMenu()
      this.no=false
    },
    run(){
      if(this.no){
        this.no=false
        this.closeMenu()
      }else{
        this.no=true
        this.openMenu()
      }
    },
    openMenu() {
      document.querySelector('div.burger').classList.add('open');
      this.fadeOut(document.querySelector('div.y'));
      document.querySelector('div.screen').classList.add('animate');
      setTimeout(function () {
        document.querySelector('div.x').classList.add('rotate30');
        document.querySelector('div.z').classList.add('rotate150');
        document.querySelector('.menu').classList.add('animate');
        setTimeout(function () {
          document.querySelector('div.x').classList.add('rotate45');
          document.querySelector('div.z').classList.add('rotate135');
        }, 100);
      }, 10);
    },
    closeMenu() {
      document.querySelector('div.screen').classList.remove('animate');
      document.querySelector('div.menu').classList.remove('animate');
      this.fadeIn(document.querySelector('div.y'));
      document.querySelector('div.burger').classList.remove('open');
      document.querySelector('div.x').classList.remove('rotate45');
      document.querySelector('div.x').classList.add('rotate30');
      document.querySelector('div.z').classList.remove('rotate135');
      document.querySelector('div.x').classList.add('rotate150');
      setTimeout(function () {
        document.querySelector('div.x').classList.remove('rotate30');
        document.querySelector('div.x').classList.remove('rotate150');
        document.querySelector('div.z').classList.remove('rotate150');
      }, 50);
      setTimeout(function () {
        document.querySelector('div.x').classList.remove('collapse');
        document.querySelector('div.z').classList.remove('collapse');
      }, 70);
    },
    fadeIn(el, display){
      el.style.opacity = 0;
      el.style.display = display || "block";

      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    },
    fadeOut(el){
      el.style.opacity = 1;

      (function fade() {
        if ((el.style.opacity -= .1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    },

  }
};
</script>

<style  scoped>
  @import '/css/left.css';
  @import '/css/default.css';
</style>
