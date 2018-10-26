<template>
    <div>
      <qrcode-vue  :value="qrcodeUrl" :size="qrcodeSize" level="H"></qrcode-vue>
      <div >
        <button @click="scanQRCode">扫一扫</button>
      </div>
    </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue'
  import { API } from "@/constants/api"


  export default {
    name: "index",
    components: {
      QrcodeVue,
    },
    mounted() {
      this.getDeviceId();
    },
    methods: {
      getDeviceId() {
        this.get(API.deviceID)
          .then(res => {
            this.id = res.data
            console.log("获取设备id", res);
            if(process.env.NODE_ENV === "development") {
              this.qrcodeUrl = `http://10.12.130.110:8081/?deviceid=${this.id}`
            } else {
              this.qrcodeUrl = `http://www.wxapidev.cn/wxsimulator/?deviceid=${this.id}`
            }
          })
      },
      scanQRCode() {
        this.get(API.scanQRCode, {deviceid: this.id})
          .then((res) => {
            console.log("扫一扫", res)
          });
      }
    },
    data () {
      return {
        qrcodeSize: 568,
        qrcodeUrl: "http://10.12.130.110:8081/?deviceid=123",
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
