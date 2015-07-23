var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs');

gulp.task('vet', function() {
  return gulp
    .src([ '*.js', 'public/**/*.js', 'routes/**/*.js', 'views/**/*.js', 'config/**/*.js' ])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true } ));
});
