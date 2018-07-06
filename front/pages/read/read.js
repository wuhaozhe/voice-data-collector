//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    TheText: '你好',
    TheEmotion:'愤怒'
  },
  //事件处理函数
  start: function () {
    //开始录音
    this.recorderManager.start({
      format: 'mp3'  // 如果录制acc类型音频则改成aac
    });
  },
  //停止录音
  stop: function () {
    this.recorderManager.stop()
  },
  //播放声音
  play: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.innerAudioContext.src = this.data.src;  // 这里可以是录音的临时路径
    this.innerAudioContext.play()
    console.log(this.innerAudioContext.src)

  },
  nex: function () {
    wx.navigateTo({
      url: '../read/read'
    })
  },
  onLoad: function () {
    var that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      // 录音失败的回调处理
    });
    this.recorderManager.onStop(function (res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      that.setData({
        src: res.tempFilePath
      })
      wx.uploadFile({
        url: 'http://166.111.139.44:8001/upload_audio',//开发者文件上传地址
        filePath: res.tempFilePath,
        name: 'audio',
        formData: {
          text: '111',
          emotion: '222'
        },
        success: res => {
          const url = JSON.parse(res.data);//将这个url提交保存
          console.log('yes')
        },
        fail: res => {
          console.log('this.innerAudioContext.src')
        },
      });
      console.log(res.tempFilePath)
    });
  }
})
