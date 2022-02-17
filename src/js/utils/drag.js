const add = document.addEventListener.bind(document)
const rem = document.removeEventListener.bind(document)

const dragCallbacks = []

const start = []
const last = []

add('touchstart',e=>{
  const {touches,touches:{length},touches:[{clientX,clientY}]} = e
  console.log('touchstart',clientX,length)
  if (e.touches.length===1){
    storeTouchPositions(start,touches)
    storeTouchPositions(last,touches)
    add('touchmove',handleTouchMove)
    add('touchend',handleTouchEnd)
  }
})

function handleTouchEnd(e){
  //console.log('touchstart',e.touches.length)
  if (e.touches.length===0){
    rem('touchmove',handleTouchMove)
    rem('touchend',handleTouchEnd)
  }
}

function handleTouchMove(e){
  const {touches,touches:{length},touches:[{clientX:x,clientY:y}]} = e

  if (length===1) {
    const [{x:lx,y:ly}] = last
    const [{x:sx,y:sy}] = start
    const xl = x - lx
    const yl = y - ly
    const xs = x - sx
    const ys = y - sy
    dragCallbacks.forEach(fn=>fn(
      x,y 
      ,xl,yl
      ,xs,ys
    ))
    Object.assign(last,{clientX,clientY})
  } else if (length===2) {
    
  }
  
  storeTouchPositions(last,touches)
}

function storeTouchPositions(list,touches){
  //console.log(JSON.stringify(Array.from(touches).map(({clientX,clientY})=>({clientX,clientY}))))
  list.splice(0, 10, ...Array.from(touches).map(({clientX:x,clientY:y})=>({x,y})))
}

export const drag = cb=>dragCallbacks.push(cb)
