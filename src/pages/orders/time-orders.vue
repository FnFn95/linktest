<template>
  <div class="time-orders">
    <zrHeader ref="zrheader" @toPageAnchor="handleToPageAnchor" />
    <div class="container">
      <div class="title">
        <h1 class="english">Profile</h1>
        <h1
          class="chinese"
          v-if="
            !$config.useI18n ||
              ($config.useI18n && langLocal === $config.languageDefine.zhCN)
          "
        >
          个人中心
        </h1>
      </div>
      <div class="row">
        <!-- 左侧 -->
        <div class="col-12 col-sm-4 left">
          <zrOptions types="购买订单" />
        </div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <zrFirst type="时长订单" />
          <div class="list-head">
            <div class="name">{{ $t("profileDeviceId") }}</div>
            <div class="number">{{ $t("profilePackageType") }}</div>
            <div class="price">{{ $t("profileExpireDate") }}</div>
            <div class="type">{{ $t("profileOrderStatus") }}</div>
          </div>
          <div
            class="list"
            v-for="(item, index) in listTimeOrders"
            :key="index"
          >
            <div class="tittle">
              <time class="mr-4">{{ item.create_time }}</time>
              <span class="no">
                {{ $t("profileOrderNumber") }}
                <span style="color:#333333">{{ item.oid }}</span>
              </span>
            </div>
            <div class="goods-info">
              <div class="id">{{ item.did }}</div>
              <div class="type text-center">{{ item.product.name }}</div>
              <div class="expire text-center">{{ util.dateTurnTimeQ(item.due_time,'YYYY.MM.DD') }}</div>
              <div class="state text-center">
                <!-- {{ item.state }} -->
                <span v-if="item.status == '1'"
                  ><Button
                    size="small"
                    type="warning"
                    @click="orderPurchase(item)"
                    >{{ $t("profilePayment") }}</Button
                  ></span
                >
                <span v-else-if="item.status > '1'">已付款</span>
                <!--<span v-else-if="item.status == '2'">{{-->
                  <!--$t("profileToBeDelivered")-->
                <!--}}</span>-->
                <!--<span v-else-if="item.status == '3'">{{-->
                  <!--$t("profileToBeReceived")-->
                <!--}}</span>-->
                <!--<span v-else-if="item.status == '4'">{{-->
                  <!--$t("profileDeviceHasBeenDelivered")-->
                <!--}}</span>-->
                <!--<span v-else-if="item.status == '0'">{{-->
                  <!--$t("profileVoidOrder")-->
                <!--}}</span>-->
                <div v-else>{{ $t("profileUnknownOrder") }}</div>
              </div>
            </div>
          </div>
          <div v-if="!hasOrderList">
            <div style="text-align: center;font-size: 14px;">
              {{ $t("profileNoData") }}
            </div>
          </div>
          <zrPagination
            v-if="hasOrderList"
            :total="listTotal"
            :pageSize="pageSize"
            @previous="onPagePrevious"
            @next="onPageNext"
          />
          <div v-if="!hasOrderList" style="height: 10rem;"></div>
        </div>
      </div>
    </div>
    <!-- 购买框 -->
    <Modal v-model="buingResult" class-name="buy-modal" :mask-closable="false">
      <div class="buing-result text-center">
        <div v-show="buingSuccess" class="success">
          <Icon
            type="md-checkmark"
            color="#ff8b00"
            size="18"
            class="mr-2 rounded-circle border border-warning"
          />{{ $t("homeSuccessfulPurchase") }}
        </div>
        <div v-show="buingError" class="success">
          <Icon
            type="ios-alert-outline"
            size="18"
            class="mr-2 rounded-circle font-weight-bold"
          />
          {{ errorText }}
          <div class="mt-3 text-center">
            <router-link class="text-warning" to="/other/help">{{
              $t("homeClickGetRecharge")
            }}</router-link>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 支付结果对话框 -->
    <purchase-result-modal
      :isShow="isShowResultModal"
      :isSuccess="isResultSuccess"
      :errorText="errorText"
      @onCancel="closeShowResultModal"
    ></purchase-result-modal>
    <zrFooter />
  </div>
</template>

