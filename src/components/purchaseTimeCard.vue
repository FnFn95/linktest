<template>
  <div class="grant">
    <Modal v-model="state" class-name="grant-modal" :mask-closable="false">
      <p slot="close">
        <a @click="closeModal"><i class="ivu-icon ivu-icon-ios-close"></i></a>
      </p>
      <div class="grant-box">
        <h3 class="mb-4">{{ $t('renewalsNavTitle') }}</h3>
        <Form :label-width="120">
          <FormItem :label="$t('openDeviceId')">
            <Input
              autofocus
              v-model="boxId"
              clearable
              :placeholder="$t('homePlsEnterDeviceID')"
              @on-blur="trimInputData"
            />
          </FormItem>
          <FormItem :label="$t('homeAccountBalance')">
            <span>{{ userRest }} USDT</span>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="text-center">
        <Button class="mt-4" type="warning" size="large" @click="onBuy"
          >{{ $t("buyItNow") }}</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonFunc from "@/utils/common";

export default {
  name: "grant",
  props: {
    state: {
      type: Boolean,
      default: false
    },
    userRest: {
      type: String,
      default: "0"
    }
  },
  watch: {
    userRest(newVal, oldVal) {},
    state(newVal, oldVal) {
      if (newVal) {
        this.boxId = "";
      }
    }
  },
  data() {
    return {
      boxId: ""
    };
  },
  methods: {
    onBuy() {
      const that = this;
      this.trimInputData();
      if (this.boxId) {
        this.$emit("purchaseTimeOrder", this.boxId);
      } else {
        CommonFunc.displayMessageTip(this.$t("homePlsEnterDeviceID"), "warning", that);
      }
    },
    closeModal() {
      this.boxId = "";
      this.$emit("closeModal");
    },
    trimInputData(typeName = "") {
      if (this.boxId) {
        this.boxId = this.boxId.replace(/\s+/g, "");
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-modal-mask{
  z-index: 1 !important;
}
/deep/.grant-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
    .ivu-modal-content {
      max-height: 40vh;
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

// 大屏时：
@media (min-width: 768px) {
  /deep/ .ivu-modal {
    width: 50% !important;
    .ivu-modal-content {
      padding: 30px 80px;
      .buing-body {
        grid-template-columns: 82px 80%;
      }
      .ivu-modal-header {
        border-bottom: none;
      }
    }
  }
}
//手机端时：
@media (max-width: 767px) {
  /deep/.ivu-modal-content {
    padding: 0 !important;
    .buing-body {
      grid-template-columns: 82px 70%;
    }
  }
}
</style>
