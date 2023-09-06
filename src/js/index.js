// import {overwriteLog} from './utils/overwriteLog'
import {drag, zoom} from './utils/drag'

import '../scss/style.scss'

import {imageList} from './imageList2'

const {min,max} = Math

const createElement = document.createElement.bind(document)

//
let viewport
let viewports
let viewportW
let viewportH
let viewportAR

let background

let img
let imgX = 0
let imgY = 0
let imgW
let imgH
let imgAR
let imgScale = 1
let imgScaleMin = 0.1
let imgScaleMax = 3

const marginMax = 80

//

init()

async function init(){
  const isLocalhost = location.hostname==='localhost'
  //isLocalhost && overwriteLog()
  initViewports()
  initBackground()
  //initTitle()
  initMenu()
  initRange()
  initEvents()
  await loadImageToViewport(imageList[Math.random()*imageList.length<<0].secure_url)
  console.log('initialised') // todo: remove log
}

function initViewports(){
  viewport = createElement('div')
  viewport.classList.add('viewport')
  document.body.appendChild(viewport)
  viewports = [1,1].map(()=>viewport.appendChild(createElement('div')))
}

/*function initTitle(){
  viewports.forEach(v=>{
    const h1 = createElement('h1')
    h1.textContent = 'stereozoom'
    v.appendChild(h1)
  })
}*/

function initBackground(){
  background = createElement('div')
  background.classList.add('background')
  document.body.appendChild(background)
}

function initMenu(){
  const div = createElement('div')
  div.classList.add('menu')

  const h1 = createElement('h1')
  h1.textContent = h1.dataset.text = 'stereozoom'
  div.appendChild(h1)

  const select = createElement('select')
  div.appendChild(select)
  imageList.forEach(({filename, url, secure_url, context})=>{
    const option = createElement('option')
    option.value = secure_url
    option.textContent = filename
    select.appendChild(option)
  })
  select.addEventListener('change',onSelectChange)
  document.body.appendChild(div)
  select.addEventListener('mousedown',e=>e.stopPropagation())
}

function initRange(){
  const range = createElement('input')
  range.setAttribute('type', 'range')
  range.classList.add('range')
  document.body.appendChild(range)
  //
  const rangeRule = Array.from(document.styleSheets).map(sheet=>{
    try {
      return Array.from(sheet.cssRules).find(rule=>rule.selectorText==='.viewport, .menu')
    } catch(err) {}
  }).find(n=>n)
  const {style} = rangeRule
  //
  const lsMarginName = 'margin'
  const lsMargin = localStorage.getItem(lsMarginName)
  if (lsMargin!==null) {
    setWidthMargin(style, parseFloat(lsMargin))
    onWindowResize()
  }
  range.value = 100-parseFloat(style.width)
  //
  range.addEventListener('input',(e)=>{
    const value = Math.min(e.target.valueAsNumber,marginMax)
    if (value===marginMax) {
      e.target.value = marginMax
    }
    setWidthMargin(style, value)
    onWindowResize()
    localStorage.setItem(lsMarginName, value)
  })
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
  // const vieportWOld = viewportW
  const {clientWidth, clientHeight} = viewport
  viewportW = clientWidth/2
  viewportH = clientHeight
  viewportAR = viewportW/viewportH
  // const viewportWDiff = vieportWOld - viewportW
  // imgX = imgX - viewportWDiff/2
  // setPosition(imgX,imgY)
}

//////////////////////////////////////////////////////////////

function setWidthMargin(style, margin){
  style.width = 100 - margin + '%'
  style.marginLeft = margin/2 + '%'
}

async function loadImageToViewport(file){
  // const prefix = 'https://res.cloudinary.com/dn1rmdjs5/image/upload/v1693595005/stereozoom/'
  // // const prefix = '/img/'
  // await loadImage(prefix+file)
  await loadImage(file)
  const {naturalWidth, naturalHeight} = img
  imgW = naturalWidth/2
  imgH = naturalHeight
  imgAR = imgW/imgH
  imageToViewport()
  //
  background.style.backgroundImage = `url('${file}')`
}

function loadImage(uri){
	return new Promise((resolve, reject)=>{
    img = document.createElement('img')
    img.crossOrigin = 'anonymous'
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

