var express = require('express');
var app = express();
//var path = __dirname + '/views/';
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'images')));

function return_path(filename) {
    return path.join(__dirname, 'views', filename);
}

function return_data(filename) {
  return path.join(__dirname,'data',filename)
}

function return_pdf(filename) {
  return path.join(__dirname,'pdfs',filename)
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

app.get('/pdf/:name',function(req,res){
  var name = req.params['name'];
  res.contentType("application/pdf");
  res.sendFile(return_pdf(name))
})

app.get('/recent/:number',function(req, res){
  var num = parseInt(req.params['name']);
  var fs = require('fs');
  fs.readFile('data/research_data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var arr = []
    for(var name in obj){
      var mod_obj = obj[name];
      mod_obj['name'] = name;
      var date_data = obj[name]['time'].split('/');
      mod_obj['time'] = new Date(date_data[0],date_data[1],date_data[2]);
      arr.push(mod_obj);
    }
    res.send(arr);
  });
})

app.listen(3000, function() {
   console.log('Running.....');
});