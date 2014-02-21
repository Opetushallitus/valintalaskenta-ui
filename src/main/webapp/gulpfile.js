var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify');

//preinstalled assets not found from npm-packages
var staticLibs = [
	"common/jslib/jquery-1.8.3/jquery.nestable.js",
	"common/jslib/tinymce-4.0.12/tinymce.min.js",
	"common/jslib/tinymce-4.0.12/ui-tinymce.js"
];


gulp.task('scripts-browserify', function() {
    gulp
        .src('app/libs.js')
        .pipe(browserify({insertGlobals: false, debug: false}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function() {
    return gulp
        .src(staticLibs)
        .pipe(concat('static-libs.js'))
        .pipe(gulp.dest('dist/js'));
});

//gulp.task('styles', function() {
//    return gulp.src()
//});

gulp.task('default', ["scripts-browserify", "scripts"]);
