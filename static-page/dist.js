var fs = require('fs')
var path = require('path')
var nunjucks = require('nunjucks')

// 设置目录
nunjucks.configure(path.join(__dirname, 'views'), { // 设置模板文件的目录，为views
    // autoescape: true,
    // watch: true,
    // trimBlocks: true,
    // lstripBlocks: true
})

const deleteall = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + '/' + file
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

const createDir = (baseUrl) => {
    if (!fs.existsSync(baseUrl)) {
        fs.mkdirSync(baseUrl);
    }
}

const writeFilePrromise = (filePath, content, file) => {

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                reject(err)
            }
            console.log('ok ----> ', file)
            resolve()
        })
    })

}

let writeFilePrromises = []

const distPages = (filePath, rootUrl, index) => {
    createDir(rootUrl)

    if (fs.existsSync(filePath)) {

        fs.readdirSync(filePath)
            .forEach((file) => {

                let __thisFilePath = path.join(filePath, file)
                let __thisFile = fs.statSync(__thisFilePath)
                let __fileName = path.basename(file, '.html')

                if (__thisFile.isDirectory()) {
                    if (file != 'layout') {
                        distPages(__thisFilePath, path.join(rootUrl, file), index + 1)
                    }
                } else {
                    let __rootUrl = []
                    for (var i = 0; i < index; i++) {
                        __rootUrl.push('../')
                    }
                    let __file = fs.readFileSync(__thisFilePath)
                    let __html = nunjucks.renderString(__file.toString(), {
                        rootUrl: __rootUrl.join('')
                    })
                    writeFilePrromises.push(writeFilePrromise(path.join(rootUrl, file), __html, path.join(rootUrl, file)))
                }

            })

    }
}

// 清除已存在的发布目录
deleteall('./double')

// 创建发布目录
distPages(path.join(__dirname, 'views'), path.join(__dirname, 'double'), 1)

Promise.all(writeFilePrromises)
    .then(() => {
        console.log('发布完成')
    })
    .catch((err) => {
        console.log('发布失败')
        console.log(err)
    })