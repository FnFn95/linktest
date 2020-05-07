<template>
  <div class="user">
    <zrEditing :state="editState" :show="showPanel" @close="colseEdit" />
    <zrHeader @toPageAnchor="handleToPageAnchor" />
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
        <div class="col-12 col-sm-4">
          <zrOptions types="用户资料" />
        </div>
        <!-- 右侧 -->
        <div class="col-12 col-sm-8 right">
          <div class="bg-white mb-3 border info">
            <div class="text-right text-black-50">
              {{ $t("profileusername") }}
            </div>
            <div>
              {{ userInfo.username }}
              <button
                v-if="userInfo.username"
                type="button"
                class="btn btn-link text-warning text-warning-u"
                @click="
                  editState = true;
                  showPanel = '密码';
                "
              >
                {{ $t("profileModifyPassword") }}
              </button>
            </div>
            <div class="text-right text-black-50">{{ $t("profileemail") }}</div>
            <div>
              {{ userInfo.email }}
              <button
                v-if="userInfo.email"
                type="button"
                class="btn btn-link text-warning text-warning-u"
                @click="
                  editState = true;
                  showPanel = '邮箱';
                "
              >
                {{ $t("profileModifyEmailAddress") }}
              </button>
            </div>
            <div class="text-right text-black-50" v-if="userInfo.invited_code">
              {{ $t("profileInvitationCode") }}
            </div>
            <div v-if="userInfo.invited_code">{{ userInfo.invited_code }}</div>
            <div
              v-if="userInfo.user_device && userInfo.user_device.length > 0"
              class="text-right text-black-50"
            >
              {{ $t("profileExpireDate") }}
            </div>
            <div v-if="userInfo.user_device && userInfo.user_device.length > 0">
              <div v-for="(item, index) in userInfo.user_device" :key="index">
                <span v-if="item.expiration"
                  >{{ $t("profileDeviceId") }}:&nbsp;{{
                    item.did
                  }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                    item.expiration | formatDate
                  }}</span
                >
              </div>
            </div>
          </div>
          <!-- <div
            class="bg-white mb-3 border"
            v-if="userInfo.user_device && userInfo.user_device.length > 0"
          >
            <div style="padding: 28px 41px;">
              <div
                v-if="
                  !$config.useI18n ||
                    ($config.useI18n &&
                      langLocal === $config.languageDefine.zhCN)
                "
              >
                <Table
                  :columns="columns"
                  :data="userInfo.user_device"
                  :disabled-hover="true"
                  no-data-text="暂无数据"
                  tooltip-theme="light"
                ></Table>
              </div>
              <div>
                <Table
                  :columns="columnsEN"
                  :data="userInfo.user_device"
                  :disabled-hover="true"
                  no-data-text="No data"
                  tooltip-theme="light"
                ></Table>
              </div>
            </div>
          </div> -->
          <div class="bg-white mb-3 border usdt">
            <div class="text-black-50 text-right">
              {{ $t("profileUSDTAccount") }}
            </div>
            <div>
              {{ userInfo.rest_address }}
              <router-link class="text-black-50" to="/other/help"
                >({{ $t("profileWhatIsUSDT") }})</router-link
              >
              <button
                type="button"
                @click="open"
                class="btn btn-link text-warning text-warning-u"
              >
                {{ $t("profileextract") }}
              </button>
              <Modal
                class-name="modal"
                v-model="modal"
                :title="$t('profileUSDTReceivingAddress')"
                :mask-closable="false"
              >
                <Input
                  v-model="usdtAddress"
                  clearable
                  :placeholder="$t('profilePlsFillReceivingAddress')"
                />
                <h6 class="text-black-50 mt-1">
                  {{ $t("profileNoteToPreventCurrencyLoss") }}
                </h6>
                <div class="text-right mt-4">
                  <button
                    type="button"
                    class="btn btn-warning text-white"
                    @click="submit"
                  >
                    {{ $t("profilewithdraw") }}
                  </button>
                </div>
                <div
                  v-show="isOk"
                  class="text-center animated fadeIn faster tip"
                >
                  <div v-show="submitText">
                    <div style="font-size:16px">
                      {{ $t("profileSureWantWithdraw1")
                      }}{{ userInfo.rest }}USDT{{
                        $t("profileSureWantWithdraw2")
                      }}
                    </div>
                    <div>
                      <Button
                        class="ml-4"
                        size="large"
                        @click="modal = false"
                        style="height: 42px"
                        >{{ $t("commonCancel") }}
                      </Button>
                      <button
                        type="button"
                        class="btn btn-warning text-white ml-4"
                        @click="ok"
                      >
                        {{ $t("commonConfirm") }}
                      </button>
                    </div>
                  </div>
                  <div
                    v-show="submitResult"
                    class="mt-5 result"
                    style="font-size:18px"
                  >
                    <div v-show="submitSuccess">
                      <Icon
                        class="border border-warning rounded-circle mr-2"
                        type="ios-checkmark"
                        size="18"
                        color="#ff8b00"
                      />{{ $t("profileWithdrawalSuccess") }}
                    </div>
                    <div v-show="submitError">
                      <Icon
                        class="border border-dark rounded-circle mr-2"
                        type="ios-close"
                        size="18"
                        color="#000000"
                      />{{ $t("profileWithdrawalFailed") }}
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
            <div class="text-black-50 text-right">
              {{ $t("profileBalance") }}
            </div>
            <div>{{ userInfo.rest }} USDT</div>
          </div>
          <router-link to="/user/address">
            <div class="bg-white mb-5 border address">
              <span>{{ $t("profileShippingAddress") }}</span>
              <Icon type="ios-arrow-forward" color="#cfcccf" size="26" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <zrFooter />
  </div>
