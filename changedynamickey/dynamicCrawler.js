#! /usr/bin/env node

var request = require('request');
var crawler = function () {
    request('http://localhost:3000/key?_=' + (+new Date), (err, res, body) => {
        request('http://localhost:3000/price?key='+body, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the Google homepage. 
            }
        })
    });
}

setInterval(crawler, 1000);
