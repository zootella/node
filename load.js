
// Instead of scattering which modules require which all over the place, this world map documents and defines the structure of the entire application in a single place
var worldMap = {

	// Tests

	path_test: ["disk", "data", "state", "measure", "text"],

	hide_test: ["hide", "state", "measure", "text"],

	disk_test: ["disk", "state", "measure", "text"],
	data_test: ["hide", "data", "measure", "text"],
	list_test: ["hide", "list", "data", "state", "measure", "text"],
	state_test: ["hide", "data", "state", "measure", "text"],

	measure_test: ["data", "state", "measure", "text"],
	text_test: ["data", "measure", "text"],

	// Base

	hide: ["data", "measure"],

	disk:  ["measure", "text"],
	data:  ["measure", "text"],
	list:  ["measure", "text"],
	state: ["measure", "text"],

	measure: ["text"],
	text: []
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
