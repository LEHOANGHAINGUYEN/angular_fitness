const webpack = require('webpack');
const optimize = webpack.optimize;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Common config
let config = require('./webpack.config.js');

delete config.devtool;
delete config.devServer;
config.output.path = helpers.root('dist');
// Resolve production plugin
Array.prototype.push.apply(config.plugins, [
  new optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      drop_console: false,
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
      negate_iife: false
    },
    mangle: {
      except: [
        'exports',
        'require'
      ]
    }
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.NoEmitOnErrorsPlugin(),
  new CopyWebpackPlugin(
    [{
      from: 'src/index.html'
    }, {
      from: 'src/theme/images',
      to: 'assets/images'
    }], {
      // Doesn't copy any files with a txt extension
      ignore: ['*.txt'],
      copyUnmodified: true
    }),
  new optimize.CommonsChunkPlugin({
    name: ['bundle'],
    chunks: ['app'],
    minChunks: function (module) {
      return helpers.isExternal(module);
    }
  }),
  new optimize.CommonsChunkPlugin({
    name: ['bundle.common'],
    chunks: ['bundle'],
    minChunks: function (module) {
      let targets = ['jquery', 'immutable', 'prop-types', 'fusioncharts',
        'moment', 'axios', 'eonasdan-bootstrap-datetimepicker',
        'daterangepicker', 'babel-polyfill', 'lodash', 'babel-runtime'];
      return helpers.checkChunk(module, targets);
    }
  }),
  new optimize.CommonsChunkPlugin({
    name: ['react.bundle.1'],
    chunks: ['bundle'],
    minChunks: function (module) {
      let targets = ['react', 'react-intl', 'react-overlays',
        'react-s-alert', 'react-highlight-words'];
      return helpers.checkChunk(module, targets);
    }
  }),
  new optimize.CommonsChunkPlugin({
    name: ['react.bundle.2'],
    chunks: ['bundle'],
    minChunks: function (module) {
      let targets = ['react-dom', 'react-router-redux', 'react-router',
        'react-fusioncharts', 'react-select'];
      return helpers.checkChunk(module, targets);
    }
  }),
  new optimize.CommonsChunkPlugin({
    name: ['react.bootstrap.bundle'],
    chunks: ['bundle'],
    minChunks: function (module) {
      let targets = ['bootstrap', 'react-bootstrap', 'react-bootstrap-table'];
      return helpers.checkChunk(module, targets);
    }
  }),
  new optimize.CommonsChunkPlugin({
    name: ['redux.bundle'],
    chunks: ['bundle'],
    minChunks: function (module) {
      let targets = ['redux', 'redux-module-builder', 'redux-thunk', 'redux-logger',
        'redux-debounce', 'react-redux', 'redux-form'];
      return helpers.checkChunk(module, targets);
    }
  })
]);

module.exports = config;
