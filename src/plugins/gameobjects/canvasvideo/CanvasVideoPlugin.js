import Phaser from 'phaser'
import CanvasVideo from './CanvasVideo'

class HTML5VideoPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager)

    pluginManager.registerGameObject(
      'canvasvideo',
      this.factoryCallback,
      this.creatorCallback
    )
  }

  factoryCallback(x, y, url, options) {
    return this.displayList.add(new CanvasVideo(this.scene, x, y, url, options))
  }

  creatorCallback() {}
}

export default HTML5VideoPlugin
