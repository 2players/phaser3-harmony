import Class from 'phaser/utils/Class'
import Components from 'phaser/gameobjects/components'
import GameObject from 'phaser/gameobjects/GameObject'
import RemoveFromDOM from 'phaser/dom/RemoveFromDOM'
import DOMRender from './DOMRender'

/**
 * @classdesc
 * [description]
 *
 * @class DOM
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.12.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {HTMLElement} [element] - The HTML Element to use.
 */

var DOM = new Class({
  Extends: GameObject,

  Mixins: [
    Components.Alpha,
    Components.BlendMode,
    Components.ComputedSize,
    Components.Depth,
    Components.Origin,
    Components.Transform,
    Components.Visible,
    DOMRender,
  ],

  initialize: function DOM(scene, x, y, element) {
    GameObject.call(this, scene, 'DOM')

    this.node = null

    this.parent = scene.sys.game.scale.gameContainer
    this.cache = scene.sys.cache.html

    this.handler = this.dispatchNativeEvent.bind(this)

    this.setPosition(x, y)

    if (typeof element === 'object' && element.nodeType === 1) {
      var node = element
      node.phaser = this
      node.style.zIndex = '0'
      node.style.position = 'absolute'
      node.style.display = 'none'
      this.node = node

      if (this.parent) {
        this.parent.appendChild(node)
      }

      this.setNodeSize(node)
    }
  },

  setNodeSize: function(element) {
    var width
    var height

    var bounds = element.getBoundingClientRect()
    var shouldRotate = this.scene.scale.shouldRotate
    var scale = this.scene.scale.displayScale.x

    if (shouldRotate) {
      width = bounds.height * scale
      height = bounds.width * scale
    } else {
      width = bounds.width * scale
      height = bounds.height * scale
    }

    this.setSize(width, height)
  },

  addListener: function(events) {
    if (this.node) {
      events = events.split(' ')

      for (var i = 0; i < events.length; i++) {
        this.node.addEventListener(events[i], this.handler, false)
      }
    }

    return this
  },

  removeListener: function(events) {
    if (this.node) {
      events = events.split(' ')

      for (var i = 0; i < events.length; i++) {
        this.node.removeEventListener(events[i], this.handler)
      }
    }

    return this
  },

  dispatchNativeEvent: function(event) {
    this.emit(event.type, event)
  },

  createFromCache: function(key, elementType) {
    return this.createFromHTML(this.cache.get(key), elementType)
  },

  createFromHTML: function(html, elementType) {
    if (elementType === undefined) {
      elementType = 'div'
    }

    var element = document.createElement(elementType)

    this.node = element

    element.style.zIndex = '0'
    element.style.display = 'inline'
    element.style.position = 'absolute'

    //  Node handler

    element.phaser = this

    if (this.parent) {
      this.parent.appendChild(element)
    }

    element.innerHTML = html

    this.setNodeSize(element)

    return this
  },

  getChildBySelector: function(selector) {
    if (!this.node) {
      return null
    }

    return this.node.querySelector(selector)
  },

  setText: function(text) {
    if (this.node) {
      this.node.innerText = text

      this.setNodeSize(this.node)
    }

    return this
  },

  setHTML: function(html) {
    if (this.node) {
      this.node.innerHTML = html

      this.setNodeSize(this.node)
    }

    return this
  },

  /**
   * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
   *
   * DOMs always return `true` as they need to still set values during the render pass, even if not visible.
   *
   * @method Phaser.GameObjects.DOM#willRender
   * @since 3.12.0
   *
   * @return {boolean} True if the Game Object should be rendered, otherwise false.
   */
  willRender: function() {
    return true
  },

  destroy: function() {
    RemoveFromDOM(this.node)
  },
})

export default DOM
