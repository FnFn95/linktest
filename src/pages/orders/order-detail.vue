<template>
  <div class="orders-detail">
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
      <div class="row ml-0 mr-0">
        <!-- 左侧 -->
        <div class="col-12 col-sm-4 left"><zrOptions types="购买订单" /></div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <zrFirst type="盒子订单" />
          <div class="goods bg-white mb-3">
            <div class="head pb-2 mb-2">
              <span>{{ $t("profileorderDetails") }}</span>
              <span v-if="orderDetailInfo.status == '1'">{{
                $t("profilePendingPayment")
              }}</span>
              <span v-else-if="orderDetailInfo.status == '2'">{{
                $t("profileToBeDelivered")
              }}</span>
              <span v-else-if="orderDetailInfo.status == '3'">{{
                $t("profileToBeReceived")
              }}</span>
              <span v-else-if="orderDetailInfo.status == '4'">{{
                $t("profileDeviceHasBeenDelivered")
              }}</span>
              <span v-else-if="orderDetailInfo.status == '0'">{{
                $t("profileVoidOrder")
              }}</span>
              <span v-else>{{ $t("profileUnknownOrder") }}</span>
            </div>
            <div
              class="address"
            >
              <div class="info">
                <span style="margin-right: 20px">{{
                  $t("addressShippingAddress")
                }}</span>
                <span style="color:"
                  >{{ orderDetailInfo.name }}, {{ orderDetailInfo.mobile }},
                  {{ orderDetailInfo.address }}</span
                >
              </div>

              <button
                  v-if="
                    orderDetailInfo.status == '1' ||
                      orderDetailInfo.status == '2' ||
                      orderDetailInfo.status == '3'
                  "
                type="button edit"
                class="btn btn-link text-secondary"
                @click="changeDeliveryAddress(orderDetailInfo)"
              >
                {{ $t("homeModifyAddress") }}
              </button>
                <button
                  v-if="
                    orderDetailInfo.status == '4'
                  "
                type="button edit"
                class="btn btn-link text-secondary"
              >
                {{ $t("homeModifyAddress") }}
              </button>
            </div>
            <div
              v-if="
                orderDetailInfo.status == '1' ||
                  orderDetailInfo.status == '2' ||
                  orderDetailInfo.status == '3' ||
                  orderDetailInfo.status == '4'
              "
              class="pt-3"
            >
              {{ $t("profileorderDetails") }}
            </div>
            <div class="order-no">
              <span style="margin-right: 20px">{{
                $t("profileOrderNumber1")
              }}</span>
              <span>{{ orderDetailInfo.oid }}</span>
              <span
                v-if="
                  orderDetailInfo.status == '2' ||
                    orderDetailInfo.status == '3' ||
                    orderDetailInfo.status == '4'
                "
                >{{ $t("profilePaymentTime") }}
                {{ orderDetailInfo.pay_time }}</span
              >
            </div>
            <div class="goods-head p-2">
              <div>{{ $t("profileproductName") }}</div>
              <div>{{ $t("profileQuantity") }}</div>
              <div>{{ $t("profileAmount") }}</div>
              <div v-if="orderDetailInfo.status == '4'">
                {{ $t("profileDeviceId") }}
              </div>
              <div v-if="orderDetailInfo.status == '4'">Password</div>
            </div>
            <div class="goods-info" v-if="orderDetailProductInfo">
              <div class="name">
                <span class="pic" v-if="orderDetailProductInfo.picture"
                  ><img :src="orderDetailProductInfo.picture" alt
                /></span>
                <span v-else
                  ><img class="img" src="../../assets/images/box.png" alt
                /></span>
                <span>{{ orderDetailProductInfo.name }}</span>
              </div>
              <div class="text-center number">{{ orderDetailInfo.num }}</div>
              <div class="text-center price" v-if="orderDetailInfo.pay">
                ${{ orderDetailInfo.pay }}
              </div>
              <div class="text-center id" v-if="orderDetailInfo.status == '4'">
                <!-- {{ orderDetailDeviceInfo.did }} -->
                <div
                  v-for="(item, index) in orderDetailDeviceList"
                  :key="index"
                >
                  <Tooltip :content="item.did" theme="light">{{
                    item.did.length > 7
                      ? item.did.slice(0, 8) + "..."
                      : item.did
                  }}</Tooltip>
                </div>
              </div>
              <div
                class="text-center password"
                v-if="orderDetailInfo.status == '4'"
              >
                <!-- {{ orderDetailDeviceInfo.password }} -->
                <div
                  v-for="(item, index) in orderDetailDeviceList"
                  :key="index"
                >
                  <span v-if="item.activate_time && item.expiration">
                    <Tooltip :content="item.password" theme="light">{{
                      item.password.length > 7
                        ? item.password.slice(0, 8) + "..."
                        : item.password
                    }}</Tooltip>
                  </span>
                  <span v-else>{{item.password}}</span>
                </div>
              </div>
            </div>
            <div class="btns pt-3 pb-3">
              <Button
                v-if="orderDetailInfo.status == '1'"
                size="large"
                type="warning"
                @click="orderPurchase(orderDetailInfo)"
                class="mr-4"
                >{{ $t("profilePayment") }}</Button
              >
              <Button size="large" @click="backToOrderList">{{
                $t("commonConfirm1")
              }}</Button>
            </div>
          </div>
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
          />
          {{ $t("homeSuccessfulPurchase") }}
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
    <!-- 修改收货地址 -->
    <selectingAddress
      :states="editDeliveryAddressModal"
      :address="listUserAddress"
      :currentAddressId="selectedAddressId"
      @update="updateDeliveryAddress"
      @yes="onSelectedAddress"
      @close="closeSelectingAddress"
    />
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
import AccountService from "@/service/account-service";
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrOptions from "@/components/user-options"; // 引入左侧选项卡
import zrFirst from "@/components/orders/first-options"; // 引入右侧一级选项卡
import selectingAddress from "@/components/buing/selectingAddress"; // 引入选择地址框
import purchaseResultModal from "@/components/public/purchase-result-modal"; // 结果对话框
import CommonFunc from "@/utils/common";

