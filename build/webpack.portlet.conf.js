'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports =  {
  mode: 'production',
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/portlet/main.js'
  },
  externals: {
    d3: 'd3',
    echarts: 'echarts',
    SunflowerConfig: 'SunflowerConfig',
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    three: 'THREE'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      parallel: 4
    })],
  },
  output: {
    path: path.resolve(__dirname, "../static/portlet"),
    filename: "main.js",
    chunkFilename: "[name].js",
    library: "Assets",
    libraryTarget: "umd",
    publicPath: 'static/portlet/',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(path.join(resolve('static/js/dll'), 'vueLibs-manifest.json'))
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(path.join(resolve('static/js/dll'), 'commonLibs-manifest.json'))
    })
  ]
};
