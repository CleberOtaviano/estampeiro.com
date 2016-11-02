var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');

var paths = {
  scripts: './app/assets/js/*.js',
  images: './app/assets/images/**/*'
}
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['./public']);
});


gulp.task('scripts', function () {

  return gulp.src('./app/assets/js/*.js', {read: false}) // no need of reading file because browserify does.

    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {

      gutil.log('bundling ' + file.path);

      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {debug: true}).bundle();

    }))

    // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
    .pipe(buffer())

    // load and init sourcemaps
    .pipe(sourcemaps.init({loadMaps: true}))

    .pipe(uglify())

    // write sourcemaps
    .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('./public/js/'));

});


gulp.task('sass', ['clean'], function () {
  return gulp.src('./app/assets/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', ['clean'], function() {
  return gulp.src('./app/assets/images/**/*')
    // Pass in options to the task
    // .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch('./app/assets/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['watch','sass', 'scripts', 'images']);