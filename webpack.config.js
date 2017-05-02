require('dotenv').config({ silent: true });

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  entry: path.join(__dirname, 'client', 'plugin', 'index.js'),
  devtool: isDevelopment ? 'eval-source-map' : '',
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: `plugin.js`
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /.scss$/,
        use: ExtractTextPlugin.extract([
          'css-loader', 
          'postcss-loader', 
          { 
            loader: 'sass-loader', 
            options: {
              includePaths: [path.resolve(__dirname, 'client', 'plugin')]
            }  
          }
        ])
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'client', 'plugin')],
    extensions: ['.js', '.jsx', '.scss']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SD_API_URL: JSON.stringify(process.env.SD_API_URL)
      }
    }),
    new ExtractTextPlugin('../css/plugin.css'),
    isDevelopment ? null : new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ].filter(p => !!p),
  watch: isDevelopment
}