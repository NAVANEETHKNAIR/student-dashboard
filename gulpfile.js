require('app-module-path').addPath(__dirname);

const path = require('path');
const gulp = require('gulp');

const makeServerTask = require('gulp-tasks/server-task');
const makeDeployTask = require('gulp-tasks/deploy-task');
const makeTestTask = require('gulp-tasks/test-task');

const constants = require('gulp-tasks/constants');

const scriptsDist = path.join(__dirname, 'dist', 'js');
const stylesDist = path.join(__dirname, 'dist', 'css');

const registry = require('gulp-tasks/register-bundle-tasks')({
  assetPaths: './assets/**/*',
  assetDist: path.join(__dirname, 'dist', 'assets')
});

registry
  .register('plugin', {
    script: {
      entry: path.join(__dirname, 'client', 'plugin', 'index.js'),
      fileName: 'plugin',
      output: scriptsDist,
      modules: [path.join(__dirname, 'client', 'plugin')],
      getEnv: isDevelopment => ({
        API_URL: isDevelopment ? constants.DEV_API_URL : constants.PROD_API_URL
      })
    },
    sass: {
      entry: path.join(__dirname, 'client', 'plugin', 'index.scss'),
      output: stylesDist,
      fileName: 'plugin',
      classPrefix: 'sd-',
      watch: ['./client/plugin/**/*.scss']
    }
  })
  .register('pluginLoader', {
    script: {
      entry: path.join(__dirname, 'client', 'plugin-loader', 'index.js'),
      fileName: 'plugin-loader',
      output: scriptsDist,
      getEnv: isDevelopment => {
        const apiUrl = isDevelopment ? constants.DEV_API_URL : constants.PROD_API_URL;

        return {
          API_URL: apiUrl,
          PLUGIN_SCRIPT_SOURCE: `${apiUrl}/dist/js/plugin.js`,
          PLUGIN_STYLE_SOURCE: `${apiUrl}/dist/css/plugin.css`
        }
      }
    }
  })
  .done()

gulp.task('test', makeTestTask({ paths: ['./app-modules/**/*.spec.js', './server/**/*.spec.js'] }));

gulp.task('server', makeServerTask({
  watch: constants.NODEMON_PATHS,
  env: constants.SERVER_ENV_CONFIG
}));

gulp.task('deploy', makeDeployTask());

gulp.task('default', ['server', 'serve.plugin']);
