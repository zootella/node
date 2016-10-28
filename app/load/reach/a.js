
console.log("a start");

var b = require("./b.js");
var b1 = b.b1;




function a1(s) {
	return b1(s);
}

function a2(s) {
	return c2(s);//unreachable but fine here unless we call it
}

function a3() {
}

exports.a1 = a1;
exports.a2 = a2;
exports.a3 = a3;




function demo() {
	console.log("a demo start");

	console.log("a demo: " + a1("hello1"));
	if (false) {//change to true to see the reference error c2 is not defined
		console.log("a demo: " + a2("hello2"));
	}

	console.log("a demo end");
}
demo();




console.log("a end");

/*
$ node a.js

a start
	b start
		c start
		c end
	b end
a demo start
a demo: c1 got hello1
a demo end
a end

a uses b, b uses c, but a is protected from reaching c directly

*/
