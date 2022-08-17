/*
import {init, createSprite} from './method'
import {changeCanvasText} from './canvas'

const list = [
  {
    position: { x: 20, y: -125, z: -10 },
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: { x: -75, y: -125, z: -10 },
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: { x: 40, y: -135, z: 145 },
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: { x: -70, y: -140, z: 90 },
    content: `${random()}℃，${random()}Pa`
  },
  {
    position: { x: -20, y: -135, z: -106 },
    content: `${random()}℃，${random()}Pa`
  }
]
window.onload = () => {
  init({
    el: `#threeContainer`,
    modelUrl: require('./assets/model.glb').default,
    showController: true,
    onModelLoaded(){
      //准备一些数据，找到要添加标注的position，position在model里
      list.forEach(item => {
        const { canvas, texture } = createSprite({ ...item })
        item.canvas = canvas
        item.texture = texture
      })

      setInterval(() => {
        list.forEach(item => {
          const content = `${random()}℃，${random()}KPa`
          changeCanvasText(item.canvas, content)
          item.texture.needsUpdate = true
        })
      }, 1000)
    }
  })
}

function random() {
  return Math.ceil(Math.random() * 1000);
}
*/

function test(){
  import('./canvas').then(r =>{
    console.log(r)
  })
}

test()
