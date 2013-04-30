
var log = console.log;

var measure = require("./measure");
var Time = measure.Time;
var Size = measure.Size;
var Average = measure.Average;





















var multiply = measure.multiply;
var divide = measure.divide;
var scale = measure.scale;
var check = measure.check;

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








var div = measure.div;

exports.testDiv = function(test) {

	var a;

	a = div(10, 3);
	test.ok(a.ans == 3 && a.rem == 1);
	test.ok(a.rem);//has a remainder

	a = div(12, 3);
	test.ok(a.ans == 4 && a.rem == 0);
	test.ok(!a.rem);//doesn't have a remainder

	a = div(123456789, 555);
	test.ok(a.ans == 222444 && a.rem == 369);

	a = div(789, 1);
	test.ok(a.ans == 789 && a.rem == 0);

	a = div(1, 2);
	test.ok(a.ans == 0 && a.rem == 1);

	a = div(1, 456);
	test.ok(a.ans == 0 && a.rem == 1);

	//catch errors
	try { div("potato", 1); test.fail(); } catch (e) { test.ok(e == "type");    }//not a number
	try { div(1.5, 1);      test.fail(); } catch (e) { test.ok(e == "integer"); }//not an integer
	try { div(-2, 1);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//negative
	try { div(10, 0);       test.fail(); } catch (e) { test.ok(e == "bounds");  }//divide by zero

	test.done();
}






































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