<script>
import CommonService from "@/service/common-service";
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrOptions from "@/components/user-options"; // 引入左侧选项卡
import zrFirst from "@/components/orders/first-options"; // 引入右侧一级选项卡
import zrPagination from "@/components/pagination";
import purchaseResultModal from "@/components/public/purchase-result-modal"; // 结果对话框
import CommonFunc from "@/utils/common";
import util from '../../utils/util';
export default {
  name: "timeOrder",
  components: {
    zrHeader,
    zrFooter,
    zrOptions,
    zrFirst,
    zrPagination,
    purchaseResultModal,
    util
  },
  data() {
    return {
      listTimeOrders: [],
      page: 1,
      pageSize: 10,
      listTotal: 0,
      hasOrderList: false,
      errorText: this.$t("homeFailedPurchase"), // 购买失败的原因
      buingResult: false, // 返回结果：购买成功还是失败？
      buingSuccess: false, // 成功
      buingError: false, // 失败
      isShowResultModal: false,
      isResultSuccess: false,
      lists: [
        // 订单列表 测试数据
        {
          time: "2020-03-20 00:19:32",
          order_no: "521678812212000",
          id: "988413243456",
          type: "三个月",
          expire: "2020-12-24",
          state: "已付款"
        },
        {
          time: "2020-03-20 00:19:32",
          order_no: "76343631534",
          id: "6763533236462",
          type: "九个月",
          expire: "2020-12-24",
          state: "已付款"
        },
        {
          time: "2020-03-20 00:19:32",
          order_no: "98763213375",
          id: "87653235634224",
          type: "一个月",
          expire: "2020-12-24",
          state: "已付款"
        },
        {
          time: "2020-03-20 00:19:32",
          order_no: "8893242598999",
          id: "6324242884341",
          type: "五个月",
          expire: "2020-12-24",
          state: "已付款"
        }
      ]
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
    // }
  },
  computed: {
    langLocal() {
      const resLogin = this.checkLogin();
      if (resLogin) {
        //Note 获取订单列表
        this.fetchOrderList();
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
        CommonFunc.displayMessageTip(this.$t("loginPlsLogFirst"), "info", that);
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
    //Note 时间卡订单列表
    fetchOrderList() {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }

      const params = {
        type: 2,
        limit: this.pageSize,
        page: this.page
      };
      CommonService.getOrderList(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // console.log("fetchOrderList", res);
            const { data } = res;
            const list = [...data.data];
            this.listTimeOrders = [...data];
            if (this.listTimeOrders && !CommonFunc.isEmptyArray(list)) {
              this.listTimeOrders = [...data.data];
              this.listTotal = data.count;
              this.hasOrderList = true;
            } else {
              this.listTotal = 0;
              this.hasOrderList = false;
              this.listTimeOrders = [];
            }
          } else {
            this.hasOrderList = false;
            this.listTimeOrders = [];
          }
        })
        .catch(error => {
          this.listTotal = 0;
          this.hasOrderList = false;
          this.listTimeOrders = [];
          console.log(error);
        });
    },
    //Note 付款
    confirmPurchase(orderData) {
      const that = this;
      const params = {
        oid: orderData.id
      };
      CommonService.payOrder(params)
        .then(res => {
          // console.log("payOrder res", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.buingSuccess = true;
            this.isResultSuccess = true;
            // CommonFunc.displayMessageTip("支付成功", "success", that);
            this.fetchOrderList();
          } else {
            this.buingError = true;
            this.isResultSuccess = false;
            this.errorText = CommonFunc.errorDescBranch(
              res.code,
              res.msg,
              this.$t("homeFailedPurchase")
            );
          }
          this.buingResult = true;
          if (this.buingSuccess) {
            setTimeout(() => {
              this.isShowResultModal = false;
            }, 950);
          }
        })
        .catch(error => {
          console.log("payOrder error", error);
        });
    },
    orderPurchase(orderData) {
      this.buingSuccess = false;
      this.buingError = false;
      this.$Modal.confirm({
        title: this.$t("commonAsk"),
        content: "<div>" + this.$t("profileSureWantPay") + "</div>",
        onOk: () => {
          this.confirmPurchase(orderData);
        },
        onCancel: () => {}
      });
    },
    onPagePrevious(num) {
      console.log("上一页", num);
      if (num) {
        this.page = num;
        //Note 获取产品列表
        this.fetchOrderList();
      }
    },
    onPageNext(num) {
      console.log("下一页", num);
      if (num) {
        this.page = num;
        //Note 获取产品列表
        this.fetchOrderList();
      }
    },
    closeShowResultModal() {
      this.isShowResultModal = false;
    },
    handleToPageAnchor(anchorName) {
      const curPageRouteName = this.$route.name;
      this.$router.push({
        name: "Home",
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
// 购买框
/deep/.ivu-modal-mask {
  z-index: 1 !important;
}
/deep/.buy-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
    .ivu-modal-content {
      max-height: 60vh;
      overflow-y: auto;
      .ivu-modal-body {
        font-size: 16px;
        .buing-body {
          font-size: 16px;
          display: grid;
          row-gap: 12px;
          .add-address {
            cursor: pointer;
            .ivu-icon:hover {
              color: #ff8400 !important;
            }
          }
        }
        .tip,
        .buing-result {
          font-size: 16px;
        }
        .grant-box {
          .ivu-input {
            border: none;
            border-bottom: 1px solid #dddee1;
            &:focus {
              box-shadow: none;
            }
          }
        }
        .grant-result {
          display: flex;
          justify-content: space-between;
        }
      }
      .ivu-modal-footer {
        border-top: none;
        .ivu-btn {
          padding: 8px 55px;
          font-size: 16px;
        }
        .ivu-btn-warning {
          background-color: #ff8400 !important;
          border-color: #ff8400 !important;
        }
      }
    }
  }
}
.time-orders {
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
        grid-template-columns: 40% 20% 20% 20%;
        justify-items: center;
        background-color: #f1f1f1;
        padding: 10px 0;
        color: #666666;
        font-size: 12px;
        position: sticky;
        top: 0;
      }
      .list {
        font-size: 12px;
        margin-bottom: 20px;
        border: 1px solid #e6e6e6;
        .tittle {
          padding: 10px;
          background-color: #f1f1f1;
          color: #969696;
        }
        .goods-info {
          display: grid;
          grid-template-columns: 40% 20% 20% 20%;
          background-color: #ffffff;
          .id {
            padding: 10px;
          }
          .type {
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            padding: 10px;
          }
          .expire,
          .state {
            padding: 10px;
          }
          .expire{
            border-right: 1px solid #e6e6e6;
          }
          .state {
            .ivu-btn-warning {
              background-color: #ff8b00;
              border-color: #ff8b00;
            }
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
  }
  .right {
    padding: 0 !important;
    .list {
      .goods-info {
        grid-template-columns: 47% 20% 33% !important;
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
