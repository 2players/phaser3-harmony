import Phaser from 'phaser'

class EasyTimePlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager)
  }

  delay(delay = 1000) {
    return new Promise(resolve => {
      const config = { delay, callback: resolve }
      this.scene.time.addEvent(config)
    })
  }
}

export default EasyTimePlugin
