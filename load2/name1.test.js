console.log("name1 test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };






expose.main("name", function(a, b, c) {
	console.log("this is main, name, prototype mark zero");
});

expose.main("name2", function(a, b, c) {
	console.log("and hello from main, name II");
});







expose.test("fancy", function(ok, done) {
	ok(true);
	done();
});

expose.test("fancy", function(ok, done) {
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




expose.test("augment", function(ok, done) {
	var s = "hello";
	ok(s.myLength(0, 0) == 5);
	ok(s.myLength(1, 2) == 8);
	done();
});

expose.test("augment", function(ok, done) {
	var a = ["a", "b", "c"];
	ok(a.myLength(0, 0) == 3);
	ok(a.myLength(1, 2) == 6);
	done();
});

expose.main("snip2", function() {
	console.log("hi from snip");

	var s = "hello";
	console.log(s.myLength(0, 5));

});





/*

ok, but let's say you just want to alias push to add

if ("add" in Array.prototype) toss("program");
Object.defineProperty(Array.prototype, "add", { enumerable: false, value: Array.prototype.push }); // Just link to push



*/


















});
console.log("name1 test/");