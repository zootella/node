
console.log("b start");




function b1() {
	return c1();
}

function b2() {
}

function b3() {
	return a3();
}

exports.b1 = b1;
exports.b2 = b2;
exports.b3 = b3;


//use a name that's already in a
function a2() {
	return "duplicate a2";
}
exports.a2 = a2;



console.log("b end");
