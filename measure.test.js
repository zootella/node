
require("./load").library();

var platformBigNumber = require('bignumber.js');








var timeZone = "u"; // The local time zone the tests are running in, set to "e" Eastern, or "m" Mountain time
//TODO make dateParts and datePartsLocal and you won't need this anymore










//   ____  _       _    __                      
//  |  _ \| | __ _| |_ / _| ___  _ __ _ __ ___  
//  | |_) | |/ _` | __| |_ / _ \| '__| '_ ` _ \ 
//  |  __/| | (_| | |_|  _| (_) | |  | | | | | |
//  |_|   |_|\__,_|\__|_|  \___/|_|  |_| |_| |_|
//                                              

if (demo("inspect")) { demoInspect(); }
function demoInspect() {

	log(inspect(this));//just a shorter name for util.inspect()
}

//on mac, you can change the width of a terminal while it's running
//process.stdout.columns doesn't change, it's still the width when the process started
//long lines wrap, and charm.up() and .down() count newly wrapped lines
//so, changing the width while running can cause stick to not erase far up enough
if (demo("columns")) { demoColumns(); }
function demoColumns() {
	keyboard("c", function() {
		log("process.stdout.columns: " + process.stdout.columns);
	});
	keyboard("exit", function() { closeKeyboard(); });
}

//   _____    _      _                    
//  |_   _|__| | ___| |_ _   _ _ __   ___ 
//    | |/ _ \ |/ _ \ __| | | | '_ \ / _ \
//    | |  __/ |  __/ |_| |_| | |_) |  __/
//    |_|\___|_|\___|\__|\__, | .__/ \___|
//                       |___/|_|         

if (demo("log")) { demoLog(); }
function demoLog() {

	log("hi");
	log();//blank line
	log("a", 7, "b");//multiple arguments not separated by spaces
}

if (demo("stick")) { demoStick(); }
function demoStick() {

	stick("stick");//notice that stick() starts charm, but this doesn't prevent the process from ending
}

if (demo("both")) { demoBoth(); }
function demoBoth() {

	log("log1");
	stick("stick1", "stick2");
	log("log2");
	stick("stick1a", "stick2");
	log("log3");
}

if (demo("cycle")) { demoCycle(); }
function demoCycle() {
	stick("press n for [log] small tall long");

	var step = 1;
	keyboard("n", function() {
		if (step == 1) {//log
			log("log");
			stick("press n for log [small] tall long");
		} else if (step == 2) {//small
			stick("press n for log small [tall] long", "small");
		} else if (step == 3) {//tall
			stick("press n for log small tall [long]", "tall", "tall", "tall", "tall");
		} else if (step == 4) {//long
			stick("press n for [log] small tall long", "long------twenty----thirty----forty-----fifty-----sixty-----seventy---eighty----ninety----hundred---");
		}
		step++;
		if (step > 4) step = 1;
	});
	keyboard("exit", function() { closeKeyboard(); });
}

//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

//see how fast we can update the console using charm
if (demo("stick-speed")) { demoStickSpeed(); }
function demoStickSpeed() {
	var i = 0;
	function f() {
		i++;
		stick("number #".fill(i));
	}
	speedLoop8("stick", f);//hundreds spin faster than you can read
}

//   _  __          _                         _ 
//  | |/ /___ _   _| |__   ___   __ _ _ __ __| |
//  | ' // _ \ | | | '_ \ / _ \ / _` | '__/ _` |
//  | . \  __/ |_| | |_) | (_) | (_| | | | (_| |
//  |_|\_\___|\__, |_.__/ \___/ \__,_|_|  \__,_|
//            |___/                             

/*
press any key to see what the keyboard module tells you

           key.character  key.name

i          i              i
shift+i    I              i
control+i  \t             tab        control+i is tab
8          8                         number keys only have character with no additional information
shift+8    *
backspace  \b             backspace  character and name are different
*/
if (demo("keyboard-any")) { demoKeyboardAny(); }
function demoKeyboardAny() {
	keyboard("any", function(key) {
		log(inspect(key));
	});
	keyboard("exit", function() { closeKeyboard(); });//let the process exit
}

if (demo("keyboard-name")) { demoKeyboardName(); }
function demoKeyboardName() {
	keyboard("8",         function(key) { log("eight");          });//matches key.character, standard
	keyboard("backspace", function(key) { log("word backspace"); });//matches key.name, also works
	keyboard("i",         function(key) { log("i");              });//matches both, but keyboard only calls function once
	keyboard("\t",        function(key) { log("slash t");        });//control+i leads to both of these, using either one works
	keyboard("tab",       function(key) { log("word tab");       });

	keyboard("exit", function() { closeKeyboard(); });
}

if (demo("keyboard-double")) { demoKeyboardDouble(); }
function demoKeyboardDouble() {
	keyboard("n", function(key) {
		log("first listener");
	});
	keyboard("n", function(key) {//you can add multiple listeners for the same key, and keyboard will call them all
		log("second listener");
	});
	keyboard("exit", function() { closeKeyboard(); });
}

//   _____      _ _   
//  | ____|_  _(_) |_ 
//  |  _| \ \/ / | __|
//  | |___ >  <| | |_ 
//  |_____/_/\_\_|\__|
//                    

/*
confirm that using charm and keypress won't prevent the process from exiting naturally

finishes by itself
exit1: uses neither
exit2: uses charm
exit3: uses keypress
exit4: uses both

finishes when user presses escape
exit5: uses keypress
exit6: uses both
*/

if (demo("exit1")) { demoExit1(); }//exits when done, uses neither
function demoExit1() {
	var r = mustClose();
	log("log");
	close(r);
	closeCheck();
}

if (demo("exit2")) { demoExit2(); }//exits when done, uses charm
function demoExit2() {
	var r = mustClose();
	stick("stick");
	close(r);
	closeCheck();
}

if (demo("exit3")) { demoExit3(); }//exits when done, uses keypress
function demoExit3() {
	keyboard("k", function() {
		log("keyboard");
	});

	var r = mustClose();
	log("log");
	close(r);
	closeKeyboard();
	closeCheck();
}

if (demo("exit4")) { demoExit4(); }//exits when done, uses both
function demoExit4() {
	keyboard("k", function() {
		log("keyboard");
	});

	var r = mustClose();
	stick("stick");
	close(r);
	closeKeyboard();
	closeCheck();
}

if (demo("exit5")) { demoExit5(); }//user exits, uses keypress
function demoExit5() {
	keyboard("k", function() {
		log("keyboard");
	});
	keyboard("exit", function() {
		log("user exit");
		close(r, s);
		closeKeyboard();
		closeCheck();
	});

	var r = mustClose();
	var s = mustClose();
	s.pulseScreen = function() {
		log(sayDateAndTime(now().time));//scrolling clock
	}
}

if (demo("exit6")) { demoExit6(); }//user exits, uses both
function demoExit6() {
	keyboard("k", function() {
		log("keyboard");
	});
	keyboard("exit", function() {
		log("user exit");
		close(r, s);
		closeKeyboard();
		closeCheck();
	});

	var r = mustClose();
	var s = mustClose();
	s.pulseScreen = function() {
		stick(sayDateAndTime(now().time));//clock that stays in place
	}
}

//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

//escape to close both with and without all the resources you made closed
if (demo("keyboard-resource")) { demoKeyboardResource(); }
function demoKeyboardResource() {

	var clock = mustClose();
	var resources = [];

	clock.pulseScreen = function() {
		stick(
			sayDateAndTime(now().time),//clock that stays in place
			"",
			items(resources.length, "open resource"),//current number of open resources
			"[m]ake or [c]lose a resource");
	}

	keyboard("m", function() { resources.add(mustClose()); });
	keyboard("c", function() { if (resources.length) close(resources.remove(0)); });

	keyboard("exit", function() {
		close(clock);
		closeKeyboard();
		closeCheck();
	});
}

//this demo shows that keyboard exit lets the process exit naturally, rather than ending it by force
//it also shows that a timeout will prevent the process from exiting
//start, escape: exits naturally right away, same thing if you s and wait for the timeout to happen
//start, s, escape: close check passes, but the process stays alive until the timeout happens
if (demo("keyboard-timeout")) { demoKeyboardTimeout(); }
function demoKeyboardTimeout() {

	var c = mustClose();
	var t = null;

	c.pulseScreen = function() {
		stick(
			sayDateAndTime(now().time),//clock that stays in place
			"",
			t ? "timeout set # ago".fill(sayTime(t.age())) : "no timeout",
			"[s]et a timeout");
	}

	keyboard("s", function() {
		if (!t) {
			t = now();
			wait(10*Time.second, function() {
				soon();//otherwise log adds "timeout happened" a little before stick goes back to "no timeout"
				log("timeout happened");
				t = null;
			});
		}
	});

	keyboard("exit", function() {
		close(c);
		closeKeyboard();
		closeCheck();
	});
}
















//   ____  _       _    __                      
//  |  _ \| | __ _| |_ / _| ___  _ __ _ __ ___  
//  | |_) | |/ _` | __| |_ / _ \| '__| '_ ` _ \ 
//  |  __/| | (_| | |_|  _| (_) | |  | | | | | |
//  |_|   |_|\__,_|\__|_|  \___/|_|  |_| |_| |_|
//                                              

//make sure that javascript numbers act the way we expect on this platform
exports.testPlatform = function(test) {

	//make sure the largest number this platform treats as an integer is what we expect
	//numeralsFit, int, and Fraction are written to work with any MAX_SAFE_INTEGER, but if a platform changes that, it would be nice to know

	test.ok(Number.MAX_SAFE_INTEGER    == 9007199254740991);
	test.ok(Number.MAX_SAFE_INTEGER+"" == "9007199254740991");//as numerals
	test.ok(Number.MAX_SAFE_INTEGER    == (8*Size.pb) - 1);//as size

	test.ok((Number.MAX_SAFE_INTEGER+0)+"" == "9007199254740991");//correct
	test.ok((Number.MAX_SAFE_INTEGER+1)+"" == "9007199254740992");//correct
	test.ok((Number.MAX_SAFE_INTEGER+2)+"" == "9007199254740992");//got stuck on that last one

	test.ok(((7*Size.pb) - 1)+"" == "7881299347898367");//math around 7pb works
	test.ok(((7*Size.pb)    )+"" == "7881299347898368");
	test.ok(((7*Size.pb) + 1)+"" == "7881299347898369");

	test.ok(((8*Size.pb) - 1)+"" == "9007199254740991");
	test.ok(((8*Size.pb)    )+"" == "9007199254740992");
	test.ok(((8*Size.pb) + 1)+"" == "9007199254740992");//math around 8pb doesn't

	//the weird javascript numbers

	var w1 = 1/0;//generate
	var w2 = -1/0;
	var w3 = 0/0;
	var w4 = parseInt();
	var w5 = Infinity;//symbolic values
	var w6 = NaN;

	test.ok(typeof w1 == "number");//they are still numbers
	test.ok(typeof w2 == "number");
	test.ok(typeof w3 == "number");
	test.ok(typeof w4 == "number");
	test.ok(typeof w5 == "number");
	test.ok(typeof w6 == "number");

	test.ok(w1+"" == "Infinity");//converting to string makes non numerals
	test.ok(w2+"" == "-Infinity");
	test.ok(w3+"" == "NaN");
	test.ok(w4+"" == "NaN");
	test.ok(w5+"" == "Infinity");
	test.ok(w6+"" == "NaN");

	test.ok(!isFinite(w1));//detector functions
	test.ok(!isFinite(w2));
	test.ok(isNaN(w3));
	test.ok(isNaN(w4));
	test.ok(!isFinite(w5));
	test.ok(isNaN(w6));

	//forms

	//integers
	var i1 = 077;//octal
	var i2 = 0xff;//hexadecimal
	var i3 = 1.23e+5;//exponential
	var i4 = 5.0;//decimal with integer value

	test.ok(i1 === 63);//same as these integers
	test.ok(i2 === 255);
	test.ok(i3 === 123000);
	test.ok(i4 === 5);

	test.ok(i1+"" === "63");//plus blank makes integers
	test.ok(i2+"" === "255");
	test.ok(i3+"" === "123000");
	test.ok(i4+"" === "5");

	//decimals
	var d1 = 5.67e-3;
	var d2 = 456.789;

	test.ok(d1 === 0.00567);//same as these decimals
	test.ok(d2 === 456.789);

	test.ok(d1+"" === "0.00567");//we can notice the periods
	test.ok(d2+"" === "456.789");

	test.done();
}

