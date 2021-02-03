import {getSetting,chooseAddress,openSetting,showModel,showToast} from "../../utlis/asyncWx.js"

Page({

  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    // const allChecked =cart.length?cart.every(v=>v.checked):false;
    this.setData({address})
    this.setCart(cart)
  },

   //点击收货
  async handleChooseAddress(){
    try {
    //1获取权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    //2判断权限状态
    if(scopeAddress===false){
      await openSetting();
    }
      4//调用获取收货地址的api
      const address = await chooseAddress()
      wx.setStorageSync("address", address);
      
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handItemChange(e){
     //获取被修改的商品Id
     const goods_id = e.currentTarget.dataset.id
    //  console.log(goods_id);
    //获取购物车数组
    let {cart} = this.data
    //找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    //选中状态取反
    cart[index].checked =!cart[index].checked;
    //重新把购物车数据设置到data中和缓存中 
    this.setCart(cart)
  },
  //设置购物车状态的同时，重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart){
    let allChecked = true;
    //购物车的总价格总数量
    let totalPrice = 0;
    let totalNum = 0; 
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum=+v.num
      }else{
        allChecked = false
      }
    })  
    //判断数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,totalNum,totalPrice,allChecked
    })
    wx.setStorageSync("cart",cart)
  },
  //商品全选功能
  handleItemAllcheck(){
    //获取data 中的数据
    let {cart,allChecked} = this.data;
    //修改值
    allChecked = !allChecked
    //循环修改cart数组中商品的选中状态
    cart.forEach(v=>v.checked=allChecked)
    //把修改后的值填充回data中
    this.setCart(cart)
  },
  //商品数量的编辑功能
  async itemNum(e){
    //获取传递过来的参数
    const {id,operation} = e.currentTarget.dataset;
    console.log(id,operation);
    //获取购物车数组
    let {cart} = this.data ;
    //找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    //判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
        const res = await showModel({content:"你是否要删除？"})
        if(res.confirm){
          cart.splice(index,1);
          this.setCart(cart)
        }
    }
    //进行数量的修改
    cart[index].num+=operation;
    this.setCart(cart)
  },
  //点击结算
 async handlePay(){
    const {address,totalNum} = this.data;
    //判断收货地址
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选择商品"})
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})