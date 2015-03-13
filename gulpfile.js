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

// Copy minified Bower main files
gulp.task('bower', function() {

	return $.run('bower install').exec(function() {

		return gulp.src(bowerFiles())
				   .pipe($.changed(path.js.dest))
				   .pipe($.size({
					   title : 'Bower'
				   }))
				   .pipe(gulp.dest(path.js.dest));

	});

});

// Compile SASS files
gulp.task('css', function() {

	return gulp.src(path.css.src + 'style.scss')
			   .pipe($.plumber())
			   .pipe($.sourcemaps.init())
			   .pipe($.sass({
				   outputStyle    : 'nested',
				   precision      : 4,
				   sourceComments : 'normal'
			   }))
			   .pipe($.autoprefixer({
				   browsers : ['last 2 version', '> 5%', 'ie >= 9'],
				   cascade  : true
			   }))
			   .pipe($.sourcemaps.write('/'))
			   .pipe(gulp.dest(path.css.dest))
			   .pipe($.filter('**/*.css'))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.minifyCss())
			   .pipe($.size({
				   title : 'CSS'
			   }))
			   .pipe(gulp.dest(path.css.dest));

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
			   .pipe($.size({
				   title : 'Icons'
			   }))
			   .pipe(gulp.dest(path.icons.dest));

});

// Concat and minify JS files
gulp.task('js:plugins', function() {

	return gulp.src(path.js.src + 'plugins.js')
			   .pipe($.plumber())
			   .pipe($.changed(path.js.dest))
			   .pipe($.include())
			   .pipe($.sourcemaps.init())
			   .pipe($.jshint())
			   .pipe($.jshint.reporter('jshint-stylish'))
			   .pipe($.sourcemaps.write('/'))
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
			   .pipe($.sourcemaps.init())
			   .pipe($.jshint())
			   .pipe($.jshint.reporter('jshint-stylish'))
			   .pipe($.sourcemaps.write('/'))
			   .pipe(gulp.dest(path.js.dest))
			   .pipe($.filter('**/*.js'))
			   .pipe($.rename({ suffix : '.min' }))
			   .pipe($.uglify({ preserveComments : 'some' }))
			   .pipe($.size({
				   title : 'Scripts'
			   }))
			   .pipe(gulp.dest(path.js.dest));

});

gulp.task('js', gulp.parallel('js:plugins', 'js:script'));

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

	return del([basePath.dest], cb);

});

// Watch source files
gulp.task('watch:src', function() {

	gulp.watch(path.html.src  + '**/*', 'html');
	gulp.watch(path.icons.src + '**/*', 'icons');
	gulp.watch(path.css.src   + '**/*', 'css');
	gulp.watch(path.fonts.src + '**/*', 'fonts');
	gulp.watch(path.js.src    + '**/*', 'js');
	gulp.watch(path.img.src   + '**/*', 'img');

});

// Watch build files
gulp.task('watch:push', function() {

	gulp.watch([path.css.dest + '**/*.css', path.js.dest + '**/*.js', path.img.dest + '**/*'], 'push');

});

// Watch files
gulp.task('watch', gulp.parallel('server', 'watch:src', 'watch:push'));

// Build everything
gulp.task('build', gulp.series('icons', 'fonts', 'css', 'js', 'html', 'img', 'bower'));

// Before build, get rid of all the current files
gulp.task('default', gulp.series('clean', 'build'));