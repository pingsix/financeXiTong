var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./config/webpack.config.js");

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
	gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;
	myConfig.output = {
		path : '/build'
	};
console.log(myConfig,myConfig.output.publicPath)
//return;
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" ,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});



















//AbandonCode ================================================

//var gulp = require('gulp');
//var webpack = require('webpack');
//var WebpackDevServer = require('webpack-dev-server');
//var connect = require('gulp-connect');
// 
//gulp.task('connect',['webpackServer'],function() {
//connect.server({
//	root:'./src',
//  livereload: true
//});
//});
// 
//gulp.task('cssSnyc', function () {
//	console.log(14)
//gulp.src('./src/**/*.css')
//  .pipe(connect.reload());
//});
// 
//
//gulp.task('watch',['cssSnyc','connect'],function(){
//	gulp.watch(['./src/**/*.css'], ['cssSnyc']);
//})
//
//
////起一个webpack服务
//gulp.task('webpackServer',function(cb){
//	var compiler = webpack({output : {path : '/'}});
//	new WebpackDevServer(compiler, {
//	    stats: { colors: true },
//	    historyApiFallback: false,
//	    contentBase: './src',
//	    inline: true,
//	    lazy: false,
//	    hot: true,
//	    grogress: true,
//	    proxy: {
//	    	"/acc/": {
//              target: "https://192.168.162.193",
//              headers: {
//              	host : 'acc.100credit.com',
//              },
//            	secure: true,
//          }
//	    },
//	})
//	.listen(8080, 'localhost', function(err) {
//		cb(err)
//	});
//})
//
//
//gulp.task('default',['watch'])
