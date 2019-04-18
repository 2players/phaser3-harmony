import Class from 'phaser/utils/Class'
import GetValue from 'phaser/utils/object/GetValue'
import OS from 'phaser/device/OS'
import DOM from '../dom/DOM'
import Spinner from '../spinner/Spinner'

/**
 * @classdesc
 * [description]
 *
 * @class HTML5Video
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} url - The url of video.
 * @param {Object} options - External options.
 */
var HTML5Video = new Class({
  Extends: DOM,

  initialize: function HTML5Video(scene, x, y, url, options) {
    this.preplayPromise = null
    this.ready = false
    this.readyTime = 0
    this.isPlaying = false
    this.previousTime = 0
    this.timerConfig = {
      delay: 1000,
      callback: this.showSpinner,
      callbackScope: this,
    }

    this.videoElement = this.createVideoElement(url, options)

    DOM.call(this, scene, x, y, this.videoElement)
    this.bindEvents()

    this.spinner = this.createSpinner()
  },

  destroy: function() {
    this.unbindEvents()
    DOM.prototype.destroy.call(this)
  },

  createVideoElement: function(url, options) {
    if (options === undefined) {
      options = {}
    }

    var loop = GetValue(options, 'loop', false)

    // possiable value is the same as CSS property - object-fit
    var align = GetValue(options, 'align', 'contain')

    var video = document.createElement('video')
    video.className = 'phaser-video'

    video.crossorigin = 'anonymous'
    video.src = url
    video.loop = loop

    video.style.objectFit = align

    video.setAttribute('preload', 'auto')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '') // WebKit-based browser adaptation
    if (this.isQQBrowserOnIOS()) {
      video.setAttribute('x5-playsinline', '')
    }

    return video
  },

  createSpinner: function() {
    var spinner = new Spinner(this.scene)
      .setDepth(-100)
      .setVisible(false)
      .setActive(false)

    this.scene.add.existing(spinner)

    return spinner
  },

  positionSpinner: function() {
    var x = this.width / 2
    var y = this.height / 2
    this.spinner.setPosition(x, y)
  },

  bindEvents: function() {
    this.onProgressCallback = this.onProgress.bind(this)
    this.onEndCallback = this.onEnd.bind(this)
    this.onPositionSpinner = this.positionSpinner.bind(this)

    this.scene.events.on('update', this.onProgressCallback)
    this.videoElement.addEventListener('ended', this.onEndCallback)
    this.scene.events.on('update', this.onPositionSpinner)
  },

  unbindEvents: function() {
    this.scene.events.off('update', this.onProgressCallback)
    this.videoElement.removeEventListener('ended', this.onEndCallback)
    this.scene.events.off('update', this.onPositionSpinner)
  },

  onProgress: function() {
    this.emit('progress', this.currentTime)
    this.checkResetSpinnerTimer()
  },

  onEnd: function() {
    this.emit('end')
    this.removeSpinnerTimer()
  },

  /**
   * Unlock current video.
   *
   * Notice: unlock() should be called will `await` before play().
   *
   * WARNING: This method can't ensure playing video at a visible progress
   * on iOS < 10.3.1, so you have to call await video.play() to avoid black splash.
   *
   * If you need to unlock multiple videos at once, there are 2 conditions because
   * iOS < 10.3.1 don't support playing multiple videos at one time:
   *
   * @example
   * // When you need to support iOS < 10.3.1:
   * video2.unlock()
   * video3.unlock()
   * await video1.unlock()
   * await video1.play()
   *
   * @example
   * // When you need to support iOS > 10.3.1
   * Promise.all([video1.unlock(), video2.unlock(), video3.unlock()])
   * await video1.play()
   *
   * @see https://stackoverflow.com/a/50480115/1793548
   */
  unlock: function() {
    var isPausedBeforeUnlock = this.videoElement.paused

    return this.nativePlay().then(() => {
      /* eslint-disable-line es5/no-arrow-functions, brace-style */
      if (isPausedBeforeUnlock) {
        return this.nativePause()
      } else {
        return Promise.resolve()
      }
    })
  },

  /**
   * Play current video.
   *
   * This method will preplay video beforehand. There are following reasons to
   * do this:
   * 1. solve the blinking problem when playing video on Android devices.
   * 2. fetch metadata of video in advance, such as `duration`.
   */
  play: function() {
    var video = this.videoElement

    if (this.ready) {
      this.emit('play')
      return this.nativePlay()
    }

    if (this.preplayPromise) {
      return this.preplayPromise
    }

    this.preplayPromise = new Promise(resolve => {
      /* eslint-disable-line es5/no-arrow-functions, brace-style */
      var listener = () => {
        /* eslint-disable-line es5/no-arrow-functions, brace-style */
        var currentTime = this.currentTime
        if (currentTime > 0) {
          video.removeEventListener('timeupdate', listener)

          this.ready = true
          this.readyTime = currentTime

          video.muted = false
          this.emit('play')
          resolve()
        }
      }

      video.addEventListener('timeupdate', listener)
      video.muted = true
      this.nativePlay()
    })
    return this.preplayPromise
  },

  pause: function() {
    this.emit('pause')
    return this.nativePause()
  },

  reset: function() {
    this.emit('reset')
    this.videoElement.currentTime = this.readyTime
  },

  nativePlay: function() {
    this.isPlaying = true
    this.addSpinnerTimer()
    return this.videoElement.play()
  },

  nativePause: function() {
    this.isPlaying = false
    this.removeSpinnerTimer()
    return this.videoElement.pause()
  },

  duration: {
    get: function() {
      return this.videoElement.duration
    },
  },

  currentTime: {
    get: function() {
      return this.videoElement.currentTime
    },
  },

  isQQBrowserOnIOS: function() {
    var ua = navigator.userAgent
    var qqBrowserPattern = /m?(qqbrowser)[\/\s]?([\w\.]+)/i // eslint-disable-line
    return OS.iOS && qqBrowserPattern.test(ua)
  },

  isRealPlaying: {
    get: function() {
      return this.isPlaying && this.currentTime > this.previousTime
    },
  },

  showSpinner: function() {
    this.spinner
      .setVisible(true)
      .setActive(true)
      .setDepth(100)
  },

  hideSpinner: function() {
    this.spinner
      .setVisible(false)
      .setActive(false)
      .setDepth(-100)
  },

  addSpinnerTimer: function() {
    this.timer = this.scene.time.addEvent(this.timerConfig)
  },

  checkResetSpinnerTimer: function() {
    if (this.isRealPlaying && this.timer) {
      this.timer.reset(this.timerConfig)
    }

    this.previousTime = this.currentTime
  },

  removeSpinnerTimer: function() {
    this.hideSpinner()

    this.timer.remove()
    this.timer = null
  },
})

export default HTML5Video
