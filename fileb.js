
//require("./load").load("fileb", function() { return this; });
require("./load").use(["filea", "data"], function() { return this; });







function functionb1() {
	functiona1();
	console.log("function b1");

	var d = Data("hello");
	console.log(d.base16());
}

function functionb2() {
	functiona2();
	console.log("function b2");
}

function functionb3() {
	functiona3();
	console.log("function b3");
}

function functionb4() {
	functiona4();
	console.log("function b4");
}

exports.functionb1 = functionb1;
exports.functionb2 = functionb2;
exports.functionb3 = functionb3;
exports.functionb4 = functionb4;







functionb1();




//get rid of all the yN.js files, go through them and weed them out
//rename files data.js, data.test.js, with dots instead of hyphens
//nodeunit test-*.js becomes nodeunit *.test.js, which is better

















