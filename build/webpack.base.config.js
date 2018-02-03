const config = require('../app.config');
const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC = path.resolve(__dirname, '../src');
const DIST = path.resolve(__dirname, '../dist');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  entry: ['babel-polyfill', path.resolve(SRC, 'main.js')],
  output: {
    filename: 'bundle.js',
    path: DIST,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: SRC,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          sourceMap: true,
        }
      },
      {
        test: /\.js$/,
        include: SRC,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          sourceMap: true,
        }
      },
      {
        test: /\.css$/,
        include: SRC,
        use: PROD
          ? ExtractTextPlugin.extract(['vue-style-loader', 'css-loader'])
          : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: SRC,
        use: PROD
          ? ExtractTextPlugin.extract([
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ])
          : ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        include: SRC,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    // Remove dist folder before building.
    new CleanWebpackPlugin(DIST),
    // Create HTML files to serve webpack bundle.
    new HtmlWebpackPlugin({
      filename: path.resolve(DIST, 'index.html'),
      template: `!!handlebars-loader!${SRC}/index.hbs`, // Path to template.
      hash: true, // Append a unique compilation hash to all included scripts and CSS files.
      title: config.title,
      description: config.description
    }),
    // Generate favicons and icons for iOS, Android and desktop browsers.
    new FaviconsWebpackPlugin({
      prefix: 'favicons-[hash]/', // Favicons folder name.
      logo: './logo.png', // The image to use to generate favicons.
      inject: true // Inject favicons into HTML generated by HTMLWebpackPlugin.
    }),
    // Extract text from bundle into a file.
    new ExtractTextPlugin('style.css')
  ],
  performance: {
    hints: false
  }
};
