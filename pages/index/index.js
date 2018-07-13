//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '点击头像进行人脸识别',
    // userInfo: {},
    Industry: {},
    tmpFilePaths: '',
    loadingHidden: true,
    condition: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    //console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  },

  // 上传图片
  upload: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths[0])
        // 打开 loading 动画
        that.setData({
          loadingHidden: false
        });
        wx.uploadFile({
          url: 'https://www.classmateer.com/WhatsStar/FaceMatch.php', // 接口地址
          filePath: tempFilePaths[0],
          name: 'upfile',
          formData: {
            'user': ''
          },
          success: function(res) {
            // 关闭 loading 动画
            that.setData({
              loadingHidden: true,
            });
            var ret = JSON.parse(res.data) //字符串转对象
            console.log(ret)
            //do something
            if (ret.res_code == "0000") {
              that.setData({
                condition: true,
                tmpFilePaths: tempFilePaths,
                Industry: ret.result
              });
            } else {
              wx.showToast({
                title: ret.message,
                icon: 'success'
              });
            }
          },
          fail: function() {
            // 关闭 loading 动画
            that.setData({
              loadingHidden: true
            });
            wx.showToast({
              title: 'Sorry, please try again.',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  // ajax测试
  getSimilarStar: function() {
    var that = this
    wx.request({
      url: 'https://www.classmateer.com/WhatsStar/FaceMatch.php', // 上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {
        'url': "https://imgsa.baidu.com/baike/s%3D500/sign=89fc6048d0ca7bcb797bc72f8e0b6b3f/96dda144ad3459824945bc190bf431adcaef846a.jpg"
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header  
      success: function(res) {
        //console.log(res.data.result)
        that.setData({
          Industry: res.data.result
        })
      },
      fail: function() {
        // fail  
      },
      complete: function() {
        // complete  
      }
    })
  }

})