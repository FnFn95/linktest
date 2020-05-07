<template>
  <div class="header bg-white sticky-top shadow-sm">
    <div v-if="loginModel" class="model">
      <div class="animated zoomIn faster panel">
        <div class="row ml-0 mr-0">
          <Icon type="ios-close" size="30" class="cursor-link" @click="closeLoginModel" />
          <div class="col-12 col-sm-5"></div>
          <div class="col-12 col-sm-7">
            <div v-show="show == '登录'" class="form">
              <h1 class="title text-center mb-4">Welcome!</h1>
              <Form ref="formValidateLogin" :model="loginForms" :rules="ruleValidateLogin">
                <!-- @on-clear="clearLoginUserNameInput" -->
                <FormItem prop="user">
                  <Input v-model="loginForms.user" :placeholder="$t('inputEnterName')" clearable @on-blur="trimInputLoginData('user')">
                      <img src="../assets/images/icons/username.png" alt="" slot="prefix">
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <zr-input
                    type="password"
                    password
                    v-model="loginForms.password"
                    :placeholder="$t('loginPlsEnterPassword')"
                    @on-blur="trimInputLoginData('password')"
                    @copy.native.capture.prevent="handleInputCopy"
                    @paste.native.capture.prevent="handleInputPaste"
                  >
                  <img src="../assets/images/icons/password.png" alt="" slot="prefix">
                  </zr-input>
                </FormItem>
                <FormItem prop="validatePic" class="vir">
                  <!-- <div class="row"> -->
                      <Input v-model="loginForms.validatePic" :placeholder="$t('loginPlsEnterVerificationCode')" clearable @on-blur="trimInputLoginData('validatePic')" @on-clear="clearLoginPicCode" style="width: 45%;">
                          <img src="../assets/images/icons/validatepic.png" alt="" slot="prefix">
                      </Input>
                    <div style="width: 50%;">
                      <img
                        style="width: 100%;height: 50px;cursor: pointer;"
                        :src="urlValidatePic"
                        @click="onChangeCodeImage"
                      />
                    </div>
                  <!-- </div> -->
                </FormItem>
                <p
                  class="text-right text-black-50"
                  style="cursor: pointer;margin-top: -1.5rem;margin-bottom: 3rem;"
                  @click="
                    loginModel = false;
                    editState = true;
                  "
                >
                  {{ $t('loginForgetPassword') }}
                </p>
                <FormItem class="text-center">
                  <Button class="rounded-pill" type="primary" :disabled="isLoginBtnDisabled" @click="debounceHandleLogin('formValidateLogin')">{{ $t('login') }}</Button>
                  <p class="text-center mt-2">
                    {{ $t('loginRegisterNow1') }}
                    <span style="color:#FF8B00;cursor: pointer;text-decoration: underline;" @click="toNewRegist">{{ $t('loginRegisterNow2') }}</span>
                  </p>
                </FormItem>
              </Form>
            </div>
            <div v-show="show == '注册'" class="form">
              <h1 class="mb-4" style="font-size:26px">{{ $t('loginRegisterAnAccount') }}</h1>
              <Form ref="formValidateRegist" :model="registerForms" :rules="ruleValidate">
                <FormItem prop="user">
                  <Input v-model="registerForms.user"
                    :placeholder="$t('loginPlsEnterName')"
                    clearable
                    @on-blur="trimInputData('user')"
                    @on-clear="clearRegistUserNameInput">
                      <img src="../assets/images/icons/username.png" alt="" slot="prefix">
                  </Input>
                </FormItem>
                <FormItem prop="email">
                  <Input
                    v-model="registerForms.email"
                    :placeholder="$t('loginPlsEnterEmail')"
                    clearable
                    @on-blur="trimInputData('email')"
                    @on-clear="clearRegistEmailInput"
                  >
                  <img src="../assets/images/icons/email.png" alt="" slot="prefix">
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <!-- <Input
                    v-model="registerForms.password"
                    prefix="ios-key"
                    placeholder="请输入密码"
                    clearable
                  /> -->
                  <zr-input
                    type="password"
                    password
                    v-model="registerForms.password"
                    :placeholder="$t('loginPlsEnterPassword')"
                    prefix="ios-key"
                    @on-blur="trimInputData('password')"
                    @copy.native.capture.prevent="handleInputCopy"
                    @paste.native.capture.prevent="handleInputPaste"
                  ><img src="../assets/images/icons/password.png" alt="" slot="prefix">
                  </zr-input>
                </FormItem>
                <FormItem prop="okPassword">
                  <!-- <Input
                    v-model="registerForms.okPassword"
                    prefix="ios-key"
                    placeholder="请确认密码"
                    clearable
                  /> -->
                  <zr-input
                    type="password"
                    password
                    v-model="registerForms.okPassword"
                    :placeholder="$t('loginPlsEnterPassword')"
                    prefix="ios-key"
                    @on-blur="trimInputData('okPassword')"
                    @copy.native.capture.prevent="handleInputCopy"
                    @paste.native.capture.prevent="handleInputPaste"
                  ><img src="../assets/images/icons/password.png" alt="" slot="prefix">
                  </zr-input>
                </FormItem>
                <FormItem prop="InvitationCode">
                  <Input
                    v-model="registerForms.InvitationCode"
                    :placeholder="$t('loginPlsEnterInvitationCode')"
                    clearable
                    @on-blur="trimInputData('InvitationCode')"
                    @on-clear="clearInvitationCodeInputByRegister"
                  >
                  <img src="../assets/images/icons/invitation.png" alt="" slot="prefix">
                  </Input>
                </FormItem>
                <div class="mb-4" style="margin-top: 20px;">
                  <Radio class="m-0" v-model="registerForms.accept">{{ $t('loginReadAccept1') }}</Radio>
                  <router-link target="_blank" style="color:#FF8B00;" to="/reading/userProtocol">{{ $t('loginReadAccept2') }}</router-link>
                  {{ $t('loginReadAccept3') }}
                  <router-link target="_blank" style="color:#FF8B00;" to="/reading/privacyPolicy">{{ $t('loginReadAccept4') }}</router-link>
                </div>
                <FormItem class="text-center mb-0" :style="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN) ? 'padding-top: 0.8rem;' : ''">
                  <Button class="rounded-pill" type="primary" :disabled="isRegisterBtnDisabled" @click="onRegister('formValidateRegist')">{{ $t('signUp') }}</Button>
                  <!-- <p class="text-center mt-2">
                    我有账号？
                    <span
                      style="color:#FF8B00;cursor: pointer;text-decoration: underline;"
                      @click="show='登录'"
                    >去登录</span>
                  </p>-->
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <zrEditing ref="childUserEditInfo" :state="editState" :show="showPanel" @close="colseEdit" @reLogin="handleReLogin" />
    <div class="container">
      <router-link class="page logo" to="/"><img src="@/assets/images/logo.png" alt="logo" style="margin-bottom: 10px;" /></router-link>
      <div v-if="this.$route.name == 'Home'" class="navigation">
        <ZrAnchor>
          <ZrAnchorLink class="headerTitle" style="float: left;line-height: 1.2;" href="#homeBanner" :title="$t('mainNavTitle')"></ZrAnchorLink>
          <ZrAnchorLink class="headerTitle" style="float: left;line-height: 1.2;" href="#product" :title="$t('ourProductsNavTitle')"></ZrAnchorLink>
          <ZrAnchorLink class="headerTitle" style="float: left;line-height: 1.2;" href="#renewals" :title="$t('renewalsNavTitle')" />
          <ZrAnchorLink class="headerTitle" style="float: left;line-height: 1.2;" href="#intros" :title="$t('introsNavTitle')"></ZrAnchorLink>
          <ZrAnchorLink class="headerTitle" style="float: left;line-height: 1.2;" href="#campaigns" :title="$t('campaignsNavTitle')"></ZrAnchorLink>
        </ZrAnchor>
      </div>
      <div v-else class="navigation">
        <router-link class="page" to="/" :class="[isHomePage ? 'headerCurrentColor' : '']">{{ $t('mainNavTitle') }}</router-link>
        <!-- <router-link class="page" to="/#product">产品购买</router-link>
        <router-link class="page" to="/#renewals">续费</router-link>
        <router-link class="page" to="/#intros">产品介绍</router-link>
        <router-link class="page" to="/#campaigns">推广活动</router-link> -->
        <span class="page headerTitle" @click="toPageAnchor('product')">{{ $t('ourProductsNavTitle') }}</span>
        <span class="page headerTitle" @click="toPageAnchor('renewals')">{{ $t('renewalsNavTitle') }}</span>
        <span class="page headerTitle" @click="toPageAnchor('intros')">{{ $t('introsNavTitle') }}</span>
        <span class="page headerTitle" @click="toPageAnchor('campaigns')">{{ $t('campaignsNavTitle') }}</span>
      </div>
      <qNav class="q-left-nav" @fu="toPageAnchor"></qNav>
      <div class="login">
        <div class="text">
          <div :class="[!$config.useI18n ||  ($config.useI18n && langLocal === $config.languageDefine.enUS)?'e':'']" v-if="!isLogin">
            <Button type="text" class="account p-0 headerTitle" @click="openLogin">{{ $t('loginLogIn') }}</Button>
            <span class="account-line" style="color:#d6d6d6">|</span>
            <Button type="text" class="p-0 headerTitle" @click="openRegister">{{ $t('loginRegistered') }}</Button>
          </div>
          <div class="e" v-else>
            <Button type="text" class="account a p-0 headerTitle" @click="toUserCenter">{{ userNameLogin | nameFormat }}</Button>
            <span class="account-line" style="color:#d6d6d6">|</span>
            <Button type="text" class="p-0 headerTitle" @click="onLogout">{{ $t('loginSignOut') }}</Button>
          </div>
        </div>
        <span @click="toUserCenter" class="cursor-link">
          <Tooltip :content="$t('profile')" theme="light" :delay="300">
            <!-- <Icon class="ml-3" type="md-person" :size="24" color="black" style="border: #000000;" /> -->
            <img class="ml-3" src="@/assets/images/user-icon.png" alt />
            </Tooltip>
        </span>
        <router-link to="/other/help">
          <Tooltip :content="$t('support')" theme="light" :delay="300">
            <!-- <Icon  class="ml-3" type="ios-help-circle-outline" :size="24" color="black" style="font-weight: 900;" /> -->
            <img class="ml-3" src="@/assets/images/question-icon.png" alt />
            </Tooltip>
        </router-link>
        <language @on-lang-change="setLocal" :lang="langLocal" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import CommonService from '@/service/common-service';
