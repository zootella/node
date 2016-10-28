
console.log("app start");

var library = require("./library");
var library1 = library.library1;
var library2 = library.library2;
var library3 = library.library3;





function demo() {

	var l1 = library1();
	var l2 = library2();
	var l3 = library3();

	console.log(l1 + ", " + l2 + ", " + l3);


	//ok, but also, can you loop through the exports that library makes available


	var a = Object.keys(library);
	console.log(a.length);
	for (var i = 0; i < a.length; i++) {
		console.log(i + ", " + a[i] + ", " + typeof library[a[i]]);
	}
}
demo();







console.log("app end");
