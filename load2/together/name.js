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
	// Determine the role of this process, "shell", "electron main", or "electron page"
	function _loadRole() {
		if (typeof process.versions.electron == "string" && typeof process.type == "string") {
			if      (process.type == "browser")  return "electron main";
			else if (process.type == "renderer") return "electron page";
			else throw new Error("unknown environment");
		} else { return "shell"; }
	}
	// Given command line arguments like ["node", "load", "main", "name"], execute the named entry point
	function _loadMain(a) {
		if (a.length > 2 && a[2] == "main") {
			if (a.length > 3 && mains[a[3]] !== undefined) {
				setImmediate(function() { // Run after the rest of the code below in this file does
					mains[a[3]]();//TODO maybe pass command line arguments as function arguments
				});
			} else { throw new Error("unknown main"); }
		}
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
	_loadCopy({contain, _loadCopy, _loadName, _loadRole}, [cores, global]); // Load these core functions for use and testing

	//TODO omit when you have pop quiz
	var remoteExports;
	expose.setExports = function(e) { remoteExports = e; }//let test files give us their exports so we can fill them up
	//TODO omit in single file
	var d = platformDisk.readdirSync("./");
	for (var i = 0; i < d.length; i++) {//loop through all the files next to this one
		if (d[i].endsWith(".main.js") || d[i].endsWith(".page.js") || d[i].endsWith(".core.js") || d[i].endsWith(".demo.js") || d[i].endsWith(".test.js")) {
			require("./" + d[i]);//load those that have the right endings
		}
	}

	// Run a main if the command line named one
	var role = _loadRole();               // Find out what's running us
	if (role == "shell") {                // We're being run from the command line shell, there's no electron here at all
		_loadMain(process.argv);                                                 // Run a main named on the command line like "$ node load main name"
	} else if (role == "electron main") { // Electron's main process is running us, there's no page
		_loadCopy({ _fromElectron:{ process_argv: process.argv } }, [global]);   // Share the command line arguments for the renderer process
	} else if (role == "electron page") { // An electron renderer process is running us, so we do have a page
		var platformElectron = require("electron");                              // Throws if we're just on the shell, unlike jQuery
		var a = platformElectron.remote.getGlobal("_fromElectron").process_argv; // Pickup the command line arguments from the main process
		_loadMain(a);                                                            // Run a main named on the command line like "$ electron . main name"
	}
}
_load();


//if there's a main called main, run it, ignore the command line
//make required.fs and then each part of node, and each library from package.json







/*
var app = platformElectron.app;
var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window

app.on("ready", function() { // Electron has finished starting and is ready to make windows
	win = new platformElectron.BrowserWindow({width: 800, height: 1100}); // Create the browser window
	win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
	win.webContents.openDevTools(); // Open the developer tools

	win.on("closed", function() { // The user closed the window
		win = null; // Discard our reference to the window object
	});
});

app.on("window-all-closed", function() { // All the windows are closed
	app.quit();
});
*/



console.log("load/");