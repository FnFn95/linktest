/**
 *@desc   公共服务请求
 *@author 谢辉
 *@date   2018.8.30
 */
export default class CommonService {
  //Note 获取Token
  static async getToken(data) {
    return ServiceRequest.post("token/getToken", data);
  }

  //Note 获取轮播图列表
  static async getCarouselList(data) {
    return ServiceRequest.post("carousel/getCarouselList", data);
  }

  //Note 获取购买产品列表
  static async getProductList(data) {
    return ServiceRequest.post("product/getProductList", data);
  }

  //Note 获取产品活动列表
  static async getCampaignstList(data) {
    return ServiceRequest.post("package_activity/getPackageActivityList", data);
  }

  // 获取收货地址列表
  static async getAddressList(data) {
    return ServiceRequest.post("address/getList", data);
  }

  // 新增收货地址
  static async addAddress(data) {
    return ServiceRequest.post("address/addressAdd", data);
  }

  // 修改收货地址
  static async udpateAddress(data) {
    return ServiceRequest.post("address/udpateAddress", data);
  }

  // 删除收货地址
  static async removeAddress(data) {
    return ServiceRequest.post("address/removeAddress", data);
  }

  // 获取用户协议
  static async getUserAgreement(data) {
    return ServiceRequest.post("article/getUserAgreement", data);
  }

  // 获取隐私政策
  static async getPrivacyPolicy(data) {
    return ServiceRequest.post("article/getPrivacyPolicy", data);
  }

  // 帮助中心
  static async getHelpWeb(data) {
    return ServiceRequest.post("article/getHelpWeb", data);
  }

  // 产品介绍文章列表
  static async getProductInstructions(data) {
    return ServiceRequest.post("article/getProductInstructions", data);
  }

  // 推广活动文章列表
  static async getPushActivity(data) {
    return ServiceRequest.post("article/getPushActivity", data);
  }

  // 获取文章详情
  static async getDetail(data) {
    return ServiceRequest.post('article/getDetail', data);
  };

  // 获取购买说明
  static async getPurchaseInstructions(data) {
    return ServiceRequest.post("article/getPurchaseInstructions", data);
  }

  // 获取时间卡购买说明
  static async getCardPurchaseInstructions(data) {
    return ServiceRequest.post("article/getCardPurchaseInstructions", data);
  }

  // 发送验证码接口
  static async sendMailCode(data) {
    return ServiceRequest.post("code/send", data);
  }

  // 生成购买订单
  static async deviceOrderBuy(data) {
    return ServiceRequest.post("order/buy", data);
  }

  // 设备 同意用户协议
  static async deviceOrderAgreeAgent(data) {
    return ServiceRequest.post("order/agreeAgent", data);
  }

  // 设备 激活
  static async deviceToActive(data) {
    return ServiceRequest.post("device/active", data);
  }

  // 获取产品详情
  static async getProductDetail(data) {
    return ServiceRequest.post("product/getProductDetail", data);
  }

  // 获取订单列表
  static async getOrderList(data) {
    return ServiceRequest.post("order/list", data);
  }

  // 获取订单详情
  static async getOrderDetail(data) {
    return ServiceRequest.post("order/getOrderDetail", data);
  }

  // 支付订单
  static async payOrder(data) {
    return ServiceRequest.post("order/pay", data);
  }
}
