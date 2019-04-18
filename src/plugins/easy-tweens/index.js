import Phaser from 'phaser'

class EasyTweensPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager)
  }

  fadeIn(target) {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: target,
        alpha: 1,
        duration: 1000,
        onComplete: resolve,
        ease: 'Power2',
      })
    })
  }

  fadeOut(target) {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: target,
        alpha: 0,
        duration: 1000,
        onComplete: resolve,
        ease: 'Power2',
      })
    })
  }
}

export default EasyTweensPlugin
