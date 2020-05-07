import axios from 'axios';
import './http';
import config from './config';
import * as _ from 'lodash';
import CommonFunc from "@/utils/common";
import { setCookie, getCookie, removeCookie } from "@/libs/util";
//note Service服务类封装
/**
 * @class
 */
function request(url,params){
  const requestOpts = {
    method: 'post'
  };
  // const uidCookie = CommonFunc.getCookie("uid") || undefined;
  // const uidCookie = getCookie("uid") || undefined;
  const uidStorage = CommonFunc.getLoginUserId() || undefined;
  if (params.data) {
    params.data.headers&&(requestOpts.headers = params.data.headers);
    params.data = {...params.data, uid: uidStorage }
    delete params.data.headers
  }
  if(params.method=='get'){
    let data = params.data;
    let index = 0;
    for(let i in data){
      if (i != 'headers') {
        if(index==0){
          url = url+'?'+i+'='+data[i];
        }else{
          url = url+'&'+i+'='+data[i];
        }
      }
      index++;
    }
  }
  let _axios = axios(_.merge(requestOpts, params, {
    url: Service.url(url,params.method,params.mock)
  }));
  return _axios;
}
class Service {
    static request(url, params) {
        return request(url, params || {});
    }

    static get(url, params,mock=false) {
        let req = request(url, {...{ data:params||{}}, ...{method: 'get',mock}});
        return req;
    }

    static post(url, params,mock=false) {
        let req = request(url, {...{ data:params||{}},  ...{method: 'post',mock}}, ...{withCredentials:true});
        return req;
    }

    static url(url, type,mock=false) {
      let api = config.declareURL(url,type,mock);
       return api;
    }
}

export default Service;
