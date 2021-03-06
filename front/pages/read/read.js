//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    emotionBefore: '',
    TheText: '',
    emotionAfter: '',
    TheEmotion: '',
    src: '',
    submitStat: 'init',
  },
  //事件处理函数
  start: function () {
    //开始录音
    console.log('start da')
    this.setData({
      submitStat: 'recording',
    })
    this.recorderManager.start({
      sampleRate: 16000
    });
  },
  goback: function () {
    console.log('goback da')
    this.setData({
      submitStat: 'record',
    })
  },
  stop: function () {
    console.log('stop da')
    this.setData({
      current_tag: 2,
    })
    console.log(this.recorderManager)
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
      submitStat: 'wait',
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

        wx.request({
          url: 'https://hcsi.cs.tsinghua.edu.cn/datagen',
          method: 'GET',
          success: function (res) {
            //console.log(that.data.TheText)
            setTimeout(()=>{
              that.setData({
                TheText: res.data.text,
                TheEmotion: res.data.emotion,
                submitStat: 'record',
              })
            }, 1000)
            
            //console.log(that.data.TheText)
          }
        })
      },
      fail: res => {
        console.log('no')
        console.log(that.data.src)
      },
    });
  },

  onShow: function () {
    var that = this;
    
    setTimeout(()=>{
      wx.request({
        url: 'https://hcsi.cs.tsinghua.edu.cn/datagen',
        method: 'GET',
        success: function (res) {
          //console.log(that.data.TheText)
          that.setData({
            emotionBefore: '请用',
            TheText: res.data.text,
            emotionAfter: '的感情阅读下方文本:',
            TheEmotion: res.data.emotion,
            submitStat: 'record',
          })
        }
      })
    }, 1000)
    
    this.recorderManager = wx.getRecorderManager();
    console.log(this.recorderManager)
    this.recorderManager.onError(function () {
      // 录音失败的回调处理
    });
    this.recorderManager.onStop(function (res) {
      console.log("hahaha")
      // 停止录音之后，把录取到的音频放在res.tempFilePath
      console.log('stop dfffa')
      that.setData({
        src: res.tempFilePath,
        submitStat: 'submit',
      })
      console.log(res.tempFilePath)
    });
    this.recorderManager.onStart(function (res) {
      console.log("cao")
    });
  }
})