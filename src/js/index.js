import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

const createElement = document.createElement.bind(document)

const global = {x:0,y:0,scale:1}

init()

async function init(){
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()

  const viewports = createViewports()
  const [firstImage] = imageList

  const img = await loadImage(`/img/${firstImage}`)
  imageToViewport(img, viewports)

  const boundCalculateSize = calculateSize.bind(null, img, viewports)
  window.addEventListener('resize', boundCalculateSize)
  boundCalculateSize()

  ////////////////////////

  const viewport = viewports[0].parentNode
  drag((dx,dy)=>{
    const {x,y} = global
    viewport.style.backgroundPosition = `${x+dx}px ${y+dy}px`
  }).end((dx,dy)=>{
    global.x += dx
    global.y += dy
    const {x,y} = global
    viewport.style.backgroundPosition = `${x}px ${y}px`
  })
  zoom((scale)=>{
    const realScale = scale*global.scale
    const {naturalWidth, naturalHeight} = img
    viewport.style.backgroundSize = `${realScale*naturalWidth/2}px ${realScale*naturalHeight}px`
  }).end((scale)=>{
    const realScale = scale*global.scale
    const {naturalWidth, naturalHeight} = img
    viewport.style.backgroundSize = `${realScale*naturalWidth/2}px ${realScale*naturalHeight}px`
    global.scale = realScale
  })
  // document.addEventListener('wheel',e=>{
  //   const {naturalWidth, naturalHeight} = img
  //   const realScale = (1+(e.deltaY/1E3))*global.scale
  //   viewport.style.backgroundSize = `${realScale*naturalWidth/2}px ${realScale*naturalHeight}px`
  //   global.scale = realScale
  // })

  console.log('initialised', imageList.join(', ')) // todo: remove logssp
}

function calculateSize(img, viewports){
  const {naturalWidth, naturalHeight} = img
  const arImg = (naturalWidth/2)/naturalHeight

  const {documentElement: {clientWidth, clientHeight}} = document
  const arViewport = (clientWidth/2)/clientHeight

  const hor = arImg<arViewport
  console.log('hor',hor)
  console.log('\t',arImg,arViewport)
  console.log('\t',naturalHeight,clientHeight)
  const scale =
      (hor?clientWidth/2:clientHeight)
      /(hor?naturalWidth/2:naturalHeight)
  const percentage = Math.ceil(scale*100)+'%'

  console.log('scale', scale, percentage)

  const viewport = viewports[0].parentNode
  viewport.style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`

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

