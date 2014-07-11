





//instead of scattering what modules require what all over the place, organize it into a single world map right here

var worldMap = {

	fileb: ["filea", "data"], //fileb requires filea and data
	filec: []                 //filec doesn't require anything yet
}



exports.place = function (moduleName, moduleThis) {
	var t = moduleThis();
	var requirements = worldMap[moduleName];
	for (var i = 0; i < requirements.length; i++) {
		var requirement = require("./" + requirements[i]);
		for (r in requirement) {
			if (t[r]) console.log("warning, overwriting " + r + " in " + moduleName);
			t[r] = requirement[r];
		}
	}
}






