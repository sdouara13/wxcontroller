<template>
    <div>
      <qrcode-vue  :value="qrcodeUrl" :size="qrcodeSize" level="H"></qrcode-vue>
      <div> {{ userInfo.city }}</div>
      <div> {{ userInfo.country }}</div>
      <div> {{ userInfo.nickname }}</div>
      <div> {{ userInfo.sex }}</div>
      <div> {{ userInfo.language }}</div>
      <div> <img :src="userInfo.headimgurl"/></div>
      <div >
        扫一扫结果：{{ scanRes }}
        <button @click="scanQRCode">扫一扫</button>
      </div>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import QrcodeVue from 'qrcode.vue'
  // import { API } from "@/constants/api"
  import { wxx } from "@/utils/wxsdk"


  export default {
    name: "index",
    components: {
      QrcodeVue,
    },
    data () {
      return {
        id: '',
        qrcodeSize: 568,
        qrcodeUrl: "http://10.12.130.110:8081/?deviceid=123",
        scanRes: '',
      }
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    mounted() {
      if (window.localStorage && window.localStorage.getItem('deviceid')) {
        this.id = window.localStorage.getItem('deviceid');
        if(process.env.NODE_ENV === "development") {
          // this.qrcodeUrl = `http://10.12.130.110:8081/?deviceid=${this.id}`
          this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://10.12.130.110:8081/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`
        } else {
          // this.qrcodeUrl = `http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}`
          this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`
        }
      } else {
        this.getDeviceId();
      }
      this.getUserInfo();
    },
    methods: {
      ...mapMutations(["updateUserInfo"]),
      getUserInfo() {
        this.get(API.userinfo, { deviceid: this.id })
          .then(res => {
            if (res.data) {
              console.log('用户信息', res);
              this.updateUserInfo(res.data);
            } else {
              setTimeout(() => {
                this.getUserInfo();
              }, 3000)
            }
          })
      },
      getDeviceId() {
        this.get(API.deviceID)
          .then(res => {
            this.id = res.data;
            if (window.localStorage) {
              window.localStorage.setItem('deviceid', this.id);
            }
            console.log("获取设备id", res);
            if(process.env.NODE_ENV === "development") {
              // this.qrcodeUrl = `http://10.12.130.110:8081/?deviceid=${this.id}`
              this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://10.12.130.110:8081/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`

            } else {
              // this.qrcodeUrl = `http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}`
              this.qrcodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx847ad179e85ad077&redirect_uri=http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}&response_type=code&scope=snsapi_userinfo&state=rand#wechat_redirect`
            }
          })
      },
      scanQRCode() {
        // this.get(API.scanQRCode, {deviceid: this.id})

        wxx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        })
          .then((res) => {
            console.log("扫一扫", res);
            this.scanRes = res.data;
          });
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
