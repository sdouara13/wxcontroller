import channel from "@/services/channelService"
// import Request from "@/services/httpService"

export default class ImgLoader {
  constructor (channelName, src, param) {
    return new Promise((resolve, reject) => {
      this.channelName = channelName
      this.param = param
      if (!param.local) {
        this.src = `http://${src}`
      }
      const img = new Image()
      this.img = img
      if (this.ISIE()) {
        try {
          img.src = this.src
          if (img.complete) {
            this.loaded()
          }
          img.onload = this.loaded.bind(this)
          img.onerror = () => {
            console.log(`${src}加载失败`)
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        img.src = this.src
        if (img.complete) {
          this.loaded()
          resolve({
            src: this.src,
            param: this.param,
            width: this.img.width,
            height: this.img.height,
          })
        }
        const self = this
        img.onload = function () {
          resolve({
            src: this.src,
            param: this.param,
            width: this.img.width,
            height: this.img.height,
          })
          this.loaded.bind(self)
        }
        img.onerror = () => {
          console.log(`${src}加载失败`)
        }
      }
    })
  }
  ISIE () {
    const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera // 判断是否IE浏览器
    return isIE || (!!window.ActiveXObject || "ActiveXObject" in window)
  }
  loaded () {
    console.log(`加载成功，发送${this.src}, 参数：${this.param}， 宽：${this.img.width}， 高：${this.img.height}`)
    channel.emit(this.channelName, {
      src: this.src,
      param: this.param,
      width: this.img.width,
      height: this.img.height,
    })
  }
}
