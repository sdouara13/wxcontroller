import axios from 'axios'
import qs from 'qs'

let api
let prefix = "" // mock

if (process.env.NODE_ENV === "development") {
  prefix = "/api"
  api = {
    getToken: `${prefix}/getwxtoken`,
    getUserAuth: `${prefix}/getuserauth`,
    deviceID: `${prefix}/getdeviceid`,
    scanQRCode: `${prefix}/scanqrcode`,
    userinfo: `${prefix}/getuserinfo`,
  }
} else if (process.env.NODE_ENV === "production") {
  prefix = ""
  api = {
    getToken: `${prefix}/getwxtoken`,
    getUserAuth: `${prefix}/getuserauth`,
    deviceID: `${prefix}/getdeviceid`,
    scanQRCode: `${prefix}/scanqrcode`,
    userinfo: `${prefix}/getuserinfo`,
  }
}

const API = api

class WXX {
  constructor() {
    this.id = "";
    this.qrcodeUrl = "";
    this.userInfo = null;
    this.isWX = this.judgeWX();
    this.http = new HttpService();
  }
  config(config) {
    if (this.isWX) {
      this.getDeviceId()
        .then(({ data }) => {
          this.id = data;
          if (window.localStorage && window.localStorage.getItem('deviceid' !== this.id)) {
            window.localStorage.setItem('deviceid', this.id);
          }
          this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`
          return this.http.get(API.getUserAuth, {
            code: this.getParam('code'),
            grant_type: 'authorization_code',
            deviceid: this.id
          })
        })
        .then(res => {
          console.log('用户授权返回', res);
          this.userInfo = res.data;
        });

      const timestamp = Date.now() / 1000 >> 0;
      const nonceStr = Math.random().toString();
      this.http.get(API.getToken, {
        timestamp,
        nonceStr,
        url: window.location.href.replace(/#.*/, '')
      })
        .then((res) => {
          console.log("获取签名", res, this.appid);
          if (res.data) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              // appId: 'wxaca505e7b260c383', // 必填，公众号的唯一标识
              appId: this.appid, // 测试公众号的唯一标识
              timestamp, // 必填，生成签名的时间戳
              nonceStr, // 必填，生成签名的随机串
              signature: res.data, // 必填，签名
              jsApiList: list // 必填，需要使用的JS接口列表
            });
          } else {
            console.error("获取签名失败")
          }

        });
    } else {
      this.getDeviceId()
        .then(({ data }) => {
          this.id = data;
          if (window.localStorage && window.localStorage.getItem('deviceid' !== this.id)) {
            window.localStorage.setItem('deviceid', this.id);
          }
          this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`
          this.getUserInfo();
        });
    }
  }
  getUserInfo() {
    this.http.get(API.userinfo, { deviceid: this.id })
      .then(res => {
        if (res.data) {
          console.log('用户信息', res);
          this.userInfo = res.data;
        } else {
          setTimeout(() => {
            this.getUserInfo();
          }, 3000)
        }
      })
  }
  getParam(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$|\\#)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r !== null) {
      return decodeURIComponent(r[2])
    }
    return null
  }
  getDeviceId() {
    if (window.localStorage && window.localStorage.getItem('deviceid')) {
      return new Promise((resolve) => {
        resolve({
          data: window.localStorage.getItem('deviceid')
        });
      });

    } else {
      return this.http.get(API.deviceID)
    }
  }
  getUserInfo(config) {
    if (this.isWX) {

    } else {
      return this.http.get(API.userinfo, { deviceid: this.id })
      // .then(res => {
      //   if (res.data) {
      //     console.log('用户信息', res);
      //     this.updateUserInfo(res.data);
      //   } else {
      //     setTimeout(() => {
      //       this.getUserInfo();
      //     }, 3000)
      //   }
      // })
    }
  }
  scanQRCode(config) {
    if (this.isWX) {
      return new Promise((resolve) => {
        config.success = function (res) {
          let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          console.log('扫一扫返回', result);
          resolve({
            data: result
          });
        };
        wx.scanQRCode(config);
      });

    } else {
      return this.http.get(API.scanQRCode, {
        deviceid: this.id,
        seqno: Date.now() / 1000 >> 0
      })
    }
  }
  judgeWX() {
    let isMicromessenger = navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
    if (isMicromessenger && isMicromessenger.length > 0) {
      return isMicromessenger[0] === "micromessenger";
    } else {
      return false
    }
  }
}

class HttpService {
  constructor () {
    this.$http = axios
  }
  /**
   * @method
   * @description Send a get request
   * @param { String } api
   * @param { Object } params - Url params
   * @example (new HttpService()).get("http://www.example.com", { name: "Daibin Li", age: 25 })
   * @returns { Promise } Returns the promise handler of get request
   * */
  get (api, params) {
    console.log('发送get请求', api, params)
    if (api) {
      return this.$http.get(`${api}?${qs.stringify(params)}`, params
        // {
        //   timeout: 3 * 1000
        // }
      )
    } else {
      throw new Error(`请求url无效 ${api}`)
    }
  }

  post (header, api, params) {
    let http = this.$http
    if (!header) {
      header = {
        "Content-type": "application/json"
      }
    }
    http = this.$http.create({
      headers: header
    })
    console.log('发送post请求', header, api, params)
    if (api) {
      return http.post(api, params
        // {
        //   timeout: 3 * 1000
        // }
      )
    } else {
      throw new Error(`请求url无效 ${api}`)
    }
  }
  put (api, params) {
    console.log('发送put请求', api, params)
    if (api) {
      return this.$http.put(api, params)
    } else {
      throw new Error(`请求url无效 ${api}`)
    }
  }

  delete (api, params) {
    return this.$http.delete(api, params)
  }
}

export const wxx = new WXX();
