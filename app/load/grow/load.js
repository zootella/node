
console.log("load start");








//load all these modules in this order
var worldMap = [
	"a", "b", "c"
];






function library() {
	for (var i = 0; i < worldMap.length; i++) { // Loop for each file
		var module = require("./" + worldMap[i]);
		var a = Object.keys(module);
		for (var j = 0; j < a.length; j++) { // Loop for each export in the file
			var k = a[j];
			if (global[k]) {//already here
				console.log("Not overwriting " + k + " with duplicate in " + worldMap[i]);
			} else {//not yet in use
				global[k] = module[k];//pin it to the global object
			}
		}
	}
}
exports.library = library;








console.log("load end");