import AccountService from '@/service/account-service';
import Language from './language';
import zrEditing from '@/components/editing'; // 修改密码
import ZrInput from '@/components/my-iview/components/input/input'; // 重写input组件，1、eye状态取反，2、更换eye图标
import ZrAnchor from '@/components/my-iview/components/anchor/anchor';
import ZrAnchorLink from '@/components/my-iview/components/anchor/anchor-link';
import CommonFunc from '@/utils/common';
import qNav from './left-nav/left-nav'; // 引入阅读协议框
import { setCookie, getCookie, removeCookie } from '@/libs/util';
// import config from "@/config";
// const { useI18n } = config;
export default {
  name: 'zr-header', // 调用的标签名字
  components: { zrEditing, ZrInput, qNav, Language, ZrAnchor, ZrAnchorLink },
  data() {
    // 用户名校验规则
    const validUserName = (rule, value, callback) => {
      if (!value.replace(/\s+/g, '')) {
        this.trimInputData('passwdNew');
        callback(new Error(this.$t('loginPlsEnterName')));
      } else {
        this.trimInputData(); // 去除空格
        const regexp = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9]{3,15}$/; // 规则：最小4位 最大16位，中文/字母+数字，首字母不能数字
        const userName = this.registerForms.user;

        if (userName.match(regexp)) {
          const params = {
            username: userName
          };
          AccountService.checkUserName(params)
            .then(res => {
              if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                // console.log('checkUserName res', res);
                callback();
              } else if (res.code == Consts.CODEDESC.RESP_USERNAME_DUPLICATE) {
                // callback(new Error('用户名已经被注册了'));
                callback(new Error(this.$t('loginUsernameRegistered')));
              } else {
                callback(new Error(res.msg));
              }
            })
            .catch(error => {
              callback(new Error(this.$t('commonException')));
              console.log(error);
            });
        } else {
          callback(new Error(this.$t('loginNameFormatIncorrect')));
        }
      }
    };
    // 邮箱校验规则（重名）
    const validUserEmailDuplicate = (rule, value, callback) => {
      if (this.isEmailDuplicate) {
        callback(new Error(this.$t('loginMailboxRegistered')));
      } else {
        callback();
      }
    };
    // 邮箱校验规则
    const validUserEmail = (rule, value, callback) => {
      if (this.isEmailError) {
        const msg = this.errorEmailMsg;
        callback(new Error(msg));
      } else {
        callback();
      }
    };
    // 新密码校验规则
    const validNewPasswd = (rule, value, callback) => {
      if (!value.replace(/\s+/g, '')) {
        this.trimInputData('password');
        callback(new Error(this.$t('loginPlsEnterPassword')));
      } else {
        this.trimInputData(); // 去除空格
        const regexp = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/; // 密码规则：8-16位字符，必须由字母和数字组合
        const passwdNew = this.registerForms.password;
        const passwdCheck = this.registerForms.okPassword;

        if (passwdNew.match(regexp)) {
          callback();
        } else {
          callback(new Error(this.$t('loginPasswordFormatIncorrect')));
        }
      }
    };
    // 确认密码校验规则
    const validCheckPasswd = (rule, value, callback) => {
      if (!value.replace(/\s+/g, '')) {
        this.trimInputData('okPassword');
        callback(new Error(this.$t('loginPlsEnterPasswordAgain')));
      } else {
        this.trimInputData(); // 去除空格
        const regexp = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$/; // 密码规则：8-16位字符，必须由字母和数字组合

        const passwdNew = this.registerForms.password;
        const passwdCheck = this.registerForms.okPassword;

        if (passwdNew.match(regexp)) {
          if (passwdCheck) {
            if (passwdNew === passwdCheck) {
              callback();
            } else {
              callback(new Error(this.$t('loginPlsTwiceInconsistent')));
            }
          } else {
            callback(new Error(this.$t('loginPlsPasswordAgain')));
          }
        } else {
          callback(new Error(this.$t('loginPasswordFormatIncorrect')));
        }
      }
    };
    // 邀请码校验规则
    const validInvitationCode= (rule, value, callback) => {
      if (this.isInvitationCodeError) {
        const msg = this.errorInvitationCodeMsg;
        callback(new Error(msg));
      } else {
        callback();
      }
    };
    // 验证码校验规则
    const validPicCode= (rule, value, callback) => {
      if (this.isLoginPicCodeError) {
        const msg = this.errorPicCodeMsg;
        callback(new Error(msg));
      } else {
        const piccode = value.replace(/\s+/g, '')
        if (piccode && piccode.length == 5) {
          const params = {
            uuid: this.uuidValidatePic,
            code: piccode
          };
          AccountService.checkPicCode(params)
            .then(res => {
              if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                callback();
              } else {
                callback(new Error(res.msg));
              }
            })
            .catch(error => {
              callback(new Error(res.msg));
              console.log(error);
            });
        } else {
          callback();
        }
      }
    };
    return {
      isHomePage: false,
      isLogin: false,
      userNameLogin: '',
      loginModel: false,
      isRegisterBtnDisabled: false,
      isLoginBtnDisabled: false,
      isInvitationCodeError: false,
      errorInvitationCodeMsg: "",
      isLoginPicCodeError: false,
      errorPicCodeMsg: "",
      isEmailError: false,
      errorEmailMsg: "",
      urlValidatePic: "",
      uuidValidatePic: "",
      show: '',
      //登录的表单
      loginForms: {
        user: '',
        password: '',
        validatePic: ''
      },
      // 注册的表单
      registerForms: {
        user: '',
        email: '',
        password: '',
        okPassword: '',
        InvitationCode: '',
        accept: false
      },
      editState: false, //修改密码框
      showPanel: '密码',
      isEmailDuplicate: false,
      ruleValidateLogin: {
        user: [
          {
            required: true,
            // message: '请输入用户名',
            message: this.$t('loginPlsEnterName'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('loginPlsEnterPassword'),
            trigger: 'blur'
          }
        ],
        validatePic: [
          {
            required: true,
            max: 5,
            message: this.$t('profilePlsEnterverificationCode'),
            trigger: 'blur'
          },
          { validator: validPicCode, trigger: 'change' }
        ]
      },
      ruleValidate: {
        user: [
          {
            required: true,
            message: this.$t('loginPlsEnterName'),
            trigger: 'blur'
          },
          { validator: validUserName, trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            max: 254,
            message: this.$t('loginPlsEmailNormally'),
            trigger: 'blur'
          },
          {
            type: 'email',
            message: this.$t('loginEmailFormatIncorrect'),
            trigger: 'blur'
          },
          { validator: validUserEmail, trigger: 'blur' }
        ],
        InvitationCode: [
          {
            required: true,
            max: 10,
            message: this.$t('loginPlsEnterInvitationCode'),
            trigger: 'blur'
          },
          { validator: validInvitationCode, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: this.$t('loginPlsEnterPassword'),
            trigger: 'blur'
          },
          { validator: validNewPasswd, trigger: 'blur' }
        ],
        okPassword: [
          {
            required: true,
            message: this.$t('loginPlsEnterPasswordAgain'),
            trigger: 'blur'
          },
          { validator: validCheckPasswd, trigger: 'blur' }
        ]
      }
    };
  },
  filters: {
    nameFormat: function(val) {
      let res = val;
      if (val && val.length > 10) {
        res = val.substr(0, 10) + '...';
      }
      return res;
    }
  },
  created() {
    // console.log("header.vue created");
    if (this.$route.name == 'Home') {
      this.isHomePage = true;
    }
    this.checkHasLogin();
    // this.isLogin = CommonFunc.isLoginByCheck();
    // if (this.isLogin) {
    //   this.userNameLogin = CommonFunc.getLoginUserName();
    //   // console.log("created userNameLogin", this.userNameLogin);
    // }
  },
  computed: {
    langLocal() {
      // console.log('computed langLocal', this.$store.state.app.local);

      return this.$store.state.app.local;
    }
  },
  methods: {
    ...mapMutations(['setLocal']),
    ...mapActions(['handleLogin', 'getUserInfo']),
    checkHasLogin() {
      const uid = getCookie('uid');
      if (uid) {
        CommonFunc.setLoginUserId(uid);
        this.isLogin = true;
        const invelinkUserInfo = JSON.parse(getCookie('invelinkUserInfo'));
        // console.log("checkHasLogin invelinkUserInfo", invelinkUserInfo);
        CommonFunc.setLoginUserInfo(invelinkUserInfo);
        const { username, rest } = invelinkUserInfo;
        this.userNameLogin = username || '';
        CommonFunc.setLoginUserName(this.userNameLogin);
        CommonFunc.setLoginUserRest(rest);
      }
    },
    handleInputCopy() {
      // console.log("handleInputCopy");
    },
    handleInputPaste() {
      // console.log("handleInputPaste");
    },
    // 跳转至锚点
    toPageAnchor(anchorName) {
      this.$emit('toPageAnchor', anchorName);
    },
    //Note 获取图片验证码
    fetchPicCode(type = "common") {
      // const params = {
      //   username: this.loginForms.user,
      //   password: this.loginForms.password
      // };
      this.isLoginBtnDisabled = true;
      AccountService.getPicCode()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            console.log('getPicCode res', res);
            this.urlValidatePic = res.data.imgurl
            this.uuidValidatePic = res.data.uuid
            this.isLoginBtnDisabled = false;
            if (type === 'init') {
              this.loginModel = true;
            }
          } else {
            this.isLoginBtnDisabled = false;
          }
        })
        .catch(error => {
          this.isLoginBtnDisabled = false;
          console.log(error);
        });
    },
    // 打开登录面板
    openLogin() {
      this.initLoginForm();
      this.fetchPicCode('init')
      // this.loginModel = true;
    },
    initLoginForm() {
      this.loginForms = {
        user: '',
        password: ''
      };
      this.handleReset('formValidateLogin');
      this.show = '登录';
    },
    //打开注册面板
    openRegister() {
      this.registerForms = {
        user: '',
        email: '',
        password: '',
        okPassword: '',
        InvitationCode: '',
        accept: false
      };
      this.handleReset('formValidateRegist');
      this.show = '注册';
      this.loginModel = true;
    },
    closeLoginModel() {
      setTimeout(() => {
        this.loginModel = false;
      }, 200);
    },
    //Note 登录
    onLogin(name) {
      this.trimInputLoginData(); // 去除空格

      const that = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = {
            uuid: that.uuidValidatePic,
            code: that.loginForms.validatePic
          };
          this.isLoginPicCodeError = false;
          that.errorPicCodeMsg = ""
          AccountService.checkPicCode(params)
            .then(res => {
              if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
                that.handleLogin();
              } else {
                that.isLoginPicCodeError = true;
                that.errorPicCodeMsg = res.msg || "";
                that.$refs.formValidateLogin.validateField('validatePic', error => {
                  if (!error) {
                  }
                });
              }
            })
            .catch(error => {
              that.isLoginPicCodeError = true;
              console.log(error);
            });
          // that.handleLoginTest({ username: that.loginForms.user, password: that.loginForms.password });
        } else {
          // CommonFunc.displayMessageTip("提交失败 (测试代码)", "warning", that);
        }
      });
    },
    handleLoginTest({ username, password }) {
      // console.log('handleLoginTest', username, password);
      this.handleLogin({ username, password }).then(res => {
        //   this.getUserInfo().then(res => {
        //     // this.$router.push({
        //     //   name: this.$config.homeName
        //     // })
        console.log('header.vue res', res);

        //   })
      });
    },
    debounceHandleLogin: _.debounce(function(v) {
      this.onLogin(v);
    }, 1000),
    handleLogin() {
      // console.log(this.loginForms);
      const that = this;
      const params = {
        username: this.loginForms.user,
        password: this.loginForms.password
      };
      this.isLoginBtnDisabled = true;
      AccountService.loginByUser(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // console.log('loginByUser res', res);
            // this.$Message.success("登录成功！");
            if (res && res.hasOwnProperty('data')) {
              const { data } = res;
              // localStorage.setItem("invelinkUserInfo", JSON.stringify(data));
              CommonFunc.setLoginUserInfo(data);
              setCookie('invelinkUserInfo', JSON.stringify(data));
              const { username, id, rest } = data;
              // CommonFunc.setCookie("uid", id);
              setCookie('uid', id);
              CommonFunc.setLoginUserId(id);
              this.userNameLogin = username || '';
              CommonFunc.setLoginUserName(this.userNameLogin);
              setCookie('invelinkUserName', this.userNameLogin);
              CommonFunc.setLoginUserRest(rest);
              setCookie('invelinkUserRest', rest);
              this.isLogin = true;
              CommonFunc.displayMessageTip(this.$t('loginSuccessful'), 'success', that);
              this.isLoginBtnDisabled = false;
              this.loginModel = false;
            } else {
              this.isLoginBtnDisabled = false;
              CommonFunc.displayMessageTip(this.$t('loginFailed'), 'error', that);
            }
          } else {
            this.isLoginBtnDisabled = false;
          }
        })
        .catch(error => {
          this.isLoginBtnDisabled = false;
          console.log(error);
        });
    },
    //Note 重置密码后重新登录
    handleReLogin() {
      this.editState = false;
      if (this.$refs.childUserEditInfo) {
        this.$refs.childUserEditInfo.handleReset('formValidate');
      }
      const that = this;
      CommonFunc.displayMessageTip(this.$t('loginPasswordResetSucceeded'), 'success', that);
      setTimeout(() => {
        this.openLogin();
      }, 200);
    },
    toNewRegist() {
      // console.log('toNewRegist');

      this.registerForms = {
        user: '',
        email: '',
        password: '',
        okPassword: '',
        InvitationCode: '',
        accept: false
      };
      this.handleReset('formValidateRegist');
      setTimeout(() => {
        this.show = '注册';
        this.loginModel = true;
      }, 100);
    },
    //Note 跳转至个人中心
    toUserCenter() {
      // 判断是否登录
      const res = CommonFunc.isLoginByCheck();
      if (res) {
        if (this.$route.name !== 'user') {
          this.$router.push({
            name: 'user'
          });
        }
      } else {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('loginPlsLogFirst'), 'info', that);
        setTimeout(() => {
          this.openLogin();
        }, Consts.TIMESETTING.LOGIN_DISPLAY_DELAY);
      }
    },
    //Note 退出登录
    onLogout() {
      // let title = '询问',
      //   content = '确定要退出登录吗？';
      // if (this.langLocal === this.$config.languageDefine.enUS) {
      //   title = this.$t('confirmation');
      //   content = 'Are you sure log out？';
      // }

      this.$Modal.confirm({
        title: this.$t('commonAsk'),
        content: '<div>' + this.$t('loginSureLogOut') + '</div>',
        onOk: () => {
          this.handleLogout();
        },
        onCancel: () => {}
      });
    },
    handleLogout() {
      // CommonFunc.cleartLoginUserInfo();
      // CommonFunc.cleartLoginUserName();
      // CommonFunc.cleartLoginUserRest();
      // sessionStorage.removeItem("uid");
      sessionStorage.clear();
      removeCookie('invelinkUserInfo');
      removeCookie('uid');
      removeCookie('invelinkUserName');
      removeCookie('invelinkUserRest');
      const res = CommonFunc.isLoginByCheck();

      if (!res) {
        const that = this;
        // CommonFunc.displayMessageTip('已成功登出', 'success', that);
        CommonFunc.displayMessageTip(this.$t('loginSuccessfullyLoggedOut'), 'success', that);
        this.isLogin = false;
        this.userNameLogin = '';
        if (this.$route.name != Consts.ROUTES.COM_HOME) {
          setTimeout(() => {
            this.$router.push({
              name: Consts.ROUTES.COM_HOME
            });
          }, 1600);
        }
      }
    },
    onRegister(name) {
      const that = this;
      this.trimInputData();

      this.$refs[name].validate(valid => {
        if (valid) {
          // 判断是否同意协议
          if (this.registerForms.accept) {
            that.debounceHandleRegister();
          } else {
            CommonFunc.displayMessageTip(this.$t('loginPlsReadAccept'), 'info', that);
          }
        } else {
          // CommonFunc.displayMessageTip("提交失败 (测试代码)", "warning", that);
        }
      });
    },
    debounceHandleRegister: _.debounce(function() {
      this.handleRegister();
    }, 1000),
    handleRegister() {
      const that = this;
      const params = {
        username: this.registerForms.user,
        email: this.registerForms.email,
        password: this.registerForms.password,
        repassword: this.registerForms.okPassword,
        invited_code: this.registerForms.InvitationCode
      };
      this.isRegisterBtnDisabled = true;
      AccountService.registerByUser(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // console.log('registerByUser res', res);
            // this.loginForms.user = this.registerForms.user
            // this.loginForms.password = this.registerForms.password
            // this.handleLogin();
            this.handleReset('formValidateRegist');

            if (res && res.hasOwnProperty('data')) {
              const { data } = res;
              // localStorage.setItem("invelinkUserInfo", JSON.stringify(data));
              CommonFunc.setLoginUserInfo(data);
              setCookie('invelinkUserInfo', JSON.stringify(data));
              const { username, id, rest } = data;
              // CommonFunc.setCookie("uid", id);
              setCookie('uid', id);
              CommonFunc.setLoginUserId(id);
              this.userNameLogin = username || '';
              CommonFunc.setLoginUserName(this.userNameLogin);
              setCookie('invelinkUserName', this.userNameLogin);
              CommonFunc.setLoginUserRest(rest);
              setCookie('invelinkUserRest', rest);
              this.isLogin = true;
              CommonFunc.displayMessageTip(this.$t('loginSuccessful'), 'success', that);
              this.isLoginBtnDisabled = false;
              this.loginModel = false;
            } else {
              this.isLoginBtnDisabled = false;
              CommonFunc.displayMessageTip(this.$t('loginFailed'), 'error', that);
            }
            // this.isRegisterBtnDisabled = false;
            // CommonFunc.displayMessageTip(this.$t('loginRegistrationSuccess'), 'success', that);
            // this.loginModel = false;
          } else if (res.code == Consts.CODEDESC.RESP_USEREMAIL_DUPLICATE) {
            this.errorEmailMsg = res.msg || "";
            // this.isEmailDuplicate = true;
            this.isEmailError = true;
            this.clearRegistEmailInput();
            this.isRegisterBtnDisabled = false;
          } else if (res.code == '1003' || res.code == '1008') {
            this.errorEmailMsg = res.msg || "";
            this.isEmailError = true;
            this.clearRegistEmailInput();
            this.isRegisterBtnDisabled = false;
          } else {
            console.log('registerByUser res', res);
            this.errorInvitationCodeMsg = res.msg || "";
            this.isInvitationCodeError = true;
            this.clearInvitationCodeInputByRegister();
            this.isRegisterBtnDisabled = false;
          }
        })
        .catch(error => {
          this.isRegisterBtnDisabled = false;
          console.log(error);
        });
    },
    //注册
    register() {
      if (
        // 判断所有输入框是否为空
        this.registerForms.user != '' &&
        this.registerForms.email != '' &&
        this.registerForms.password != '' &&
        this.registerForms.okPassword != '' &&
        this.registerForms.InvitationCode != ''
      ) {
        // 判断用户名是否达到8个字符
        if (this.registerForms.user.length > 7) {
          //判断邮箱格式是否合法
          if (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.registerForms.email)) {
            if (this.registerForms.password.length > 5 && this.registerForms.okPassword.length > 5) {
              // 判断两次密码是否一致
              if (this.registerForms.password == this.registerForms.okPassword) {
                // 判断是否同意协议
                if (this.registerForms.accept == true) {
                  // 汇聚参数并去除空格
                  const params = {
                    username: this.registerForms.user.replace(/\s+/g, ''),
                    email: this.registerForms.email.replace(/\s+/g, ''),
                    password: this.registerForms.password.replace(/\s+/g, ''),
                    repassword: this.registerForms.okPassword.replace(/\s+/g, ''),
                    invited_code: this.registerForms.InvitationCode.replace(/\s+/g, '')
                  };
                  // console.log(params);
                  AccountService.registerByUser(params)
                    .then(res => {
                      if (res.code == '1000') {
                        console.log('registerByUser res', res);
                        this.$Message.success('注册成功！');
                        this.loginModel = false;
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                } else {
                  this.$Message.error({
                    content: '用户协议和隐私政策需接受！',
                    duration: 3
                  });
                }
              } else {
                this.$Message.error({
                  content: '两次密码不一致！',
                  duration: 3
                });
              }
            } else {
              this.$Message.error('密码最少为6为！');
            }
          } else {
            this.$Message.error('邮箱规则不合法！');
          }
        } else {
          this.$Message.error({
            content: '用户名不得少于8个字符！',
            duration: 3
          });
        }
      } else {
        this.$Message.error('请输入完整！');
      }
    },
    clearInvitationCodeInputByRegister() {
      // console.log("clearInvitationCodeInputByRegister");

      this.$refs.formValidateRegist.validateField("InvitationCode", error => {
        if (!error) {
        }
      });
    },
    //修改密码框
    colseEdit(state) {
      this.editState = state;
      if (this.$refs.childUserEditInfo) {
        this.$refs.childUserEditInfo.handleReset('formValidate');
      }
    },
    clearRegistUserNameInput() {
      this.$refs.formValidateRegist.validateField('user', error => {
        if (!error) {
        }
      });
    },
    clearRegistEmailInput() {
      this.$refs.formValidateRegist.validateField('email', error => {
        if (!error) {
        }
      });
    },
    clearLoginPicCode() {
      this.isLoginPicCodeError = false,
      this.$refs.formValidateLogin.validateField('validatePic', error => {
        if (!error) {
        }
      });
    },
    onChangeCodeImage () {
      this.isLoginBtnDisabled = true;
      this.isLoginPicCodeError = false,
      AccountService.getPicCode()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            console.log('getPicCode res', res);
            this.urlValidatePic = res.data.imgurl
            this.uuidValidatePic = res.data.uuid
            this.errorPicCodeMsg = "",
            this.isLoginBtnDisabled = false;
          } else {
            this.isLoginBtnDisabled = false;
          }
        })
        .catch(error => {
          this.isLoginBtnDisabled = false;
          console.log(error);
        });
    },
    handleReset(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    trimInputLoginData(typeName = '') {
      if (typeName === 'user' || !typeName) {
        if (this.loginForms.user) {
          this.loginForms.user = this.loginForms.user.replace(/\s+/g, '');
        }
      }
      if (typeName === 'password' || !typeName) {
        if (this.loginForms.password) {
          this.loginForms.password = this.loginForms.password.replace(/\s+/g, '');
        }
      }
      if (typeName === 'validatePic' || !typeName) {
        if (this.loginForms.validatePic) {
          this.loginForms.validatePic = this.loginForms.validatePic.replace(/\s+/g, '');
        }
      }
    },
    trimInputData(typeName = '') {
      if (typeName === 'email') {
        this.isEmailDuplicate = false;
        this.isEmailError = false;
      }
      if (typeName === 'user' || !typeName) {
        if (this.registerForms.user) {
          this.registerForms.user = this.registerForms.user.replace(/\s+/g, '');
        }
      }
      if (typeName === 'email' || !typeName) {
        if (this.registerForms.email) {
          this.registerForms.email = this.registerForms.email.replace(/\s+/g, '');
        }
      }
      if (typeName === 'InvitationCode') {
        this.isInvitationCodeError = false
      }
      if (typeName === 'InvitationCode' || !typeName) {
        if (this.registerForms.InvitationCode) {
          this.registerForms.InvitationCode = this.registerForms.InvitationCode.replace(/\s+/g, '');
        }
      }
      if (typeName === 'password' || !typeName) {
        if (this.registerForms.password) {
          this.registerForms.password = this.registerForms.password.replace(/\s+/g, '');
        }
      }
      if (typeName === 'okPassword' || !typeName) {
        if (this.registerForms.okPassword) {
          this.registerForms.okPassword = this.registerForms.okPassword.replace(/\s+/g, '');
        }
      }
    }
  },
  mounted() {
    // 设置初始语言
    if (!this.$store.state.app.local) {
      this.setLocal(this.$i18n.locale);
    }
  }
};
</script>

