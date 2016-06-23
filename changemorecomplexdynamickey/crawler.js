#! /usr/bin/env node

var request = require('request');
var crawler = function () {
    request('http://localhost:3000/key?callback=test&_=' + (+new Date), (err, res, body) => {
        var key = null;
        var test = function(item){
            key=item;
        }
        eval(body);
        request('http://localhost:3000/price?key='+key, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the Google homepage. 
            }
        })
    });
}

setInterval(crawler, 1000);
