// Load gulp
var gulp = require('gulp');

// Load plugins
var es           = require('event-stream'),
	compass      = require('gulp-compass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss    = require('gulp-minify-css'),
	jshint       = require('gulp-jshint'),
	uglify       = require('gulp-uglify'),
	imagemin     = require('gulp-imagemin'),
	rename       = require('gulp-rename'),
	clean        = require('gulp-clean'),
	concat       = require('gulp-concat'),
	cache        = require('gulp-cache'),
	livereload   = require('gulp-livereload');

var jsPlugins = [
	'./src/js/responsive.core.js',
	'./src/js/responsive.autosize.js',
	'./src/js/responsive.carousel.js',
	'./src/js/responsive.dismiss.js',
	'./src/js/responsive.dropdown.js',
	'./src/js/responsive.lightbox.js',
	'./src/js/responsive.table.js',
	'./src/js/responsive.tabs.js',

	'./src/js/jquery.doubletaptogo.js'
];

// Styles
gulp.task('css', function() {
	return es.concat(
		gulp.src('./src/scss/base.scss')
			   .pipe(compass({
				   config_file : './config.rb',
				   css         : './dist/css',
				   sass        : './src/scss'
			   }))
			   .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', { cascade : true }))
			   .pipe(gulp.dest('./dist/css'))
			   .pipe(rename({ suffix : '.min' }))
			   .pipe(minifycss())
			   .pipe(gulp.dest('./dist/css')),

		gulp.src('./src/scss/style.scss')
			   .pipe(compass({
				   config_file : './config.rb',
				   css         : './dist/css',
				   sass        : './src/scss'
			   }))
			   .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', { cascade : true }))
			   .pipe(gulp.dest('./dist/css'))
			   .pipe(rename({ suffix : '.min' }))
			   .pipe(minifycss())
			   .pipe(gulp.dest('./dist/css'))
	);
});

// Scripts
gulp.task('js', function() {
	return es.concat(
		gulp.src( jsPlugins )
				   .pipe(jshint())
				   .pipe(jshint.reporter('default'))
				   .pipe(concat('plugins.js'))
				   .pipe(gulp.dest('./dist/js'))
				   .pipe(rename({ suffix: '.min' }))
				   .pipe(uglify({ preserveComments: 'some' }))
				   .pipe(gulp.dest('./dist/js')),

		gulp.src('./src/js/script.js')
				   .pipe(jshint())
				   .pipe(jshint.reporter('default'))
				   .pipe(gulp.dest('./dist/js'))
				   .pipe(rename({ suffix: '.min' }))
				   .pipe(uglify({ preserveComments: 'some' }))
				   .pipe(gulp.dest('./dist/js'))
	);
});

// Images
gulp.task('img', function() {
	return gulp.src('./src/img/**/*')
			   .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
			   .pipe(gulp.dest('./dist/img'));
});

// Clean
gulp.task('clean', function() {
	return gulp.src(['./dist/css/base*.css', './dist/css/style*.css', './dist/js/plugins*.js', './dist/img/**/*'], { read : false })
			   .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'img');
});

// Watch
gulp.task('watch', function() {
	// Watch .scss files
	gulp.watch('./src/scss/**/*.scss', ['css']);

	// Watch .js files
	gulp.watch('./src/js/**/*.js', ['js']);

	// Watch image files
	gulp.watch('./src/img/**/*', ['img']);

	// Create LiveReload server
	var server = livereload();

	// Watch any files in dist/, reload on change
	gulp.watch('./dist/**').on('change', function(file) {
		server.changed(file.path);
	});
});