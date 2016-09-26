# webpack 多页

> 通过 `vue-cli` 的 `webpack` 模板改出一个多页模板
> 学习、使用 `webpack`

## Build Setup

``` bash
# install dependencies
npm install

# localhost:8080
npm run dev
```

浏览器访问 

> http://127.0.0.1:8080/home.html
> http://127.0.0.1:8080/user.html

每个页面对应一个入口，js/html文件名相同

`build\webpack.base.conf.js` 填写 `ENTRY` 配置

```javascript
// 入口、文件
var ENTRY = {
	home: './src/home.js',
	user: './src/user.js'
}

// 直接引入文件夹，暴露在window上
var EXTERNALS = {
	'localStore': 'store'
}
```
