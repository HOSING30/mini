import { request } from "../../request/index.js"
// import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

    data: {
        //左侧的菜单数据
        leftMenuList: [],
        //右侧的商品数据
        rightContent: [],
        //被点击的左侧的菜单
        currentIndex: 0,
        //右侧内容的滚动条距离顶部的距离
        scrollTop: 0
    },
    //接口的返回数据
    Cates: [],

    onLoad: function(options) {
        // web中的本地存储和 小程序中的本地存储的区别
        // 1. 写代码的方式不一样
        // web:localStorage.setItem("key","value")  localStorage.getItem("key")
        //小程序中 wx.setStorageSync("key","value")  wx.getStorageSync("key") 

        //1.先判断一下 本地存储中有没有旧的数据
        //{time:Data.now(),data:[...]}
        //2.没有旧数据 直接发送新的请求
        //3.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可

        //1.获取本地存储中的数据  (小程序中也是存在本地存储的技术)
        const Cates = wx.getStorageSync("cates");
        //2.判断
        if (!Cates) {
            //不存在 发送请求获取数据
            this.getCates();
        } else {
            //有旧的数据 定义过期时间 10s 后期改成5分钟
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates()
            } else {
                //可以使用旧的数据
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(item => item.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    //获取分类数据方法
    async getCates() {
        //1.使用es7的async await来发送请求
        const res = await request({ url: "/categories" });
        this.Cates = res;

        //把接口数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })



        // 2.
        // request({
        //     url: '/categories'
        // }).then(res => {
        //     this.Cates = res.data.message;

        //     //把接口数据存入到本地存储中
        //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
        //     //构造左侧的大菜单数据
        //     let leftMenuList = this.Cates.map(item => item.cat_name);
        //     let rightContent = this.Cates[0].children;
        //     this.setData({
        //         leftMenuList,
        //         rightContent
        //     })

        // })
    },
    //左侧菜单的点击事件
    handleItemTap(e) {
        // 1.获取点击标题身上的索引
        // 2.给data中的currentIndex赋值就可以了
        //3.根据不同的索引来渲染右侧商品的内容
        // 刚开始 刚加载页面 onLoad获取所有数据存入Cates中 现在根据点击的左侧选项 来更新右侧显示内容 rightContent的值 并渲染出来
        const { index } = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            //重新设置 右侧内容的scroll-view标签的距离顶部的距离
            scrollTop: 0
        })
    }


})