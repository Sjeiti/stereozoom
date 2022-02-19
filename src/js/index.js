import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

const {min} = Math

const createElement = document.createElement.bind(document)

const globalDefault = {x:0,y:0,scale:1}
const global = Object.assign({},globalDefault)

init()

async function init(){
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()

  const viewports = initViewports()

  const [firstImage] = imageList
  const img = await loadImageToViewport(firstImage,viewports)

  initMenu(viewports,img)

  initEvents(viewports,img)
}

function initViewports(){
  const viewport = createElement('div')
  viewport.classList.add('viewport')
  document.body.appendChild(viewport)
  return [1,1].map(()=>viewport.appendChild(createElement('div')))
}

function initMenu(viewports,img){
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
  select.addEventListener('change',onSelectChange.bind(null,viewports,img))
  document.body.appendChild(div)
  select.addEventListener('mousedown',e=>e.stopPropagation())
}

function initEvents(viewports,img){
  const boundCalculateSize = calculateSize.bind(null, img, viewports)
  window.addEventListener('resize', boundCalculateSize)
  boundCalculateSize()
  //
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
  //
  console.log('initialised') // todo: remove log
}

//////////////////////////////////////////////////////////////

function onSelectChange(viewports,img,e){
  const {target:{value}} = e
  Object.assign(global,globalDefault)
  loadImageToViewport(value,viewports,img)
}

function calculateSize(img, viewports){
  const {naturalWidth, naturalHeight} = img
  const arImg = (naturalWidth/2)/naturalHeight
  //
  const {documentElement: {clientWidth, clientHeight}} = document
  const arViewport = (clientWidth/2)/clientHeight
  //
  const hor = arImg<arViewport
  const scale =
      (hor?clientWidth/2:clientHeight)
      /(hor?naturalWidth/2:naturalHeight)
  global.scale = scale
  //
  const viewport = viewports[0].parentNode
  setScale(viewport,img,scale)
}

//

async function loadImageToViewport(file,viewports,_img){
  const img = await loadImage(`/img/${file}`,_img)
  imageToViewport(img, viewports)
  return img
}

function loadImage(uri,img){
	return new Promise((resolve, reject)=>{
    img = img||document.createElement('img')
    img.addEventListener('load', e=>resolve(e.target))
    img.src = uri
  })
}

function imageToViewport(img, viewports){
  getHalfData(img).forEach((dataUri, index)=>{
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

//

function setPosition(target,x,y){
  target.style.backgroundPosition = `${min(x,0)}px ${min(y,0)}px`
}

function setScale(target,img,scale){
  const {naturalWidth, naturalHeight} = img
  target.style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`
}

