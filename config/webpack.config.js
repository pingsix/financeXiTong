var webpack = require("webpack"),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	myFsOp = require('../tools/my.fs.js'),
	path = require("path");

//app dest directory
var destDir = '';

//environment assign 
var proxyNpmLifeCycleEvent;

if(Array.isArray(process.argv) && process.argv.length > 0){
	process.argv.forEach(function(item){
		if(item.indexOf('=') !== -1 && item.split('=')[0] === 'NODE_ENV'){
			proxyNpmLifeCycleEvent = item.split('=')[1];
		}
	})
}

var config = {
	entry: {
		'base': ['angular','angular-ui-router','oclazyload'],
		'common': './src/common/entry.js',
		'login': './src/login/login.entry.js',
		'main': './src/main/main.entry.js',
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name]_router.[chunkhash:8].js',
	},
	module: {
	    noParse: [],
	    loaders: [
	      { test: /\.js$/, exclude: /node_modules/, loader: 'babel',query: {presets: ['es2015']} },
	      { test: /\.html$/, loader: 'raw' },
	      { test: /\.css$/, loader: ExtractTextPlugin.extract('style','css')},
	      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass')},
	      { test: /\.(png|jpg|ico|gif)$/, loader: "file?name=/images/[name].[ext]" },
	      { test: /\.eot/,loader : 'file?prefix=font/'},
	      { test: /\.woff/,loader : 'file?prefix=font/&limit=10000&mimetype=application/font-woff'},
	      { test: /\.ttf/, loader : 'file?prefix=font/'}, 
	      { test: /\.svg/, loader : 'file?prefix=font/'}
	    ]
	},
	plugins : [
		new HtmlWebpackPlugin({
			filename: 'login.html',
			favicon: path.resolve('./src/images/favicon.ico'),
			template: 'html-withimg-loader!' + path.resolve('./src/login/login.entry.html'),
			chunks: ['login'],
			hash: true
		}),
		new HtmlWebpackPlugin({
			filename: 'main.html',
			template: 'html-withimg-loader!' + path.resolve('./src/main/main.entry.html'),
			inject: true,
			favicon: path.resolve('./src/images/favicon.ico'),
			hash: true,
			chunks: ['common','main','base'],
			chunksSortMode: function(a,b){
				var sort = {'base':1,'common':2,'main':3},
					aS = sort[a.origins[0].name],
					bS = sort[b.origins[0].name];
				
				aS && bS ? aS - bS : -1
				
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin('[name].bundle.css')
	],
//	resolve: {
//      // 模块的解析目录
//      modulesDirectories: ['br_modules', 'node_modules']
//  }
	
}


if(proxyNpmLifeCycleEvent){
	switch (proxyNpmLifeCycleEvent){
		case 'development' : 
			destDir = './build/';
			break;
			
		case 'dist' : 
			destDir = './dist/',
			config.plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress:{
                    warnings:false
                },
                mangle:false
            }))
	}
	
	//app project export directory
	config.output.path = destDir;
	
	//creat index.html file
	myFsOp.creatEnrty(path.join(destDir,'index.html'),'./login.html');
	
	//Delete the files in the dist directory，except index.html file
	myFsOp.deleteFileDire(destDir,'index.html');
}


module.exports = config;
