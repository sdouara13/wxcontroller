import SocketIO from '@/services/websocketService';
import channel from '@/services/channelService';

import  config  from '@/config'
let url = config.url;
// let url = '';
// /**
//  * 获取环境
//  * */
// let testFlag = parseInt(getParam("test"));
// let queryTest = '';
// if(testFlag === 1) {
//   queryTest = '?test=1';
//   console.log('内网测试环境')
//   url = "ws://10.0.3.251:8092"; // 内网网关
// }
// else {
//   console.log('外网测试环境')
//   url = "ws://120.79.88.184:8092"; // 外网网关
// }
// const url = "ws://10.0.3.66:8080"; // 本地测试
// const url = "ws://120.79.88.184:8092"; // 网关
// const url = "ws://10.0.3.145:8192";  // 网关

let callback = function(data) {
  channel.emit('from-ws', data);
}

let ws = new SocketIO();

ws.Init(url, {
    data: 'BRIDGE',
    heartbeat: 'HEARTBEAT'
}, callback);
