const {promises:{readdir, writeFile}} = require('fs')
const testFolder = './static/img/'

readdir(testFolder)
  .then(files => {
    console.log('files',files)
    writeFile('src/js/imageList.js', `export const imageList = ${JSON.stringify(files)}`)
  })
