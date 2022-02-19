const add = document.addEventListener.bind(document)
const rem = document.removeEventListener.bind(document)

const touchstart = 'touchstart'
const touchmove = 'touchmove'
const touchend = 'touchend'
const wheel = 'wheel'
const mousedown = 'mousedown'
const mousemove = 'mousemove'
const mouseup = 'mouseup'

const dragCallbacks = []
const dragEndCallbacks = []
const zoomCallbacks = []
const zoomEndCallbacks = []

const args = {drag: [0,0], zoom: 1}

export const dragEnd = cb=>dragEndCallbacks.push(cb)
export const drag = cb=>(dragCallbacks.push(cb),{end:dragEnd})
export const zoomEnd = cb=>zoomEndCallbacks.push(cb)
export const zoom = cb=>(zoomCallbacks.push(cb),{end:zoomEnd})

const start = []

add(touchstart,e=>{
  const {touches} = e
  storeTouchPositions(start,touches)
  if (touches.length===1){
    add(touchmove,handleTouchMove)
    add(touchend,handleTouchEnd)
  }
})

add(mousedown,e=>{
  const {clientX,clientY} = e
  storeTouchPositions(start,[{clientX,clientY}])
  add(mousemove,handleMouseMove)
  add(mouseup,handleMouseEnd)
})

add(wheel,e=>{
  const {clientX, clientY, deltaY} = e
  const zoom = 1-(deltaY/1E4)
  zoomEndCallbacks.forEach(fn=>fn(zoom,clientX,clientY))
})

function handleTouchMove(e){
  const {touches, touches: {length}} = e
  const touchPoints = Array.from(touches).map(({clientX:x,clientY:y})=>({x,y}))
  const diff = length<=start.length&&touchPoints.map(({x,y},i)=>{
      const s = start[i]
      return {
        x: x-s.x
        ,y: y-s.y
      }
    })
  if (length===1) {
    const [{x,y}] = diff
    callDrag(x,y)
  } else if (length===2) {
    // const [{x:x1,y:y1},{x:x2,y:y2}] = diff
    // const xs = (x1 + x2)/2
    // const ys = (y1 + y2)/2
    // callDrag(xs,ys)
    const [p1,p2] = touchPoints
    const x = (p1.x+p2.x)/2
    const y = (p1.y+p2.y)/2
    const startD = getDistance(...start)
    const touchD = getDistance(...touchPoints)
    callZoom(touchD/startD,x,y)
  }
}

function handleTouchEnd(e){
  if (e.touches.length===0){
    rem(touchmove,handleTouchMove)
    rem(touchend,handleTouchEnd)
    dragEndCallbacks.forEach(fn=>fn(...args.drag))
  } else if (e.touches.length===1){
    zoomEndCallbacks.forEach(fn=>fn(...args.zoom))
  }
}

function handleMouseMove(e){
  const [{x,y}] = start
  const {clientX,clientY} = e
  callDrag(clientX-x,clientY-y)
}

function handleMouseEnd(){
  rem(mousemove,handleMouseMove)
  rem(mouseup,handleMouseEnd)
  dragEndCallbacks.forEach(fn=>fn(...args.drag))
}

function callDrag(x,y){
  args.drag = [x,y]
  dragCallbacks.forEach(fn=>fn(x,y))
}

function callZoom(d,x,y){
  args.zoom = [d,x,y]
  zoomCallbacks.forEach(fn=>fn(d,x,y))
}

function storeTouchPositions(list,touches){
  list.splice(0, 10, ...Array.from(touches).map(({clientX:x,clientY:y})=>({x,y})))
}

function getDistance(p1,p2){
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx*dx + dy*dy)
}
