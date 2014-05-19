var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	clean = require('gulp-clean'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
    karma = require('gulp-karma');

var paths = {
	bower_components: [
		'bower_components/angular/angular.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular/angular.min.js.map',

		'bower_components/angular-resource/angular-resource.js',
		'bower_components/angular-resource/angular-resource.min.js',
		'bower_components/angular-resource/angular-resource.min.js.map',

		'bower_components/angular-route/angular-route.js',
		'bower_components/angular-route/angular-route.min.js',
		'bower_components/angular-route/angular-route.min.js.map',

		'bower_components/angular-animate/angular-animate.js',
		'bower_components/angular-animate/angular-animate.min.js',
		'bower_components/angular-animate/angular-animate.min.js.map',

        'bower_components/angular-translate/angular-translate.js',

		'bower_components/jquery/dist/jquery.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery/dist/jquery.min.js.map',

		'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',

		'bower_components/underscore/underscore.js',

		'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
	],
	css: [
		'src/main/webapp/common/css/'
	],
	cleanBuildFiles: [
		'node/',
		'node_modules/',
		'bower_components'
	],
	unitTests: [
		'src/test/ui/unit/test.js'
	],
	jslib: 'src/main/webapp/common/jslib',
	sources: [
		'src/main/webapp/app/**',
		'src/main/webapp/common/css/other.css',
		'src/main/webapp/common/css/virkailija.css',
		'src/main/webapp/common/html/**',
		'src/main/webapp/common/js/**',
		'src/main/webapp/common/modaalinen/**'
	]
}

// DEFAULT
gulp.task('default', function (callback) {
	runSequence('scripts', callback);
});

// Development
gulp.task('dev', function (callback) {
    runSequence(['test', 'livereload'], callback);
});


gulp.task('tinymce', function () {
	return gulp
		.src('bower_components/tinymce-release/**/*.*', {base: './bower_components/'})
		.pipe(gulp.dest(paths.jslib));
});

gulp.task('scripts', function () {
	return gulp
		.src(paths.bower_components)
		.pipe(gulp.dest(paths.jslib));
});

// Update libs & run tests
gulp.task('build', function (callback) {
	runSequence(['scripts'], callback);
});

// Run tests
gulp.task('test', function () {
	return gulp.src(paths.unitTests)
		.pipe(karma({
			configFile: 'src/test/ui/valintalaskenta-test.conf.js',
			action: 'watch'
		}).on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        }));
});

// Livereload
gulp.task('livereload', function () {
	return gulp
		.src(paths.sources)
		.pipe(watch())
		.pipe(livereload());
});


// CLEAN NODE & BOWER DEPENDENCIES should only be used in development - removes node, node_modules and bower_components -directories
gulp.task('cleanBuild', function () {
	return gulp
		.src(paths.cleanBuildFiles)
		.pipe(clean());
});


