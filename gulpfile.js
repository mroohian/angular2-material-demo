/* 
 * gulpfile.js
 * @license Open source under the BSD License.
 */
var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var minify = require("gulp-minify");
var webserver = require("gulp-webserver");
var less = require("gulp-less");
var cleanCSS = require("gulp-clean-css");

var tsFilesPath = "app/ts/**/*.ts";
var lessFilesPath = "app/less/**/*.less";

gulp.task("compileTs", function () {
    console.log("please wait while TS compilation task is running...");
    return gulp.src(tsFilesPath)
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "es5",
            module: "commonjs",
            moduleResolution: "node",
            noImplicitAny: false,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false
        }))
        .pipe(sourcemaps.write())
        .pipe(minify({ preserveComments: "some"}))
        .pipe(gulp.dest("app/js"));
});

gulp.task("compileLess", function() {
    console.log("please wait while Less compilation task is running...");
    return gulp.src(lessFilesPath)
        .pipe(sourcemaps.init())
        .pipe(less())
        //.pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("app/css"));
});

gulp.task("watchTs", function() {
    gulp.watch(tsFilesPath, ["compileTs"]);
});

gulp.task("watchLess", function() {
    gulp.watch(lessFilesPath, ["compileLess"]);
});


gulp.task("webserver", function() {
  gulp.src("app")
    .pipe(webserver({
      port: 8080,
      fallback: "index.html"
    }));
});

gulp.task("build", gulpSequence(["compileTs", "compileLess"]));

gulp.task("default", gulpSequence(["webserver", "watchTs", "watchLess"]));

