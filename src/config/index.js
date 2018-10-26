/**
 * 获取环境
 * */
let url = '';
let httpUrl = '';
let isTest;
let isMicromessenger = navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
if (isMicromessenger && isMicromessenger.length > 0) {
    isMicromessenger = isMicromessenger[0] === "micromessenger";
} else {
    isMicromessenger = false
}
if (process.env.NODE_ENV === 'development') {
    isTest = true;
    console.log('内网测试环境')
    url = "ws://10.12.130.110:3000"; // 内网网关
    // httpUrl = 'http://10.0.3.41'; // 内网http服务ip

} else {
    console.log('外网测试环境');
    isTest = false;
    url = "ws://120.79.88.184:8092"; // 外网网关
    // httpUrl = 'http://120.79.88.184'; // 外网http服务
}
export default {
    isTest,
    url,
    // httpUrl,
    isMicromessenger
}
