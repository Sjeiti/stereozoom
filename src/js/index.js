import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList'

const {min} = Math

const createElement = document.createElement.bind(document)

//

let viewport
let viewports

let img
let imgX = 0
let imgY = 0
let imgScale = 1

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
  // window.addEventListener('resize', onWindowResize)
  // onWindowResize()
  //
  drag((x,y)=>{
    setPosition(imgX+x,imgY+y)
  }).end((x,y)=>{
    setPosition(imgX += x,imgY += y)
  })
  zoom((scale,x,y)=>{
    const {offsetX,offsetY} = getScaleOffset(scale,x,y)
    setPosition(imgX-offsetX,imgY-offsetY)
    //
    setScale(scale*imgScale)
  }).end((scale,x,y)=>{
    const {offsetX,offsetY} = getScaleOffset(scale,x,y)
    setPosition(imgX-=offsetX,imgY-=offsetY)
    //
    setScale(imgScale = scale*imgScale)
  })
}

//////////////////////////////////////////////////////////////

function onSelectChange(e){
  loadImageToViewport(e.target.value)
}

/*
function onWindowResize(){
}
*/

//////////////////////////////////////////////////////////////

async function loadImageToViewport(file){
  await loadImage(`/img/${file}`)
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

function resetImageScale(){
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
  imgScale = scale
  //
  imgX = 0
  imgY = 0
  setPosition(imgX,imgY)
  setScale(scale)
}

//////////////////////////////////////////////////////////////

function getScaleOffset(scale,x,y){
  const {documentElement: {clientWidth}} = document
  x = x%(clientWidth/2)
  const relScale = scale-1
  const relX = x - imgX
  const relY = y - imgY
  const offsetX = relScale*relX
  const offsetY = relScale*relY
  return {offsetX,offsetY}
}

//////////////////////////////////////////////////////////////

function setPosition(x,y){
  const xx = min(x,0)
  const yy = min(y,0)
  viewport.style.backgroundPosition = `${x}px ${y}px`
}

function setScale(scale){
  const {naturalWidth, naturalHeight} = img
  viewport.style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`
}

