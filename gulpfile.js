var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify');

//preinstalled assets not found from npm-packages
var staticLibs = [
	"src/main/webapp/common/jslib/jquery-2.1.0/jquery-2.1.0.js",
	"src/main/webapp/common/jslib/angular-1.2.10/angular.js",
	"src/main/webapp/common/jslib/angular-1.2.10/angular-route.js",
	"src/main/webapp/common/jslib/angular-1.2.10/angular-animate.js",
	"src/main/webapp/common/jslib/angular-1.2.10/angular-resource.js",
	"src/main/webapp/common/jslib/angular-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min.js",
	"src/main/webapp/common/jslib/jquery-1.8.3/jquery.nestable.js",
    "src/main/webapp/common/jslib/underscore/underscore-min.js",
	"src/main/webapp/common/jslib/tinymce-4.0.12/tinymce.min.js",
	"src/main/webapp/common/jslib/tinymce-4.0.12/ui-tinymce.js"
];


gulp.task('scripts-browserify', function() {
    gulp
        .src('app/libs.js')
        .pipe(browserify({insertGlobals: false, debug: false}))
        .pipe(gulp.dest('src/main/webapp/dist/js'));
});

gulp.task('scripts', function() {
    return gulp
        .src(staticLibs)
        .pipe(concat('static-libs.js'))
        .pipe(gulp.dest('src/main/webapp/dist/js'));
});

//gulp.task('styles', function() {
//    return gulp.src()
//});

gulp.task('default', ["scripts-browserify", "scripts"]);
