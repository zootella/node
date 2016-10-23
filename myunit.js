
var reporter = require('nodeunit').reporters.default;
var fs = require('fs');

var files = fs.readdirSync('.');
var testFiles = files.filter((name) => { return name.match(/_test/); });

reporter.run(testFiles);

//reporter.run(["text_test.js"]);

/*

run a demo with node and electron command line

$ node environment_test.js demo platform
$ ./electron/win/electron.exe environment_test.js demo platform

run tests with node, nodeunit, and electron command line

$ node nodeunit.js
$ node_modules/nodeunit/bin/nodeunit *_test.js
$ ./electron/win/electron.exe nodeunit.js

the electron command line ones work, but you have to control+c to close them

*/



