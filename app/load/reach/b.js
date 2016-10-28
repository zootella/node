
console.log("b start");

var c = require("./c.js");
var c1 = c.c1;




function b1(s) {
	return c1(s);
}

function b2() {
}

function b3() {
}

exports.b1 = b1;
exports.b2 = b2;
exports.b3 = b3;




console.log("b end");
