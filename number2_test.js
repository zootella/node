
require("./load").load("base", function() { return this; });

var platformBigNumber = require('bignumber.js');























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
	speedLoop("less Int",               speedLessC);   // ~100 thousand
	log();
	speedLoop("scale number",           speedScaleJ);  // ~5 million
	speedLoop("scale bignumber.js",     speedScaleB);  // ~100 thousand, slow
	speedLoop("scale Int and Fraction", speedScaleC);  // ~10 thousand, slow
	log();
	speedLoop("divide number",          speedDivideJ); // ~10 million
	speedLoop("divide Fraction",        speedDivideC); // ~10 thousand, slow

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
	if (Int(i).greaterThan(94906265)) log("mistake");
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
	var t = Int(i).multiply(n);//top
	var f = Fraction(t, d);//whole and remainder
	if (f.whole.multiply(d).add(f.remainder).nonequal(t)) log("mistake");//check
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
















exports.testNumeralsToNumber = function(test) {
	//TODO basic sanity, as not sure if you can get to parseInt's weird behavior anymore, it's too well guarded

	function cycle(n, s10) {
		test.ok(n+"" === s10);//number to text
		test.ok(numeralsToNumber(s10) === n);//text to number
	}

	//confirm we can turn numbers into text and back again
	cycle(0, "0", "0");//zero and one
	cycle(1, "1", "1");
	cycle(10, "10", "a");//ten, note how base16 output is lower case
	cycle(789456123, "789456123", "2f0e24fb");
	cycle(0xff, "255", "ff");//0x number literal, note how output text doesn't include the "0x" prefix

	test.ok(123.456+"" === "123.456");//decimal
	test.ok(-123.456+"" === "-123.456");

	function bad(s) {
		try { numeralsToNumber(s); test.fail(); } catch (e) { test.ok(e.name == "data"); }
	}

	//make sure text that isn't a perfect number can't become one
	bad("");//blank
	bad(" ");//space
	bad("potato");//a word
	bad("-");//punctuation
	bad(".");
	bad("k");

	bad("05");//leading zero

	bad(" 5");//spaces
	bad("5 ");
	bad(" 5 ");
	bad("5 6");

	test.done();
}

















