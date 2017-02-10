console.log("name2 test\\");
require("./load");//TODO remove with $ node load test
contain(function(expose) {
expose.test = function(n, f) { exports[_loadName(n, exports)] = function(t) { f(t.ok, t.done); }; }//TODO remove with $ node load test

/*
expose.test("fancy", function(ok, done) {
	ok(true);
	done();
});

expose.test("fancy", function(ok, done, fail) {
	ok(true);
	ok(true);
	done();
});
*/


exports.testNormal1 = function(test) {
	test.ok(core1() == "c1");
	test.ok(true);
	test.done();
}

exports.testNormal2 = function(test) {
	test.ok(true);
	test.ok(core4() == "c4");
	test.done();
}


});
console.log("name2 test/");