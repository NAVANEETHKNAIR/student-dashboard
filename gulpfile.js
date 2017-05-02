require('app-module-path').addPath(__dirname);
require('dotenv').config({ silent: true });

const path = require('path');
const gulp = require('gulp');

const makeNodemonTask = require('gulp-tasks/nodemon-task');
const makeMochaTask = require('gulp-tasks/mocha-task');
const makeRevTask = require('gulp-tasks/rev-task');

const dist = path.join(__dirname, 'dist');
const isDevelopment = process.env.NODE_ENV === 'development';

gulp.task('test.server', makeMochaTask({
  paths: ['./app-modules/**/__tests__/*.js', './server/**/__tests__/*.js']
}));

gulp.task('nodemon', makeNodemonTask({
  watch: ['./app-modules', './server', 'app.js']
}));

gulp.task('rev', makeRevTask({
  entry: ['./dist/**/*.js', './dist/**/*.css'],
  output: './dist'
}));

gulp.task('assets', () => {
  return gulp.src('./assets/**/*')
    .pipe(gulp.dest(dist));
});

gulp.task('build', ['assets', 'rev']);

gulp.task('test', ['test.server']);

gulp.task('default', ['nodemon']);
