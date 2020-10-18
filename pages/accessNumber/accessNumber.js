// pages/initinfo/initinfo.js
const app = getApp()
var serverName = app.globalData.serverName
var serverName2 = 'https://lostandfoundv2.yiwangchunyu.wang'
Page({
  data: {
    array: ['手机号', 'QQ', '微信号'],
    index: 0,
    phoneNumber: '',
    user_id: ''
  },
  onLoad: function (params) {
    console.log(params)
    this.data.user_id = params.id
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  pickerConfirm: function (e) {
    this.setData({
      chosen: e.detail.value
    })
  },
  getPhoneNumber(e) {
    var msg = e.detail.errMsg,
      that = this;
    // var sessionID = that.data.userinfo.Session_key,
    //   encryptedDataStr = e.detail.encryptedData,
    //   iv = e.detail.iv;
    var encryptedDataStr = e.detail.encryptedData,
      iv = e.detail.iv;
    console.log(e)
    if (msg == 'getPhoneNumber:ok') {
      wx.login({
        success: res => {
          console.log(res)
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
    // console.log(sessionID, encryptedDataStr, iv)
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
        let phoneNumber = res.data.data.phoneNumber
        let user_id = that.data.user_id
        var update = '{"phone":' + phoneNumber + '}'
        console.log(update)
        wx.request({
          url: serverName2 + '/service/user/update',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            user_id: user_id,
            update: update
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 0) {
              wx.showToast({
                title: '获取成功，正在跳转',
                icon: 'none'
              })
              setTimeout(function (params) {
                wx.switchTab({
                  url: '../index/index'
                })
              }, 1500)
            }
          }
        })
        //这个res即可返回用户的手机号码
      }
    })
  },
  formSubmit: function (e) {
    //TODO: 表单验证



    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var user_id = (wx.getStorageSync('user_id'))
    console.log('userid: ' + user_id)
    var contact_type = this.data.array[e.detail.value.contact_type]
    var contact_value = e.detail.value.contact_value
    wx.request({
      url: serverName + '/service/user/update',
      data: {
        user_id: user_id,
        contact_type: contact_type,
        contact_value: contact_value,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log('update: success')
        console.log(res.data)
        if (res.data.code == 0) {
          wx.switchTab({
            url: '../index/index'
          })
        } else {
          console.log(res.msg);
        }
      }
    })


  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})