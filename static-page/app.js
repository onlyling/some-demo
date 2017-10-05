var http = require('http'); // Http服务器API
var fs = require('fs'); // 用于处理本地文件
var server = new http.Server(); // 创建新的HTTP服务器
var path = require('path');
var nunjucks = require('nunjucks')

// 设置目录
nunjucks.configure(path.join(__dirname, 'views'), { // 设置模板文件的目录，为views
    // autoescape: true,
    watch: true,
    // trimBlocks: true,
    // lstripBlocks: true
})


server.listen(8000); // 监听端口8000

console.log('http://127.0.0.1:8000')

server.on('request', function (request, response) {

    var url = require('url').parse(request.url);

    switch (url.pathname) {
        case '' || '/': // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
            fs.readFile('./index.html', function (err, content) {
                if (err) {
                    response.writeHead(404, {
                        'Content-Type': 'text/html; charset="UTF-8"'
                    });

                    response.write(err.message);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=UTF-8'
                    });
                    response.write(content);
                    response.end();
                }
            });
            break;
        default: // 处理来自本地目录的文件
            var filename = url.pathname.substring(1); // 去掉前导'/'
            var fileType = filename.substring(filename.lastIndexOf('.') + 1)
            var type = getType(fileType);
            // 异步读取文件,并将内容作为单独的数据模块传给回调函数
            // 对于确实很大的文件,使用流API fs.createReadStream()更好
            fs.readFile(filename, function (err, content) {
                if (err) {
                    response.writeHead(404, {
                        'Content-Type': 'text/html; charset="UTF-8"'
                    });
                    response.write(err.message);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': type
                    });
                    if (fileType === 'html') {
                        content = nunjucks.renderString(content.toString(), {
                            rootUrl: '/'
                        });
                    }
                    response.write(content);
                    response.end();
                }
            });
            break;
    }

})

function getType(endTag) {
    var type = null;
    switch (endTag) {
        case 'html':
        case 'htm':
            type = 'text/html; charset=UTF-8';
            break;
        case 'js':
            type = 'application/javascript; charset="UTF-8"';
            break;
        case 'css':
            type = 'text/css; charset="UTF-8"';
            break;
        case 'txt':
            type = 'text/plain; charset="UTF-8"';
            break;
        case 'manifest':
            type = 'text/cache-manifest; charset="UTF-8"';
            break;
        default:
            type = 'application/octet-stream';
            break;
    }
    return type;
}