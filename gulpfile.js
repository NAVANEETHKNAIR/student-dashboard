require('app-module-path').addPath(__dirname);

const path = require('path');
const gulp = require('gulp');
const buildBundleTasks = require('gulp-tasks/helpers/bundle-task-builder');

const DEST_SCRIPTS = path.resolve('./dist/js');
const DEST_STYLESHEETS = path.resolve('./dist/css');

function createScriptBundle({ entryPath, react = true, name, modulesDirectories = [] }) {
  return {
    react,
    entry: path.resolve(`${entryPath}/index.js`),
    modulesDirectories: [path.resolve(entryPath), ...modulesDirectories],
    output: DEST_SCRIPTS,
    getEnv: isDevelopment => {
      return {
        API_URL: isDevelopment ? 'http://localhost:3000' : ''
      }
    },
    fileName: `${name}.min.js`
  }
}

function createSassBundle({ entryPath, name, classPrefix }) {
  return {
    entry: path.resolve(`${entryPath}/index.scss`),
    output: DEST_STYLESHEETS,
    fileName: `${name}.min.css`,
    classPrefix,
    watchPaths: [path.resolve(`${entryPath}/**/*.scss`)]
  }
}

gulp.task('server', require('gulp-tasks/server'));

gulp.task('assets', require('gulp-tasks/assets'));

buildBundleTasks({
  name: 'plugin',
  scripts: createScriptBundle({ entryPath: './client/plugin', name: 'plugin' }),
  sass: createSassBundle({ entryPath: './client/plugin', name: 'plugin', classPrefix: 'sd-' })
});

buildBundleTasks({
  name: 'pluginLoader',
  scripts: createScriptBundle({ entryPath: './client/plugin-loader', name: 'plugin-loader' })
});

gulp.task('default', () => {
  gulp.run('serve.plugin');
});
