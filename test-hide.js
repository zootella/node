
var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireEncrypt = require("./encrypt");













//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

var random = requireEncrypt.random;
var unique = requireEncrypt.unique;
var randomData = requireEncrypt.randomData;




//demo that chance(1, 2) happens 50% of the time
//test the input bounds on chance() and random()
//test that random(7, 7) is always 7
//demo how fast the first and later random values are generated
//demo that random(1, 10) each value is 10% of the total, show an even distribution









exports.testUnique = function(test) {

	done(test);
}


exports.testUnique = function(test) {

	test.ok(uniqueData().size() == 20);
	test.ok(randomData(6).size() == 6);

	test.ok(!uniqueData().same(uniqueData()));
	test.ok(!randomData(100).same(randomData(100)));



	test.done();
}






//things you need to do with random
//use the async with callback
//if entropy sources are drained, log a warning mistake, and switch to pseudorandom
//have a function that returns a random number 1 through n




//write a demo to confirm that if you do 1-10, you get the same probability of those, each one is 10%




