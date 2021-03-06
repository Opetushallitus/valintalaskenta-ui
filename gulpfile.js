var gulp = require('gulp'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		runSequence = require('run-sequence'),
		clean = require('gulp-clean'),
		watch = require('gulp-watch'),
		livereload = require('gulp-livereload'),
		karma = require('gulp-karma'),
		sass = require('gulp-sass'),
		debug = require('gulp-debug');

var paths = {
	testSources: 'src/test/ui/',
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

		'bower_components/jquery/dist/jquery.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery/dist/jquery.min.map',

		'bower_components/jquery-i18n-properties/jquery.i18n.properties.js',
		'bower_components/jquery-i18n-properties/jquery.i18n.properties.min.js',
		'bower_components/jquery-i18n-properties/jquery.i18n.properties.min.map',

		'bower_components/jquery-ui/jquery-ui.min.js',

		'bower_components/lodash/dist/lodash.underscore.min.js',

		'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

		'bower_components/angular-cache/dist/angular-cache.js',
		'bower_components/angular-cache/dist/angular-cache.min.js',
		'bower_components/angular-cache/dist/angular-cache.min.map',

		'bower_components/angular-cookies/angular-cookies.js',
		'bower_components/angular-cookies/angular-cookies.min.js',
		'bower_components/angular-cookies/angular-cookies.min.map',

		'bower_components/angular-idle/angular-idle.js',

		'bower_components/angular-translate/angular-translate.js',

		'bower_components/oph_urls/index.js'
	],
	css: 'src/main/resources/webapp/common/css/',
	sass: ['sass/valintaperusteet.scss', 'sass/valintalaskenta.scss'],
	cleanBuildFiles: [
		'node/',
		'node_modules/',
		'bower_components'
	],
	unitTests: [
        'src/main/resources/webapp/common/jslib/jquery.js',
        'src/main/resources/webapp/common/jslib/angular.js',
        'src/main/resources/webapp/common/jslib/*.js',
        'src/main/resources/webapp/common/jslib/ui.bootstrap-tpls.min.js',
        'src/main/resources/webapp/app/app.js',
        'src/main/resources/webapp/app/**/*.js',
        'src/main/resources/webapp/common/js/**/*.js',
        'src/main/resources/webapp/common/jslib/static/tinymce-4.0.12/*.js',
        'src/test/ui/angular-mocks.js',
        'src/test/ui/unit/**/*.js'
	],
	testLibs: [
		'bower_components/angular-mocks/angular-mocks.js',
		'bower_components/angular-scenario/angular-scenario.js'
	],
	jslib: 'src/main/resources/webapp/common/jslib',
	sources: [
		'src/main/resources/webapp/app/**',
		'src/main/resources/webapp/common/css/other.css',
		'src/main/resources/webapp/common/css/virkailija.css',
		'src/main/resources/webapp/common/html/**',
		'src/main/resources/webapp/common/js/**',
		'src/main/resources/webapp/common/modaalinen/**'
	]
}

// DEFAULT
gulp.task('default', function (callback) {
	runSequence('test', callback);
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

gulp.task('testscripts', function () {
	return gulp
		.src(paths.testLibs)
		.pipe(gulp.dest(paths.testSources));
});

// Update libs & run tests
gulp.task('build', function (callback) {
	runSequence(['scripts', 'testscripts'], callback);
});

// Run tests
gulp.task('test', function () {
	return gulp.src(paths.unitTests)
		.pipe(karma({
			configFile: 'src/test/ui/valintalaskenta-test.conf.js'
		}).on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        }));
});

gulp.task('css', function () {
  return gulp
      .src(paths.sass)
      .pipe(debug({'title': 'Preprocessing CSS'}))
      .pipe(sass())
      .pipe(debug({'title': 'Generated'}))
      .pipe(gulp.dest(paths.css))
      .pipe(livereload())
})

gulp.task('watch-sass', ['css'], function() {
  livereload.listen()
  gulp.watch(['sass/**/*.scss'], ['css']);
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


