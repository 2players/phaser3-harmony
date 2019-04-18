import Phaser from 'phaser'
import WebFont from 'webfontloader'

const FILE_POPULATED = Phaser.Loader.FILE_POPULATED

class WebFontFile extends Phaser.Loader.File {
  constructor(loader, fileConfig) {
    super(loader, fileConfig)
  }

  load() {
    if (this.state === FILE_POPULATED) {
      //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
      this.loader.nextFile(this, true)
    } else {
      const { key: name, url } = this

      const style = document.createElement('style')
      document.head.appendChild(style)
      const styles = `@font-face { font-family: "${name}"; src: url("${url}"); }\n`
      style.sheet.insertRule(styles, 0)

      const config = {}
      config.custom = { families: [name] }
      config.active = this.onLoad.bind(this)
      config.inactive = this.onError.bind(this)
      config.fontactive = this.onFontActive.bind(this)
      config.fontinactive = this.onFontInactive.bind(this)

      WebFont.load(config)
    }
  }

  onLoad() {
    this.loader.nextFile(this, true)
  }

  onError() {
    this.loader.nextFile(this, false)
  }

  onFontActive(familyName, fvd) {
    this.loader.emit('webfontactive', this, { familyName, fvd })
  }

  onFontInactive(familyName, fvd) {
    this.loader.emit('webfontinactive', this, { familyName, fvd })
  }
}

export default WebFontFile
