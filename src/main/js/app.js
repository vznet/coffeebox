var express = require('express');
var app = require('express').createServer();
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var sys = require('sys');
var Mustache = require('Mustache');


var PROJECT_ROOT = process.cwd();
var SRC_DIR = __dirname;
var VIEW_DIR = SRC_DIR + "/../view";
var GENDIR = PROJECT_ROOT + "/var";
var PORT = 3000;


app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});


app.get('/', function(req, res){
    console.log('reading files in %s', GENDIR);
    var view = {
        file_list: []
    }

    fs.readdir(GENDIR, function(err, files){
        for (i in files) {
            var file = files[i];

            if (!file.match(/^\..*/)) {
                view.file_list.push(file);
            }
        }

        res.send(Mustache.to_html( 
                fs.readFileSync(VIEW_DIR + "/index.html", "utf8"), 
                view));
    }); 
});

app.get('/script/', function(req, res) {
    var file = GENDIR + "/generated.js";
    var command = PROJECT_ROOT + "/bin/coffee -p " + file;

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

console.log("starting server at port %s", PORT);
app.listen(PORT);

