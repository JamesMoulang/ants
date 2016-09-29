var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer')
var precss = require('precss')
var cssnano = require('cssnano')
var nested = require('postcss-nested')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // necessary for hot reloading with IE:
    'eventsource-polyfill',
    // listen to code updates emitted by hot middleware:
    'webpack-hot-middleware/client',
    // your code:
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  postcss: function () {
      return [precss, nested, autoprefixer]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'app')
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: [path.join(__dirname, 'app')]
      }
    ]
  }
};