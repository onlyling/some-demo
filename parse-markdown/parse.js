const marked = require('marked');
const minify = require('html-minifier').minify;
const path = require('path');
const fs = require('fs');
const Dir = (p) => {
    return path.join(__dirname, p);
}

const SourceDir = Dir('./source/');
const DistSir = Dir('./dist/');

// 同步使用 highlight.js 转换代码
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value
    }
});

// 查找目录下所有的 .md 文件
fs.readdirSync(SourceDir)
    .forEach((file) => {
        if ((/.md$/).test(file)) {

            let filePath = path.join(SourceDir, file);
            let fileName = file.replace(/.md$/, '');

            // 读取文件
            fs.readFile(filePath, {
                encoding: 'utf-8'
            }, (err, str) => {
                if (err) {
                    console.log('打开文件遇见错误：');
                    console.log(err);
                    console.log('----');
                    return;
                }

                // 转换成 HTML
                let HTMLString = marked(str);

                // 压缩 HTML
                HTMLString = minify(HTMLString, {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                });

                // 保存成 txt 文件
                fs.writeFile(path.join(DistSir, `${fileName}.txt`), HTMLString, 'utf8', (err) => {
                    if (err) {
                        console.log('保存文件遇见错误：');
                        console.log(err);
                        console.log('----');
                        return;
                    }

                    console.log(`解析${file}成功`);
                })

                // console.log(HTMLString);

            });

        }
    })