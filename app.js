var express = require('express');
var app = express();
//var path = __dirname + '/views/';
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));

function return_path(filename) {
    return path.join(__dirname, 'views', filename);
}

app.get('/', function(req, res) {
   res.sendFile('/index.html');
});

app.get('/about', function(req, res) {
   res.sendFile(return_path('about.html'));
});

app.get('/contact', function(req, res) {
   res.sendFile(return_path('contact.html'));
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