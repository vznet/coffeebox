var express = require('express');
var app = require('express').createServer();
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var sys = require('sys')

var BASEDIR = process.cwd();
var GENDIR = BASEDIR + "/var";

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/', function(req, res){
  res.send('Server is up and running');

});

app.get('/script/', function(req, res) {
    var file = GENDIR + "/generated.js";
    var command = BASEDIR + "/bin/coffee -p " + file;

    fs.writeFile(file, "square = (x) -> x * x", function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file %s was saved!", file);
        }
    }); 

    console.log('execute "%s"', command);
    child = exec(command, function (error, stdout, stderr) {
        sys.print('generated: \n', stdout);
        if (error !== null) {
            sys.print('stderr: ' + stderr);
            console.log('exec error: ' + error);
        }
    });
});

app.get('/static/*', function(req, res){
  
	// switch header by extension
	if(req.url.substring(req.url.lastIndexOf("."),req.url.length) == ".html") {
		res.writeHead(200, {'Content-Type': 'text/html'});
	} else {
		res.writeHead(200, {'Content-Type': 'text/javascript'});
	}

	console.log(req.url.substring(8,req.url.length));
	fs.readFile("src/app/static/" + req.url.substring(8,req.url.length), "UTF-8",function (err, data) {
	  	if (err) throw err;		
		res.end(data + "\n");
	});	
});

console.log('Basedir: %s', BASEDIR);
app.listen(3000);

