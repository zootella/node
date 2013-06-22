
var log = console.log;

var requireText = require("./text");
var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

var make = requireText.make;
var say = requireText.say;
var numerals16 = requireText.numerals16;

var requireMeasure = require("./measure");
var Time = requireMeasure.Time;
var Size = requireMeasure.Size;

var requireData = require("./data");
var Data = requireData.Data;
var Bay = requireData.Bay;




























//   _   _       _ _       
//  | | | |_ __ (_) |_ ___ 
//  | | | | '_ \| | __/ __|
//  | |_| | | | | | |_\__ \
//   \___/|_| |_|_|\__|___/
//                         

exports.testUnits = function(test) {

	test.ok(Size.kb == 1024);
	Size.kb = 5;//this won't change it, but also won't throw an exception
	test.ok(Size.kb == 1024);//make sure Objet.freeze(Size) worked

	test.done();
}










//   __  __       _   _     
//  |  \/  | __ _| |_| |__  
//  | |\/| |/ _` | __| '_ \ 
//  | |  | | (_| | |_| | | |
//  |_|  |_|\__,_|\__|_| |_|
//                          

var multiply = requireMeasure.multiply;
var divide = requireMeasure.divide;
var scale = requireMeasure.scale;
var check = requireMeasure.check;

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
	var d = divide(9007199254740992 - 1, Size.tb);//the biggest number divide and multiply will work with is 1 less than the int limit
	test.ok(d.whole == 8191);// the size limit is 8191 terabytes
	test.ok(d.remainder == 1099511627775);//and this remainder of bytes
	test.ok(divide(d.remainder, Size.gb).whole == 1023);//which is 1023 gigabytes
	test.ok(multiply(8191, Size.tb) + 1099511627775 == 9007199254740992 - 1);//put the number back together again

	test.done();
}

