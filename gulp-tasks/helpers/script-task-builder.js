const webpack = require('webpack-stream');
const rename = require('gulp-rename');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');

module.exports = options => () => {
  const pipeline = gulp.src(options.src)
    .pipe(plumber())
    .pipe(webpack(options.webpackConfig))
    .pipe(rename(options.fileName))
    .pipe(gulp.dest(options.dest));
}
