var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
//var imageminPngquant = require('imagemin-pngquant');
var tinypng = require('gulp-tinypng-compress');
var spritesmith = require('gulp.spritesmith');
var csso = require('gulp-csso');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');


gulp.task('default', ['']);

//gulp.task('imagemin', function () {
//    gulp.src('./go/*.png')
//        .pipe(imagemin([imageminPngquant({quality: '65-80'})]))
//        .pipe(gulp.dest('./dist/go'));
//});

gulp.task('tinypng', function () {
    gulp.src('./go/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'MLWCGhw435_I3u1CmAW90Io-3e6VqhQF',
            //sigFile: 'images/.tinypng-sigs',
            summarize: true,
            log: true
        }))
        .pipe(gulp.dest('./dist/go'));
});


gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = gulp.src('./go/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(csso())
        .pipe(gulp.dest('./dist/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('csso', function () {
    return gulp.src('./css/vuedemo.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./dist'));
});