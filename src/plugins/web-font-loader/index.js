import Phaser from 'phaser'
import WebFontFile from './web-font-file'

const loader = function(key, url) {
  const config = {
    type: 'webfont',
    url,
    key,
  }

  this.addFile(new WebFontFile(this, config))

  return this
}

class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager)

    pluginManager.registerFileType('webFont', loader)
  }

  addToScene(scene) {
    scene.sys.load['webFont'] = loader
  }
}

export default WebFontLoaderPlugin
