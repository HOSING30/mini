import { request } from '../../request/index.js'


Page({
    data: {
        tabs: [{
            id: 0,
            value: '综合',
            isActive: true
        }, {
            id: 1,
            value: '销量',
            isActive: false
        }, {
            id: 2,
            value: '价格',
            isActive: false
        }, ],
        goodsList: [],
    },
    //接口要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    //总页数
    totalPages: 1,
    onLoad: function(options) {
        this.QueryParams.cid = options.cid||"";
        this.QueryParams.query = options.query||"";
        this.getGoodsList();
    },

    //获取商品列表数据
    async getGoodsList() {
        const res = await request({ url: '/goods/search', data: this.QueryParams });
        //获取 总条数
        const total = res.total;
        //计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        console.log(this.totalPages);
        this.setData({
                //拼接数组
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            //关闭下拉刷新 即使第一次打开没有触发下拉刷新也不会报错
        wx.stopPullDownRefresh()
    },

    // 标题点击事件 从子组件传过来的自定义事件
    handleTabsItemChange(e) {
        //获取被点击的标题索引
        const index = e.detail.index;
        //修改原数组
        let tabs = this.data.tabs;
        tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false);
        //赋值到data中
        this.setData({
            tabs
        })
    },
    //页面触底
    //1.用户赏花页面 滚动条触底 开始加载下一页数据
    //    判断还有没有下一页的数据
    //  1.获取到总页数 只有总条数
    //    总页数 = Math.ceil(总条数 / 页容量 pagesize)
    //    总页数   =Math.ceil( 23 / 10) = 3
    //  2.获取当前的页码  pagenum
    //  3.判断一下 当前页码是否大于等于 总页数
    //     没有则没下一页

    //  3.假如没有下一页数据 弹出一个指示框
    //  4.假如有下一页数据   来加载下一页数据
    //   1.当前页码++
    //   2.重新发送请求
    //   3.数据请求回来 要对data中的数组 进行拼接 而不是全部替换
    //2.下来刷新页面
    //  1.触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    //    找到 触发下拉刷新事件
    //  2.重置 数据  数组
    //  3.重置页码 设置为1
    //  4.重新发送请求
    //  5.数据请求回来 需要手动的关闭 等待效果

    onReachBottom() {
        //1.判断还有没有下一页数据
        if (this.QueryParams.pagenum >= this.totalPages) {
            //没有下一页数据
            // console.log("没有下一页数据");
            wx.showToast({ title: '没有下一页数据' });
        } else {
            //还有下一页数据
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    onPullDownRefresh() {
        //重置数组
        this.setData({
                goodsList: []
            })
            //重置页码
        this.QueryParams.pagenum = 1;
        //发送请求
        this.getGoodsList()
    }

})