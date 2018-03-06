## 槽点

开发过程重新打包太慢了，和 `next.js` 不是一个等级的。

## 构建配置

### vendor

把不常改动的库添加到单独打包的公共文件。

打包到 `common` 文件，默认添加 `vue`、`vue-router`、`vue-meta` 等

```javascript
module.exports = {
  build: {
    vendor: ['isomorphic-fetch']
  }
}
```

## 其他

页面重复度很大，写了一个函数。