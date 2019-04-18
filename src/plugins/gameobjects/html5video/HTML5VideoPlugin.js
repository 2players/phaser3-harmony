import Phaser from 'phaser'
import HTML5Video from './HTML5Video'

class HTML5VideoPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager)

    pluginManager.registerGameObject(
      'html5video',
      this.factoryCallback,
      this.creatorCallback
    )
  }

  factoryCallback(x, y, url, options) {
    return this.displayList.add(new HTML5Video(this.scene, x, y, url, options))
  }

  creatorCallback() {}
}

export default HTML5VideoPlugin
