
console.log("a start");




function a1() {
	return b1();
}

function a2() {
	return "first a2";
}

function a3() {
	return "a3";
}

exports.a1 = a1;
exports.a2 = a2;
exports.a3 = a3;

exports.note1 = "let's also export a string";




console.log("a end");
