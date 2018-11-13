/**
  *  @Title
  *  @Auther  lidaibin
  *  @Time    2018
  */

export const city = state => state.userInfo.city;
export const country = state => state.userInfo.country;
export const headimgurl = state => state.userInfo.headimgurl;
export const language = state => state.userInfo.language;
export const nickname = state => state.userInfo.nickname;
export const openid = state => state.userInfo.openid;
export const sex = state => state.userInfo.sex;
export const province = state => state.userInfo.province;
export const privilege = state => state.userInfo.privilege;

// 获取用户信息 返回 Object
export const userInfo = state => state.userInfo;
