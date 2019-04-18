import Phaser from 'phaser'
import GetValue from 'phaser/utils/object/GetValue'
import DOM from './DOM'

class DOMPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager)

    pluginManager.registerGameObject(
      'dom',
      this.factoryCallback,
      this.creatorCallback
    )
  }

  factoryCallback(x, y, element) {
    return this.displayList.add(new DOM(this.scene, x, y, element))
  }

  creatorCallback(config, addToScene) {
    if (config === undefined) {
      config = {}
    }
    const x = GetValue(config, 'x', 0)
    const y = GetValue(config, 'y', 0)
    const element = GetValue(config, 'element', null)

    if (addToScene !== undefined) {
      config.add = addToScene
    }

    const dom = new DOM(this.scene, x, y, element)

    if (config.add) {
      this.scene.sys.displayList.add(dom)
    }

    return dom
  }
}

export default DOMPlugin
