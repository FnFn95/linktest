<template>
  <div class="options border row ml-0 mr-0">
    <div :class="['col-6 col-sm-12 list', type == '隐私政策' ? 'active' : '']">
      <router-link
        :class="type == '隐私政策' ? 'active' : ''"
        to="/reading/privacyPolicy"
        >{{ $t("loginReadAccept4") }}</router-link
      >
    </div>
    <div :class="['col-6 col-sm-12 list', type == '用户协议' ? 'active' : '']">
      <router-link
        :class="type == '用户协议' ? 'active' : ''"
        to="/reading/userProtocol"
        >{{ $t("loginReadAccept2") }}</router-link
      >
    </div>
    <div v-if="$config.useI18n && langLocal === $config.languageDefine.test">
      {{ langLocal }}
    </div>
  </div>
</template>

<script>
export default {
  name: "options",
  inject: ["reload"], // 注入 reload 方法
  props: {
    type: {
      type: String,
      default: "隐私政策"
    }
  },
  data() {
    return {};
  },
  computed: {
    langLocal() {
      return this.$store.state.app.local;
    }
  }
};
</script>

<style lang="less" scoped>
.options {
  border: 1px solid #f9f9f9;
  background-color: white;

  .list {
    padding: 20px 24px;
    cursor: pointer;
    .active {
      color: #ff8b00 !important;
      &::before {
        content: "";
        display: block;
        width: 5px;
        height: 60px;
        background-color: #ff8b00;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .list:last-child {
    border-bottom: none;
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .options {
    padding: 0 !important;
    margin-bottom: 20px;
    background-color: #eaeaea !important;
    .list {
      text-align: center;
      padding: 15px 0 !important;
    }
    .active {
      background-color: white;
      &::before {
        display: none !important;
      }
    }
  }
}
</style>
