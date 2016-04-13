var express = require('express');
var app = express();
var fs = require('fs');

var _ = require("lodash");





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
app.use(express.static(path.join(__dirname, 'isp')));

var file_name = "data.db";
var sqlite3 = require("sqlite3").verbose();
var db_path = path.join(__dirname, 'isp', file_name);
var exists = fs.existsSync(db_path);


function return_path(filename) {
    return path.join(__dirname, 'views', filename);
}

function return_data(filename) {
  return path.join(__dirname,'data',filename)
}

function return_pdf(filename) {
  return path.join(__dirname,'pdfs',filename)
}

app.get('/isp-perf', function(req, res) {
  res.sendFile('./bar.png');
});

app.get('/isp', function(req, res) {
   res.send('under construction');
});

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
   res.sendFile(return_path('projects.html'));
});

app.get('/projectSingle', function(req, res) {
   res.sendFile(return_path('projectSingle.html'));
});

app.get('/members', function(req, res) {
  res.sendFile(return_path('members.html'));
});

app.get('/tasks', function(req, res) {
  res.sendFile(return_path('tasks.html'));
});

app.get('/research/data',function(req,res){
  res.sendFile(return_data('research_data.json'));
});

app.get('/projects/data',function(req,res){
  res.sendFile(return_data('projects_data.json'));
});

app.get('/members/data',function(req,res){
  res.sendFile(return_data('members_data.json'));
});

app.get('/events/data',function(req,res){
  res.sendFile(return_data('events_data.json'));
});

app.get('/pdf/:name',function(req,res){
  var name = req.params['name'];
  res.contentType("application/pdf");
  res.sendFile(return_pdf(name))
});

app.get('/isps', function(req, res) {

    res.sendFile(return_path('isps.html'));

});

app.get('/isp-performance', function(req, res) {
    console.log('Sending performance');
    var stmnt = 'SELECT ISP, METRIC, DATERECORDED FROM DATA WHERE ';
    stmnt += "DATERECOREDED BETWEEN date('now', '-3 months') AND CURRENT_DATE;";
    console.log(stmnt);
    if(!exists) {
        console.log('Database does not exist!');
        console.log(db_path);
    } else {
        var db = new sqlite3.Database(db_path);
        //res.send('jsidjsidi');
        db.all(stmnt, function(err, rows) {
            if(err) {
                console.log('ERROR');
                res.send({});
            }
            if(rows) {
                var docs = {};
                var by_isp = _.groupBy(rows, function(row) {
                    return row.ISP.toUpperCase();
                });
                console.log(by_isp);
                for(var key in by_isp) {
                    if(by_isp.hasOwnProperty(key)) {
                        //console.log(key);
                        //console.log(by_isp[key]);
                        docs[key] = _.map(by_isp[key], 'METRIC');
                    }
                }
                res.send(docs);
            } else {
                res.send({});
            }
        });
        db.close();
    }
});

app.get('/recent/:number',function(req, res){
  var num = parseInt(req.params['number']);
  var fs = require('fs');
  fs.readFile('data/projects_data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var arr = [];
    for(var name in obj){
      var mod_obj = obj[name];
      mod_obj['name'] = name;
      // var date_data = obj[name]['time'].split('/');
      // mod_obj['time'] = new Date(parseInt(date_data[2]),parseInt(date_data[1]),parseInt(date_data[0]));
      arr.push(mod_obj);
    }
    /*arr.sort(function(a,b){
      return new Date(b.time) - new Date(a.time);
    })*/
    

    function randI(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function isIn(val, arr){
      for( var i=0; i<arr.length; i++)
        if(val == arr[i])
          return 1;
        return 0;
    }
    var rand_i=[], i=0, send=[];
    while( i<num){
      var ri = randI(0,arr.length-1);
      if( !isIn(ri,rand_i) ){
        rand_i.push(ri);
        send.push(arr[ri]);
        i++;
      }
    } 
    res.send(send);
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
    to: 'phosein60@gmail.com', // list of receivers
    subject: 'Request ['+request['type']+']', // Subject line
    text: message // plaintext body
   // send mail with defined transport object
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        res.send('{"status":"error"}');
      }
      console.log('Message sent: ' + info.response);
      res.send('{"status":"success"}');
  });
})

app.listen(1337, function() {
   console.log('Running.....');
});
