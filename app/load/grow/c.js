
console.log("c start");




function c1() {
	return "c1";
}

function c2() {
}

function c3() {
	return b3();
}

exports.c1 = c1;
exports.c2 = c2;
exports.c3 = c3;




console.log("c end");