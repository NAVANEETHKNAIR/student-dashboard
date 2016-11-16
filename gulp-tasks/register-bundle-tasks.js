const path = require('path');
const _ = require('lodash');
const gulp = require('gulp');

const makeScriptTask = require('./script-task');
const makeSassTask = require('./sass-task');
const makeWebpackConfig = require('./webpack-config');
const makeAssetsTask = require('./assets-task');

function registry(registryOptions) {
  let self = {};

  let allBuildTasks = [];

  self.register = function register(bundleName, options) {
    const scriptOptions = options.script;
    const sassOptions = options.sass;

    let serveTasks = [];
    let buildTasks = [];

    if(scriptOptions) {
      serveTasks = [...serveTasks, `scripts.${bundleName}`];
      buildTasks = [...buildTasks, `build:scripts.${bundleName}`];

      const makeWebpackConfigForDev = isDevelopment => makeWebpackConfig({
        isDevelopment,
        entry: scriptOptions.entry,
        output: scriptOptions.output,
        dist: scriptOptions.dist,
        fileName: scriptOptions.fileName,
        modules: scriptOptions.modules || [],
        env: Object.assign({}, scriptOptions.env || {}, { NODE_ENV: isDevelopment ? 'development' : 'production' })
      });

      gulp.task(`scripts.${bundleName}`, makeScriptTask({
        webpackConfig: makeWebpackConfigForDev(true)
      }));

      gulp.task(`build:scripts.${bundleName}`, ['assets'], makeScriptTask({
        webpackConfig: makeWebpackConfigForDev(false)
      }));
    }

    if(sassOptions) {
      serveTasks = [...serveTasks, `styles.${bundleName}`];
      buildTasks = [...buildTasks, `build:styles.${bundleName}`];

      const makeSasOptions = isDevelopment => Object.assign({}, sassOptions, { isDevelopment });

      gulp.task(`styles.${bundleName}`, makeSassTask(makeSasOptions(true)));
      gulp.task(`build:styles.${bundleName}`, ['assets'], makeSassTask(makeSasOptions(false)));
    }

    gulp.task(`serve.${bundleName}`, serveTasks);

    allBuildTasks = [...allBuildTasks, ...buildTasks];

    return self;
  }

  self.done = function() {
    gulp.task('assets', makeAssetsTask({
      assetPaths: registryOptions.assetPaths,
      assetDist: registryOptions.assetDist
    }));

    gulp.task('build', allBuildTasks);
  }

  return self;
}

module.exports = registry;
