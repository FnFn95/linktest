<template>
  <div class="options bg-white row ml-0 mr-0 border">
    <div :class="['col-6 col-sm-12 list',types=='用户资料'?'active':'']">
      <router-link :class="[types=='用户资料'?'active':'']" to="/user">{{ $t("profileUserInformation") }}</router-link>
    </div>
    <div :class="['col-6 col-sm-12 list',types=='购买订单'?'active':'']">
      <router-link :class="[types=='购买订单'?'active':'']" to="/orders/box-orders">{{ $t("profilePurchaseOrder") }}</router-link>
    </div>
    <div v-if="$config.useI18n && langLocal === $config.languageDefine.test">
      {{ langLocal }}
    </div>
  </div>
</template>

<script>
export default {
  name: "options",
  props: {
    types: {
      type: String,
      default: "用户资料"
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
  .active {
    color: #ff8b00;
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
  .list {
    padding: 20px 24px;
    border-bottom: 1px solid #f9f9f9;
    cursor: pointer;
  }
  .list:last-child {
    border-bottom: none;
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .options {
    background-color: #eaeaea !important;
    padding: 0 !important;
    .list {
      text-align: center;
      padding: 15px 0 !important;
    }
    .active {
      background-color: white !important;
      &::before {
        display: none !important;
      }
    }
  }
}
</style>
