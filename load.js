
// Instead of scattering which modules require which all over the place, this world map documents and defines the structure of the entire application in a single place
var worldMap = {

	filea: [],
	fileb: ["filea", "data"], //fileb requires filea and data
	filec: []                 //filec doesn't require anything yet
}

// Load into name all the exported functions of all the modules name requires
exports.load = function(name, here) {
	var t = here();                                                // Call the given here function to get the this pointer of the calling module
	var requirements = worldMap[name];                             // Look up the calling module in the world map above
	for (var i = requirements.length - 1; i >= 0; i--) {           // Loop through the names of the modules it requires, last listed to first to load more fundamental things earlier
		var requirement = require("./" + requirements[i]);           // Call require() here, calling into the required module and creating more calls back here
		for (r in requirement) {                                     // Loop for each exported function
			if (t[r]) console.log("overwriting " + r + " in " + name); // Notice if two modules have exported something with the same name, the highest one will win
			t[r] = requirement[r];                                     // Enable the calling module to use the exported function
		}
	}
}
