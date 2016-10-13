const path = require('path');
const webpack = require('webpack');

module.exports = ({ modulesDirectories, entry, output, fileName, isDevelopment = true, env = {}, react = true }) => {
  const presets = react === true
    ? ['es2015', 'react']
    : ['es2015'];

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
            presets
          }
        },
        {
            test: /\.json$/,
            loader: 'json'
        }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules', ...modulesDirectories]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
      }),
      isDevelopment ? undefined : new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ].filter(p => !!p),
    watch: isDevelopment
  };
}
