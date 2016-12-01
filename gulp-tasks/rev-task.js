const gulp = require('gulp');
const rev = require('gulp-rev');

module.exports = options => () => {
  return gulp.src(options.entry)
    .pipe(rev())
    .pipe(gulp.dest(options.output))
    .pipe(rev.manifest())
    .pipe(gulp.dest('.'));
}
