#! /usr/bin/env node

'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const accepturl = '/price';
var createKey = function () {
    return ""+(Math.floor((+new Date) / 10000));
}
var getKey = function (input) {
    var result = /[?]key=(.*)?/.exec(input);
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
            res.end(createKey());
            return;
        }

        if (req.url.startsWith('/price')) {
            var key = getKey(req.url);
            var acceptKey = createKey();
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
