


console.log("top");

//try to figure out how nodeunit runs stuff






exports.testRegular1 = function(test) {
	test.ok(true);
	test.done();
}

exports.testRegular2 = function(test) {
	test.ok(true);
	test.ok(true);
	test.done();
}

function core1() {
	console.log("ran core1");
}
exports.core1 = core1;
global.core1 = core1;




function snip() {

	console.log("hi");

	var n = require("../../../nodeunit");
	console.log(typeof n);

}
snip();

//runTest(fn, options)









console.log("bottom");

/*
$ node hackery.js
$ nodeunit hackery.js
*/





