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

  const [firstImage] = imageList
  await loadImageToViewport(firstImage)
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
  drag((dx,dy)=>{
    setPosition(imgX+dx,imgY+dy)
  }).end((dx,dy)=>{
    imgX += dx
    imgY += dy
    setPosition(imgX,imgY)
  })
  zoom((scale)=>{
    const realScale = scale*imgScale
    setScale(realScale)
  }).end((scale)=>{
    const realScale = scale*imgScale
    setScale(realScale)
    imgScale = realScale
  })
  //
  console.log('initialised') // todo: remove log
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
  setScale(scale)
}

//////////////////////////////////////////////////////////////

function setPosition(x,y){
  viewport.style.backgroundPosition = `${min(x,0)}px ${min(y,0)}px`
}

function setScale(scale){
  const {naturalWidth, naturalHeight} = img
  viewport.style.backgroundSize = `${scale*naturalWidth/2}px ${scale*naturalHeight}px`
}

