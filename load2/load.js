console.log("load\\");






// Load all the code files that make up the program, listing the main, core, and test functions
function _load() {





	var required = {};

	//load node
	required.child_process = require("child_process");
	required.crypto        = require("crypto");
	required.events        = require("events");
	required.fs            = require("fs");
	required.path          = require("path");
	required.stream        = require("stream");
	required.util          = require("util");

	//load libraries
	required.bignumber_js = require("bignumber.js");
	required.bluebird     = require("bluebird");
	required.charm        = require("charm");
	required.chokidar     = require("chokidar");
	required.handlebars   = require("handlebars");
	required.jquery       = require("jquery");
	required.keypress     = require("keypress");
	required.q            = require("q");

	//load electron if its here
	if (typeof process.versions.electron == "string") required.electron = require("electron"); // Throws if we're just on the shell, unlike jQuery






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
	// Given n like "name a b", compose a unique name for adding to o like "test[name a b]2" TODO remove with $ node load test
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
	var tests = []; // Automated unit tests of the core library TODO $ node load test

	// Prepare the single expose object that we'll pass into every container
	var expose = {};
	expose.main = function(n, f) { var l = {}; l[n] = f; _loadCopy(l, [mains]);         }
	expose.core = function(l)    {                       _loadCopy(l, [cores, global]); }
	expose.test = function(n, f) { tests.push({name:n, code:f});                        } //TODO, you haven't centralized tests yet
	function contain(container) { container(expose); } // Pass the same expose object into each container
	_loadCopy({required, contain, _loadCopy, _loadName, _loadRole}, [cores, global]); // Load these core functions for use and testing














	//TODO omit in single file
	var d = required.fs.readdirSync("./");
	for (var i = 0; i < d.length; i++) {//loop through all the files next to this one
		if (
			d[i].endsWith(".main.js") ||
			d[i].endsWith(".page.js") ||
			d[i].endsWith(".core.js") ||
			d[i].endsWith(".demo.js") ||
			d[i].endsWith(".test.js")) {//but not .note.js, that's notes to not run alongside parts you're working on
			require("./" + d[i]);//load those that have the right endings
		}
	}

	// Run a main if the command line named one
	var role = _loadRole();               // Find out what's running us
	if (role == "shell") {                // We're being run from the command line shell, there's no electron here at all
		_loadMain(process.argv);                                                  // Run a main named on the command line like "$ node load main name"
	} else if (role == "electron main") { // Electron's main process is running us, there's no page
		_loadCopy({ _fromElectron:{ process_argv: process.argv } }, [global]);    // Share the command line arguments for the renderer process
	} else if (role == "electron page") { // An electron renderer process is running us, so we do have a page
		var a = required.electron.remote.getGlobal("_fromElectron").process_argv; // Pickup the command line arguments from the main process
		_loadMain(a);                                                             // Run a main named on the command line like "$ electron . main name"
	}
}
_load();





console.log("load/");