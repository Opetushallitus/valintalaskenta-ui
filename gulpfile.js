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
		//'bower_components/angular/angular.min.js',
		//'bower_components/angular-resource/angular-resource.min.js',
		//'bower_components/angular-route/angular-route.min.js',
		//'bower_components/angular-animate/angular-animate.min.js',
		//'bower_components/angular-scenario/angular-scenario.min.js',
		//'bower_components/angular-mocks/angular-mocks.js',
		//'bower_components/jquery/dist/jquery.min.js',
		//'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
		//'bower_components/underscore/underscore.js'
	],
	staticLibs: [
		"src/main/webapp/common/jslib/jquery-2.1.0/jquery-2.1.0.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-route.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-animate.js",
		"src/main/webapp/common/jslib/angular-1.2.10/angular-resource.js",
		"src/main/webapp/common/jslib/underscore/underscore-min.js",
		"src/main/webapp/common/jslib/angular-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min.js",
		"src/main/webapp/common/jslib/jquery-1.8.3/jquery.nestable.js",
		"src/main/webapp/common/jslib/tinymce-4.0.12/tinymce.min.js",
		"src/main/webapp/common/jslib/tinymce-4.0.12/ui-tinymce.js"
	],
	testBase: 'src/test/ui/',
	cleanBuildFiles: [
		'src/main/webapp/dist/',
		'node/',
		'node_modules/',
		'bower_components'
	],
	unitTests: [
		'src/test/ui/unit/test.js'
		//'src/test/ui/unit/controllersSpec.js',
		//'src/test/ui/unit/directivesSpec.js'
	],
	jslib: 'src/main/webapp/common/jslib'
}



// Run 'bower install'
gulp.task('bower-install', function() {
	bower()
		.pipe(gulp.dest('bower_components'));
});

// Concatenate manually downloaded scripts and move to tmp
gulp.task('staticScripts', function() {
    return gulp
        .src(paths.staticLibs)
        .pipe(concat('staticLibs.js'))
        .pipe(gulp.dest(paths.jslib));
});

// Concatenate scripts fetched with bower and move to tmp
gulp.task('bowerScripts', function() {
	return gulp
		.src(paths.bowerScripts)
		.pipe(concat('bowerLibs.js'))
		.pipe(gulp.dest(paths.jslib));
});

// Update libs & run tests
gulp.task('build', function(callback) {
	runSequence([/*'bowerScripts',*/'staticScripts'], 'test', callback);
});

// Run tests
gulp.task('test', function() {
	return gulp.src(paths.unitTests)
		.pipe(karma({
			configFile: 'src/test/ui/valintalaskenta-test.conf.js',
			action: 'run'
		})
	);
});


// DEFAULT
gulp.task('default', function(callback) {
	runSequence('test', callback);
});


// CLEAN NODE & BOWER DEPENDENCIES should only be used in development - removes node, node_modules and bower_components -directories
gulp.task('cleanBuild', function() {
	return gulp
		.src(paths.cleanBuildFiles)
		.pipe(clean());
});