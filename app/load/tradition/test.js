
var library = require("./library");
var library1 = library.library1;//unpack the functions
var library2 = library.library2;




exports.testLibrary1 = function(test) {

	test.ok(library1() == "library 1 answer");
	test.done()
}

exports.testLibrary2 = function(test) {

	test.ok(library2() == "library 2 answer");
	test.done()
}



