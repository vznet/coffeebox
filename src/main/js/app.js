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

/**
 * request a user-written coffee file
 */
app.get(/^\/script\/([^\.]+\.coffee)$/, function(req, res) {
    var coffee_file = COFFEE_SRC + "/" + req.params[0];

    console.log("reading coffee file %s", coffee_file);
    res.end(fs.readFileSync(coffee_file, "utf8"));
});

/**
 * request a compiled coffee file
 */
app.get(/^\/script\/([^\.]+\.js)$/, function(req, res) {
    var js_file = COFFEE_COMPILE + "/" + req.params[0];

    console.log("reading js file %s", js_file);
    require(js_file);
});

/**
 * write a coffee file by POST
 */
app.post('/script/', function(req, res) {
    var file = COFFEE_SRC + "/generated.js";
    var command = PROJECT_ROOT + "/bin/coffee "
            + " -o " + PROJECT_ROOT + "/var/compiled/ "
            + " -c " + + PROJECT_ROOT 
            + " " + file;

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

console.log("starting server at port %s", PORT);
app.listen(PORT);

