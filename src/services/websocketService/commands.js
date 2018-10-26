import utils from "@/utils";

const { getParam } = utils;

export default {
  /**
   * Pkg send from web to server
   * */
  BSN: getParam('cmd') || 'MS_room_srv',
  BRD: 'broadcast',
  HS: {
    AddSong: 'hs_addsong',  // 申请添加歌曲
    DelSong: 'hs_delsong',  // 申请删除歌曲
    SyncSong: 'hs_syncsong',  // 申请同步歌曲列表
    Login: 'hs_login',  // 玩家登录
    Relogin: 'hs_relogin',  // 玩家重新登录
    Pay: 'hs_buygood',  // 玩家购买套餐
    SongList: 'hs_quesong',  // 查询已点歌单
    QueueInfo: 'hs_queryqueueinfo',  // 查询排队信息
    PlayConfirm: 'hs_playconfirm',  // 玩家确认开始表演
    StartPlay: 'hs_startplay',  // 玩家确认继续演唱
    HeartBeat: 'hs_heartbeat',  // 与服务器的心跳命令
    AudioTrack: 'hs_switchaudio',  // 切换音轨
  },
  /**
   * Pkg send from server to web
   * */
  SH: {
    QueueInfo: 'sh_queueinfo_boc',  // 服务器通知玩家排队相关信息
    UserStaging: 'sh_usrstaging_boc',  // 服务器通知玩家登台
    SongError: 'sh_songreserror_boc',  // 服务器通知玩家歌曲资源错误
    Loading: 'sh_startloading_boc',  // 服务器通知web歌曲加载中
    Play: 'sh_startplay_boc',  // 服务器通知web歌曲开始播放
    Login: 'sh_usrlogin_boc',  // 服务器通知玩家登录
    SyncSong: 'sh_syncsong',  // 服务器通知同步歌单
    PlayEnd: 'sh_timecost_end_boc',  // 服务器通知演唱结束
    AudioTrack: 'sh_switchaudio',  // 服务器通知切换音轨
  },
  /**
   * Broadcast
   * */
  BD: {
    Notice: 'noticeid',
    SelectTime: 'hm_selecttime_boc',
  }
}
