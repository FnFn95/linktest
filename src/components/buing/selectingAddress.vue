<template>
  <div class="selecting-address">
    <Modal
      v-model="states"
      class-name="selectin-modal"
      :mask-closable="false"
      @on-cancel="close"
    >
      <div slot="header">
        <span style="font-size:16px">{{ $t('addressShippingAddress') }}</span>
        <span class="text-black-50">({{ $t('addressOnlyAddThreeAddresses') }})</span>
        <div class="ment">
          <Icon
            type="md-sync"
            size="18"
            :title="$t('addressRefreshShippingAddress')"
            class="mr-3 cursor-link-color"
            style="cursor: pointer;"
            @click="update"
          />
          <router-link target="_blank" to="/user/address"
            >{{ $t('addressManageMyAddress') }}</router-link
          >
        </div>
      </div>
      <p slot="close">
        <a @click="closeModal"><i class="ivu-icon ivu-icon-ios-close"></i></a>
      </p>
      <div v-if="address.length == 0" class="text-center text-black-50 mt-3">
        {{ $t('addressClickToAddAddress') }}
      </div>
      <RadioGroup v-model="addressCurrent" vertical @on-change="selelcting">
        <Radio v-for="(item, index) in address" :key="index" :label="item.id">
          <span>{{ item.name }}，{{ item.mobile }}</span>
          <div class="ml-4">{{ item.address }}</div>
        </Radio>
      </RadioGroup>
      <div slot="footer" class="text-center">
        <Button class="mt-4" size="large" @click="close">{{ $t("commonCancel") }}</Button>
        <Button class="mt-4" type="warning" size="large" @click="ok"
          >{{ $t('addressSelect') }}</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonFunc from "@/utils/common";

export default {
  name: "selectingAddress",
  props: {
    states: {
      type: Boolean,
      default: false
    },
    address: {
      type: Array,
      default: []
    },
    currentAddressId: {
      type: [String, Number],
      default: -1
    }
  },
  watch: {
    states: {
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log("address newVal", newVal);
          let isClearAddr = true;
          if (this.address && !CommonFunc.isEmptyArray(this.address)) {
            if (this.address.length == 1) {
              if (this.address[0].hasOwnProperty("id")) {
                this.addresing = this.address[0];
                this.addressCurrent = this.address[0].id;
                isClearAddr = false;
                // console.log("address", this.addressCurrent);
              }
            } else {
              // console.log("111 currentAddressId", this.currentAddressId);
              if (this.currentAddressId != -1) {
                this.addressCurrent = this.currentAddressId.toString();
                this.selelcting(this.addressCurrent);
                isClearAddr = false;
              }
            }
          }
          if (isClearAddr) {
            this.addressCurrent = "";
            this.addresing = {};
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      addressCurrent: "",
      addresing: {}
    };
  },
  methods: {
    selelcting(id) {
      for (let i = 0; i < this.address.length; i++) {
        if (this.address[i].id == id) {
          this.addresing = this.address[i];
          break;
        }
      }
    },
    update() {
      this.$emit("update");
    },
    ok() {
      // console.log("ok", this.addresing);
      if (
        this.address &&
        !CommonFunc.isEmptyArray(this.address) &&
        this.address.length == 1
      ) {
        this.$emit("close", false);
      } else {
        if (JSON.stringify(this.addresing) != "{}") {
          this.$emit("yes", false, this.addresing);
        } else {
          // this.$Message.error("没有选择地址，邮到哪里呢？");
          const that = this;
          CommonFunc.displayMessageTip(this.$t('homeNoAddress'), 'warning', that);
        }
      }
    },
    close() {
      this.$emit("close", false);
    },
    closeModal() {
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.selectin-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
    .ivu-modal-body {
      .ivu-radio-group-vertical {
        width: 100%;
        word-wrap: break-word;
        .ivu-radio-wrapper {
          height: auto;
          line-height: 24px;
          font-size: 16px;
          margin-bottom: 20px;
          white-space: normal;
          .ivu-radio-inner {
            border-color: #ff8400;
            &::after {
              background-color: #ff8400;
            }
          }
        }
      }
    }
    .ivu-modal-footer {
      border-top: none;
      .ivu-btn {
        padding: 8px 30px;
        font-size: 16px;
        height: 42px;
        border-radius: .25rem;
      }
      .ivu-btn-warning {
        background-color: #ff8400 !important;
        border-color: #ff8400 !important;
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
      max-height: 80vh;
      overflow-y: auto;
      .ivu-modal-header {
        border-bottom: none;
        .ment {
          float: right;
        }
      }
    }
  }
}
//手机端时：
@media (max-width: 767px) {
  /deep/.ivu-modal-content {
    padding: 0 !important;
    max-height: 80vh;
    overflow-y: auto;
    .ivu-modal-header {
      .ment {
        margin-top: 16px;
        text-align: right;
      }
    }
  }
}
</style>