<style lang="less" scoped>
  @font-face{
    font-family: visyby;
    src:url('../assets/fonts/VisbyRoundCF-Heavy.otf');
  }
.headerCurrentColor {
  color: #ff8b00;
}
.headerTitle:hover {
  color: #ff8b00;
  transition: color 0.2s ease;
  cursor: pointer;
}
.sticky-top {
  z-index: 10;
}
.container {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    img {
      width: 110px;
    }
  }
  .navigation {
    .page {
      padding: 0 12px;
    }
  }
  .q-left-nav {
    display: none;
  }

  .login {
    display: flex;
    align-items: center;
    .text {
      display: inline;
    }
    img {
      width: 18px;
    }
  }
}

// 登录注册
.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 14;
  background-color: rgba(0, 0, 0, 0.65);
  .panel {
    background-color: white;
    max-width: 930px;
    /*max-height: 610px;*/
    .ivu-icon {
      z-index: 1;
    }
    .col-sm-5 {
      background-image: url('../assets/images/login.png');
      background-position: center;
      background-size: cover;
    }
    .col-sm-7 {
      /deep/.form {
        .title{
          color:#FF8B00;
          font-size:34px;
          font-family: visyby;
        }
        .ivu-form-item {
          margin-bottom: 38px;
          .ivu-input {
            height: 50px;
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
          .ivu-form-item-error-tip{
            padding-top: 0;
            line-height: 1.5;
            letter-spacing:1px;
          }
          .ivu-radio-inner {
            border-color: #ff8400;
            &::after {
              background-color: #ff8400;
            }
          }
          .ivu-btn {
            background-color: #ff8b01;
            width: 54%;
            height: 44px;
            font-size: 16px;
            border-color: #ff8b01;
          }
        }
        .vir{
          .ivu-form-item-content{
            display: flex;
            justify-content: space-between;
          }
        }
        .ivu-form-item.ivu-form-item-required:nth-child(5) {
          margin-bottom: 0;
        }
      }
    }
  }
}

