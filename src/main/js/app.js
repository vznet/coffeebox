var express = require('express');
var app = require('express').createServer();
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var sys = require('sys');
var Mustache = require('Mustache');


var PROJECT_ROOT = process.cwd();
var SRC_DIR = __dirname;
var COFFEE_SRC = PROJECT_ROOT + "/var/coffee";
var COFFEE_COMPILE = PROJECT_ROOT + "/var/compiled";
var PORT = 3000;


app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set("views", SRC_DIR + "/../view");
    app.set("view options", {layout: false});
    // token from http://bitdrift.com/post/2376383378/using-mustache-templates-in-express
    app.register(".html", {
        compile: function (source, options) {
            if (typeof source == 'string') {
                return function(options) {
                    options.locals = options.locals || {};
                    options.partials = options.partials || {};
                    if (options.body) // for express.js > v1.0
                        locals.body = options.body;
                    return Mustache.to_html(
                        source, options.locals, options.partials);
                };
            } else {
                return source;
            }
        },
        render: function (template, options) {
            template = this.compile(template, options);
            return template(options);
        }
    });
});

/**
 * index handler that displays a list of files in ``/var``
 */
app.get('/', function(req, res){
    console.log('reading files in %s', COFFEE_SRC);
    var file_list = [];

    fs.readdir(COFFEE_SRC, function(err, files){
        for (i in files) {
            var file = files[i];

            if (!file.match(/^\..*/)) {
                file_list.push(file);
            }
        }

        res.render("index.html", {
            locals: {file_list: file_list}
        });
    }); 
});

app.post('/script/', function(req, res) {
    var file = COFFEE_SRC + "/generated.js";
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

