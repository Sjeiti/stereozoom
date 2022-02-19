import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

const createElement = document.createElement.bind(document)

const globalDefault = {x:0,y:0,scale:1}
const global = Object.assign({},globalDefault)

init()

async function init(){
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()

  const viewports = createViewports()

  createMenu(viewports)

  const [firstImage] = imageList
  const img = await loadImageToViewport(firstImage,viewports)

  initEvents(viewports,img)
}

function initEvents(viewports,img){
  const boundCalculateSize = calculateSize.bind(null, img, viewports)
  window.addEventListener('resize', boundCalculateSize)
  boundCalculateSize()

  const viewport = viewports[0].parentNode
  drag((dx,dy)=>{
    const {x,y} = global
    setPosition(viewport,x+dx,y+dy)
  }).end((dx,dy)=>{
    global.x += dx
    global.y += dy
    const {x,y} = global
    setPosition(viewport,x,y)
  })
  zoom((scale)=>{
    const realScale = scale*global.scale
    setScale(viewport,img,realScale)
  }).end((scale)=>{
    const realScale = scale*global.scale
    setScale(viewport,img,realScale)
    global.scale = realScale
  })

  console.log('initialised') // todo: remove log
}

function calculateSize(img, viewports){
  const {naturalWidth, naturalHeight} = img
  const arImg = (naturalWidth/2)/naturalHeight

  const {documentElement: {clientWidth, clientHeight}} = document
  const arViewport = (clientWidth/2)/clientHeight

  const hor = arImg<arViewport
  const scale =
      (hor?clientWidth/2:clientHeight)
      /(hor?naturalWidth/2:naturalHeight)
  global.scale = scale
  const percentage = Math.ceil(scale*100)+'%'

  const viewport = viewports[0].parentNode
  setScale(viewport,img,scale)
}

function createViewports(){
  const viewport = createElement('div')
  viewport.classList.add('viewport')
  document.body.appendChild(viewport)
  return [1,1].map(()=>viewport.appendChild(createElement('div')))
}

function createMenu(viewports){
  const div = createElement('div')
  div.classList.add('menu')
  const select = createElement('select')
  div.appendChild(select)
  imageList.forEach(img=>{
    const [name] = img.replace(/-/g,' ').split(/_/g)
    const option = createElement('option')
    option.value = img
    option.textContent = name
    select.appendChild(option)
  })
  select.addEventListener('change',onSelectChange.bind(null,viewports))
  document.body.appendChild(div)
  select.addEventListener('mousedown',e=>e.stopPropagation())
}

async function onSelectChange(viewports,e){
  const {target:{value}} = e
  loadImageToViewport(value)
  const img = await loadImageToViewport(value,viewports)
  Object.assign(global,globalDefault)
}

async function loadImageToViewport(file,viewports){
  const img = await loadImage(`/img/${file}`)
  imageToViewport(img, viewports)
  return img
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

function setPosition(target,x,y){
  const {min} = Math  
  target.style.backgroundPosition = `${min(x,0)}px ${min(y,0)}px`
}
function setScale(target,img,scale){
  const {naturalWidth, naturalHeight} = img
  target.style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`
}