/* 手机端 */
@media (max-width: 767px) {
  .login {
    .text {
      .e{
        display: grid;
      }
    }
    .ivu-btn{
      height: 22px;
    }
  }
  .container {
    .navigation {
      display: none;
    }
    .q-left-nav {
      display: block;
    }
  }
  .model {
    .panel {
      width: 90%;
      max-height: 87%;
      margin: 40px auto 0;
      overflow-y: scroll;
      .row {
        height: auto;
        .ivu-icon {
          position: absolute;
          top: 40px;
          right: 20px;
        }
        .col-sm-5 {
          height: 160px;
        }
        .col-sm-7 {
          .form {
            padding: 30px 0;
          }
        }
      }
    }
  }
  .login {
    .a,
    .account-line {
      display: none;
    }
  }
}
// 电脑端
@media (min-width: 768px) {
  .model {
    .panel {
      width: 90%;
      /*height: 90%;*/
      height: 660px;
      overflow: hidden;
      margin: 5% auto 0;
      position: relative;
      .row {
        height: 100%;
        .ivu-icon {
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .col-sm-7 {
          .form {
            padding-top: 70px;
            padding-left: 20%;
            padding-right: 20%;
          }
        }
      }
    }
  }
}

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media screen and (min-width: 1200px) {
  .model {
    .panel {
      width: 75%;
    }
  }
}
</style>
