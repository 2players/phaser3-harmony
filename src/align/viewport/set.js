/**
 * Takes given Game Object and aligns it according the viewport's position.
 *
 * @function Phaser.Display.Align.Viewport.Set
 * @since 3.17.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be positioned.
 * @param {Object} options - position object consists of top, bottom, left and right.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was aligned.
 */
function Set(gameObject, options) {
  if (!gameObject || !(gameObject && gameObject.active)) {
    return
  }

  options = options || {}
  var top = options.top
  var bottom = options.bottom
  var left = options.left
  var right = options.right
  var centerX = options.centerX
  var centerY = options.centerY

  // $ indicates that the unit is CSS pixel.
  var scale = gameObject.scene.scale
  var bounds = scale.canvasBounds

  var $x = bounds.x
  var $y = bounds.y
  var $width = scale.scaledSize.width
  var $height = scale.scaledSize.height
  var $viewportWidth = scale.viewportSize.width
  var $viewportHeight = scale.viewportSize.height
  var scaleX = scale.displayScale.x
  var scaleY = scale.displayScale.y

  // adjust $left, $top, $right, $bottom according the scale mode
  var $properLeft = $x >= 0 ? 0 : -$x
  var $properTop = $y >= 0 ? 0 : -$y

  var $properWidth = $width > $viewportWidth ? $viewportWidth : $width
  var $properHeight = $height > $viewportHeight ? $viewportHeight : $height
  var $properRight = $properLeft + $properWidth
  var $properBottom = $properTop + $properHeight
  var $properCenterX = $properLeft + $properWidth / 2
  var $properCenterY = $properLeft + $properHeight / 2

  var boundLeft = $properLeft * scaleX
  var boundTop = $properTop * scaleY
  var boundRight = $properRight * scaleX
  var boundBottom = $properBottom * scaleY
  var boundCenterX = $properCenterX * scaleX
  var boundCenterY = $properCenterY * scaleY

  var x = boundLeft
  var y = boundTop

  if (left !== undefined) {
    x = boundLeft + left
  }
  if (top !== undefined) {
    y = boundTop + top
  }
  if (right !== undefined) {
    x = boundRight - right
  }
  if (bottom !== undefined) {
    y = boundBottom - bottom
  }
  if (centerX !== undefined) {
    x = boundCenterX + centerX
  }
  if (centerY !== undefined) {
    y = boundCenterY + centerY
  }

  gameObject.setPosition(x, y)

  return gameObject
}

export default Set
