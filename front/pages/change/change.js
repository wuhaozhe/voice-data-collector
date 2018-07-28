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
    play_tag: null,
    change_start: null,
    change_finish: null,
    submitDisable: false,
    src: ''
  },
  //事件处理函数
  start: function () {
    //开始录音
    console.log('start da')
    this.setData({
      current_tag: 1,
      change_start: 0,
      change_finish: 0,
    })
    this.recorderManager.start({
      sampleRate: 16000
    });
  },
  //停止录音
  stop: function () {
    console.log('stop da')
    this.setData({
      current_tag: 0,
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
    this.setData({
      play_tag: 1,
    })
    this.innerAudioContext.play()
    console.log(this.innerAudioContext.src)

  },
  playafter: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.innerAudioContext.src = this.data.src;  // 这里可以是录音的临时路径
    this.innerAudioContext.play()
    console.log(this.innerAudioContext.src)

  },
  goback: function () {
    //开始录音
    console.log('goback da')
    this.setData({
      current_tag: null,
      change_finish: 0
    })
  },
  bac: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  change: function () {
    this.setData({
      change_finish: 1,
      current_tag: null,
    })
  },
  uplo: function () {
    console.log("datasrc")
    console.log(this.data.src)
    var that = this;
    this.setData({
      change_finish: 1,
      
    })
    wx.uploadFile({
      url: 'https://hcsi.cs.tsinghua.edu.cn/convert_emotion',//开发者文件上传地址
      filePath: that.data.src,
      name: 'audio',
      formData: {
        emotion: that.data.TheEmotion
      },
      success: res => {
        const url = JSON.parse(res.data);//将这个url提交保存
        console.log('yes')
        console.log(that.data.src)
        
        wx.showToast({
          title: '转换完成',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      },
      fail: res => {
        console.log('no')
        console.log(that.data.src)
      },
    });

    wx.uploadFile({
      url: 'https://hcsi.cs.tsinghua.edu.cn/normal_emotion',//开发者文件上传地址
      filePath: that.data.src,
      name: 'audio',
      formData: {
        emotion: that.data.TheEmotion
      },
      success: res => {
        const url = JSON.parse(res.data);//将这个url提交保存
        console.log('yes')
        console.log(that.data.src)

        wx.showToast({
          title: '转换完成',
          icon: 'succes',
          duration: 1000,
          mask: true
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
      url: 'https://hcsi.cs.tsinghua.edu.cn/get_rand_emotion',
      method: 'GET',
      success: function (res) {
        //console.log(that.data.TheText)
        that.setData({
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