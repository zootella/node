






/*
var requireFileA = require("./filea");

function allin(source) {
	for (s in source) {
		if (this[s]) console.log("overwriting " + s);
		else         console.log("adding " + s);
		this[s] = source[s];
	}
}
*/



/*
function batch(files) {
	for (var i = 0; i < files.length; i++) {
		var source = require("./" + files[i]);
		for (s in source) {
			if (this[s]) console.log("overwriting " + s);
			this[s] = source[s];
		}
	}
}
*/

/*
function batch(files, get, set) {
	for (var i = 0; i < files.length; i++) {
		var source = require("./" + files[i]);
		for (s in source) {
			if (get(s)) console.log("overwriting " + s);
			set(s, source[s]);
		}
	}
}
*/


/*
function this_get(k) { return this[k]; }
function this_set(k, v) { this[k] = v; }
function produce_this() { return this; }

console.log(produce_this);
*/

require("./world").batch("fileb", this_get, this_set, function () { return this; });

//require("./world").batch("fileb", function (k) { return this[k] }, function (k, v) { this[k] = v; });






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























