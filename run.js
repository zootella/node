
var platformChildProcess = require("child_process");

function demo(name) { return process.argv[2] == "demo" && process.argv[3] == name; }
var log = console.log;
function trim(d) { return (d+"").trim(); }

/*
goals

you've got lots of command line apps that use
https://www.npmjs.com/package/keypress  to get keyboard input and
https://github.com/substack/node-charm  to update text output without scrolling

and they work great in 2 environments:
-local shell
-remote shell, obviously

get them working in 2 more environments:
-through a parent node app, using child_process
-through a webpage, using electron
*/






if (demo("child1")) { demoChild1(); }
function demoChild1() {
	log("in child, log hi");
}
/*
$ node run.js demo child1
in child, log hi
*/

if (demo("parent1")) { demoParent1(); }
function demoParent1(name) {
	log("in parent, log hi");

	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child1"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '"  + trim(d) + "'"); });
	child.on("exit",        function(d) { log("in parent, child got exit '" + trim(d) + "'"); });
}
/*
$ node run.js demo parent1
in parent, log hi
in parent, child.out got 'in child, log hi'
in parent, child got exit '0'
*/






if (demo("child2")) { demoChild2(); }
function demoChild2() {
	log("in child, log hi");

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in child, process.in got '"  + trim(d) + "'");
		if (trim(d) == "exit") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo child2
in child, log hi
message                             <- type 'message' and press Enter
in child, process.in got 'message'
exit
in child, process.in got 'exit'
in child, pausing process.in
*/

if (demo("parent2")) { demoParent2(); }
function demoParent2(name) {
	log("in parent, log hi");

	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child2"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '"  + trim(d) + "'"); });
	child.on("exit",        function(d) { log("in parent, child got exit '" + trim(d) + "'"); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '" + trim(d) + "'");//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo parent2
in parent, log hi
in parent, child.out got 'in child, log hi'
message
in parent, process.in got 'message'
in parent, child.out got 'in child, process.in got 'message''
exit
in parent, process.in got 'exit'
in parent, pausing process.in
in parent, child.out got 'in child, process.in got 'exit'
in child, pausing process.in'

TODO but then, it keeps running
*/






if (demo("child3")) { demoChild3(); }
function demoChild3() {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log(d.toString("hex"));
		if (d.toString("hex") == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo child3
61                            <- a
41                               Shift+a, produced a single byte with the ASCII value for A
1b5b337e                         Delete produces 4 bytes
1b                               Escape, which is the exit trigger
in child, pausing process.in
*/

/*
if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child3"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '"  + trim(d) + "'"); });
	child.on("exit",        function(d) { log("in parent, child got exit '" + trim(d) + "'"); });
}
*/
/*
$ node run.js demo parent3
in parent, child got exit '1'

TODO exits with an error right away
*/






if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child3"]);
	process.stdin.pipe(child.stdin);
	child.stdout.pipe(process.stdout);
}











if (demo("parent4")) { demoParent4(); }
function demoParent4(name) {
	platformChildProcess.exec("pwd", function(error, bufferOut, bufferError) {
		log("error:        " + trim(error));
		log("buffer out:   " + trim(bufferOut));
		log("buffer error: " + trim(bufferError));
	});
}
/*
$ node run.js demo parent4
error:        null
buffer out:   /Users/Name/program/node
buffer error: 
*/







/*
doesn't work, and doesn't matter
you wouldn't have been able to emulate charm on the page, anyway
use fork and messages
extend your keyboard() and stick() to act for either standard streams, or icarus custom
you can probably detect which ran you, or have a switch like $

to have icarus use nodeunit, ls, stuff like that, you don't need charm or interactive keyboard

so put this back under load
and write some demos with fork and message passing




*/









































