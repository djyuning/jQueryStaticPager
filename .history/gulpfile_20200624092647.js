const pkg = require('./package.json');
const gulp = require('gulp');
const del = require('del');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const banner = require('gulp-banner');
const stripComments = require('gulp-strip-comments');
const removeEmptyLines = require('gulp-remove-empty-lines');

///////////////////////////////////////////////////

// 构建任务
const TASK_BUILD = ['clean', 'less', 'js'];

// banner
const PLUGIN_BANNER = '/**\n' +
  ' * <%= pkg.name %> <%= pkg.version %>\n' +
  ' * <%= pkg.description %>\n' +
  ' * <%= pkg.homepage %>\n' +
  ' * Copyright 2011 - 2019\n' +
  ' * Released under the <%= pkg.license %> license.\n' +
  ' */\n';

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
      browsers: [
        "last 3 version",
        "> 0.5%"
      ]
    })) // 添加浏览器前缀
    .pipe(banner(PLUGIN_BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(cssnano({
      safe: true,
    })) // 压缩 CSS
    .pipe(rename({
      suffix: '.min',
    })) // 添加后缀名
    .pipe(banner(PLUGIN_BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/'));
});

// JS
gulp.task('js', () => {
  return gulp.src('src/jquery.pager.js')
    .pipe(jshint())
    .pipe(stripComments()) // 去除注释
    .pipe(removeEmptyLines({
      removeComments: true
    })) // 移除空白行
    .pipe(banner(PLUGIN_BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(banner(PLUGIN_BANNER, {
      pkg: pkg
    }))
    .pipe(gulp.dest('dist/'));
});

///////////////////////////////////////////////////

gulp.task('build', gulp.series(...TASK_BUILD));
