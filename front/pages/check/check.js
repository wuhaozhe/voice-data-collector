//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    TheText: '',
    TheEmotion: 'fff',
    FileName: '',
    Sound: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      { name: 'y', value: '一致', checked: 'true'},
      { name: 'n', value: '不一致'}
    ]
  },

  onShow: function(options) {
    console.log(this.data.TheEmotion)
    this.getData()
  },

  //播放声音
  play: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.Sound
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log("ggg")
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play()

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
      url: 'http://166.111.139.44:8001/download_audio',
      method: 'GET',
      success: (res) => {
        this.setData({TheEmotion: res.header.emotion,
                      TheText: res.header.text,
                      FileName: res.header["Content-Disposition"].split("filename=")[1],
                      Sound: res.data})
        console.log(this.data.FileName)
      }
    })
  }
})
