import channel from "@/services/channelService"
// import Request from "@/services/httpService"

export default class ImgLoader {
  constructor (channelName, src, param) {
    this.channelName = channelName
    this.param = param
    // console.log(`开始加载${param}`)
    this.src = `http://${src}`
    // if (this.ISIE()) {
    // if (1) {
    //   const request = new Request()
    //   request.get(this.src)
    //     .then((res) => {
    //       console.log(res)
    //       this.loaded()
    //     })
    //     .catch((e) => {
    //       console.log(`${src}加载失败`)
    //     })
    // } else {
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
      }
      img.onload = this.loaded.bind(this)
      img.onerror = () => {
        console.log(`${src}加载失败`)
      }
    }
      // console.log(img)
    // }
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
