// 1.获取用户收货地址
//    1.绑定点击事件
//    2.调用小程序内置 api 获取用户的收获地址
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
Page({
    data: {
        address: {},
        cart:[],
        totalPrice:0,
        totalNum:0
    },
    onShow() {
        //0 回到商品详情页面 第一次添加商品的时候 手动添加了属性
        //  1 num =1
        //  2 checked = true
        //1 获取缓存中的购物车数组
        //2 把购物车数据 填充到data中

        //1.获取缓存中收获地址信息
        const address = wx.getStorageSync("address");
        //1.获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车数组
        cart = cart.filter(item => item.checked);
        // this.setData({address});
        // 1总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(item => {
          totalPrice += item.num * item.goods_price;
          totalNum += item.num; 
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
    },
    

})