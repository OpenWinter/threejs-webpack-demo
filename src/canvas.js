export function createCanvas(text = ''){
  const canvas = document.createElement('canvas')
  canvas.width = 250
  canvas.height = 250
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(0,0,0,.7)'
  ctx.fillRect(0,0,250,90)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 32px 宋体'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text,125,45)
  return canvas
}

export function changeCanvasText(canvas,text){
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0,0,250,90)
  ctx.fillStyle = 'rgba(0,0,0,.7)'
  ctx.fillRect(0,0,250,90)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 32px 宋体'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text,125,45)
}
