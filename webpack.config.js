var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname);
var APP_DIR = path.resolve(__dirname);

var config = {
  	entry: APP_DIR + '/main.js',
  	output: {
    	path: BUILD_DIR,
    	filename: 'index.js'
  	},
  	devServer: {
		inline: true,
		host: '0.0.0.0',
    	port: 80
   	},
   	module: {
    	loaders: [
        	{
            	test: /\.jsx?$/,
            	exclude: /node_modules/,
            	loader: 'babel-loader',
				
            	query: {
               		presets: ['es2015', 'react']
            	}
         	}
      	]
	   },
};

module.exports = config;