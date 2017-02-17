var gulp = require('gulp')
var autoprefixer = require('gulp-autoprefixer')
var minifycss = require('gulp-minify-css')
var jshint = require('gulp-jshint')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')
var clean = require('gulp-clean')
var rev = require('gulp-rev')
var revReplace = require('gulp-rev-replace')
var minifyHtml = require('gulp-minify-html')
var less = require('gulp-less')

var SRC_PATH = './mobile/'
var DIST_PATH = './mobile/dist/'



// less -> css
gulp.task('less', function () {
    return gulp.src(SRC_PATH + 'less/app.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest(SRC_PATH + 'css'))
})

// mini images
gulp.task('images', function () {
    return gulp.src(SRC_PATH + 'img/**/*.{jpg,png,gif}')
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(SRC_PATH + '/img'))
})

// clean dist file
gulp.task('cleanDist', function () {
    return gulp.src([DIST_PATH, SRC_PATH + 'toOnline'], {
            read: false
        })
        .pipe(clean())
})

// copy img
gulp.task('copyImages', ['cleanDist'], function () {
    return gulp.src(SRC_PATH + 'img/**/*.{jpg,png,gif}')
        .pipe(gulp.dest(DIST_PATH + 'img'))
});

// css add rev
gulp.task('revCss', ['copyImages'], function () {
    return gulp.src(SRC_PATH + 'less/app.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest(SRC_PATH + 'css'))
        .pipe(rev())
        .pipe(gulp.dest(DIST_PATH + 'css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(DIST_PATH + 'rev/css'))
})

// js add rev
gulp.task('revJs', ['revCss'], function () {
    var config = {
        mangle: {
            except: ['define', 'require', 'module', 'exports', 'factory']
        },
        compress: false
    }
    return gulp.src(SRC_PATH + 'scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify(config))
        .pipe(gulp.dest(SRC_PATH + '/js'))
        .pipe(rev())
        .pipe(gulp.dest(DIST_PATH + 'js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(DIST_PATH + 'rev/js'))
})
// seajs config src path to online path
// seajs config replace rev json(js)
gulp.task('revLib', ['revJs'], function() {
    var toOnline = gulp.src(SRC_PATH + 'toOnline/*.json');
    var jsManifest = gulp.src(DIST_PATH + 'rev/js/*.json');
    return gulp.src(SRC_PATH + 'lib/*.js')
        .pipe(revReplace({
            manifest: toOnline
        }))
        .pipe(revReplace({
            manifest: jsManifest
        }))
        .pipe(rev())
        .pipe(gulp.dest(DIST_PATH + 'lib'))
        .pipe(rev.manifest({
            merge: true
        }))
        .pipe(gulp.dest(DIST_PATH + 'rev/lib'))
})

// html replace rev json(js css) and minifyHtml
gulp.task('revReplace', ['revLib'], function() {
    var jsManifest = gulp.src([DIST_PATH + 'rev/lib/*.json', DIST_PATH + 'rev/css/*.json']);
    return gulp.src(SRC_PATH + '*.html')
        .pipe(revReplace({
            manifest: jsManifest
        }))
        .pipe(minifyHtml())
        .pipe(gulp.dest(DIST_PATH))
})

// post task and clean file
gulp.task('build', ['revReplace'], function() {
    return gulp.src([DIST_PATH + 'rev', SRC_PATH + 'js'], {
            read: false
        })
        .pipe(clean())
})

gulp.task('watch', function() {
    gulp.watch(SRC_PATH + 'less/**/*.less', ['less'])
    gulp.watch(SRC_PATH + 'img/**/*.{jpg,png,gif}', ['images'])
})

gulp.task('default', ['clean', 'watch'], function() {
    gulp.start('less', 'images')
})