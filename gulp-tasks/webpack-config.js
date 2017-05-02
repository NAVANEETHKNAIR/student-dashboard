const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = options => {
  return {
    bail: !options.isDevelopment,
    entry: options.entry,
    devtool: options.isDevelopment ? 'eval-source-map' : '',
    output: {
      path: path.join(options.output, 'js'),
      filename: `${options.fileName}.js`
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /.scss$/,
          loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader')
        },
        {
            test: /\.json$/,
            loader: 'json'
        }
      ]
    },
    sassLoader: options.sassLoader || {},
    resolve: {
      modulesDirectories: ['node_modules', ...(options.modules || [])],
      extensions: ['', '.js', '.jsx', '.scss']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(options.env || {})
      }),
      new ExtractTextPlugin(path.join(options.output, 'css', `${options.fileName}.css`)),
      options.isDevelopment ? null : new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    watch: options.isDevelopment
  };
}
