
var requireText = require("./text");
var line = requireText.line;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var sayPercent = requireMeasure.sayPercent;
var items = requireMeasure.items;

var requireHide = require("./hide");

var requireState = require("./state");
var demo = requireState.demo;









//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

var chance = requireHide.chance;
var random = requireHide.random;
var unique = requireHide.unique;
var randomData = requireHide.randomData;

//see how often given chances happen
if (demo("chance")) { demoChance(); }
function demoChance() {

	function roll(samples, n, d) {
		log();
		log("4 groups of # rolls of chance # in #".fill(samples, n, d));
		for (var j = 1; j <= 4; j++) { // Run each set of rolls 8 times
			var yes = 0;
			for (var i = 1; i <= samples; i++)
				if (chance(n, d))
					yes++;
			log(sayPercent(yes, samples));
		}
	}

	roll(10, 1, 2);//coin
	roll(20, 1, 2);
	roll(50, 1, 2);
	roll(100, 1, 2);
	roll(10000, 1, 2);
	roll(10000, 23, 100);//percent
}

//generate random numbers in given ranges
if (demo("random")) { demoRandom(); }
function demoRandom() {

	function roll(target, min, max) {

		var samples = (max - min + 1) * target;
		var a = [];

		for (var i = 1; i <= samples; i++) {
			var n = random(min, max);
			if (!a[n]) a[n] = 0;
			a[n]++;
		}

		var s = line("# random numbers # through #".fill(samples, min, max));
		for (var v = min; v <= max; v++)
			s += line("# happened # times".fill(v, a[v]));
		log(s);
	}

	roll(20, 1, 6);
	roll(2000, 0, 9);
	roll(100, 0, 0);
	roll(100, 7, 7);
	roll(5000, 1, 2);
}

//make some guids
if (demo("unique-show")) { demoUniqueShow(); }
function demoUniqueShow() {

	log("base16"); for (var i = 1; i <= 12; i++) log(unique().base16());//notice the 300ms pause at the start
	log("base32"); for (var i = 1; i <= 12; i++) log(unique().base32());
	log("base62"); for (var i = 1; i <= 12; i++) log(unique().base62());
	log("base64"); for (var i = 1; i <= 12; i++) log(unique().base64());
}

//see how fast we can make guids
//there seems to be a 300ms cost to making the first one
//but after that, we can make nearly 100k/second
if (demo("unique-speed")) { demoUniqueSpeed(); }
function demoUniqueSpeed() {

	function f() { unique(); }
	demoSpeed(f, "unique");
}


//write this basic speed demo passing it the funciton to runa dn the name of what's happening
//put that next to demo



//see if we can run the computer out of entropy
//just show the log every 4k guids made
//and quit if you ever get the exception, just let the exception be thrown
//this demo just runs forever

//platformCrypto.randomBytes(n)
//do it in 8kb chunks
//report progress every 4 seconds
//generated # of random data in # time




















//demo that chance(1, 2) happens 50% of the time
//test the input bounds on chance() and random()
//test that random(7, 7) is always 7
//demo how fast the first and later random values are generated
//demo that random(1, 10) each value is 10% of the total, show an even distribution
//demo random forever and see how fast it switches to pseudo random instead








exports.testUnique = function(test) {

	done(test);
}


exports.testUnique = function(test) {

	test.ok(unique().size() == 20);
	test.ok(randomData(6).size() == 6);

	test.ok(!unique().same(unique()));
	test.ok(!randomData(100).same(randomData(100)));



	test.done();
}






//things you need to do with random
//use the async with callback
//if entropy sources are drained, log a warning mistake, and switch to pseudorandom
//have a function that returns a random number 1 through n




//write a demo to confirm that if you do 1-10, you get the same probability of those, each one is 10%




