Page({
  data: {
    list: [
      {
        id: 'location1',
        name: '闵行校区',
        open: false,
        pages: [
          {
            zh: '河西食堂',
            url: '780100'
          }, {
            zh: '河东食堂',
            url: '780101'
          }, {
            zh: '秋实阁',
            url: '780102'
          }, {
            zh: '华闵食堂',
            url: '780103'
          }, {
            zh: '图书馆',
            url: '780104'
          }, {
            zh: '大学生活动中心',
            url: '780105'
          }
        ]
      }, {
        id: 'location2',
        name: '中北校区',
        open: false,
        pages: [
          {
            zh: '河西食堂',
            url: '780200'
          }, {
            zh: '河东食堂',
            url: '780201'
          }, {
            zh: '丽娃食堂',
            url: '780202'
          }, {
            zh: '教书院',
            url: '780203'
          }
          , {
            zh: '图书馆',
            url: '780204'
          }
          , {
            zh: '文史楼',
            url: '780205'
          }
        ]
      },
      //  {
      //   id: 'location3',
      //   name: '宿舍',
      //   open: false,
      //   pages: [
      //     {
      //       zh: '第三宿舍',
      //       url: ''
      //     }, {
      //       zh: '第四宿舍',
      //       url: ''
      //     }, {
      //       zh: '第五宿舍',
      //       url: ''
      //     }, {
      //       zh: '闵行7号宿舍',
      //       url: ''
      //     }, {
      //       zh: '闵行8号宿舍',
      //       url: ''
      //     }, {
      //       zh: '闵行9号宿舍',
      //       url: ''
      //     }
      //   ]
      // }, {
      //   id: 'location',
      //   name: '学院',
      //   open: false,
      //   pages: [
      //     {
      //       zh: '计算机科学与技术学院',
      //       url: ''
      //     }, {
      //       zh: '设计学院',
      //       url: ''
      //     }, {
      //       zh: '教育学部',
      //       url: ''
      //     }, {
      //       zh: '心理与认知学院',
      //       url: ''
      //     }
      //   ]
      // }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        if(list[i].url){
          wx.navigateTo({
            url: 'pages/jjj' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})