exports.testNumberNanInfinity = function(test) {

	var n;

	n = 1 / 1;//number
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(isFinite(n));
	test.ok(n + "" == "1");

	n = 0 / 0;//nan
	test.ok(typeof n == "number");
	test.ok(isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "NaN");

	n = 1 / 0;//infinity
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "Infinity");

	test.done();
}

exports.testNumberBig = function(test) {

	var n;

	n = Number.MAX_VALUE;
	test.ok(n + "" == "1.7976931348623157e+308");//largest value that a number can hold, not an integer

	n = n * 2;
	test.ok(typeof n == "number");
	test.ok(!isNaN(n));
	test.ok(!isFinite(n));
	test.ok(n + "" == "Infinity");

	n = 9007199254740992;//largest number that javascript can handle as an integer, 2^53
	test.ok( n - 1      ==  9007199254740991);//subtracting works
	test.ok( n + 0      ==  9007199254740992);
	test.ok( n + 1      ==  9007199254740992);//adding doesn't, no change, doesn't throw
	test.ok( n * 1      ==  9007199254740992);
	test.ok( n * 2      == 18014398509481984);//multiplying does work, somehow
	test.ok((n * 2) + 1 == 18014398509481984);//but then adding doesn't change it

	//clever code you came up with to detect this problem
	test.ok(n + 1 === n);

	//example of working with a very large file size
	var f = Fraction(9007199254740992 - 1, Size.tb);//the biggest number divide and multiply will work with is 1 less than the int limit
	test.ok(f.whole.toNumber() == 8191);// the size limit is 8191 terabytes
	test.ok(f.remainder.toNumber() == 1099511627775);//and this remainder of bytes
	test.ok(Fraction(f.remainder, Size.gb).whole.toNumber() == 1023);//which is 1023 gigabytes
	test.ok(Fraction([8191, Size.tb], 1).whole.toNumber() + 1099511627775 == 9007199254740992 - 1);//put the number back together again

	test.done();
}

//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

//compare speeds of basic skills using j javascript numbers, t text numerals, b bignumber.js, and c custom code
if (demo("speed-skill")) { speedSkill() }
function speedSkill() {
	speedLoop("empty",                  speedEmpty);   // ~10 million
	speedLoop("base",                   speedBase);    // ~10 million
	log();
	speedLoop("check number",           speedCheckJ);  // ~5 million
	speedLoop("check text",             speedCheckT);  // ~5 million
	speedLoop("check min0",             speedCheckC);  // ~5 million
	log();
	speedLoop("less number",            speedLessJ);   // ~10 million
	speedLoop("less text",              speedLessT);   // ~1 million
	speedLoop("less bignumber.js",      speedLessB);   // ~3 million
	speedLoop("less int",               speedLessC);   // ~300 thousand
	log();
	speedLoop("scale number",           speedScaleJ);  // ~5 million
	speedLoop("scale bignumber.js",     speedScaleB);  // ~100 thousand
	speedLoop("scale int and Fraction", speedScaleC);  // ~20 thousand
	log();
	speedLoop("divide number",          speedDivideJ); // ~10 million
	speedLoop("divide int",             speedDivideC); // ~300 thousand
}

