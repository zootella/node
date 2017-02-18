console.log("load\\");
console.log("process.pid " + process.pid + ", __filename " + __filename);
function load() {

/**
welcome, describe this program
describe this file, assembly instructions

bundler wraps and formats contents of these double star blocks
markdown-like syntax turns them into nice html in the program
**/

var identity = {};
identity.name = "zootella";
identity.line = "----------------------------------------";
identity.hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709"; // Remove this line to check this hash
identity.line = "----------------------------------------";
identity.date = 20171001;

identity["package.json"] = `
{
	"name": "zootella",
	"main": "zootella.js",
	"dependencies": {
		"bignumber.js": "^2.3.0",
		"bluebird": "^3.4.1",
		"charm": "^1.0.1",
		"chokidar": "^1.6.1",
		"handlebars": "^4.0.5",
		"jquery": "^3.1.0",
		"keypress": "^0.2.1",
	}
}
`;

identity["index.html"] = `
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>zootella</title>
		<script type="text/javascript" src="zootella.js"></script>
	</head>
	<body>
	</body>
</html>
`;

//core modules
var required = {};
required.child_process = require("child_process");
required.crypto        = require("crypto");
required.events        = require("events");
required.fs            = require("fs");
required.path          = require("path");
required.stream        = require("stream");
required.util          = require("util");

//third party
required.bignumber_js = require("bignumber.js");
required.bluebird     = require("bluebird");
required.chokidar     = require("chokidar");
required.handlebars   = require("handlebars");

//electron and jquery
var $;//leave undefined if we don't have a page
if (typeof process.versions.electron == "string") {
	required.electron = require("electron");//load electron if its here
	if (process.type == "renderer") {
		$ = require("jquery");//load jquery if we have a page
	}
}

// Add the functions in l like {name1, name2} to each object in a like [cores, global] careful to not overwrite anything
function loadCopy(l, a) {
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

// Add method function f to prototype p as a method with name n
function methodCopy(n, f, p) {
	if (n in p) throw new Error("duplicate: '" + n + "'"); // Don't overwrite an existing method
	Object.defineProperty(p, n, { enumerable: false, value: f }); // Link f under the new name n
}

// Given functions in l like f(s, a2) add methods to prototype p like s.n(a2)
function methodMake(l, p) {
	var k = Object.keys(l);
	for (var i = 0; i < k.length; i++) { // Loop for each named function in l, the source object
		var n = k[i]; // Name of function, and for method
		var f = l[n]; // Source function our new method will call
		if (n in p) throw new Error("duplicate: '" + n + "'"); // Don't overwrite an existing method
		function m() { // Define the method function we'll add to p, which will call f
			var a = []; // Prepare arguments for our call to f
			var a1 = this; // The first argument is this array or string we're adding a new method to
			if (p === String.prototype) a1 = a1+""; // Inside a string, this is actually an array of characters
			a.push(a1);
			for (var j = 0; j < arguments.length; j++) a.push(arguments[j]); // Add the method's arguments
			return f.apply(this, a); // Calling s.n(a2) calls f(s, a2) and returns the result
		}
		Object.defineProperty(p, n, { enumerable: false, value: m });
	}
}

//TODO
function exposeTest(n, f) {

}

//TODO remove with $ node load test
function nameTest(n, o) {
	n = 'test "' + n + '"';
	var i = 1;
	function compose(n, i) { return i == 1 ? n : n + " (" + i + ")"; } // Stick 2 or 3 on the end if necessary
	while (o[compose(n, i)] !== undefined) i++; // Loop until we find a unique name
	return compose(n, i);
}

//arguments
var arguments;
if (!required.electron) {//shell
	arguments = process.argv;
} else {
	if (!$) {//browser
		arguments = process.argv;
		loadCopy({electronArguments:process.argv}, [global]);    
	} else {//renderer
		arguments = required.electron.remote.getGlobal("electronArguments");
	}
}

// Keep references to all the program's main, core, demo, and test functions
var mains = {}; // Entry points to run an entire program
var cores = {}; // Useful library functions that bring code to a very high level
var tests = []; // Automated unit tests of the core library TODO $ node load test

// Prepare the single expose object that we'll pass into every container
var expose = {};
expose.main              = function(n, f)    { loadCopy({[n]:f}, [mains]);      }
expose.core              = function(l)       { loadCopy(l, [cores, global]);    }
expose.methodOnPrototype = function(n, f, p) { methodCopy(n, f, p);             }
expose.methodOnString    = function(l)       { methodMake(l, String.prototype); }
expose.methodOnArray     = function(l)       { methodMake(l, Array.prototype);  }
expose.test              = function(n, f)    { exposeTest(n, f);                }
function contain(container) { container(expose); } // Pass the same expose object into each container
expose.core({identity, required, $, arguments, contain, loadCopy, nameTest}); // Expose the core functions defined here in load

//load the containers in this file
containers();

//load the containers in neighboring files
var d = required.fs.readdirSync("./");
for (var i = 0; i < d.length; i++) {//loop through all the files next to this one
	if (d[i].endsWith(".main.js") || d[i].endsWith(".core.js") || d[i].endsWith(".demo.js") || d[i].endsWith(".test.js")) {
		require("./" + d[i]);
	}
}

//setup electron
if (required.electron) {
	if (!$) {
		if (mains["electron-browser"]) mains["electron-browser"]();
	} else {
		if (mains["electron-renderer"]) mains["electron-renderer"]();
	}
}

//run a main
if (!required.electron || $) {
	if (mains["snip"]) {
		mains["snip"]();
	} else if (mains["main"]) {
		mains["main"]();
	} else if (arguments.length > 2 && arguments[2] == "test") {
		mains["test"]();
	} else if (arguments.length > 2 && arguments[2] == "main") {
		if (arguments.length > 3 && mains[arguments[3]]) {
			var a = [];
			for (var i = 4; i < arguments.length; i++) a.push(arguments[i]);
			mains[arguments[3]].apply(this, a);
		} else {
			throw new Error("main not found: '" + arguments[3] + "'");		
		}
	}
}

}
load();
function containers() {

//PASTE TARGET

}
console.log("load/");