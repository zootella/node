
var high = require("./high");
var high1 = high.high1;//unpack the functions
var high2 = high.high2;

//app doesn't require low directly




function app() {
	console.log("welcome to the protection app");

	var s = high1() + ", " + high2();
	console.log("we can use the high library: " + s);
	console.log("which called low itself, while from here");
	console.log("the low library is of course: " + typeof low);//undefined
}

app();


