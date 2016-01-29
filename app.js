var express = require('express');
var app = express();
//var path = __dirname + '/views/';
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));


app.get('/', function(req, res) {
   res.sendFile('/index.html');
});

app.get('/about', function(req, res) {
   res.sendFile('/about.html')
});

app.get('/contact', function(req, res) {
   res.sendFile('/contact');
});

app.get('/research', function(req, res) {
   console.log('Research file to be completed');
});

app.get('/members', function(req, res) {
   console.log('Members to be added');
});

app.listen(3000, function() {
   console.log('Running.....');
});