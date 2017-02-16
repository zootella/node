console.log("name2 test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };










expose.test("fancy", function(ok, done) {
	ok(true);
	done();
});

expose.test("fancy", function(ok, done, fail) {
	ok(true);
	ok(true);
	done();
});

expose.test("fancy", function(ok, done, fail) {
	ok(true);
	ok(true);
	done();
});


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