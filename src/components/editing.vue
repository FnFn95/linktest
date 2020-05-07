<template>
  <div v-if="state" class="editing">
    <div class="animated zoomIn faster model">
      <div class="row mr-0 ml-0 panel">
        <Icon type="ios-close" size="30" class="cursor-link" @click="close" />
        <div class="col-12 col-sm-5"></div>
        <div class="col-12 col-sm-7">
          <!-- 重置密码 -->
          <div v-if="show == '密码'" class="form">
            <h1 class="mb-4" style="font-size:26px">
              {{ $t("loginResetPassword") }}
            </h1>
            <Form
              ref="formValidate"
              :model="formValidatePasswd"
              :rules="ruleValidate"
            >
              <FormItem prop="mailAddress">
                <Input
                  v-model="formValidatePasswd.mailAddress"
                  prefix="ios-mail"
                  :placeholder="$t('loginPlsEnterEmail')"
                  clearable
                  @on-blur="trimInputData('mailAddress')"
                  @on-clear="clearEmailInputByResetPasswd"
                >
                <img src="../assets/images/icons/email.png" alt="" slot="prefix">
                </Input>
              </FormItem>
              <FormItem prop="verificationCode" class="verification-code">
                <Input
                  style="width:50%"
                  v-model="formValidatePasswd.verificationCode"
                  prefix="md-mail-open"
                  :placeholder="$t('loginPlsEnterVerificationCode')"
                  clearable
                  @on-blur="trimInputData('verificationCode')"
                  @on-clear="clearCodeInputByResetPasswd"
                >
                <img src="../assets/images/icons/invitation.png" alt="" slot="prefix">
                </Input>
                <!-- <Button
                  :disabled="verificationCodePasswordBTN"
                  class="rounded-pill text-white"
                  type="primary"
                  @click="getVerificationCodePassword"
                >{{ verificationPasswordText }}</Button> -->
                <Button
                  v-show="btnShow"
                  class="rounded-pill text-white"
                  type="primary"
                  @click="onSendVerificationCode"
                  >{{ verificationPasswordText }}</Button
                >
                <Button
                  v-show="!btnShow"
                  class="rounded-pill text-white"
                  type="primary"
                  disabled
                  >{{ $t("loginAfterSeconds1") }}{{ count
                  }}{{ $t("loginAfterSeconds2") }}</Button
                >
              </FormItem>
              <FormItem prop="passwdNew">
                <!-- <Input
                  v-model="formValidatePasswd.passwdNew"
                  prefix="ios-key"
                  placeholder="请输入密码"
                  clearable
                /> -->
                <zr-input
                  type="password"
                  password
                  v-model="formValidatePasswd.passwdNew"
                  :placeholder="$t('loginPlsEnterPassword')"
                  prefix="ios-key"
                  @on-blur="trimInputData('passwdNew')"
                  @copy.native.capture.prevent="handleInputCopy"
                  @paste.native.capture.prevent="handleInputPaste"
                >
                <img src="../assets/images/icons/password.png" alt="" slot="prefix">
                </zr-input>
              </FormItem>
              <FormItem prop="passwdCheck">
                <!-- <Input
                  v-model="formValidatePasswd.passwdCheck"
                  prefix="ios-key"
                  placeholder="请确认密码"
                  clearable
                /> -->
                <zr-input
                  type="password"
                  password
                  v-model="formValidatePasswd.passwdCheck"
                  :placeholder="$t('loginPlsEnterPasswordAgain')"
                  prefix="ios-key"
                  @on-blur="trimInputData('passwdCheck')"
                  @copy.native.capture.prevent="handleInputCopy"
                  @paste.native.capture.prevent="handleInputPaste"
                >
                <img src="../assets/images/icons/password.png" alt="" slot="prefix">
                </zr-input>
              </FormItem>
              <FormItem class="text-center mb-0">
                <Button
                  class="rounded-pill"
                  type="warning"
                  :disabled="isBtnDisabled"
                  @click="editPassword('formValidate')"
                  >{{ $t("commonConfirm") }}</Button
                >
              </FormItem>
            </Form>
          </div>
          <!-- 修改邮箱 -->
          <div v-else-if="show == '邮箱'" class="form">
            <h1 class="mb-4" style="font-size:26px">
              {{ $t("loginChangeEmail") }}
            </h1>
            <Form :model="emailForms">
              <FormItem prop="mailAddress"
                >
                <Input
                  v-model="emailForms.mailAddress"
                  prefix="ios-mail"
                  :placeholder="$t('loginPlsEnterEmail')"
                  clearable
              >
              <img src="../assets/images/icons/email.png" alt="" slot="prefix">
                </Input>
              </FormItem>
              <FormItem prop="verificationCode" class="verification-code">
                <Input
                  style="width:50%"
                  v-model="emailForms.verificationCode"
                  prefix="md-mail-open"
                  :placeholder="$t('loginPlsEnterVerificationCode')"
                  clearable
                >
                <img src="../assets/images/icons/invitation.png" alt="" slot="prefix">
                </Input>
                <Button
                  :disabled="verificationCodeEmailBTN"
                  class="rounded-pill text-white"
                  type="primary"
                  @click="getVerificationCodeEmail"
                  >{{ verificationEmailText }}</Button
                >
              </FormItem>
              <FormItem class="text-center mb-0"
                ><Button
                  class="rounded-pill"
                  type="warning"
                  @click="editEmail"
                  >{{ $t("commonConfirm") }}</Button
                ></FormItem
              >
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonFunc from "@/utils/common";
import CommonService from "@/service/common-service";
import AccountService from "@/service/account-service";
import ZrInput from "@/components/my-iview/components/input/input"; // 重写input组件，1、eye状态取反，2、更换eye图标

