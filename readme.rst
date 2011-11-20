.. vim: set filetype=rst :

Coffeescript Prototype
======================

Setup A Working Environment
---------------------------

::

    python bootstrap.py
    bin/buildout -vN

Please check your interactive part at (you need to type "yes" here)::

    This script will find and eliminate any shims, symbolic
    links, and other cruft that was installed by npm 0.x.

    Is this OK? enter 'yes' or 'no' 


Develop & Run
-------------

and check the running instance by::

    bin/supervisorctl status

(stop it via ``bin/supervisorctl shutdown``)

Go reading to http://jashkenas.github.com/coffee-script/

Force Reinstall
---------------

In case you broke your sandbox or want to install the binaries from scratch
do this::

    rm -rf parts bin .installed.cfg && python bootstrap.py && bin/buildout -vN

This will keep your sources and rebuild all.