function roll() {//make a random integer
	var min = 1;
	var max = 94906265;//square root of 8pb rounded down, so max*max is under javascript's integer ceiling
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//empty and base speed to compare from
function speedEmpty() {
}
function speedBase() {
	var i = roll();
}

//confirm a number is an integer
function speedCheckJ() {
	var i = roll();
	var s = i + "";//turn into text
	var i2 = parseInt(s, 10)//parse back into number
	if (i != i2) log("mistake");//confirm that didn't change it
}
function speedCheckT() {
	var i = roll();
	var s = i + "";//turn into text
	for (var i = 0; i < s.length; i++) {//loop for each character
		var a = s.charCodeAt(i);
		if (a < 48 || a > 57) log("mistake");//make sure it's ascii "0" through "9"
	}
}
function speedCheckC() {
	var i = roll();
	min0(i);
}

//determine if the given number is less than a ceiling
function speedLessJ() {
	var i = roll();
	if (i > 94906265) log("mistake");
}
function speedLessT() {
	var i = roll();
	var s = i + "";//turn into text
	var c = "94906265";
	var b = (s.length == c.length) ? s.localeCompare(c) : s.length - c.length;//compare numerals
	if (b > 0) log("mistake");
}
function speedLessB() {
	var i = roll();
	var b = new platformBigNumber(i);
	if (b.greaterThan(94906265)) log("mistake");
}
function speedLessC() {
	var i = roll();
	if (int(i, ">", 94906265)) log("mistake");
}

//multiply and divide
function speedScaleJ() {
	var i = roll();//integer
	var n = roll();//numerator
	var d = roll();//denominator
	var t = i * n;//top
	var w = Math.floor(t / d);//whole
	var r = t % d;//remainder
	if ((w * d) + r != t) log("mistake");//check
}
function speedScaleB() {
	var i = roll();
	var n = roll();
	var d = roll();
	var t = (new platformBigNumber(i)).times(n);//top
	var w = t.dividedToIntegerBy(d);//whole
	var r = t.mod(d);//remainder
	if (!w.times(d).plus(r).equals(t)) log("mistake");//check
}
function speedScaleC() {
	var i = roll();
	var n = roll();
	var d = roll();
	var t = int(i, "*", n);//top
	var f = Fraction(t, d);//whole and remainder
	if (int(f.whole, "*", d, "+", f.remainder, "!=", t)) log("mistake");//check
}

//divide
function speedDivideJ() {
	var n = roll();//numerator
	var d = roll();//denominator
	var w = divideFast(n, d);//whole
}
function speedDivideC() {
	var n = roll();
	var d = roll();
	var w = divideSafe(n, d);
}

if (demo("speed-check")) { demoSpeedCheck(); }
function demoSpeedCheck() {
	speedLoop("empty",            function() {                                                                              });// ~10m
	speedLoop("base",             function() { roll();                                                                      });// ~10m
	speedLoop("checkNumber",      function() { checkNumber(0);         checkNumber(1);         checkNumber(roll());         });// ~4m
	speedLoop("checkNumberMath",  function() { checkNumberMath(0);     checkNumberMath(1);     checkNumberMath(roll());     });// ~7m
	speedLoop("checkNumerals",    function() { checkNumerals(0+"");    checkNumerals(1+"");    checkNumerals(roll()+"");    });// ~5m
	speedLoop("checkNumeralsFit", function() { checkNumeralsFit(0+""); checkNumeralsFit(1+""); checkNumeralsFit(roll()+""); });// ~5m
}

//    ____ _               _    
//   / ___| |__   ___  ___| | __
//  | |   | '_ \ / _ \/ __| |/ /
//  | |___| | | |  __/ (__|   < 
//   \____|_| |_|\___|\___|_|\_\
//                              

exports.testMin = function(test) {

	function v0(n)      { min0(n);        test.ok(true); }//valid
	function v1(n)      { min1(n);        test.ok(true); }
	function vMin(n, m) { checkMin(n, m); test.ok(true); }

	function i0(n)      { try { min0(n);     test.fail(); } catch (e) { test.ok(true); } }//invalid
	function i1(n)      { try { min1(n);     test.fail(); } catch (e) { test.ok(true); } }
	function iMin(n, m) { try { checkMin(n); test.fail(); } catch (e) { test.ok(true); } }

	v0(0);
	v0(1);
	v0(789);

	i1(0);//invalid
	v1(1);
	v1(789);

	vMin(0, 0);
	vMin(1, 1);
	vMin(789, 789);
	vMin(1000, 789);

	iMin(0, 1);
	iMin(1, 789);

	test.done();
}

exports.testCheckNumber = function(test) {

	function v(n) { checkNumber(n); test.ok(true); }
	function i(n) { try { checkNumber(n); test.fail(); } catch (e) { test.ok(true); } }

	//valid
	v(0);
	v(1);
	v(789);

	//negative
	i(-5);

	//objects
	i();//blank
	i(null);
	i(undefined);
	i("5");//string
	i({a:5});//object
	i([]);//array
	i([5]);//even with a number inside
	i(function() { return 5; });//function that returns a number

	//invalid numbers
	i(NaN);
	i(Infinity);//infinity literal
	i(1/0);//result of divide by zero, infinity
	i(0/0);

	//floats
	v(5.0);//valid, because becomes same as the literal 5
	i(5.5);//invalid, floating point

	//big
	v(Number.MAX_SAFE_INTEGER);
	v(9007199254740991);//max is valid
	i(9007199254740992);//one more is invalid

	//base 8 and 16 literals
	v(077);//63 in octal
	v(0xff);//255 in hexadecimal
	v(1.23e+5);//123000 in exponential

	//decimal and exponential
	v(5.0);//5, decimal with integer value
	i(5.67e-3);//exponential that is decimal
	i(456.789);//decimal literal

	test.done();
}

exports.testCheckNumberMath = function(test) {

	//hit as many of the 7 exceptions in checkNumberMath as you can
	try { checkNumberMath("0");              test.fail(); } catch (e) { test.ok(e.name == "type");     test.ok(e.note == "type");     }//make sure i is a number
	try { checkNumberMath(0/0);              test.fail(); } catch (e) { test.ok(e.name == "bounds");   test.ok(e.note == "nan");      }//not the weird not a number thing
	try { checkNumberMath(1/0);              test.fail(); } catch (e) { test.ok(e.name == "overflow"); test.ok(e.note == "infinity"); }//not too big for floating point
	try { checkNumberMath(9007199254740992); test.fail(); } catch (e) { test.ok(e.name == "overflow"); test.ok(e.note == "max");      }//not too big for int
	try { checkNumberMath(1.5);              test.fail(); } catch (e) { test.ok(e.name == "type");     test.ok(e.note == "floor");    }//a whole number
	try { checkNumberMath(-1);               test.fail(); } catch (e) { test.ok(e.name == "bounds");   test.ok(e.note == "negative"); }//not negative

	test.done();
}

exports.testCheckNumerals = function(test) {

	function v(s) { checkNumerals(s); test.ok(true); }
	function i(s) { try { checkNumerals(s); test.fail(); } catch (e) { test.ok(true); } }

	v("0");
	v("1");
	v("10");
	v("789");
	v("9007199254740991");
	v("9007199254740992");
	v("10000000000000000");

	i();//empty
	i("");//blank
	i(" ");//space
	i("-1");//negative
	i("01");//leading zero
	i("1.2");//decimal
	i("1.0");//decimal integer, invalid as a string

	i((1/0)+"");//Infinity
	i((-1/0)+"");//-Infinity
	i((0/0)+"");//NaN

	i("");//length 0
	v("0");//length 1
	v("1");
	v("9");
	i("01");//length 2+
	v("10");
	i("056");
	v("56");

	test.done();
}

exports.testNumeralsFit = function(test) {

	function v(s) {
		test.ok(numeralsFit(s));
		checkNumeralsFit(s);
		test.ok(true);
	}
	function i(s) {
		test.ok(!numeralsFit(s));
		try {
			checkNumeralsFit(s);
			test.fail();
		} catch (e) { test.ok(true); }
	}

	v(Number.MAX_SAFE_INTEGER+"");//valid

	v("0");//zero
	v("50");//small
	v("9007199254740990");
	v("9007199254740991");//max int valid
	i("9007199254740992");//one more invalid
	i("9007199254740993");
	i("10000000000000000");//way too big

	test.done();
}

//    ____                          _   
//   / ___|___  _ ____   _____ _ __| |_ 
//  | |   / _ \| '_ \ \ / / _ \ '__| __|
//  | |__| (_) | | | \ V /  __/ |  | |_ 
//   \____\___/|_| |_|\_/ \___|_|   \__|
//                                      

exports.testNumeralsToNumber = function(test) {

	function v(s, n) { test.ok(numeralsToNumber(s) == n); }
	function i(s) { try { numeralsToNumber(s); test.fail(); } catch (e) { test.ok(true); } }

	v("0", 0);//common use
	v("1", 1);
	v("5", 5);
	v("10", 10);
	v("789", 789);

	i();//wrong object
	i([]);
	i(Number(1));

	i("05");//leading zero
	i("-7");//negative

	i("");//blank
	i(" ");//space
	i("potato");//a word
	i("-");//punctuation
	i(".");
	i("k");
	i(" 5");//spaces
	i("5 ");
	i(" 5 ");
	i("5 6");

	i("NaN");//other number values and forms
	i("Infinity");
	i("077");//octal
	i("0xff");//hexadecimal
	i("1.23e+5");//exponential
	i("5.67e-3");//negative exponent
	i("456.789");//decimal
	i("5.0");//decimal with integer value

	v("9007199254740991", Number.MAX_SAFE_INTEGER);//biggest number
	i("9007199254740992");

	test.done();
}

exports.testCheckSame = function(test) {

	test.ok(1 == "1");//this is why checkSame has to use !==
	test.ok(1 !== "1");

	function v(a, b) { checkSame(a, b); test.ok(true); }
	function i(a, b) { try { checkSame(a, b); test.fail(); } catch (e) { test.ok(true); } }

	v(1, 1);//valid
	i(1, 2);//invalid

	v();//missing both
	i(1);//second
	v(1, 1);//neither

	i(1, "1");//type must also be the same

	v("hi", "hi");//not just for numbers
	i("hi", "Hi");

	test.done();
}

//    ____                                     
//   / ___|___  _ __ ___  _ __   __ _ _ __ ___ 
//  | |   / _ \| '_ ` _ \| '_ \ / _` | '__/ _ \
//  | |__| (_) | | | | | | |_) | (_| | | |  __/
//   \____\___/|_| |_| |_| .__/ \__,_|_|  \___|
//                       |_|                   

exports.testCompareCheckedNumber = function(test) {

	test.ok(compareCheckedNumber(50, 40) > 0);//positive, reverse order
	test.ok(compareCheckedNumber(50, 50) == 0);//zero, same
	test.ok(compareCheckedNumber(50, 60) < 0);//negative, correct order

	test.ok(compareCheckedNumber(5, 5) == 0);//same
	test.ok(compareCheckedNumber(10, 11) < 0);//same length
	test.ok(compareCheckedNumber(19, 13) > 0);
	test.ok(compareCheckedNumber(11, 111) < 0);//different lengths
	test.ok(compareCheckedNumber(11, 1) > 0);

	var a = [100, 0, 5, 99, 105, Size.pb, 7, 5];//use to sort an array
	a.sort(compareCheckedNumber);
	test.ok(a+"" == "0,5,5,7,99,100,105,1125899906842624");

	test.done()
}

exports.testCompareCheckedNumerals = function(test) {

	test.ok(compareCheckedNumerals("5", "5") == 0);//same
	test.ok(compareCheckedNumerals("10", "11") < 0);//same length
	test.ok(compareCheckedNumerals("19", "13") > 0);
	test.ok(compareCheckedNumerals("10", "100") < 0);//different lengths
	test.ok(compareCheckedNumerals("10", "1")   > 0);

	test.ok(compareCheckedNumerals("11112222333344445555", "11112222333344445555") == 0);//big
	test.ok(compareCheckedNumerals("11112222333344445555", "11112222333344445556") <  0);
	test.ok(compareCheckedNumerals("11112222333344445555", "11112222333344445554") >  0);

	test.ok(compareCheckedNumerals("5555555", "5555557") < 0);
	test.ok(compareCheckedNumerals("5555555", "5555575") < 0);
	test.ok(compareCheckedNumerals("5555555", "5557555") < 0);
	test.ok(compareCheckedNumerals("5555555", "5755555") < 0);
	test.ok(compareCheckedNumerals("5555555", "7555555") < 0);

	test.ok(compareCheckedNumerals("5555555", "5555552") > 0);
	test.ok(compareCheckedNumerals("5555555", "5555525") > 0);
	test.ok(compareCheckedNumerals("5555555", "5552555") > 0);
	test.ok(compareCheckedNumerals("5555555", "5255555") > 0);
	test.ok(compareCheckedNumerals("5555555", "2555555") > 0);

	var a = ["100", "0", "5", "99", "105", "11112222333344445555", "7", "5"];//use to sort an array
	a.sort(compareCheckedNumerals);
	test.ok(a+"" == "0,5,5,7,99,100,105,11112222333344445555");

	test.done()
}

//   ___       _   
//  |_ _|_ __ | |_ 
//   | || '_ \| __|
//   | || | | | |_ 
//  |___|_| |_|\__|
//                 

exports.testIntMake = function(test) {

	function v(n, s) {//valid input and expected numerals
		test.ok(say(int(n)) == s);
		test.ok(say(int(n+"")) == s);
		test.ok(say(int(int(n))) == s);
		test.ok(say(int(new platformBigNumber(n+""))) == s);
	}
	function i(x) {//invalid input
		try {
			int(x);
			test.fail();
		} catch (e) { test.ok(true); }
	}

	v(0, "0");//small
	v(1, "1");
	v(789, "789");

	i();//invalid
	i(-1);
	i("");
	i(Data());
	i([0]);
	i("05");

	v(7*Size.pb,                 "7881299347898368");
	v(Number.MAX_SAFE_INTEGER-1, "9007199254740990");
	v(Number.MAX_SAFE_INTEGER,   "9007199254740991");//max
	v("9007199254740992",        "9007199254740992");//one more

	var googol = "1";//1 with 100 0s
	for (var g = 0; g < 100; g++) googol += "0";
	v(googol, googol);

	test.done();
}

exports.testIntMath = function(test) {

	test.ok(say(int(5, "-", 4)) == "1");//subtract
	test.ok(say(int(5, "-", 5)) == "0");//to zero
	try {
		int(5, "-", 6);//beyond zero
		test.fail();
	} catch (e) { test.ok(true); }

	test.ok(say(int(0, "/", 1)) == "0");//divide 0
	try {
		int(10, "/", 0);//divide by 0
		test.fail();
	} catch (e) { test.ok(true); }

	test.ok(say(int(0, "%", 1)) == "0");//modulo 0
	try {
		int(10, "%", 0);//modulo by 0
		test.fail();
	} catch (e) { test.ok(true); }

	test.ok(int(7, "*", 0, "==", 0));//multiply by 0
	test.ok(int(0, "*", 7, "==", 0));
	test.ok(int("70000000000000000000", "*", 0, "==", 0));
	test.ok(int(0, "*", "70000000000000000000", "==", 0));

	test.done();
}

exports.testIntStep = function(test) {

	function f(start, width, columns, end) {
		var s = int(start);
		var t = s;
		for (var i = 0; i < columns; i++) t = int(t, "+", width);
		var m = int(s, "+", int(width, "*", columns));
		var u = int(t, "+", int(2, "*", width), "-", int(2, "*", width));
		var e = int(end);

		test.ok(say(t) == say(e));
		test.ok(say(m) == say(e));
		test.ok(say(u) == say(e));
	}

	f(100, 5, 20, 200);//small
	f(7*Size.pb, Size.tb, 2000, "10080322603450368");//big

	test.done();
}

exports.testIntScale = function(test) {

	function f(i, n, d) {//integer, numerator, and denominator
		var t = int(i, "*", n);//top
		var w = int(t, "/", d);//whole
		var r = int(t, "%", d);//remainder
		var a = int(w, "*", d, "+", r);
		test.ok(int(a, "==", t));
		test.ok(say(a) == say(t));
	}

	f(10, 10, 15);
	f(Size.pb, 999, 1000);

	test.done();
}

exports.testIntEquals = function(test) {

	test.ok(int(0, "==", 0));//small
	test.ok(int(5, "==", 5));
	test.ok(!int(1, "==", 0));
	test.ok(!int(4, "==", 5));

	test.ok(!int(4, ">", 5));
	test.ok(!int(5, ">", 5));
	test.ok(int(6, ">", 5));

	test.ok(!int(4, ">=", 5));
	test.ok(int(5, ">=", 5));
	test.ok(int(6, ">=", 5));

	test.ok(int(4, "<=", 5));
	test.ok(int(5, "<=", 5));
	test.ok(!int(6, "<=", 5));

	test.ok(int(4, "<", 5));
	test.ok(!int(5, "<", 5));
	test.ok(!int(6, "<", 5));

	test.ok(int("9007199254740991", "==", "9007199254740991"));//boundary
	test.ok(int("9007199254740992", "==", "9007199254740992"));
	test.ok(!int("9007199254740991", "==", "9007199254740992"));
	test.ok(!int("9007199254740993", "==", "9007199254740992"));

	test.ok(!int("9007199254740990", ">", "9007199254740991"));
	test.ok(!int("9007199254740991", ">", "9007199254740991"));
	test.ok(int("9007199254740992", ">", "9007199254740991"));

	test.ok(!int("9007199254740990", ">=", "9007199254740991"));
	test.ok(int("9007199254740991", ">=", "9007199254740991"));
	test.ok(int("9007199254740992", ">=", "9007199254740991"));

	test.ok(int("9007199254740990", "<=", "9007199254740991"));
	test.ok(int("9007199254740991", "<=", "9007199254740991"));
	test.ok(!int("9007199254740992", "<=", "9007199254740991"));

	test.ok(int("9007199254740990", "<", "9007199254740991"));
	test.ok(!int("9007199254740991", "<", "9007199254740991"));
	test.ok(!int("9007199254740992", "<", "9007199254740991"));

	test.ok(int("10000000000000000", "==", "10000000000000000"));//big
	test.ok(int("10000000000000005", "==", "10000000000000005"));
	test.ok(!int("10000000000000001", "==", "10000000000000000"));
	test.ok(!int("10000000000000004", "==", "10000000000000005"));

	test.ok(!int("10000000000000004", ">", "10000000000000005"));
	test.ok(!int("10000000000000005", ">", "10000000000000005"));
	test.ok(int("10000000000000006", ">", "10000000000000005"));

	test.ok(!int("10000000000000004", ">=", "10000000000000005"));
	test.ok(int("10000000000000005", ">=", "10000000000000005"));
	test.ok(int("10000000000000006", ">=", "10000000000000005"));

	test.ok(int("10000000000000004", "<=", "10000000000000005"));
	test.ok(int("10000000000000005", "<=", "10000000000000005"));
	test.ok(!int("10000000000000006", "<=", "10000000000000005"));

	test.ok(int("10000000000000004", "<", "10000000000000005"));
	test.ok(!int("10000000000000005", "<", "10000000000000005"));
	test.ok(!int("10000000000000006", "<", "10000000000000005"));

	test.done();
}

exports.testIntRepeating = function(test) {

	function t(d, n, m, w) {//denominator and numerator, and expected modulo and whole answers
		test.ok(int(n, "/", d, "==", w));//divide
		test.ok(int(n, "%", d, "==", m));//modulo
		test.ok(int(w, "*", d, "+", m, "==", n));//reassemble
	}
	function l(d, n) {//change one to log l instead of test t to see what's going on
		log("# #".fill(int(n, "%", d), int(n, "/", d)));
	}

	t(81, "1",                              1, "0");
	t(81, "10",                            10, "0");
	t(81, "100",                           19, "1");//first set
	t(81, "1000",                          28, "12");
	t(81, "10000",                         37, "123");
	t(81, "100000",                        46, "1234");
	t(81, "1000000",                       55, "12345");
	t(81, "10000000",                      64, "123456");
	t(81, "100000000",                     73, "1234567");
	t(81, "1000000000",                     1, "12345679");//skips 8
	t(81, "10000000000",                   10, "123456790");//repeats these 9 digits
	t(81, "100000000000",                  19, "1234567901");//second set
	t(81, "1000000000000",                 28, "12345679012");
	t(81, "10000000000000",                37, "123456790123");
	t(81, "100000000000000",               46, "1234567901234");
	t(81, "1000000000000000",              55, "12345679012345");
	t(81, "10000000000000000",             64, "123456790123456");
	t(81, "100000000000000000",            73, "1234567901234567");
	t(81, "1000000000000000000",            1, "12345679012345679");
	t(81, "10000000000000000000",          10, "123456790123456790");
	t(81, "100000000000000000000",         19, "1234567901234567901");//third set
	t(81, "1000000000000000000000",        28, "12345679012345679012");
	t(81, "10000000000000000000000",       37, "123456790123456790123");
	t(81, "100000000000000000000000",      46, "1234567901234567901234");
	t(81, "1000000000000000000000000",     55, "12345679012345679012345");
	t(81, "10000000000000000000000000",    64, "123456790123456790123456");
	t(81, "100000000000000000000000000",   73, "1234567901234567901234567");
	t(81, "1000000000000000000000000000",   1, "12345679012345679012345679");
	t(81, "10000000000000000000000000000", 10, "123456790123456790123456790");

	t(7, "22",                   1, "3");
	t(7, "220",                  3, "31");//first set
	t(7, "2200",                 2, "314");
	t(7, "22000",                6, "3142");
	t(7, "220000",               4, "31428");
	t(7, "2200000",              5, "314285");
	t(7, "22000000",             1, "3142857");
	t(7, "220000000",            3, "31428571");//second set
	t(7, "2200000000",           2, "314285714");
	t(7, "22000000000",          6, "3142857142");
	t(7, "220000000000",         4, "31428571428");
	t(7, "2200000000000",        5, "314285714285");
	t(7, "22000000000000",       1, "3142857142857");
	t(7, "220000000000000",      3, "31428571428571");//third set
	t(7, "2200000000000000",     2, "314285714285714");
	t(7, "22000000000000000",    6, "3142857142857142");
	t(7, "220000000000000000",   4, "31428571428571428");
	t(7, "2200000000000000000",  5, "314285714285714285");
	t(7, "22000000000000000000", 1, "3142857142857142857");

	t(3, "1",      1, "0");
	t(3, "10",     1, "3");
	t(3, "100",    1, "33");
	t(3, "1000",   1, "333");
	t(3, "10000",  1, "3333");
	t(3, "100000", 1, "33333");
	t(3, "1000000000000000",     1, "333333333333333");
	t(3, "10000000000000000",    1, "3333333333333333");
	t(3, "100000000000000000",   1, "33333333333333333");
	t(3, "1000000000000000000",  1, "333333333333333333");
	t(3, "10000000000000000000", 1, "3333333333333333333");
	t(3, "1"+repeat("0", 100), 1, repeat("3", 100));//googol/3 = 100 3s
	function repeat(t, n) {//make a string with t repeated n times
		var s = "";
		for (var i = 0; i < n; i++) s += t;
		return s;
	}

	test.done();
}

exports.testIntNumber = function(test) {

	//small
	var i = int(7);
	test.ok(i.hasNumber());
	test.ok(i.toNumber() == 7);

	//biggest
	i = int("9007199254740991");//max safe integer, 8pb-1
	test.ok(i.hasNumber());
	test.ok(i.toNumber()+"" == "9007199254740991");

	//one more
	i = int("9007199254740992");//one more, 8pb
	test.ok(!i.hasNumber());
	try {
		i.toNumber();
		test.fail();
	} catch (e) { test.ok(true); }
	test.ok(say(i) == "9007199254740992");

	//big
	i = int(Size.pb, "*", 10);
	test.ok(!i.hasNumber());
	try {
		i.toNumber();
		test.fail();
	} catch (e) { test.ok(true); }
	test.ok(say(i) == "11258999068426240");

	test.done();
}

exports.testIntMethods = function(test) {

	test.ok(int(7, "*", 8, "==", 56));
	test.ok(int(81, "/", 9, "==", 9));
	test.ok(int(100, "%", 15, "==", 10));

	test.ok(int(1, "+", 2, "==", 3));
	test.ok(int(10, "-", 3, "==", 7));
	test.ok(int(0, "++", "==", 1));
	test.ok(int(1, "--", "==", 0));

	test.ok(int(5, "==", 5));
	test.ok(int(5, "!=", 6));
	test.ok(int(0, "!"));//use like if (!i)
	test.ok(int(1, ""));//use like if (i)
	test.ok(int(5, ""));//use like if (i)

	test.ok(int(5, ">", 4));
	test.ok(!int(5, ">", 5));
	test.ok(!int(5, ">", 6));

	test.ok(!int(5, "<", 4));
	test.ok(!int(5, "<", 5));
	test.ok(int(5, "<", 6));

	test.ok(int(5, ">=", 4));
	test.ok(int(5, ">=", 5));
	test.ok(!int(5, ">=", 6));

	test.ok(!int(5, "<=", 4));
	test.ok(int(5, "<=", 5));
	test.ok(int(5, "<=", 6));

	test.done();
}

exports.testIntParameters = function(test) {

	function v(f) { f(); test.ok(true); }//valid
	function i(f) { try { f(); test.fail(); } catch (e) { test.ok(true); } }//invalid

	i(function() { int(); });//invalid, blank

	v(function() { int(7); });//valid, number

	i(function() { int(7, "=");  });//invalid, unknown operator
	v(function() { int(7, "++"); });//valid, trailing operator
	i(function() { int(7, "+");  });//invalid, missing number

	i(function() { int(7, "=", 4); });//invalid, unknown operator
	v(function() { int(7, "+", 4); });//valid

	i(function() { int(7, "+", 4, "=");  });//invalid, unknown operator
	v(function() { int(7, "+", 4, "++"); });//valid, trailing operator
	i(function() { int(7, "+", 4, "+");  });//invalid, missing number

	i(function() { int(7, "+", 4, "=", 5); });//invalid, unknown operator
	v(function() { int(7, "+", 4, "+", 5); });//valid

	i(function() { int(7, "+", 4, "+", 5, "=");  });//invalid, unknown operator
	v(function() { int(7, "+", 4, "+", 5, "++"); });//valid, trailing operator
	i(function() { int(7, "+", 4, "+", 5, "+");  });//invalid, missing number

	v(function() { int(7, "++");          });//valid, trailing operator
	v(function() { int(7, "++", "++");    });//valid, another trailing operator
	i(function() { int(7, "++", "==");    });//invalid, missing number
	v(function() { int(7, "++", "==", 8); });//valid, trailing followed by paired operators

	test.done();
}

//   ___       _     ___           _     _      
//  |_ _|_ __ | |_  |_ _|_ __  ___(_) __| | ___ 
//   | || '_ \| __|  | || '_ \/ __| |/ _` |/ _ \
//   | || | | | |_   | || | | \__ \ | (_| |  __/
//  |___|_| |_|\__| |___|_| |_|___/_|\__,_|\___|
//                                              

// See which types v has built up with text like "bns" or "--s" for testing
function inside(i) { return "###".fill(i._b === "none" ? "-" : "b", i._n === "none" ? "-" : "n", i._s === "none" ? "-" : "s"); }

exports.testIntInside = function(test) {

	test.ok(inside(int(5))                   == "-ns");//given a small number, Int holds number and string
	test.ok(inside(int("5"))                 == "--s");//given numerals, Int holds just that string
	test.ok(inside(int("11258999068426240")) == "--s");//even if the number is big

	var a = int("3");
	var b = int("4");
	test.ok(inside(a) == "--s");//two small numbers, kept just as strings
	test.ok(inside(b) == "--s");
	var c = int(a, "*", b);
	test.ok(inside(a) == "-ns");//do some math, and they gain numbers inside
	test.ok(inside(b) == "-ns");
	test.ok(inside(c) == "-ns");

	a = int(Size.pb+"");
	b = int("10");
	test.ok(inside(a) == "--s");//two small numbers, kept just as strings
	test.ok(inside(b) == "--s");
	var c = int(a, "*", b);
	test.ok(inside(a) == "b-s");//gained bignumber for math
	test.ok(inside(b) == "--s");//passed to bignumber.js as a string
	test.ok(inside(c) == "b-s");//result is big
	var d = int(c, "/", Size.pb);
	test.ok(inside(c) == "b-s");
	test.ok(inside(d) == "b-s");//d is 10, but still big
	var e = int(d, "+", 2);
	test.ok(inside(d) == "bns");//d gains a number for the small calculation
	test.ok(inside(e) == "-ns");//the answer 12, is just a number

	var f = int("5");//made from numerals
	test.ok(inside(f) == "--s");//has only string
	test.ok(f.toNumber() == 5);//asked for a number
	test.ok(inside(f) == "-ns");//keeps the number also, maybe it'll need it later

	test.done();
}

exports.testSlideRule = function(test) {

	function t(a, b, p, l) {
		p2 = int(a, "*", b);
		l2 = say(p).length;
		test.ok(int(p2, "==", p));
		test.ok(l2 == l);
	}

	/*
	math lets us estimate products by adding logarithms, because slide rule and because duh
	this trick lets int quickly determine if an answer will be small, making it safe to use number operators instead of the big type

	when multiplying base 10 numerals, the longest the answer will be is the length of the two added together
	using all 9s because that's the biggest value in the shortest length, 9*9=81 and 1+1=2, 9*99=891 and 1+2=3, and so on

	_bothFitProduct returns true if the lengths of a and b add up to less than the length of max safe integer
	at the largest case, this means that two numbers of all 9s multiply to all 9s one digit shorter than the max
	because it's one digit shorter, the product is still less
	the source numbers having values of less than all 9s only could make the answer less
	and adding instead of multiplying could also only make the answer less
	so if _bothFitProduct thinks it's safe, it definitely is
	*/

	t(9, 99999999999999,  899999999999991, 15);//1 and 14 9s multiply to 15 digits
	t(99, 9999999999999,  989999999999901, 15);//2 and 13 also do, as do all the others
	t(999, 999999999999,  998999999999001, 15);//3 and 12
	t(9999, 99999999999,  999899999990001, 15);//4 and 11
	t(99999, 9999999999,  999989999900001, 15);//5 and 10
	t(999999, 999999999,  999998999000001, 15);//6 and 9
	t(9999999, 99999999,  999999890000001, 15);//7 and 8

	test.ok((Number.MAX_SAFE_INTEGER+"").length == 16);//max safe integer is 16 digits, so every 15 digit number is small enough

	test.done();
}

exports.testIntBothFitProduct = function(test) {

	var s7 = "9000000";//7, 8, and 9 digit numbers
	var s8 = "90000000";
	var s9 = "900000000";
	test.ok(s7.length == 7);
	test.ok(s8.length == 8);
	test.ok(s9.length == 9);

	var i14 = int(s7, "*", s7);
	var i15 = int(s8, "*", s7);
	var i16 = int(s8, "*", s8);
	var i17 = int(s8, "*", s9);
	test.ok(say(i14).length == 14);
	test.ok(say(i15).length == 15);
	test.ok(say(i16).length == 16);
	test.ok(say(i17).length == 17);

	test.ok((Number.MAX_SAFE_INTEGER+"").length == 16);//the biggest value that number keeps as an integer takes up 16 digits

	test.ok(inside(i14) == "-ns");//14 and 15 digit products must be small, so int multiplied numbers
	test.ok(inside(i15) == "-ns");
	test.ok(inside(i16) == "b-s");//a 16 digit product might be big, so int converted to bignumbers
	test.ok(inside(i17) == "b-s");//a 17 digit product is definitely big

	test.ok(say(i14)                     == "81000000000000");//here are the values we calculated
	test.ok(say(i15)                     == "810000000000000");
	test.ok(say(i16)                     == "8100000000000000");//while a 16 digit number could be bigger than max, this one happens to not be
	test.ok(say(Number.MAX_SAFE_INTEGER) == "9007199254740991");//see that max is bigger
	test.ok(say(i17)                     == "81000000000000000");

	test.ok(i14.hasNumber());
	test.ok(i15.hasNumber());
	test.ok(i16.hasNumber());//kept as big, but could be small
	test.ok(!i17.hasNumber());

	test.ok(i14.toNumber() == 81000000000000);//ask the small ones for numbers
	test.ok(i15.toNumber() == 810000000000000);
	test.ok(i16.toNumber() == 8100000000000000);

	test.ok(inside(i14) == "-ns");
	test.ok(inside(i15) == "-ns");
	test.ok(inside(i16) == "bns");//gained a number

	test.done();
}

//   _____               _   _             
//  |  ___| __ __ _  ___| |_(_) ___  _ __  
//  | |_ | '__/ _` |/ __| __| |/ _ \| '_ \ 
//  |  _|| | | (_| | (__| |_| | (_) | | | |
//  |_|  |_|  \__,_|\___|\__|_|\___/|_| |_|
//                                         

exports.testFractionMultiplyArray = function(test) {

	function v(a, s) {
		test.ok(say(_multiplyArray(a)) == s);
	}
	function i(a) {
		try {
			_multiplyArray(a);
			test.fail();
		} catch (e) {}
	}

	v(0, "0");
	v(5, "5");
	v([5], "5");
	v([5, 2], "10");

	i();
	i("n");
	i([]);
	i(["n"]);
	i([5, "n"]);

	test.done()
}

exports.testFractionBlankZero = function(test) {

	try { Fraction();              test.fail(); } catch (e) { test.ok(true); }
	try { Fraction(1);             test.fail(); } catch (e) { test.ok(true); }
	try { Fraction(1, 1).scale();  test.fail(); } catch (e) { test.ok(true); }
	try { Fraction(1, 1).scale(1); test.fail(); } catch (e) { test.ok(true); }

	var f = Fraction(9, 0);//divide by zero doesn't throw, and returns null instead of a Fraction object
	test.ok(!f);//which is falsey
	var o = {};//unlike even an empty object
	test.ok(o);

	test.ok(Fraction(1, 1));
	test.ok(!Fraction(1, 0));
	test.ok(Fraction(0, 1));//zero in the numerator is ok
	test.ok(say(Fraction(0, 1).whole) == "0");

	test.done()
}

exports.testFractionMath = function(test) {

	function t(f, numerator, denominator, remainder, whole, round, ceiling) {
		test.ok(say(f.numerator)   == say(numerator));
		test.ok(say(f.denominator) == say(denominator));

		test.ok(say(f.remainder)   == say(remainder));
		test.ok(say(f.whole)       == say(whole));
		test.ok(say(f.round)       == say(round));
		test.ok(say(f.ceiling)     == say(ceiling));

		test.ok(int(f.denominator, "*", f.whole, "+", f.remainder, "==", f.numerator));//reassemble
		test.ok(int(f.whole, "+", int(f.remainder, "==", 0) ? 0 : 1, "==", f.ceiling));//presence of remainder adds 1 to get to ceiling
	}
	function l(f) {
		log("#/# remainder# whole# round# ceiling#".fill(f.numerator, f.denominator, f.remainder, f.whole, f.round, f.ceiling));
	}

	//                        remainder grows until whole again
	//                        |  whole goes to 1 at end
	//                        |  |  round goes up at half
	//                        |  |  |  ceiling only zero at the start
	//                        |  |  |  |
	t(Fraction( 0, 4),  0, 4, 0, 0, 0, 0);//quarters
	t(Fraction( 1, 4),  1, 4, 1, 0, 0, 1);
	t(Fraction( 2, 4),  2, 4, 2, 0, 1, 1);
	t(Fraction( 3, 4),  3, 4, 3, 0, 1, 1);
	t(Fraction( 4, 4),  4, 4, 0, 1, 1, 1);

	t(Fraction( 0, 3),  0, 3, 0, 0, 0, 0);//thirds
	t(Fraction( 1, 3),  1, 3, 1, 0, 0, 1);
	t(Fraction( 2, 3),  2, 3, 2, 0, 1, 1);
	t(Fraction( 3, 3),  3, 3, 0, 1, 1, 1);//1
	t(Fraction( 4, 3),  4, 3, 1, 1, 1, 2);
	t(Fraction( 5, 3),  5, 3, 2, 1, 2, 2);
	t(Fraction( 6, 3),  6, 3, 0, 2, 2, 2);//2
	t(Fraction( 7, 3),  7, 3, 1, 2, 2, 3);
	t(Fraction( 8, 3),  8, 3, 2, 2, 3, 3);
	t(Fraction( 9, 3),  9, 3, 0, 3, 3, 3);//3
	t(Fraction(10, 3), 10, 3, 1, 3, 3, 4);
	t(Fraction(11, 3), 11, 3, 2, 3, 4, 4);
	t(Fraction(12, 3), 12, 3, 0, 4, 4, 4);//4

	//                                remainder, whole, round, ceiling
	t(Fraction(   0, 500),    0, 500,         0,     0,     0,       0);//zero
	t(Fraction(   1, 500),    1, 500,         1,     0,     0,       1);

	t(Fraction( 249, 500),  249, 500,       249,     0,     0,       1);
	t(Fraction( 250, 500),  250, 500,       250,     0,     1,       1);//half
	t(Fraction( 251, 500),  251, 500,       251,     0,     1,       1);

	t(Fraction( 499, 500),  499, 500,       499,     0,     1,       1);
	t(Fraction( 500, 500),  500, 500,         0,     1,     1,       1);//one
	t(Fraction( 501, 500),  501, 500,         1,     1,     1,       2);

	t(Fraction( 749, 500),  749, 500,       249,     1,     1,       2);
	t(Fraction( 750, 500),  750, 500,       250,     1,     2,       2);//one and a half
	t(Fraction( 751, 500),  751, 500,       251,     1,     2,       2);

	t(Fraction( 999, 500),  999, 500,       499,     1,     2,       2);
	t(Fraction(1000, 500), 1000, 500,         0,     2,     2,       2);//two
	t(Fraction(1001, 500), 1001, 500,         1,     2,     2,       3);

	t(Fraction(150,             35), 150, 35, 10, 4, 4, 5);//multiply top and bottom
	t(Fraction([150],           35), 150, 35, 10, 4, 4, 5);
	t(Fraction(150,           [35]), 150, 35, 10, 4, 4, 5);
	t(Fraction([1, 150],   [35, 1]), 150, 35, 10, 4, 4, 5);
	t(Fraction([3,  50],   [ 5, 7]), 150, 35, 10, 4, 4, 5);
	t(Fraction([10, 3, 5],      35), 150, 35, 10, 4, 4, 5);

	t(Fraction(0,         50), 0, 50, 0, 0, 0, 0);//zero in the numerator
	t(Fraction([5, 0, 7], 50), 0, 50, 0, 0, 0, 0);

	t(Fraction(1, 2).scale(1, 2), 1, 4, 1, 0, 0, 1);//scale
	t(Fraction(1, 2).scale(1, 3).scale(1, 5), 1, 30, 1, 0, 0, 1);//scale twice
	t(Fraction(10, 3).scale(3, 1), 30, 3, 0, 10, 10, 10);//unlike on an 80s calculator, 10/3*3 doesn't equal 9.9999999!

	t(Fraction([7, Size.kb], 1).scale(  1, 100),   7168, 100, 68, 71,     72,   72);//1% of 7kb
	t(Fraction([7, Size.kb], 1).scale( 50, 100), 358400, 100,  0, 3584, 3584, 3584);//50%
	t(Fraction([7, Size.kb], 1).scale( 99, 100), 709632, 100, 32, 7096, 7096, 7097);//99%
	t(Fraction([7, Size.kb], 1).scale(100, 100), 716800, 100,  0, 7168, 7168, 7168);//100%

	//use scale to see as many decimal places as you want
	t(Fraction(1, 3).scale("1",                   1), "1",                   3, 1, "0",                  "0",                  "1");
	t(Fraction(1, 3).scale("1000",                1), "1000",                3, 1, "333",                "333",                "334");
	t(Fraction(1, 3).scale("1000000",             1), "1000000",             3, 1, "333333",             "333333",             "333334");
	t(Fraction(1, 3).scale("1000000000000000000", 1), "1000000000000000000", 3, 1, "333333333333333333", "333333333333333333", "333333333333333334");

	test.done();
}

//   ____              
//  / ___|  __ _ _   _ 
//  \___ \ / _` | | | |
//   ___) | (_| | |_| |
//  |____/ \__,_|\__, |
//               |___/ 

exports.testSayFractionPattern = function(test) {//test sayFraction with the string patterns #, #%, #/s, and #.###

	function l(s1, s2) { log(s1); log(s2);; }
	function t(s1, s2) { test.ok(s1 == s2); }

	t(sayFraction(Fraction(10, 2), "#"),     "5");
	t(sayFraction(Fraction(10, 2), "#.#"),   "5.0");
	t(sayFraction(Fraction(10, 2), "#.###"), "5.000");

	t(sayFraction(Fraction(1, 10), "#%"),     "10%");
	t(sayFraction(Fraction(1, 10), "#.#%"),   "10.0%");
	t(sayFraction(Fraction(1, 10), "#.###%"), "10.000%");

	t(sayFraction(Fraction(5, Time.second), "#/s"),     "5/s");
	t(sayFraction(Fraction(5, Time.second), "#.#/s"),   "5.0/s");
	t(sayFraction(Fraction(5, Time.second), "#.###/s"), "5.000/s");

	done(test);
}

exports.testSayFractionRemainder = function(test) {//test sayFraction with remainder options whole, round, and ceiling

	function c(d, r) {//compose a variety of the forms individually
		return("# # # # # # # # #".fill(
			sayFraction(d, "#/#",       r),//pass in remainder option
			sayFraction(d, "#",         r),
			sayFraction(d, "#.#",       r),
			sayFraction(d, "#.###",     r),
			sayFraction(d, "#.######",  r),
			sayFraction(d, "#%",        r),
			sayFraction(d, "#.#%",      r),
			sayFraction(d, "#.###%",    r),
			sayFraction(d, "#.######%", r)));
	}

	function l(d, r, s) { log(c(d, r)); }//log the result
	function t(d, r, s) { test.ok(c(d, r) == s); }//test the result

	//nothing and everything
	t(Fraction(0, 1), "whole", "0/1 0 0.0 0.000 0.000000 0% 0.0% 0.000% 0.000000%");
	t(Fraction(1, 1), "whole", "1/1 1 1.0 1.000 1.000000 100% 100.0% 100.000% 100.000000%");

	//small and big
	t(Fraction(1,    100), "whole", "1/100 0 0.0 0.010 0.010000 1% 1.0% 1.000% 1.000000%");
	t(Fraction(1,   1000), "whole", "1/1,000 0 0.0 0.001 0.001000 0% 0.1% 0.100% 0.100000%");
	t(Fraction(1, 100000), "whole", "1/100,000 0 0.0 0.000 0.000010 0% 0.0% 0.001% 0.001000%");
	t(Fraction(100,    1), "whole", "100/1 100 100.0 100.000 100.000000 10,000% 10,000.0% 10,000.000% 10,000.000000%");
	t(Fraction(1000,   1), "whole", "1,000/1 1,000 1,000.0 1,000.000 1,000.000000 100,000% 100,000.0% 100,000.000% 100,000.000000%");

	//whole, round, and ceiling
	t(Fraction(1, 3), "whole",   "1/3 0 0.3 0.333 0.333333 33% 33.3% 33.333% 33.333333%");//less than half, whole matches round
	t(Fraction(1, 3), "round",   "1/3 0 0.3 0.333 0.333333 33% 33.3% 33.333% 33.333333%");
	t(Fraction(1, 3), "ceiling", "1/3 1 0.4 0.334 0.333334 34% 33.4% 33.334% 33.333334%");

	t(Fraction(1, 2), "whole",   "1/2 0 0.5 0.500 0.500000 50% 50.0% 50.000% 50.000000%");
	t(Fraction(1, 2), "round",   "1/2 1 0.5 0.500 0.500000 50% 50.0% 50.000% 50.000000%");//exactly half, round matches ceiling
	t(Fraction(1, 2), "ceiling", "1/2 1 0.5 0.500 0.500000 50% 50.0% 50.000% 50.000000%");

	t(Fraction(2, 3), "whole",   "2/3 0 0.6 0.666 0.666666 66% 66.6% 66.666% 66.666666%");
	t(Fraction(2, 3), "round",   "2/3 1 0.7 0.667 0.666667 67% 66.7% 66.667% 66.666667%");//more than half, round matches ceiling
	t(Fraction(2, 3), "ceiling", "2/3 1 0.7 0.667 0.666667 67% 66.7% 66.667% 66.666667%");

	t(Fraction(2, 2), "whole",   "2/2 1 1.0 1.000 1.000000 100% 100.0% 100.000% 100.000000%");
	t(Fraction(2, 2), "round",   "2/2 1 1.0 1.000 1.000000 100% 100.0% 100.000% 100.000000%");
	t(Fraction(2, 2), "ceiling", "2/2 1 1.0 1.000 1.000000 100% 100.0% 100.000% 100.000000%");

	//repeating decimals
	t(Fraction(22, 7), "whole",   "22/7 3 3.1 3.142 3.142857 314% 314.2% 314.285% 314.285714%");
	t(Fraction(22, 7), "round",   "22/7 3 3.1 3.143 3.142857 314% 314.3% 314.286% 314.285714%");
	t(Fraction(22, 7), "ceiling", "22/7 4 3.2 3.143 3.142858 315% 314.3% 314.286% 314.285715%");

	t(Fraction(1, 81), "whole",   "1/81 0 0.0 0.012 0.012345 1% 1.2% 1.234% 1.234567%");
	t(Fraction(1, 81), "round",   "1/81 0 0.0 0.012 0.012346 1% 1.2% 1.235% 1.234568%");
	t(Fraction(1, 81), "ceiling", "1/81 1 0.1 0.013 0.012346 2% 1.3% 1.235% 1.234568%");

	t(Fraction(100, 81), "whole",   "100/81 1 1.2 1.234 1.234567 123% 123.4% 123.456% 123.456790%");
	t(Fraction(100, 81), "round",   "100/81 1 1.2 1.235 1.234568 123% 123.5% 123.457% 123.456790%");
	t(Fraction(100, 81), "ceiling", "100/81 2 1.3 1.235 1.234568 124% 123.5% 123.457% 123.456791%");

	done(test);
}

exports.testSayUnitPerUnit = function(test) {

	var f;
	function l(s1, s2) { log(s1); }
	function t(s1, s2) { test.ok(s1 == s2); }

	//unit per unit, like an average test score

	var assignments = 2;//assignments
	var points = 85 + 95;//grades
	var f = Fraction(points, assignments);
	t(sayUnitPerUnit(f), "90");
	t(sayUnitPerUnit(f, "#.##"), "90.00");
	t(sayUnitPerUnit(f, "#.## (#/#)"), "90.00 (180/2)");

	f = Fraction(3, 2);
	t(sayUnitPerUnit(f), "1");
	t(sayUnitPerUnit(f, "#", "round"), "2");
	t(sayUnitPerUnit(f, "#.## (#/#)"), "1.50 (3/2)");

	t(sayUnitPerUnit(Fraction(10, 5), "#.###"), "2.000");

	f = Fraction(22, 700);
	t(sayUnitPerUnit(f, "# #/#"),                  "0 22/700");
	t(sayUnitPerUnit(f, "#.#### #/#"),        "0.0314 22/700");
	t(sayUnitPerUnit(f, "#% #/#"),                "3% 22/700");
	t(sayUnitPerUnit(f, "#.####% #/#"),      "3.1428% 22/700");
	t(sayUnitPerUnit(f, "#% #/#",   "ceiling"),   "4% 22/700");
	t(sayUnitPerUnit(f, "#.#% #/#", "ceiling"), "3.2% 22/700");

	//size per size, like progress within a file

	f = Fraction(2*Size.mb, 3*Size.mb);//2mb downloaded of a 3mb file
	t(saySizePerSize(f),               "0");
	t(saySizePerSize(f, "#.##"),       "0.66");
	t(saySizePerSize(f, "#", "round"), "1");//essentially rounding up to 100%
	t(saySizePerSize(f, "#% - #/#"),                                   "66% - 2mb 0kb 0b/3mb 0kb 0b");
	t(sayFraction(f, "#% - #/#", "whole", commas, saySize4, saySize4), "66% - 2048kb/3072kb");//switch to sayFraction to customize with saySize4

	f = Fraction(Size.tb-1, Size.tb);//nearly done
	t(saySizePerSize(f, "#% #/#"), "99% 1023gb 1023mb 1023kb 1023b/1tb 0gb 0mb 0kb 0b");
	t(saySizePerSize(f, "#.###################%"), "99.9999999999090505298%");
	t(sayFraction(f, "#/#", "whole", commas, saySize4, saySize4), "1023gb/1024gb");//rounds down

	//time per time, like how much of a timer has elapsed

	f = Fraction(30*Time.minute, Time.hour);
	t(sayTimePerTime(f, "#% #/#"), "50% 30m 0.000s/1h 0m 0.000s");

	//unit per size, like the number of requests in a file

	var requests = 10000;
	var fileSize = 800*Size.mb;
	f = Fraction(requests, fileSize);//10,000 requests within a 800mb file
	t(sayUnitPerSize(f, "#.######## (#/#)"), "0.00001192 (10,000/800mb 0kb 0b)");//requests per byte, too small to be useful this way
	t("# (#/#)".fill(//split apart for more granular customization
		sayFraction(f.scale(Size.mb, 1), "#.### requests/mb"),//multiply to per megabyte
		items(f.numerator, "request"),
		saySize(f.denominator)),
		"12.500 requests/mb (10,000 requests/800mb 0kb 0b)");

	//unit per time, like the rate a server can receive packets

	f = Fraction(1000000, Time.day);//a million udp packets a day
	t(sayUnitPerTime(f), "0");//round down to 0 packets per millisecond
	t(sayUnitPerTime(f, "#.### (#/#)"), "0.011 (1,000,000/1d 0h 0m 0.000s)");//1 hundredth packet on average per millisecond
	t("# packets/minute (# packets/#)".fill(//let's see it per minute
		sayFraction(f.scale(Time.minute, 1)),
		commas(f.numerator),
		sayTime(f.denominator)),
		"694 packets/minute (1,000,000 packets/1d 0h 0m 0.000s)");

	//size per unit, like the average packet size

	f = Fraction(Size.mb, 5);
	t(saySizePerUnit(f, "#/piece (#/#)"), "204kb 819b/piece (1mb 0kb 0b/5)");

	//size per time, like data transfer speed

	f = Fraction(Size.mb, Time.minute);//got a megabyte in a minute
	t(saySizePerTime(f), "17b");//that's 17 bytes per millisecond, as 17byte * 1000milliseconds/second * 60seconds/minute / 1024bytes/kb / 1024kb/mb gets to 1
	t(sayFraction(f, "#.#####"),         "17.47626");//this many, to be exact
	t(sayFraction(f, "#.####", "whole"), "17.4762");//round down
	t(sayFraction(f, "#.####", "round"), "17.4763");//rounds up
	t(sayFraction(f, "#"),   "17");//17 bytes per millisecond
	t(sayFraction(f, "#/s"), "17,476/s");//17,476 bytes per second
	t(saySizePerTime(f, "# (#/#)"),     "17b (1mb 0kb 0b/1m 0.000s)");
	t(saySizePerTime(f, "#.### (#/#)"), "17b (1mb 0kb 0b/1m 0.000s)");//using #.### here doesn't make sense, and is correctly ignored
	t(saySizePerTime(f, "#/s (#/#)"),   "17kb 68b/s (1mb 0kb 0b/1m 0.000s)");

	f = Fraction(Size.tb, Time.hour);
	t(saySizePerTime(f,   "# (#/#)"),                        "298kb 267b (1tb 0gb 0mb 0kb 0b/1h 0m 0.000s)");//per millisecond
	t(saySizePerTime(f, "#/s (#/#)"),                "291mb 277kb 632b/s (1tb 0gb 0mb 0kb 0b/1h 0m 0.000s)");//per second
	t(sayFraction(f,    "#/s (#/#)", "whole", saySize4, saySize4, sayTime), "291mb/s (1024gb/1h 0m 0.000s)");

	//time per unit, like how long it took to get a file on average

	var took = 3*Time.hour;
	var files = 789;
	f = Fraction(took, files);//suppose it took us 3 hours to get a collection of 789 files
	t(sayTimePerUnit(f), "13.688s");//on average, we got a file every 14 seconds
	t(sayTimePerUnit(f, "# (#/#)"), "13.688s (3h 0m 0.000s/789)");

	//time per size, like how long it takes a slow connection to upload a megabyte

	f = Fraction(10*Time.second, 5*Size.mb);//in 10 seconds we send 5 megabytes
	t(sayFraction(f, "#.######"), "0.001907");//f is in milliseconds per byte, it takes less than a thousandth to send each single byte
	t(sayFraction(f.scale(Size.mb, 1)), "2,000");//convert to milliseconds per megabyte to get 2,000 milliseconds, 2 seconds, to send a megabyte
	t(sayTimePerSize(f.scale(Size.mb, 1)), "2.000s");//uses sayTime, which takes milliseconds, not seconds
	t("#/mb (#/#)".fill(
		sayTimePerSize(f.scale(Size.mb, 1)),
		sayTime(f.numerator),
		saySize(f.denominator)),
		"2.000s/mb (10.000s/5mb 0kb 0b)");//seconds per megabyte

	done(test);
}

exports.testSayUnitPerUnitMore = function(test) {

	//average test scores
	test.ok(sayUnitPerUnit(Fraction(5,   1), "#.### (#/#)", "round") ==  "5.000 (5/1)");
	test.ok(sayUnitPerUnit(Fraction(15,  3), "#.### (#/#)", "round") ==  "5.000 (15/3)");
	test.ok(sayUnitPerUnit(Fraction(100, 3), "#.### (#/#)", "round") == "33.333 (100/3)");
	test.ok(sayUnitPerUnit(Fraction(200, 3), "#.### (#/#)", "round") == "66.667 (200/3)");//rounds up or down

	//events per second
	test.ok(sayUnitPerTime(Fraction(5,  Time.second), "#.###/s (#/#)", "round") == "5.000/s (5/1.000s)");
	test.ok(sayUnitPerTime(Fraction(90, Time.minute), "#.###/s (#/#)", "round") == "1.500/s (90/1m 0.000s)");

	//average packet size
	test.ok(saySizePerUnit(Fraction(Size.mb,      1), "# (#/#)") == "1mb 0kb 0b (1mb 0kb 0b/1)");
	test.ok(saySizePerUnit(Fraction(Size.kb,      7), "# (#/#)") == "146b (1kb 0b/7)");
	test.ok(saySizePerUnit(Fraction(Size.tb, 123456), "# (#/#)") == "8mb 505kb 373b (1tb 0gb 0mb 0kb 0b/123,456)");

	//data transfer speed
	test.ok(saySizePerTime(Fraction(Size.mb,    Time.second), "#/s (#/#)") == "1mb 0kb 0b/s (1mb 0kb 0b/1.000s)");
	test.ok(saySizePerTime(Fraction(60*Size.kb, Time.minute), "#/s (#/#)") == "1kb 0b/s (60kb 0b/1m 0.000s)");
	test.ok(saySizePerTime(Fraction(90*Size.kb, Time.minute), "#/s (#/#)") == "1kb 512b/s (90kb 0b/1m 0.000s)");
	test.ok(saySizePerTime(Fraction(Size.tb,    Time.day),    "#/s (#/#)") == "12mb 139kb 581b/s (1tb 0gb 0mb 0kb 0b/1d 0h 0m 0.000s)");

	test.done();
}

exports.testSayDivide = function(test) {

	function f(n, d, p, s) { test.ok(sayUnitPerUnit(Fraction(n, d), p) == s); }
	function l(n, d, p, s) { log(sayUnitPerUnit(Fraction(n, d), p), " ",  s); }

	f(   1, 2, "#.###",     "0.500");
	f(  10, 3, "#.###",     "3.333");
	f(3000, 2, "#.###", "1,500.000");

	f(3227, 555, "#",      "5");
	f(3227, 555, "#.#",    "5.8");
	f(3227, 555, "#.##",   "5.81");
	f(3227, 555, "#.###",  "5.814");
	f(3227, 555, "#.####", "5.8144");

	f(22, 7, "#",             "3");
	f(22, 7, "#.#",           "3.1");
	f(22, 7, "#.##",          "3.14");
	f(22, 7, "#.###",         "3.142");
	f(22, 7, "#.####",        "3.1428");
	f(22, 7, "#.#####",       "3.14285");
	f(22, 7, "#.######",      "3.142857");
	f(22, 7, "#.#######",     "3.1428571");
	f(22, 7, "#.########",    "3.14285714");
	f(22, 7, "#.#########",   "3.142857142");
	f(22, 7, "#.##########",  "3.1428571428");
	f(22, 7, "#.###########", "3.14285714285");

	f(1, 0, "#.###", "");//divide by zero returns blank

	test.done();
}

exports.testSayPercent = function(test) {

	test.ok(sayUnitPerUnit(Fraction(1, 2),   "#.###% #/#") == "50.000% 1/2");
	test.ok(sayUnitPerUnit(Fraction(10, 30), "#.###% #/#") == "33.333% 10/30");
	test.ok(sayUnitPerUnit(Fraction(1, 0),   "#.###% #/#") == "");//divide by zero returns blank
	test.done();
}

exports.testSayProgress = function(test) {

	function t(a, b) { test.ok(a == b); }
	function l(a, b) { log(); log(a); log(b); }

	t(sayFraction(Fraction(1, 2),                     "#% #/#",   "whole", commas, saySize4, saySize4), "50% 1b/2b");
	t(sayFraction(Fraction(1122*Size.mb, 18*Size.gb), "#% #/#",   "whole", commas, saySize4, saySize4), "6% 1122mb/18gb");
	t(sayFraction(Fraction(987*Size.kb, 5*Size.mb),   "#% #/#",   "whole", commas, saySize4, saySize4), "19% 987kb/5120kb");
	t(sayFraction(Fraction(555*Size.mb, 7*Size.gb),   "#% #/#",   "whole", commas, saySizeK, saySizeK), "7% 568,320kb/7,340,032kb");
	t(sayFraction(Fraction(Size.mb, 0),               "#% #/#",   "whole", commas, saySize4, saySize4), "");//divide by zero returns blank

	var f = Fraction(Size.mb, 2*Size.mb);//two lines, but easy to customize further
	t("# #/#".fill(sayFraction(f, "#.#%"), saySizeK(f.numerator, 1), saySizeK(f.denominator, 1)), "50.0% 1,024.0kb/2,048.0kb");
	test.done();
}





















//   _   _       _ _       
//  | | | |_ __ (_) |_ ___ 
//  | | | | '_ \| | __/ __|
//  | |_| | | | | | |_\__ \
//   \___/|_| |_|_|\__|___/
//                         

exports.testUnits = function(test) {

	test.ok(Size.kb == 1024);
	Size.kb = 5;//this won't change it, but also won't throw an exception
	test.ok(Size.kb == 1024);//make sure Objet.freeze() worked

	test.done();
}

exports.testSizeBig = function(test) {

	var i = int(1);
	test.ok(int(i, "==", Size.b));
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.kb)); test.ok(say(i) == "1024");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.mb)); test.ok(say(i) == "1048576");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.gb)); test.ok(say(i) == "1073741824");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.tb)); test.ok(say(i) == "1099511627776");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.pb)); test.ok(say(i) == "1125899906842624");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.eb)); test.ok(say(i) == "1152921504606846976");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.zb)); test.ok(say(i) == "1180591620717411303424");
	i = int(i, "*", 1024); test.ok(int(i, "==", Size.yb)); test.ok(say(i) == "1208925819614629174706176");

	test.done();
}










