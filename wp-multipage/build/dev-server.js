/**
 * webpack 多页
 *
 * 代码大多来自 vue-cli dev-server
 *
 * 
 */

var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8080

var app = express()
var compiler = webpack(config)


var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
})


var hotMiddleware = require('webpack-hot-middleware')(compiler)


compiler.plugin('compilation', function(compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
		// 我猜，应该和 dev-client.js 有关系
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())


// serve webpack bundle output
app.use(devMiddleware)


// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)


// serve pure static assets
app.use('/static', express.static('./static'))


module.exports = app.listen(port, function(err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})