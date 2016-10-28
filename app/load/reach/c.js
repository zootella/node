
console.log("c start");







function c1(s) {
	return "c1 got " + s;
}

function c2(s) {
	return "c2 got " + s;
}

function c3() {
}

exports.c1 = c1;
exports.c2 = c2;
exports.c3 = c3;




console.log("c end");
