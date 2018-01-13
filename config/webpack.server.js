var webpack = require("webpack");

var config = {
	entry: {},
	output: {},
	devServer: {
      protocol: "http",
     	host: '127.0.0.1',
     	port: '80',
     	contentBase: "./build",
	 	  stats: { colors: true },
   		historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        proxy: {
            "/acc/": {
                // target: "http://192.168.1.202",
               target: "http://192.168.1.55:8080",
                headers: {
                	host : 'acc.juncai360.com',
                },
              	secure: true,
            }
        },
   }
}
module.exports = config;
