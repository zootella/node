
console.log("a start");

var b = require("./b.js");//normal load
console.log("a required b and got " + typeof b.b1);

var c = require("./c.js");//duplicate load
console.log("a required c and got " + typeof c.c1);//works without rerunning c




function a1(s) {
	return s+",a1";
}

function a2(s) {
	return s+",a2";
}

function a3(s) {
	return s+",a3";
}

exports.a1 = a1;
exports.a2 = a2;
exports.a3 = a3;




console.log("a end");

/*
$ node a.js

a start
	b start
		c start
		c end
	b required c and got function
	b required a and got undefined
	b end
a required b and got function
a required c and got function
a end

each file runs only once, even if more than one file requires it
duplicate requires down work, a loop require up doesn't throw but doesn't work

*/
