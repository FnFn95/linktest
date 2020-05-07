<template>
  <div class="input-group numbering">
    <!-- <button class="btn">-</button>
    <input type="text">
    <button class="btn">+</button>-->
    <div class="input-group-prepend" @click="reduce">
      <span class="input-group-text">-</span>
    </div>
    <Input
      v-model="number"
      size="large"
      class="form-control text-center"
      @on-keyup="number = checkInput(number)"
    />
    <!-- @on-change="changeNumber" -->
    <div class="input-group-append" @click="adding">
      <span class="input-group-text">+</span>
    </div>
  </div>
</template>

<script>
import CommonFunc from "@/utils/common";

export default {
  name: "numbering",
  props: {
    itemId: {
      type: String,
      default: ""
    },
    stock: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      number: 1
    };
  },
  watch: {
    itemId(newVal, oldVal) {}
  },
  methods: {
    adding() {
      // console.log(this.stock);
      if (_.toNumber(this.number) < _.toNumber(this.stock)) {
        this.number++;
        this.$emit("adding", this.number, this.itemId);
      } else {
        const that = this;
        // this.$Message.info("最大库存已被您承包");
        CommonFunc.displayMessageTip(this.$t("commonNotStock"), "info", that);
      }
    },
    reduce() {
      if (_.toNumber(this.number) > 1) {
        this.number--;
        this.$emit("reduce", this.number, this.itemId);
      } else {
        this.$emit("prohibitZero");
      }
    },
    checkInput(val) {
      // console.log("checkInput", val);
      const regPos = /^\d+$/; // 非负整数
      if (regPos.test(val)) {
        this.$emit("change", val, this.itemId);
        return val;
      } else {
        this.$emit("prohibitZero");
        return 1;
      }
    },
    changeNumber() {
      // console.log("changeNumber");
      if (_.toNumber(this.number) > 1) {
        this.$emit("change", this.number, this.itemId);
      } else {
        this.$emit("prohibitZero");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.input-group {
  width: 100px;
  .input-group-text,
  .form-control {
    height: 45px;
    cursor: pointer;
  }
  /deep/.form-control {
    padding: 3px;
    .ivu-input {
      outline: none;
      border: none;
      box-shadow: none;
      text-align: center;
    }
  }
}
</style>
