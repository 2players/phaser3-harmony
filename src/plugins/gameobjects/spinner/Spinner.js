import Class from 'phaser/utils/Class'
import Sprite from 'phaser/gameobjects/sprite/Sprite'
import GetValue from 'phaser/utils/object/GetValue'

/**
 * @classdesc
 * A Spinner Game Object.
 *
 * @class Spinner
 * @extends Phaser.GameObjects.Spinner
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {Object} options - The options.
 */
const Spinner = new Class({
  Extends: Sprite,

  initialize: function Spinner(scene, x, y, options) {
    if (options === undefined) {
      options = {}
    }
    const color = GetValue(options, 'color', 0x5699d2)
    const speed = GetValue(options, 'speed', 0.0035)

    Sprite.call(this, scene, x, y, 'spinner')

    const textureKey = 'phaser-internal-spinner'
    const dataURI =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA+CAMAAABXyBiCAAAALVBMVEVHcEz////////////////////////////////////////////////////////NXt0CAAAADnRSTlMA6s6hkRr6RTdff3EJvuAfGLoAAAEnSURBVHja7dfbisUgDEBRk2jiNf//uUMhdChWe3IY5qnrsbArRagx3EtSWm2tSAof6hKR9cQjynOUCVRZr4DyNhLUBSzrlVA3UBZLsW6wKqW7DPQJyFz1y7uRiGIccF2R25yxmlGln09zu3xxnLqoB6jTF+QIm64TWzRJtFsvpU82pwSPqAaSq6tqMLgUtq46OzXZ15Fl5Mu6beAIPplt75yKbYGXDKQUXq/X62/kATYG+P98zZuRHjg7M7RDq//LaZB9Z+upftmhfnVIJlATvYePwbx+eV/PDqspLlVQqLsOYr6LDm3RGWy5B9OlDnvMECaN9QJGjESErL84zASuk6POMNzopHssrrn8eXMKLiN5vj6o4/pwkjhYT4xRepisr0atrq9GP5VpI3XLFWQCAAAAAElFTkSuQmCC'

    scene.textures.on(
      'onload',
      function(key) {
        if (key !== textureKey) {
          return
        }
        this.setTexture(textureKey)
        this.setTint(color)
      },
      this
    )
    scene.textures.addBase64(textureKey, dataURI)

    scene.events.on(
      'preupdate',
      function(_, delta) {
        if (this.active && this.visible) {
          this.rotation += speed * delta
        }
      },
      this
    )
  },
})

export default Spinner
