import { request } from "../../request/index.js"

//Page Object
Page({
    data: {
        //轮播图数组
        swiperList: [],
        //导航数组
        catesList: [],
        //楼层数据
        floorList: [],
    },
    //页面开始加载 就会触发
    onLoad: function(options) {
        //1.发送异步请求获取轮播图数据
        this.getSwiperList();
        //2.获取导航数据
        this.getCateList();
        //3.获取楼层数据
        this.getFloorList();
    },
    //获取轮播图数据方法
    getSwiperList() {
        request({
            url: "/home/swiperdata"
        }).then(result => {
            result.forEach((v, i) => {result[i].navigator_url = v.navigator_url.replace('main', 'index');});
            this.setData({
                swiperList: result
            })
        })
    },
    //获取导航数据方法
    getCateList() {
        request({
            url: "/home/catitems"
        }).then(result => {
            this.setData({
                catesList: result
            })
        })
    },
    //获取楼层数据方法
    getFloorList() {
        request({
            url: "/home/floordata"
        }).then(result => {
            for (let k = 0; k < result.length; k++) {
                    result[k].product_list.forEach((v, i) => {
                        result[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
                    });
                }
            this.setData({
                floorList: result
            })
        })
    },
});