import Class from 'phaser/utils/Class'
import DOM from '../dom/DOM'
import Spinner from '../spinner/Spinner'
import Merge from 'phaser/utils/object/Merge'
import JSMpeg from './vendor/jsmpeg.min.js'

/**
 * @classdesc
 * [description]
 *
 * @class CanvasVideo
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} url - The url of video.
 * @param {Object} options - Options supported by JSMpeg.
 *
 * @see https://github.com/phoboslab/jsmpeg
 */
const CanvasVideo = new Class({
  Extends: DOM,

  initialize: function CanvasVideo(scene, x, y, url, options) {
    this.ready = false
    this.readyTime = 0
    this.isPlaying = false
    this.previousTime = 0
    this.timerConfig = {
      delay: 1000,
      callback: this.showSpinner,
      callbackScope: this,
    }

    this.videoPlayer = this.createPlayer(url, options)
    var canvas = this.videoPlayer.renderer.canvas

    DOM.call(this, scene, x, y, canvas)
    this.bindEvents()

    this.spinner = this.createSpinner()
  },

  destroy: function() {
    this.unbindEvents()

    // destroy player
    this.videoPlayer.destroy()

    // destroy canvas
    DOM.prototype.destroy.call(this)
  },

  createPlayer: function(url, options) {
    if (options === undefined) {
      options = {}
    }

    var canvas = document.createElement('canvas')
    var allOptions = Merge(options, {
      loop: false,
      canvas: canvas,
      videoBufferSize: 2048 * 1024, // 1024 means 1KB
      onEnded: this.onEnd.bind(this),
    })

    var player = new JSMpeg.Player(url, allOptions)

    return player
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
    this.onPositionSpinner = this.positionSpinner.bind(this)
    this.scene.events.on('update', this.onProgressCallback)
    this.scene.events.on('update', this.onPositionSpinner)
  },

  unbindEvents: function() {
    this.scene.events.off('update', this.onProgressCallback)
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

  unlock: function() {
    return Promise.resolve()
  },

  play: function() {
    this.emit('play')
    return this.nativePlay()
  },

  pause: function() {
    this.emit('pause')
    return this.nativePause()
  },

  reset: function() {
    this.emit('reset')
    this.videoPlayer.currentTime = this.readyTime
  },

  nativePlay: function() {
    return new Promise(resolve => {
      /* eslint-disable-line es5/no-arrow-functions, brace-style */
      this.isPlaying = true
      this.addSpinnerTimer()
      this.videoPlayer.play()
      resolve()
    })
  },

  nativePause: function() {
    return new Promise(resolve => {
      /* eslint-disable-line es5/no-arrow-functions, brace-style */
      this.isPlaying = false
      this.removeSpinnerTimer()
      this.videoPlayer.pause()
      resolve()
    })
  },

  duration: {
    get: function() {
      return this.videoPlayer.duration
    },
  },

  currentTime: {
    get: function() {
      return this.videoPlayer.currentTime
    },
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

export default CanvasVideo
