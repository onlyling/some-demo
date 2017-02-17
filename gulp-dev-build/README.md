# gulp、seajs、less 多页

`mobile` 是项目的代码，很久很久以前写的，代码质量不高

``` base
# install dependencies
npm install

# less -> css imagemin
npm run dev

# build for production with minification
npm run build

```

## 主要做了这些事

* `less` 文件编译成 `css` 文件，并且自动添加前缀、压缩代码
* 图片进行一个压缩
* 压缩js代码(没能合并代码，有点小遗憾)
* 给文件添加指纹戳
* 替换`html`中的文件路径，并且压缩`html`代码
* 把完整的代码发布到`mobile`文件下的`dist`文件夹