var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    less = require('gulp-less'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig = require('./webpack.config.js'),
    stream = require('webpack-stream');

gulp.task('less', function () {
    return gulp.src('src/less/**/*')
        .pipe(less({
            paths: ['node_modules/bootstrap/less']
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('webpack', [], function() {
    return gulp.src('src/js/**/*')
        .pipe(sourcemaps.init())
        .pipe(stream(webpackConfig))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('webpack-dev-server', function(callback) {
    var conf = Object.create(webpackConfig);
    conf.devtool = 'eval';
    conf.debug = true;

    new WebpackDevServer(webpack(conf), {
        publicPath: '/' + conf.output.publicPath,
        stats: {colors: true},
        historyApiFallback: true
    }).listen(8080, 'localhost', function(err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/');
    });
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*', ['webpack']);
    gulp.watch('src/less/**/*', ['less']);
});

gulp.task('build', ['webpack', 'less']);
gulp.task('default', ['webpack-dev-server', 'watch']);
