// Define paths
var basePath = {
		src  : './src/',
		dest : './dist/'
	},
	path = {
		css : {
			src  : basePath.src + 'scss/',
			dest : basePath.dest + 'css/'
		},
		js : {
			src  : basePath.src + 'js/',
			dest : basePath.dest + 'js/'
		},
		img : {
			src  : basePath.src + 'img/',
			dest : basePath.dest + 'img/'
		}
	};

// Define JS plugins
var jsPlugins = [
		path.js.src + 'responsive.core.js',
		path.js.src + 'responsive.autosize.js',
		path.js.src + 'responsive.carousel.js',
		path.js.src + 'responsive.dismiss.js',
		path.js.src + 'responsive.dropdown.js',
		path.js.src + 'responsive.lightbox.js',
		path.js.src + 'responsive.table.js',
		path.js.src + 'responsive.tabs.js',
		path.js.src + 'jquery.doubletaptogo.js'
	];

// Load gulp and plugins
var es      = require('event-stream'),
	gulp    = require('gulp'),
	plugins = require('gulp-load-plugins')();

// Compile SASS files
gulp.task('css', function() {

	return gulp.src(path.css.src + 'style.scss')
			   .pipe(plugins.plumber())
			   .pipe(plugins.compass({
				   config_file : './config.rb',
				   css         : path.css.dest,
				   sass        : path.css.src
			   }))
			   .pipe(plugins.autoprefixer('last 2 version', '> 1%', 'ie 8', { cascade : true }))
			   .pipe(gulp.dest(path.css.dest))
			   .pipe(plugins.rename({ suffix : '.min' }))
			   .pipe(plugins.minifyCss())
			   .pipe(gulp.dest(path.css.dest));

});

// Minify JS files
gulp.task('js', function() {

	return es.concat(
		gulp.src( jsPlugins )
			.pipe(plugins.plumber())
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('default'))
			.pipe(plugins.concat('plugins.js'))
			.pipe(gulp.dest(path.js.dest))
			.pipe(plugins.rename({ suffix : '.min' }))
			.pipe(plugins.uglify({ preserveComments : 'some' }))
			.pipe(gulp.dest(path.js.dest)),

		gulp.src(path.js.src + 'script.js')
			.pipe(plugins.plumber())
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('default'))
			.pipe(gulp.dest(path.js.dest))
			.pipe(plugins.rename({ suffix : '.min' }))
			.pipe(plugins.uglify({ preserveComments : 'some' }))
			.pipe(gulp.dest(path.js.dest))
	);

});

// Compress images
gulp.task('img', function() {

	return gulp.src(path.img.src + '**/*')
			   .pipe(plugins.plumber())
			   .pipe(plugins.cache(plugins.imagemin({ optimizationLevel : 3, progressive : true, interlaced : true })))
			   .pipe(gulp.dest(path.img.dest));

});

// Remove old files before replacing them with new ones
gulp.task('clean', function() {

	return gulp.src([path.css.dest + 'style*.css', path.js.dest + 'plugins*.js', path.js.dest + 'script*.js', path.img.dest], { read : false })
			   .pipe(plugins.plumber())
			   .pipe(plugins.clean());

});

// Default task
gulp.task('default', ['clean'], function() {

	gulp.start('css', 'js', 'img');

});

// Watch task
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch(path.css.src + '**/*.scss', ['css']);

	// Watch .js files
	gulp.watch(path.js.src + '**/*.js', ['js']);

	// Watch images
	gulp.watch(path.img.src + '**/*', ['img']);

	// Create LiveReload server
	var server = plugins.livereload();

	// Watch all the files in the destination folder and reload when a change occurs
	gulp.watch(basePath.dest + '**/*').on('change', function(file) {
		server.changed(file.path);
	});

});