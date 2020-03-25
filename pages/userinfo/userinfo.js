// pages/myinfo/myinfo.js

const app = getApp()
var serverName = app.globalData.serverName
var utils = require('../../utils/util.js')
var flag = true;
var type_t = 'lost'
//var publish_data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userid:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: [],
    // list: [],
    listofitem: [],
    listfound: [{ header: ' ' }],
    listlost: [{ header: ' ' },],
    activeIndex: 1,
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
    refresh: 0,
    plain: false,
    actionSheetHidden: true,

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  Loadmsg: function (Data) {
    var that = this;
    //   while (this.data.listfound.length != 1)
    //       this.data.listfound.pop();
    //   while (this.data.listlost.length != 1)
    //       this.data.listlost.pop();
    var i = 0;
    console.log('Data!!!')
    console.log(Data)
    for (i = 0; i < Data.length; i++) {
      var userid = Data[i].user_info.nick_name;
      var Msg = Data[i].content;
      var Submission_time = Data[i].mtime;
      var imageurl = '';
      var user_icon = Data[i].user_info.avatar_url;
      var publish_id = Data[i].dynamic_id;
      var imageList = that.data.publish_data[i].images;
      // var nick_name = that.Data[i].nickName,
      // var avatarUrl = that.Data[i].avatarUrl,
      if (Data[i].images)
        imageurl = Data[i].images[0];
      //   if (that.Data[i].type == 'lost')
      this.data.listfound.push({
        username: userid, text: Msg, image: imageurl, imagelist: imageList, usericon: user_icon, sub_time: Submission_time, publish_id: publish_id
      });
      //   else
      //   this.data.listlost.push({ username: userid, text: Msg, image: imageurl, usericon: user_icon, sub_time: Submission_time });
    }
    this.setData({
      listofitem: this.data.listfound
    })
  },

  onLoad: function (options) {
    this.setData({
      userid:options.userid
    })
    console.log(this.data.userid);
    var user_id = this.data.userid;
    this.get_current_user_info(user_id);
    this.get_publish_of_mine(user_id);
    console.log('llllllalala')
    console.log(this.data)
    // console.log(publish_data)
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    console.log('清空');
    console.log(this.data.listfound);
    console.log('上面是found信息')
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    console.log(this.data.listlost);
    // console.log('上面是lost信息')
    var that = this;

    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listlost + this.data.listlost,
      })
    else this.setData({
      listofitem: this.data.listlost + this.data.listlost,
    })


    // console.log(this.data)
  },



  //删除函数
  messageDelete: function (e) {
    //TODO:调用函数deleteSingleMassageById(publish_id)
    console.log(e);
    console.log(e.target.dataset.publishId);
    var pubid = e.target.dataset.publishId;
    this.deleteSingleMassageById(pubid);
  },

  get_current_user_info: function (user_id) {

    //传入的user_id如果是当前登录者， 请用user_id: wx.getStorageSync('user_id') 传入
    var that = this
    wx.request({
      url: serverName + '/service/user/getById',
      data: {
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },

      success: function (res) {
        that.setData({
          nickName: res.data.data['nick_name'],
          avatarUrl: res.data.data['avatar_url'],
          contact_type: res.data.data['contact_type'],
          contact_value: res.data.data['contact_value']
        })
      }
    })
    console.log('get_current_user_id....')
    console.log(user_id)
  },

  get_publish_of_mine: function (user_id) {

    //传入的user_id如果是当前登录者， 请用user_id: wx.getStorageSync('user_id') 传入
    var that = this
    wx.request({
      url: serverName + '/service/dynamic/show',
      data: {
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(' get_publish_of_mine......')
        console.log(res)
        that.setData({
          publish_data: res.data.data.dynamics
        })
        var publish_data = res.data.data.dynamics;
        that.Loadmsg(publish_data);
      }
    })

  }
})
