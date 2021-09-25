const webpack = require('webpack');
const DefinePlugin = webpack.DefinePlugin;
const ProvidePlugin = webpack.ProvidePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CssChunkHashPlugin = require('css-chunks-html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const HtmlElementsPlugin = require('./html-elements-plugin');
const helpers = require('./helpers');

const METADATA = {
  title: 'Challenge Tracker',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

const definePlugins = new DefinePlugin({
  TEST: process.env.NODE_ENV === 'test',
  UAT: process.env.NODE_ENV === 'uat',
  SIT: process.env.NODE_ENV === 'sit',
  PROD: process.env.NODE_ENV === 'production',
  DEV: process.env.NODE_ENV === 'development'
});

// Define plugins for webpack
const providePlugins = new ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery', 'windows.jQuery': 'jquery' });
const progressBar = new ProgressBarPlugin();

/*
* Plugin: HtmlWebpackPlugin
* Description: Simplifies creation of HTML files to serve your webpack bundles.
* This is especially useful for webpack bundles that include a hash in the filename
* which changes every compilation.
*
* See: https://github.com/ampedandwired/html-webpack-plugin
*/
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: helpers.root('src/index.html'),
  title: METADATA.title,
  chunksSortMode: 'manual',
  chunks: ['bundle.common', 'bundle', 'react.bundle.1', 'react.bundle.2',
    'react.bootstrap.bundle', 'redux.bundle', 'app'],
  metadata: METADATA,
  hash: false,
  minify: {
    collapseWhitespace: true
  },
  inject: 'body'
});

/*
* Plugin: HtmlElementsPlugin
* Description: Generate html tags based on javascript maps.
*
* If a publicPath is set in the webpack output configuration, it will be automatically added to
* href attributes, you can disable that by adding a "=href": false property.
* You can also enable it to other attribute by settings "=attName": true.
*
* The configuration supplied is map between a location (key) and an element definition object (value)
* The location (key) is then exported to the template under then htmlElements property in webpack configuration.
*
* Example:
*  Adding this plugin configuration
*  new HtmlElementsPlugin({
*    headTags: { ... }
*  })
*
*  Means we can use it in the template like this:
*  <%= webpackConfig.htmlElements.headTags %>
*
* Dependencies: HtmlWebpackPlugin
*/
const htmlElementsPlugin = new HtmlElementsPlugin({
  headTags: require('./head-config.common')
});

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
const config = {
  entry: {
    app: helpers.root('src/index.js')
  },
  output: {
    path: helpers.root('src'),
    filename: '[name].js?[hash]'
  },
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }, {
        test: /\.s?css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                modules: true,
                localIdentName: '[local]'
              }
            }
          ]
        })
      }, {
        test: /\.(jpe?g|png|gif|ico)$/,
        exclude: /(node_modules)/,
        loader: 'url-loader?limit=500&name=assets/ex-images/[name].[ext]'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=500&minetype=application/font-woff&name=assets/fonts/[name].[ext]'
      }, {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=500&name=assets/fonts/[name].[ext]'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        // This loader will @import your SASS resources into every required SASS module
        // So you can use your shared variables & mixins across
        // all SASS styles without manually importing them in each file
        test: /\.scss$/,
        use: [
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/theme/sass/mixins.scss']
            }
          }
        ]
      }
    ]
  },
  stats: {
    children: false
  },
  resolve: {
    modules: [helpers.root('src'), 'node_modules'],
    extensions: ['.js', '.css', '.scss', '.json']
  },
  plugins: [
    definePlugins,
    providePlugins,
    new CssChunkHashPlugin({ inject: true }),
    htmlWebpackPlugin,
    htmlElementsPlugin,
    progressBar,
    new ExtractCssChunks(),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'sync'
    }),
    new PreloadWebpackPlugin({
      rel: 'stylesheet',
      include: 'asyncChunks',
      fileBlacklist: [/\.map|.js/]
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  /**
   * Webpack Development Server configuration
   * Description: The webpack-dev-server is a little node.js Express server.
   * The server emits information about the compilation state to the client,
   * which reacts to those events.
   *
   * See: https://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    port: 4040,
    host: 'localhost',
    hot: true,
    progress: false,
    historyApiFallback: true,
    contentBase: helpers.root('src'),
    watchContentBase: false,
    stats: 'errors-only',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  }
};

module.exports = config;
