var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('tests', function () {
    return gulp.src('tests.js', {read: false})
        .pipe(mocha());
});

gulp.task('watch', function() {
    gulp.watch('**/*.js', ['lint', 'tests']);
});

gulp.task('default', ['lint', 'tests', 'watch'], function () {
    console.log('Success!');
});