export default {
  name: "ordersDetail",
  components: {
    zrHeader,
    zrFooter,
    zrOptions,
    zrFirst,
    selectingAddress,
    purchaseResultModal
  },
  data() {
    return {
      routeOrderInfo: this.$route.query.orderId,
      isShowResultModal: false,
      isResultSuccess: false,
      orderDetailInfo: {},
      orderDetailProductInfo: {},
      orderDetailDeviceInfo: {},
      orderDetailDeviceList: [],
      orderDetailDeviceNum: 0,
      selecetdOrderId: "",
      selectedAddressMobile: "",
      selectedAddressDesc: "",
      listUserAddress: [], // 收货地址
      selectedAddressId: -1,
      selectedAddressInfo: {}, // 从选择地址框带过来的数据
      errorText: this.$t("homeFailedPurchase"), // 购买失败的原因
      buingResult: false, // 返回结果：购买成功还是失败？
      buingSuccess: false, // 成功
      buingError: false, // 失败
      lists: {
        state: "2",
        name: "全易",
        mobile: "89876432",
        adress: "北京市昌平区回龙观",
        order_no: "521678812212000",
        time: "2020-03-20 00:19:32",
        pic: "../../assets/images/test.jpeg",
        product: "呀呀呀呀给地覅为",
        number: 2,
        price: 59,
        box_id: "65265462353",
        password: "87643234"
      },
      editDeliveryAddressModal: false, //选择收货地址框
      address: [
        {
          id: 0,
          name: "全易",
          mobile: "13300211109",
          address: "中国，北京市昌平区回龙观"
        },
        {
          id: 1,
          name: "丫丫",
          mobile: "15053634242",
          address: "中国，北京市朝阳区望京"
        }
      ]
    };
  },
  computed: {
    langLocal() {
      const resLogin = this.checkLogin();
      if (resLogin) {
        //Note 获取订单详情
        this.fetchOrderDetail();
        //Note 获取收货地址
        this.fetchAddressList();
      }
      return this.$store.state.app.local;
    }
  },
  created() {
    // const resLogin = this.checkLogin();
    // if (resLogin) {
    //   //Note 获取订单详情
    //   this.fetchOrderDetail();
    //   //Note 获取收货地址
    //   this.fetchAddressList();
    // }
  },
  methods: {
    //Note 判断是否登录
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
    //Note 订单详情
    fetchOrderDetail(type = "init") {
      const that = this;
      if (this.routeOrderInfo) {
        const params = {
          oid: this.routeOrderInfo
        };
        CommonService.getOrderDetail(params)
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              // console.log("getOrderDetail", res);
              const { data } = res;

              // console.log("orderDetailInfo", this.orderDetailInfo);
              if (!CommonFunc.isEmptyObject(data)) {
                this.orderDetailInfo = data;
                if (data.hasOwnProperty("product")) {
                  this.orderDetailProductInfo = data.product;
                } else {
                  this.orderDetailProductInfo = {};
                }
                if (
                  data.hasOwnProperty("device_info") &&
                  !CommonFunc.isEmptyArray(data.device_info)
                ) {
                  this.orderDetailDeviceNum = data.device_info.length;
                  this.orderDetailDeviceInfo = data.device_info[0];
                  this.orderDetailDeviceList = data.device_info;
                } else {
                  this.orderDetailDeviceNum = 0;
                  this.orderDetailDeviceInfo = {};
                  this.orderDetailDeviceList = [];
                }
              } else {
                this.initList();
              }
              if (type == "addr") {
                CommonFunc.displayMessageTip(
                  this.$t("profileModifyAddressSuccessful"),
                  "success",
                  that
                );
                this.editDeliveryAddressModal = false;
              }
            } else {
              this.initList();
            }
          })
          .catch(error => {
            this.initList();
            console.log(error);
          });
      }
    },
    initList() {
      this.orderDetailInfo = {};
      this.orderDetailProductInfo = {};
      this.orderDetailDeviceNum = 0;
      this.orderDetailDeviceInfo = {};
      this.orderDetailDeviceList = [];
    },
    //Note 付款
    confirmPurchase(orderData) {
      const that = this;
      const params = {
        oid: orderData.id
      };
      CommonService.payOrder(params)
        .then(res => {
          console.log("payOrder res", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // CommonFunc.displayMessageTip("支付成功", "success", that);
            this.buingSuccess = true; //成功
            this.isResultSuccess = true;
            this.fetchOrderDetail();
          } else {
            this.buingError = true;
            this.isResultSuccess = false;
            // if (res.code == Consts.CODEDESC.RESP_ERRORCODE_1017) {
            //   this.errorText = Consts.CODEDESC.RESP_ERRORCODE_1017_DESC;
            // } else if (res.code == Consts.CODEDESC.RESP_ERRORCODE_1018) {
            //   this.errorText = Consts.CODEDESC.RESP_ERRORCODE_1018_DESC;
            // } else {
            //   this.errorText = "购买失败";
            // }
            this.errorText = CommonFunc.errorDescBranch(
              res.code,
              res.msg,
              this.$t("homeFailedPurchase")
            );
          }
          // this.buingResult = true;
          this.isShowResultModal = true;
          if (this.buingSuccess) {
            setTimeout(() => {
              // this.buingResult = false;
              this.isShowResultModal = false;
            }, 950);
          }
          // else {
          //   setTimeout(() => {
          //     // this.buingResult = false;
          //     this.isShowResultModal = false
          //   }, 1500);
          // }
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
    //Note 获取收货地址列表
    fetchAddressList() {
      CommonService.getAddressList({
        headers: { "Show-Loading": false }
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // this.address=
            // console.log(res);
            const { data } = res;
            this.listUserAddress = [...data];
            if (this.listUserAddress && this.listUserAddress.length == 1) {
              // 只有一个地址时
              this.selectedAddressInfo = { ...this.listUserAddress[0] };
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //Note 更新收货地址
    updateDeliveryAddress() {
      this.fetchAddressList();
    },
    ///Note 选择收货地址
    onSelectedAddress(state, data) {
      console.log("选择过来的收货地址：", data);
      const that = this;
      if (!CommonFunc.isEmptyObject(data)) {
        this.selectedAddressInfo = { ...data };

        AccountService.changeAddress({
          address_id: this.selectedAddressInfo.id,
          oid: this.selecetdOrderId
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              this.fetchOrderDetail("addr");
              // this.editDeliveryAddressModal = state;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log("error 选择过来的收货地址：", data);
        CommonFunc.displayMessageTip(
          this.$t("homeAddressSelectionFailed"),
          "warning",
          that
        );
      }
    },
    // 直接关闭了收货地址框
    closeSelectingAddress(state) {
      // this.buyModal = true;
      this.editDeliveryAddressModal = state;
    },
    //修改地址
    changeDeliveryAddress(v) {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }

      if (v && v.hasOwnProperty("oid")) {
        this.selecetdOrderId = v.oid;
      } else {
        this.selecetdOrderId = "";
      }

      if (!this.selecetdOrderId) {
        console.log("changeDeliveryAddress", v);
        const that = this;
        CommonFunc.displayMessageTip(
          this.$t("profileGetOrderDetailFailed"),
          "warning",
          that
        );
        return false;
      }

      if (v && v.hasOwnProperty("address") && v.hasOwnProperty("mobile")) {
        this.selectedAddressDesc = v.address;
        this.selectedAddressMobile = v.mobile;
      } else {
        this.selectedAddressDesc = "";
        this.selectedAddressMobile = "";
      }

      this.selectedAddressId = -1;
      if (this.selectedAddressDesc && this.selectedAddressMobile) {
        for (let index = 0; index < this.listUserAddress.length; index++) {
          const element = this.listUserAddress[index];
          if (
            element.address == this.selectedAddressDesc &&
            element.mobile == this.selectedAddressMobile
          ) {
            this.selectedAddressId = element.id;
            break;
          }
        }
      }
      // console.log("changeDeliveryAddress", this.selectedAddressId);

      this.editDeliveryAddressModal = true;
    },
    updataAdress() {
      console.log("更新地址");
    },
    // 选择收货地址
    selectingAddress(state, data) {
      console.log("选择过来的收货地址：", data);
      this.lists.name = data.name;
      this.lists.mobile = data.mobile;
      this.lists.address = data.address;
      this.editDeliveryAddressModal = state;
    },
    // 直接关闭了收货地址框
    // closeSelectingAddresst(state) {
    //   this.editDeliveryAddressModal = state;
    // },
    closeShowResultModal() {
      this.isShowResultModal = false;
    },
    backToOrderList() {
      const fromPage = sessionStorage.getItem("orderDetailFromPage");
      if (fromPage == "timeOrderPage") {
        this.$router.push({
          name: "timeOrders"
        });
      } else {
        this.$router.push({
          name: "boxOrders"
        });
      }
    },
    // 确认
    OK(data) {
      console.log(data);
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
// 去除默认
.btn-link:hover {
  text-decoration: none;
}
.orders-detail {
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
      .goods {
        padding: 20px 30px;
        border: 1px solid #d6d6d6;
        .head {
          span:nth-child(2) {
            color: #808080;
          }
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #d6d6d6;
          .state {
            color: #fe8c01;
          }
        }
        .address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d6d6d6;
          padding: 8px 0 16px;
          .info {
            width: 80%;
          }
        }
        .order-no {
          padding: 10px 0;
        }
        .goods-head {
          display: grid;
          grid-template-columns: 30% 10% 10% 30% 20%;
          background-color: #f1f1f1;
          color: #666666;
          font-size: 12px;
          justify-items: center;
        }
        .goods-info {
          color: #666666;
          display: grid;
          grid-template-columns: 30% 10% 10% 30% 20%;
          border-bottom: 1px solid #d6d6d6;
          padding: 15px 0;
          .name {
            display: flex;
            .pic {
              margin-right: 20px;
              img {
                width: 60px;
              }
            }
          }
          .price,
          .id,
          .password {
            padding: 0 4px;
            text-align: justify;
            text-justify: newspaper;
            word-break: break-all;
          }
        }
        .btns {
          display: flex;
          justify-content: flex-end;
          .ivu-btn-warning,
          .ivu-btn-default {
            width: 88px;
          }
          .ivu-btn-warning {
            background-color: #ff8b00;
            border-color: #ff8b00;
          }
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
    .left {
      padding: 0;
    }
    .right {
      padding-left: 0;
      padding-right: 0;
      .goods {
        padding: 20px 10px !important;
        .address {
          .btn {
            padding: 0 !important;
          }
        }
        .goods-head {
          margin-left: -10px;
          margin-right: -10px;
        }
        .goods-info {
          .name {
            display: block !important;
            .pic {
              margin-right: 0;
              img {
                width: 50px;
              }
            }

            span {
              display: block;
              margin-top: 8px;
            }
          }
        }
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
