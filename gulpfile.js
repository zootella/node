




var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: "localhost:5000",  // local node app address
    port: 7000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function(f) {
  var called = false;
  return nodemon({
    script: 'app/familiar/server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      f();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('familiar', ['browser-sync'], function () {
  gulp.watch(['**.js'], reload);
});




