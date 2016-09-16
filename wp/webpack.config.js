/**
 * webpack 配置文件
 * @type {Object}
 * 
 * 学习地址 http://webpack.toobug.net/zh-cn/
 * 
 */
module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: './static',
        filename: '[name].js'
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