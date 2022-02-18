const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const dist = 'dist'

const p = path.resolve.bind(path)

module.exports = env => {

  const isProduction = !!env&&env.production
  const mode = isProduction?'production':'development'

  const targetFileName = 'index.js'
  const targetDir = p(__dirname, dist)

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
      port: 9202
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
          ,use: ['style-loader', 'css-loader', 'sass-loader']
        }
        // ,{
        //   test: /\.(eot|woff|woff2|ttf|png|jp(e*)g|svg)$/
        //   ,use: [{
        //       loader: 'url-loader'
        //       ,options: {
        //           limit: 8000 // Convert images < 8kb to base64 strings
        //           ,name: `img/[name]-[hash].[ext]`
        //       }
        //   }]
        // }
      ]
    }
    ,plugins: [
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
      })
      ,new webpack.ProvidePlugin({
         process: 'process/browser'
      })
      ,new CopyPlugin({
        patterns: [
          { from: p(__dirname, 'static'), to: p(__dirname, dist) }
        ]
      })
      // ,{
      //   apply: (compiler) => {
      //     console.log('compiler.hooks',Object.keys(compiler.hooks)) // todo: remove log
      //     compiler.hooks.compile.tap("MyPlugin_compile", (a) => {
      //       console.log("This code is executed before the compilation begins.")
      //       console.log('a.normalModuleFactory.hooks',Object.keys(a.normalModuleFactory.hooks)) // todo: remove log
      //       // compilation.buildModule.tap("MyPalugin_compile", () => {
      //       //     console.log("___buildModule");
      //       // });
      //       // a.normalModuleFactory.hooks.resolve.tap("MyPlugin_compile", ()=>console.log('foo'))
      //       // a.normalModuleFactory.hooks.resolve.tap("MyPlugin_compile", console.log.bind(null,'foo'))
      //     });
      //   },
      // }
    ]
  }
}
