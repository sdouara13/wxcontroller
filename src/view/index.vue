<template>
    <div>
      <qrcode-vue  :value="qrcodeUrl" :size="qrcodeSize" level="H"></qrcode-vue>
    </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue'
  import { API } from "@/constants/API"


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
            this.qrcodeUrl = `http://10.12.130.110:8081/?deviceid=${this.id}`
          })
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
