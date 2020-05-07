<template>
  <div class="user-protocol">
    <zrHeader />
    <div class="container">
      <div class="row mr-0 ml-0">
        <div class="col-12 col-sm-4">
          <zrOptions type="用户协议" />
        </div>
        <div class="col-12 col-sm-8">
          <div class="text bg-white p-4 border">
            <h1 class="pb-3 mb-3 title">{{ info.title }}</h1>
            <div class="text" v-html="info.text"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$config.useI18n && langLocal === $config.languageDefine.test">
      {{ langLocal }}
    </div>
    <zrFooter />
  </div>
</template>

<script>
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrOptions from "@/components/reading-options"; //引入左侧导航选项卡
import CommonService from "@/service/common-service"; // 调接口依赖项

export default {
  name: "useProtocol",
  components: {
    zrHeader,
    zrFooter,
    zrOptions
  },
  data() {
    return {
      info: {
        title: this.$t("loginReadAccept2"),
        text: ""
      }
    };
  },
  computed: {
    langLocal() {
      this.getUserAgreement();
      return this.$store.state.app.local;
    }
  },
  created() {},
  methods: {
    getUserAgreement() {
      CommonService.getUserAgreement()
        .then(res => {
          if (res.code == 1000) {
            this.info.text = res.data.content;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.user-protocol {
  background: #f9f9f9;
  .container {
    padding: 100px 0;
    .title {
      font-size: 20px;
      border-bottom: 1px solid #d6d6d6;
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
}
</style>
