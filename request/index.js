
//同十发送异步代码的次数
let ajaxtime = 0
export const request=(parmas)=>{
  ajaxtime++;
  //显示加载中的效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  //定义公共的Url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...parmas,
      url:baseUrl+parmas.url,
      success:(result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxtime--;
        if(ajaxtime===0){
          wx.hideLoading()
        }
          
      }
    })
  })
}