//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

// now, When, earlier, recent, Duration

exports.testWhenImmutable = function(test) {

	var w = now();//remember the time right now
	var time = w.time;//get it
	w.time = 7;//try to change it
	test.ok(time == w.time);//confirm that didn't work

	test.done();
}

exports.testWhen = function(test) {

	//load a saved time
	var w = When(1030338738133);
	if      (timeZone == "m") test.ok(w.text() == "2002 Aug 25 Sun 11:12p 18.133s");
	else if (timeZone == "e") test.ok(w.text() == "2002 Aug 26 Mon 1:12a 18.133s");

	test.done();
}

exports.testDuration = function(test) {

	try {
		Duration();//must have start time
		test.fail();
	} catch (e) {}
	Duration(When(1));//you can omit end time to use now
	Duration(When(1), When(1));//start and finish can be the same
	Duration(When(1), When(2));//finish can be later
	try {
		Duration(When(2), When(1));//start must be before finish
		test.fail();
	} catch (e) { test.ok(e.name = "bounds"); }

	var d = Duration(When(Time.year), When(Time.year + 10*Time.second));//test the parts
	test.ok(d.start.time = Time.year);
	test.ok(d.finish.time = Time.year + 10*Time.second);
	test.ok(d.time = 10*Time.second);
	if (timeZone == "e") test.ok(say(d) == "1971 Jan 1 Fri 1:00a 10.000s after 10.000s");

	var w = When(Time.year);
	w.duration(When(Time.year + 5*Time.minute));//make one from a when
	test.ok(w.time = 5*Time.minute);

	test.done();
}
