//make sure that javascript numbers act the way we expect on this platform
exports.testPlatform = function(test) {

	//make sure the largest number this platform treats as an integer is what we expect
	//numeralsFit, Int, and Fraction are written to work with any MAX_SAFE_INTEGER, but if a platform changes that, it would be nice to know

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







exports.testMin = function(test) {

	min0(0);
	min0(1);
	min0(789);

	min1(1);
	min1(789);

	checkMin(0, 0);
	checkMin(1, 1);
	checkMin(789, 789);
	checkMin(1000, 789);

	try { min1(0);          test.fail(); } catch (e) {}
	try { checkMin(0, 1);   test.fail(); } catch (e) {}
	try { checkMin(1, 789); test.fail(); } catch (e) {}

	test.done()
}

exports.testCheckNumber = function(test) {
	//TODO additional forms of numbers, octal, hexadecimal, and scientific notation


	function v(n) {//valid doesn't throw
		checkNumber(n);
	}
	function i(n) {//invalid throws
		try {
			checkNumber(n);
			test.fail();
		} catch (e) {}
	}

	v(0);//common valid integers
	v(1);
	v(789);

	v(9007199254740991);//max valid
	v(Number.MAX_SAFE_INTEGER);
	i(9007199254740992);//one more invalid



	i(-5);//negative

	//invalid objects
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

	//do octal, hexadecimal, down here




	v(077);//63 in octal
	v(0xff);//255 in hexadecimal
	v(1.23e+5);//123000 in exponential
	v(5.0);//5, decimal with integer value

	i(5.67e-3);//exponential that is decimal
	i(456.789);//decimal literal












	test.done();
}

exports.testCheckNumberMath = function(test) {

	//hit each of the exceptions
	try { checkNumberMath("0");              test.fail(); } catch (e) { test.ok(e.note == "type");     }
	try { checkNumberMath(0/0);              test.fail(); } catch (e) { test.ok(e.note == "nan");      }
	try { checkNumberMath(1/0);              test.fail(); } catch (e) { test.ok(e.note == "infinity"); }
	try { checkNumberMath(9100000000000000); test.fail(); } catch (e) { test.ok(e.note == "max");      }
	try { checkNumberMath(9007199254740992); test.fail(); } catch (e) { test.ok(e.note == "max");      }//would like to hit plus instead
	try { checkNumberMath(1.5);              test.fail(); } catch (e) { test.ok(e.note == "floor");    }
	try { checkNumberMath(-1);               test.fail(); } catch (e) { test.ok(e.note == "negative"); }

	test.done();
}

exports.testCheckNumerals = function(test) {

	function v(s) {
		checkNumerals(s);
	}
	function i(s) {
		try {
			checkNumerals(s);
			test.fail();
		} catch (e) {}
	}

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
	}
	function i(s) {
		test.ok(!numeralsFit(s));
		try {
			checkNumeralsFit(s);
			test.fail();
		} catch (e) {}
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

exports.testCheckSame = function(test) {

	function i(f) {//make sure invalid throws
		try {
			f();
			test.fail();
		} catch (e) {}
	}

	checkSame(1, 1);//valid
	i(function(){ checkSame(1, 2); });//invalid

	checkSame();//missing both
	i(function(){ checkSame(1); });//second
	checkSame(1, 1);//neither

	i(function(){ checkSame(1, "1"); });//good
	test.ok(1 == "1");
	test.ok(1 !== "1");//works because checkSame uses !==

	test.done();
}

exports.testCompareCheckedNumber = function(test) {

	test.ok(compareCheckedNumber(5, 5) == 0);//same
	test.ok(compareCheckedNumber(10, 11) < 0);//same length
	test.ok(compareCheckedNumber(19, 13) > 0);
	test.ok(compareCheckedNumber(11, 111) < 0);//different lengths
	test.ok(compareCheckedNumber(11, 1)   > 0);

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



























exports.testIntMake = function(test) {

	function v(n, s) {//valid input and expected numerals
		test.ok(say(Int(n)) == s);
		test.ok(say(Int(n+"")) == s);
		test.ok(say(Int(Int(n))) == s);
		test.ok(say(Int(new platformBigNumber(n+""))) == s);
	}
	function i(x) {//invalid input
		try {
			Int(x);
			test.fail();
		} catch (e) {}
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

	test.ok(say(Int(5).subtract(4)) == "1");//subtract
	test.ok(say(Int(5).subtract(5)) == "0");//to zero
	try {
		Int(5).subtract(6);//beyond zero
		test.fail();
	} catch (e) {}

	test.ok(say(Int(0).divide(1)) == "0");//divide 0
	try {
		Int(10).divide(0);//divide by 0
		test.fail();
	} catch (e) {}

	test.ok(say(Int(0).modulo(1)) == "0");//modulo 0
	try {
		Int(10).modulo(0);//modulo by 0
		test.fail();
	} catch (e) {}

	test.ok(Int(7).multiply(0).equals(0));//multiply by 0
	test.ok(Int(0).multiply(7).equals(0));
	test.ok(Int("70000000000000000000").multiply(0).equals(0));
	test.ok(Int(0).multiply("70000000000000000000").equals(0));

	test.done();
}

exports.testIntStep = function(test) {

	function f(start, width, columns, end) {
		var s = Int(start);
		var t = s;
		for (var i = 0; i < columns; i++) t = t.add(width);
		var m = s.add(Int(width).multiply(columns));
		var u = t.add(Int(2).multiply(width)).subtract(Int(2).multiply(width));
		var e = Int(end);

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
		var t = Int(i).multiply(n);//top
		var w = t.divide(d);//whole
		var r = t.modulo(d);//remainder
		var a = w.multiply(d).add(r);
		test.ok(a.equals(t));
		test.ok(say(a) == say(t));
	}

	f(10, 10, 15);
	f(Size.pb, 999, 1000);

	test.done();
}

exports.testIntEquals = function(test) {

	test.ok(Int(0).equals(0));//small
	test.ok(Int(5).equals(5));
	test.ok(!Int(1).equals(0));
	test.ok(!Int(4).equals(5));

	test.ok(!Int(4).greaterThan(5));
	test.ok(!Int(5).greaterThan(5));
	test.ok(Int(6).greaterThan(5));

	test.ok(!Int(4).greaterThanOrEqualTo(5));
	test.ok(Int(5).greaterThanOrEqualTo(5));
	test.ok(Int(6).greaterThanOrEqualTo(5));

	test.ok(Int(4).lessThanOrEqualTo(5));
	test.ok(Int(5).lessThanOrEqualTo(5));
	test.ok(!Int(6).lessThanOrEqualTo(5));

	test.ok(Int(4).lessThan(5));
	test.ok(!Int(5).lessThan(5));
	test.ok(!Int(6).lessThan(5));

	test.ok(Int("9007199254740991").equals("9007199254740991"));//boundary
	test.ok(Int("9007199254740992").equals("9007199254740992"));
	test.ok(!Int("9007199254740991").equals("9007199254740992"));
	test.ok(!Int("9007199254740993").equals("9007199254740992"));

	test.ok(!Int("9007199254740990").greaterThan("9007199254740991"));
	test.ok(!Int("9007199254740991").greaterThan("9007199254740991"));
	test.ok(Int("9007199254740992").greaterThan("9007199254740991"));

	test.ok(!Int("9007199254740990").greaterThanOrEqualTo("9007199254740991"));
	test.ok(Int("9007199254740991").greaterThanOrEqualTo("9007199254740991"));
	test.ok(Int("9007199254740992").greaterThanOrEqualTo("9007199254740991"));

	test.ok(Int("9007199254740990").lessThanOrEqualTo("9007199254740991"));
	test.ok(Int("9007199254740991").lessThanOrEqualTo("9007199254740991"));
	test.ok(!Int("9007199254740992").lessThanOrEqualTo("9007199254740991"));

	test.ok(Int("9007199254740990").lessThan("9007199254740991"));
	test.ok(!Int("9007199254740991").lessThan("9007199254740991"));
	test.ok(!Int("9007199254740992").lessThan("9007199254740991"));

	test.ok(Int("10000000000000000").equals("10000000000000000"));//big
	test.ok(Int("10000000000000005").equals("10000000000000005"));
	test.ok(!Int("10000000000000001").equals("10000000000000000"));
	test.ok(!Int("10000000000000004").equals("10000000000000005"));

	test.ok(!Int("10000000000000004").greaterThan("10000000000000005"));
	test.ok(!Int("10000000000000005").greaterThan("10000000000000005"));
	test.ok(Int("10000000000000006").greaterThan("10000000000000005"));

	test.ok(!Int("10000000000000004").greaterThanOrEqualTo("10000000000000005"));
	test.ok(Int("10000000000000005").greaterThanOrEqualTo("10000000000000005"));
	test.ok(Int("10000000000000006").greaterThanOrEqualTo("10000000000000005"));

	test.ok(Int("10000000000000004").lessThanOrEqualTo("10000000000000005"));
	test.ok(Int("10000000000000005").lessThanOrEqualTo("10000000000000005"));
	test.ok(!Int("10000000000000006").lessThanOrEqualTo("10000000000000005"));

	test.ok(Int("10000000000000004").lessThan("10000000000000005"));
	test.ok(!Int("10000000000000005").lessThan("10000000000000005"));
	test.ok(!Int("10000000000000006").lessThan("10000000000000005"));

	test.done();
}

exports.testIntRepeating = function(test) {

	function t(d, n, m, w) {//denominator and numerator, and expected modulo and whole answers
		test.ok(Int(n).divide(d).equals(w));//divide
		test.ok(Int(n).modulo(d).equals(m));//modulo
		test.ok(Int(w).multiply(d).add(m).equals(n));//reassemble
	}
	function l(d, n) {//change one to log instead of test to see what's going on
		log("# #".fill(Int(n).modulo(d), Int(n).divide(d)));
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

exports.testSizeBig = function(test) {

	var i = Int(1);
	test.ok(i.equals(Size.b));
	i = i.multiply(1024); test.ok(i.equals(Size.kb)); test.ok(say(i) == "1024");
	i = i.multiply(1024); test.ok(i.equals(Size.mb)); test.ok(say(i) == "1048576");
	i = i.multiply(1024); test.ok(i.equals(Size.gb)); test.ok(say(i) == "1073741824");
	i = i.multiply(1024); test.ok(i.equals(Size.tb)); test.ok(say(i) == "1099511627776");
	i = i.multiply(1024); test.ok(i.equals(Size.pb)); test.ok(say(i) == "1125899906842624");
	i = i.multiply(1024); test.ok(i.equals(Size.eb)); test.ok(say(i) == "1152921504606846976");
	i = i.multiply(1024); test.ok(i.equals(Size.zb)); test.ok(say(i) == "1180591620717411303424");
	i = i.multiply(1024); test.ok(i.equals(Size.yb)); test.ok(say(i) == "1208925819614629174706176");

	test.done();
}















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

	try { Fraction(); test.fail(); } catch (e) {}
	try { Fraction(1); test.fail(); } catch (e) {}
	try { Fraction(1, 1).scale(); test.fail(); } catch (e) {}
	try { Fraction(1, 1).scale(1); test.fail(); } catch (e) {}

	test.ok(Fraction(1, 1));
	test.ok(!Fraction(1, 0));//divide by zero returns null instead of a Fraction object
	test.ok(Fraction(0, 1));//even if the whole answer is 0
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

		test.ok(f.denominator.multiply(f.whole).add(f.remainder).equals(f.numerator));//reassemble
		test.ok(f.whole.add(f.remainder.equals(0) ? 0 : 1).equals(f.ceiling));//presence of remainder adds 1 to get to ceiling
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

































exports.testSlideRule = function(test) {

	function t(a, b, p, l) {
		p2 = Int(a).multiply(b);
		l2 = say(p).length;
		test.ok(p2.equals(p));
		test.ok(l2 == l);
	}

	/*
	math lets us estimate products by adding logarighms, because slide rule and because duh
	this trick lets Int quickly determine if an answer will be small, making it safe to use number operators instead of the big type

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

exports.testFractionRemainder = function(test) {//test sayFraction with remainder options whole, round, and ceiling

	function c(d, r) {//compose a variety of the forms individually
		return("# # # # # # # # #".fill(
			sayFraction(d, "#/#",       {r:r}),//pass in remainder option
			sayFraction(d, "#",         {r:r}),
			sayFraction(d, "#.#",       {r:r}),
			sayFraction(d, "#.###",     {r:r}),
			sayFraction(d, "#.######",  {r:r}),
			sayFraction(d, "#%",        {r:r}),
			sayFraction(d, "#.#%",      {r:r}),
			sayFraction(d, "#.###%",    {r:r}),
			sayFraction(d, "#.######%", {r:r})));
	}

	function l(d, r, s) { log(c(d, r)); }//log the result
	function t(d, r, s) { test.ok(c(d, r) == s); }//test the result

	//nothing and everything
	t(Fraction(0, 1), "whole", "0/1 0 0.0 0.000 0.000000 0% 0.0% 0.000% 0.000000%");
	t(Fraction(1, 1), "whole", "1/1 1 1.0 1.000 1.000000 100% 100.0% 100.000% 100.000000%");

	//small and big
	t(Fraction(1,  100), "whole", "1/100 0 0.0 0.010 0.010000 1% 1.0% 1.000% 1.000000%");
	t(Fraction(1, 1000), "whole", "1/1,000 0 0.0 0.001 0.001000 0% 0.1% 0.100% 0.100000%");
	t(Fraction(100,  1), "whole", "100/1 100 100.0 100.000 100.000000 10,000% 10,000.0% 10,000.000% 10,000.000000%");
	t(Fraction(1000, 1), "whole", "1,000/1 1,000 1,000.0 1,000.000 1,000.000000 100,000% 100,000.0% 100,000.000% 100,000.000000%");

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

	var f, s;
	function l(s1, s2, s3) { log(s1); log(s2); if (s3) log(s3); }
	function t(s1, s2, s3) { test.ok(s1 == s2); if (s3) test.ok(s2 == s3); }

	//---- unit per unit

	//replace oldUnitPerUnit
	f = Fraction(3, 2);
	t(oldUnitPerUnit(f),            sayUnitPerUnit(f, "#.### (#/#)", {r:"round"}),                        "1.500 (3/2)");

	//replace oldDivide
	f = Fraction(10, 5);
	t(oldDivide(f),                 sayUnitPerUnit(f), "2", {r:"round"},                                  "2");
	t(oldDivide(f, 3),              sayUnitPerUnit(f, "#.###", {r:"round"}),                              "2.000");

	//replace oldPercent
	f = Fraction(123, 1234);
	t(oldPercent(f),                sayUnitPerUnit(f, "#% #/#"),                                          "9% 123/1,234");

	//---- unit per size

	//---- unit per time

	//replace oldUnitPerTime
	f = Fraction(123, Time.second);
	t(oldUnitPerTime(f),            sayUnitPerTime(f, "#.###/s (#/#)", {r:"round"}),                      "123.000/s (123/1.000s)");

	//---- size per unit

	//replace oldSizePerUnit
	f = Fraction(Size.mb, 5);
	t(oldSizePerUnit(f),            saySizePerUnit(f, "# (#/#)"),                                         "204kb 819b (1mb 0kb 0b/5)");

	//---- size per size

	//replace oldProgress
	f = Fraction(Size.mb, 2*Size.mb);
	t(oldProgress(f),               saySizePerSize(f, "#% #/#", {sayN:saySizeUnits, sayD:saySizeUnits}),  "50% 1024kb/2048kb");

	//---- size per time

	//replace oldSizePerTime
	f = Fraction(Size.mb, Time.minute);
	t(oldSizePerTime(f),            saySizePerTime(f, "#/s (#/#)"),                                       "17kb 68b/s (1mb 0kb 0b/1m 0.000s)");

	//replace oldSpeed
	t(oldSpeed(f),                  saySizePerTime(f, "#/s", {sayF:saySizeUnits}),                        "17kb/s");

	//---- time per unit

	//---- time per size

	//---- time per time

	//new
	f = Fraction(30*Time.minute, Time.hour);
	t(sayTimePerTime(f, "#% #/#"),                                                                        "50% 30m 0.000s/1h 0m 0.000s");

	done(test);
}













































































