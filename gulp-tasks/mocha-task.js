const gulp = require('gulp');
const mocha = require('gulp-mocha');

module.exports = options => () => {
  return gulp.src(options.paths, { read: false })
    .pipe(mocha({ reporter: 'nyan' }));
}