exports.testCheck = function(test) {

	//hit each of the 7 exceptions in check
	try { check("1", 0); test.fail() } catch (e) { test.ok(e == "type"); }//make sure i is a number
	try { check(0 / 0, 0); test.fail() } catch (e) { test.ok(e == "bounds"); }//not the weird not a number thing
	try { check(1 / 0, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for floating point
	try { check(9007199254740992 * 2, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for int
	try { check(9007199254740900 + 92, 0); test.fail() } catch (e) { test.ok(e == "overflow"); }//not too big for addition to work
	try { check(1.5, 0); test.fail() } catch (e) { test.ok(e == "type"); }//a whole number
	try { check(0, 1); test.fail() } catch (e) { test.ok(e == "bounds"); }//with the minimum value or larger

	test.done();
}

exports.testMultiply = function(test) {

	test.ok(multiply(3, 4) == 12);
	test.ok(multiply(3, 0) == 0);
	test.ok(multiply(1, 1) == 1);

	//a big number
	var n = 9007199254740992 - 1;//largest possible int, minus 1 so our functions will work with it
	test.ok(n == 9007199254740991);

	//divide
	var d = divide(n, 1000);
	test.ok(d.whole == 9007199254740);//easy enough to see the whole and remainder
	test.ok(d.remainder == 991);

	//multiply
	test.ok(multiply(9007199254740, 1000) == 9007199254740000);//multiply to near, but under the limit
	try {
		multiply(9007199254740, 1001);//over the limit
		test.fail();
	} catch (e) { test.ok(e == "overflow"); }

	test.done();
}

exports.testDivide = function(test) {

	var a;

	a = divide(10, 3);
	test.ok(a.whole == 3 && a.remainder == 1);
	test.ok(a.remainder);//has a remainder

	a = divide(12, 3);
	test.ok(a.whole == 4 && a.remainder == 0);
	test.ok(!a.remainder);//doesn't have a remainder

	a = divide(123456789, 555);
	test.ok(a.whole == 222444 && a.remainder == 369);

	a = divide(789, 1);
	test.ok(a.whole == 789 && a.remainder == 0);

	a = divide(1, 2);
	test.ok(a.whole == 0 && a.remainder == 1);

	a = divide(1, 456);
	test.ok(a.whole == 0 && a.remainder == 1);

	//catch errors
	try { divide("potato", 1); test.fail(); } catch (e) { test.ok(e == "type");    }//not a number
	try { divide(1.5, 1);      test.fail(); } catch (e) { test.ok(e == "type");    }//not an integer
	try { divide(-2, 1);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//negative
	try { divide(10, 0);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//divide by zero

	test.done();
}

exports.testScale = function(test) {

	var d = scale(5, 10, 3);//multiplies first to not lose accuracy
	test.ok(d.whole == 16);
	test.ok(d.remainder == 2);

	test.done();
}


















var Average = requireMeasure.Average;

exports.testAverage = function(test) {

	//average 4, 5, and 6
	var a = Average();
	test.ok(!a.minimum());
	a.add(4);
	a.add(5);
	test.ok(a.recent() == 5);
	test.ok(a.maximum() == 5);
	a.add(6);

	test.ok(a.n() == 3);
	test.ok(a.total() == 15);
	test.ok(a.minimum() == 4);
	test.ok(a.maximum() == 6);
	test.ok(a.recent() == 6);

	test.ok(a.average() == 5);

	//average 3, 3, and 4
	a = Average();
	a.add(3);
	a.add(3);
	a.add(4);
	test.ok(a.average() == 3);
	test.ok(a.averageFloat() == 3.3333333333333335);
	test.ok(a.averageThousandths() == 3333);

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







var Stripe2 = requireMeasure.Stripe2;

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





























// ---- Number ----

var widen = requireMeasure.widen;
var commas = requireMeasure.commas;
var items = requireMeasure.items;

exports.testWiden = function(test) {

	test.ok(widen("1", 3) == "001");
	test.ok(widen("12", 3, " ") == " 12");

	test.done();
}

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







// ---- Fraction ----

var sayDivide = requireMeasure.sayDivide;
var sayPercent = requireMeasure.sayPercent;
var sayProgress = requireMeasure.sayProgress;

exports.testSayDivide = function(test) {

	test.ok(sayDivide(1, 2) == "0.500");
	test.ok(sayDivide(10, 3) == "3.333");
	test.ok(sayDivide(3000, 2) == "1,500.000");

	test.done();
}

exports.testSayPercent = function(test) {

	test.ok(sayPercent(1, 2) == "50.000% 1/2");
	test.ok(sayPercent(10, 30) == "33.333% 10/30");

	test.done();
}

exports.testSayProgress = function(test) {

	test.ok(sayProgress(1, 2) == "50% 1b/2b");
	test.ok(sayProgress(1122 * Size.mb, 18 * Size.gb) == "6% 1122mb/18gb");
	test.ok(sayProgress(987 * Size.kb, 5 * Size.mb) == "19% 987kb/5120kb");
	test.ok(sayProgress(555 * Size.mb, 7 * Size.gb, 0, "kb") == "7% 568,320kb/7,340,032kb");

	test.done();
}












// ---- Size ----

var saySize = requireMeasure.saySize;

exports.testSaySize = function(test) {

	test.ok(saySize(0) == "0b");
	test.ok(saySize(5) == "5b");
	test.ok(saySize(9999) == "9999b");
	test.ok(saySize(10000) == "9kb");

	test.ok(saySize(256 * Size.kb) == "256kb");
	test.ok(saySize(5 * Size.gb) == "5120mb");
	test.ok(saySize(Size.tb) == "1024gb");

	test.ok(saySize(Size.max - 1) == "8191tb");

	test.ok(saySize(1)                == "1b");
	test.ok(saySize(10)               == "10b");
	test.ok(saySize(100)              == "100b");
	test.ok(saySize(1000)             == "1000b");
	test.ok(saySize(10000)            == "9kb");
	test.ok(saySize(100000)           == "97kb");
	test.ok(saySize(1000000)          == "976kb");
	test.ok(saySize(10000000)         == "9765kb");
	test.ok(saySize(100000000)        == "95mb");
	test.ok(saySize(1000000000)       == "953mb");
	test.ok(saySize(10000000000)      == "9536mb");
	test.ok(saySize(100000000000)     == "93gb");
	test.ok(saySize(1000000000000)    == "931gb");
	test.ok(saySize(10000000000000)   == "9313gb");
	test.ok(saySize(100000000000000)  == "90tb");
	test.ok(saySize(1000000000000000) == "909tb");

	var n = 5 * Size.gb;
	test.ok(saySize(n, 0, "b")  == "5,368,709,120b");
	test.ok(saySize(n, 0, "kb") == "5,242,880kb");
	test.ok(saySize(n, 0, "mb") == "5,120mb");
	test.ok(saySize(n, 0, "gb") == "5gb");
	test.ok(saySize(n, 0, "tb") == "1tb");
	test.ok(saySize(n, 0, "pb") == "1pb");

	n = Size.max - 1;
	test.ok(saySize(n, 0, "b")  == "9,007,199,254,740,991b");
	test.ok(saySize(n, 0, "kb") == "8,796,093,022,208kb");
	test.ok(saySize(n, 0, "mb") == "8,589,934,592mb");
	test.ok(saySize(n, 0, "gb") == "8,388,608gb");
	test.ok(saySize(n, 0, "tb") == "8,192tb");
	test.ok(saySize(n, 0, "pb") == "8pb");

	test.done();
}



/*
exports.textMax = function(test) {

	test.ok(make(Size.max) == "9007199254740992");

	try {
		check(Size.max, 0);//max is too big
		test.fail();
	} catch (e) { test.ok(e == "overflow"); }
	check(Size.max - 1, 0);//max minus one is the largest number we can handle

	var max = Size.max - 1;

	test.ok(saySize(max) == "8191tb");

	log(saySize(divide(max, Size.mb).whole) == "8191mb");
	//so, you can't use scale to slice 1mb portions, because the largest file you can handle is less than 1gb
	//you'll have to use the put all the remainders first method
	//and see how the chunks space themselves within the pieces also


	//just try it with a real example of 3.1mb






	//as a size

	//as a time




	test.done();
}

//don't actually write complete tests for say
//just have very brief demonstration sanity checking
//part of writing good tests is knowing which and how many tests are appropriate for each situation

log(saySize(divide(Size.max - 1, Size.mb).whole));


"spaces 00·00•00•00·00∙00 00 00 00 00 00　00.txt"
//ok, none of them work in sublime, but that's ok, and some of them work in windows explorer

var quote = requireData.quote;

log(quote(Data("good 00·00·00∙00 00 00 00.txt")));
//"good 00"c2b7"00"c2b7"00"e28899"00"e28089"00"e2808a"00 00.txt"

//e28089 is thin space, pick this one
//e2808a is hair space
//well, see how they print to the console
//that probably won't work at all, so have a replace function that replaces normal characters with fancy ones for the screen
//yeah, that's a good idea if it's necessary
//also use the thin space in dates

/*
	function sayEverything(n) {
		log();
		log(sayBytes(n));
		log(sayKb(n));
		log(sayMb(n));
		log(sayGb(n));
		log(sayTb(n));
		log();
		log(saySize(n));
		log(sayKbWindows(n));
	}

	sayEverything(1034619579);


	log("•".code());//8226
	log("·".code());//186
	log(" ")
	log("hi");

	log(make("thin space 000", Size.thinSpace, "000"));
	log(make("thin space 000", Size.thinSpace, "000"));
*/
/*
log("here come some codes");
log(numerals16(" ".code()));//2009
log(numerals16("·".code()));//b7

//is this the same thing?

*/













