'use strict';

var gulp  = require('gulp'),
  jshint  = require('gulp-jshint'),
  jscs    = require('gulp-jscs');

gulp.task('vet', function() {
  return gulp
    .src([ '*.js', 'models/**/*.js', 'public/js/**/*.js', 'routes/**/*.js', 'config/**/*.js' ])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true } ));
});

// gulp.task('build', function() {
//   return gulp
//     .src([ 'public/js/**/*.js', 'public/css/**/*.css' ])
//     .pipe()
// });

