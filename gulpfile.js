// Define paths
var basePath = {
		src  : 'src/',
		dest : 'dist/'
	},
	path = {
		css : {
			src  : basePath.src + 'scss/',
			dest : basePath.dest + 'css/'
		},
		fonts : {
			src  : basePath.src + 'fonts/',
			dest : basePath.dest + 'css/fonts/'
		},
		html : {
			src  : basePath.src + 'html/',
			dest : basePath.dest
		},
		icons : {
			src  : basePath.src + 'icons/',
			dest : basePath.dest + 'css/fonts/'
		},
		img : {
			src  : basePath.src + 'img/',
			dest : basePath.dest + 'img/'
		},
		js : {
			src  : basePath.src + 'js/',
			dest : basePath.dest + 'js/'
		}
	};

// Load gulp and plugins
var gulp       = require('gulp'),
	$          = require('gulp-load-plugins')(),
	es         = require('event-stream'),
	bowerFiles = require('main-bower-files');

// Copy minified Bower main files
gulp.task('bower', function() {

	return gulp.src(bowerFiles())
			   .pipe($.changed(path.js.dest))
			   .pipe(gulp.dest(path.js.dest));

});

// Compile SASS files
gulp.task('css', function() {

	return gulp.src(path.css.src + 'style.scss')
			   .pipe($.plumber())
			   .pipe($.sass({
				   imagePath      : '../img',
				   outputStyle    : 'nested',
				   precision      : 4,
				   sourceComments : 'normal'
			   }))
			   .pipe($.autoprefixer({
				   browsers : ['last 2 version', '> 1%', 'ie 8'],
				   cascade  : true
			   }))
			   .pipe(gulp.dest(path.css.dest))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.minifyCss())
			   .pipe(gulp.dest(path.css.dest));

});

// Copy fonts
gulp.task('fonts', function() {

	return gulp.src(path.fonts.src + '**/*')
			   .pipe($.changed(path.fonts.dest))
			   .pipe(gulp.dest(path.fonts.dest));

});

// Build final html files from partials
gulp.task('html', function() {

	return gulp.src(path.html.src + '*.html')
			   .pipe($.plumber())
			   .pipe($.fileInclude({
				   basepath : path.html.src + 'partials/'
			   }))
	           .pipe(gulp.dest(path.html.dest));

});

// Compress images
gulp.task('img', function() {

	return gulp.src(path.img.src + '**/*')
			   .pipe($.plumber())
			   .pipe($.changed(path.img.dest))
			   .pipe($.imagemin({
				   	interlaced : true,
				   	optimizationLevel : 3,
				   	progressive : true
			   }))
			   .pipe(gulp.dest(path.img.dest));

});

// Create icon font from SVGs and generate CSS classes
gulp.task('icons', function() {

	return gulp.src(path.icons.src + '**/*.svg')
			   .pipe($.plumber())
			   .pipe($.iconfont({
				   appendCodepoints : true,
				   fontName         : 'icons'
			   }))
			   .on('codepoints', function(codepoints, options) {
				   gulp.src(path.css.src + 'templates/_icons.scss')
					   .pipe($.consolidate('lodash', {
						   className : 'icon',
						   fontName  : 'icons',
						   fontPath  : 'fonts/',
						   icons     : codepoints
					   }))
				 	  .pipe(gulp.dest(path.css.src + 'partials/components/'));
			   })
			   .pipe(gulp.dest(path.icons.dest));

});

// Concat and minify JS files
gulp.task('js', function() {

	return es.concat(
		gulp.src(path.js.src + 'ie10mobilefix.js')
			.pipe($.plumber())
			.pipe($.changed(path.js.dest))
			.pipe($.jshint())
			.pipe($.jshint.reporter('default'))
			.pipe(gulp.dest(path.js.dest))
			.pipe($.rename({ suffix : '.min' }))
			.pipe($.uglify({ preserveComments : 'some' }))
			.pipe(gulp.dest(path.js.dest)),

		gulp.src(path.js.src + 'plugins.js')
			.pipe($.plumber())
			.pipe($.changed(path.js.dest))
			.pipe($.include())
			.pipe($.jshint())
			.pipe($.jshint.reporter('default'))
			.pipe(gulp.dest(path.js.dest))
			.pipe($.rename({ suffix : '.min' }))
			.pipe($.uglify({ preserveComments : 'some' }))
			.pipe(gulp.dest(path.js.dest)),

		gulp.src(path.js.src + 'script.js')
			.pipe($.plumber())
			.pipe($.changed(path.js.dest))
			.pipe($.include())
			.pipe($.jshint())
			.pipe($.jshint.reporter('default'))
			.pipe(gulp.dest(path.js.dest))
			.pipe($.rename({ suffix : '.min' }))
			.pipe($.uglify({ preserveComments : 'some' }))
			.pipe(gulp.dest(path.js.dest))
	);

});

// Pull changes from Studio
gulp.task('pull', function() {

	return $.run('php ../pull.php').exec();

});

// Push changes to Studio
gulp.task('push', function() {

	return $.run('php ../push.php').exec();

});

// Launch basic webserver with LiveReload
gulp.task('server', function() {

	return gulp.src(basePath.dest)
			   .pipe($.plumber())
			   .pipe($.webserver({
				   directoryListing : false,
				   // host             : '0.0.0.0', // for public
				   host             : '127.0.0.1', //  for private
				   livereload       : true,
				   port             : 80
			   }));

});

// Remove all the files which are created by gulp
gulp.task('clean', function() {

	return gulp.src(basePath.dest, { read : false })
			   .pipe($.plumber())
			   .pipe($.clean());

});

// Watch files
gulp.task('watch', ['server'], function() {

	// Watch source files
	gulp.watch(path.html.src + '**/*.html', ['html']);
	gulp.watch(path.icons.src + '**/*.svg', ['icons']);
	gulp.watch(path.css.src + '**/*.scss', ['css']);
	gulp.watch(path.fonts.src + '**/*', ['fonts']);
	gulp.watch(path.js.src + '**/*.js', ['js']);
	gulp.watch(path.img.src + '**/*', ['img']);

	// Watch build files
	gulp.watch([path.css.dest + '**/*.css', path.js.dest + '**/*.js', path.img.dest + '**/*'], ['push']);

});

// Build everything
gulp.task('build', ['icons'], function () {

	gulp.start('html', 'css', 'fonts', 'js', 'img', 'bower');

});

// Before build, get rid of all the current files
gulp.task('default', ['clean'], function () {

	gulp.start('build');

});