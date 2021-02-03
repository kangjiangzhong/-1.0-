import {getSetting,chooseAddress,openSetting,showModel,showToast,requestPayment} from "../../utlis/asyncWx.js"
import {request} from "../../request/index.js"
Page({

  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    this.setData({address});
        //购物车的总价格总数量
      let totalPrice = 0;
      let totalNum = 0; 
      cart.forEach(v=>{
          totalPrice+=v.num*v.goods_price;
          totalNum=+v.num
      })   
      this.setData({
        cart,totalNum,totalPrice,address
      })

    },
    //点击支付
 async handleOrderPay(){
      //判断缓存中是否有token
      const token = wx.getStorageSync("token");
      //判断
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      //创建订单
        //准备请求头参数
        const header = {Authorization:token};
        //准备请求体参数
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address;
        let cart = this.data.cart;
        let goods = [];
        cart.forEach(v=>goods.push({
          goods_id:v.goods_id,
          goods_number:v.num,
          goods_price:v.goods_price
        }))
        const orderParams = {order_price,consignee_addr,goods}
       
        //准备发送请求 创建订单 获取订单编号
        const res = await request({url:"/my/orders/create",method:"post",data:orderParams,header})
        const order_number = "HMDD20190802000000000422";
        //发起 预支付接口
        const res1 = await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}})
        //发起微信支付
        let pay = {
            timeStamp: "1564730510",
            nonceStr: "SReWbt3nEmpJo3tr",
            package: "prepay_id=wx02152148991420a3b39a90811023326800",
            signType: "MD5",
            paySign: "3A6943C3B865FA2B2C825CDCB33C5304"
          
        }
         const res3 = await requestPayment(pay)
         console.log(res3);
    }
})