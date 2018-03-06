## 感谢

* 有[gank](https://github.com/OrangeXC/gank)才能让我开心的抄
* 有[segmentfault](https://segmentfault.com/)才能让我开心的抄

## 参考资料

```
|--|-- components 组件
|--|-- pages 页面
|--|-- styles 样式
|-- createListPage 创建列表页面
|-- server.js 启动文件
|-- stroe.js mobx
```

### Next.js v4.1.4 文档中文翻译

[Next.js v4.1.4 文档中文翻译](https://juejin.im/post/59f72fef518825569538ef5a)

### VSCode 开发中使用 ES7 decorators 预定义语法报错

解决方案[原文查看](https://www.cnblogs.com/lzy3366/p/6397639.html)

解决方案：

在项目根目录添加 `tsconfig.json` 文件。

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

嗯，上面这个还是不能解决。

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "allowJs": true
  }
}
```

这个可以的。

### 使用 less 写样式

参考 [with-global-stylesheet](https://github.com/zeit/next.js/tree/canary/examples/with-global-stylesheet)

`.babelrc` 文件添加一下配置。

```json
{
  "plugins": [
    [
      "module-resolver", {
        "root": ["."],
        "alias": {
          "styles": "./styles"
        },
        "cwd": "babelrc"
    }],
    [
      "wrap-in-js",
      {
        "extensions": ["css$", "less$"]
      }
    ]
  ]
}
```

项目根目录新增 `postcss.config.js` 文件。

```javascript
module.exports = {
  plugins: [
    require('postcss-easy-import')({prefix: '_'}), // keep this first
    require('autoprefixer')({ /* ...options */ }) // so imports are auto-prefixed too
  ]
}
```

重新配置 `next.config.js` 文件。

```javascript
const path = require('path')
const glob = require('glob')

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )
    return config
  }
}
```

安装新依赖。

```bash
npm i --save-dev autoprefixer babel-plugin-module-resolver babel-plugin-wrap-in-js glob less less-loader postcss-easy-import postcss-loader raw-loader
```

在项目根目录中新建一个 `styles` 文件夹。

```jsx
import layout from 'styles/layout.less'
export default () => (
	<div>
		<div>xxx</div>
		<style dangerouslySetInnerHTML={{ __html: layout }} />
	</div>
)
```
现在这样，`less` 先转成 `css` 文件，然后通过内联的方式写到页面上。

很可惜，没有找到一个方式，可以写 `less` 的同时，使用 `style-jsx` 的功能。

看上面的方式，`layout` 就是字符串，但 `<style jsx>{layout}</style>` 还是会报错。

如果 `<style jsx global>{layout}</style>` 就不会，但是也变成了内联方式。

好难好难，但现在可以愉快写 `less`，还是不错了。


### 压缩css

曲线救国方法，使用 `cssnano` 压缩。

原本在 `less` 那里就使用了 `postcss`，但 `less` 没有自带的方法压缩代码。

```bash
npm i --save-dev cssnano
```

`postcss.config.js` 文件如下

```javascript
module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }), // keep this first
    require('autoprefixer')({ /* ...options */ }), // so imports are auto-prefixed too
    require('cssnano')({ /* ...options */ }), // cssnano
  ]
}
```