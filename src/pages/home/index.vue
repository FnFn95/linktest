<template>
  <div class="home">
    <zrHeader ref="zrheader" @toPageAnchor="handleAnchorLink" />
    <!-- 轮播图 -->
    <div ref="banner" v-swiper:mySwiper="swiperOptions" id="homeBanner">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(banner, index) in banners" :key="index">
          <div v-if="banner.pic" :class="[banner.id ? 'cursor-link' : '']">
            <router-link :to="'/news/details?newsId=' + banner.id"><img :src="banner.pic" :alt="banner.title" /></router-link>
          </div>
        </div>
      </div>
      <div class="swiper-button-next"><img src="../../assets/images/icons/to-right.png" alt="" /></div>
      <div class="swiper-button-prev"><img src="../../assets/images/icons/to-left.png" alt="" /></div>
      <div class="swiper-pagination"></div>
    </div>
    <!-- 测试 -->
    <!-- <div class="text-center">
      <Button class="bg-white" size="large" @click="testBtn">测试按钮</Button>
    </div>-->
    <!-- 产品购买 -->
    <div ref="product" class="product bg-white" id="product">
      <div class="container">
        <div class="title text-center font-weight-bold">
          <h1 v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">产品购买</h1>
          <p>PRODUCT PURCHASE</p>
          <div class="bb"></div>
        </div>
        <div class="row bg-light list" v-for="(item, index) in listPurchaseProducts" :key="index">
          <div class="col-12 col-sm-6">
            <span class="cursor-link" @click="toProductDetail(item)"><img :src="item.picture" alt /></span>
          </div>
          <div class="col-12 col-sm-6 right">
            <h1 class="name">
              <span class="cursor-link-color" @click="toProductDetail(item)">{{ item.name }}</span>
            </h1>
            <p class="text-black-50 mt-3 mb-5 description" v-html="item.introduction"></p>
            <div class="d-flex align-items-center">
              <h1 class="price">${{ item.price }}</h1>
              <zrNumbering
                :itemId="item.id"
                :stock="item.stock"
                @adding="addNumberProduct"
                @reduce="reduceNumberProduct"
                @change="changeNumberProduct"
                @prohibitZero="prohibitZeroProduct"
              />
            </div>
            <div class="mt-4 btns">
              <Button
                :class="['rounded-pill', !$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.enUS) ? '' : 'w-42']"
                size="large"
                type="warning"
                :disabled="isBtnDisabled"
                @click="debounceOnBuyProducts(item)"
              >
                {{ $t('buyItNow') }}
              </Button>
              <Button
                :class="['rounded-pill bg-white', !$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.enUS) ? '' : 'w-42']"
                size="large"
                :disabled="isBtnDisabled"
                @click="debounceOnOpenBox(item)"
              >
                {{ $t('opening') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 续费 -->
    <div ref="renewals" class="container renewals" id="renewals">
      <div class="title text-center font-weight-bold">
        <h1 v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">续费</h1>
        <p>RENEWAL</p>
        <div class="bb"></div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-4 mb-4 list" v-for="(item, index) in renewals" :key="index">
          <div class="border bg-white text-center content">
            <div v-if="!item.hasOwnProperty('activity') || !item.activity">
              <!-- 没有设置活动 -->
              <h1 class="mb-5 name">{{ item.name }}</h1>
              <div class="mb-4 pb-4 border-bottom price">
                <span style="font-size: 42px;">{{ '$' + item.price }}</span>
                <!-- <span :class="['new-price',item.old_price==''?'':'orange']">{{ '$'+item.new_price }}</span>
              <span
                class="text-black-50 old-price"
                v-show="item.old_price!=''"
              >{{ '$'+item.old_price }}</span>-->
              </div>
              <div class="activity">
                <!-- <h1 class="tittle mb-3">{{ item.title }}</h1> -->
                <p class="text-black-50 description" v-html="item.introduction"></p>
              </div>
              <Button v-show="!isBtnDisabled" class="rounded-pill mt-5 mb-4" size="large" type="warning" @click="onPurchaseTimeCard(item)">{{ $t('buyItNow') }}</Button>
              <Button v-show="isBtnDisabled" class="rounded-pill mt-5 mb-4" size="large" type="warning">{{ $t('buyItNow') }}</Button>
              <!-- <time class="text-black-50" datetime>{{ item.time }}</time> -->
            </div>
            <div v-else>
              <h1 class="mb-5 name">{{ item.name }}</h1>
              <div class="mb-4 pb-4 border-bottom price">
                <!-- <span :class="['new-price', 'orange']" v-if="item.price"
                  >${{
                    (_.toNumber(item.price) *
                      _.toNumber(item.activity.discount) *
                      0.1)
                      | numFilter
                  }}</span
                > -->
                <span :class="['new-price', 'orange']" v-if="item.pay">${{ item.pay | numFilter }}</span>
                <span class="text-black-50 old-price">{{ '$' + item.price }}</span>
              </div>
              <div class="activity">
                <h1 class="tittle mb-3">{{ item.activity.name }}</h1>
                <p class="text-black-50 description" v-html="item.activity.introduction"></p>
              </div>
              <Button v-show="!isBtnDisabled" class="rounded-pill mt-5 mb-4" size="large" type="warning" @click="onPurchaseTimeCard(item)">{{ $t('buyItNow') }}</Button>
              <Button v-show="isBtnDisabled" class="rounded-pill mt-5 mb-4" size="large" type="warning">{{ $t('buyItNow') }}</Button>
              <br />
              <time class="text-black-50" datetime style="font-size:12px">
                {{ $t('activityTime') }}：{{ item.activity.start_time | formatDate }}-{{ item.activity.end_time | formatDate }}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 产品介绍 -->
    <div ref="intros" class="bg-white intros" id="intros">
      <div class="title text-center font-weight-bold">
        <h1 v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">产品介绍</h1>
        <p>PRODUCT DESCRIPTION</p>
        <div class="bb"></div>
      </div>
      <div class="container">
        <div v-if="intros.length == 1">
          <div class="list row d-flex align-items-center" v-for="(item, index) in intros" :key="index">
            <div class="col-12 col-sm-5" @click="toNewsDetail(item)">
              <router-link :to="'/news/details?newsId=' + item.id">
                <div class="cursor-link"><img :src="item.pic" :alt="item.title" /></div>
              </router-link>
            </div>
            <div class="col-12 col-sm-7 right">
              <router-link :to="'/news/details?newsId=' + item.id">
                <h1 class="name cursor-link-color">{{ item.title }}</h1>
                <!-- <p class="text-black-50 mt-3 description" v-html="item.content"></p> -->
                <p class="text-black-50 mt-3 description">{{ item.text }}</p>
              </router-link>
            </div>
          </div>
        </div>
        <div class="row list" v-else>
          <div v-for="(item, index) in intros" :key="index" class="col-12 col-sm-4 text-center">
            <router-link :to="'/news/details?newsId=' + item.id">
              <div class="img"><img :src="item.pic" :alt="item.title" /></div>
              <h1 class="mt-4 name">{{ item.title }}</h1>
              <!-- <p class="text-black-50 mt-3 mb-5 description" v-html="item.content"></p> -->
              <p class="text-black-50 mt-3 mb-5 description">{{ item.text }}</p>
            </router-link>
          </div>
          <div class="col-12 text-center">
            <router-link to="/news?type=intros">
              <Button class="bg-white" size="large">{{ $t('seeMore') }}</Button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 推广活动 -->
    <div ref="campaigns" class="campaigns" id="campaigns">
      <div class="title text-center font-weight-bold">
        <h1 v-if="!$config.useI18n || ($config.useI18n && langLocal === $config.languageDefine.zhCN)">推广活动</h1>
        <p>PROMOTIONS</p>
        <div class="bb"></div>
      </div>
      <div class="container">
        <div class="row">
          <div v-for="(item, index) in campaigns" :key="index" class="col-12 col-sm-4 text-center mb-5">
            <div class="img"><img :src="item.pic" :alt="item.title" /></div>
            <h1 class="mt-4 text-left name">{{ item.title }}</h1>
            <p class="mt-3 mb-4 border-bottom text-left description">
              <!-- <span class="text-black-50" v-html="item.content"></span> -->
              <span class="text-black-50">{{ item.text }}</span>
            </p>
            <span class="newsDetailTip" @click="toNewsDetail(item)">
              More
              <Icon type="ios-add" />
            </span>
          </div>
          <div class="col-12 text-center">
            <router-link to="/news?type=campaigns">
              <Button class="bg-white" size="large">{{ $t('seeMore') }}</Button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 购买框 -->
    <Modal v-model="buyModal" class-name="buy-modal" :mask-closable="false">
      <div v-show="buingContant" class="buing-body">
        <div>{{ $t('homeProductName') }}</div>
        <div>{{ purchaseProductInfo.name }}</div>
        <div>{{ $t('addressShippingAddress') }}{{ $t('commonColon') }}</div>
        <div>
          <div class="add-address" @click="addAddress">
            <span v-show="!isEmptyObject(selectedAddressInfo)">{{ selectedAddressInfo.name }}， {{ selectedAddressInfo.mobile }}， {{ selectedAddressInfo.address }}</span>
            <span v-show="isEmptyObject(selectedAddressInfo)" class="text-black-50">{{ $t('addressAddShippingAddress') }}</span>
            <Icon v-show="isEmptyObject(selectedAddressInfo)" class="font-weight-bold" type="ios-add-circle-outline" color="#000000" size="18" :title="$t('homeAddAddress')" />
            <Icon v-show="!isEmptyObject(selectedAddressInfo)" class="font-weight-bold" type="ios-create-outline" color="#000000" size="18" :title="$t('homeModifyAddress')" />
          </div>
        </div>
        <div>{{ $t('homePurchaseQuantity') }}</div>
        <div>{{ numberProducts }}</div>
        <div>{{ $t('homeAccountBalance') }}</div>
        <div>{{ userRestCurrent }} USDT</div>
      </div>
      <div v-show="buingTip" slot="header" class="text-center" style="font-size: 20px;border-bottom: 1px solid #ded4ca;padding-bottom: 10px">{{ $t('commonInformation') }}</div>
      <div v-show="buingTip" class="tip text-center">
        {{ $t('homeSureToBuy') }} {{ purchaseProductInfo.name }}, {{ $t('homeTotalPrice') }} {{ _.toNumber(purchaseProductInfo.price) * _.toNumber(numberProducts) }} USTD
        {{ $t('homeSureToBuy1') }}
      </div>
      <div v-show="buingResult" class="buing-result text-center">
        <div v-show="buingSuccess" class="success">
          <Icon type="md-checkmark" color="#ff8b00" size="18" class="mr-2 rounded-circle border border-warning" />
          {{ $t('homeSuccessfulPurchase') }}
        </div>
        <div v-show="buingError" class="success">
          <Icon type="ios-alert-outline" size="18" class="mr-2 rounded-circle font-weight-bold" />
          {{ errorText }}
          <div class="mt-3 text-center">
            <router-link class="text-warning" to="/other/help">{{ $t('homeClickGetRecharge') }}</router-link>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <Button v-show="buingTip" class="mt-4" size="large" @click="buyModal = false">{{ $t('commonCancel') }}</Button>
        <Button v-show="buingContant" class="mt-4" type="warning" size="large" @click="handleBuyProducts">{{ $t('buyItNow') }}</Button>
        <Button v-show="buingTip" class="mt-4" type="warning" size="large" @click="doBuyProducts">{{ $t('commonConfirm') }}</Button>
      </div>
    </Modal>
    <!-- 购买阅读 -->
    <zrArgreenment :states="buyReading" :title="purchaseIllustrateTitle" :content="purchaseIllustrateContent" @yes="yesArgreenment" @close="closeBuyReading" />
    <!-- 选择收货地址 -->
    <selectingAddress
      :states="selectingModal"
      :address="listUserAddress"
      :currentAddressId="selectedAddressId"
      @update="updateDeliveryAddress"
      @yes="onSelectedAddress"
      @close="closeSelectingAddress"
    />
    <!-- 开通框 -->
    <zrGrantModal
      :state="grantModal"
      :hackReset="hackReset"
      :grantArray="grantArray"
      :grantList="grantIdList"
      :grantStep="grantStep"
      :grantInvitedCode="userInvitedCode"
      :grantDueTime="grantDueTime"
      @addBoxId="addBoxId"
      @grant="handleGrant"
      @grantOk="handleGrantOk"
      @closeModal="handleCloseGrantModal"
    />
    <!-- 购买时长协议框 -->
    <purchaseTimeAgreement
      :isShow="isShowPurchaseTimeAgreement"
      :title="purchaseIllustrateTitle"
      :content="purchaseIllustrateContent"
      @yes="onPurchaseTimeAgreement"
      @close="closePurchaseTimeAgreement"
    />
    <!-- 购买时长 -->
    <purchaseTimeCardModal :state="isShowPurchaseTimeModal" :userRest="userRestCurrent" @purchaseTimeOrder="handlePurchaseTimeOrder" @closeModal="handleClosePurchaseTimeModal" />
    <!-- 支付结果对话框 -->
    <purchase-result-modal :isShow="isShowResultModal" :isSuccess="isResultSuccess" :errorText="errorText" @onCancel="closeShowResultModal"></purchase-result-modal>
    <zrFooter />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CommonService from '@/service/common-service';
import AccountService from '@/service/account-service';
import zrHeader from '@/components/header';
import zrFooter from '@/components/footer';
import zrNumbering from '@/components/numbering'; // 引入加减器
import zrArgreenment from '@/components/buing/buyReading'; // 引入阅读协议框
import selectingAddress from '@/components/buing/selectingAddress'; // 引入选择地址框
import zrGrantModal from '@/components/granting'; //引入开通框
import purchaseTimeAgreement from '@/components/purchaseTimeAgreement'; // 购买时长协议框
import purchaseTimeCardModal from '@/components/purchaseTimeCard'; // 购买时长
import purchaseResultModal from '@/components/public/purchase-result-modal'; // 结果对话框
import CommonFunc from '@/utils/common';
import { setCookie, getCookie } from '@/libs/util';
export default {
  name: 'Home',
  components: {
    zrHeader,
    zrFooter,
    zrNumbering,
    zrArgreenment,
    selectingAddress,
    zrGrantModal,
    purchaseTimeCardModal,
    purchaseTimeAgreement,
    purchaseResultModal
  },
  data() {
    return {
      modalVisible: false,
      routeFromPage: this.$route.params.fromPage,
      routeAnchorName: this.$route.params.anchorName,
      isShowPurchaseTimeAgreement: false,
      isShowPurchaseTimeModal: false,
      hackReset: true,
      userInvitedCode: '',
      banners: [],
      // 轮播图配置项
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        loop: true,
        autoplay: {
          delay: 15000
        }
      },
      isBtnDisabled: false,
      userRestCurrent: '0', // 用户当前余额
      boxParam: '1', // 入参：盒子
      timeCardParam: '2', // 入参：时长卡
      listPurchaseProducts: [], // 产品购买 列表
      listProductsNumber: [], // id: number
      listUserAddress: [], // 收货地址
      selectedAddressInfo: {}, // 从选择地址框带过来的数据
      selectedAddressId: -1,
      numberProducts: 1,
      buyReading: false, // 阅读协议
      purchaseProductInfo: {}, // 点击购买的产品信息
      purchaseTimeCardInfo: {}, // 点击购买的时长卡信息
      purchaseIllustrateTitle: '',
      purchaseIllustrateContent: '',
      buyModal: false,
      buingContant: true,
      selectingModal: false, //选择收货地址框
      address: [
        {
          id: 0,
          name: '全易',
          mobile: '13300211109',
          address: '中国，北京市昌平区回龙观'
        },
        {
          id: 1,
          name: '丫丫',
          mobile: '15053634242',
          address: '中国，北京市朝阳区望京'
        }
      ],
      grantModal: false, // 开通框
      grantArray: [{ boxId: '' }],
      grantList: [
        {
          id: '01279837432',
          password: '42343123112'
        },
        {
          id: '7632245664',
          password: '23445895444'
        },
        {
          id: '236676611234',
          password: '12345679876'
        },
        {
          id: '4675432123',
          password: '9876541232'
        }
      ],
      grantIdList: [],
      grantDueTime: '',
      grantStep: 1, // 开通的对话框
      selectingAdress: {}, // 从选择地址框带过来的数据
      buingTip: false, // 购买框的内容
      buingResult: false, // 返回结果：购买成功还是失败？
      buingSuccess: false, //成功
      buingError: false, //失败
      errorText: this.$t('homeFailedPurchase'), // 购买失败的原因
      renewals: [],
      intros: [],
      campaigns: [],
      initFinishFuncNum: 0,
      isShowResultModal: false,
      isResultSuccess: false
    };
  },
  filters: {
    formatDate: function(val) {
      let resStr = '';
      if (val) {
        const val1 = val.replace(/-/g, '.');
        const array = val1.split(' ');
        if (Array.prototype.isPrototypeOf(array) && array.length > 1) {
          resStr = array[0];
        } else {
          resStr = val1;
        }
      }

      return resStr;
    },
    numFilter(value) {
      const res = CommonFunc.cutOutNum(value);
      if (res === '--') {
        return value;
      } else {
        return res;
      }
    }
  },
  computed: {
    langLocal() {
      // console.log('computed $i18n langLocal', this.$store.state.app.local);
      this.initPage();
      return this.$store.state.app.local;
    }
    // content() {
    //   console.log("computed $i18n content", this.$t("content"));
    //   return this.$t("content");
    // },
  },
  created() {
    // console.log("$i18n", this.$i18n.locale);
    // console.log("$config", this.$config.appid, this.$config.secret);
    // console.log("created $i18n locale", this.$store.state.app.local);
    window.document.title = this.$config.title;

    // if (CommonFunc.getCookie("authorization")) {
    //   this.initPageData();
    // } else {
    //   // 获取Token
    //   this.fetchToken();
    // }

    // const resLogin = this.checkInitLogin();
    // if (resLogin) {
    //   this.userInvitedCode = this.fetchuserInvitedCode();
    // }

    // this.getAddresstList();
    // setTimeout(() => {
    //   this.initAnchorLink();
    // }, 1000);
  },
  /*   mounted() {
    window.onscroll = () => {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      console.log(top);
    };
    this.$nextTick(() => {
      console.log("banner：", this.$refs.banner.offsetTop);
      console.log("产品购买", this.$refs.product.offsetTop);
      console.log("续费：", this.$refs.renewals.offsetTop);
      console.log("产品介绍：", this.$refs.intros.offsetTop);
      console.log("推广活动：", this.$refs.campaigns.offsetTop);
    });
  }, */
  methods: {
    ...mapActions(['handleAuthorization']),
    initPage() {
      if (CommonFunc.getCookie('authorization')) {
        this.initPageData();
      } else {
        // 获取Token
        this.fetchToken();
      }

      const resLogin = this.checkInitLogin();
      if (resLogin) {
        this.userInvitedCode = this.fetchuserInvitedCode();
      }
    },
    //Note 锚点跳转
    initAnchorLink() {
      // routeFromPage: this.$route.params.fromPage,
      // routeAnchorName: this.$route.params.anchorName,
      const curPageRouteName = this.$route.name;
      if (this.routeFromPage && this.routeFromPage != curPageRouteName && this.routeAnchorName) {
        const anchorName = '#' + this.routeAnchorName;
        // console.log('initAnchorLink anchorName', anchorName );
        this.$nextTick(() => {
          if (document.querySelector(anchorName)) {
            document.querySelector(anchorName).scrollIntoView(true);
          }
        });
      }
    },
    handleInitAnchorLink(num) {
      if (num != 5) {
        return false;
      }
      this.initAnchorLink();
    },
    handleAnchorLink(paramAnchorName) {
      if (paramAnchorName) {
        const anchorName = '#' + paramAnchorName;
        // console.log('handleAnchorLink anchorName', anchorName );
        this.$nextTick(() => {
          if (document.querySelector(anchorName)) {
            document.querySelector(anchorName).scrollIntoView(true);
          }
        });
      }
    },
    //Note 获取Token
    fetchToken() {
      const params = {
        // appid: "1002",
        // secret: "oiscNJUQFdFeKdTe1qF5yMrOHywP"
        appid: this.$config.appid,
        secret: this.$config.secret
      };
      // CommonService.getToken(params)
      //   .then(res => {
      //     // console.log("getToken res", res);
      //     if (res) {
      //       const { access_token, token_type } = res;
      //       let authToken = `${token_type} ${access_token}`;
      //       // console.log("getToken authToken", authToken);
      //       // CommonFunc.setCookie("authorization", authToken);
      //       setCookie("authorization", authToken);
      //       setTimeout(() => {
      //         this.fetchCarouselList();
      //         this.fetchProductList();
      //         this.getRenewals();
      //         this.getCampaigns();
      //         this.fetchIntrosList();
      //       }, 100);
      //     }
      //   })
      //   .catch(error => {
      //     console.log("getToken error", error);
      //   });
      // console.log("index.vue handleAuthorization start");
      this.handleAuthorization(params)
        .then(res => {
          setTimeout(() => {
            this.fetchCarouselList();
            this.fetchProductList();
            this.getRenewals();
            this.getCampaigns();
            this.fetchIntrosList();
          }, 100);
        })
        .catch(error => {
          console.log('getToken error', error);
        });
    },
    initPageData() {
      this.fetchCarouselList();
      this.fetchProductList();
      this.getRenewals();
      this.getCampaigns();
      this.fetchIntrosList();
    },
    fetchuserInvitedCode() {
      const userInfo = CommonFunc.getLoginUserInfo();
      if (!CommonFunc.isEmptyObject(userInfo) && userInfo.hasOwnProperty('invited_code')) {
        return userInfo.invited_code;
      } else {
        return '';
      }
    },
    /*  testBtn() {
      this.fetchCarouselList();
    }, */
    // 获取轮播图列表
    fetchCarouselList() {
      CommonService.getCarouselList()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            if (data) {
              if (data.length == 1) {
                this.swiperOptions.autoplay = false;
              } else {
                this.banners = [...data];
              }
            } else {
              this.banners = [];
            }
          } else {
            this.banners = [];
          }
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
        })
        .catch(error => {
          this.banners = [];
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
          console.log(error);
        });
    },
    fetchUserInfo(type = 'init') {
      AccountService.getUserInfo()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            const { username, id, rest } = data;
            CommonFunc.setLoginUserInfo(data);
            setCookie('invelinkUserInfo', JSON.stringify(data));
            // console.log("checkHasLogin invelinkUserInfo", invelinkUserInfo);
            CommonFunc.setLoginUserRest(rest);
            setCookie('invelinkUserRest', rest);
            this.userRestCurrent = rest || '0';

            if (type == 'reset') {
              this.userInvitedCode = this.fetchuserInvitedCode();
              this.grantStep = 3;
            }
          }
        })
        .catch(error => {
          console.log('fetchUserInfo error', error);
        });
    },
    /*********** 产品购买 start  ****************/
    //Note 获取[产品购买]列表
    fetchProductList() {
      CommonService.getProductList({
        type: this.boxParam,
        limit: '99'
      })
        .then(res => {
          // console.log("fetchProductList res", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            if (data) {
              this.listPurchaseProducts = [...data];
            } else {
              this.listPurchaseProducts = [];
            }
          } else {
            this.listPurchaseProducts = [];
          }

          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
        })
        .catch(error => {
          this.listPurchaseProducts = [];
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
          console.log(error);
        });
    },
    //Note 跳转至产品详情
    toProductDetail(v) {
      this.$router.push({
        name: 'goods',
        query: {
          productId: v.id
        }
      });
    },
    //Note [立即购买]，先获取购买说明
    debounceOnBuyProducts: _.debounce(function(v) {
      this.onBuyProducts(v);
    }, 1000),
    onBuyProducts(v) {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }
      // 获取用户最新信息
      this.fetchUserInfo();
      // console.log('onBuyProducts v', v);
      if (!CommonFunc.isEmptyObject(v)) {
        if (v.hasOwnProperty('id')) {
          this.numberProducts = 1;
          for (let index = 0; index < this.listProductsNumber.length; index++) {
            const element = this.listProductsNumber[index];
            if (element.id == v.id) {
              this.numberProducts = element.num;
              break;
            }
          }
        } else {
          const that = this;
          CommonFunc.displayMessageTip(this.$t('homeGetProductInformationFailed'), 'warning', that);
          return false;
        }

        // this.userRestCurrent = CommonFunc.getLoginUserRest() || "0";

        this.selectedAddressInfo = {};
        this.fetchAddressList();

        this.purchaseProductInfo = _.assign({}, v);
        this.isBtnDisabled = true;
        CommonService.getPurchaseInstructions({
          headers: { 'Show-Loading': false }
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              const { data } = res;
              this.purchaseIllustrateTitle = data.title || '';
              this.purchaseIllustrateContent = data.content || '';
              setTimeout(() => {
                this.isBtnDisabled = false;
                this.buyReading = true;
              }, 100);
            } else {
              this.isBtnDisabled = false;
            }
          })
          .catch(error => {
            this.isBtnDisabled = false;
            console.log(error);
          });
      } else {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('homeGetProductInformationFailed'), 'warning', that);
      }
    },
    //Note [立即购买]，执行
    handleBuyProducts() {
      const that = this;
      if (CommonFunc.isEmptyObject(this.selectedAddressInfo)) {
        CommonFunc.displayMessageTip(this.$t('homeNoAddress'), 'warning', that);
      } else {
        this.buingContant = false; // 购买信息内容框隐藏
        this.buingTip = true; // 购买确认框显示
      }
    },
    //Note 生成购买订单
    doBuyProducts() {
      this.buingSuccess = false;
      this.buingError = false;
      const params = {
        pid: this.purchaseProductInfo.id,
        num: this.numberProducts,
        ptype: this.boxParam, // 购买类型 1.盒子 2.时长卡
        address_id: this.selectedAddressInfo.id
      };
      CommonService.deviceOrderBuy(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // this.okBuing();
            this.buingSuccess = true; //成功
            this.isResultSuccess = true;
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
            this.errorText = CommonFunc.errorDescBranch(res.code, res.msg, this.$t('homeFailedPurchase'));
          }

          this.buingTip = false; // 购买确认框隐藏
          this.buyModal = false;

          this.isShowResultModal = true;
          if (this.buingSuccess) {
            setTimeout(() => {
              // this.buingResult = false;
              this.isShowResultModal = false;
            }, 950);
          }
          // this.buingResult = true; // 显示购买反馈
          // if (this.buingSuccess) {
          //   setTimeout(() => {
          //     this.buyModal = false;
          //   }, 950);
          // } else {
          //   setTimeout(() => {
          //     this.buyModal = false;
          //   }, 1500);
          // }
        })
        .catch(error => {
          this.buyModal = false;
          console.log(error);
        });
    },
    // 同意购买协议
    yesArgreenment(state) {
      CommonService.deviceOrderAgreeAgent()
        .then(res => {
          // console.log("yesArgreenment", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.buyReading = state;
            this.buingTip = this.buingResult = this.buingSuccess = this.buingError = false;
            this.buyModal = this.buingContant = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 直接关闭了购买信息框
    closeBuyReading(state) {
      this.buyReading = state;
    },
    // 确认购买
    okBuing() {
      this.buingTip = false; // 购买确认框隐藏
      this.buingResult = true; // 显示购买反馈
      this.buingSuccess = true; //成功
      /* this.buingError = true; //失败
      this.errorText = "余额不足，请充值"; */
      if (this.buingSuccess) {
        setTimeout(() => {
          this.buyModal = false;
        }, 950);
      }
    },
    /*********** 产品购买 end  ****************/
    /*********** 开通 start  ****************/
    // 开通按钮
    debounceOnOpenBox: _.debounce(function(v) {
      this.onOpenBox(v);
    }, 1000),
    onOpenBox(data) {
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }
      // 获取用户最新信息
      this.fetchUserInfo();
      // console.log("当前产品：", data);
      this.grantArray = [{ boxId: '' }];
      // this.grantArray[0].boxId = "";
      this.grantStep = 1;
      this.grantModal = true;
    },
    // 开通
    handleGrant(v) {
      console.log('handleGrant', v);
      const that = this;
      if (v && !CommonFunc.isEmptyArray(v)) {
        let boxIdAll = '';
        for (let index = 0; index < v.length; index++) {
          const element = v[index];
          if (element && element.hasOwnProperty('boxId')) {
            boxIdAll += element.boxId + ',';
          }
        }
        if (boxIdAll) {
          boxIdAll = boxIdAll.substring(0, boxIdAll.lastIndexOf(','));
        } else {
          return false;
        }
        // this.grantStep = 2;
        // return false;
        this.isBtnDisabled = true;
        const params = {
          did: boxIdAll
        };
        CommonService.deviceToActive(params)
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              console.log('deviceToActive', res);

              const { data } = res;
              if (data.hasOwnProperty('code')) {
                if (!this.userInvitedCode) {
                  this.userInvitedCode = data.code;
                }
              }

              if (data.hasOwnProperty('data')) {
                // const grantIdListTmp = [...data.data];
                this.grantIdList = [...data.data];
                // for (let index = 0; index < array.length; index++) {
                //   const element = array[index];
                //   if (!element.password) {
                //     this.grantIdList.push({...element, password: "无效的盒子id"})
                //   }

                // }
                this.grantStep = 2;
              }
              this.isBtnDisabled = false;
            } else {
              this.isBtnDisabled = false;
            }
          })
          .catch(error => {
            this.isBtnDisabled = false;
            this.grantModal = false;
            console.log(error);
          });
      } else {
        console.log('handleGrant error', v);
        CommonFunc.displayMessageTip(this.$t('homeActivationFailed'), 'warning', that);
        this.grantModal = false;
      }
    },
    handleGrantOk() {
      // this.grantResult = false;
      // this.trantReading = true;
      const that = this;
      if (!CommonFunc.isEmptyArray(this.grantIdList)) {
        let res = false;
        for (let index = 0; index < this.grantIdList.length; index++) {
          const element = this.grantIdList[index];
          if (element.hasOwnProperty('is_success') && element.is_success == 1) {
            res = true;
            break;
          }
        }

        if (!res) {
          CommonFunc.displayMessageTip(this.$t('homeActivationFailedNotID'), 'warning', that);
          return false;
        }

        if (this.grantIdList[0].hasOwnProperty('due_time')) {
          this.grantDueTime = this.grantIdList[0].due_time;
        } else {
          this.grantDueTime = '';
        }

        // 获取用户最新信息
        this.fetchUserInfo('reset');
        // this.userInvitedCode = this.fetchuserInvitedCode();
        // this.grantStep = 3;
      } else {
        this.grantModal = false;
      }
    },
    //Note 关闭开通窗口
    handleCloseGrantModal() {
      this.grantIdList = [];
      this.grantDueTime = '';
      this.grantModal = false;

      this.hackReset = false; //销毁组件

      this.$nextTick(() => {
        this.hackReset = true; //重建组件
      });
    },
    /*********** 开通 end  ****************/
    /*********** 续费 start  ****************/
    onPurchaseTimeCard: _.debounce(function(v) {
      this.handlePurchaseTimeCard(v);
    }, 1000),
    handlePurchaseTimeCard(v) {
      // this.isShowPurchaseTimeModal = true;
      // return false;
      const resLogin = this.checkLogin();
      if (!resLogin) {
        return false;
      }
      // 获取用户最新信息
      this.fetchUserInfo();
      console.log('onPurchaseTimeCard', v);
      if (!CommonFunc.isEmptyObject(v)) {
        if (v.hasOwnProperty('id')) {
          this.numberProducts = 1;
        } else {
          const that = this;
          CommonFunc.displayMessageTip(this.$t('homeGetProductInformationFailed'), 'warning', that);
          return false;
        }

        // this.userRestCurrent = CommonFunc.getLoginUserRest() || "0";
        // console.log('onPurchaseTimeCard', this.userRestCurrent);

        this.purchaseTimeCardInfo = _.assign({}, v);
        this.isBtnDisabled = true;
        CommonService.getCardPurchaseInstructions({
          headers: { 'Show-Loading': false }
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              const { data } = res;
              this.purchaseIllustrateTitle = data.title || '';
              this.purchaseIllustrateContent = data.content || '';
              setTimeout(() => {
                this.isBtnDisabled = false;
                this.isShowPurchaseTimeAgreement = true;
              }, 100);
            } else {
              this.isBtnDisabled = false;
            }
          })
          .catch(error => {
            this.isBtnDisabled = false;
            console.log(error);
          });
      } else {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('homeGetDurationCardFailed'), 'warning', that);
      }
    },
    onPurchaseTimeAgreement(v) {
      console.log('onPurchaseTimeAgreement', v);
      CommonService.deviceOrderAgreeAgent()
        .then(res => {
          // console.log("yesArgreenment", res);
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            this.isShowPurchaseTimeAgreement = false;
            this.isShowPurchaseTimeModal = true;
          }
        })
        .catch(error => {
          this.isShowPurchaseTimeAgreement = false;
          console.log(error);
        });
    },
    handlePurchaseTimeOrder(v) {
      console.log('handlePurchaseTimeOrder', v);
      const that = this;
      const params = {
        pid: this.purchaseTimeCardInfo.id,
        did: v,
        num: '1',
        ptype: this.timeCardParam // 购买类型 1.盒子 2.时长卡
      };
      CommonService.deviceOrderBuy(params)
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            // this.isShowPurchaseTimeModal = false;
            // CommonFunc.displayMessageTip("购买成功", "warning", that);
            this.isResultSuccess = true;
          } else {
            this.isResultSuccess = false;
            this.errorText = CommonFunc.errorDescBranch(res.code, res.msg, this.$t('homeFailedPurchase'));
          }
          this.isShowPurchaseTimeModal = false;
          this.isShowResultModal = true;
          if (this.isResultSuccess) {
            setTimeout(() => {
              // this.buingResult = false;
              this.isShowResultModal = false;
            }, 950);
          }
        })
        .catch(error => {
          this.isShowPurchaseTimeModal = false;
          CommonFunc.displayMessageTip(this.$t('homeFailedPurchase'), 'warning', that);
          console.log(error);
        });
    },
    handleClosePurchaseTimeModal() {
      this.isShowPurchaseTimeModal = false;
    },
    closePurchaseTimeAgreement() {
      this.isShowPurchaseTimeAgreement = false;
    },
    /*********** 续费 end  ****************/
    /*********** 推广活动 start  ****************/
    toNewsDetail(v) {
      console.log('toNewsDetail', v);

      this.$router.push({
        name: 'details',
        query: {
          newsId: v.id
        }
      });
    },
    /*********** 推广活动 end  ****************/
    /*********** 基本方法 start  ****************/
    // 商品 加
    addNumberProduct(num, id) {
      if (num && id) {
        // console.log(id, num + "个");
        if (CommonFunc.isEmptyArray(this.listProductsNumber)) {
          this.listProductsNumber.push({ id: id, num: num });
        } else {
          let idx = 0;
          this.listProductsNumber.map((item, index) => {
            if (item.id == id) {
              idx = index;
            }
            return item;
          });
          this.$set(this.listProductsNumber[idx], `num`, num);
        }
      }
      // console.log("addNumberProduct", this.listProductsNumber);
    },
    // 商品 减
    reduceNumberProduct(num, id) {
      // console.log(id, num + "个");
      if (num && id) {
        let idx = 0;
        this.listProductsNumber.map((item, index) => {
          if (item.id == id) {
            idx = index;
          }
          return item;
        });
        this.$set(this.listProductsNumber[idx], `num`, num);
      }
      // console.log("reduceNumberProduct", this.listProductsNumber);
    },
    changeNumberProduct(num, id) {
      // console.log(id, num + "个");
      if (num && id) {
        // console.log(id, num + "个");
        if (CommonFunc.isEmptyArray(this.listProductsNumber)) {
          this.listProductsNumber.push({ id: id, num: num });
        } else {
          let idx = 0;
          this.listProductsNumber.map((item, index) => {
            if (item.id == id) {
              idx = index;
            }
            return item;
          });
          this.$set(this.listProductsNumber[idx], `num`, num);
        }
      }
      // console.log("changeNumberProduct", this.listProductsNumber);
    },
    prohibitZeroProduct() {
      const that = this;
      CommonFunc.displayMessageTip(this.$t('homePlsEnterValidNumber'), 'warning', that);
    },
    //Note 获取收货地址列表
    fetchAddressList() {
      CommonService.getAddressList({
        headers: { 'Show-Loading': false }
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
      // console.log("选择过来的收货地址：", data);
      if (!CommonFunc.isEmptyObject(data)) {
        this.selectedAddressInfo = { ...data };
        this.selectingModal = state;
        this.buyModal = true;
      } else {
        console.log('error 选择过来的收货地址：', data);
        const that = this;
        CommonFunc.displayMessageTip(this.$t('homeAddressSelectionFailed'), 'warning', that);
      }
    },
    //Note 判断是否登录
    checkInitLogin() {
      const res = CommonFunc.isLoginByCheck();
      if (!res) {
        return false;
      } else {
        return true;
      }
    },
    checkLogin() {
      const res = CommonFunc.isLoginByCheck();
      if (!res) {
        const that = this;
        CommonFunc.displayMessageTip(this.$t('loginPlsLogFirst'), 'info', that);
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
    //Note 依据每个元素内对象的sort值排序，sort越大越靠前
    quickOrder(arr, keyName) {
      let left = [];
      let right = [];
      if (CommonFunc.isEmptyArray(arr)) {
        return [];
      }
      if (arr.length <= 1) {
        return arr;
      }
      if (!keyName) {
        return arr;
      }
      // console.log('quickOrder');

      const firstArr = arr.splice(0, 1);
      const first = firstArr[0];
      for (let i = 0; i < arr.length; i++) {
        if (!CommonFunc.isEmptyObject(first) && first.hasOwnProperty(keyName)) {
          // console.log('quickOrder first 1', first);
          if (!CommonFunc.isEmptyObject(arr[i]) && arr[i].hasOwnProperty(keyName)) {
            // console.log('quickOrder ', i, arr[i]);

            if (_.toNumber(first[keyName]) < _.toNumber(arr[i][keyName])) {
              left.push(arr[i]);
            } else {
              right.push(arr[i]);
            }
          } else {
            left.push(arr[i]);
          }
        } else {
          // console.log('quickOrder first 2', first);
          left.push(arr[i]);
        }
      }
      return this.quickOrder(left).concat(first, this.quickOrder(right));
    },
    /*********** 基本方法 end  ****************/
    // 获取续费产品列表
    getRenewals() {
      CommonService.getProductList({
        type: this.timeCardParam
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            if (data) {
              // this.renewals = [...data];
              // console.log("getRenewals getProductList 1", this.renewals);
              this.renewals = this.quickOrder(data, 'sort');
              // console.log("getRenewals getProductList 2", this.renewals);
            } else {
              this.renewals = [];
            }
          } else {
            this.renewals = [];
          }
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
        })
        .catch(error => {
          this.renewals = [];
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
          console.log(error);
        });
    },
    // 获取产品介绍列表
    fetchIntrosList() {
      CommonService.getProductInstructions({
        limit: '3'
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            if (data && data.hasOwnProperty('data')) {
              // this.intros = [...data];
              this.intros = this.quickOrder(data.data, 'sort');
            } else {
              this.intros = [];
            }
          } else {
            this.intros = [];
          }
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
        })
        .catch(error => {
          this.intros = [];
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
          console.log(error);
        });
    },
    // 获取推广活动列表
    getCampaigns() {
      CommonService.getPushActivity({
        limit: '3'
      })
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            if (data && data.hasOwnProperty('data')) {
              // this.campaigns = [...data];
              this.campaigns = this.quickOrder(data.data, 'sort');
            } else {
              this.campaigns = [];
            }
          } else {
            this.campaigns = [];
          }
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
        })
        .catch(error => {
          this.campaigns = [];
          this.initFinishFuncNum += 1;
          this.handleInitAnchorLink(this.initFinishFuncNum);
          console.log(error);
        });
    },
    // 添加收货地址
    addAddress() {
      // console.log("addAddress");
      const selectedAddressInfoTmp = this.selectedAddressInfo;
      if (selectedAddressInfoTmp && selectedAddressInfoTmp.hasOwnProperty('address') && selectedAddressInfoTmp.hasOwnProperty('mobile')) {
        this.selectedAddressDesc = selectedAddressInfoTmp.address;
        this.selectedAddressMobile = selectedAddressInfoTmp.mobile;
      } else {
        this.selectedAddressDesc = '';
        this.selectedAddressMobile = '';
      }

      this.selectedAddressId = -1;
      if (this.selectedAddressDesc && this.selectedAddressMobile) {
        for (let index = 0; index < this.listUserAddress.length; index++) {
          const element = this.listUserAddress[index];
          if (element.address == this.selectedAddressDesc && element.mobile == this.selectedAddressMobile) {
            this.selectedAddressId = element.id;
            break;
          }
        }
      }

      this.buyModal = false;
      this.selectingModal = true;
    },
    // 立即购买按钮
    buing() {
      if (JSON.stringify(this.selectingAdress) == '{}') {
        // this.$Message.info({
        //   content: '没有地址，请问送到哪里呢？',
        //   duration: 3
        // });
        const that = this;
        CommonFunc.displayMessageTip(this.$t('homeNoAddress'), 'warning', that);
      } else {
        this.buingContant = false; // 购买信息内容框隐藏
        this.buingTip = true; // 购买确认框显示
      }
    },
    closeShowResultModal() {
      this.isShowResultModal = false;
    },
    updataAdress() {
      console.log('更新地址');
    },
    // 直接关闭了收货地址框
    closeSelectingAddress(state) {
      this.buyModal = true;
      this.selectingModal = state;
    },
    addBoxId() {
      this.grantArray.push({ boxId: '' });
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
.newsDetailTip {
  font-size: 18px;
  font-family: Montserrat;
  font-weight: 500;
  color: rgba(255, 139, 0, 1);
  line-height: 1.1;
  float: left;
}
.newsDetailTip:hover {
  color: #ff3333;
  cursor: pointer;
}
// 轮播图
/deep/.swiper-container {
  z-index: 0;
  .swiper-wrapper {
    .swiper-slide {
      img {
        width: 100%;
      }
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    transition: 0.6s;
    display: none;
    transform: translateY(-15px);
    &::after {
      content: '';
    }
    &:focus {
      outline: none;
    }
    .ivu-icon {
      outline: none;
    }
  }
  .swiper-button-prev {
    left: 21%;
  }
  .swiper-button-next {
    right: 21%;
  }
  .swiper-pagination {
    .swiper-pagination-bullet {
      opacity: 0.1;
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
      transition: 0.6s;
      width: 38px;
      border-radius: 10px;
      background-color: white;
    }
  }
}
.swiper-container:hover .swiper-button-prev,
.swiper-container:hover .swiper-button-next {
  display: block;
  transform: translateY(-15px);
}
.ivu-btn-warning {
  background-color: #ff8b00;
  border-color: #ff8b00;
  font-size: 16px;
}

// 自定义样式
.title {
  font-size: 22px;
  .bb {
    width: 70px;
    height: 3px;
    background-color: #ff8b00;
    margin: 46px auto;
  }
}
.product,
.renewals,
.intros {
  padding: 100px 0;
}
.campaigns {
  padding-top: 100px;
}
.orange {
  color: #ff8400;
}
// 产品购买
.product {
  .list {
    margin-bottom: 80px;
    img {
      width: 100%;
    }
    &:last-child {
      margin-bottom: 0;
    }
    .right {
      .btns {
        .ivu-btn {
          font-size: 16px;
        }
      }
    }
  }
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
/deep/.description {
  img {
    display: none;
  }
}
//续费
.renewals {
  .list {
    .content {
      background-image: url('../../assets/images/renewals-bg.png');
      background-repeat: no-repeat;
      .activity {
        .description {
          line-height: 24px;
        }
      }
      .ivu-btn-warning {
        width: 90%;
        height: 50px;
      }
    }
  }
}
//产产品介绍
.intros,
.campaigns {
  .col-sm-4 {
    .img {
      img {
        width: 100%;
      }
    }
    .name {
      font-size: 20px;
    }
  }
  .ivu-btn {
    height: 50px;
    width: 280px;
    font-size: 18px;
  }
}

.campaigns {
  background-color: #f9f9f9;
  .col-sm-4 {
    a {
      color: #ff8b00;
      font-size: 18px;
    }
  }
}
/* 小于等于 769px */
@media (max-width: 767px) {
  .swiper-container {
    .swiper-button-prev,
    .swiper-button-next {
      display: none !important;
    }
  }

  /deep/.ivu-modal-content {
    padding: 0 !important;
    .buing-body {
      grid-template-columns: 82px 70%;
    }
  }
  // 通用样式
  .description {
    text-align: left;
    word-break: break-all;
    overflow: hidden;
    height: 85px;
  }
  // 产品
  .product {
    .list {
      padding: 20px 10px;
      margin: 0 15px 50px;
      .right {
        .name {
          font-size: 22px;
          margin-top: 15px;
        }
        .d-flex {
          justify-content: space-between;
          .price {
            font-size: 22px;
          }
        }
        .btns {
          display: flex;
          justify-content: space-around;
          .w-42 {
            width: 42%;
          }
        }
      }
    }
  }
  //续费
  .renewals {
    .row {
      margin-right: 0;
      margin-left: 0;
      .list {
        .content {
          padding: 30px 20px;
          margin-bottom: 38px;
          h1 {
            font-size: 26px;
          }
          .price {
            .new-price {
              font-size: 28px;
            }
          }
          .activity {
            h1 {
              font-size: 20px;
            }
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  // 产品介绍
  .intros {
    .list {
      img {
        width: 100%;
      }
      .right {
        h1 {
          margin-top: 12px;
          font-size: 20px;
        }
      }
    }
  }
  // 推广活动
  .campaigns {
    .col-12 {
      margin-bottom: 100px !important;
    }
  }
}

/* 大于等于 769px */
@media (min-width: 768px) {
  .product,
  .renewals,
  .intros,
  .campaigns {
    padding: 100px 0;
    .title {
      font-size: 30px;
    }
  }
  // 产品
  .product {
    .list {
      padding: 70px 36px;
      display: flex;
      align-items: flex-end;
      .right {
        .name,
        .price {
          font-size: 30px;
        }
        .description {
          line-height: 24px;
        }
        .d-flex {
          .price {
            margin-right: 35px;
          }
        }
        .btns {
          .ivu-btn-warning,
          .ivu-btn-default {
            height: 52px;
          }
          .ivu-btn-warning {
            width: 55%;
            margin-right: 24px;
          }
          .ivu-btn-default {
            width: 35%;
          }
        }
      }
    }
  }
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

  //续费
  .renewals {
    .content {
      padding: 55px;
      .name {
        font-size: 32px;
      }
      .price {
        .new-price {
          font-size: 42px;
        }
        .old-price {
          font-size: 20px;
          text-decoration: line-through;
        }
      }
      .activity {
        .tittle {
          font-size: 22px;
        }
      }
    }
  }
  // 产品介绍
  .intros {
    .list {
      .col-sm-5 {
        text-align: right;
        img {
          width: 78%;
        }
      }
      .col-sm-7 {
        .name {
          font-size: 22px;
        }
        .description {
          width: 70%;
          word-break: break-all;
          line-height: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
    .col-sm-4 {
      .img {
        img {
          height: 120px;
        }
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  // 推广活动
  .campaigns {
    .col-sm-4 {
      .img {
        img {
          height: 120px;
        }
      }
      .description {
        overflow: hidden;
        height: 44px;
      }
    }
  }
}
@media (min-width: 976px) {
  // 产品介绍
  .intros {
    .col-sm-4 {
      .img {
        img {
          height: 170px;
        }
      }
    }
  }
  // 推广活动
  .campaigns {
    .col-sm-4 {
      .img {
        img {
          height: 170px;
        }
      }
    }
  }
}

@media (min-width: 1200px) {
  // 产品介绍
  .intros {
    .col-sm-4 {
      .img {
        img {
          height: 220px;
        }
      }
    }
  }
  // 推广活动
  .campaigns {
    .col-sm-4 {
      .img {
        img {
          height: 220px;
        }
      }
    }
  }
}
</style>
