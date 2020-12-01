'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackCleanPlugin = require('webpack-clean');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '../'),
  entry: {
    'sicap-dark': './src/styles/dark.js',
    'sicap-chalk': './src/styles/chalk.js',
    'sicap-tea': './src/styles/tea.js',
    'sicap-fanta': './src/styles/fanta.js'
  },
  externals: {
    d3: 'd3',
    echarts: 'echarts',
    SunflowerConfig: 'SunflowerConfig'
  },
  output: {
    path: path.resolve(__dirname, "../static/style"),
    filename: "[name].js",
    chunkFilename: "[name].js",
    library: "styl",
    libraryTarget: "umd"
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
      {
        test: /dark-theme[\s\S]*\.(styl|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "stylus-loader"
        ]
      },
      {
        test: /chalk-theme[\s\S]*\.(styl|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "stylus-loader"
        ]
      },
      {
        test: /tea-theme[\s\S]*\.(styl|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "stylus-loader"
        ]
      },
      {
        test: /fanta-theme[\s\S]*\.(styl|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "stylus-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('../img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new WebpackCleanPlugin([
      '../static/style/sicap-chalk.js',
      '../static/style/sicap-dark.js',
      '../static/style/sicap-fanta.js',
      '../static/style/sicap-tea.js'
    ])
  ]
};