//put this in measure number to watch out for it
/*
	test.ok((0 < 1) == true);
	test.ok((undefined < 1) == false);
*/






/*
log("hi");

var d = new Date();
log(d);//text for the user
log(d.getTime());//number of milliseconds since 1970
log(Date.now());
log(typeof Date.now());//number
*/







exports.testStripeFrozen = function(test) {

/*
	log("hi");

	var s = Stripe2(0, 1);
	log(s.text());
	log(s.text2);

	s.w = 2;//doesn't throw
	log(s.text());//still 1
	log(s.text2);
	*/




	test.done();
}

















//    ____      _ _                  
//   / ___|   _| | |_ _   _ _ __ ___ 
//  | |  | | | | | __| | | | '__/ _ \
//  | |__| |_| | | |_| |_| | | |  __/
//   \____\__,_|_|\__|\__,_|_|  \___|
//                                   









//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         

exports.testCommas = function(test) {

	test.ok(commas("1")        ==          "1");
	test.ok(commas("1234")     ==      "1,234");
	test.ok(commas("12345")    ==     "12,345");
	test.ok(commas("12345678") == "12,345,678");

	test.ok(commas("1",       3) ==     "0.001");
	test.ok(commas("12",      3) ==     "0.012");
	test.ok(commas("12345",   3) ==    "12.345");
	test.ok(commas("1234567", 3) == "1,234.567");

	test.done();
}

