var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
	bower = require('gulp-bower'),
	runSequence = require('run-sequence'),
	clean = require('gulp-clean'),
	karma = require('gulp-karma');

var paths = {
	bower_base: 'bower_components/',
	bowerScripts: [
		'bower_components/underscore/underscore.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular-resource/angular-resource.min.js',
		'bower_components/angular-route/angular-route.min.js',
		'bower_components/angular-animate/angular-animate.min.js',
		//'bower_components/angular-scenario/angular-scenario.min.js',
		//'bower_components/angular-mocks/angular-mocks.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery-ui/ui/minified/jquery-ui.min.js'
	],
	staticLibs: [
		"src/main/webapp/common/jslib/jquery-2.1.0/jquery-2.1.0.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-route.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-animate.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-resource.js",
		"src/main/webapp/common/jslib/underscore/underscore-min.js",
		"src/main/webapp/common/jslib/angular-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min.js",
		"src/main/webapp/common/jslib/jquery-1.8.3/jqu9ery.nestable.js",
		"src/main/webapp/common/jslib/tinymce-4.0.12/tinymce.min.js",
		"src/main/webapp/common/jslib/tinymce-4.0.12/ui-tinymce.js"
	],
	dist: 'src/main/webapp/dist/',
	testBase: 'src/test/',
	cleanBuildFiles: [
		'src/main/webapp/dist/',
		'node/',
		'node_modules/',
		'bower_components'
	]
}

gulp.task('bower-install', function() {
	bower();
});

gulp.task('bowerScripts', function() {
	return gulp
		.src(paths.bowerScripts)
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('src/main/webapp/dist/js'));
});

gulp.task('staticScripts', function() {
    return gulp
        .src(paths.staticLibs)
        .pipe(concat('static-libs.js'))
        .pipe(gulp.dest('src/main/webapp/dist/js'));
});

gulp.task('clean', function() {
    return gulp.src(paths.dist).pipe(clean());
});

gulp.task('default', function(callback) {
	runSequence('clean', ["staticScripts"], callback);
});

gulp.task('cleanBuild', function() {
	return gulp
		.src(paths.cleanBuildFiles)
		.pipe(clean());
});