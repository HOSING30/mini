import {request} from "../../request/index.js"
Page({
  data: {
    goods:[],
    isFocus:false,
    //输入框的值
    iptValue:""
  },
  TimeId:-1,
  // 输入框的值改变就会触发的事件
  handleInput(e) {
    clearTimeout(this.TimeId);
    const {value} = e.detail;
    // 检验合法性
    if(!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false,
      })
      // 值不合法
      return 
    }
    this.setData({
      isFocus:true
    })
    
    this.TimeId = setTimeout(() => {
      //3.发送请求获取数据
      this.qsearch(value);
    }, 500);

  },
  //发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({url:"/goods/qsearch",data:{query}});
    this.setData({goods:res})
  },
  // 点击取消按钮事件
  handleCancel() {
    this.setData({
      goods:[],
    isFocus:false,
    iptValue:""
    })
  }

})