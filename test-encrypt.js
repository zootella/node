
var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireEncrypt = require("./encrypt");

var randomData = requireEncrypt.randomData;
var uniqueData = requireEncrypt.uniqueData;



exports.testRandom = function(test) {

	test.ok(uniqueData().size() == 20);
	test.ok(randomData(6).size() == 6);

	test.ok(!uniqueData().same(uniqueData()));
	test.ok(!randomData(100).same(randomData(100)));



	test.done();
}







