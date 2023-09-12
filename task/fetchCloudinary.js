const {promises:{writeFile}} = require('fs')

require('dotenv').config()
const {CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET} = process.env

const cloudinary = require('cloudinary')

console.info('Retreiving Cloudinary data')

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
  secure: true
})

;(async function(){
  try {

    const {rate_limit_allowed, rate_limit_remaining, rate_limit_reset_at} = await cloudinary.v2.api.resources()
    console.info('Usage limits')
    console.info('\trate_limit_allowed:', rate_limit_allowed)
    console.info('\trate_limit_remaining:', rate_limit_remaining)
    console.info('\trate_limit_reset_at:', new Date(rate_limit_reset_at).toLocaleString('nl'))

    const result = await cloudinary.v2.search
        .expression('resource_type:image AND folder=stereozoom')
        .with_field('context','tags')
        // .sort_by('public_id','desc')
        // .max_results(2)
        .execute()

    const {resources, resources: {length}} = result
    // const list = resources.map(n=>n.secure_url)
    // console.log('crinoide3',resources.find(n=>n.filename==='crinoide3'))
    // writeFile('src/js/imageList1.js', `export const imageList = ${JSON.stringify(list)}`)

    ///

    const newlist = resources.map(({filename,url,secure_url,context})=>({filename,url,secure_url,context}))
    writeFile('src/js/imageList.ts', `
export interface IImage {
  filename: string
  url: string
  secure_url: string
  context: {
    caption: string
    [key: string]: string
  }
}

export const imageList = ${JSON.stringify(newlist)} as IImage[]`)

    console.info(`Written ${length} images to imageList`)

  } catch (err) {
    console.error(err)
  }
})()
