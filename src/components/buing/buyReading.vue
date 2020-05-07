<template>
  <div class="buy-reading">
    <Modal
      v-model="states"
      class-name="reading-modal"
      :mask-closable="false"
      @on-cancel="close"
      scrollable
    >
      <p slot="header" class="text-center" style="font-size: 16px;">
        {{ title }}
      </p>
      <p slot="close">
        <a @click="closeModal"><i class="ivu-icon ivu-icon-ios-close"></i></a>
      </p>
      <div>
        <p v-html="content"></p>
        <Radio class="mt-3" v-model="argreenment">
          <span :class="[argreenment ? 'text-dark' : 'text-black-50']"
            >{{ $t("homeReadAndAgree") }}{{ title }}</span
          >
        </Radio>
      </div>
      <div slot="footer" class="text-center">
        <Button
          :class="[argreenment ? 'argreenment' : '']"
          type="warning"
          size="large"
          :disabled="argreenment ? false : true"
          @click="Iargreenment"
          >{{ $t("homeAgree") }}</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonService from "@/service/common-service"; // 调接口依赖项

export default {
  name: "buyReading",
  props: {
    states: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "说明"
    },
    content: {
      type: String,
      default: "暂无"
    }
  },
  data() {
    return {
      // content: "",
      argreenment: false // true：同意协议
    };
  },
  watch: {
    states(newVal, oldVal) {
      if (newVal) {
        this.argreenment = false;
      }
    },
    title(newVal, oldVal) {},
    content(newVal, oldVal) {}
  },
  methods: {
    Iargreenment() {
      // this.argreenment = false;
      this.$emit("yes", false);
    },
    close() {
      // this.argreenment = false;
      this.$emit("close", false);
    },
    closeModal() {
      // this.argreenment = false;
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.reading-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal-body {
    .ivu-radio-inner {
      border-color: #ff8400;
      &::after {
        background-color: #ff8400;
      }
    }
  }
  .ivu-modal-footer {
    border-top: none;
    .ivu-btn {
      padding: 8px 55px;
      font-size: 16px;
    }
    .argreenment {
      background-color: #ff8400 !important;
      border-color: #ff8400 !important;
    }
  }
}
// 大屏时：
@media (min-width: 768px) {
  /deep/.ivu-modal {
    width: 50% !important;
    top: 0;
    .ivu-modal-content {
      padding: 30px 80px;
      max-height: 80vh;
      overflow-y: auto;
      .ivu-modal-header {
        border-bottom: none;
      }
    }
  }
}

//手机端时：
@media (max-width: 767px) {
  /deep/ .ivu-modal {
    top: auto;
    .ivu-modal-content {
      padding: 0 !important;
      max-height: 80vh;
      overflow-y: auto;
    }
  }
}
</style>
