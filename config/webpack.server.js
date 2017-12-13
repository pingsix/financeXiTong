var webpack = require("webpack");

var config = {
	entry: {},
	output: {},
	devServer: {
      	protocol: "https",
     	host: 'accms2.100credit.com',
     	port: '4000',
     	contentBase: "./build",
	 	stats: { colors: true },
   		historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        proxy: {
            "/acc/": {
                target: "https://192.168.23.60",
                headers: {
                	host : 'acc.100credit.com',
                },
              	secure: true,
            }
        },
   }
}


module.exports = config;