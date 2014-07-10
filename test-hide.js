
var platformCrypto = require("crypto");

var requireText = require("./text");
var line = requireText.line;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var sayPercent = requireMeasure.sayPercent;
var items = requireMeasure.items;
var Size = requireMeasure.Size;
var Time = requireMeasure.Time;
var now = requireMeasure.now;
var saySize = requireMeasure.saySize;

var requireHide = require("./hide");

var requireState = require("./state");
var demo = requireState.demo;
var speedLoop = requireState.speedLoop;



/*
require("./hide").bridge.load(module);
*/





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
if (demo("unique")) { demoUnique(); }
function demoUnique() {

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
	speedLoop(f, "unique");
}

//see if we can run the computer out of entropy
//running overnight on windows, this generated over a terabyte of random data without running out or any error
if (demo("random-limit")) { demoRandomLimit(); }
function demoRandomLimit() {

	var t = now();
	var d = 0;//total number of random bytes generated
	var s = 4*Size.kb;//generate random data 4kb at a time

	while (true) {//loop until something throws an error

		if (t.expired(4*Time.second)) {//print status on a line every 4 seconds
			t = now();
			log("generated # of random data".fill(saySize(d)));
		}

		platformCrypto.randomBytes(s);//generate another 4kb of random data
		d += s;//record that we made that much more
	}
}




//use charm and pulseScreen to have this show speed and distance in real time
//this is a great use of charm without having to have streams understood and going yet















