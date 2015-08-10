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
	del        = require('del'),
	bowerFiles = require('main-bower-files');

// Copy Bower main files
gulp.task('bower', function( cb ) {

	return $.run('bower install').exec(function() {

		return gulp.src(bowerFiles())
				   .pipe($.changed(path.js.src + 'vendor/bower/'))
				   .pipe($.size({
					   title : 'Bower'
				   }))
				   .pipe(gulp.dest(path.js.src + 'vendor/bower/'))
				   .on('end', cb);

	});

});

// Compile SASS files
gulp.task('css', function( cb ) {

	var files = [
			path.css.src + '**/*.scss',
			'!' + path.css.src + 'partials/_copyright.scss',
			'!' + path.css.src + 'templates/**/*.scss',
			'!' + path.css.src + 'utilities/mixins/**/*.scss',
		];

	return gulp.src(files)
			   .pipe($.plumber())
			   .pipe($.scssLint())
			   .pipe($.filter('style.scss'))
			   .pipe($.sourcemaps.init())
			   .pipe($.sass({
				   outputStyle    : 'expanded',
				   precision      : 4,
				   sourceComments : 'normal'
			   }))
			   .pipe($.autoprefixer({
				   browsers : ['last 2 version', '> 5%', 'ie >= 9'],
				   cascade  : true
			   }))
			   .pipe($.sourcemaps.write('.'))
			   .pipe(gulp.dest(path.css.dest))
			   .pipe($.filter('**/*.css'))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.minifyCss())
			   .pipe($.size({
				   title : 'CSS'
			   }))
			   .pipe(gulp.dest(path.css.dest))
			   .on('end', cb);

});

// Copy fonts
gulp.task('fonts', function() {

	return gulp.src(path.fonts.src + '**/*')
			   .pipe($.changed(path.fonts.dest))
			   .pipe($.size({
				   title : 'Fonts'
			   }))
			   .pipe(gulp.dest(path.fonts.dest));

});

// Build final html files from partials
gulp.task('html', function() {

	return gulp.src(path.html.src + '*.html')
			   .pipe($.plumber())
			   .pipe($.fileInclude({
				   basepath : path.html.src + 'partials/'
			   }))
			   .pipe($.size({
				   title : 'HTML'
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
			   .pipe($.size({
				   title : 'Images'
			   }))
			   .pipe(gulp.dest(path.img.dest));

});

// Create icon font from SVGs
// And generate also CSS classes and HTML template
gulp.task('icons', function() {

	return gulp.src(path.icons.src + '**/*.svg')
			   .pipe($.plumber())
			   .pipe($.iconfont({
				   appendCodepoints : true,
				   fontHeight       : 1000,
				   fontName         : 'icons',
				   normalize        : true
			   }))
			   .on('codepoints', function(codepoints, options) {
				   gulp.src(path.css.src + 'templates/_icons.scss')
					   .pipe($.consolidate('lodash', {
						   className : 'icon',
						   fontName  : 'icons',
						   fontPath  : 'fonts/',
						   icons     : codepoints,
						   version   : Date.now()
					   }))
					  .pipe(gulp.dest(path.css.src + 'partials/components/'));

				   gulp.src(path.html.src + 'templates/_icons.html')
					   .pipe($.consolidate('lodash', {
						   className : 'icon',
						   fontName  : 'icons',
						   fontPath  : 'fonts/',
						   icons     : codepoints
					   }))
					  .pipe(gulp.dest(path.html.src + 'partials/'));
			   })
			   .pipe($.size({
				   title : 'Icons'
			   }))
			   .pipe(gulp.dest(path.icons.dest));

});

// Minify JS files
gulp.task('js:jquery', function() {

	return gulp.src(path.js.src + 'jquery.js')
			   .pipe($.plumber())
			   .pipe($.changed(path.js.dest))
			   .pipe($.include())
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.uglify({ preserveComments : 'some' }))
			   .pipe($.size({
				   title : 'jQuery'
			   }))
			   .pipe(gulp.dest(path.js.dest));

});

gulp.task('js:plugins', function() {

	return gulp.src(path.js.src + 'plugins.js')
			   .pipe($.plumber())
			   .pipe($.changed(path.js.dest))
			   .pipe($.include())
			   .pipe($.sourcemaps.init())
			   .pipe($.sourcemaps.write('.'))
			   .pipe(gulp.dest(path.js.dest))
			   .pipe($.filter('**/*.js'))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.uglify({ preserveComments : 'some' }))
			   .pipe($.size({
				   title : 'Plugins'
			   }))
			   .pipe(gulp.dest(path.js.dest));

});

gulp.task('js:script', function() {

	return gulp.src(path.js.src + 'script.js')
			   .pipe($.plumber())
			   .pipe($.changed(path.js.dest))
			   .pipe($.include())
			   .pipe($.eslint())
			   .pipe($.eslint.format('stylish'))
			   .pipe($.eslint.failAfterError())
			   .pipe($.sourcemaps.init())
			   .pipe($.sourcemaps.write('.'))
			   .pipe(gulp.dest(path.js.dest))
			   .pipe($.filter('**/*.js'))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.uglify({ preserveComments : 'some' }))
			   .pipe($.size({
				   title : 'Scripts'
			   }))
			   .pipe(gulp.dest(path.js.dest));

});

gulp.task('js', gulp.parallel('js:jquery', 'js:plugins', 'js:script'));

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
gulp.task('clean', function( cb ) {

	var files = [
		basePath.dest,
		'bower_components/',
		path.js.src + 'vendor/bower/',
		path.css.src + 'partials/components/_icons.scss'
	];

	return del(files, cb);

});

// Watch source files
gulp.task('watch:src', function() {

	gulp.watch(path.css.src   + '**/*', gulp.parallel('css'));
	gulp.watch(path.fonts.src + '**/*', gulp.parallel('fonts'));
	gulp.watch(path.html.src  + '**/*', gulp.parallel('html'));
	gulp.watch(path.icons.src + '**/*', gulp.parallel('icons'));
	gulp.watch(path.img.src   + '**/*', gulp.parallel('img'));
	gulp.watch(path.js.src    + '**/*', gulp.parallel('js:plugins', 'js:script'));

});

// Watch source files and auto-push
gulp.task('watch:push', function() {

	gulp.watch(path.css.src   + '**/*', gulp.series('css', 'push'));
	gulp.watch(path.fonts.src + '**/*', gulp.series('fonts', 'push'));
	gulp.watch(path.html.src  + '**/*', gulp.series('html', 'push'));
	gulp.watch(path.icons.src + '**/*', gulp.series('icons', 'push'));
	gulp.watch(path.img.src   + '**/*', gulp.series('img', 'push'));
	gulp.watch(path.js.src    + '**/*', gulp.series(gulp.parallel('js:plugins', 'js:script'), 'push'));

});

// Watch files
gulp.task('watch:local', gulp.parallel('server', 'watch:src'));
gulp.task('watch', gulp.parallel('server', 'watch:push'));

// Build everything
gulp.task('build', gulp.series('bower', 'icons', gulp.parallel('css', 'fonts', 'html', 'img', 'js')));

// Before build, get rid of all the current files
gulp.task('default', gulp.series('clean', 'build'));
