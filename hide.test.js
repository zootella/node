console.log("hide test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO


















//   ____                 _                   __  __       _   _     
//  |  _ \ __ _ _ __   __| | ___  _ __ ___   |  \/  | __ _| |_| |__  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \  | |\/| |/ _` | __| '_ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | | | |  | | (_| | |_| | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_| |_|  |_|\__,_|\__|_| |_|
//                                                                   

/*
the mozilla developer network has this code to generate a random integer a through b using Math.random():
*/
function randomMath(a, b) {//generate a random number
	var r = Math.floor(Math.random() * (b - a + 1)) + a;//mdn's method to make a random number
	if (r < a || r > b) log("outside bounds");
	return r;
}
/*
it's fast but bad because:
-they say r can go outside bounds, apparently
-small parts of large numbers aren't random, 4*Size.pb always produces 0kb 0b or 1b:
*/
expose.main("math-coarse", function() {
	for (var i = 0; i < 30; i++) log(saySize(randomMath(0, 4*Size.pb)));
});
/*
-oh, and it crashes node in C++ if you run it a lot:

#
# Fatal error in ..\..\src\lookup.cc, line 47
# CHECK(!root->IsNull()) failed
#

reproducable on node 0.12.0 and 0.12.7 on windows
always crashes after printing 25 lines of text, is it always crashing on the 12500th generation? that would be really weird
node 4.2.4 can run this without crashing, they probably fixed it
if the problem was in v8 instead of node, could a webpage with that code crashed the browser?
*/
expose.main("math-crash", function() {
	while (true) {
		log(randomMath(0, Size.pb));//make and show a big random number
		for (var i = 0; i < 500; i++) randomMath(0, Size.pb);//make a bunch more
	}
});
/*
but for small numbers it might be ok, so we need to make sure the new better way is still fast enough:
*/
expose.main("math-speed", function() {
	speedLoop("empty",      function() {                           }); // ~10 million
	log();
	speedLoop("coin math",  function() { randomMath(0, 1);         }); // ~10 million
	speedLoop("coin data",  function() { randomBit();              }); // ~10 million
	log();
	speedLoop("byte math",  function() { randomMath(0, 255);       }); // ~10 million
	speedLoop("byte data",  function() { randomUnder(256);         }); // ~2 million
	log();
	speedLoop("range math", function() { randomMath(0, Size.mb-1); }); // ~10 million
	speedLoop("range data", function() { randomUnder(Size.mb);     }); // ~1 million
});
/*
notice how data speed 257 is half as fast as 256, because it has to roll twice half the time
*/
expose.main("random-speed", function() {
	function empty() { speedLoop(say("empty"),            function() {                     }); }
	function math(v) { speedLoop(say("math ", saySize(v)), function() { randomMath(0, v-1); }); }
	function data(v) { speedLoop(say("data ", saySize(v)), function() { randomUnder(v);     }); }

	var a = [2, 255, 256, 257, Size.mb-1, Size.mb, Size.mb+1, Size.pb-1, Size.pb, Size.pb+1];
	empty();
	log();
	for (var i = 0; i < a.length; i++) math(a[i]);
	log();
	for (var i = 0; i < a.length; i++) data(a[i]);
});

//   ____                 _                   ___           _     _      
//  |  _ \ __ _ _ __   __| | ___  _ __ ___   |_ _|_ __  ___(_) __| | ___ 
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \   | || '_ \/ __| |/ _` |/ _ \
//  |  _ < (_| | | | | (_| | (_) | | | | | |  | || | | \__ \ | (_| |  __/
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_| |___|_| |_|___/_|\__,_|\___|
//                                                                       

//show how _randomPower works inside
expose.main("show-power", function() {

	//lowest possible
	log(); log("under 1, loops once");
	_randomPower(1, true);
	log(); log("under 2, loops twice");
	_randomPower(2, true);

	//whole powers of 2
	log(); log("under 8, builds h to 7 and returns random r")
	_randomPower(8, true);
	log(); log("under 256, builds h to 255 and returns random r")
	_randomPower(256, true);

	//around the boundary of a power of 2
	log(); log("under 15, builds h to 15 and returns random r")
	_randomPower(15, true);
	log(); log("under 16, builds h to 15 and returns random r")
	_randomPower(16, true);
	log(); log("under 17, builds h to 31 and returns random r")
	_randomPower(17, true);
});

//show how _randomUnder works, at power of 2 boundaries
expose.main("show-under-1",   function() { demoShowUnder(1);       });//one try, r all 0
expose.main("show-under-2",   function() { demoShowUnder(2);       });//one try, r 0 or 1
expose.main("show-under-8",   function() { demoShowUnder(8);       });//one try, r 0-7
expose.main("show-under-256", function() { demoShowUnder(256);     });//one try, r 0-255
expose.main("show-under-pb",  function() { demoShowUnder(Size.pb); });//one try
//around boundary
expose.main("show-under-15",  function() { demoShowUnder(15); });//under, a few take more than 1 try
expose.main("show-under-16",  function() { demoShowUnder(16); });//at, all take one try
expose.main("show-under-17",  function() { demoShowUnder(17); });//over, many take more tries
function demoShowUnder(v) {
	for (var i = 0; i < 30; i++) {
		var a = _randomUnder(v);
		log("under v # on try # got r #".fill(a.v, a.tries, a.r));
	}
}
//see how many tries _randomUnder takes
expose.main("show-tries", function() {

	function around(v) {
		log();
		f(v-1); //small ones take 1 or a few more tries, big ones don't
		f(v);   //always gets it on the first try
		f(v+1); //half of the results take 1 try, a quarter 2 tries, an eighth 3 tries, and so on
	}
	function f(v) {
		t = [];
		for (var i = 0; i < 100000; i++) {
			var tries = _randomUnder(v).tries;
			for (var k = 0; k <= tries; k++) {
				if (!t[k]) t[k] = 0;
				if (k == tries) t[k]++;
			}
		}
		var s = "under # try".fill(v);
		for (var j = 1; j < t.length; j++) s += " #".fill(t[j]);
		log(s);
	}

	around(8);
	around(16);
	around(256);
	around(Size.gb);
	around(Size.pb);
});

//same functions, but with extra logging and reporting added
function _randomUnder(v) {
	var tries = 0;
	while (true) {
		var r = _randomPower(v);
		tries++;
		if (r < v) return {v:v, tries:tries, r:r};
	}
}
function _randomPower(v, show) {
	var h = 0, r = 0, p = 0;
	while (true) {
		h += p;                  //high h gets every p
		if (randomBit()) r += p; //random r gets p half the time
		if (show) log("p# h# r#".fill(p, h, r));
		if (h > v - 2) return r;
		p = !p ? 1 : 2*p;        //double power what we add each time, p 0 1 2 4 8 16...
	}
}

//   ____                 _                   ____                       
//  |  _ \ __ _ _ __   __| | ___  _ __ ___   |  _ \  ___ _ __ ___   ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \  | | | |/ _ \ '_ ` _ \ / _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | | | |_| |  __/ | | | | | (_) |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_| |____/ \___|_| |_| |_|\___/ 
//                                                                       

//see how often given chances happen
expose.main("chance", function() {

	function roll(samples, n, d) {
		log();
		log("4 groups of # rolls of chance # in #".fill(samples, n, d));
		for (var j = 1; j <= 4; j++) {//run each set of rolls 8 times
			var yes = 0;
			for (var i = 1; i <= samples; i++)
				if (chance(n, d))
					yes++;
				log(sayUnitPerUnit(Fraction(yes, samples), "#% #/#"));
		}
	}

	roll(10, 1, 2);//coin
	roll(20, 1, 2);
	roll(50, 1, 2);
	roll(100, 1, 2);
	roll(10000, 1, 2);
	roll(10000, 23, 100);//percent
});

//generate random numbers in given ranges
expose.main("random-through", function() {

	function roll(target, min, max) {

		var samples = (max - min + 1) * target;
		var a = [];

		for (var i = 1; i <= samples; i++) {
			var n = randomThrough(min, max);
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
});

//watch chance stabilize
expose.main("random-chance-12", function()    { demoRandomChance(1, 2);    });
expose.main("random-chance-13", function()    { demoRandomChance(1, 3);    });
expose.main("random-chance-23", function()    { demoRandomChance(2, 3);    });
expose.main("random-chance-34", function()    { demoRandomChance(3, 4);    });
expose.main("random-chance-50100", function() { demoRandomChance(50, 100); });
expose.main("random-chance-71100", function() { demoRandomChance(71, 100); });
function demoRandomChance(n, d) {
	log("chance #/#".fill(n, d));
	var rolls = 0;
	var report = 1;
	var yes = 0;
	while (true) {
		rolls++;
		if(chance(n, d)) yes++;
		if (rolls == report) {
			log(sayUnitPerUnit(Fraction(yes, rolls), "#.######% #/#"));
			report *= 2;
		}
	}
}

//watch random bit approach 50%
expose.main("random-bit", function() {
	var rolls = 0;
	var report = 1;
	var heads = 0;
	while (true) {
		rolls++;
		if(randomBit()) heads++;
		if (rolls == report) {
			log(sayUnitPerUnit(Fraction(heads, rolls), "#.######% #/#"));
			report *= 2;
		}
	}
});

//watch random under stabilize
expose.main("random-under-4",  function() { demoRandomUnder(4);  });
expose.main("random-under-10", function() { demoRandomUnder(10); });
expose.main("random-under-30", function() { demoRandomUnder(30); });
function demoRandomUnder(v) {
	log("under #".fill(v));
	var rolls = 0;
	var report = 1;
	var values = [];
	for (var i = 0; i < v; i++) values[i] = 0;
	while (true) {//runs forever, control+c to close
		values[randomUnder(v)]++;
		rolls++;
		if (rolls == report) {
			log();
			log("after #".fill(items(rolls, "roll")));
			for (var i = 0; i < v; i++)
				log("# came up # times #".fill(i, values[i], sayUnitPerUnit(Fraction(values[i], rolls), "#.######%")));
			report *= 2;
		}
	}
}

//call chance forever in place
expose.main("in-place", function(n, d) {

	var screen = pulseScreen(function() {
		stick("chance # in # is #".fill(n, d, sayUnitPerUnit(Fraction(wins, rolls), "#.######% #/#")));
	});

	var wins = 0;
	var rolls = 0;

	var go = true;
	f1();
	function f1() {
		if (go) {
			rolls++;
			if (chance(n, d)) wins++;
			wait(0, f1);
		}
	}

	keyboard("exit", function() {
		go = false;//stop generating random data
		close(screen);
		closeKeyboard();
		closeCheck();
	});
});

//   ____                 _                   ____        _        
//  |  _ \ __ _ _ __   __| | ___  _ __ ___   |  _ \  __ _| |_ __ _ 
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \  | | | |/ _` | __/ _` |
//  |  _ < (_| | | | | (_| | (_) | | | | | | | |_| | (_| | || (_| |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_| |____/ \__,_|\__\__,_|
//                                                                 

//make some guids
expose.main("unique", function() {

	log("base16"); for (var i = 1; i <= 12; i++) log(unique().base16());//notice the 300ms pause at the start
	log("base32"); for (var i = 1; i <= 12; i++) log(unique().base32());
	log("base62"); for (var i = 1; i <= 12; i++) log(unique().base62());
	log("base64"); for (var i = 1; i <= 12; i++) log(unique().base64());
});

//see how fast we can make guids
//there seems to be a 300ms cost to making the first one
//but after that, we can make nearly 100k/second
expose.main("unique-speed", function() {

	function f() { unique(); }
	speedLoop8("unique", f);
});

//see if we can run the computer out of entropy
//running overnight on windows, this generated over a terabyte of random data without running out or any error
expose.main("random-limit", function() {

	var screen = pulseScreen(function() {
		stick("generated # of random data in #".fill(saySize(d), sayTime(t.age())));
	});

	var t = now();//when we started
	var d = 0;//total number of random bytes generated
	var s = 4*Size.kb;//generate random data 4kb at a time

	var go = true;
	f1();
	function f1() {
		if (go) {
			required.crypto.randomBytes(s, f2);//generate another 4kb of random data
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
});

//   ____                 _                   _____         _   
//  |  _ \ __ _ _ __   __| | ___  _ __ ___   |_   _|__  ___| |_ 
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \    | |/ _ \/ __| __|
//  |  _ < (_| | | | | (_| | (_) | | | | | |   | |  __/\__ \ |_ 
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|   |_|\___||___/\__|
//                                                              

expose.test("hide random", function(ok, done) {

	function i(f) {//invalid
		try {
			f();
			ok(false);
		} catch (e) { ok(true); }
	}

	var limit = 100000;
	function both(f) {//see that f returns true and false
		var tries = 0;
		var hitTrue = false;
		var hitFalse = false;
		while (true) {
			tries++;
			if (f()) { hitTrue  = true; }
			else     { hitFalse = true; }
			if (hitTrue && hitFalse) {
				ok(true);
				return;
			} else if (tries > limit) {
				ok(false);
				return;
			}
		}
	}
	function hit(target, f) {//see that f returns target
		var tries = 0;
		while (true) {
			var r = f();
			tries++;
			if (r == target) {//hit the target value
				ok(true);
				return;
			} else if (tries > limit) {//give up after 100k tries
				ok(false);
				return;
			}
		}
	}

	//randomBit
	both(function() { return randomBit(); });

	//chance
	ok(chance(1, 1));
	ok(chance(500, 500));
	i(function() { chance(0, 1); });//no chance in 1
	i(function() { chance(2, 1); });//two chance in 1
	both(function() { return chance(1, 2); });
	both(function() { return chance(999, 1000); });

	//randomThrough
	ok(randomThrough(0, 0) == 0);
	ok(randomThrough(1, 1) == 1);
	ok(randomThrough(789, 789) == 789);
	i(function() { randomThrough(3, 2); });

	hit(1, function() { return randomThrough(1, 2); });
	hit(2, function() { return randomThrough(1, 2); });

	hit(5, function() { return randomThrough(5, 7); });
	hit(6, function() { return randomThrough(5, 7); });
	hit(7, function() { return randomThrough(5, 7); });

	hit(Size.pb,     function() { return randomThrough(Size.pb, Size.pb+100); });
	hit(Size.pb+50,  function() { return randomThrough(Size.pb, Size.pb+100); });
	hit(Size.pb+100, function() { return randomThrough(Size.pb, Size.pb+100); });

	//randomUnder
	ok(randomUnder(1) == 0);
	i(function() { randomUnder(0); });

	hit(0, function() { return randomUnder(2); });
	hit(1, function() { return randomUnder(2); });

	hit(0, function() { return randomUnder(256); });
	hit(71, function() { return randomUnder(256); });
	hit(255, function() { return randomUnder(256); });

	done();
});

expose.test("hide platform", function(ok, done) {

	function f(v) {
		ok(chance(v, v));
		ok(randomThrough(v, v) == v);
	}

	f(Number.MAX_SAFE_INTEGER);
	f(Number.MAX_SAFE_INTEGER-1);
	f(Number.MAX_SAFE_INTEGER-2);
	f(Number.MAX_SAFE_INTEGER-50);

	done();
});












expose.test("hide snip 1", function(ok, done) {

	ok(true);
	ok(true);
//	log("hi from inside a test");







	done();
});


expose.test("hide snip 2", function(ok, done) {

	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);







	done();
});

expose.test("hide snip 3", function(ok, done) {

	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);
	ok(true);







	done();
});



});
console.log("hide test/");