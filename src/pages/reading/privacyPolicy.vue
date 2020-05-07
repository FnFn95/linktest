<template>
  <div class="privacy-policy">
    <zrHeader />
    <div class="container">
      <div class="row mr-0 ml-0">
        <div class="col-12 col-sm-4">
          <zrOptions type="隐私政策" />
        </div>
        <div class="col-12 col-sm-8">
          <div class="text bg-white p-4 border">
            <h1 class="pb-3 mb-3 title">{{ info.title }}</h1>
            <div v-html="info.text"></div>
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
  name: "privacyPolicy",
  components: {
    zrHeader,
    zrFooter,
    zrOptions
  },
  data() {
    return {
      info: {
        title: this.$t("loginReadAccept4"),
        text: ""
      }
    };
  },
  computed: {
    langLocal() {
      this.getPrivacyPolicy();
      return this.$store.state.app.local;
    }
  },
  created() {},
  methods: {
    getPrivacyPolicy() {
      CommonService.getPrivacyPolicy()
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
.privacy-policy {
  background: #f9f9f9;
  .container {
    padding: 100px 0;
    .title {
      font-size: 20px;
      border-bottom: 1px solid #d6d6d6;
    }
  }
}
</style>
