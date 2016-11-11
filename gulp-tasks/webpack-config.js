const path = require('path');
const webpack = require('webpack');

module.exports = options => {
  return {
    entry: options.entry,
    devtool: options.isDevelopment ? 'eval-source-map' : '',
    output: {
      path: options.output,
      filename: `${options.fileName}.js`
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            plugins: ['transform-class-properties'],
            presets: ['es2015', 'react']
          }
        },
        {
            test: /\.json$/,
            loader: 'json'
        }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules', ...(options.modules || [])]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(options.env || {})
      }),
      options.isDevelopment ? undefined: new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    watch: options.isDevelopment
  };
}
