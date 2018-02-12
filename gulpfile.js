'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var browserSync = require('browser-sync').create();

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */

gulp.task('default', ['clean', 'load', 'serve'], function () {
    console.log('------------- Server Start --------------');
});


var nodemon = require('gulp-nodemon');
gulp.task('load', function() {
    // nodemon({
    //     script: './src/app/server', // 忽略部分对程序运行无影响的文件的改动，nodemon只监视js文件，可用ext项来扩展别的文件类型
    //     ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
    //     env: {
    //         'NODE_ENV': 'development'
    //     }
    // }).
    nodemon({
        // the script to run the app
        script: './src/server/server',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ["server.js", "app.js", "routes/", 'public/*', 'public/*/**'],
        ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
        env: {
            'NODE_ENV': 'development'
        },
        ext: 'js'
        // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
    }).on('start', function() {
        console.log('------server Start.---------')
    });
});



