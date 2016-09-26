/**
 * webpack 多页
 *
 * 代码大多来自 vue-cli webpack.base.conf
 *
 * 
 */
var path = require('path')
var projectRoot = path.resolve(__dirname, '../')


var ENTRY = {
	home: './src/home.js',
	user: './src/user.js'
}

var EXTERNALS = {
	'localStore': 'store'
};


module.exports = {
	entry: ENTRY,
	output: {
		path: path.resolve(__dirname, '../dist/static'),
		publicPath: './static/',
		filename: '[name].js'
	},
	externals: EXTERNALS,
	resolve: {
		extensions: ['', '.js'],
		fallback: [path.join(__dirname, '../node_modules')],
		alias: {
			'src': path.resolve(__dirname, '../src')
		}
	},
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	module: {
		loaders: [{
			test: /\.less$/,
			loader: "style!css!less"
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015']
			}
		}]
	}
}