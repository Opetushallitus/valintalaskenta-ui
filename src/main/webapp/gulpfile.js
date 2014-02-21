var gulp = require('gulp');
var concat = require('gulp-concat');

var jslibs = [
	"common/jslib/jquery-2.1.0/jquery-2.1.0.min.js",
	"common/jslib/jquery-1.8.3/jquery.nestable.js",
	"common/jslib/jquery-ui-1.9.2/jquery-ui.min.js",
	"common/jslib/tinymce-4.0.12/tinymce.min.js",
	"common/jslib/angular-1.2.10/angular.min.js",
	"common/jslib/angular-1.2.10/angular-resource.min.js",
	"common/jslib/angular-1.2.10/angular-route.min.js",
	"common/jslib/angular-1.2.10/angular-animate.min.js",
	"common/jslib/tinymce-4.0.12/ui-tinymce.js",
	"common/jslib/underscore/underscore-min.js"
]

gulp.task('default', function() {
	return gulp
	.src(jslibs)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('dist/js'));
});