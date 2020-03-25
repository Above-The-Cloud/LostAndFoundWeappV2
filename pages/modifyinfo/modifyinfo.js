// pages/modifyinfo/modifyinfo.js
const app = getApp()
var serverName = app.globalData.serverName
Page({

  /**
   * 页面的初始数据
   */
  data: {
      array: ['手机号', 'QQ', '微信号'],
      index: 0,
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    //TODO: 表单验证
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var user_id = (wx.getStorageSync('user_id'))
    //console.log('userid: ' + user_id)
    var contact_type = this.data.array[e.detail.value.contact_type]
    var contact_value = e.detail.value.contact_value
    console.log(user_id, contact_type, contact_value)
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
        console.log(res);
        if(res.data.code == 0)
        {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000,
            mask: true,
            success: function(res) {
              setTimeout(function(){
                wx.switchTab({
                  url: '../myinfo/myinfo',
                })
              }, 2000)
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        else{
          wx.showToast({
            title: '修改失败，请联系管理员',
            icon: 'none',
            duration: 2000,
            mask: true,
            success: function (res) {
              setTimeout(function () {
                wx.switchTab({
                  url: '../myinfo/myinfo',
                })
              }, 2000)
             },
            fail: function (res) { },
            complete: function (res) { },
          })
        }

      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})