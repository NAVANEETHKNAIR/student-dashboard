const gulp = require('gulp');

module.exports = options => () => {
  return gulp.src(options.assetPaths)
    .pipe(gulp.dest(options.assetDist));
}
