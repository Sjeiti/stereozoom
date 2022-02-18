const add = document.addEventListener.bind(document)
const rem = document.removeEventListener.bind(document)

const dragCallbacks = []
const zoomCallbacks = []

const start = []
const last = []

add('touchstart',e=>{
  const {touches,touches:{length},touches:[{clientX,clientY}]} = e
  storeTouchPositions(start,touches)
  storeTouchPositions(last,touches)
  if (e.touches.length===1){
    add('touchmove',handleTouchMove)
    add('touchend',handleTouchEnd)
  }
  console.log('touchstart',JSON.stringify(start))
})

function handleTouchEnd(e){
  //console.log('touchstart',e.touches.length)
  if (e.touches.length===0){
    rem('touchmove',handleTouchMove)
    rem('touchend',handleTouchEnd)
  }
}

function handleTouchMove(e){
  const touches = Array.from(e.touches)
  const {length} = touches
  const diff = length<=start.length&&touches.map(
    ({clientX,clientY},i)=>{
      const s = start[i]
      return {
        x: clientX-s.x
        ,y: clientY-s.y
      }
    }
  )
  //console.log(JSON.stringify(diff))
  console.log(JSON.stringify(touches))
  if (length===1) {
    const [{x:x1,y:y1}] = diff
    dragCallbacks.forEach(fn=>fn(x1,y1))
  } else if (length===2) {
    const [{x:x1,y:y1},{x:x2,y:y2}] = diff
    const xs = (x1 + x2)/2
    const ys = (y1 + y2)/2
    dragCallbacks.forEach(fn=>fn(xs,ys))
    //
    const startD = getDistance(...start)
    const touchD = getDistance(...touches)
    const d = touchD/startD
    console.log(startD,touchD,d)
    zoomCallbacks.forEach(fn=>fn(d))
  } else if (length===22) {
    const [{x:lx,y:ly}] = last
    const [{x:sx,y:sy}] = start
    const xl = x - lx
    const yl = y - ly
    const xs = x - sx
    const ys = y - sy
    zoomCallbacks.forEach(fn=>fn(x,y,xl,yl,xs,ys)) 
  }
  
  storeTouchPositions(last,touches)
}

function storeTouchPositions(list,touches){
  //console.log(JSON.stringify(Array.from(touches).map(({clientX,clientY})=>({clientX,clientY}))))
  list.splice(0, 10, ...Array.from(touches).map(({clientX:x,clientY:y})=>({x,y})))
}

function getDistance(p1,p2){
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx*dx + dy*dy)
}

export const drag = cb=>dragCallbacks.push(cb)
export const zoom = cb=>zoomCallbacks.push(cb)
