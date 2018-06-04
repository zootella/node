//console.log("load\\");
console.log(`process.pid ${process.pid}
__filename ${__filename}
__dirname  ${__dirname}`);
//arguments (${process.argv.length}) ${process.argv}`);
function load() {

/**
 ____________________
| |zootella        | |
|.|________________|H|
| |________________| |
| |________________| |
| |________________| |
| |________________| |
| |________________| |
|                    |
|    ____________    |
|   |   |  _     |   |
|   |   | | |    |   |
|   |   | |_|    | V |
|___|___|________|___|

TODO welcome, describe this program
describe this file, assembly instructions

bundler wraps and formats contents of these double star blocks
markdown-like syntax turns them into nice html in the reader app within the program
don't do a reader for the browser, on the web it's just this raw .txt file and ctrl+f
**/

// The name of this program, the hash of this file, and the date when I made it
var identity = {};
identity.name = "zootella";
identity.line = "----------------------------------------";
identity.hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709"; // Remove this line to check this hash
identity.line = "----------------------------------------";
identity.date = 20171001; // Year, month and day

// Text for the file named package.json alongside this one, listing the node modules from npm the code here uses
identity["package.json"] = `
{
	"name": "zootella",
	"version": "0.1.0",
	"license": "UNLICENSED",
	"description": "TODO",
	"repository": {
		"type": "git",
		"url": "https://github.com/zootella/node"
	},
	"main": "zootella.js",
	"scripts": {
		"electron-version": "electron --version",
		"electron-interactive": "electron -i",
		"electron-empty": "electron",
		"electron-here": "electron .",
		"electron-load": "electron load.js"
	},
	"dependencies": {
		"bignumber.js": "^2.3.0",
		"bluebird": "^3.5.1",
		"chokidar": "^2.0.3",
		"jquery": "^3.3.1",
		"vue": "^2.5.16"
	},
	"devDependencies": {
		"blessed": "^0.1.81",
		"charm": "^1.0.2",
		"electron": "^1.8.6",
		"keypress": "^0.2.1",
		"q": "^1.5.1"
	}
}
`;

// Text for the file named index.html alongside this one, a blank Web page Electron will open and jQuery will change
identity["index.html"] = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>zootella</title>
	</head>
	<body>
		<div id="page"></div>
		<script type="text/javascript" src="load.js"></script>
	</body>
</html>
`;

// Load the node core modules we need
var required = {}; // Make an object to hold all the modules we required
required.child_process = require("child_process");
required.crypto        = require("crypto");
required.events        = require("events");
required.fs            = require("fs");
required.path          = require("path");
required.stream        = require("stream");
required.util          = require("util");

// Load some npm modules from package.json, others we'll require as the code runs
required.bignumber_js = require("bignumber.js");
required.bluebird     = require("bluebird");
required.chokidar     = require("chokidar");
required.vue          = require("vue/dist/vue.js"); // Reach the build of Vue with the template compiler

// Load Electron and jQuery if this process can use them
if (runByElectron()) required.electron = require("electron");
if (runByElectronRenderer()) required.jquery = require("jquery");

// Find out what's running us
function runByNode()             { return typeof process.versions.electron != "string"  } // Command line Node
function runByElectron()         { return typeof process.versions.electron == "string"  } // Electron
function runByElectronMain()     { return runByElectron() && process.type != "renderer" } // Electron's main or browser process, that has no page
function runByElectronRenderer() { return runByElectron() && process.type == "renderer" } // An Electron renderer process, with a page

// Copy the references in l like {name1, name2} to each object in a like [cores, global] careful to not overwrite anything
function copyAllToEach(l, a) {
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

// Given functions in l like f name(mystring, arg1, arg2) add methods to prototype p like mystring.name(arg1, arg2)
function makeMethods(l, p) {
	var k = Object.keys(l);
	for (var i = 0; i < k.length; i++) { // Loop for each named function in l, the source object
		var n = k[i]; // Name of function, and for method
		var f = l[n]; // Source function our new method will call
		make(n, f, p); // Each call to make() will capture the next f in its closure
	}
	function make(n, f, p) { // Given function f named n, add it as a method to prototype p
		function method() { // Define the method function we'll add to p, which will call f
			var a = []; // Prepare arguments for our call to f
			var a1 = this; // The first argument is this array or string we're adding a new method to
			if (p === String.prototype) a1 = a1+""; // Inside a string, this is actually an array of characters
			a.push(a1);
			for (var j = 0; j < arguments.length; j++) a.push(arguments[j]); // Add the method's arguments
			return f.apply(this, a); // Calling s.n(a1, a2) calls f(s, a1, a2) and returns the result
		}
		copyMethod(n, method, p); // Add the new method we made
	}
}

// Add f to prototype p as a method with name n
function copyMethod(n, f, p) {
	if (n in p) throw new Error("duplicate: '" + n + "'"); // Don't overwrite an existing method
	Object.defineProperty(p, n, { enumerable: false, value: f }); // Link f under the new name n
}

//TODO
function exposeTest(n, f) {

}

//TODO remove with $ node load.js test
function nameTest(n, o) {
	n = 'test "' + n + '"';
	var i = 1;
	function compose(n, i) { return i == 1 ? n : n + " (" + i + ")"; } // Stick 2 or 3 on the end if necessary
	while (o[compose(n, i)] !== undefined) i++; // Loop until we find a unique name
	return compose(n, i);
}

// Get the command line arguments
var processArguments;
if (runByNode()) {
	processArguments = process.argv;
} else if (runByElectronMain()) {
	processArguments = process.argv;
	global.electronArguments = process.argv; // Share the arguments through global so the code below can pick them up
} else if (runByElectronRenderer()) {
	processArguments = required.electron.remote.getGlobal("electronArguments"); // Get the shared arguments
}
//TODO maybe try to switch to index.html?arguments

// Keep references to all the program's main, core, demo, and test functions
var mains = {}; // Entry points to run an entire program
var cores = {}; // Useful library functions that bring code to a very high level
var tests = []; // Automated unit tests of the core library TODO $ node load.js test

// Prepare the single expose object that we'll pass into every container
var expose = {};
expose.main              = function(n, f)    { copyAllToEach({[n]:f}, [mains]);   }
expose.core              = function(l)       { copyAllToEach(l, [cores, global]); }
expose.methodOnPrototype = function(n, f, p) { copyMethod(n, f, p);               }
expose.methodOnString    = function(l)       { makeMethods(l, String.prototype);  }
expose.methodOnArray     = function(l)       { makeMethods(l, Array.prototype);   }
expose.test              = function(n, f)    { exposeTest(n, f);                  }
function contain(container) { container(expose); } // Pass the same expose object into each container
expose.core({runByNode, runByElectron, runByElectronMain, runByElectronRenderer}); // Let all our code reach this useful stuff
expose.core({identity, required, processArguments, contain, copyAllToEach, nameTest});

// Load the containers in this file
containers();

// Load the containers in any neighboring files
var d = required.fs.readdirSync("./"); // List the files in the folder node or Electron started us in
for (var i = 0; i < d.length; i++) { // Loop through each file name
	if (d[i].endsWith(".main.js") || d[i].endsWith(".core.js") || d[i].endsWith(".demo.js") || d[i].endsWith(".test.js")) {
		require("./" + d[i]); // If the file has an ending we recognize, run the contents, which will call contain() above
	}
}
//TODO don't do this if all the code is bundeled into this single file

// If Electron is running us, set it up
if (runByElectronMain()) {
	var win; // Keep a reference to the window object so it's not garbage collected, which would close the window
	required.electron.app.on("ready", function() { // Electron has finished starting and is ready to make windows
		win = new required.electron.BrowserWindow({width: 900, height: 1100}); // Create the browser window
		win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
		win.webContents.openDevTools(); // Open the developer tools
		win.on("closed", function() { // The user closed the window
			win = null; // Discard our reference to the window object
		});
	});
	required.electron.app.on("window-all-closed", function() { // All the windows are closed
		required.electron.app.quit();
	});
}
//TODO previously, this was elsewhere, but always the code

// Now that everything's loaded, run a main function, the entry point to the program this code is about
if (runByNode() || runByElectronRenderer()) { // Do this if node is running us, or for the Electron process that has a page
	if (processArguments.length > 2 && processArguments[2] == "main") { // Run the main named by the command $ node load.js main ~name~
		if (processArguments.length > 3 && mains[processArguments[3]]) { // The name is the fourth argument, 3 arguments in from the start
			var mainName = processArguments[3];
			var a = [];
			for (var i = 4; i < processArguments.length; i++) a.push(processArguments[i]); // Collect any arguments from the command line after that
			if (runByNode()) m();
			else if (runByElectronRenderer()) required.jquery(document).ready(m()); // Wait for the DOM to be ready
			function m() { mains[mainName].apply(this, a); } // Call the main, giving it any additional arguments
		} else {
			throw new Error("main not found: '" + processArguments[3] + "'");
		}
	}
}
//TODO run the tests on $ node load.js test

} // This is the end of the load() function we defined at the start of this file
load(); // Now that we've defined it, run it
function containers() { // Halfway through the load() function, it'll call this containers() function to run the rest of this file

//TODO here's where you can paste all the contents of the neighboring files, to get everything in a single file

}
//console.log("load/");