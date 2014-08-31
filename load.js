
// Instead of scattering which modules require which all over the place, this world map documents and defines the structure of the entire application in a single place
var worldMap = {

	// Application

	//TODO

	// Demos

	/*
	demo_here: [], // Determine our IP addresses on the Internet
	demo_hash: [], // Hash a file, showing speed and progress
	//stopwatch.js should be here, probably, demo of curses, time, update
	//secure erase disk task, secure erase an entire folder
	//TODO find the document and code list of larger demos, and list them all here
	*/

	// Tests and small demos

	disk_test:        ["disk", "path", "environment", "data", "state", "measure", "text"],
	path_test:        ["disk", "path", "environment", "data", "state", "measure", "text"],
	environment_test: ["disk", "path", "environment", "data", "state", "measure", "text"],


	hide_test:    ["hide",                 "state", "measure", "text"],
	data_test:    ["hide",         "data", "state", "measure", "text"],
	list_test:    ["hide", "list", "data", "state", "measure", "text"],
	state_test:   ["path", "hide",         "data", "state", "measure", "text"],
	measure_test: [                "data", "state", "measure", "text"],
	text_test:    ["disk", "environment", "data", "state", "measure", "text"],

	// Base

	net: [], // Communicate to distant peers with packets and sockets
	//TODO list more upcoming modules here, look at the old code to plan this out


	environment: ["path"],      // Get information about the computer we're running on
	disk:  ["measure", "text"], // Look at and change the files and folders on the disk
	path:  ["measure", "text"], // Parse file system paths

	hide: ["data", "measure"],  // Encrypt, decrypt, and sign data
	data:  ["measure", "text"], // Search, encode, and manipulate binary data
	list:  ["measure", "text"], // Organize objects into lists and dictionaries
	state: ["measure", "text"], // Notice something has changed, and remember to close everything

	measure: ["text"],          // Measure and communicate time, distance, and speed
	text: []                    // Search, convert, and adjust text
}

// Load into module m all the exported functions of all the modules m requires
function load(m, f) { use(worldMap[m], f); } // Look up the calling module in the world map above to get the list of what it requires

// Load all the exported functions of the given list of modules into the calling module
function use(l, f) {
	var t = f();                              // Call the given function to get the this pointer of the calling module
	for (var i = l.length - 1; i >= 0; i--) { // Loop through the names of the modules m requires, last to first to load more fundamental things earlier
		var r = require("./" + l[i]);           // Call require() here, calling into the required module and creating more calls back here
		for (e in r) {                          // Loop for each exported function
			t[e] = r[e];                          // Enable the calling module to use the exported function
		}
	}
}

exports.load = load;
exports.use = use;



//TODO really understand how require works, what order and how many times modules are loaded

//TODO alas, this doesn't work
//or more correctly, it works too well: if A needs B, and B needs C, A has access to C, when it shouldn't
//somehow the this pointer is becomming the global pointer, which you want to stay away from
//if you say if (t === global) that will be true
//after a full evening of trying to fix it, you can't get the module pointer
//you can't add something to this in a file so that naming myFunction works without this.myFunction
//even experiments where you wrapped each entire module in a function didn't yield a solution
//using eval("var ...") does work, but that's even worse than global, for security and speed
//so, keeping it like this now. you can easily change it later if you ever figure out it's possible




