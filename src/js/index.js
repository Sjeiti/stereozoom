import {overwriteLog} from './utils/overwriteLog'
import {drag} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

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

  const boundCalculateSize = calculateSize.bind(null, img, viewports)
  window.addEventListener('resize', boundCalculateSize)
  boundCalculateSize()

  const viewport = viewports[0].parentNode
  drag((x,y)=>{
    //console.log('drag',x,y)
    viewport.style.backgroundPosition = `${x}px ${y}px`  
  })
  zoom((x,y,xl,yl,xs,ys)=>{
    //console.log('zoom',x,y,xl,yl,xs,ys)
    viewport.style.backgroundSize = `${xs}px ${ys}px`  
  })
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
  //viewports[0].style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`
  //viewports[0].style.backgroundSize = '200% 100%'
  //viewports[0].style.backgroundSize = Math.ceil(2*scale*100)+'%'+' '+percentage
  //viewport.style.backgroundSize = percentage
  //viewport.style.backgroundSize = '200% 100%'
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

