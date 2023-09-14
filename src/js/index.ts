import '../scss/style.scss'
import {createElement, drag, zoom} from './utils'
import {imageList} from './imageList'

console.info('stereozoom')

const {min, max} = Math

const root = document.querySelector('[data-stereozoom]')
const querySelector = selector => root.querySelector(selector)
const querySelectorAll = selector => Array.from(root.querySelectorAll(selector))

//

let viewport:HTMLElement
let viewports:HTMLElement[]
let viewportW:number
let viewportH:number
let viewportAR:number
let loaders:HTMLElement[]
let contexts:HTMLElement[]

let background

// let img
let imgX = 0
let imgY = 0
let imgW:number
let imgH:number
let imgAR:number
let imgScale = 1
let imgScaleMin = 0.1
const imgScaleMax = 3

const marginMax = 80

const className = {
  loaded: 'loaded'
}

//

init()

async function init(){
  // const isLocalhost = location.hostname==='localhost'
  initElements()
  initSelect()
  initRange()
  initEvents()

  const {hash} = location
  const filename = hash.substring(1)
  const image = imageList.find(img=>img.filename===filename)||imageList[Math.random()*imageList.length<<0]
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await loadImageToViewport(image.secure_url)

  console.info('initialised')
}

function initElements(){
  viewport = querySelector('.viewport')
  viewports = querySelectorAll('.viewport>div')
  loaders = querySelectorAll('.loader')
  contexts = querySelectorAll('.context')
  background = querySelector('.background')
}

function initSelect(){
  const select = querySelector('select')
  imageList.forEach(({filename, secure_url, context:{caption}={}})=>{
    createElement('option', select, {value:secure_url, textContent:caption||filename})
  })
  select.addEventListener('change', onSelectChange)
  select.addEventListener('mousedown', e=>e.stopPropagation())
}

function initRange(){
  const range = querySelector('input[type=range]')
  //
  const rangeRule = Array.from(document.styleSheets).map(sheet=>{
    try {
      // return Array.from(sheet.cssRules).find(rule=>rule.selectorText==='.viewport, .menu')
      return Array.from(sheet.cssRules).find(rule=>rule['selectorText']==='.viewport, .menu')
    } catch(err) {
      return null
    }
  }).find(n=>n)
  console.log('rangeRule',rangeRule) // todo: remove log
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
  range.addEventListener('mousedown', e=>e.stopPropagation())
  range.addEventListener('input', (e)=>{
    const value = Math.min(e.target.valueAsNumber, marginMax)
    if (value===marginMax) {
      e.target.value = marginMax
    }
    setWidthMargin(style, value)
    onWindowResize()
    localStorage.setItem(lsMarginName, value as string)
  })
}

function initEvents(){
  window.addEventListener('resize', onWindowResize)
  onWindowResize()
  //
  drag((x, y)=>{
    setPosition(clampX(imgX+x), clampY(imgY+y))
  }).end((x, y)=>{
    setPosition(imgX = clampX(imgX+x), imgY = clampY(imgY+y))
  })
  zoom((scale, x, y)=>{
    const {offsetX, offsetY} = getScaleOffset(scale, x, y)
    setPosition(clampX(imgX-offsetX), clampY(imgY-offsetY))
    //
    setScale(clampScale(scale*imgScale))
  }).end((scale, x, y)=>{
    const {offsetX, offsetY} = getScaleOffset(scale, x, y)
    setPosition(imgX = clampX(imgX-offsetX), imgY = clampY(imgY-offsetY))
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
  resetImageScale()
}

//////////////////////////////////////////////////////////////

function setWidthMargin(style, margin){
  style.width = 100 - margin + '%'
  style.marginLeft = margin/2 + '%'
}

async function loadImageToViewport(file){
  clearMeta()
  /*await */preLoadImage(file)
  const img = await loadImage(file)
  const {naturalWidth, naturalHeight} = img
  imgW = naturalWidth/2
  imgH = naturalHeight
  imgAR = imgW/imgH
  imageToViewport(img)
  setMeta(file)
  background.style.backgroundImage = `url('${file}')`
  const image = imageList.find(img=>img.secure_url===file)
  image&&(location.hash = image.filename)
}

function preLoadImage(uri){
  loaders.forEach(loader=>{
    loader.style.width = '0'
    loader.classList.remove(className.loaded)
  })
	return new Promise((resolve, reject)=>{
    const request = new XMLHttpRequest()
    request.addEventListener('load', e=>{
      loaders.forEach(loader=>loader.classList.add(className.loaded))
      resolve(e.target)
    })
    request.addEventListener('progress', e=>{
      const {loaded, total} = e
      loaders.forEach(loader=>loader.style.width=loaded/total*100+'%')
    })
    request.addEventListener('error', reject)
    request.open('GET', uri, true)
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.overrideMimeType('text/plain; charset=x-user-defined')
    request.send()
  })
}

function loadImage(uri){
	return new Promise((resolve, reject)=>{
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', e=>resolve(e.target))
    img.addEventListener('error', reject)
    img.src = uri
  })
}

function imageToViewport(img){
  getHalfData(img).forEach((dataUri, index)=>{
    Object.assign(viewports[index].style, {
      backgroundImage: `url(${dataUri})`
    })
  })
  resetImageScale()
}

function getHalfData(img) {
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
  setPosition(imgX, imgY)
  setScale(scale)
}

//////////////////////////////////////////////////////////////

function clearMeta(){
  Array.from(contexts).forEach(elm=>{
    while (elm.lastElementChild) elm.lastElementChild.remove()
  })
}
function setMeta(file){
	const image = imageList.find(img=>img.secure_url===file)
  const [c1, c2] = contexts
  const {context: {caption, ...context} = {}} = image
  if (caption) {
    const h3 = createElement('h3', c1, {textContent:caption})
    c2.appendChild(h3.cloneNode(true))
  }
  if (context) {
    const dl = createElement('dl')
    Object.entries(context).forEach(([key, value])=>{
      createElement('dt', dl, {textContent: key})
      createElement('dd', dl, {textContent: value})
    })
    if (dl.children.length) {
      c1.appendChild(dl)
      c2.appendChild(dl.cloneNode(true))
    }
  }

}

function getScaleOffset(scale, x, y){
  x = x%viewportW
  const relScale = scale-1
  const relX = x - imgX
  const relY = y - imgY
  const offsetX = relScale*relX
  const offsetY = relScale*relY
  return {offsetX, offsetY}
}

function clampScale(scale){
	return min(max(scale, imgScaleMin), imgScaleMax)
}

function clampX(x){
	return min(max(x, viewportW-imgScale*imgW), 0)
}

function clampY(y){
	return min(max(y, viewportH-imgScale*imgH), 0)
}

//////////////////////////////////////////////////////////////

function setPosition(x, y){
  viewport.style.backgroundPosition = `${x}px ${y}px`
}

function setScale(scale){
  viewport.style.backgroundSize = `${scale*imgW}px ${scale*imgH}px`
}
