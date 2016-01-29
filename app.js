var express = require('express');
var app = express();
//var path = __dirname + '/views/';
var path = require('path')
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', function(req, res) {
   res.sendFile(path + '/index.html');
});

app.listen(3000, function() {
   console.log('Running.....');
});