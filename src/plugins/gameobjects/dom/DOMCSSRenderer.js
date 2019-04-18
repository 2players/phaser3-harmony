import GameObject from 'phaser/gameobjects/GameObject'
import CSSBlendModes from './CSSBlendModes'

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DOMElement#renderWebGL
 * @since 3.12.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active renderer.
 * @param {Phaser.GameObjects.DOMElement} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
function DOMCSSRenderer(renderer, src, interpolationPercentage, camera) {
  const element = src.node

  if (
    !element ||
    GameObject.RENDER_MASK !== src.renderFlags ||
    (src.cameraFilter !== 0 && src.cameraFilter & camera.id)
  ) {
    if (element) {
      element.style.display = 'none'
    }

    return
  }

  const offsetX = src.originX * src.width
  const offsetY = src.originY * src.height

  element.style.display = 'block'
  element.style.opacity = src.alpha
  element.style.zIndex = src._depth
  element.style.pointerEvents = 'auto'
  element.style.mixBlendMode = CSSBlendModes[src._blendMode]

  element.style.left = src.x - offsetX + 'px'
  element.style.top = src.y - offsetY + 'px'
  element.style.width = src.width + 'px'
  element.style.height = src.height + 'px'

  /* eslint-disable-next-line */
  element.style.transform = `matrix(${src.scaleX}, 0, 0, ${
    src.scaleY
  }, 0, 0) rotate(${src.angle}deg)`
}

export default DOMCSSRenderer
