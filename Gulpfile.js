// File: Gulpfile.js
'use strict';

var gulp      = require('gulp'),
    webserver = require('gulp-webserver'),
    stylus    = require('gulp-stylus'),
    nib       = require('nib'),
    path      = require('path'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    inject    = require('gulp-inject'),
    wiredep   = require('wiredep').stream,
    gulpif    = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref    = require('gulp-useref'),
    uglify    = require('gulp-uglify'),
    connect = require('gulp-connect'),
  //  uncss     = require('gulp-uncss'),
    angularFilesort = require('gulp-angular-filesort'),
    //templateCache = require('gulp-angular-templatecache'),
    historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo
gulp.task('server', function() {
    connect.server({
        host		: '0.0.0.0',
        port		: 9999,
        root: 'app',
        livereload: true,
        fallback	: 'index.html',
        middleware: function(connect, opt) {
            return [ historyApiFallback({}) ];
        }
    });
});
//Busca errores enel JS y nos los muestra por pantalla
gulp.task('jshint', function(){
  return gulp.src('./app/scripts/**/*.js')
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('inject', function() {
  return gulp.src('index.html', {cwd: './app'})
    .pipe(inject(
      gulp.src(['./app/scripts/**/*.js']).pipe(angularFilesort()), {
      read: false,
      ignorePath: '/app'
    }))
    .pipe(inject(
      gulp.src(['./app/stylesheets/**/*.css']), {
        read: false,
        ignorePath: '/app'
      }
    ))
    .pipe(gulp.dest('./app'));
});

// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest('./app/stylesheets'))
    .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos
// para inyectarlos en el index.html
// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: './app/lib'
    }))
    .pipe(gulp.dest('./app'));
});
// Compila las plantillas HTML parciales a JavaScript
// para ser inyectadas por AngularJS y minificar el código
gulp.task('templates', function() {
  gulp.src('./app/views/**/*.tpl.html')
    .pipe(templateCache({
      root: 'views/',
      module: 'blog.templates',
      standalone: true
    }))
    .pipe(gulp.dest('./app/scripts'));
});
// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
gulp.watch(['./app/**/*.html'], ['html', 'templates']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});
gulp.task('default', ['server', 'inject', 'wiredep',  'watch']);
gulp.task('build', ['templates', 'compress', 'copy', 'uncss']);
