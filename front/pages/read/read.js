//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    TheText: '',
    TheEmotion: '',
    src: ''
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
  bac: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  uplo: function () {
    var that = this;
    wx.uploadFile({
      url: 'https://hcsi.cs.tsinghua.edu.cn/upload_audio',//开发者文件上传地址
      filePath: that.data.src,
      name: 'audio',
      formData: {
        text: that.data.TheText,
        emotion: that.data.TheEmotion
      },
      success: res => {
        const url = JSON.parse(res.data);//将这个url提交保存
        console.log('yes')
        console.log(that.data.src)
      },
      fail: res => {
        console.log('no')
        console.log(that.data.src)
      },
    });
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://hcsi.cs.tsinghua.edu.cn/datagen',
      method: 'GET',
      success: function (res) {
        //console.log(that.data.TheText)
        that.setData({
          TheText: res.data.text,
          TheEmotion: res.data.emotion

        })
        //console.log(that.data.TheText)
      }
    })
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      // 录音失败的回调处理
    });
    this.recorderManager.onStop(function (res) {
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      that.setData({
        src: res.tempFilePath
      })
      console.log(res.tempFilePath)
    });
  }
})