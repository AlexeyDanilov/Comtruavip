var gulp           = require('gulp'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	pngquant       = require('imagemin-pngquant'),
	cache          = require('gulp-cache'),
	autoprefixer   = require('gulp-autoprefixer'),
	bourbon        = require('node-bourbon'),
	ftp            = require('vinyl-ftp'),
	svgSprite 	   = require('gulp-svg-sprite'),
	svgmin 		   = require('gulp-svgmin'),
	cheerio 	   = require('gulp-cheerio'),
	replace 	   = require('gulp-replace');
	jade 		   = require('gulp-jade'),	
	notify         = require("gulp-notify"),
	path = {
			  jade: 'app/jade/**/*.jade',
			  html: 'app/*.html'
			},
	plumber = require('gulp-plumber');


// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/hoverintent.min.js',
		'app/libs/swiper/dist/js/swiper.js',
		'app/libs/rellax/rellax.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.js',
		'app/libs/svg4everybody.min.js',
		'app/libs/smooth-scroll/dist/js/smooth-scroll.min.js',
		'app/libs/stylernumber.js',
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});
gulp.task('svgSprite', function () {
	return gulp.src('app/i/icons/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:'../../../sass/_sprite.scss',
							template: "app/sass/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('app/i/sprite/'));

});

gulp.task('jade', function(){

    return gulp.src('app/jade/*.jade')
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('app'));

});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'jade', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/sass/**/*.scss', ['scss']);
	gulp.watch('app/jade/**/*.jade', ['jade']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
	gulp.watch(path.html).on('change', browserSync.reload);
    gulp.watch(path.jade, ['jade']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'svgSprite', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildSprite = gulp.src([
		'app/i/sprite/*'
	]).pipe(gulp.dest('dist/i/sprite'));


});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
