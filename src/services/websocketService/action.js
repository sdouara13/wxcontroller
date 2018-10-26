import channel from '@/services/eventService';
import commands from "@/services/websocketService/commands";
import stringify from "json-stringify-safe";
// import fundebug from "fundebug-javascript"

const { HS, SH, BSN, BRD, BD } = commands;

/**
 * 一对一应答使用Send
 * */
export const Send = (data) => {
    let callback;
    let callbackErr;
    let cmd = data.data.cmd;
    let seqno = data.data.seqno;
    let exceed = null;
    let flag = 0; // 0为普通应答， 1为广播应答
    if (data.bsncode === BRD && cmd !== BD.Notice) {
        cmd = data.data.data.cmd;
        seqno = data.data.data.seqno;
        flag = 1;
    }
    let destroy = function() {
        if (exceed) {
            clearTimeout(exceed);
            exceed = null;
        }

        channel.destroy('from-ws', callback);
        channel.destroy('to-ws-error', callbackErr);
    }
    return {
        promise: new Promise((resolve, reject) => {
            channel.on('to-ws-error', callbackErr = (data) => {
                console.log('websocket发送错误包', data);
                if (data && data.data && data.data.cmd === cmd && data.data.seqno === seqno) {
                    reject(1);
                }
            });
            channel.on('from-ws', callback = (data) => {
                // console.log('websocket 发送', data);
                if (data.data) {
                    data = data.data;
                    if (data.cmd === cmd && data.seqno === seqno) {
                        destroy();
                        if (flag === 0) {
                            if (data.status === 0) {
                                resolve(data);
                            } else {
                                reject(data.status);
                            }
                        } else {
                            resolve(data);
                        }

                    }
                } else {
                    console.error('websocket接收到空包');
                }
            });

            /**
             * 服务器返回超时
             * */
            exceed = setTimeout(() => {
                console.log('服务器返回超时,命令', cmd, stringify(data));
                destroy();
                /**
                 * 发送超时信号
                 */
                channel.emit('server_exceed');
                reject(`server_exceed: ${cmd}`);
                // fundebug.notify("Lost", stringify(data));
            }, 10 * 1000);

            channel.emit('to-ws', data);
            console.log(`向websocket服务器发送数据： ${stringify(data)}`)

        }),
        clear: destroy
    }
}

/**
 * 非一对一应答命令，一般为广播返回，直接发送，并监听该信号即可
 * */
export const SimpleSend = (data) => {
    channel.emit('to-ws', data);
}
