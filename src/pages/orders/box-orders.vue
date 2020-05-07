<template>
  <div class="box-orders">
    <zrHeader ref="zrheader" @toPageAnchor="handleToPageAnchor" />
    <div class="container">
      <div class="title">
        <h1 class="english">Profile</h1>
        <h1 class="chinese" v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">个人中心</h1>
      </div>
      <div class="row">
        <!-- 左侧 -->
        <div class="col-12 col-sm-4 left"><zrOptions types="购买订单" /></div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <zrFirst type="盒子订单" />
          <zrSecond :type="orderQueryType" @changeOrderType="handleChangeOrderType" />
          <div class="list-head">
            <div class="name">{{ $t('profileproductName') }}</div>
            <div class="number">{{ $t('profileQuantity') }}</div>
            <div class="price">{{ $t('profileAmount') }}</div>
            <div class="state">{{ $t('profileOrderStatus') }}</div>
          </div>
          <div class="bg-white list" v-for="(item, index) in listBoxOrder" :key="index">
            <div class="tittle">
              <time class="mr-4">{{ item.create_time }}</time>
              <span class="no">
                {{ $t('profileOrderNumber') }}
                <span style="color:#333333">{{ item.oid }}</span>
              </span>
            </div>
            <div class="goods-info">
              <div class="goods">
                <div class="info">
                  <div class="img">
                    <!-- <img src="../../assets/images/test.jpeg" alt /> -->
                    <img :src="item.product.picture" alt />
                  </div>
                  <div style="padding-left: 10px; width:60%">{{ item.product.name }}</div>
                  <div class="text-center text-black-50 number">{{ item.num }}</div>
                </div>
                <div class="account-number" v-if="item.status == '4'">
                  <div v-for="(device, i) in item.device_info" :key="i" class="item">
                    <div class="text-black-50">
                      <span>{{ $t('profileDeviceId') }}:</span>
                      <span class="text-dark">
                        <Tooltip :content="device.did" theme="light">{{ device.did.length > 7 ? device.did.slice(0, 8) + '...' : device.did }}</Tooltip>
                      </span>
                    </div>
                    <span class="text-black-50" v-if="device.activate_time && device.expiration">
                      <span>Password:</span>
                      <span class="text-dark">
                        <Tooltip :content="device.password" theme="light">{{ device.password.length > 7 ? device.password.slice(0, 8) + '...' : device.password }}</Tooltip>
                      </span>
                    </span>
                    <span v-else class="text-black-50">
                        <span>Password:</span>
                        <span >{{device.password}}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-center text-muted price">$ {{ item.pay }}</div>
              <div class="text-center state">
                <div v-if="item.status == '1'">{{ $t('profilePendingPayment') }}</div>
                <div v-else-if="item.status == '2'">{{ $t('profileToBeDelivered') }}</div>
                <div v-else-if="item.status == '3'">{{ $t('profileToBeReceived') }}</div>
                <div v-else-if="item.status == '4'">{{ $t('profileDeviceHasBeenDelivered') }}</div>
                <div v-else-if="item.status == '0'">{{ $t('profileVoidOrder') }}</div>
                <div v-else>{{ $t('profileUnknownOrder') }}</div>
                <button type="button" class="btn btn-link text-dark mt-3 decoration-none">
                  <!-- <router-link to="/orders/order-detail?no=666"
                    >订单详情</router-link
                  > -->
                  <span class="cursor-link-color" @click="toOrderDetail(item)">{{ $t('profileorderDetails') }}</span>
                </button>
              </div>
            </div>
            <!-- 小屏时显示 -->
            <div class="sm-account-number" v-if="item.status == '4'">
              <div v-for="(device, i) in item.device_info" :key="i" class="item">
                <div class="text-black-50">
                  <span>{{ $t("openDeviceId") }}</span>
                  <span class="text-dark">
                    <Tooltip :content="device.did" theme="light">{{ device.did.length > 7 ? device.did.slice(0, 8) + '...' : device.did }}</Tooltip>
                  </span>
                </div>
                <span class="text-black-50" v-if="device.activate_time && device.expiration">
                  <span>Password:</span>
                  <span class="text-dark">
                    <Tooltip :content="device.password" theme="light">{{ device.password.length > 7 ? device.password.slice(0, 8) + '...' : device.password }}</Tooltip>
                  </span>
                </span>
                <span v-else class="text-black-50">
                  <span>Password:</span>
                  <span >{{device.password}}</span>
                </span>
              </div>
            </div>
          </div>
          <div v-if="!hasOrderList">
            <div style="text-align: center;font-size: 14px;">{{ $t('profileNoData') }}</div>
          </div>
          <zrPagination v-if="hasOrderList" :total="listTotal" :pageSize="pageSize" @previous="onPagePrevious" @next="onPageNext" />
          <div v-if="!hasOrderList" style="height: 10rem;"></div>
          <!--<div class="navs">-->
          <!--<router-link to="/orders/box-orders">全部订单</router-link>-->
          <!--<router-link to="/orders/box-orders">待付款</router-link>-->
          <!--<router-link to="/orders/box-orders">待发货</router-link>-->
          <!--<router-link to="/orders/box-orders">待收货</router-link>-->
          <!--<router-link to="/orders/box-orders">物流已送达</router-link>-->
          <!--<router-link to="/orders/box-orders">作废订单</router-link>-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <zrFooter />
  </div>
