//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    TheText: '',
    EmotionBefore: '',
    TheEmotion: '',
    EmotionAfter: '',
    FileName: '',
    Sound: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      { name: 'y', value: '一致', checked: 'true'},
      { name: 'n', value: '不一致'}
    ],
    chosen: 'y',
    submitStat: 'init',
    playDisable: false,
    audio: null,
  },

  onShow: function(options) {
    console.log("onShow")
    const that = this;
    setTimeout(function() {
      that.getData()
    }, 1000)

    // set audio
    var temp = wx.createInnerAudioContext()
    temp.onPlay(() => {
      console.log('开始播放')
      this.setData({
        playDisable: true
      })
    })
    temp.onError((res) => {
      console.log("播放错误")
      console.log(res.errMsg)
      console.log(res.errCode)
      this.setData({
        playDisable: false
      })
    })
    temp.onEnded(() => {
      console.log("播放结束")
      this.setData({
        playDisable: false
      })
    })
    temp.onStop(() => {
      console.log("播放终止")
    })
    temp.title = "audio"
    this.setData({ audio: temp })

  },

  submit_y: function() {
    this.setData({
      submitStat: 'wait',
      playDisable: true,
    })
    this.data.audio.stop();

    const that = this;
    wx.request({
      url: 'https://hcsi.cs.tsinghua.edu.cn/user_feedback',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        text: this.data.TheText,
        emotion: this.data.TheEmotion,
        filename: this.data.FileName,
        result: 'y'
      },
      success: function (res) {
        console.log("submit data OK");
        setTimeout(function () {
          that.getData()
        }, 1000)
      }
    })
  },

  submit_n: function () {
    const that = this;
    this.setData({
      submitStat: 'wait',
    })
    wx.request({
      url: 'https://hcsi.cs.tsinghua.edu.cn/user_feedback',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        text: this.data.TheText,
        emotion: this.data.TheEmotion,
        filename: this.data.FileName,
        result: 'n'
      },
      success: function (res) {
        console.log("submit data OK");
        setTimeout(function () {
          that.getData()
        }, 1000)
      }
    })
  },

  //播放声音
  play: function () {
    
    const that = this;
    

    var sysInfo = wx.getSystemInfoSync()
    if (sysInfo.platform == 'ios') {
    }

    var src = 'https://hcsi.cs.tsinghua.edu.cn/download_audio?filename=' + encodeURI(this.data.FileName)
    console.log(src)

    var downloadTask = wx.downloadFile({
      url: src,
      success: function (res) {
        console.log(res)
        var path = res.tempFilePath
        console.log(path)
        that.data.audio.src = path
        that.data.audio.play()

      },
      fail: function ({ errMsg }) {
        console.log('downloadFile fail, err is:', errMsg)
      },
    })
    console.log(that.data.audio.src)
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  getData: function() {
    wx.request({
      url: 'https://hcsi.cs.tsinghua.edu.cn/get_rand_audio',
      method: 'GET',
      success: (res) => {
        this.setData({EmotionBefore: '听听这句话是否符合',
                      TheEmotion: res.data.emotion,
                      EmotionAfter: '的情感',
                      TheText: res.data.text,
                      FileName: res.data.filename,
                      submitStat: 'submit',
                      playDisable: false})
        console.log(this.data.FileName)
      }
    })
  }
})
