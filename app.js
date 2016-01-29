var express = require('express');
var app = express();
var path = __dirname;


app.get('/', function(req, res) {
   res.sendFile(path + '/index.html');
});

app.listen(3000, function() {
   console.log('Running.....');
});