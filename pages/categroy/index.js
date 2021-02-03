// pages/categroy/index.js
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧商品数据
     rightContent:[],
     //被点击的左侧菜单
     currentIndex:0,
     //右侧内容的滚动条距顶部的距离
     scrollTop:0
  },
  cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates')
    if(!Cates){
      this.getCates()
    }else{
      // 有旧的数据定义过期时间
      if(Date.now()-Cates.time>1000*10){
        this.getCates()
      }else{
        console.log("可以使用旧数据");
        this.cates = Cates.data
          //构造左侧菜单数据
        let leftMenuList = this.cates.map(v=>v.cat_name)
        //构造右侧菜单数据
        let rightContent = this.cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
   
  },
  //获取分类请求

 async getCates(){
    // request({url:"/categories"}).then(res =>{
    //   console.log(res);
    //   this.cates = res.data.message; 
    //   //把接口数据存储到本地
    //   wx.setStorageSync('cates', {time: Date.now(),data:this.cates})
      
    //   //构造左侧菜单数据
    //   let leftMenuList = this.cates.map(v=>v.cat_name)
    //   //构造右侧菜单数据
    //   let rightContent = this.cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    const res = await request({url:"/categories"})
    this.cates = res.data.message; 
      wx.setStorageSync('cates', {time: Date.now(),data:this.cates})
      
      //构造左侧菜单数据
      let leftMenuList = this.cates.map(v=>v.cat_name)
      //构造右侧菜单数据
      let rightContent = this.cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })

  }
  ,
  //左侧菜单点击事件
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    let rightContent = this.cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      //重新右侧内容的scroll-view标签的 距离顶部的距离
      scrollTop:0
    })
    
  }
})