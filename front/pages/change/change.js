//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const audio = wx.createInnerAudioContext()
const normalaudio = wx.createInnerAudioContext()
var tempFilePath;
Page({
  data: {
    TheText: '',
    TheEmotion: '',
    current_tag: null,
    play_tag: null,
    play1_tag: 1,
    play2_tag: 1,
    play3_tag: 1,
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
      current_tag: 2,
    })
    this.recorderManager.stop()
  },
  //播放声音
  play: function () {  
    this.normalaudio.play()
    console.log(this.normalaudio.src)
  },
  playafter: function () {
    this.audio.play()
    console.log(this.audio.src)
  },
  playbefore: function () {
    console.log('play da')
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      this.setData({
        play1_tag: 1,
      })
      // 播放音频失败的回调
    })
    this.innerAudioContext.onPlay(() => {
      this.setData({
        play1_tag: 0,
      })
    })
    this.innerAudioContext.onEnded(() => {
      this.setData({
        play1_tag: 1,
      })
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
      change_finish: 0,
      change_start: 0,
      play1_tag: 1,
      play2_tag: 1,
      play3_tag: 1,
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
    const that = this;
    this.setData({
      change_start: 1,
      play1_tag: 0
    })
    wx.showLoading({
      title: '转换中',
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

        this.audio = wx.createInnerAudioContext()
        this.audio.onPlay(() => {
          console.log('开始播放')
          this.setData({
            playDisable: true,
            play2_tag: 0,
          })
        })
        this.audio.onError((res) => {
          console.log("errrrrrrrrrrrrrror")
          console.log(res.errMsg)
          console.log(res.errCode)
          this.setData({
            play2_tag: 1,
            playDisable: false
          })
        })
        this.audio.onEnded(() => {
          console.log("end")
          this.setData({
            play2_tag: 1,
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
            that.audio.src = path
            //this.audio.play()

          },
          fail: function ({ errMsg }) {
            this.setData({
              current_tag: null,
              change_finish: 0,
              change_start: 0,
              play1_tag: 1,
              play2_tag: 1,
              play3_tag: 1,
            })
            console.log('downloadFile fail, err is:', errMsg)
          },
        })
        this.audio.title = "audio"
        console.log(this.audio.src)
        console.log("hhh")


      },
      fail: res => {
        this.setData({
          current_tag: null,
          change_finish: 0,
          change_start: 0,
          play1_tag: 1,
          play2_tag: 1,
          play3_tag: 1,
        })
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
        //that.normalFileName = res["filename"]
        var tempp = JSON.parse(res.data)
        that.setData({
          normalFileName: tempp.filename
        })
        console.log(res)
        console.log(that.data.emotionFileName)
        this.normalaudio = wx.createInnerAudioContext()
        this.normalaudio.onPlay(() => {
          console.log('开始播放')
          this.setData({
            play3_tag: 0,
            playDisable: true
          })
        })
        this.normalaudio.onError((res) => {
          console.log("errrrrrrrrrrrrrror")
          console.log(res.errMsg)
          console.log(res.errCode)
          this.setData({
            play3_tag: 1,
            playDisable: false
          })
        })
        this.normalaudio.onEnded(() => {
          console.log("end")
          this.setData({
            play3_tag: 1,
            playDisable: false
          })
        })

        var sysInfo = wx.getSystemInfoSync()
        if (sysInfo.platform == 'ios') {
        }

        var src = 'https://hcsi.cs.tsinghua.edu.cn/download_audio?filename=' + encodeURI(that.data.normalFileName)
        console.log(src)

        var downloadTask = wx.downloadFile({
          url: src,
          success: function (res) {
            that.setData({
              change_finish: 1,
              current_tag: null,
            })
            console.log(res)
            console.log("download_normal_succ")
            var path = res.tempFilePath
            console.log(path)
            that.normalaudio.src = path
            wx.hideLoading()
            //this.audio.play()

          },
          fail: function ({ errMsg }) {
            this.setData({
              current_tag: null,
              change_finish: 0,
              change_start: 0,
              play1_tag: 1,
              play2_tag: 1,
              play3_tag: 1,
            })
            console.log('downloadFile fail, err is:', errMsg)
          },
        })
        this.normalaudio.title = "audio"
        console.log(this.normalaudio.src)
        console.log("hhh")
      },
      fail: res => {
        this.setData({
          current_tag: null,
          change_finish: 0,
          change_start: 0,
          play1_tag: 1,
          play2_tag: 1,
          play3_tag: 1,
        })
        console.log('normal fail')
      },
    });

  },
  onLoad: function () {
    var that = this;
    this.setData({
      play1_tag: 1,
      play2_tag: 1,
      play3_tag: 1,
    })
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