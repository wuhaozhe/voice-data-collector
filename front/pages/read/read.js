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
    current_tag: null,
    uplo_start: null,
    uplo_finish: null,
    submitDisable: false,
    src: ''
  },
  //事件处理函数
  start: function () {
    //开始录音
    console.log('start da')
    this.setData({
      current_tag: 1,
      uplo_start: 0,
      uplo_finish: 0,
    })
    this.recorderManager.start({
      sampleRate: 16000
    });
  },
  goback: function () {
    //开始录音
    console.log('goback da')
    this.setData({
      current_tag: null,
    })
    this.recorderManager.start({
      sampleRate: 16000
    });
  },
  //停止录音
  stop: function () {
    console.log('stop da')
    this.setData({
      current_tag: 2,
    })
    this.recorderManager.stop()
  },
  //播放声音
  play: function () {
    console.log('play da')
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.innerAudioContext.src = this.data.src;  // 这里可以是录音的临时路径
    this.innerAudioContext.play()
    console.log(this.innerAudioContext.src)

  },
  playover: function () {
    console.log('playover da')
    this.setData({
      current_tag: 1,
    })
  },
  nex: function () {
    wx.navigateTo({
      url: '../change/change'
    })
  },
  bac: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  uplo: function () {
    var that = this;
    this.setData({
      uplo_start: 1,
    })
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
        wx.showToast({
          title: '上传成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
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
        this.setData({
          current_tag: null,
        })
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