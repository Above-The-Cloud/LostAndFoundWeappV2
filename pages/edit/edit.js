//index.js
//获取应用实例
const app = getApp()
var serverName = app.globalData.serverName
var categories = app.globalData.categories
var serverName2 = 'https://lostandfoundv2.yiwangchunyu.wang'
Page({
  data: {
    itemList: [],
    campusSelected: '中北',
    typeSelected: 2,
    showTagSheet: false,
    tagSelected: 9,
    tagSheetItems: [],
    schoolCardId: null,
    campusItems: [{
        name: '中北',
        value: '中北',
        checked: 'true'
      },
      {
        name: '闵行',
        value: '闵行',

      },
    ],
    typeItems: [{
      name: '拾物',
      value: '2',
      checked: 'true'
    }, {
      name: '失物',
      value: '1'
    }],
    longitude: "",
    latitude: "",
    post_desc: "粉色水杯",
    tag: "",
    id_number: "",
    displayAddress: "添加定位",
    address: '',
    speed: 0,
    accuracy: 0,
    array: categories,
    category_index: 0,
    category: '所有',
    type_array: ['lost', 'found'],
    listfound: [{
      header: ' '
    }],
    listlost: [{
      header: ' '
    }, ],
    images: [],
    activeIndex: 1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: [],
    publish_id: -1,
    image_exist: 0,
    //图片路径
    tempFilePaths: null,
    //分类按钮
    showModalStatus: false,
    filep: [],
    //导航栏
    navbar: ['LOST', 'FOUND'],
    currentTab: 0,
    imageList: [],
    tvalue: '',
    location: "拾取地点"
  },
  radioCampusChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      campusSelected: e.detail.value
    })
  },
  radioTypeChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      typeSelected: parseInt(e.detail.value)
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  ocrRecog: function (e) {
    var that = this
    wx.chooseImage({
      count: 2,
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
                console.log(results[5].text)
                that.setData({
                  id_number: results[5].text,
                  schoolCardId: results[5].text
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
  clearData: function()
  {
    this.setData({
      imageList:[],
      displayAddress: "添加定位",
      address:"",
      post_desc: "",
      schoolCardId: null,
      id_number: null,
      tagSelected: null
    })
  },
  onLoad: function (options) {
    var that = this
    that.clearData()
    // var number = wx.getStorageSync('schoolCardId')
    // console.log(number)
    // this.setData({
    //   id_number:number,
    //   schoolCardId:number
    // })
    wx.request({
      url: 'http://lostandfoundv2.yiwangchunyu.wang/service/dynamic/categories',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var tempList = res.data.data;
        var tagList = [];
        console.log('tempList', tempList)
        for (var i = 0; i < tempList.length; i++) {
          tagList.push({
            'text': tempList[i].name,
            'value': tempList[i].id
          })
        }
        that.setData({
          tagSheetItems: tagList
        })
      }
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx

    })
  },
  //单选框触发函数
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

  },
  //
  stateswitch: function (e) {

    this.setData({
      tvalue: '',
      imageList: [],
      category_index: 0,
    })
  },

  //事件处理函数
  bindViewTap: function () {

  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      success: function (res) {
        console.log('chooseimage.......')
        console.log(res)
        var tmpfile = res.tempFilePaths;
        console.log(tmpfile);
        that.setData({
          imageList: tmpfile,
          filep: tmpfile
        })
        console.log(that.data.imageList);
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    console.log('current')
    console.log(current)
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  bindLocation: function (e) {
    console.log('bindLocation');
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          displayAddress: res.name,
          address: res.name,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {},
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index_val = this.data.array[e.detail.value]
    this.setData({
      category_index: e.detail.value,
      category: index_val
    })
    console.log('category_index:')
    console.log(this.data.category_index)
    console.log(this.data.category)
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bind_desc_input: function (e) {
    this.setData({
      post_desc: e.detail.value
    })
  },
  toRelease: function (e) {
    var user_id = wx.getStorageSync('user_id')
    console.log('toRelease')
    console.log(this.data.post_desc)
    console.log(this.data.campusSelected)
    console.log(this.data.typeSelected)
    console.log(this.data.tagSelected)
    console.log(this.data.displayAddress)
    console.log(this.data.filep)
    console.log(user_id)
    this.createPost(user_id, this.data.typeSelected, this.data.tagSelected, this.data.post_desc, '描述', this.data.filep)
  },

  createPost: function (user_id, type_t, category, title, msg, imagesPaths) {
    var publish_id = null;
    var thatInstance = this;
    var upLocation = "{\"longitude\":\"" + thatInstance.data.longitude + "\",\"latitude\":\"" + thatInstance.data.latitude + "\", \"address\":\"" + thatInstance.data.address + "\"}";
    console.log(upLocation);
    var uploadFormdata = {
      user_id: user_id,
      type: type_t,
      category: category,
      desc:msg,
      title: title,
      location: upLocation
    }
    if(this.data.schoolCardId != null)
      uploadFormdata['meta'] = this.data.schoolCardId
    console.log(user_id)
    console.log(uploadFormdata)
    wx.request({
      url: serverName2 + '/service/dynamic/create',
      data: uploadFormdata,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var dynamic_id = res.data.data.id;
          console.log('当前发布的动态id为', dynamic_id);
          console.log(imagesPaths)
          var temp = [];
          for (var path in imagesPaths) {
            console.log(path)
            wx.uploadFile({
              url: serverName2 + '/service/upload/dynamicImg',
              filePath: imagesPaths[path],
              name: "images",
              success: function (res) {
                console.log('图片上传！')
                var fdata = JSON.parse(res.data).data;
                fdata = JSON.parse(fdata)
                temp.push(fdata[0])
                console.log(temp);
                if (temp.length == imagesPaths.length)
                    thatInstance.updatePostImg(dynamic_id, temp)
                  // thatInstance.updatePhoto(dynamic_id, temp);
              },
              fail: function (err) {
                console.log(err)
              }
            })
          }
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 3000
          })
          // 跳转到主页
          
          // var page = getCurrentPages().pop();
          thatInstance.onLoad()
          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              setTimeout(function () {
                page.onLoad();
              }, 2000);

            }
          })
        }
        // publish_id=res.data.data.publish_id;
        // console.log('当前数据库返回的publish_id')
        // console.log(publish_id)
      }
    })
  },
  updatePostImg: function (dynamic_id, images) {
    console.log("imagesurl列表为")
    console.log(images.length)
    var imageurls = JSON.stringify(images);
    console.log(imageurls);
    wx.request({
      url: serverName2 + '/service/dynamic/update',
      method: 'POST',
      data: {
        id: dynamic_id,
        images: imageurls
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (e) {
        console.log('修改上传图片')
        console.log(e)
      }
    })
  },
  tagSheetChange: function (e) {
    console.log('tagSheetChange')
  },
  tagChoose: function (e) {
    console.log(e.detail.value)
    this.setData({
      tagSelected: e.detail.value
    })
  },
  tagAction: function (e) {
    this.setData({
      showTagSheet: !this.data.showTagSheet
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.input == "") {
      wx.showToast({
        title: '请输入要发布的内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this;
    var formData = e.detail.value;
    var user_id = wx.getStorageSync('user_id')
    var type_t = this.data.type_array[this.data.currentTab]
    var category = this.data.category
    var title = ''
    var msg = e.detail.value.input
    var imagesPaths = this.data.filep
    console.log('我要发布啦！！！', user_id, type_t, category, title, msg, imagesPaths)
    console.log("imageList..........")
    console.log(imagesPaths)
    //在此调用uploadAll接口
    this.uploadAll(user_id, type_t, category, title, msg, imagesPaths, [])
  },

  //imagesPaths图片路径数组
  updatePhoto: function (dynamic_id, images) {
    console.log("imagesurl列表为")
    console.log(images.length)
    var imageurls = JSON.stringify(images);
    console.log(imageurls);
    wx.request({
      url: serverName + '/service/dynamic/update',
      method: 'POST',
      data: {
        dynamic_id: dynamic_id,
        images: imageurls
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (e) {
        console.log('修改上传图片')
        console.log(e)
      }
    })
  },
  uploadAll: function (user_id, type_t, category, title, msg, imagesPaths) {
    var publish_id = null;
    var thatInstance = this;
    var upLocation = "{\"longitude\":\"" + thatInstance.data.longitude + "\",\"latitude\":\"" + thatInstance.data.latitude + "\", \"address\":\"" + thatInstance.data.address + "\"}";
    console.log(upLocation);
    wx.request({
      url: serverName + '/service/dynamic/create',
      data: {
        user_id: user_id,
        type: type_t,
        category: category,
        content: msg,
        location: upLocation
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var dynamic_id = res.data.data.dynamic_id;
          console.log('当前发布的动态id为', dynamic_id);
          var temp = [];
          for (var path in imagesPaths) {
            console.log(path)
            wx.uploadFile({
              url: serverName + '/service/dynamic/picRcgnz',
              filePath: imagesPaths[path],
              name: "images",
              success: function (res) {
                console.log('图片识别！')
                console.log(res);
                var data = JSON.parse(res.data);
                wx.showModal({
                  title: '提示',
                  content: '识别分类为' + data.data.keyword,
                  confirmText: '确认',
                  cancelText: '识别不准',
                  success(res) {
                    if (res.confirm) {
                      console.log('识别准确')
                      wx.request({
                        url: serverName + '/service/dynamic/update',
                        method: 'POSt',
                        data: {
                          dynamic_id: dynamic_id,
                          category: data.data.keyword
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (e) {
                          console.log('修改上传图片')
                          console.log(e)
                        }
                      })
                    } else if (res.cancel) {
                      console.log('识别不准')
                      wx.showActionSheet({
                        itemList: thatInstance.data.itemList, //上传分类
                        success(res) {
                          wx.request({
                            url: serverName + '/service/dynamic/update',
                            method: 'POST',
                            data: {
                              dynamic_id: dynamic_id,
                              category: thatInstance.data.itemList[res.tapIndex]
                            },
                            header: {
                              'content-type': 'application/x-www-form-urlencoded' // 默认值
                            },
                            success: function (e) {
                              console.log('修改上传图片')
                              console.log(e)
                            }
                          })
                        },
                        fail(res) {
                          console.log(res.errMsg);
                        }
                      })
                    }
                  }
                })
              },
              fail: function (err) {
                console.log(err)
              }
            })
            wx.uploadFile({
              url: serverName + '/service/upload/uploadImg',
              filePath: imagesPaths[path],
              name: "images",
              success: function (res) {
                console.log('图片上传！')
                var fdata = JSON.parse(res.data).data;
                fdata = JSON.parse(fdata)
                temp.push(fdata[0])
                console.log(temp);
                if (temp.length == imagesPaths.length)
                  thatInstance.updatePhoto(dynamic_id, temp);
              },
              fail: function (err) {
                console.log(err)
              }
            })

          }
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 3000
          })
          //跳转到主页
          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              setTimeout(function () {
                page.onLoad();
              }, 2000);

            }
          })
        }
        // publish_id=res.data.data.publish_id;
        // console.log('当前数据库返回的publish_id')
        // console.log(publish_id)




      }
    })
  },
  onShow: function () {
    var number = wx.getStorageSync('schoolCardId')
    wx.setStorageSync('schoolCardId', '')
    console.log(number)
    this.setData({
      id_number:number,
      schoolCardId:number
    })
  },
})