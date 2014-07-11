
// Instead of scattering which modules require which all over the place, this world map documents and defines the structure of the entire application in a single place
var worldMap = {

	filea: [],
	fileb: ["filea", "data"], //fileb requires filea and data
	filec: []                 //filec doesn't require anything yet
}

/*
// Load into module m all the exported functions of all the modules m requires
exports.load = function(m, f) {
	var t = f();                                                // Call the given function to get the this pointer of the calling module
	var requirements = worldMap[m];                             // Look up the calling module in the world map above
	for (var i = requirements.length - 1; i >= 0; i--) {        // Loop through the names of the modules m requires, last to first to load more fundamental things earlier
		var requirement = require("./" + requirements[i]);        // Call require() here, calling into the required module and creating more calls back here
		for (r in requirement) {                                  // Loop for each exported function
			if (t[r]) console.log("overwriting " + r + " in " + m); // If two modules have exported something with the same name, the highest one will win
			t[r] = requirement[r];                                  // Enable the calling module to use the exported function
		}
	}
}
*/





// Load into module m all the exported functions of all the modules m requires
exports.load = function(m, f) {
	var t = f();                                                // Call the given function to get the this pointer of the calling module
	var l = worldMap[m];                                        // Look up the calling module in the world map above to get the list of what it requires
	for (var i = l.length - 1; i >= 0; i--) {                   // Loop through the names of the modules m requires, last to first to load more fundamental things earlier
		var r = require("./" + l[i]);                             // Call require() here, calling into the required module and creating more calls back here
		for (e in r) {                                            // Loop for each exported function
			if (t[e]) console.log("overwriting " + e + " in " + m); // If two modules have exported something with the same name, the highest one will win
			t[e] = r[e];                                            // Enable the calling module to use the exported function
		}
	}
}
