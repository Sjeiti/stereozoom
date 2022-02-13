import {overwriteLog} from './utils/overwriteLog'

import '../scss/style.scss'

import {imageList} from './imageList'
console.log('imageList',imageList) // todo: remove log

const createElement = document.createElement.bind(document)

init()

async function init(){
  console.log('init',23) // todo: remove logss

  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()


  const viewports = createViewports()
  const [firstImage] = imageList

  const img = await loadImage(`/img/${firstImage}`)
  imageToViewport(img, viewports)
}

function createViewports(){
  const viewport = createElement('div')
  viewport.classList.add('viewport')
  document.body.appendChild(viewport)
  return [1,1].map(()=>viewport.appendChild(createElement('div')))
}

function loadImage(uri){
	return new Promise((resolve, reject)=>{
    const img = document.createElement('img')
    img.addEventListener('load', e=>{
      const {target, target: {naturalWidth, naturalHeight}} = e
      resolve(target)
    })
    img.src = uri
  })
}

function imageToViewport(img, viewports){
  getHalfData(img).forEach((dataUri, index)=>{
    const {naturalWidth, naturalHeight} = img
    Object.assign(viewports[index].style, {
      backgroundImage: `url(${dataUri})`
    })
  })
}

function getHalfData(img) {
  const {naturalWidth, naturalHeight} = img
  const canvas = document.createElement('canvas')
  canvas.width = naturalWidth/2
  canvas.height = naturalHeight
  const context = canvas.getContext('2d')
  context.drawImage(img, 0, 0)
  const first = canvas.toDataURL()
  context.drawImage(img, -naturalWidth/2, 0)
  const second = canvas.toDataURL()
  return [first, second]
}

