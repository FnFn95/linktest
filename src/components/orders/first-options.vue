<template>
  <div class="first-options row ml-0 mr-0">
    <div class="col-12 col-sm-3 pl-0 list">
      <router-link :class="[type=='盒子订单'?'active':'']" to="/orders/box-orders">{{ $t("profileDeviceOrder") }}</router-link>
    </div>
    <div class="col-12 col-sm-3 pr-0 list">
      <router-link :class="[type=='时长订单'?'active':'']" to="/orders/time-orders">{{ $t("profileDurationOrder") }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "first-options",
  props: {
    type: {
      type: String,
      default: "盒子订单"
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.first-options {
  padding-bottom: 10px;
  border-bottom: 1px solid #d6d6d6;
  margin-bottom: 20px;
  .list {
    cursor: pointer;
    font-size: 16px;
    a {
      color: #808080;
      &:hover {
        color: #333333;
      }
    }
    .active {
      color: #333333 !important;
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .first-options {
    border: none;
    margin-left: -15px !important;
    margin-right: -15px !important;
    .list {
      background-color: white;
      padding: 15px 0 !important;
      text-align: center;
      &:first-child {
        border-bottom: 1px solid #dee2e6 !important;
      }
    }
    .active {
      background-color: white;
      color: #ff8b00;
    }
  }
}
</style>