export default {
  name: "editing",
  components: { ZrInput },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    show: {
      type: String
    }
  },
  data() {
    // 邮箱校验规则
    const validUserEmail = (rule, value, callback) => {
      if (this.isEmailError) {
        const msg = this.errorEmailMsg;
        callback(new Error(msg));
      } else {
        callback();
      }
    };
    // 验证码规则
    const validVerificationCode = (rule, value, callback) => {
      if (this.isVerificationCodeError) {
        const msg = this.errorCodeMsg;
        callback(new Error(msg));
      } else {
        this.trimInputData("verificationCode");
        if (
          this.formValidatePasswd.verificationCode &&
          this.formValidatePasswd.verificationCode.length === 6
        ) {
          callback();
        } else {
          const msg = this.$t("loginVerificationCodeFormatIncorrect");
          callback(new Error(msg));
        }
      }
    };
    // 新密码校验规则
    const validNewPasswd = (rule, value, callback) => {
      if (!value.replace(/\s+/g, "")) {
        this.trimInputData("passwdNew");
        callback(new Error(this.$t("loginPlsEnterNewPassword")));
      } else {
        this.trimInputData(); // 去除空格
        const regexp = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/; // 密码规则：8-16位字符，必须由字母和数字组合
        const passwdNew = this.formValidatePasswd.passwdNew;
        const passwdCheck = this.formValidatePasswd.passwdCheck;

        if (passwdNew.match(regexp)) {
          callback();
        } else {
          callback(new Error(this.$t("loginPasswordFormatIncorrect")));
        }
      }
    };
    // 确认密码校验规则
    const validCheckPasswd = (rule, value, callback) => {
      if (!value.replace(/\s+/g, "")) {
        this.trimInputData("passwdCheck");
        callback(new Error(this.$t("loginPlsPasswordAgain")));
      } else {
        this.trimInputData(); // 去除空格
        const regexp = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/; // 密码规则：8-16位字符，必须由字母和数字组合

        const passwdNew = this.formValidatePasswd.passwdNew;
        const passwdCheck = this.formValidatePasswd.passwdCheck;

        if (passwdNew.match(regexp)) {
          if (passwdCheck) {
            if (passwdNew === passwdCheck) {
              callback();
            } else {
              callback(new Error(this.$t("loginPlsTwiceInconsistent")));
            }
          } else {
            callback(new Error(this.$t("loginPlsPasswordAgain")));
          }
        } else {
          callback(new Error(this.$t("loginPasswordFormatIncorrect")));
        }
      }
    };
    // 确认密码校验规则
    // const validCheckPasswd = (rule, value, callback) => {
    //   if (!value.replace(/\s+/g, "")) {
    //     this.trimInputData("passwdCheck");
    //     callback("请再次输入新密码");
    //   } else {
    //     this.trimInputData(); // 去除空格
    //     const passwdCurr = this.formValidatePasswd.passwdNew;
    //     const passwdCheck = this.formValidatePasswd.passwdCheck;

    //     if (passwdCheck) {
    //       if (passwdCurr === passwdCheck) {
    //         callback();
    //       } else {
    //         callback(new Error("两次输入的密码不一致"));
    //       }
    //     } else {
    //       callback(new Error("请确认密码"));
    //     }
    //   }
    // };
    return {
      btnShow: true,
      isBtnDisabled: false,
      isEmailError: false,
      isVerificationCodeError: false,
      errorEmailMsg: "",
      errorCodeMsg: "",
      count: "",
      timer: null,
      verificationPasswordText: this.$t("loginGetVerificationCode"),
      verificationEmailText: this.$t("loginGetVerificationCode"),
      passwordTimer: null,
      emailTimer: null,
      conutDownPassword: 60,
      conutDownEmail: 60,
      verificationCodePasswordBTN: false,
      verificationCodeEmailBTN: false,
      // 修改密码的表单
      formValidatePasswd: {
        mailAddress: "",
        verificationCode: "",
        passwdNew: "",
        passwdCheck: ""
      },
      //修改邮箱
      emailForms: {
        mailAddress: "",
        verificationCode: ""
      },
      ruleValidate: {
        mailAddress: [
          {
            required: true,
            max: 254,
            // message: "请输入正常接收邮件的邮箱，设置生效需通过验证",
            // message: this.langLocal != 'en-US' ? '请输入正常接收邮件的邮箱，设置生效需通过验证' : 'email format error',
            message: this.$t("loginPlsEnterNormallyEmailAdress"),
            trigger: "blur"
          },
          {
            type: "email",
            // message: "请输入正常接收邮件的邮箱，设置生效需通过验证",
            // message: this.langLocal != 'en-US' ? '请输入正常接收邮件的邮箱，设置生效需通过验证' : 'email format error',
            message: this.$t("loginPlsEnterNormallyEmailAdress"),
            trigger: "blur"
          },
          { validator: validUserEmail, trigger: "blur" }
        ],
        verificationCode: [
          {
            required: true,
            // min: 6,
            // max: 6,
            message: this.$t("loginPlsEnterVerificationCode"),
            trigger: "blur"
          },
          { validator: validVerificationCode, trigger: "blur" }
        ],
        passwdNew: [
          {
            required: true,
            message: this.$t("loginPlsEnterPassword"),
            trigger: "blur"
          },
          { validator: validNewPasswd, trigger: "blur" }
        ],
        passwdCheck: [
          {
            required: true,
            message: this.$t("loginPlsEnterPasswordAgain"),
            trigger: "blur"
          },
          { validator: validCheckPasswd, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // 密码 - 到点清除定时器
    /*  conutDownPassword(now, old) {
       console.log(now, old);
      if (this.conutDownPassword < 0) {
        clearInterval(this.passwordTimer);
        this.conutDownPassword = 60;
        this.verificationPasswordText = "获取验证码";
        localStorage.removeItem("password_email");
        localStorage.removeItem("password_timer");
        this.verificationCodeEmailBTN = false;
      } else {
        console.log(localStorage.getItem("password_timer"));
        console.log(this.conutDownPassword);
      }
    }, */
    // 邮箱 - 到点清除定时器
    conutDownEmail(now, old) {
      console.log(now, old);
      if (now < 1) {
        clearInterval(this.emailTimer);
        localStorage.removeItem("email_email");
        localStorage.removeItem("email_timer");
        this.conutDownEmail = 60;
        this.verificationEmailText = this.$t("loginGetVerificationCode");
        this.verificationCodeEmailBTN = false;
      } /*  else {
        console.log(localStorage.getItem("email_timer"));
        console.log(this.conutDownEmail);
      } */
    },
    state(newVal, oldVal) {
      if (newVal) {
        this.initFormFields();
        this.handleReset("formValidate");
        // 修改邮箱
        if (localStorage.getItem("email_timer")) {
          this.emailForms.mailAddress = localStorage.getItem("email_email");
        } else {
          this.emailForms.mailAddress = "";
          this.emailForms.verificationCode = "";
        }
      }
    }
  },
  mounted() {
    // 修改密码
    /* if (localStorage.getItem("password_timer")) {
      this.formValidatePasswd.mailAddress = localStorage.getItem(
        "password_email"
      );
      this.verificationCodeEmailBTN = true;
      this.conutDownPassword = localStorage.getItem("password_timer");
      this.passwordTimer = setInterval(() => {
        this.conutDownPassword--;
        this.verificationPasswordText = `${this.conutDownPassword}秒后再次获取`;
        localStorage.setItem("password_timer", this.conutDownPassword);
        localStorage.setItem(
          "password_email",
          this.formValidatePasswd.mailAddress
        );
      }, 1000);
    } */

    // 修改邮箱
    if (localStorage.getItem("email_timer")) {
      this.emailForms.mailAddress = localStorage.getItem("email_email");
      this.emailForms.verificationCode == "";
      this.verificationCodeEmailBTN = true;
      this.conutDownEmail = localStorage.getItem("email_timer");
      this.emailTimer = setInterval(() => {
        this.conutDownEmail--;
        this.verificationEmailText = `${this.$t("loginAfterSeconds1")}${
          this.conutDownEmail
        }${this.$t("loginAfterSeconds2")}`;
        localStorage.setItem("email_timer", this.conutDownEmail);
        localStorage.setItem("email_email", this.emailForms.mailAddress);
      }, 1000);
    }
  },
  computed: {
    langLocal() {
      // console.log('computed langLocal', this.$store.state.app.local);

      return this.$store.state.app.local;
    }
  },
  methods: {
    handleInputCopy() {
      // console.log("handleInputCopy");
    },
    handleInputPaste() {
      // console.log("handleInputPaste");
    },
    //Note 按钮倒计时
    setBtnCountdown() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.btnShow = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.btnShow = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    onSendVerificationCode() {
      this.trimInputData("sendCode");
      this.isVerificationCodeError = false;
      this.$refs.formValidate.validateField("mailAddress", error => {
        if (!error) {
          AccountService.checkEmail({
            email: this.formValidatePasswd.mailAddress
          })
            .then(res => {
              // console.log("checkEmail res", res);
              if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                this.fetchMailVerificationCode();
                this.isEmailError = false;
              } else {
                this.errorEmailMsg = res.msg || "";
                this.isEmailError = true;
                this.clearEmailInputByResetPasswd();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    fetchMailVerificationCode() {
      // if (this.formValidatePasswd.mailAddress) {
      //   this.setBtnCountdown(); // 按钮倒计时
      // } else {
      //   this.$Message.error("请输入邮箱账号");
      // }
      CommonService.sendMailCode({
        email: this.formValidatePasswd.mailAddress,
        need_login: 1
      })
        .then(res => {
          // console.log("sendMailCode res", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.isVerificationCodeError = false;
            this.errorCodeMsg = "";
            this.setBtnCountdown(); // 按钮倒计时
          } else {
            this.errorCodeMsg = res.msg || "";
            this.isVerificationCodeError = true;
            this.clearCodeInputByResetPasswd();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 密码-获取验证码
    getVerificationCodePassword() {
      if (this.formValidatePasswd.mailAddress) {
        this.verificationCodePasswordBTN = true;
        // console.log(this.formValidatePasswd.mailAddress);
        this.passwordTimer = setInterval(() => {
          this.conutDownPassword--;
          this.verificationPasswordText = `${this.$t("loginAfterSeconds1")}${
            this.conutDownPassword
          }${this.$t("loginAfterSeconds2")}`;
          localStorage.setItem("password_timer", this.conutDownPassword);
          localStorage.setItem(
            "password_email",
            this.formValidatePasswd.mailAddress
          );
        }, 1000);
      } else {
        // this.$Message.error('请输入邮箱账号');
        const that = this;
        CommonFunc.displayMessageTip(
          this.$t("loginPlsEnterEmail"),
          "info",
          that
        );
      }
    },
    // 邮箱-获取验证码
    getVerificationCodeEmail() {
      this.emailForms.mailAddress = this.emailForms.mailAddress.replace(
        /\s+/g,
        ""
      ); // 去除空格
      const that = this;
      if (this.emailForms.mailAddress) {
        if (
          /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
            this.emailForms.mailAddress
          )
        ) {
          this.verificationCodeEmailBTN = true;
          // need_login 默认0：任意发送验证码 1.找回密码验证邮箱时需要
          CommonService.sendMailCode({
            email: this.emailForms.mailAddress,
            need_login: 0
          })
            .then(res => {
              console.log("sendMailCode res", res);
            })
            .catch(error => {
              console.log(error);
            });
          this.emailTimer = setInterval(() => {
            this.conutDownEmail--;
            this.verificationEmailText = `${this.$t("loginAfterSeconds1")}${
              this.conutDownEmail
            }${this.$t("loginAfterSeconds2")}`;
            localStorage.setItem("email_timer", this.conutDownEmail);
            localStorage.setItem("email_email", this.emailForms.mailAddress);
          }, 1000);
        } else {
          // this.$Message.error("邮箱账号格式不正确！");
          CommonFunc.displayMessageTip(
            this.$t("loginEmailFormatIncorrect1"),
            "info",
            that
          );
        }
      } else {
        // this.$Message.error("请输入邮箱账号");
        CommonFunc.displayMessageTip(
          this.$t("loginPlsEnterEmail"),
          "info",
          that
        );
      }
    },
    // 修改密码
    editPassword(name) {
      // if (
      //   this.formValidatePasswd.mailAddress &&
      //   this.formValidatePasswd.verificationCode &&
      //   this.formValidatePasswd.passwdNew &&
      //   this.formValidatePasswd.passwdCheck
      // ) {
      //   this.close();
      //   console.log(this.formValidatePasswd);
      //   localStorage.removeItem("email");
      // } else {
      //   this.$Message.error("请完善输入项！");
      // }
      // console.log("editPassword name", name);
      const that = this;
      this.trimInputData();
      this.$refs[name].validate(valid => {
        if (valid) {
          that.debounceHandleResetPasswd();
        } else {
          // CommonFunc.displayMessageTip("提交失败 (测试代码)", "warning", that);
        }
      });
    },
    debounceHandleResetPasswd: _.debounce(function() {
      this.handleResetPasswd();
    }, 300),
    handleResetPasswd() {
      // console.log("handleResetPasswd");
      const that = this;
      const params = {
        email: this.formValidatePasswd.mailAddress,
        code: this.formValidatePasswd.verificationCode,
        pwd: this.formValidatePasswd.passwdNew,
        repwd: this.formValidatePasswd.passwdCheck
      };
      this.errorEmailMsg = "";
      this.isBtnDisabled = true;
      AccountService.reSetPassword(params)
        .then(res => {
          // console.log('reSetPassword res', res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.btnShow = true;
            clearInterval(this.timer);
            this.timer = null;
            this.handleReset("formValidate");
            this.isBtnDisabled = false;
            setTimeout(() => {
              this.$emit("reLogin");
            }, 1600);
          } else if (
            res.code == Consts.CODEDESC.RESP_ERRORCODE_1005 ||
            res.code == Consts.CODEDESC.RESP_ERRORCODE_1008
          ) {
            this.errorEmailMsg = res.msg || "";
            this.isEmailError = true;
            this.clearEmailInputByResetPasswd();
            this.isBtnDisabled = false;
          } else if (
            res.code == Consts.CODEDESC.RESP_ERRORCODE_1003 ||
            res.code == Consts.CODEDESC.RESP_ERRORCODE_1006
          ) {
            this.errorCodeMsg = res.msg || "";
            this.isVerificationCodeError = true;
            this.clearCodeInputByResetPasswd();
            this.isBtnDisabled = false;
          } else {
            this.isBtnDisabled = false;
          }
        })
        .catch(error => {
          this.isBtnDisabled = false;
          console.log(error);
        });
    },
    //修改邮箱
    editEmail() {
      const that = this;
      if (this.emailForms.mailAddress && this.emailForms.verificationCode) {
        AccountService.resetemail({
          email: this.emailForms.mailAddress,
          code: this.emailForms.verificationCode
          // uid: CommonFunc.getCookie("uid")
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              // console.log('sendMailCode res', res);
              this.close();
              clearInterval(this.emailTimer);
              localStorage.removeItem("email_email");
              localStorage.removeItem("email_timer");
              this.conutDownEmail = 60;
              this.verificationEmailText = this.$t("loginGetVerificationCode");
              this.verificationCodeEmailBTN = false;
            } else {
              this.$Message.error(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // this.$Message.error('请完善输入项！');
        CommonFunc.displayMessageTip(
          this.$t("plsInput"),
          "warning",
          that
        );
      }
    },
    clearCodeInputByResetPasswd() {
      // console.log("clearCodeInputByResetPasswd");

      this.$refs.formValidate.validateField("verificationCode", error => {
        if (!error) {
          this.isVerificationCodeError = false
          this.errorCodeMsg = ""
        }
      });
    },
    clearEmailInputByResetPasswd() {
      this.$refs.formValidate.validateField("mailAddress", error => {
        if (!error) {
          this.isEmailError = false
          this.errorEmailMsg = ""
        }
      });
    },
    //关闭修改框
    close() {
      this.initFormFields();
      this.handleReset("formValidate");
      this.btnShow = true;
      clearInterval(this.timer);
      this.timer = null;
      this.$emit("close", false);
    },
    initFormFields() {
      this.formValidatePasswd.mailAddress = "";
      this.formValidatePasswd.verificationCode = "";
      this.formValidatePasswd.passwdNew = "";
      this.formValidatePasswd.passwdCheck = "";
    },
    handleReset(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    trimInputData(typeName = "") {
      if (typeName === "mailAddress" || typeName === "sendCode" || !typeName) {
        if (this.formValidatePasswd.mailAddress) {
          this.formValidatePasswd.mailAddress = this.formValidatePasswd.mailAddress.replace(
            /\s+/g,
            ""
          );
        }
      }
      if (typeName === "verificationCode" || !typeName) {
        if (this.formValidatePasswd.verificationCode) {
          this.formValidatePasswd.verificationCode = this.formValidatePasswd.verificationCode.replace(
            /\s+/g,
            ""
          );
        }
      }
      if (typeName === "passwdNew" || !typeName) {
        if (this.formValidatePasswd.passwdNew) {
          this.formValidatePasswd.passwdNew = this.formValidatePasswd.passwdNew.replace(
            /\s+/g,
            ""
          );
        }
      }
      if (typeName === "passwdCheck" || !typeName) {
        if (this.formValidatePasswd.passwdCheck) {
          this.formValidatePasswd.passwdCheck = this.formValidatePasswd.passwdCheck.replace(
            /\s+/g,
            ""
          );
        }
      }
      if (typeName === "mailAddress") {
        AccountService.checkEmail({
          email: this.formValidatePasswd.mailAddress
        })
          .then(res => {
            // console.log("checkEmail res", res);
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              this.isEmailError = false;
            } else {
              this.errorEmailMsg = res.msg || "";
              this.isEmailError = true;
              this.clearEmailInputByResetPasswd();
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (typeName === "verificationCode") {
        this.isVerificationCodeError = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
// 修改密码邮箱
.editing {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 14;
  background-color: rgba(0, 0, 0, 0.65);
  .model {
    background-color: white;
    max-width: 930px;
    .panel {
      .ivu-icon {
        z-index: 1;
      }
      .col-sm-5 {
        background-image: url("../assets/images/login.png");
        background-position: center;
        background-repeat: space;
      }
      .col-sm-7 {
        padding-top: 60px;
        padding-bottom: 60px;
        /deep/.form {
          .ivu-form-item {
            margin-bottom: 28px;
            .ivu-input {
              height: 46px;
              border-radius: 5px;
            }
            .ivu-input-icon,
            .ivu-input-prefix i,
            .ivu-input-suffix i {
              line-height: 46px;
            }
            .ivu-input-prefix{
              display: flex;
              align-items: center;
              justify-content: center;
            }
            // 确定按钮
            .ivu-btn-warning {
              background-color: #ff8b01;
              width: 46%;
              height: 38px;
              font-size: 16px;
              border-color: #ff8b01;
            }
            // 获取验证码按钮
            .ivu-btn-primary {
              height: 32px;
              background-color: #ff8b01;
              border-color: #ff8b01;
              min-width: 36%;
            }
          }
          .verification-code {
            .ivu-form-item-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
        }
      }
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .container {
    .navigation {
      display: none;
    }
  }
  .model {
    width: 90%;
    height: 87%;
    margin: 40px auto 0;
    overflow: scroll;
    .panel {
      position: relative;
      .ivu-icon {
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .col-sm-5 {
      height: 160px;
    }
  }
}
// 电脑端
@media (min-width: 768px) {
  .model {
    width: 90%;
    margin: 155px auto 0;
    .panel {
      position: relative;
      height: 100%;
      .ivu-icon {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .col-sm-7 {
        .form {
          padding-left: 20%;
          padding-right: 20%;
        }
      }
    }
  }
}

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media screen and (min-width: 1200px) {
  .model {
    width: 75%;
    overflow: hidden;
  }
}
</style>
