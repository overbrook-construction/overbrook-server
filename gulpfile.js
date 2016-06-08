// 'use strict';
//
// let gulp = require('gulp');
// let webpack = require('gulp-webpack');
// let rename = require('gulp-rename');
// let del = require('del');
// let sass = require('gulp-sass');
// //PATHS
// let jsPaths = ['*.js', 'app/**/*.js'];
// let viewPaths = ['app/**/*.html'];
// let stylePaths = ['app/style/*.scss'];
// let mediaPaths = ['app/img/*/**'];
// let jsonPaths = ['data/*']
// let dataMedia = ['data/img/**'];
//
// //OUTPUT LOCATION
// let output = __dirname + '/public/';
//
// gulp.task('del-public', () => {
//   return del.sync([
//     output + '*'
//   ])
// });
//
// gulp.task('copy-html', () => {
//   gulp.src(viewPaths)
//     .pipe(rename({dirname: ''}))
//     .pipe(gulp.dest(output));
// });
//
// gulp.task('copy-media', () => {
//   gulp.src(mediaPaths)
//     .pipe(rename({dirname: '/media'}))
//     .pipe(gulp.dest(output));
// });
//
// gulp.task('copy-data-json', () => {
//   gulp.src(jsonPaths)
//     .pipe(rename({dirname: '/data'}))
//     .pipe(gulp.dest(output));
// });
//
// gulp.task('copy-data-media', () => {
//   gulp.src(dataMedia)
//     .pipe(rename({dirname: '/data/img'}))
//     .pipe(gulp.dest(output));
// });
//
// gulp.task('webpack', () => {
//   return gulp.src(__dirname + '/app/entry.js')
//   .pipe(webpack({
//     output: {
//       filename: 'bundle.js'
//     }
//   }))
//   .pipe(gulp.dest(output));
// });
//
// gulp.task('sass', function() {
//   return gulp.src(stylePaths)
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest(output + 'css'));
// });
//
// gulp.task('watch', () =>{
//   gulp.watch(stylePaths, ['sass']);
//   gulp.watch(jsPaths, ['webpack']);
//   gulp.watch(viewPaths, ['copy-html']);
//   gulp.watch(mediaPaths, ['copy-media']);
//   gulp.watch(dataMedia, ['copy-data-media']);
//   gulp.watch(jsonPaths, ['copy-data-json']);
// });
//
// // gulp.task('bundle:test', () => {
// //   return gulp.src(__dirname + '/tests/karma-testing.js')
// //   .pipe(webpack({output: {filename: 'test_bundle.js'},
// //   watch: true
// // }))
// //   .pipe(gulp.dest('./tests'));
// // });
//
// gulp.task('default', ['del-public', 'webpack', 'copy-html', 'copy-media', 'copy-data-json', 'copy-data-media', 'sass', 'watch']);
