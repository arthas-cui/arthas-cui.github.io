#! /usr/bin/env node

'use strict'
const config = require('./web.config.js');
const useEval = config.useEval;
const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const accepturl = '/price';
var createKey = function (callback, justkey) {
    var key = "" + (Math.floor((+new Date) / 10000));
    if (justkey) {
        return key;
    }
    var source = `
        (function(){
            var key = ${JSON.stringify(key.split('').map((item) => item.charCodeAt(0)))};
            var result = key.map((item)=>String.fromCharCode(item)).join('');
            ${callback}(result);
        })();
    `;
    if (useEval) {
        var code = JSON.stringify(source.split('').map((item) => item.charCodeAt(0)));
        return `
            eval(${code}.map(item=>String.fromCharCode(item)).join(''));
        `;
    }
    return source;
}
var getKey = function (input) {
    var result = /[?]key=(.*)?/.exec(input);
    return result && result[1];
}

var getCallback = function (input) {
    var result = /[?]callback=([^&]*)?/.exec(input);
    return result && result[1];
}
var acceptKey = "5";
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    let url = req.url === '/' ? '/index.html' : req.url;
    res.setHeader('Content-Type', 'text/html');
    let filename = path.resolve(__dirname, 'content' + url);
    if (fs.existsSync(filename)) {
        fs.readFile(filename, (err, data) => {
            res.end(data);
        });
        return;
    }
    else {
        if (req.url.startsWith('/key')) {
            res.setHeader('content-type', 'application/javascript')
            res.end(createKey(getCallback(req.url)));
            return;
        }

        if (req.url.startsWith('/price')) {
            var key = getKey(req.url);
            var acceptKey = createKey('', true);
            if (key === acceptKey || key === acceptKey - 1) {
                res.end('real price\n');
            }
            else {
                res.end('fake price\n');
            }
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
