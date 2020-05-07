<template>
  <div>
    <Modal
      class="zr-pic-verification"
      v-model="isShow"
      class-name="buy-modal"
      :width="width"
      :mask-closable="false"
      :closable="false"
      :footer-hide="true"
    >
      <div v-show="!isSuccess">
        <p
          slot="header"
          style="color:rgba(255,255,255,1);font-size:16px;font-family:Microsoft YaHei;font-weight:400;"
        >
          <span>{{ title }}</span>
        </p>
        <p slot="close">
          <a
            @click="closeModal"
            style="float: right;height:2rem;width: 2rem;font-size: 24px;margin-top:-2rem;"
            ><i class="ivu-icon ivu-icon-ios-close"></i
          ></a>
        </p>
      </div>
      <div v-show="isSuccess" class="buing-result text-center">
        <div class="success">
          <Icon
            type="md-checkmark"
            color="#ff8b00"
            size="18"
            class="mr-2 rounded-circle border border-warning"
          />购买成功
        </div>
        <div style="height: 3rem;"></div>
        <!-- <div v-show="!isSuccess" class="success">
          <Icon
            type="ios-alert-outline"
            size="18"
            class="mr-2 rounded-circle font-weight-bold"
          />
          {{ errorText }}
          <div class="mt-3 text-center">
            <router-link class="text-warning" to="/other/help"
              >点击获取充值方式</router-link
            >
          </div>
          <div style="height: 3rem;"></div>
        </div> -->
      </div>
      <div v-show="!isSuccess" class="buing-fail-result text-center">
        <div class="success">
          <Icon
            type="ios-alert-outline"
            size="18"
            class="mr-2 rounded-circle font-weight-bold"
          />
          {{ errorText }}
          <div class="mt-3 text-center">
            <router-link class="under-line-q" to="/other/help"
              >点击获取充值方式</router-link
            >
          </div>
          <div style="height: 3rem;"></div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonFunc from "@/utils/common";
// import CommonService from "@/service/common-service";
export default {
  name: "zr-enquire-modal",
  props: {
    width: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: "标题"
    },
    isShow: {
      type: Boolean,
      default: false
    },
    isSuccess: {
      type: Boolean,
      default: true
    },
    errorText: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: "询问"
    },
    btnType: {
      type: String,
      default: "0"
    }
  },
  watch: {
    isShow: {
      deep: true,
      handler(newData) {
        if (newData) {
        }
      }
    },
    content(newVal, oldVal) {
      // console.log("content", newVal);
    },
    btnType(newVal, oldVal) {
      // console.log("btnType", newVal);
    }
  },
  data() {
    return {
      codeId: "", //验证码序列号
      codeUrl: "../../assets/img/u12128.png", //图形验证码
      verificationCodeFake: "", // 测试数据
      btnClickFlag: false, // 是否点击了确定按钮的标记
      formValidate: {
        verificationCode: ""
      },
      ruleValidate: {
        verificationCode: [
          {
            required: true,
            min: 4,
            max: 4,
            message: "验证码输入格式不正确",
            trigger: "blur"
          }
          // { validator: validVerificationCode, trigger: "change" }
        ]
      }
    };
  },
  created() {},
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
    closeModal(v) {
      this.$emit("onCancel");
    }
  }
};
</script>
<style lang="less">
.zr-pic-verification {
  .ivu-modal-header {
    border: none;
  }
}
</style>
<style lang="less" scoped>
  .under-line-q{
    text-decoration:underline;
    color: #ff8400;
    font-size: 14px;
  }
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
          height: 4rem;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .buing-fail-result {
          height: 6rem;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
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
</style>
