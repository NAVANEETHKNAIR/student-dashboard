const path = require('path');
const webpack = require('webpack');

module.exports = ({ modules, entry, output, fileName, isDevelopment = true, env = {} }) => {
  return {
    entry,
    devtool: isDevelopment ? 'eval-source-map' : '',
    output: { path: output, filename: fileName },
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
      modulesDirectories: ['node_modules', ...modules]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
      }),
      isDevelopment ? undefined : undefined
    ].filter(p => !!p),
    watch: isDevelopment
  };
}
