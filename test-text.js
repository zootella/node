

var log = console.log;

var data = require("./data");
var Data = data.Data;


//try using utf8 right in the source code

exports.testEurope = function(test) {

	var s = "ö";//rock dots
	var d = Data(s);

	test.ok(s.length == 1);
	test.ok(d.size() == 2);
	test.ok(d.base16() == "c3b6");

	test.done();
}

exports.testAsia = function(test) {

	var s = "の";//hiragana no
	var d = Data(s);

	test.ok(s.length == 1);
	test.ok(d.size() == 3);
	test.ok(d.base16() == "e381ae");

	test.done();
}

//TODO add tests to confirm you can find these characters in text, split on them, and so on




