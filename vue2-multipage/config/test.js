var fs = require('fs');
var path = require('path');

var pages = []

fs.readdirSync(__dirname + '/../')
    .filter((file) => {
        return (/\.html$/g).test(file)
    })
    .forEach((file) => {
        console.log(file)
        pages.push(file.replace(/\.html$/g, ''))
    })

console.log(pages)