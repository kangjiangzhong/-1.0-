// pages/goods_detail/index.js

import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {goods_id} = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id)
    //
  },
  //获取商品详情信息数据
  async getGoodsDetail(goods_id){
    const goodsobj = await request({url:"/goods/detail",data:{goods_id}})
    const goodsObj = goodsobj.data.message
    this.GoodsInfo = goodsObj
    // console.log(goodsObj);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
  },
  //点击轮播图放大预览
  handlePrevewImage(e){
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    const current = e.currentTarget.dataset.url
   
    wx.previewImage({
      current,
      urls:urls
    })
  },
  //点击加入购物车
  handleCartAdd(){
    //1获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart")||[];
    //2判断  商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    if(index ===-1){
      //不存在第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked= true;
      cart.push(this.GoodsInfo)
    }else{
      //已存在购物车数据 执行num++
      cart[index].num++
    }
    //3把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //4弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //true防止用户手抖 疯狂点击
      mask: true,
    });
  }
 
})