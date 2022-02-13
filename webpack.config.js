const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const dist = 'dist'
const src = 'src'
const index = 'index.html'

module.exports = env => {

  const isProduction = !!env&&env.production
  const mode = isProduction?'production':'development'

  const targetFileName = 'index.js'
  const targetDir = path.resolve(__dirname, dist)

  return {
    mode
    ,entry: './src/js/index.js'
    ,output: {
      filename: targetFileName
      ,path: targetDir
    }
    ,devServer: {
      static: {
        directory: targetDir
      }
      ,compress: true,
      port: 9000
    }
    ,devtool: 'source-map'
    ,module: {
      rules: [
        {
          test: /\.js$/
          ,exclude: /node_modules/
          ,use: {
            loader: 'babel-loader'
            ,options: { babelrc: true }
          }
        }
        ,{
          test: /\.scss$/
          ,use: ["style-loader", "css-loader", "sass-loader"]
        }
        ,{
          test: /\.(eot|woff|woff2|ttf|png|jp(e*)g|svg)$/
          ,use: [{
              loader: 'url-loader'
              ,options: {
                  limit: 8000 // Convert images < 8kb to base64 strings
                  ,name: `img/[name]-[hash].[ext]`
              }
          }]
        }
      ]
    }
    ,plugins: [
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
      })
      ,new webpack.ProvidePlugin({
         process: 'process/browser',
      })
      ,new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, src, index), to: path.resolve(__dirname, dist, index) }
          ,{ from: path.resolve(__dirname, 'static'), to: 'static' }
        ],
      })
    ]
  }
}
