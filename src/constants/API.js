let api
let prefix = "" // mock
// let prefix = "http://10.12.32.108:8000" // 内网测试ip
// let prefix = "http://140.143.182.172:8000 // 外网ip
// let prefix = "/api"
if (process.env.NODE_ENV === "development") {
  prefix = "/api"
  api = {
    deviceID: `${prefix}/getdeviceid`,

  }
} else if (process.env.NODE_ENV === "test") {

}

export const API = api
