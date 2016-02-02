var express = require('express');
var app = express();
//var path = __dirname + '/views/';
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'data')));

function return_path(filename) {
    return path.join(__dirname, 'views', filename);
}

function return_data(filename) {
	return path.join(__dirname,'data',filename)
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
   res.sendFile(return_path('research.html'));
});

app.get('/members', function(req, res) {
   res.sendFile(return_path('members.html'));
});

app.get('/research/data',function(req,res){
	res.sendFile(return_data('research_data.json'));
})

app.get('/members/data',function(req,res){
	res.sendFile(return_data('members_data.json'));
})

app.listen(3000, function() {
   console.log('Running.....');
});