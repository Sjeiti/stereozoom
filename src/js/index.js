import {overwriteLog} from './utils/overwriteLog'

import '../scss/style.scss'

(()=>{
  const isLocalhost = location.hostname==='localhost'
  isLocalhost && overwriteLog()
  console.log('init',23) // todo: remove log
})()
