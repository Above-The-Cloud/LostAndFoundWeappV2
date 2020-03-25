const app = getApp()
var serverName = app.globalData.serverName
Page({
  data: {
    searchs: [],
    current: null,
    listofitem: [],
    hidden: true, // 加载提示框是否显示  
    scrollTop: 0, // 居顶部高度  
    inputShowed: false, // 搜索输入框是否显示  
    inputVal: "", // 搜索的内容  
    histroyShowed: true //搜索记录
  },
  bindKeyInput: function (e) {
    this.data.current = e.detail.value;
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      histroyShowed: false
    });
  },
  photopreview: function (event) {//图片点击浏览
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  addItem: function () {
    if (this.data.current != null) {
      // 交给search_database
      this.search_database(this.data.current, this);
    }
    // this.setData({
    //   inputVal: ""
    // })
  },
  //搜索信息的接口，传入搜索的结果
  Loadmsg: function () {
    this.data.listofitem = [];
    var that = this;
    var i = 0;
    for (i = 0; i < that.data.search_data.length; i++) {
      var nickName = that.data.search_data[i].user_info.nick_name;
      var Msg = that.data.search_data[i].content;
      var user_id = that.data.search_data[i].user_info.user_id;
      var Submission_time = that.data.search_data[i].ctime;
      var imageurl = '';
      var imageList = that.data.search_data[i].images;
      var user_icon = that.data.search_data[i].user_info.avatar_url;
      if (that.data.search_data[i].images)
        imageurl = that.data.search_data[i].images[0];
        this.data.listofitem.push({
          userid: user_id, username: nickName, text: Msg, imagelist: imageList, image: imageurl, usericon: user_icon, sub_time: Submission_time
        })
    }
    console.log('loading over');
    if(this.data.listofitem.length == 0)
    wx.showToast({
      title: '对不起, 没有找到您搜索的物品信息',
      icon: 'none',
      duration: 1500
    })
    else
      wx.showToast({
        title: '搜索到'+this.data.listofitem.length+'条记录',
        icon: 'none',
        duration: 1500
      })
    this.setData({
      listofitem: this.data.listofitem
    })
  },
  search_database: function (key, obj) {
    wx.request({
      url: serverName + '/service/dynamic/show',
      data: {
        content__icontains: key
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        obj.setData({
          search_data: res.data.data.dynamics
        })
        console.log('当前数据库返回的search记录');
        // console.log(res);
        obj.Loadmsg();
      }
    })

  },
  deleteItem: function (e) {
    var key = e.target.dataset.key;
    this.ref.child(key).remove();
  },

  onLoad: function (options) {
    // this.ref = app.getTodoRef();
    // this.ref.on('child_added', function (snapshot, prkey) {
    //   var key = snapshot.key()
    //   var text = snapshot.val()
    //   // JSON结构
    //   var newItem = { key: key, text: text }
    //   this.data.searchs.push(newItem);
    //   this.setData({
    //     searchs: this.data.searchs
    //   })
    // }, this);
    // this.ref.on('child_removed', function (snapshot) {
    //   var key = snapshot.key();
    //   var index = this.data.searchs.findIndex(
    //     (item, index) => {
    //       if (item.key == key) {
    //         return true;
    //       }
    //       return false;
    //     });
    //   if (index >= 0) {
    //     this.data.searchs.splice(index, 1);
    //     this.setData({
    //       searchs: this.data.searchs
    //     })
    //   }
    // }, this)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
  },

  // 点击叉叉icon 清除输入内容，同时清空关键字，并加载数据  
  clearInput: function () {
    this.data.current = null;
    this.setData({
      scrollTop: 0,
      inputVal: ""
    });

  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  }
})