exports.testItems = function(test) {

	test.ok(items(0, "apple") == "0 apples");
	test.ok(items(1, "apple") == "1 apple");
	test.ok(items(2, "apple") == "2 apples");

	test.ok(items(12345, "apple") == "12,345 apples");

	test.done();
}









//   ____  _         
//  / ___|(_)_______ 
//  \___ \| |_  / _ \
//   ___) | |/ /  __/
//  |____/|_/___\___|
//                   

exports.testSaySize = function(test) {

	function f(n, s) {
		test.ok(saySize(n) == s);
	}

	f(0, "0b");
	f(1, "1b");

	f(1023, "1023b");
	f(1024, "1kb 0b");//smaller units are zero
	f(1025, "1kb 1b");

	f((5*Size.mb) + 7, "5mb 0kb 7b");//0kb in the middle
	f(Size.tb, "1tb 0gb 0mb 0kb 0b");
	f(Size.tb - 1, "1023gb 1023mb 1023kb 1023b");//one byte less than the unit
	f(Number.MAX_SAFE_INTEGER, "7pb 1023tb 1023gb 1023mb 1023kb 1023b");//largest int as a number of bytes is 8pb - 1

	//TODO add some bigger ones to show it works on values that would overflow number

	test.done();
}

exports.testSaySize4 = function(test) {

	test.ok(saySize4(0) == "0b");
	test.ok(saySize4(5) == "5b");
	test.ok(saySize4(9999) == "9999b");
	test.ok(saySize4(10000) == "9kb");

	test.ok(saySize4(256 * Size.kb) == "256kb");
	test.ok(saySize4(5 * Size.gb) == "5120mb");
	test.ok(saySize4(Size.tb) == "1024gb");

	test.ok(saySize4(Number.MAX_SAFE_INTEGER) == "8191tb");

	test.ok(saySize4(1)                == "1b");
	test.ok(saySize4(10)               == "10b");
	test.ok(saySize4(100)              == "100b");
	test.ok(saySize4(1000)             == "1000b");
	test.ok(saySize4(10000)            == "9kb");
	test.ok(saySize4(100000)           == "97kb");
	test.ok(saySize4(1000000)          == "976kb");
	test.ok(saySize4(10000000)         == "9765kb");
	test.ok(saySize4(100000000)        == "95mb");
	test.ok(saySize4(1000000000)       == "953mb");
	test.ok(saySize4(10000000000)      == "9536mb");
	test.ok(saySize4(100000000000)     == "93gb");
	test.ok(saySize4(1000000000000)    == "931gb");
	test.ok(saySize4(10000000000000)   == "9313gb");
	test.ok(saySize4(100000000000000)  == "90tb");
	test.ok(saySize4(1000000000000000) == "909tb");

	test.done();
}

