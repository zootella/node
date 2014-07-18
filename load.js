
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

	hide_test:    ["hide",                 "state", "measure", "text"],
	disk_test:    ["disk",         "data", "state", "measure", "text"],
	data_test:    ["hide",         "data",          "measure", "text"],
	list_test:    ["hide", "list", "data", "state", "measure", "text"],
	state_test:   ["hide",         "data", "state", "measure", "text"],
	measure_test: [                "data", "state", "measure", "text"],
	text_test:    [                "data",          "measure", "text"],

	// Base

	net: [], // Communicate to distant peers with packets and sockets
	//TODO list more upcoming modules here, look at the old code to plan this out

	hide: ["data", "measure"],  // Encrypt, decrypt, and sign data

	disk:  ["measure", "text"], // Look at and change the files and folders on the disk
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
