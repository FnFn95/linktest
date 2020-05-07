/**
 *@desc   用户相关服务请求
 *@author 周君
 *@date   2020.03.27
 */
export default class AccountService {
  //Note 用户注册
  static async registerByUser(data) {
    return ServiceRequest.post('user/register', data);
  };
  //Note 用户登录
  static async loginByUser(data) {
    return ServiceRequest.post('user/login', data);
  };
  //Note 重置密码
  static async reSetPassword(data) {
    return ServiceRequest.post('user/reSetPassword', data);
  };

  // 修改邮箱
  static async resetemail(data) {
    return ServiceRequest.post('user/resetemail', data);
  };

  //Note 获取用户信息
  static async getUserInfo(data) {
    return ServiceRequest.post('common/getUserInfo', data);
  };

  //Note 检查用户名是否可以使用
  static async checkUserName(data) {
    return ServiceRequest.post('user/checkUsername', data);
  };

  //Note 用户更换收货地址
  static async changeAddress(data) {
    return ServiceRequest.post('order/changeAddress', data);
  };

  //Note 提现
  static async getCash(data) {
    return ServiceRequest.post("common/getCash", data);
  }

  //Note 提现
  static async checkEmail(data) {
    return ServiceRequest.post("user/checkEmail", data);
  }

  //Note 获取图片验证码
  static async getPicCode(data) {
    return ServiceRequest.post("code/getPicCode", data);
  }
  //Note 验证图片验证码
  static async checkPicCode(data) {
    return ServiceRequest.post("code/checkCode", data);
  }
}
