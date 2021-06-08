
const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}
function cleanDest() {
    return del('dest');
}
function images() {
    return src('app/img/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dest/images'))
}
function html() {
    return src(['./app/default.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(concat('index.html'))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}
function scripts() {
    return src([
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}
function styles() {
    return src('./app/sass/style.scss')
    .pipe(scss({outputStyle: "compressed"}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version']
    }))
    .pipe(dest('app/css')) 
    .pipe(browserSync.stream())
}
function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dest'))
}
function watching() {
    watch(['app/sass/**/*.scss'], styles);
    watch(['app/js/main.js'], scripts);
    watch(['app/parts/*.html'], html);
    watch(['app/default.html'], html);
    // watch(['app/*.html']).on('change', browserSync.reload);
}
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDest = cleanDest;
exports.html = html;

exports.build = series(cleanDest, images, build);
exports.default = parallel(html, styles, scripts,browsersync, watching);
