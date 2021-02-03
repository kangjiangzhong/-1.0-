import {request} from "../../request/index.js"
import {login} from "../../utlis/asyncWx.js"
Page({
  //获取用户信息
 async handleGetUserInfo(e){
    try {
        //获取用户信息
      const {encryptedData,rawData,signature,iv} = e.detail;
      //获取小程序登录后的code值
      const {code} = await login()
      const loginPramas = {encryptedData,rawData,signature,iv,code}
      //发送请求
      const {res} = await request({url:"/users/wxlogin",data:loginPramas,method:"post"})
       const token ="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
       
      console.log(token);
      //把token 存入缓存中，同时跳转回上个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})