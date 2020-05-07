<template>
  <div class="grant" v-if="hackReset">
    <Modal v-model="state" class-name="grant-modal" :mask-closable="false">
      <p slot="close">
        <a @click="closeModal"><i class="ivu-icon ivu-icon-ios-close"></i></a>
      </p>
      <div v-show="grantStepCurrent == 1" class="grant-box">
        <h3 class="mb-4">{{ $t("homeActivateDevice") }}</h3>
        <Form :label-width="100" ref="formValidate" :rules="ruleValidate">
          <FormItem
            prop="boxId"
            v-for="(item, index) in grantArray"
            :key="index"
            :label="$t('openDeviceId')"
          >
            <Input
              autofocus
              @on-keyup.enter="addBoxId"
              @on-blur="blurInputData(index)"
              @on-clear="clearInputData(index)"
              v-model="item.boxId"
              clearable
              :placeholder="$t('homePlsEnterDeviceID')"
            />
          </FormItem>
        </Form>
        <div
          @click="addBoxId"
          style="cursor: pointer;width: 12rem;"
          class="cursor-link-color"
        >
          <Icon
            type="ios-add-circle-outline"
            size="18"
            class="font-weight-bold mr-2 cursor-link-color"
          />{{ $t("homeAddDeviceID") }}
        </div>
      </div>
      <div class="animated fadeIn fast" v-show="grantStepCurrent == 2">
        <h3 class="mb-4">{{ $t("homeActivateDevice") }}</h3>
        <div
          class="grant-result mb-3"
          v-for="(item, index) in grantList"
          :key="index"
        >
          <div class="text-left" style="width:48%">
            <span class="text-muted">{{ $t("openDeviceId") }}</span>
            {{ item.did }}
          </div>
          <div class="text-left" style="width:48%">
            <span v-if="!item.password || item.is_success != 1">
              {{ item.error_msg }}
            </span>
            <span v-else>
              <span class="text-muted">Password{{ $t("commonColon") }}</span>
              {{ item.password }}
            </span>
          </div>
        </div>
      </div>
      <div class="animated fadeIn fast" v-show="grantStepCurrent == 3">
        <h3 class="text-center mb-4">
          <Icon
            type="md-checkmark"
            color="#ff8b00"
            size="18"
            class="mr-2 border rounded-circle border border-warning"
          />{{ $t("loginActivationSucceeded") }}
        </h3>
        <div>
          {{ $t("loginDeadline") }}{{ $t("commonColon")
          }}{{ grantDueTime | formatDate }}
        </div>
        <div>
          {{ $t("loginYourInvitationCode") }}{{ $t("commonColon")
          }}{{ grantInvitedCode }}
        </div>
        <div class="text-black-50 mt-2">
          {{ $t("loginSendInvitationCode") }}
        </div>
      </div>
      <div slot="footer" class="text-center">
        <Button
          v-show="grantStepCurrent == 1"
          class="mt-4"
          type="warning"
          size="large"
          @click="grant"
          >{{ $t("opening") }}</Button
        >
        <Button
          v-show="grantStepCurrent == 2"
          class="mt-4"
          type="warning"
          size="large"
          @click="grantOk"
          >{{ $t("commonConfirm") }}</Button
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
    grantArray: {
      type: Array,
      default: []
    },
    grantList: {
      type: Array,
      default: []
    },
    grantStep: {
      type: [Number, String],
      default: 1
    },
    grantInvitedCode: {
      type: String,
      default: ""
    },
    grantDueTime: {
      type: String,
      default: ""
    },
    hackReset: Boolean
  },
  watch: {
    state(newVal, oldVal) {
      if (newVal) {
        this.currentInputIndex = -1;
        this.checkResultArray = [];
        this.checkResultArray[0] = 1;
      }
    },
    grantStep(newVal, oldVal) {
      this.grantStepCurrent = newVal;
    },
    grantList(newVal, oldVal) {},
    grantInvitedCode(newVal, oldVal) {},
    grantDueTime(newVal, oldVal) {},
    hackReset: {
      deep: true,
      handler(val) {
        // console.log("%c watch hackReset", "color:#f00;", val);
      }
    }
  },
  data() {
    const validBoxId = (rule, value, callback) => {
      // console.log("validBoxId");
      const idx = this.currentInputIndex;
      const boxIdValueTmp = this.grantArray[idx].boxId;
      if (!boxIdValueTmp) {
        this.checkResultArray[idx] = 1;
        callback();
      }
      // console.log("validBoxId 00", boxIdValueTmp);
      if (!boxIdValueTmp.replace(/\s+/g, "")) {
        this.checkResultArray[idx] = 1;
        callback();
      }
      const regexp = /^[A-Za-z0-9]+$/; // 规则：字母和数字组合

      // console.log("validBoxId value", boxIdValueTmp);
      if (boxIdValueTmp.match(regexp)) {
        // console.log("validBoxId 11");
        this.checkResultArray[idx] = 1;
        callback();
      } else {
        // console.log("validBoxId 22");
        this.checkResultArray[idx] = 0;
        callback(new Error(this.$t("homeDeviceIDFormatIncorrect")));
      }
    };
    return {
      grantStepCurrent: 1,
      grantBox: true,
      grantResult: false,
      trantReading: false,
      currentInputIndex: -1,
      checkResultArray: [1],
      ruleValidate: {
        boxId: [{ validator: validBoxId, trigger: "blur" }]
      }
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
  created() {},
  methods: {
    addBoxId() {
      if (this.grantArray.length > 0) {
        this.checkResultArray[this.grantArray.length - 1] = 1;
      }
      // console.log("addBoxId checkResultArray", this.checkResultArray);
      this.$emit("addBoxId", this.grantArray);
    },
    grant() {
      const that = this;
      let resFormat = true;
      // console.log("grant checkResultArray", this.checkResultArray);

      let res = false;
      let grantArrayNotEmpty = [];
      for (let index = 0; index < this.grantArray.length; index++) {
        const element = this.grantArray[index];
        if (element.boxId != "") {
          res = true;
          // break;
          grantArrayNotEmpty.push(element);
        }
      }
      if (res) {
        for (let index = 0; index < this.checkResultArray.length; index++) {
          const element = this.checkResultArray[index];
          if (element == 0) {
            resFormat = false;
            break;
          }
        }
        if (!resFormat) {
          CommonFunc.displayMessageTip(
            this.$t("homePlsEnterDeviceIDCorrectFormat"),
            "warning",
            that
          );
          return false;
        }
        this.$emit("grant", grantArrayNotEmpty);
        // this.grantBox = false;
        // this.grantResult = true;
      } else {
        CommonFunc.displayMessageTip(
          this.$t("homePlsEnterAtLeastOneDeviceID"),
          "warning",
          that
        );
      }
    },
    grantOk() {
      // this.grantResult = false;
      // this.trantReading = true;
      this.$emit("grantOk");
    },
    closeModal() {
      this.currentInputIndex = -1;
      this.checkResultArray = [];
      this.checkResultArray[0] = 1;
      // this.handleReset("formValidate");
      this.$emit("closeModal");
    },
    clearInputData(i) {
      this.currentInputIndex = i;
      this.checkResultArray[i] = 1;
      this.$refs.formValidate.validateField("boxId", error => {
        if (!error) {
        }
      });
    },
    blurInputData(i) {
      console.log("blurInputData i", i);
      this.currentInputIndex = i;
    },
    handleReset(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-modal-mask {
  z-index: 1 !important;
}
/deep/.grant-modal {
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