exports.testSaySizeUnits = function(test) {

	var n = 5 * Size.gb;
	test.ok(saySizeB(n) == "5,368,709,120b");
	test.ok(saySizeK(n) == "5,242,880kb");
	test.ok(saySizeM(n) == "5,120mb");
	test.ok(saySizeG(n) == "5gb");
	test.ok(saySizeT(n) == "0tb");
	test.ok(saySizeP(n) == "0pb");

	n = Number.MAX_SAFE_INTEGER;
	test.ok(saySizeB(n)  == "9,007,199,254,740,991b");
	test.ok(saySizeK(n) == "8,796,093,022,208kb");
	test.ok(saySizeM(n) == "8,589,934,592mb");
	test.ok(saySizeG(n) == "8,388,607gb");
	test.ok(saySizeT(n) == "8,191tb");
	test.ok(saySizeP(n) == "7pb");

	test.ok(saySizeB(9876543210, 3) == "9,876,543,210.000b");
	test.ok(saySizeK(9876543210, 3) == "9,645,061.729kb");
	test.ok(saySizeM(9876543210, 3) == "9,419.006mb");
	test.ok(saySizeG(9876543210, 3) == "9.198gb");
	test.ok(saySizeT(9876543210, 3) == "0.008tb");
	test.ok(saySizeP(9876543210, 3) == "0.000pb");

	test.ok(saySizeG(9876543210, 0) == "9gb");
	test.ok(saySizeG(9876543210, 1) == "9.1gb");
	test.ok(saySizeG(9876543210, 2) == "9.19gb");
	test.ok(saySizeG(9876543210, 3) == "9.198gb");
	test.ok(saySizeG(9876543210, 4) == "9.1982gb");
	test.ok(saySizeG(9876543210, 5) == "9.19824gb");

	test.done();
}










//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

exports.testSaySpeed = function(test) {

	test.ok(sayFraction(Fraction([10, Size.mb], [2, Time.second]), "#/s", "whole", saySize4) == "5120kb/s");//10mb in 2s is 5mb/s
	test.ok(sayFraction(Fraction(1, 0),                            "#/s", "whole", saySize4) == "");//show the user blank instead of throwing on divide by zero

	function f(b, s) {//b is bytes per second
		test.ok(sayFraction(Fraction(b, Time.second), "#/s", "whole", saySize4) == s);
	}

	f(9, "9b/s");
	f(89, "89b/s");
	f(789, "789b/s");
	f(6789, "6789b/s");
	f(56789, "55kb/s");
	f(456789, "446kb/s");
	f(3456789, "3375kb/s");
	f(23456789, "22mb/s");
	f(123456789, "117mb/s");

	test.done();
}

