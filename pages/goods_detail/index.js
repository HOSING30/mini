import { request } from '../../request/index.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        //判断商品是否被收藏
        isCollect:false,
    },
    //商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
        let pages =  getCurrentPages();
        let currentPage = pages[pages.length-1];
        let options = currentPage.options;
        const { goods_id } = options;
        this.getGoodsDetail(goods_id)
    },
    //获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
        this.GoodsInfo = goodsObj;
        // 1.获取缓存中是商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        // 2.判断当前商品是否被收藏
        let isCollect = collect.some(item => item.goods_id == this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                goods_introduce: goodsObj.goods_introduce,
                pics: goodsObj.pics
            },
            isCollect
        })
    },
    //预览图片事件
    //1.给轮播图添加绑定事件
    //2.调用 preview api功能 即添加相应属性
    handlePreviewImage(e) {
        const urls = this.GoodsInfo.pics.map(item => item.pics_mid);
        //接收传递过来的图片url
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls,
        });
    },
    //添加购物车功能事件
    //1.先绑定事件
    //2.获取缓存中的购物车数据 数组格式
    //3.先判断 当前商品是否已经存在于购物车
    //4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
    //5.不存在购物车数组中 直接给购物车数组添加一个新元素 新元素 带上数组属性 num 重新把购物车数组 填充回缓存中
    //6.弹窗提示
    handleCartAdd() {
        //1.获取缓存中从购物车数组
        let cart = wx.getStorageSync("cart") || [];
        //判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(item => item.goods_id == this.GoodsInfo.goods_id);
        if (index == -1) {
            //不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        } else {
            // 4.已经存在购物车数据 执行 num++
            cart[index].num++;
        }
        //5.把购物车重新添加回缓存中
        wx.setStorage({ key: 'cart', data: cart, });
        //6.弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            //true 防止用户 手抖 疯狂点击按钮
            mask: true,
        });
    },
    //点击商品收藏图标
    handleCollect() {
        //默认为没有收藏
        let isCollect = false;
        //湖获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect")||[];
        //判断商品是否被收藏过
        let index = collect.findIndex(item => item.goods_id === this.GoodsInfo.goods_id);
        // index 不等于-1 说明存在 已经收藏过
        if(index != -1) {
            //将其移除
            collect.splice(index,1)
            //发现内部已经收藏过 将收藏状态改为未收藏
            isCollect = false;
            //出现弹窗
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });

        }else {
            //不存在 则将其加入
            collect.push(this.GoodsInfo)
            //发现内部未收藏过 将收藏状态改为收藏
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }
        //把数组存入到缓存中
        wx.setStorageSync("collect",collect);
        //修改data中isCollect
        this.setData({isCollect});
    }
})