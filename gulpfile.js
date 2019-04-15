const pkg = require('./package.json');
const gulp = require('gulp');
const del = require('del');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');

///////////////////////////////////////////////////

// 构建任务
const TASK_BUILD = ['clean', 'less', 'js'];

///////////////////////////////////////////////////

// 清空当前模块的构建
gulp.task('clean', async (cb) => {
  await del('dist', cb);
});

// LESS
gulp.task('less', () => {
  return gulp.src(['src/jquery.pager.less'])
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    })) // 添加浏览器前缀
    .pipe(gulp.dest('dist/'))
    .pipe(cssnano({
      safe: true,
    })) // 压缩 CSS
    .pipe(rename({
      suffix: '.min',
    })) // 添加后缀名
    .pipe(gulp.dest('dist/'));
});

// JS
gulp.task('js', () => {
  return gulp.src('src/jquery.pager.js')
    .pipe(jshint())
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('dist/'));
});

///////////////////////////////////////////////////

gulp.task('build', gulp.series(...TASK_BUILD));
