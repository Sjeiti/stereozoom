import {overwriteLog} from './utils/overwriteLog'

(()=>{
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()
  console.log('init',23) // todo: remove log
})()
