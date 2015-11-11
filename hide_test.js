
var platformCrypto = require("crypto");

require("./load").load("hide_test", function() { return this; });







//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

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
			log(oldPercent(yes, samples));
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
	speedLoop8("unique", f);
}

//see if we can run the computer out of entropy
//running overnight on windows, this generated over a terabyte of random data without running out or any error
if (demo("random-limit")) { demoRandomLimit(); }
function demoRandomLimit() {

	function ScreenResource() {
		var o = mustClose();
		o.close = function() {
			if (o.alreadyClosed()) return;
		};
		o.pulseScreen = function() {
			stick("generated # of random data in #".fill(saySize(d), sayTime(t.age())));
		}
		return o;
	};
	var screen = ScreenResource();

	var t = now();//when we started
	var d = 0;//total number of random bytes generated
	var s = 4*Size.kb;//generate random data 4kb at a time

	var go = true;
	f1();
	function f1() {
		if (go) {
			platformCrypto.randomBytes(s, f2);//generate another 4kb of random data
		}
	}
	function f2(e, buffer) {
		if (e) throw e;
		if (go) {
			d += s;//record that we made that much more
			f1();//loop again
		}
	}

	keyboard("exit", function() {
		go = false;//stop generating random data
		close(screen);
		closeKeyboard();
		closeCheck();
	});
}














