/**
 * Created by Bin on 2017/12/26.
 */
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

/**
 * Http factory
 * @constructor
 * */
export default class HttpService {
  constructor () {
    this.$http = Vue.axios || Vue.$http || axios
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
