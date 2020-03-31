//index.js
//获取应用实例

var app = getApp()
var utils = require('../../utils/util.js')
var flag = true;

var that = this;
var serverName = app.globalData.serverName
var serverName2 = 'https://lostandfoundv2.yiwangchunyu.wang'
Page({
  data: {
    type_t: 2,
    swiper_url: [
      '../../images/index/swiper/1.jpg',
      '../../images/index/swiper/2.jpg',
      '../../images/index/swiper/3.jpeg',
      '../../images/index/swiper/4.jpg'
    ],
    tagList: [],
    listofitem: [],
    listfound: [{
      header: ' '
    }],
    listlost: [{
      header: ' '
    }, ],
    cur_type: '所有',
    activeIndex: 1,
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
    refresh: 0,
    plain: false,
    actionSheetHidden: true,
    actionSheetItems: ['所有']
  },
  search: function (event, userid) {
    wx.navigateTo({
      url: "../search/search"
    })
  },
  toApply: function (e) {
    console.log(e.currentTarget.dataset)
    var applyId = e.currentTarget.dataset.applyid
    var user_id = wx.getStorageSync('user_id')
    var phone = e.currentTarget.dataset.phone
    console.log(applyId, user_id)
    wx.showToast({
      title: '联系方式为' + phone + '请前往个人页面查看申请记录',
      icon: 'none',
      duration: 2000
    })
    wx.request({
      url: serverName2 + '/service/dynamic/apply',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        id: applyId,
        user_id: user_id
      }
    })
    this.onLoad()
  },
  oneKeyBack: function (e) {
    console.log('一键找回')
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log('Recog......')
        console.log(res)
        var tmpfile = res.tempFilePaths;
        wx.uploadFile({
          url: serverName + '/service/upload/uploadImg',
          filePath: tmpfile[0],
          name: "images",
          success: function (res) {
            console.log('校园卡图片上传！')
            var fdata = JSON.parse(res.data).data;
            fdata = JSON.parse(fdata)
            console.log(fdata[0]);
            wx.request({
              url: 'https://lostandfoundv2.yiwangchunyu.wang/service/dynamic/ocrPrintedText',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                img_url: fdata[0]
              },
              success: function (res) {
                var results = res.data.data.items
                console.log(results)
                var idnumber = that.detectNumber(results)
                console.log(idnumber)
                console.log('是学号吧', idnumber)
                wx.setStorageSync('schoolCardId', idnumber)

                wx.switchTab({
                  url: '../edit/edit',
                })
                that.setData({
                  schoolCardId: idnumber
                })
              }
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
        that.setData({
          imageList: tmpfile,
          filep: tmpfile
        })
      }
    })
  },
  detectNumber: function (results) {
    console.log('detect...')
    for (var i = 0; i < results.length; i++) {
      if (isNaN(results[i].text) == false)
        return results[i].text

    }


  },
  bind所有: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '所有',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind校园卡: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '校园卡',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind钱包: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '钱包',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind钥匙: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '钥匙',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind雨伞: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '雨伞',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind证件: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '证件',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind其他: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '其他',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  actionSheetTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {
    console.log('change', e);
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //事件处理函数
  refresh: function (e) {
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    console.log('refresh');
    console.log(this.data.listfound);
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    console.log(this.data.listlost);
    var that = this;
    console.log(this.data.activeIndex);
    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound,
        cur_type: '所有'

      })
    else
      this.setData({
        listofitem: this.data.listlost,
        cur_type: '所有'
      })

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos(this.data.type_t, '所有', this)
  },

  stateswitch: function (e) {
    var that = this;
    var type = e.target.dataset.index;
    if (type == 0) {
      this.setData({
        listofitem: this.data.listlost,
        activeIndex: type,
        type_t: 1,
        cur_type: '所有'
      })
      flag = false;

    } else {
      this.setData({
        listofitem: this.data.listfound,
        activeIndex: type,
        type_t: 2,
        cur_type: '所有'
      })
      flag = true;
    }
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
    //console.log(that.data.publish_data);
  },

  bindViewTap: function (e) {

  },

  loadMore: function (e) {},
  getNextDate: function () {
    var now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  Loadmsg: function () {
    var that = this;
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    var i = 0;
    var fetchdata = that.data.publish_data
    console.log('fetch', fetchdata)
    for (i = 0; i < fetchdata.length; i++) {
      var Msg = fetchdata[i].content;
      var user_id = fetchdata[i].user_id;
      var str = fetchdata[i].ctime;
      var Submission_time = str
      var imageurl = '';
      var postid = fetchdata[i].id
      var imageList = (fetchdata[i].images);
      var user_icon = fetchdata[i].user_info.avatar;
      var nick_name = fetchdata[i].user_info.nick_name;
      var phone = fetchdata[i].user_info.phone
      var location = fetchdata[i].location;
      var state = fetchdata[i].state
      var type = '#' + this.data.tagList[parseInt(fetchdata[i].category) - 1];
      var title = fetchdata[i].title;
      var address = location.address;
      if (address)
        address = address;
      else
        address = "";
      if (fetchdata[i].images)
        imageurl = fetchdata[i].images[0];
      if (fetchdata[i].type == 2)
        this.data.listfound.push({
          postid: postid,
          userid: user_id,
          userphone: phone,
          username: nick_name,
          state: state,
          text: Msg,
          title: title,
          imagelist: imageList,
          image: imageurl,
          usericon: user_icon,
          sub_time: Submission_time,
          address: address,
          type: type
        })
      else if (fetchdata[i].type == 1)
        this.data.listlost.push({
          postid: postid,
          userid: user_id,
          userphone: phone,
          username: nick_name,
          state: state,
          text: Msg,
          title: title,
          imagelist: imageList,
          image: imageurl,
          usericon: user_icon,
          sub_time: Submission_time,
          address: address,
          type: type
        });
    }
    // console.log('lost',this.data.listlost)
    // console.log('found',this.data.listfound)
    // console.log(this.data.activeIndex)
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound
      })
    else this.setData({
      listofitem: this.data.listlost
    })
    // console.log(this.data.listofitem)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // console.log('onshow',this.data.listofitem)
    wx.request({
      url: 'https://lostandfound.yiwangchunyu.wang/service/dynamic/categories',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data.data);
        var tempList = ['所有'];
        for (var i = 0; i < res.data.data.length; i++)
          tempList.push(res.data.data[i]);
        that.setData({
          actionSheetItems: tempList
        })
      }
    })
  },
  onPullDownRefresh: function () {
    this.onload;
    this.refresh();
  },
  photopreview: function (event) { //图片点击浏览
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onLoad: function () {
    var user_id = wx.getStorageSync('user_id');
    console.log(user_id);
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    var that = this;

    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound,
        cur_type: '所有'
      })
    else this.setData({
      listofitem: this.data.listlost,
      cur_type: '所有'
    })
    //获取类别array
    wx.request({
      url: 'https://lostandfoundv2.yiwangchunyu.wang/service/dynamic/categories',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var tempList = res.data.data;
        var tagList = [];
        console.log('tempList', tempList)
        for (var i = 0; i < tempList.length; i++) {
          tagList.push(tempList[i].name)
        }
        that.setData({
          tagList: tagList
        })
      }
    })

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos(this.data.type_t, '所有', this)
    // console.log(this.data)
  },

  //获取发布信息的接口，传入分类数据
  show_publish_infos: function (type_t, category, obj) {
    console.log('type_t:' + type_t);
    console.log('category:' + category);
    if (category == '所有')
      wx.request({
        url: serverName2 + '/service/dynamic/list',
        data: {
          type: type_t,
          size: 20
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data)
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          // console.log('当前数据库返回的publish记录')
          // console.log(res)
          obj.Loadmsg()
        }
      })
    else
      wx.request({
        url: serverName2 + '/service/dynamic/list',
        data: {
          type: type_t,
          category: category
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          // console.log('当前数据库返回的publish记录')
          // console.log(res)
          obj.Loadmsg()
        }
      })
  },
})