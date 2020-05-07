<template>
  <div ref="footer">
    <!-- <div v-if="langLocal === $config.languageDefine.zhCN">
      <div :class="['footer', fixedBottom ? 'fixed-bottom' : '']">
        <div class="container">
          <div>2020 © {{ $t("footerInfoZY") }}</div>
          <div>
            {{ $t("footerInfoZR1")
            }}<a target="_blank" href="http://www.zrtec.net/">{{
              $t("footerInfoZR2")
            }}</a
            >{{ $t("footerInfoZR3") }}
          </div>
          <div>{{ $t("footerInfoEmail") }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div :class="['footer-en', fixedBottom ? 'fixed-bottom' : '']">
        <div class="container-en">
          <Row>
            <div>2020 © {{ $t("footerInfoZY") }}</div>
          </Row>
          <Row>
            <div>
              {{ $t("footerInfoZR1")
              }}<a target="_blank" href="http://www.zrtec.net/">{{
                $t("footerInfoZR2")
              }}</a
              >{{ $t("footerInfoZR3") }}
            </div>
          </Row>
          <Row>
            <div>{{ $t("footerInfoEmail") }}</div>
          </Row>
        </div>
      </div>
    </div> -->
    <div>
      <div :class="['footer', fixedBottom ? 'fixed-bottom' : '']">
        <div class="container">
          <div>2020 © {{ $t("footerInfoZY1") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "zr-footer",
  data() {
    return {
      fixedBottom: false
    };
  },
  mounted() {
    setTimeout(() => {
      const screenHeight = window.innerHeight; // 页面高度
      const distanceTop = this.$refs.footer.offsetTop; // 元素到顶部的距离
      const selfHeight = this.$refs.footer.offsetHeight; // 元素高度
      /* console.log("页面高度：", screenHeight);
      console.log("元素到顶部的距离：", distanceTop); */
      if (distanceTop < screenHeight - selfHeight) {
        // console.log("在屏幕以内");
        this.fixedBottom = true;
      } else {
        // console.log("在屏幕外");
        this.fixedBottom = false;
      }
    }, 1200);
  },
  computed: {
    langLocal() {
      // console.log('computed langLocal', this.$store.state.app.local);

      return this.$store.state.app.local;
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  background-color: #4b4b4b;
  padding: 22px 0;
  font-size: 12px;
  color: #b7b7b7;
  .container {
    display: flex;
    justify-content: space-between;
    a {
      color: #b7b7b7;
    }
  }
}

.footer-en {
  background-color: #4b4b4b;
  padding: 22px 0;
  font-size: 12px;
  color: #b7b7b7;
  .container-en {
    // display: flex;
    // justify-content: space-between;
    text-align: center;
    a {
      color: #b7b7b7;
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .container {
    display: block !important;
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .container-en {
    display: block !important;
  }
}
</style>
