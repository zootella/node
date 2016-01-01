
require("./load").load("base", function() { return this; });






























//   __  __       _   _     
//  |  \/  | __ _| |_| |__  
//  | |\/| |/ _` | __| '_ \ 
//  | |  | | (_| | |_| | | |
//  |_|  |_|\__,_|\__|_| |_|
//                          

// multiply, divide, scale, check

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
	var d = Fraction(9007199254740992 - 1, Size.tb);//the biggest number divide and multiply will work with is 1 less than the int limit
	test.ok(d.whole.toNumber() == 8191);// the size limit is 8191 terabytes
	test.ok(d.remainder.toNumber() == 1099511627775);//and this remainder of bytes
	test.ok(Fraction(d.remainder, Size.gb).whole.toNumber() == 1023);//which is 1023 gigabytes
	test.ok(Fraction([8191, Size.tb], 1).whole.toNumber() + 1099511627775 == 9007199254740992 - 1);//put the number back together again

	test.done();
}

exports.testCheck = function(test) {

	//hit each of the 7 exceptions in checkNumberMath
	try { min0("1");                   test.fail() } catch (e) { test.ok(e.name == "type");     }//make sure i is a number
	try { min0(0 / 0);                 test.fail() } catch (e) { test.ok(e.name == "bounds");   }//not the weird not a number thing
	try { min0(1 / 0);                 test.fail() } catch (e) { test.ok(e.name == "overflow"); }//not too big for floating point
	try { min0(9007199254740992 * 2);  test.fail() } catch (e) { test.ok(e.name == "overflow"); }//not too big for int
	try { min0(9007199254740900 + 92); test.fail() } catch (e) { test.ok(e.name == "overflow"); }//not too big for addition to work
	try { min0(1.5);                   test.fail() } catch (e) { test.ok(e.name == "type");     }//a whole number
	try { min1(0);                     test.fail() } catch (e) { test.ok(e.name == "bounds");   }//with the minimum value or larger

	test.done();
}

exports.testMultiply = function(test) {

	test.ok(Fraction([3, 4], 1).whole.toNumber() == 12);
	test.ok(Fraction([3, 0], 1).whole.toNumber() == 0);
	test.ok(Fraction([1, 1], 1).whole.toNumber() == 1);

	//a big number
	var n = 9007199254740992 - 1;//largest possible int, minus 1 so our functions will work with it
	test.ok(n == 9007199254740991);

	//divide
	var d = Fraction(n, 1000);
	test.ok(d.whole.toNumber() == 9007199254740);//easy enough to see the whole and remainder
	test.ok(d.remainder.toNumber() == 991);

	//multiply
	test.ok(Fraction([9007199254740, 1000], 1).whole.toNumber() == 9007199254740000);//multiply to near, but under the limit
	try {
		Fraction([9007199254740, 1001], 1).whole.toNumber();//over the limit
		test.fail();
	} catch (e) { test.ok(e.name == "overflow"); }

	test.done();
}

exports.testDivide = function(test) {

	var a;

	a = Fraction(10, 3);
	test.ok(a.whole.toNumber() == 3 && a.remainder.toNumber() == 1);
	test.ok(a.remainder);//has a remainder

	a = Fraction(12, 3);
	test.ok(a.whole.toNumber() == 4 && a.remainder.toNumber() == 0);
	test.ok(!a.remainder.toNumber());//doesn't have a remainder

	a = Fraction(123456789, 555);
	test.ok(a.whole.toNumber() == 222444 && a.remainder.toNumber() == 369);

	a = Fraction(789, 1);
	test.ok(a.whole.toNumber() == 789 && a.remainder.toNumber() == 0);

	a = Fraction(1, 2);
	test.ok(a.whole.toNumber() == 0 && a.remainder.toNumber() == 1);

	a = Fraction(1, 456);
	test.ok(a.whole.toNumber() == 0 && a.remainder.toNumber() == 1);

	//catch errors
	try { Fraction("potato", 1); test.fail(); } catch (e) { test.ok(e.name == "data");    }//not a number
	try { Fraction(1.5, 1);      test.fail(); } catch (e) { test.ok(e.name == "type");    }//not an integer
	try { Fraction(-2, 1);       test.fail(); } catch (e) { test.ok(e.name == "bounds");  }//negative

	a = Fraction(10, 0);//divide by zero returns null instead of the answer object
	test.ok(!a);//which is falsey
	a = {};//unlike even an empty object
	test.ok(a);

	test.done();
}

exports.testDivideRound = function(test) {

	function f(n, d, round) {
		test.ok(Fraction(n, d).round.toNumber() == round);
	}

	f(3, 7, 0);//3/7 goes down, 4/7 up
	f(4, 7, 1);

	f(3, 8, 0);//3, 4, and 5 8ths
	f(4, 8, 1);
	f(5, 8, 1);

	f(1, 2, 1);//1 and 3 halves
	f(3, 2, 2);

	f(100, 3, 33);//one third and two thirds is 33% and 67%
	f(200, 3, 67);

	test.done();
}

exports.testScale = function(test) {

	var d = Fraction([5, 10], 3);//multiplies first to not lose accuracy
	test.ok(d.whole.toNumber() == 16);
	test.ok(d.remainder.toNumber() == 2);

	test.done();
}

exports.testCompareNumber = function(test) {

	try {
		compareNumber(-5, -6);//negative now allowed
		test.fail();
	} catch (e) { test.ok(e.name == "bounds"); }

	test.ok(compareNumber(50, 40) > 0);//positive, reverse order
	test.ok(compareNumber(50, 50) == 0);//zero, same
	test.ok(compareNumber(50, 60) < 0);//negative, correct order

	var a = [30, 90, 10, 50, 40, 80, 20, 60, 70];
	a.sort(compareNumber);
	test.ok(arraySame(a, [10, 20, 30, 40, 50, 60, 70, 80, 90]));//works for sorting

	test.done();
}


















//   _____               _   _             
//  |  ___| __ __ _  ___| |_(_) ___  _ __  
//  | |_ | '__/ _` |/ __| __| |/ _ \| '_ \ 
//  |  _|| | | (_| | (__| |_| | (_) | | | |
//  |_|  |_|  \__,_|\___|\__|_|\___/|_| |_|
//                                         

exports.testSayUnitPerUnit = function(test) {

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








