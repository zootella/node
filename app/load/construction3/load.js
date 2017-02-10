console.log("load\\");


var platformDisk = require("fs");


// Load all the code files that make up the program, listing the main, core, and test functions
function _load() {

	// Add the functions in source object l like {name1, name2} to each object in a like [cores, global] careful to not overwrite anything
	function _loadCopy(l, a) {
		var k = Object.keys(l);
		for (var i = 0; i < k.length; i++) { // Loop for each named function in l, the source object
			var n = k[i]; // Source name
			var f = l[n]; // Source function
			if (n == "" || n == "exports" || n == "module" || n == "require") { throw new Error("reserved: '" + n + "'"); } // Check the name
			for (var j = 0; j < a.length; j++) { // Loop for each destination object in a, the array of destinations
				var o = a[j]; // Destination object
				if (o[n] === undefined) { o[n] = f; } // Name available, add the function there
				else { throw new Error("duplicate: '" + n + "'"); } // Throw instead of overwriting
			}
		}
	}
	// Given n like "name a b", compose a unique name for adding to o like "test[name a b]2"
	function _loadName(n, o) {
		n = "test[" + n + "]";
		var i = 1;
		function compose(n, i) { return i == 1 ? n : n + i; } // Stick 2 or 3 on the end if necessary
		while (o[compose(n, i)] !== undefined) i++; // Loop until we find a unique name
		return compose(n, i);
	}

	// Keep references to all the program's main, core, demo, and test functions
	var mains = {}; // Entry points to run an entire program
	var cores = {}; // Useful library functions that bring code to a very high level
	var demos = {}; // Demonstrations of the functionality and use of the core library TODO
	var tests = {}; // Automated unit tests of the core library

	// Prepare the single expose object that we'll pass into every container
	var expose = {};
	expose.main = function(n, f) { var l = {}; l[n]                   = f;                                          _loadCopy(l, [mains]);                }
	expose.core = function(l)    {                                                                                  _loadCopy(l, [cores, global]);        }
	expose.test = function(n, f) { var l = {}; l[_loadName(n, tests)] = (function(t) { f(t.ok, t.done, t.fail); }); _loadCopy(l, [tests, remoteExports]); }
	function contain(container) { container(expose); } // Pass the same expose object into each container
	_loadCopy({contain, _loadCopy, _loadName}, [cores, global]); // Load these core functions for use and testing

	//TODO omit when you have pop quiz
	var remoteExports;
	expose.setExports = function(e) { remoteExports = e; }
	//TODO omit in single file
	var d = platformDisk.readdirSync("./");
	for (var i = 0; i < d.length; i++) {
		if (d[i].endsWith(".main.js") || d[i].endsWith(".core.js") || d[i].endsWith(".demo.js") || d[i].endsWith(".test.js")) {
			require("./" + d[i]);
		}
	}

	// Run a main named on the command line like $ node load main name
	if (process.argv.length > 2 && process.argv[2] == "main") {
		if (process.argv.length > 3 && mains[process.argv[3]] !== undefined) {
			setImmediate(function() { // Run after the rest of the code below in this file does
				mains[process.argv[3]]();//TODO maybe pass command line arguments as function arguments
			});
		} else { throw new Error("unknown main"); }
	}
}
_load();








/*
still to do

-looploader, done
-mainrunner, done
-electron integration, easy, just run icarus from construction3 and you've got it

main.js -> electron.js
page.js -> load.js

then you have a working prototype

git commit - working container prototype and notes

-cleanup
delete and distill files and notes
lots of stuff can be collapsed flat now
pull non actual files from the root to a folder
make instructions somewhere how to setup a live reload static html page, you'll want to do that for css experiments

git commit - before containers

-merge the prototype into the root

git commit - after containers

then make familiar spirit
maybe with tape even though it's in a separate process



*/











console.log("load/");