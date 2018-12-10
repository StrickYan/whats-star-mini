//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '点击头像进行人脸识别',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    Industry: {},
    loadingHidden: true,
    condition: false,
    imgUrl: '', // 待匹配的照片URL
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(params) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this;
    if (params.img_url) {
      // 打开 loading 动画
      that.setData({
        loadingHidden: false,
        imgUrl: params.img_url,
      });
      that.getSimilarStar();
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 分享页面
  onShareAppMessage: function(res) {
    var that = this;
    let str = '逍遥哥哥还是神仙姐姐？来看看哪个明星最像你！';
    let pagePath = '/pages/index/index';
    if (that.data.imgUrl) {
      let nickName = that.data.userInfo.nickName
      if (!nickName) {
        nickName = '无名氏';
      }
      str = 'TA 和 神秘明星 长得最像，' + nickName + '邀请你来看一看';
      pagePath = '/pages/index/index?img_url=' + that.data.imgUrl;
    }
    return {
      title: str,
      path: pagePath,
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      Industry: {},
      loadingHidden: true,
      condition: false,
      imgUrl: '', // 待匹配的照片URL
    })
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
          url: 'https://app.beishanwen.com/fm/faceMatch', // 接口地址
          filePath: tempFilePaths[0],
          name: 'upfile',
          formData: {
            'user': ''
          },
          success: function(res) {
            var ret = JSON.parse(res.data) //字符串转对象
            // console.log(ret)
            //do something
            if (0 == ret.errno) {
              that.setData({
                condition: true,
                Industry: ret.data.match_img_infos,
                imgUrl: ret.data.img_url,
              });
            } else {
              wx.showToast({
                title: 'Sorry, please try again.',
                icon: 'success'
              });
            }
          },
          fail: function() {
            wx.showToast({
              title: 'Sorry, please try again.',
              icon: 'success'
            })
          },
          complete: function() {
            // complete
            // 关闭 loading 动画
            that.setData({
              loadingHidden: true,
            });
          }
        })
      }
    })
  },
  getSimilarStar: function() {
    var that = this
    wx.request({
      url: 'https://app.beishanwen.com/fm/faceMatch',
      data: {
        // 'img_url': "https://imgsa.baidu.com/baike/s%3D500/sign=89fc6048d0ca7bcb797bc72f8e0b6b3f/96dda144ad3459824945bc190bf431adcaef846a.jpg"
        'img_url': that.data.imgUrl
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      dataType: "json",
      success: function(res) {
        var ret = res.data;
        console.log(ret)
        // do something
        if (0 == ret.errno) {
          that.setData({
            condition: true,
            Industry: ret.data.match_img_infos,
            imgUrl: ret.data.img_url,
          });
        } else {
          wx.showToast({
            title: 'Sorry, please try again.',
            icon: 'success'
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: 'Sorry, please try again.',
          icon: 'success'
        })
      },
      complete: function() {
        // complete
        // 关闭 loading 动画
        that.setData({
          loadingHidden: true,
        });
      }
    })
  },
  toWhatsStory: function() {
    wx.navigateToMiniProgram({
      appId: 'wxb7165086782dd980',
    })
  }
})