<template>
  <div class="goods">
    <!-- <zrToast/> -->
    <zrHeader ref="zrheader" @toPageAnchor="handleToPageAnchor" />
    <div class="bg-white">
      <div class="container">
        <div class="title pt-5 pb-3 mb-5">{{ productDetailInfo.name }}</div>
        <div class="row mb-5">
          <div class="col-12 col-sm-5 left">
            <img :src="productDetailInfo.picture" alt />
          </div>
          <div class="col-12 col-sm-7 right">
            <h1>{{ productDetailInfo.name }}</h1>
            <p class="price1 mt-2 mb-4">{{ "$" + productDetailInfo.price }}</p>
            <p
              class="text-black-50 mb-3"
              v-html="productDetailInfo.introduction"
            ></p>
            <div class="mobile-view">
              <p class="price2 mt-2 mb-4">
                ${{ "$" + productDetailInfo.price }}
              </p>
              <zrNumbering
                :itemId="productDetailInfo.id"
                @adding="addNumberProduct"
                @reduce="reduceNumberProduct"
                @change="changeNumberProduct"
                @prohibitZero="prohibitZeroProduct"
              />
            </div>
            <div class="btns mt-4">
              <button
                class="btn btn-lg text-white buing"
                :disabled="isBtnDisabled"
                @click="debounceOnBuyProducts(productDetailInfo)"
              >
                {{ $t("buyItNow") }}
              </button>
              <Button
                class="rounded"
                :disabled="isBtnDisabled"
                @click="debounceOnOpenBox(productDetailInfo)"
                >{{ $t("opening") }}</Button
              >
            </div>
          </div>
        </div>
        <div
          class="details pb-5"
          style="min-height: 200px;"
          v-html="productDetailInfo.content"
        >
          <!-- {{ productDetailInfo.content }} -->
          <!--  v-html="productDetailInfo.content" -->
          <!-- <img src="../../assets/images/test.jpeg" alt style="width: 100%;" /> -->
        </div>
      </div>
    </div>
    <div
      v-if="
        !$config.useI18n ||
          ($config.useI18n && langLocal === $config.languageDefine.test)
      "
    >
      {{ langLocal }}
    </div>
    <!-- 购买框 -->
    <Modal v-model="buyModal" class-name="buy-modal" :mask-closable="false">
      <div v-show="buingContant" class="buing-body">
        <div>{{ $t("homeProductName") }}</div>
        <div>{{ productDetailInfo.name }}</div>
        <div>{{ $t("addressShippingAddress") }}{{ $t("commonColon") }}</div>
        <div>
          <div class="add-address" @click="addAddress">
            <span v-show="!isEmptyObject(selectedAddressInfo)"
              >{{ selectedAddressInfo.name }}，
              {{ selectedAddressInfo.mobile }}，
              {{ selectedAddressInfo.address }}</span
            >
            <span
              v-show="isEmptyObject(selectedAddressInfo)"
              class="text-black-50"
              >{{ $t("addressAddShippingAddress") }}</span
            >
            <Icon
              v-show="isEmptyObject(selectedAddressInfo)"
              class="font-weight-bold"
              type="ios-add-circle-outline"
              color="#000000"
              size="18"
              :title="$t('homeAddAddress')"
            />
            <Icon
              v-show="!isEmptyObject(selectedAddressInfo)"
              class="font-weight-bold"
              type="ios-create-outline"
              color="#000000"
              size="18"
              :title="$t('homeModifyAddress')"
            />
          </div>
        </div>
        <div>{{ $t("homePurchaseQuantity") }}</div>
        <div>{{ numberProducts }}</div>
        <div>{{ $t("homeAccountBalance") }}</div>
        <div>{{ userRestCurrent }} USDT</div>
      </div>
      <div
        v-show="buingTip"
        slot="header"
        class="text-center"
        style="font-size: 20px;border-bottom: 1px solid #ded4ca;padding-bottom: 10px"
      >
        {{ $t("commonInformation") }}
      </div>
      <div v-show="buingTip" class="tip text-center">
        {{ $t("homeSureToBuy") }}
        {{ productDetailInfo.name}}，
        {{ $t("homeTotalPrice") }}
        {{ _.toNumber(productDetailInfo.price) * _.toNumber(numberProducts) }}
        USTD
        {{ $t("homeSureToBuy1") }}
      </div>
      <div v-show="buingResult" class="buing-result text-center">
        <div v-show="buingSuccess" class="success">
          <Icon
            type="md-checkmark"
            color="#ff8b00"
            size="18"
            class="mr-2 rounded-circle border border-warning"
          />{{ $t("homeSuccessfulPurchase") }}
        </div>
        <div v-show="buingError" class="success">
          <Icon
            type="ios-alert-outline"
            size="18"
            class="mr-2 rounded-circle font-weight-bold"
          />
          {{ errorText }}
          <div class="mt-3 text-center">
            <router-link class="text-warning" to="/other/help">{{
              $t("homeClickGetRecharge")
            }}</router-link>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <Button
          v-show="buingTip"
          class="mt-4"
          size="large"
          @click="buyModal = false"
          >{{ $t("commonCancel") }}</Button
        >
        <Button
          v-show="buingContant"
          class="mt-4"
          type="warning"
          size="large"
          @click="handleBuyProducts"
          >{{ $t("buyItNow") }}</Button
        >
        <Button
          v-show="buingTip"
          class="mt-4"
          type="warning"
          size="large"
          @click="doBuyProducts"
          >{{ $t("commonConfirm") }}</Button
        >
      </div>
    </Modal>
    <!-- 购买阅读 -->
    <zrArgreenment
      :states="buyReading"
      :title="purchaseIllustrateTitle"
      :content="purchaseIllustrateContent"
      @yes="yesArgreenment"
      @close="closeBuyReading"
    />
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
    <!-- 支付结果对话框 -->
    <purchase-result-modal
      :isShow="isShowResultModal"
      :isSuccess="isResultSuccess"
      :errorText="errorText"
      @onCancel="closeShowResultModal"
    ></purchase-result-modal>
    <zrFooter />
  </div>
