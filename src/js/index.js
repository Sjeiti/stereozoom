import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

const {min,max} = Math

const createElement = document.createElement.bind(document)

//

let viewport
let viewports
let viewportW
let viewportH
let viewportAR

let img
let imgX = 0
let imgY = 0
let imgW
let imgH
let imgAR
let imgScale = 1
let imgScaleMin = 0.1
let imgScaleMax = 2

//

init()

async function init(){
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()
  initViewports()
  initMenu()
  initEvents()
  await loadImageToViewport(imageList[Math.random()*imageList.length<<0])
  console.log('initialised') // todo: remove log
}

function initViewports(){
  viewport = createElement('div')
  viewport.classList.add('viewport')
  document.body.appendChild(viewport)
  viewports = [1,1].map(()=>viewport.appendChild(createElement('div')))
}

function initMenu(){
  const div = createElement('div')
  div.classList.add('menu')
  const select = createElement('select')
  div.appendChild(select)
  imageList.forEach(imgName=>{
    const [name] = imgName.replace(/-/g,' ').split(/_/g)
    const option = createElement('option')
    option.value = imgName
    option.textContent = name
    select.appendChild(option)
  })
  select.addEventListener('change',onSelectChange)
  document.body.appendChild(div)
  select.addEventListener('mousedown',e=>e.stopPropagation())
}

function initEvents(){
  window.addEventListener('resize', onWindowResize)
  onWindowResize()
  //
  drag((x,y)=>{
    setPosition(clampX(imgX+x),clampY(imgY+y))
  }).end((x,y)=>{
    setPosition(imgX = clampX(imgX+x),imgY = clampY(imgY+y))
  })
  zoom((scale,x,y)=>{
    const {offsetX,offsetY} = getScaleOffset(scale,x,y)
    setPosition(clampX(imgX-offsetX),clampY(imgY-offsetY))
    //
    setScale(clampScale(scale*imgScale))
  }).end((scale,x,y)=>{
    const {offsetX,offsetY} = getScaleOffset(scale,x,y)
    setPosition(imgX = clampX(imgX-offsetX),imgY = clampY(imgY-offsetY))
    //
    setScale(imgScale = clampScale(scale*imgScale))
  })
}

//////////////////////////////////////////////////////////////

function onSelectChange(e){
  loadImageToViewport(e.target.value)
}

function onWindowResize(){
  const {documentElement: {clientWidth, clientHeight}} = document
  viewportW = clientWidth/2
  viewportH = clientHeight
  viewportAR = viewportW/viewportH
}

//////////////////////////////////////////////////////////////

async function loadImageToViewport(file){
  await loadImage(`/img/${file}`)
  const {naturalWidth, naturalHeight} = img
  imgW = naturalWidth/2
  imgH = naturalHeight
  imgAR = imgW/imgH
  imageToViewport()
}

function loadImage(uri){
	return new Promise((resolve, reject)=>{
    img = document.createElement('img')
    img.addEventListener('load', e=>resolve(e.target))
    img.src = uri
  })
}

function imageToViewport(){
  getHalfData().forEach((dataUri, index)=>{
    Object.assign(viewports[index].style, {
      backgroundImage: `url(${dataUri})`
    })
  })
  resetImageScale()
}

function getHalfData() {
  const canvas = document.createElement('canvas')
  canvas.width = imgW
  canvas.height = imgH
  const context = canvas.getContext('2d')
  context.drawImage(img, 0, 0)
  const first = canvas.toDataURL()
  context.drawImage(img, -imgW, 0)
  const second = canvas.toDataURL()
  return [first, second]
}

function resetImageScale(){
  const hor = imgAR<viewportAR
  const scale =
      (hor?viewportW:viewportH)
      /(hor?imgW:imgH)
  imgScaleMin = imgScale = scale
  //
  imgX = 0
  imgY = 0
  setPosition(imgX,imgY)
  setScale(scale)
}

//////////////////////////////////////////////////////////////

function getScaleOffset(scale,x,y){
  x = x%viewportW
  const relScale = scale-1
  const relX = x - imgX
  const relY = y - imgY
  const offsetX = relScale*relX
  const offsetY = relScale*relY
  return {offsetX,offsetY}
}

function clampScale(scale){
	return min(max(scale,imgScaleMin),imgScaleMax)
}

function clampX(x){
	return min(max(x,viewportW-imgScale*imgW),0)
}

function clampY(y){
	return min(max(y,viewportH-imgScale*imgH),0)
}

//////////////////////////////////////////////////////////////

function setPosition(x,y){
  viewport.style.backgroundPosition = `${x}px ${y}px`
}

function setScale(scale){
  viewport.style.backgroundSize = `${scale*imgW}px ${scale*imgH}px`
}

