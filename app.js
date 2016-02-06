var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport('smtps://labttsite%40gmail.com:adminlab1@smtp.gmail.com');
 
// setup
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "labttsite@gmail.com",
       pass: "adminlab1"
   }
});



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

app.get('/publications', function(req, res) {
   res.sendFile(return_path('publications.html'));
});

app.get('/projects', function(req, res) {
   res.sendFile(return_path('publications.html'));
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

app.get('/events/data',function(req,res){
  res.sendFile(return_data('events_data.json'));
})

app.get('/pdf/:name',function(req,res){
  var name = req.params['name'];
  res.contentType("application/pdf");
  res.sendFile(return_pdf(name))
})

app.get('/recent/:number',function(req, res){
  var num = parseInt(req.params['number']);
  var fs = require('fs');
  fs.readFile('data/research_data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var arr = []
    for(var name in obj){
      var mod_obj = obj[name];
      mod_obj['name'] = name;
      var date_data = obj[name]['time'].split('/');
      mod_obj['time'] = new Date(parseInt(date_data[2]),parseInt(date_data[1]),parseInt(date_data[0]));
      arr.push(mod_obj);
    }
    arr.sort(function(a,b){
      return new Date(b.time) - new Date(a.time);
    })
    var re_arr=[];
    for(var i = 0; i<num; i++){
      re_arr.push(arr[i]);
    }
    res.send(re_arr);
  });
})

app.post('/request',function(req, res){
  var request = {};
  request['name'] = req.body.name;
  request['phone'] = req.body.phone;
  request['email'] = req.body.email;
  request['type'] = req.body.type;
  request['desc'] = req.body.desc;
  var message = 'Description:\n' + request['desc'] + '\n\n' + 'Contact Info:\n' +'phone:'+request['phone']+ '\nemail:'+ request['email'];
  
  var mailOptions = {
    from: request['name'], // sender address 
    to: 'boodhoo100@gmail.com', // list of receivers 
    subject: 'Request ['+request['type']+']', // Subject line 
    text: message // plaintext body  
   // send mail with defined transport object 
  };
 
  // send mail with defined transport object 
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
})

app.listen(3000, function() {
   console.log('Running.....');
});