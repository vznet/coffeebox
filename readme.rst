.. vim: set filetype=rst :

Coffeescript Prototype
======================

Setup A Working Environment
---------------------------

::

    python bootstrap.py
    bin/buildout -vN


Develop & Run
-------------

Manually start NodeJS::

    bin/node src/main/js/app.js

and check http://localhost:3000/


Resources
.........

Go reading to 
http://jashkenas.github.com/coffee-script/
http://expressjs.com/guide.html
http://bitdrift.com/post/2376383378/using-mustache-templates-in-express


Test The Coffee Compiler
........................

::
    $ bin/coffee -p src/main/coffee/test.coffee

    (function() {
      var square;

      square = function(x) {
        return x * x;
      };

    }).call(this);


Force Reinstall
---------------

In case you broke your sandbox or want to install the binaries from scratch
do this::

    rm -rf parts bin .installed.cfg && python bootstrap.py && bin/buildout -vN

This will keep your sources and rebuild all.
