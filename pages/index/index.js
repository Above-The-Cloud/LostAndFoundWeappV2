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
      '../../images/index/swiper/4.jpg',
      // '../../images/index/swiper/5.png'
    ],
    tagList: [],
    listofitem: [],
    listfound: [{
      header: ' '
    }],
    listlost: [{
      header: ' '
    }, ],
    page: 0,
    cur_type: '所有',
    activeIndex: 1,
    duration: 2000,
    begin: '',
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
    var that = this;
    var content = ''
    if (this.data.type_t == 1)
      content = '确认联系失主找回吗'
    else if (this.data.type_t == 2)
      content = '确认要申领这个物品吗'
    wx.showModal({
      title: '提示',
      content: content,
      success: function (params) {
        if (params.confirm) {
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
          setTimeout(() => {
            that.onLoad()
          }, 2000);

        } else {
          wx.showToast({
            title: '您取消了申请',
            icon: 'none'
          })
        }
      }
    })

  },
  oneKeyBack: function (e) {
    console.log('一键找回')
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否要发布校园卡消息',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1,
            success: function (res) {
              console.log('Recog......')
              console.log(res)
              wx.showLoading({
                title: '识别中，请稍等',
              })
              var tmpfile = res.tempFilePaths;
              wx.uploadFile({
                url: serverName2 + '/service/upload/dynamicImg',
                filePath: tmpfile[0],
                name: "images",
                success: function (res) {
                  console.log('校园卡图片上传！')
                  // console.log(res)
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
                      console.log(res)
                      var results = res.data.data.items
                      console.log(results)
                      var idnumber = that.detectNumber(results)
                      console.log(idnumber)
                      // console.log('是学号吧', idnumber)
                      wx.setStorageSync('schoolCardId', idnumber)
                      wx.setStorageSync('tmpPath', tmpfile)
                      that.setData({
                        schoolCardId: idnumber
                      })
                      wx.hideLoading()
                      wx.showToast({
                        title: '识别完成',
                        duration: 1000
                      })
                      setTimeout(() => {
                        wx.switchTab({
                          url: '../edit/edit',
                        })
                      }, 1000);
                    },
                    fail: function (e) {
                      console.log(e)
                      wx.hideLoading()
                      wx.showToast({
                        title: e.errMsg,
                        icon: none,
                        duration: 1500
                      })
                    }
                  })
                },
                fail: function (err) {
                  console.log(err)
                  wx.hideLoading()
                  wx.showToast({
                    title: err.errMsg,
                    icon: none,
                    duration: 1500
                  })
                }
              })
              that.setData({
                imageList: tmpfile,
                filep: tmpfile
              })
            }
          })
        }
      }
    })

  },
  detectNumber: function (results) {
    // console.log('detect...')
    for (var i = 0; i < results.length; i++) {
      if (isNaN(results[i].text) == false)
        return results[i].text
    }
  },
  searchBykeyword: function (params) {
    console.log('search')
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // bind所有: function (e) {
  //   this.setData({
  //     actionSheetHidden: !this.data.actionSheetHidden,
  //     cur_type: '所有',
  //     listofitem: []
  //   })
  //   this.show_publish_infos(this.data.type_t, this.data.cur_type, this, 'reload')
  // },
  bindChooseCategory: function (params) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      listofitem: []
    })
    console.log(params)  
  },
  actionSheetTap: function (e) {
    var actionSheetItems = this.data.actionSheetItems;
    var that = this
    wx.showActionSheet({
      itemList: actionSheetItems,
      success (res) {
        console.log(res.tapIndex)
        that.setData({
          cur_type:that.data.actionSheetItems[res.tapIndex]
        })
        // that.data.cur_type = that.data.actionSheetItems[res.tapIndex]
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  actionSheetChange: function (e) {
    // console.log('change', e);
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden
    // })

  },
  //事件处理函数
  refresh: function (e) {
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    // console.log(this.data.listfound);
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    // console.log(this.data.listlost);
    var that = this;
    // console.log(this.data.activeIndex);
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
    this.show_publish_infos(this.data.type_t, '所有', this, 'reload')
  },

  stateswitch: function (e) {
    var that = this;
    var type = e.target.dataset.index;
    if (type == 0) {
      this.setData({
        listofitem: this.data.listlost,
        activeIndex: type,
        type_t: 1,
        cur_type: '所有',
        page: 0
      })
      flag = false;

    } else {
      this.setData({
        listofitem: this.data.listfound,
        activeIndex: type,
        type_t: 2,
        cur_type: '所有',
        page: 0
      })
      flag = true;
    }
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this, 'reload')
  },

  bindViewTap: function (e) {

  },

  loadMore: function (e) {},
  getNextDate: function () {
    var now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  Loadmsg: function (mode) {
    var that = this;
    if (mode != 'append') {
      while (this.data.listfound.length != 1)
        this.data.listfound.pop();
      while (this.data.listlost.length != 1)
        this.data.listlost.pop();
    }
    var i = 0;
    var fetchdata = that.data.publish_data
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
      var desc = fetchdata[i].desc;
      var address = location.address;
      if (address)
        address = address;
      else
        address = "";
      if (fetchdata[i].images)
        imageurl = fetchdata[i].images[0];
      if (fetchdata[i].type == 2)
        this.data.listfound.push({
          desc: desc,
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
          desc: desc,
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
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound
      })
    else this.setData({
      listofitem: this.data.listlost
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: serverName2 + '/service/dynamic/categories',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var tempList = ['所有'];
        for (var i = 0; i < 5; i++)
          tempList.push(res.data.data[i].name);
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
  onReachBottom: function () {
    this.data.page++;
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this, 'append')
    wx.showToast({
      title: '正在加载...',
      icon: 'none'
    })
  },
  photopreview: function (event) { //图片点击浏览
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  formatDate: function (endDate) { //将Date类型转换为%Y-%m-%d %H:%M:%S'
    var y = endDate.getFullYear();
    var m = endDate.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = endDate.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = endDate.getHours();
    var minute = endDate.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = endDate.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    let res = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    // console.log(res)
    return res;
  },
  onLoad: function () {
    var now = new Date();
    var preyear = now.getFullYear() - 1; //只读取一年内的数据
    now.setFullYear(preyear)
    this.data.begin = this.formatDate(now)
    var user_id = wx.getStorageSync('user_id');
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
        for (var i = 0; i < tempList.length; i++) {
          tagList.push(tempList[i].name)
        }
        that.setData({
          tagList: tagList
        })
      }
    })
    this.show_publish_infos(this.data.type_t, '所有', this)
    // wx.redirectTo({
    //   url: '../lostrecord/lostrecord',
    // })
  },

  //获取发布信息的接口，传入分类数据
  show_publish_infos: function (type_t, category, obj, mode) {
    // console.log('type_t:' + type_t);
    // console.log('category:' + category);
    let page = this.data.page;
    let begin = this.data.begin;
    if (category == '所有')
      wx.request({
        url: serverName2 + '/service/dynamic/list',
        data: {
          type: type_t,
          size: 10,
          page: page,
          begin: begin,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          obj.Loadmsg(mode)
        }
      })
    else
      wx.request({
        url: serverName2 + '/service/dynamic/list',
        data: {
          type: type_t,
          category: category,
          page: page,
          begin: begin,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          obj.Loadmsg(mode)
        }
      })
  },
})