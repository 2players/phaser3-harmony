import Phaser from 'phaser'

class EasySizePlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager)

    const { width, height } = this.scene.sys.game.config
    this.gameWidth = width
    this.gameHeight = height
    this.gameCenterX = width / 2
    this.gameCenterY = height / 2
  }
}

export default EasySizePlugin