</template>

<script>
import AccountService from "@/service/account-service";
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrOptions from "@/components/user-options"; // 引入左侧导航选项卡
import zrEditing from "@/components/editing"; // 修改框
import CommonFunc from "@/utils/common";

export default {
  name: "userInfo",
  components: {
    zrHeader,
    zrFooter,
    zrOptions,
    zrEditing
  },
  data() {
    return {
      isLogin: CommonFunc.isLoginByCheck(),
      editState: false,
      showPanel: "",
      userInfo: {
        rest: 0
      },
      modal: false,
      usdtAddress: "",
      isOk: false, // 提现确认框
      submitText: true,
      submitResult: false,
      submitSuccess: false, // 提现成功反馈
      submitError: false, // 提现失败反馈
      columns: [
        {
          title: "DeviceID",
          tooltip: true,
          key: "did"
        },
        {
          title: "开通时间",
          tooltip: true,
          key: "activate_time"
        },
        {
          title: "到期时间",
          tooltip: true,
          key: "expiration"
        }
      ],
      columnsEN: [
        {
          title: "DeviceID",
          tooltip: true,
          key: "did"
        },
        {
          title: "Activate date",
          tooltip: true,
          key: "activate_time"
        },
        {
          title: "Expire date",
          tooltip: true,
          key: "expiration"
        }
      ]
    };
  },
  filters: {
    formatDate: function(val) {
      let resStr = "";
      if (val) {
        const array = val.split(" ");
        if (Array.prototype.isPrototypeOf(array) && array.length > 1) {
          resStr = array[0];
        } else {
          resStr = val;
        }
      }

      return resStr;
    }
  },
  created() {
    // this.fetchUserInfo();
  },
  computed: {
    langLocal() {
      this.fetchUserInfo();
      return this.$store.state.app.local;
    }
  },
  methods: {
    fetchUserInfo() {
      AccountService.getUserInfo()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.userInfo = res.data;
          }
        })
        .catch(error => {
          console.log("fetchUserInfo error", error);
        });
    },
    colseEdit(state) {
      console.log("colseEdit");
      this.fetchUserInfo();
      this.editState = state;
    },
    // 打开提现模态框
    open() {
      this.isOk = false;
      this.usdtAddress = "";
      if (this.userInfo.rest && _.toNumber(this.userInfo.rest) >= 20) {
        this.modal = true;
      } else {
        const that = this;
        // this.$Message.info("最少提现20usdt");
        CommonFunc.displayMessageTip(
          this.$t("profileAtLeast20USDT"),
          "info",
          that
        );
      }
    },
    // 提现按钮
    submit() {
      if (this.usdtAddress == "") {
        const that = this;
        // this.$Message.error("没有输入提现地址！");
        CommonFunc.displayMessageTip(
          this.$t("profilePlsFillWithdrawAddress"),
          "warning",
          that
        );
      } else {
        this.isOk = true;
      }
    },
    //确定提现
    ok() {
      // 再读一次用户数据
      AccountService.getUserInfo()
        .then(res1 => {
          if (res1.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.userInfo = res1.data;
            AccountService.getCash({
              amount: this.userInfo.rest,
              // amount: 20,
              address: this.usdtAddress
            })
              .then(res => {
                if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                  // console.log(res);
                  this.fetchUserInfo();
                  this.submitText = false;
                  this.submitResult = this.submitSuccess = true;
                }
              })
              .catch(error => {
                console.log(error);
                this.submitResult = this.submitError = true;
              });
            // 提现结果反馈
            setTimeout(() => {
              this.modal = this.isOk = false;
            }, 1300);
          } else {
            this.modal = this.isOk = false;
          }
        })
        .catch(error => {
          this.modal = this.isOk = false;
          console.log("fetchUserInfo error", error);
        });
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
.text-warning-u {
  color: #ff8b00 !important;
}
// 模态框
/deep/.modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    width: 50% !important;
    top: 0;
    .ivu-modal-content {
      padding: 30px 80px;
      .ivu-modal-header-inner {
        font-size: 20px;
        margin-top: 16px;
      }
      .ivu-modal-body {
        .ivu-input {
          padding: 22px 10px;
          font-size: 14px;
        }
        .btn,
        .ivu-btn {
          padding: 8px 30px;
          font-size: 16px;
          border-radius: 0.25rem;
        }
        .btn-warning {
          background-color: #ff8400;
          border-color: #ff8400;
        }
        .tip {
          background-color: white;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 75px;
          padding: 65px;
        }
      }
      .ivu-modal-footer {
        display: none;
      }
    }
  }
}

.user {
  background-color: #f9f9f9;
  .container {
    padding-bottom: 158px;
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
      .info,
      .usdt,
      .address {
        padding: 28px 41px;
        word-break: break-all;
      }
      .info,
      .usdt {
        display: grid;
        grid-template-columns: 100px auto;
        row-gap: 15px;
        column-gap: 16px;
        .btn {
          padding: 0;
        }
      }
      .address {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:hover {
          color: #ff8b00;
        }
      }
    }
  }
}

/* 小于等于 769px */
@media (max-width: 767px) {
  /deep/.modal {
    .ivu-modal {
      width: 88% !important;
      .ivu-modal-content {
        padding: 0 !important;
        .tip {
          padding: 40px !important;
        }
      }
    }
  }
  .container {
    padding-bottom: 0 !important;
    .title {
      .english {
        font-size: 40px !important;
      }
      .chinese {
        font-size: 20px !important;
      }
    }
    .right {
      .info {
        margin-top: 20px;
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
