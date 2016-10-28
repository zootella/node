
console.log("b start");

var c = require("./c.js");//normal load
console.log("b required c and got " + typeof c.c1);

var a = require("./a.js");//require back up doesn't throw
console.log("b required a and got " + typeof a.a1);//but also doesn't work




function b1(s) {
	return s+",b1";
}

function b2(s) {
	return s+",b2";
}

function b3(s) {
	return s+",b3";
}

exports.b1 = b1;
exports.b2 = b2;
exports.b3 = b3;




console.log("b end");
