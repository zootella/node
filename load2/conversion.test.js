console.log("conversion test\\");
require("./load");//TODO remove with $ node load test
contain(function(expose) {
expose.test = function(n, f) { exports[_loadName(n, exports)] = function(t) { f(t.ok, t.done); }; }//TODO remove with $ node load test






//legacy nodeunit



//first test, [GOOD]
exports.testFirst = function(test) {
	test.ok(true);
	test.done();
}
expose.test("first", function(ok, done) {
	ok(true);
	done();
});

//log within a test, [GOOD]
exports.testLog = function(test) {
	test.ok(true);
	console.log("here's a note from within test log");
	test.done();
}
expose.test("log", function(ok, done) {
	ok(true);
	console.log("here's a note from within test log");
	done();
});

//accidentally cover over a test, [NEEDS IMPROVEMENT]
exports.testCover = function(test) {
	test.ok(false);//this should fail
	test.done();
}
exports.testCover = function(test) {//but gets accidentally covered over by this test with the same name
	test.ok(true);
	test.done();
}
expose.test("cover", function(ok, done) {//expose fixes this
//	ok(false); // <--uncomment/comment
	done();
});
expose.test("cover", function(ok, done) {
	ok(true);
	done();
});

//ok false, [GOOD]
exports.testFalse = function(test) {
	test.ok(true);
//	test.ok(false); // <--uncomment/comment
	test.done();
}
expose.test("false", function(ok, done) {
	ok(true);
//	ok(false); // <--uncomment/comment
	done();
});



//yeah, this conversion will work













//explicit fail, [GOOD]
exports.testFail = function(test) {
	test.ok(true);
//	test.fail(); // <--uncomment/comment
	test.done();
}

//throw an exception, [GOOD]
exports.testThrow = function(test) {
	test.ok(true);
	var o = {};
//	o.isUndefined.cantReadProperty; // <--uncomment/comment
	test.done();
}

//should throw an exception, [GOOD]
exports.testShouldThrow = function(test) {
	try {
		var o = {};
		o.isUndefined.cantReadProperty; // <--uncomment/comment
		test.fail();
	} catch (e) {
		test.ok(e.name == "TypeError");
		test.ok(true);
	}
	test.done();
}
exports.testShouldThrowFancy = function(test) {
	test.throws(function() {
		var o = {};
		o.isUndefined.cantReadProperty; // <--uncomment/comment
	});
	test.done();
}

//forget to call done, [NEEDS IMPROVEMENT] the rest of the tests dont run
exports.testForgetDone = function(test) {
	test.ok(true);
	test.done(); // <--uncomment/comment
}
exports.testAfterForgetDone = function(test) { test.ok(true); test.done(); }

//finish in the next cycle, [GOOD]
exports.testNextTickDone = function(test) {
	test.ok(true);
	setImmediate(function() {
		test.ok(true);
		test.done();
	});
	test.ok(true);
}

//forget to finish in the next cycle, [NEEDS IMPROVEMENT] the rest of the tests dont run
exports.testNextTickForgetDone = function(test) {
	test.ok(true);
	setImmediate(function() {
		test.ok(true);
		test.done(); // <--uncomment/comment
	});
	test.ok(true);
}

//ok false in the next cycle of the event loop, [GOOD]
exports.testNextTickFalse = function(test) {
	test.ok(true);
	setImmediate(function() {
//		test.ok(false); // <--uncomment/comment
		test.done();
	});
	test.ok(true);
}

//throw in the next cycle of the event loop, [NEEDS IMPROVEMENT] you dont get to see the exception, and no more tests run
exports.testNextTickThrows = function(test) {
	test.ok(true);
	setImmediate(function() {
		var o = {};
//		o.isUndefined.cantReadProperty; // <--uncomment/comment
		test.done();
	});
	test.ok(true);
}

//make it through the last test, [GOOD]
exports.testThroughLast = function(test) {
	test.ok(true);
	test.done();
}




});
console.log("conversion test/");