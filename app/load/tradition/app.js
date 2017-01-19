
var library = require("./library");
var library1 = library.library1;//unpack the functions
var library2 = library.library2;






function app() {

	console.log("welcome to the traditional app");
	var s = library1() + ", " + library2();
	console.log("we used the library: " + s);
}

app();


