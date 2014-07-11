
require("./load").load("filea", function () { return this; });







function functiona1() {
	console.log("function a1");
}

function functiona2() {
	console.log("function a2");
}

function functiona3() {
	console.log("function a3");
}

function functiona4() {
	console.log("function a4");
}

exports.functiona1 = functiona1;
exports.functiona2 = functiona2;
exports.functiona3 = functiona3;
exports.functiona4 = functiona4;













