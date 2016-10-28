
console.log("load start");












//load all these modules in this order
var libraryFiles = [
	"a", "b", "c"
];



function library() {
	for (var i = 0; i < libraryFiles.length; i++) { // Loop for each file

		var name = libraryFiles[i];
		var module = require("./" + name);

		var exportedNames = Object.keys(module);
		for (var j = 0; j < exportedNames.length; j++) { // Loop for each export in the file

			var exportedName = exportedNames[j];
			var exportedValue = module[exportedName];

			if (global[exportedName]) {//already here

				console.log("DUPLICATE!!!");
				global[exportedName] = exportedValue;//allow overwriting

			} else {//not yet in use

				global[exportedName] = exportedValue;//pin it to the global object

			}



		}
	}
}
exports.library = library;










console.log("load end");
