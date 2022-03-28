// 1.获取用户收货地址
//    1.绑定点击事件
//    2.调用小程序内置 api 获取用户的收获地址
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
Page({
    data: {
        address: {},
        cart:[],
        allChecked:false,
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
        const cart = wx.getStorageSync("cart") || [];
        //计算全选 
        //every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数 都返回true 那么 every方法的返回值为true
        //只要 有一个回调函数返回了false 那么循环不再执行 直接返回false
        // 空数组 返回值就是 true
        // const allChecked = cart.length?cart.every(item => item.checked):false;
        this.setData({address})
       this.setCart(cart);
    },


    async handleChooseAddress() {
        try {
            // 1 获取 权限状态
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            // 2 判断 权限状态
            if (scopeAddress === false) {
                await openSetting();
            }
            // 4 调用获取收货地址的 api
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

            // 5 存入到缓存中
            wx.setStorageSync("address", address);

        } catch (error) {
            console.log(error);
        }
    },
    handleItemChange(e) {
        // 1.获取被修改的商品的id
        const goods_id = e.currentTarget.dataset.id;
        // 2.获取购物车数组
        let {cart} = this.data;
        // 3.找到被修改的商品对象
        let index = cart.findIndex(item =>item.goods_id == goods_id);
        // 4.选中状态取反
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },
    //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        let allChecked = true;
        // 1总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(item => {
            if(item.checked) {
                totalPrice += item.num * item.goods_price;
                totalNum += item.num;
            }else {
                allChecked = false
            }
        });
        //判断数组是否为空
        allChecked = cart.length != 0?allChecked:false;
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync("cart", cart);
    },
    //商品全选
    handleItemAllCheck(e) {
        //获取data中的数据
        let {cart,allChecked} = this.data;
        //修改值
        allChecked = !allChecked;
        //循环修改cart数组中 商品的选中状态
        cart.forEach(item => item.checked = allChecked);
        //把修改后的值 填充回data或者缓存中
        this.setCart(cart);
    },
    // 商品数量编辑功能
    async handleItemNumEdit(e) {
        //获取传递过来的参数
        const {operation,id} = e.currentTarget.dataset;
        //获取购物车数组
        const {cart} = this.data;
        // 找到需要修改的商品的索引
        const index = cart.findIndex(item => item.goods_id == id);
        //判断是否要删除
        if(cart[index].num == 1 && operation == -1) {
            // 弹窗提示
            const res = await showModal({content:"您是否要删除"})
            if (res.confirm) {
                cart.splice(index,1);
                this.setCart(cart);
            }
        }else {
            // 进行修改数量
            cart[index].num += operation;
            // 设置回缓存和data中
            this.setCart(cart);
        }
    },
    //结算
    async handlePay() {
        const {address,totalNum} = this.data;
        // 判断收获地址
        if(!address.userName) {
            await showToast({title:"您还没有选择收货地址"});
            return;
        }
        // 判断用户有没有选购商品
        if(totalNum == 0) {
            await showToast({title:"您还没有选购商品"});
            return;
        }
        // 3跳转页面
        wx.navigateTo({
            url: '/pages/pay/index',
        });
    }
})