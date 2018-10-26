import Request from "@/services/httpService"
const req = new Request();

import getParam from './getParam'
import setExpireTime from './time'


export const utils = {
  getParam,
  setExpireTime
}

utils.install = function (Vue, opt) {
    console.log();
    let wxEnable = false;
    if (window.wx) {
      wxEnable = true
    } else {
      window.wx = new Proxy({}, {
        get: function () {
          console.error("微信sdk接入失败")
        }
      })
    }

    /**
     * http请求
     * */
    Vue.mixin({
      methods: {
        get: function (api, params) {
          return req.get(api, params)
        },
        post: function (header, api, params) {
          return req.post(header, api, params)
        },
      }
    });

    /**
     * 路由切换
     * */
    Vue.mixin({
      methods: {
        // 路由
        goto: function (name, params) {
          console.log("导航", name)
          window.scrollTo(0, 0)
          this.$router.push({
            name,
            params
          })
        },
        // 路由返回上一级
        goback: function () {
          if (window.history && window.history.length > 1) {
            this.$router.back()
          } else {
            console.log("返回首页")
            this.goto("index", {})
          }
        },
        // 导航
        go (name, params) {
          if (this.slide) {
            return
          }
          this.goto(name, params)
        }
      }
    });

    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      /**
       * 屏幕滑动
       * */
      Vue.mixin({
        data () {
          return {
            slideStart: null,
            slide: false,
          }
        },
        methods: {
          /**
           * 监听手势
           * */
          watchSlideStart (e) {
            this.slideStart = e.touches
            this.slide = false
          },
          watchSlideMove (e) {
            /**
             * 判断是否滑动
             * */
            if (!this.slide && this.slideStart) {
              for (let i = 0; i < this.slideStart.length; i++) {
                let touchMoveY = this.slideStart[i].clientY - e.touches[i].clientY
                if (
                  e.touches[i] &&
                  this.slideStart[i] &&
                  Math.abs(touchMoveY) > 2
                ) {
                  this.slide = true
                  break
                }
              }
            } else {
              this.slideStart = null
            }
          },
          watchSlideEnd (e) {
            // isTouch = false
            if (this.slide) {
              this.slideStart = null
            }
          },
        }
      });
    }
  }

export default utils
