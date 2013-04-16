







//confirming that push and pop on arrays works the way you expect
exports.testBinAdd = function(test) {

	var a = [];
	test.ok(a.length == 0);
	a.push("a");
	test.ok(a.length == 1);
	var a1 = a.pop();
	test.ok(a1 == "a");
	test.ok(a.length == 0);

	a.push("b");
	a.push("c");
	a.push("d");
	test.ok(a.length == 3);
	var a2 = a.pop();
	test.ok(a2 == "d");
	test.ok(a.length == 2);

	test.done();
}