exports.testSaySpeedKbps = function(test) {

	test.ok(saySpeedKbps(Fraction(Size.mb, Time.hour)) ==    "0.28kb/s");
	test.ok(saySpeedKbps(Fraction(Size.gb, Time.hour)) ==     "291kb/s");
	test.ok(saySpeedKbps(Fraction(Size.tb, Time.hour)) == "298,261kb/s");//this one pokes above max int

	function f(b, s) {//b is bytes per second
		test.ok(saySpeedKbps(Fraction(b, Time.second)) == s);
	}

	f(0, "0.00kb/s");
	f(1, "0.00kb/s");//one byte per second

	f(Size.kb, "1.00kb/s");//exactly one kilobyte
	f(Size.kb - 1, "0.99kb/s");//one byte less
	f(Fraction(Size.kb, 2).whole, "0.50kb/s");//half a kilobyte
	f(Size.mb, "1,024kb/s");//megabyte

	f(9, "0.00kb/s");
	f(89, "0.08kb/s");
	f(789, "0.77kb/s");
	f(6789, "6.62kb/s");
	f(56789, "55.4kb/s");
	f(456789, "446kb/s");
	f(3456789, "3,375kb/s");
	f(23456789, "22,907kb/s");
	f(123456789, "120,563kb/s");

	test.done();
}

exports.testSaySpeedTimePerMegabyte = function(test) {

	function f(b, s) {//b is bytes per second
		test.ok(saySpeedTimePerMegabyte(Fraction(b, Time.second)) == s);
	}

	f(0, "");//say blank instead of forever
	f(1, "12d/mb");//at 1 byte a second, it takes 12 days to get a megabyte
	f(2, "6d/mb");//twice that speed, half the time

	f(Size.mb, "1s/mb");//1mb/s is 1s/mb
	f(Size.mb + 1, "");//say blank instead of "0s/mb"

	test.done();
}










//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

exports.testSayTime = function(test) {

	function f(t, s) {
		test.ok(sayTime(t) == s);
	}

	f(0,    "0.000s");
	f(1,    "0.001s");
	f(56,   "0.056s");
	f(1500, "1.500s");

	f(59*Time.second + 21, "59.021s");
	f(90*Time.second, "1m 30.000s");
	f(Time.hour, "1h 0m 0.000s");//smaller units are zero
	f(Time.hour + 2000, "1h 0m 2.000s");//0m in the middle

	f(2*Time.day + 3*Time.hour + 4*Time.minute + 5*Time.second + 6, "2d 3h 4m 5.006s");

	f(Number.MAX_SAFE_INTEGER, "285,420y 11m 1d 13h 29m 0.991s");//largest int as an amount of time is 285 thousand years

	f(Time.minute - 1, "59.999s");//one millisecond less than the unit
	f(Time.year - 1, "11m 30d 10h 29m 59.999s");

	test.done();
}

exports.testSayTimeRemaining = function(test) {

	function f(t, s) {
		test.ok(sayTimeRemaining(t) == s);
	}

	// "0s" to "59s"
	f(0, "0s");
	f(23*Time.second, "23s");
	f(Time.minute - 1, "59s");

	// "1m 0s" to "9m 59s"
	f(Time.minute, "1m 0s");
	f(62*Time.second, "1m 2s");
	f(10*Time.minute - 1, "9m 59s");

	// "10m" to "59m"
	f(10*Time.minute, "10m");
	f(45*Time.minute, "45m");
	f(Time.hour - 1, "59m");

	// "1h 0m" to "9h 59m"
	f(Time.hour, "1h 0m");
	f(90*Time.minute, "1h 30m");
	f(10*Time.hour - 1, "9h 59m");

	// "10h" to "71h"
	f(10*Time.hour, "10h");
	f(48*Time.hour, "48h");
	f(3*Time.day - 1, "71h");

	// "3d" and up
	f(3*Time.day, "3d");
	f(14*Time.day, "14d");

	//coarse
	function coarse(t, s, sCoarse) {
		test.ok(sayTimeRemaining(t) == s);
		test.ok(sayTimeRemainingCoarse(t) == sCoarse);
	}
	coarse(1*Time.second, "1s", "1s");
	coarse(4*Time.second, "4s", "4s");
	coarse(6*Time.second, "6s", "5s");
	coarse(9*Time.second, "9s", "5s");
	coarse(11*Time.second, "11s", "10s");
	coarse(14*Time.second, "14s", "10s");

	test.done();
}

exports.testSayTimeRace = function(test) {

	function f(t, s) {
		test.ok(sayTimeRace(t) == s);
	}

	f(0, "0'00\"000");
	f(1, "0'00\"001");
	f(999, "0'00\"999");
	f(1000, "0'01\"000");

	f(5*Time.minute + 21*Time.second + 789, "5'21\"789");
	f(100*Time.minute, "100'00\"000");

	test.done();
}













//   ____        _       
//  |  _ \  __ _| |_ ___ 
//  | | | |/ _` | __/ _ \
//  | |_| | (_| | ||  __/
//  |____/ \__,_|\__\___|
//                       

// sayDate, sayDateAndTime, sayDayAndTime, sayDateTemplate, dateParts
// optionCulture

exports.testSayDateDay = function(test) {

	function f(t, i, f, e) {

		optionCulture.set("i"); test.ok(sayDateAndTime(t) == i);
		optionCulture.set("f"); test.ok(sayDateAndTime(t) == f);
		optionCulture.set("e"); test.ok(sayDateAndTime(t) == e);
	}

	var t = 32*Time.year + 4*Time.month + 22*Time.day + 10*Time.hour + 35*Time.minute + 44*Time.second + 456;//32 years after 1970

	if (timeZone == "m") {

		f(t,
			"2002 May 24 Fri 22:35 44·456",
			"2002 May 24 Fri 22:35 44,456",
			"2002 May 24 Fri 10:35p 44.456s");

		t += 2*Time.hour
		f(t,
			"2002 May 25 Sat 00:35 44·456",
			"2002 May 25 Sat 00:35 44,456",
			"2002 May 25 Sat 12:35a 44.456s");

		t += 8*Time.hour
		f(t,
			"2002 May 25 Sat 08:35 44·456",
			"2002 May 25 Sat 08:35 44,456",
			"2002 May 25 Sat 8:35a 44.456s");

		t += 2*Time.hour
		f(t,
			"2002 May 25 Sat 10:35 44·456",
			"2002 May 25 Sat 10:35 44,456",
			"2002 May 25 Sat 10:35a 44.456s");

		t += 3*Time.hour
		f(t,
			"2002 May 25 Sat 13:35 44·456",
			"2002 May 25 Sat 13:35 44,456",
			"2002 May 25 Sat 1:35p 44.456s");//pm single digit

		t += 8*Time.hour
		f(t,
			"2002 May 25 Sat 21:35 44·456",
			"2002 May 25 Sat 21:35 44,456",
			"2002 May 25 Sat 9:35p 44.456s");//pm double digit

		t += 7*Time.month + 20*Time.second + 545;
		test.ok(sayDate(t)        == "2002 Dec 24 Tue 10:06p");
		test.ok(sayDateAndTime(t) == "2002 Dec 24 Tue 10:06p 05.001s");
		test.ok(sayDayAndTime(t)  ==             "Tue 10:06p 05.001s");

	} else if (timeZone == "e") {

		f(t,
			"2002 May 25 Sat 00:35 44·456",
			"2002 May 25 Sat 00:35 44,456",
			"2002 May 25 Sat 12:35a 44.456s");//midnight

		t += 2*Time.hour
		f(t,
			"2002 May 25 Sat 02:35 44·456",
			"2002 May 25 Sat 02:35 44,456",
			"2002 May 25 Sat 2:35a 44.456s");//am single digit

		t += 8*Time.hour
		f(t,
			"2002 May 25 Sat 10:35 44·456",
			"2002 May 25 Sat 10:35 44,456",
			"2002 May 25 Sat 10:35a 44.456s");//am double digit

		t += 2*Time.hour
		f(t,
			"2002 May 25 Sat 12:35 44·456",
			"2002 May 25 Sat 12:35 44,456",
			"2002 May 25 Sat 12:35p 44.456s");//noon

		t += 3*Time.hour
		f(t,
			"2002 May 25 Sat 15:35 44·456",
			"2002 May 25 Sat 15:35 44,456",
			"2002 May 25 Sat 3:35p 44.456s");//pm single digit

		t += 8*Time.hour
		f(t,
			"2002 May 25 Sat 23:35 44·456",
			"2002 May 25 Sat 23:35 44,456",
			"2002 May 25 Sat 11:35p 44.456s");//pm double digit

		t += 7*Time.month + 20*Time.second + 545;
		test.ok(sayDate(t)        == "2002 Dec 25 Wed 12:06a");
		test.ok(sayDateAndTime(t) == "2002 Dec 25 Wed 12:06a 05.001s");
		test.ok(sayDayAndTime(t)  ==             "Wed 12:06a 05.001s");
	}

	test.done();
}








































//you are sure now that it makes sense to do chunk and piece the simplest way with small fragments at the end, and the same number of hash depth for everything
//but the functions will be the same, they will just be simpler on the inside and simpler to explain


/*

//    ____ _                 _                      _   ____  _               
//   / ___| |__  _   _ _ __ | | __   __ _ _ __   __| | |  _ \(_) ___  ___ ___ 
//  | |   | '_ \| | | | '_ \| |/ /  / _` | '_ \ / _` | | |_) | |/ _ \/ __/ _ \
//  | |___| | | | |_| | | | |   <  | (_| | | | | (_| | |  __/| |  __/ (_|  __/
//   \____|_| |_|\__,_|_| |_|_|\_\  \__,_|_| |_|\__,_| |_|   |_|\___|\___\___|
//                                                                            

var numberOfChunks = requireMeasure.numberOfChunks;
var numberOfPieces = requireMeasure.numberOfPieces;

var indexChunkToByte = requireMeasure.indexChunkToByte;
var indexPieceToChunk = requireMeasure.indexPieceToChunk;
var indexPieceToByte = requireMeasure.indexPieceToByte;

var stripeChunkToByte = requireMeasure.stripeChunkToByte;
var stripePieceToChunk = requireMeasure.stripePieceToChunk;
var stripePieceToByte = requireMeasure.stripePieceToByte;

exports.testChunkExample = function(test) {

	//just show how a 2.1mb file is split into 3 pieces with chunks inside


	var bytes = 2*Size.mb + 16*Size.kb + 1;

	var chunks = numberOfChunks(bytes);
	var pieces = numberOfPieces(bytes);

	test.ok(chunks == 130);
	test.ok(pieces == 3);

	//each chunk has X or X bytes
	//each piece has 43 or 44 chunks

	log(say(stripePieceToChunk(bytes, Stripe(0, 1))));//i0w43
	log(say(stripePieceToChunk(bytes, Stripe(1, 1))));//i43w43
	log(say(stripePieceToChunk(bytes, Stripe(2, 1))));//i86w44


	try {
		log(say(stripePieceToChunk(bytes, Stripe(3, 1))));//bounds
		test.fail();
	} catch (e) { test.ok(e.name == "bounds"); }










	test.done();
}

exports.testChunkOverflow = function(test) {

	//size is the largest file that won't overflow
	//max is the largest number javascript treats as an integer, 2^53

	//size * chunks = max
	//chunks = size/16kb
	//so: size = sqrt(max * 16kb) = 2^(67/2) = 11.3gb

	function attempt(bytes) {
		var chunks = numberOfChunks(bytes);
		var pieces = numberOfPieces(bytes);

		indexChunkToByte(bytes, chunks)
		indexPieceToChunk(bytes, pieces);
		indexPieceToByte(bytes, pieces);
	}

	attempt(11*Size.gb);
	try {
		attempt(12*Size.gb);
		test.fail();
	} catch (e) { test.ok(e.name == "overflow"); }

	test.done();
}

*/











