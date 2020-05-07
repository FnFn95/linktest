<template>
  <div class="second-options">
    <!-- <router-link to="/orders/box-orders" :class="['list',type=='全部订单'?'active':'']">全部订单</router-link>
    <router-link to="/orders/no-payment" :class="['list',type=='待付款'?'active':'']">待付款</router-link>
    <router-link to="/orders/no-consignment" :class="['list',type=='待发货'?'active':'']">待发货</router-link>
    <router-link to="/orders/noget" :class="['list',type=='待收货'?'active':'']">待收货</router-link>
    <router-link to="/orders/isget" :class="['list',type=='物流已送达'?'active':'']">物流已送达</router-link>
    <router-link to="/orders/cancellation-orders" :class="['list',type=='作废订单'?'active':'']">作废订单</router-link> -->
    <span :class="['list', type == '全部订单' ? 'active' : '']" @click="onChangeType('')">{{ $t('profileAllOrders') }}</span>
    <span :class="['list', type == '待付款' ? 'active' : '']" @click="onChangeType('1')">{{ $t('profilePendingPayment') }}</span>
    <span :class="['list', type == '待发货' ? 'active' : '']" @click="onChangeType('2')">{{ $t('profileToBeDelivered') }}</span>
    <span :class="['list', type == '待收货' ? 'active' : '']" @click="onChangeType('3')">{{ $t('profileToBeReceived') }}</span>
    <span :class="['list', type == '物流已送达' ? 'active' : '']" @click="onChangeType('4')">{{ $t('profileDeviceHasBeenDelivered') }}</span>
    <span :class="['list', type == '作废订单' ? 'active' : '']" @click="onChangeType('0')">{{ $t('profileVoidOrder') }}</span>
  </div>
</template>

<script>
export default {
  name: 'second-options',
  props: {
    type: {
      type: String,
      default: '全部订单'
    }
  },
  watch: {
    type(newVal, oldVal) {
      console.log('type', newVal);
    }
  },
  data() {
    return {};
  },
  methods: {
    onChangeType(v) {
      this.$emit('changeOrderType', v);
    }
  }
};
</script>

<style lang="less" scoped>
.second-options {
  overflow-x: auto;
  white-space: nowrap;
  /*滚动条整体样式*/
  &::-webkit-scrollbar {
    height: 6px;
  }

  /*滚动条里面的滚动的块样式*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ffb051;
    background-image: -webkit-linear-gradient(
      45deg,
      #ff8b00 25%,
      transparent 25%,
      transparent 50%,
      #ff8b00 50%,
      #ff8b00 75%,
      transparent 75%,
      transparent
    );
  }

  /*滚动条里面轨道*/
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }

  .list {
    display: inline;
    cursor: pointer;
    margin-right: 12px;
    color: #333333;
    &:hover {
      color: #ff8b00;
    }
  }
  .active {
    color: #ff8b00;
  }
  .list:last-child {
    margin-right: 0;
  }
}

/* 小于等于 769px */  
@media (max-width: 767px) {
  .second-options {
    display: flex;
    justify-content: space-between;
    .list {
      margin-right: 30px !important;
    }
  }
}
</style>