</template>

<script>
import CommonService from "@/service/common-service";
import AccountService from "@/service/account-service";
import zrHeader from "@/components/header";
import zrFooter from "@/components/footer";
import zrNumbering from "@/components/numbering"; // 引入加减器
import zrArgreenment from "@/components/buing/buyReading"; // 引入阅读协议框
import selectingAddress from "@/components/buing/selectingAddress"; // 引入选择地址框
import zrGrantModal from "@/components/granting"; //引入开通框
import purchaseResultModal from "@/components/public/purchase-result-modal"; // 结果对话框
import CommonFunc from "@/utils/common";
import { setCookie, getCookie } from "@/libs/util";
export default {
  name: "goods",
  components: {
    zrNumbering,
    zrHeader,
    zrFooter,
    zrArgreenment,
    selectingAddress,
    zrGrantModal,
    purchaseResultModal
  },
  data() {
    return {
      routeProductInfo: this.$route.query.productId,
      productDetailInfo: {},
      purchaseIllustrateTitle: "",
      purchaseIllustrateContent: "",
      grantArray: [{ boxId: "" }],
      selectedAddressInfo: {}, // 从选择地址框带过来的数据
      selectedAddressId: -1,
      userRestCurrent: "0", // 用户当前余额
      boxParam: "1", // 入参：盒子
      timeCardParam: "2", // 入参：时间卡
      listPurchaseProducts: [], // 产品购买 列表
      listProductsNumber: [], // id: number
      listUserAddress: [], // 收货地址
      numberProducts: 1,
      isShowResultModal: false,
      isResultSuccess: false,
      isBtnDisabled: false,
      goods: {
        title: "出马了撒份未发啦受封为哦分拉萨封你为哦",
        price: 9143,
        description:
          "女啦发呢我浪费NSA，能访问拉尔夫你三年分裂无法十大，驸马武林风是，麻烦你李维诺夫你身份呢客服呢，萨芬那位妇女，是都能",
        details:
          "麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，你发裂缝你，沙发了发你，什么地方能力为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么为南方，萨凡纳违反你是，得分能力外发你，萨马诺夫为妇女啊，是麻烦你晚饭是，方面呢啊我恐惧愤怒阿森纳，发卡韦杰夫是那么饭卡无法，是没法卡违法仨卖的妇女啊我看减肥呢么"
      },
      number: 1,
      buyReading: false, // 阅读协议
      buyModal: false,
      buingContant: true,
      selectingModal: false, //选择收货地址框
      address: [
        {
          id: 0,
          name: "全易",
          mobile: "13300211109",
          address: "中国，北京市昌平区回龙观"
        },
        {
          id: 1,
          name: "丫丫",
          mobile: "15053634242",
          address: "中国，北京市朝阳区望京"
        }
      ],
      selectingAdress: {}, // 从选择地址框带过来的数据
      buingTip: false, // 购买框的内容
      buingResult: false, // 返回结果：购买成功还是失败？
      buingSuccess: false, //成功
      buingError: false, //失败
      errorText: this.$t("homeFailedPurchase"), // 购买失败的原因
      grantModal: false, // 开通框
      grantForm: [{ boxId: "" }],
      grantList: [
        {
          id: "01279837432",
          password: "42343123112"
        },
        {
          id: "7632245664",
          password: "23445895444"
        },
        {
          id: "236676611234",
          password: "12345679876"
        },
        {
          id: "4675432123",
          password: "9876541232"
        }
      ],
      hackReset: true,
      userInvitedCode: "",
      grantIdList: [],
      grantDueTime: "",
      grantStep: 1 // 开通的对话框
    };
  },
  created() {
    this.$nextTick(() => {
      this.backTop();
    });
    // //Note 获取产品详情
    // this.fetchProductDetail();
  },
  computed: {
    langLocal() {
      //Note 获取产品详情
      this.fetchProductDetail();
      return this.$store.state.app.local;
    }
  },
  methods: {
    //Note 获取产品详情
    fetchProductDetail() {
      if (this.routeProductInfo) {
        const params = {
          pid: this.routeProductInfo
        };
        CommonService.getProductDetail(params)
          .then(res => {
            console.log("fetchProductDetail res", res);
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              const { data } = res;
              this.productDetailInfo = _.assign({}, data);
            }
          })
          .catch(error => {
            console.log("fetchProductDetail error", error);
          });
      }
    },
    fetchUserInfo(type = 'init') {
      AccountService.getUserInfo()
        .then(res => {
          if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
            const { data } = res;
            const { username, id, rest } = data;
            CommonFunc.setLoginUserInfo(data);
            setCookie("invelinkUserInfo", JSON.stringify(data));
            // console.log("checkHasLogin invelinkUserInfo", invelinkUserInfo);
            CommonFunc.setLoginUserRest(rest);
            setCookie("invelinkUserRest", rest);
            this.userRestCurrent = rest || "0";

            if (type == 'reset') {
              this.userInvitedCode = this.fetchuserInvitedCode();
              this.grantStep = 3;
            }
          }
        })
        .catch(error => {
          console.log("fetchUserInfo error", error);
        });
    },
    /*********** 购买 start  ****************/
    //Note 获取[产品购买]列表
    fetchProductList() {
      CommonService.getProductList({
        type: this.boxParam,
        limit: "99"
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
        name: "goods",
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
      // console.log("onBuyProducts v", v);
      if (!CommonFunc.isEmptyObject(v)) {
        if (v.hasOwnProperty("id")) {
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
          CommonFunc.displayMessageTip(this.$t("homeGetProductInformationFailed"), "warning", that);
          return false;
        }

        // this.userRestCurrent = CommonFunc.getLoginUserRest() || "0";

        this.selectedAddressInfo = {};
        this.fetchAddressList();

        this.purchaseProductInfo = _.assign({}, v);
        this.isBtnDisabled = true;
        CommonService.getPurchaseInstructions({
          headers: { "Show-Loading": false }
        })
          .then(res => {
            if (res.code == Consts.CODEDESC.RESP_SUCCESS) {
              const { data } = res;
              this.purchaseIllustrateTitle = data.title || "";
              this.purchaseIllustrateContent = data.content || "";
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
        CommonFunc.displayMessageTip(this.$t("homeGetProductInformationFailed"), "warning", that);
      }
    },
    //Note [立即购买]，执行
    handleBuyProducts() {
      const that = this;
      if (CommonFunc.isEmptyObject(this.selectedAddressInfo)) {
        CommonFunc.displayMessageTip(
          this.$t("homeNoAddress"),
          "warning",
          that
        );
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
            this.errorText = CommonFunc.errorDescBranch(
              res.code,
              res.msg,
              this.$t("homeFailedPurchase")
            );
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
      this.grantArray = [{ boxId: "" }];
      // this.grantArray[0].boxId = "";
      this.grantStep = 1;
      this.grantModal = true;
    },
    // 开通
    handleGrant(v) {
      // console.log("handleGrant", v);
      const that = this;
      if (v && !CommonFunc.isEmptyArray(v)) {
        let boxIdAll = "";
        for (let index = 0; index < v.length; index++) {
          const element = v[index];
          if (element && element.hasOwnProperty("boxId")) {
            boxIdAll += element.boxId + ",";
          }
        }
        if (boxIdAll) {
          boxIdAll = boxIdAll.substring(0, boxIdAll.lastIndexOf(","));
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
              // console.log("deviceToActive", res);

              const { data } = res;
              if (data.hasOwnProperty('code')) {
                if (!this.userInvitedCode) {
                  this.userInvitedCode = data.code
                }
              }

              if (data.hasOwnProperty("data")) {
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
        console.log("handleGrant error", v);
        CommonFunc.displayMessageTip(this.$t("homeActivationFailed"), "warning", that);
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
          if (element.hasOwnProperty("is_success") && element.is_success == 1) {
            res = true;
            break;
          }
        }

        if (!res) {
          CommonFunc.displayMessageTip(
            this.$t("homeActivationFailedNotID"),
            "warning",
            that
          );
          return false;
        }

        if (this.grantIdList[0].hasOwnProperty("due_time")) {
          this.grantDueTime = this.grantIdList[0].due_time;
        } else {
          this.grantDueTime = "";
        }

        // 获取用户最新信息
        this.fetchUserInfo('reset');
        // this.grantStep = 3;
      } else {
        this.grantModal = false;
      }
    },
    //Note 关闭开通窗口
    handleCloseGrantModal() {
      this.grantIdList = [];
      this.grantDueTime = "";
      this.grantModal = false;

      this.hackReset = false; //销毁组件

      this.$nextTick(() => {
        this.hackReset = true; //重建组件
      });
    },
    /*********** 开通 end  ****************/
    /*********** 基本方法 start  ****************/
    // 回到页面顶部
    backTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
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
      CommonFunc.displayMessageTip(this.$t("homePlsEnterValidNumber"), "warning", that);
    },
    //Note 获取收货地址列表
    fetchAddressList() {
      CommonService.getAddressList({
        headers: { "Show-Loading": false }
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
        console.log("error 选择过来的收货地址：", data);
        const that = this;
        CommonFunc.displayMessageTip(this.$t("homeAddressSelectionFailed"), "warning", that);
      }
    },
    //Note 判断是否登录
    checkLogin() {
      const res = CommonFunc.isLoginByCheck();
      if (!res) {
        const that = this;
        CommonFunc.displayMessageTip(this.$t("loginPlsLogFirst"), "info", that);
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
    handleToPageAnchor(anchorName) {
      const curPageRouteName = this.$route.name;
      this.$router.push({
        name: "Home",
        params: {
          fromPage: curPageRouteName,
          anchorName: anchorName
        }
      });
    },
    /*********** 基本方法 end  ****************/
    //Note 关闭开通窗口
    handleCloseGrantModal() {
      this.grantModal = false;
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    },
    // // 同意购买协议
    // yesArgreenment(state) {
    //   this.buingTip = this.buingResult = this.buingSuccess = this.buingError = false;
    //   this.buyModal = this.buingContant = true;
    //   this.buyReading = state;
    // },
    // // 直接关闭了购买信息框
    // closeBuyReading(state) {
    //   this.buyReading = state;
    // },
    closeShowResultModal() {
      this.isShowResultModal = false;
    },
    // 直接关闭了收货地址框
    closeSelectingAddress(state) {
      this.buyModal = true;
      this.selectingModal = state;
    },
    // 添加收货地址
    addAddress() {
      // console.log("addAddress");
      const selectedAddressInfoTmp = this.selectedAddressInfo;
      if (
        selectedAddressInfoTmp &&
        selectedAddressInfoTmp.hasOwnProperty("address") &&
        selectedAddressInfoTmp.hasOwnProperty("mobile")
      ) {
        this.selectedAddressDesc = selectedAddressInfoTmp.address;
        this.selectedAddressMobile = selectedAddressInfoTmp.mobile;
      } else {
        this.selectedAddressDesc = "";
        this.selectedAddressMobile = "";
      }

      this.selectedAddressId = -1;
      if (this.selectedAddressDesc && this.selectedAddressMobile) {
        for (let index = 0; index < this.listUserAddress.length; index++) {
          const element = this.listUserAddress[index];
          if (
            element.address == this.selectedAddressDesc &&
            element.mobile == this.selectedAddressMobile
          ) {
            this.selectedAddressId = element.id;
            break;
          }
        }
      }

      this.buyModal = false;
      this.selectingModal = true;
    },
    // // 立即购买按钮
    // buing() {
    //   if (JSON.stringify(this.selectingAdress) == "{}") {
    //     this.$Message.error({
    //       content: "没有地址，送到哪里呢？",
    //       duration: 2
    //     });
    //   } else {
    //     this.buingContant = false; // 购买信息内容框隐藏
    //     this.buingTip = true; // 购买确认框显示
    //   }
    // },
    // updataAdress() {
    //   console.log("更新地址");
    // },
    // // 选择收货地址
    // selectingAddress(state, data) {
    //   this.selectingModal = state;
    //   this.buyModal = true;
    //   // console.log("选择过来的收货地址：", data);
    //   this.selectingAdress = data;
    // },
    // // 直接关闭了收货地址框
    // closeSelectingAddresst(state) {
    //   this.buyModal = true;
    //   this.selectingModal = state;
    // },
    // // 确认购买
    // okBuing() {
    //   this.buingTip = false; // 购买确认框隐藏
    //   this.buingResult = true; // 显示购买反馈
    //   this.buingSuccess = true; //成功
    //   /* this.buingError = true; //失败
    //   this.errorText = "余额不足，请充值"; */
    //   if (this.buingSuccess) {
    //     setTimeout(() => {
    //       this.buyModal = false;
    //     }, 950);
    //   }
    // },
    // // 开通按钮
    // openBox() {
    //   this.grantForm = [{ boxId: "" }];
    //   this.grantForm[0].boxId = "";
    //   this.grantModal = true;
    // },
    addBoxId() {
      this.grantArray.push({ boxId: "" });
    },
    // // 开通
    // grant(data) {
    //   console.log(data);
    // },
    grantOk() {
      this.grantResult = false;
      this.trantReading = true;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-modal-mask {
  z-index: 1 !important;
}
// 购买框
/deep/.buy-modal,
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
  .right {
    .price1 {
      display: block;
    }
    .price2 {
      display: none;
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

  .title {
    display: none;
  }
  .right {
    h1 {
      margin: 12px 0 8px;
      font-size: 22px !important;
    }
    .price1 {
      display: none;
    }
    .mobile-view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price2 {
        display: block;
      }
    }
  }
}

.title {
  border-bottom: 1px solid #d6d6d6;
  font-size: 28px;
  font-weight: 800;
}
.left {
  img {
    width: 100%;
  }
}
.right {
  h1,
  .price1,
  .price2 {
    font-size: 28px;
    font-weight: 800;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    .btn,
    .ivu-btn {
      height: 55px;
      width: 48%;
      font-size: 16px;
    }
    .buing {
      background-color: #ff8b00;
    }
  }
}
</style>
