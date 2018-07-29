//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    TheText: '哈哈哈',
    TheEmotion: '愤怒',
    current_tag: null,
    play_tag: null,
    change_start: null,
    change_finish: null,
    submitDisable: false,
    normalFileName: '',
    emotionFileName: '',
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
  pause: function () {
    console.log('pause da')
    this.setData({
      play_tag: 0,
    })
    this.innerAudioContext.pause();
    
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
    console.log("datasrc")
    console.log(this.data.src)
    const that = this;
    this.setData({
      change_start: 1,
    })
    wx.uploadFile({
      url: 'https://hcsi.cs.tsinghua.edu.cn/convert_emotion',//开发者文件上传地址
      filePath: that.data.src,
      name: 'audio',
      formData: {
        emotion: that.data.TheEmotion
      },
      success: res => {
        console.log('convert success')
        console.log(res)
        var temp = JSON.parse(res.data)
        console.log(temp)
        console.log(that)
        that.setData({
          emotionFileName: temp.filename
        })
        console.log(that.data.emotionFileName)

        const audio = wx.createInnerAudioContext()
        audio.onPlay(() => {
          console.log('开始播放')
          this.setData({
            playDisable: true
          })
        })
        audio.onError((res) => {
          console.log("errrrrrrrrrrrrrror")
          console.log(res.errMsg)
          console.log(res.errCode)
          this.setData({
            playDisable: false
          })
        })
        audio.onEnded(() => {
          console.log("end")
          this.setData({
            playDisable: false
          })
        })

        var sysInfo = wx.getSystemInfoSync()
        if (sysInfo.platform == 'ios') {
        }

        var src = 'https://hcsi.cs.tsinghua.edu.cn/download_audio?filename=' + encodeURI(that.data.emotionFileName)
        console.log(src)

        var downloadTask = wx.downloadFile({
          url: src,
          success: function (res) {
            console.log(res)
            var path = res.tempFilePath
            console.log(path)
            audio.src = path
            audio.play()

          },
          fail: function ({ errMsg }) {
            console.log('downloadFile fail, err is:', errMsg)
          },
        })
        audio.title = "audio"
        console.log(audio.src)
        console.log("hhh")


      },
      fail: res => {
        console.log('convert fail')
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
        console.log('normal success')
        that.normalFileName = res["filename"]
        console.log(that.normalFileName)
      },
      fail: res => {
        console.log('normal fail')
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