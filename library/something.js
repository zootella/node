

//here is an example file to get some tests working in

function(test);

exports.testSomething = function(test) {
	test.expect(1);
	test.ok(true, "this assertion should pass");
	test.done();

	console.log("hello from a test");
};

/*
exports.testSomethingElse = function(test) {
	test.ok(false, "this assertion should fail");
	test.done();
};
*/

//added on different computer

//save to run tests, let's see if it works
