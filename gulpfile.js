// Load gulp
var gulp = require('gulp');

// Load plugins
var compass      = require('gulp-compass'),
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
	return gulp.src('./src/scss/base.scss')
			   .pipe(compass({
				   config_file : './config.rb',
				   css         : './build',
				   sass        : './src/scss'
			   }))
			   .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', { cascade : true }))
			   .pipe(gulp.dest('./build'))
			   .pipe(rename({ suffix : '.min' }))
			   .pipe(minifycss())
			   .pipe(gulp.dest('./build'));
});

// Scripts
gulp.task('js', function() {
	return gulp.src( jsPlugins )
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'))
			   .pipe(concat('plugins.js'))
			   .pipe(gulp.dest('./build'))
			   .pipe(rename({ suffix: '.min' }))
			   .pipe(uglify({ preserveComments: 'some' }))
			   .pipe(gulp.dest('./build'));
});

// Images
gulp.task('img', function() {
	return gulp.src('./src/img/**/*')
			   .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
			   .pipe(gulp.dest('./dist/img'));
});

// Clean
gulp.task('clean', function() {
	return gulp.src(['./build/*', './dist/css/base*.css', './dist/js/plugins*.js', './dist/img/**/*'], { read : false })
			   .pipe(clean());
});

// Copy compiled CSS/JS files to dist folder
gulp.task('copy-build', ['css', 'js'], function(){
	gulp.src('./build/*.css')
		.pipe(gulp.dest('./dist/css'));

	gulp.src('./build/*.js')
		.pipe(gulp.dest('./dist/js'));
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'img', 'copy-build');
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
	gulp.watch(['./dist/**']).on('change', function(file) {
		server.changed(file.path);
	});
});