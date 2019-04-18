import DOMCSSRenderer from './DOMCSSRenderer'
import NOOP from 'phaser/utils/NOOP'

let renderWebGL = NOOP
let renderCanvas = NOOP

if (typeof WEBGL_RENDERER) {
  renderWebGL = DOMCSSRenderer
}

if (typeof CANVAS_RENDERER) {
  renderCanvas = DOMCSSRenderer
}

export default {
  renderWebGL,
  renderCanvas,
}
