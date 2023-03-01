/* eslint-disable no-unused-vars */// noinspection JSUnusedLocalSymbols

import { Application, Container, Graphics, Point, Sprite, WRAP_MODES, filters } from 'pixi.js'
import gsap, { Linear } from 'gsap'
import { watch } from 'vue'

let app, container, child

function loadAssets(list)
{
  app.loader.add('displacement', 'https://i.imgur.com/k0uS2K0.png')

  for (const { key, img } of list) {
    app.loader.add(key, img)
  }

  app.loader.load()
}

/**
* @param {import('@pixi/core/index').Texture} texture
*/
function setFilter(texture)
{
  const displacementSprite = new Sprite(texture)

  displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT

  container.filters = [new filters.DisplacementFilter(
    displacementSprite
  )]

  container.addChild(displacementSprite)

  gsap.to(displacementSprite, {
    ease: Linear.easeNone,
    y: window.innerHeight,
    x: window.innerWidth,
    duration: 10,
    repeat: -1
  })
}

/**
* @param {import('@pixi/core/index').Texture} texture
*/
function setTexture(texture)
{
  const img = new Sprite(texture)

  // position
  img.x = app.renderer.width / 2
  img.y = app.renderer.height / 2

  // rotate around center
  img.anchor.x = .5
  img.anchor.y = .5

  // slide = background(containerSize, img, 'cover')
  container.addChild(img)
  container.removeChild(child)

  child = img
}

/**
* @see https://gist.github.com/only-cliches/581823db9cdc8d94ed3f78c1a548f50d
* @see https://www.html5gamedevs.com/topic/46176-how-to-make-background-image-cover-and-responsive
* @see https://www.html5gamedevs.com/topic/42553-resize-window
* Pixi.js Background Cover/Contain Script
*  Returns object
*  {
*    container: PixiJS Container
*    doResize: Resize callback
*  }
*  ARGS:
*  bgSize: Object with x and y representing the width and height of background. Example: { x:1280, y:720 }
*  inputSprite: Pixi Sprite containing a loaded image or other asset.  Make sure you preload assets into this sprite.
*  type: String, either "cover" or "contain".
*  forceSize: Optional object containing the width and height of the source sprite, example: { x:1280, y:720 }
*/
function background(bgSize, inputSprite, type, forceSize)
{
  const sprite = inputSprite
  const bgContainer = new Container()
  const mask = new Graphics().beginFill(0x8bc5ff).drawRect(0,0, bgSize.x, bgSize.y).endFill()

  bgContainer.mask = /** @type Container */ mask
  bgContainer.addChild(mask)
  bgContainer.addChild(sprite)

  function resize() {
    const sp = forceSize ? forceSize : { x: sprite.width, y: sprite.height }
    const winratio = bgSize.x / bgSize.y
    const spratio = sp.x / sp.y
    const pos = new Point(0, 0)

    let scale

    if (type === 'cover' ? (winratio > spratio) : (winratio < spratio)) {
      // photo is wider than background
      scale = bgSize.x / sp.x
      pos.y = -((sp.y * scale) - bgSize.y) / 2
    } else {
      // photo is taller than background
      scale = bgSize.y / sp.y
      pos.x = -((sp.x * scale) - bgSize.x) / 2
    }

    sprite.scale = new Point(scale,scale)
    sprite.position = pos
  }

  resize()

  return {
    container: bgContainer,
    doResize: resize
  }
}

export function usePixi({ width, height, active, ...rest })
{
  app = new Application({ width, height, ...rest })
  // renderer = autoDetectRenderer({ width, height })
  container = new Container()

  app.loader.onComplete.once(onAssetsLoaded)
  app.stage.addChild( container )

  /**
  * @param {{ displacement: String }} resources
  */
  function onAssetsLoaded({ resources })
  {
    setTexture(resources[active.value.key].texture)
    setFilter(resources.displacement.texture)

    watch(() => active.value, ({ key }) => {
      setTexture(resources[key].texture)
    })
  }

  return {
    loadAssets,
    container,
    app
  }
}
