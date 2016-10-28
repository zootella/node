
console.log("library start");





function library1() {
	return "hi from library1";
}

function library2() {
	return "hi from library2";
}

function library3() {
	return "hi from library3";
}

exports.library1 = library1;
exports.library2 = library2;
exports.library3 = library3;

//also export a string
exports.note1 = "some information";






console.log("library end");
