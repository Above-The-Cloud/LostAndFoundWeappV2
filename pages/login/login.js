// pages/login/login.js
const app = getApp()
var serverName = app.globalData.serverName
var serverName2 = 'https://lostandfoundv2.yiwangchunyu.wang'
Page({
  data: {
    focus: false,
    inputValue: '',
    userInfo: null,
    phonenumber: '',
    openid: '',
    user_type: 'stu',
    code: ' '
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      user_type: e.detail.value
    })
    console.log(this.data.user_type);
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindPwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phonenumber: e.detail.value
    })
  },
  get_sub_access: function (params) {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['7DRh0tTESxEoYRMPKZOE9p2wNc8OqqZEfsn8Nyh1UyY', '6GQzQDbYDAoxeXwSpwRR9FE_dipmMhbbi5j7flbh0tk'],
      success: res => {
        console.log('success', res)
        console.log('bindgetuserinfo 调用')
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = res.userInfo
                  console.log(res.userInfo)
                  that.setData({
                    userInfo: res.userInfo
                  })
                  that.appLogin();
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      },
      fail: res => {
        console.log('fail', res)
      },
      complete: res => {
        // console.log('complete', complete)
      }
    })
  },
  getPhoneNumber(e) {
    var msg = e.detail.errMsg,
      that = this;
    var encryptedDataStr = e.detail.encryptedData,
      iv = e.detail.iv;
    console.log(e)
    if (msg == 'getPhoneNumber:ok') {
      wx.login({
        success: res => {
          console.log(res, 'sessionkey未过期')
          wx.request({
            url: serverName2 + '/service/user/getOpenid',
            data: {
              js_code: res.code, //获取openid和session_key
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
              var userinfo = res.data.data;
              console.log(res)
              wx.setStorageSync('userinfo', userinfo);
              that.setData({
                userinfo: userinfo
              });
              that.deciyption(userinfo.session_key, encryptedDataStr, iv);
            },
            fail: function (params) {
              console.log(params)

            }
          })
        }
      })
    }
  },
  deciyption(sessionID, encryptedDataStr, iv) {
    console.log(sessionID, encryptedDataStr, iv)
    var that = this
    wx.request({
      url: serverName2 + '/service/user/decryptPhoneNO',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        sessionKey: sessionID,
        encryptedData: encryptedDataStr,
        iv: iv
      },
      success: function (res) {
        console.log(res)
        that.setData({
          phonenumber: res.data.phoneNumber
        })

        //这个res即可返回用户的手机号码
      }
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    wx.showModal({
      title: '登录',
      content: '请确认账号密码无误',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          console.log('用户点击是')
          that.get_sub_access()
        } else {
          console.log('用户点击否')
        }
      },
    })

  },
  appLogin: function (e) {
    var that = this;
    // console.log(app.globalData.userInfo);
    //获得用户的openid
    wx.login({
      success: function (res) {
        // console.log(res); //获取code
        wx.request({
          url: serverName2 + '/service/user/getOpenid',
          data: {
            js_code: res.code, //获取openid和session_key
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          success: function (res) {
            wx.setStorageSync('openid', res.data.data.openid);
            var openid = wx.getStorageSync('openid');
            that.setData({
              openid: openid
            })
            console.log(openid)
            wx.request({
              url: serverName2 + '/service/user/loginByOpenid',
              data: {
                openid: openid
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              method: 'POST',
              success: function (res) {
                // console.log('loginByOpenid', res)
                wx.setStorageSync('user_id', res.data.data.id)
                console.log(that.data)
                var pageds = that.data
                that.statelessLogin(pageds.inputValue, pageds.userInfo.gender, pageds.pwd, pageds.openid, pageds.phonenumber, pageds.userInfo.nickName, pageds.userInfo.avatarUrl)
              }
            })
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    //TODO:表单检查
    // console.log(this.data);
    //DONE:表单检查
    // console.log(e.detail.value)
  },
  onLoad: function () {
    // console.log("login onLoad...")
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
    var openid = wx.getStorageSync('openid');
    if (openid) {
      // console.log('ifopenid', openid);
      wx.request({
        url: serverName2 + '/service/user/loginByOpenid',
        method: 'POST',
        data: {
          openid: openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          let phone = res.data.data.phone;
          let userid = res.data.data.id;
          wx.setStorageSync('user_id', res.data.data.id)
          if (phone != "") {
            wx.showToast({
              title: '正在跳转, 请稍等',
              icon: 'none'
            })
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index',
              })
            }, 500);
          } else {
            setTimeout(() => {
              wx.redirectTo({
                url: '../accessNumber/accessNumber?id=' + userid,
              })
            }, 1000);
          }

        }
      })
    }
  },
  statelessLogin: function (stu_id, gender, password, openid, phone, nickName, avatarUrl) {
    // console.log(stu_id, gender, password, openid, phone, nickName, avatarUrl)
    wx.request({
      url: serverName2 + '/service/user/login',
      data: {
        stu_id: stu_id,
        password: password,
        openid: openid,
        nick_name: nickName,
        avatar: avatarUrl,
        phone: phone,
        gender: gender
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("statelessLogin");
        console.log(res);
        if (res.data.code != 0) {
          // 用户名或密码错误
          // console.log('error: clearall')
          wx.clearStorageSync() //清除所有cache 以防下一次直接登陆
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          var userid = res.data.data.id;
          wx.setStorageSync('user_id', res.data.data.id)
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 3000,
            success: function (e) {
              setTimeout(() => {
                wx.redirectTo({
                  url: '../accessNumber/accessNumber?id=' + userid,
                })
              }, 1000);

              // wx.switchTab({
              //   url: '../index/index'
              // })
            }
          })
        }
      }
    })
  }
})