</template>

<script>
import CommonService from '@/service/common-service';
import zrHeader from '@/components/header';
import zrFooter from '@/components/footer';
import zrOptions from '@/components/user-options'; // 引入左侧选项卡
import zrFirst from '@/components/orders/first-options'; // 引入右侧一级选项卡
import zrSecond from '@/components/orders/second-options.vue'; // 引入右二级选项卡
import zrPagination from '@/components/pagination';
import CommonFunc from '@/utils/common';

export default {
  name: 'boxOrder',
  components: {
    zrHeader,
    zrFooter,
    zrOptions,
    zrFirst,
    zrSecond,
    zrPagination
  },
  data() {
    return {
      listBoxOrder: [],
      orderProductInfo: {},
      orderDeviceInfo: {},
      orderDeviceList: [],
      orderDeviceNum: 0,
      page: 1,
      pageSize: 5,
      listTotal: 0,
      orderQueryType: this.$t('profileAllOrders'),
      orderTypeParam: undefined,
      hasOrderList: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.backTop();
    });

    // const resLogin = this.checkLogin();
    // if (resLogin) {
    //   //Note 获取订单列表
    //   this.fetchOrderList();
    //   // console.log("created name", this.$route.name);
    // }
  },
  computed: {
    langLocal() {
      const resLogin = this.checkLogin();
      if (resLogin) {
        //Note 获取订单列表
        this.fetchOrderList();
        // console.log("created name", this.$route.name);
      }
      return this.$store.state.app.local;
    }
  },
  methods: {
    //Note 判断是否登录
    checkInitLogin() {
      const res = CommonFunc.isLoginByCheck();
      if (!res) {
        return false;
      } else {
        return true;
      }
    },
    checkLogin() {
      const res = CommonFunc.isLoginByCheck();
      if (!res) {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('loginPlsLogFirst'), 'info', that);
        if (this.$refs.zrheader) {
          setTimeout(() => {
            this.$refs.zrheader.openLogin();
          }, Consts.TIMESETTING.LOGIN_DISPLAY_DELAY);
        }

        return false;
      } else {
        return true;
      }
    },
    // 回到页面顶部
    backTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    //Note 盒子订单列表
    fetchOrderList() {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }

      // console.log("fetchOrderList");
      const params = {
        type: 1,
        status: this.orderTypeParam,
        limit: this.pageSize,
        page: this.page
      };
      CommonService.getOrderList(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // console.log("fetchOrderList", res);
            const { data } = res;
            //  console.log('fetchOrderList data', data);
            const list = [...data.data];
            // console.log('fetchOrderList', this.listBoxOrder);
            if (this.listBoxOrder && !CommonFunc.isEmptyArray(list)) {
              this.listBoxOrder = [...data.data];
              this.listTotal = data.count;
              this.hasOrderList = true;
            } else {
              this.listTotal = 0;
              this.hasOrderList = false;
              this.listBoxOrder = [];
            }
          } else {
            this.listTotal = 0;
            this.hasOrderList = false;
            this.listBoxOrder = [];
          }
        })
        .catch(error => {
          this.listTotal = 0;
          this.hasOrderList = false;
          this.listBoxOrder = [];
          console.log(error);
        });
    },
    handleChangeOrderType(v) {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }

      this.orderTypeParam = v;
      if (v == '0') {
        this.orderQueryType = '作废订单';
      } else if (v == '1') {
        this.orderQueryType = '待付款';
      } else if (v == '2') {
        this.orderQueryType = '待发货';
      } else if (v == '3') {
        this.orderQueryType = '待收货';
      } else if (v == '4') {
        this.orderQueryType = '物流已送达';
      } else {
        this.orderQueryType = '全部订单';
        this.orderTypeParam = undefined;
      }
      // console.log("handleChangeOrderType");

      this.fetchOrderList();
    },
    toOrderDetail(v) {
      if (!CommonFunc.isEmptyObject(v) && v.hasOwnProperty('oid')) {
        sessionStorage.setItem('orderDetailFromPage', 'boxOrderPage');
        this.$router.push({
          name: 'ordersDetail',
          query: {
            orderId: v.oid
          }
        });
      } else {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('profileGetOrderDetailFailed'), 'warning', that);
        return false;
      }
    },
    onPagePrevious(num) {
      console.log('上一页', num);
      if (num) {
        this.page = num;
        //Note 获取产品列表
        this.fetchOrderList();
      }
    },
    onPageNext(num) {
      console.log('下一页', num);
      if (num) {
        this.page = num;
        //Note 获取产品列表
        this.fetchOrderList();
      }
    },
    handleToPageAnchor(anchorName) {
      const curPageRouteName = this.$route.name;
      this.$router.push({
        name: 'Home',
        params: {
          fromPage: curPageRouteName,
          anchorName: anchorName
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.decoration-none {
  text-decoration: none;
}
.decoration-none:hover {
  text-decoration: none;
}

.box-orders {
  background-color: #f9f9f9;
  .container {
    .title {
      padding: 50px 0 30px;
      border-bottom: 1px solid #d6d6d6;
      margin-bottom: 30px;
      .english {
        font-size: 66px;
      }
      .chinese {
        font-size: 30px;
      }
    }
    .right {
      padding-right: 0;
      .list-head {
        display: grid;
        margin: 20px 0;
        grid-template-columns: 45% 15% 20% 20%;
        justify-items: center;
        align-items: center;
        text-align: center;
        background-color: #f1f1f1;
        padding: 10px 0;
        color: #666666;
        font-size: 12px;
      }
      .list {
        font-size: 12px;
        margin-bottom: 20px;
        border: 1px solid #e6e6e6;
        .sm-account-number {
          display: none;
        }
        .tittle {
          padding: 10px;
          background-color: #f1f1f1;
          color: #969696;
        }
        .goods-info {
          display: grid;
          grid-template-columns: 60% 20% 20%;
          .goods {
            .info {
              display: flex;
              padding: 20px;
              .img {
                width: 25%;
                img {
                  width: 72px;
                }
              }
              .number {
                width: 15%;
              }
            }
            .account-number {
              .item {
                padding: 10px 20px;
                border-top: 1px solid #e6e6e6;
                display: flex;
                justify-content: space-around;
                .text-black-50 {
                  width: 50%;
                }
              }
            }
          }
          .price {
            border-left: 1px solid #e6e6e6;
            padding: 20px;
          }
          .state {
            color: #ff8b00;
            border-left: 1px solid #e6e6e6;
            padding: 20px;
          }
        }
      }
      .pagination {
        display: flex;
        justify-content: center;
        margin: 30px 15px 0;
        margin-bottom: 120px;
        .righting {
          padding: 15px;
          background-color: #d9d8db;
        }
        .page-num {
          padding: 15px 20px;
        }
        .lefting {
          padding: 15px;
          background-color: #fe8c01;
        }
      }
      .navs {
        color: #fe8c01;
        text-align: center;
        margin-bottom: 100px;
        a {
          color: #fe8c01;
          border-bottom: 1px solid #fe8c01;
        }
      }
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  .container {
    .title {
      .english {
        font-size: 40px !important;
      }
      .chinese {
        font-size: 20px !important;
      }
    }
    .row {
      margin: 0 !important;
    }
    .left {
      padding: 0;
    }
    .right {
      padding-left: 0;
      .list-head {
        grid-template-columns: 40% 15% 20% 25% !important;
      }
      .list {
        .sm-account-number {
          border-top: 1px solid #e6e6e6;
          display: block !important;
          padding: 10px 8px;
          .item {
            display: flex;
            justify-content: space-around;
          }
        }
        .goods-info {
          .goods {
            .account-number {
              display: none;
            }
            .item {
              padding: 10px !important;
              display: block !important;
              .text-black-50 {
                width: unset !important;
              }
            }
            .info {
              padding: 20px 8px !important;
              img {
                width: 50px !important;
              }
            }
          }
          .price {
            padding: 20px 8px !important;
          }
          .state {
            padding: 20px 8px !important;
          }
        }
      }

      .navs {
        margin-left: -10px;
        margin-right: -10px;
      }
    }
  }
}
/* 小屏幕（平板，大于等于 768px） */
@media screen and (min-width: 768px) {
  /* 你的样式 */
}

/* 中等屏幕（桌面显示器，大于等于 992px） */
@media screen and (min-width: 992px) {
  /* 你的样式 */
}

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media screen and (min-width: 1200px) {
  /* 你的样式 */
}

/*  769px到992px之间  */
@media (min-width: 768px) and (max-width: 992px) {
  /* 你的样式 */
}
</style>
