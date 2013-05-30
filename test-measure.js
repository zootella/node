
var log = console.log;

var requireMeasure = require("./measure");
var Time = requireMeasure.Time;
var Size = requireMeasure.Size;

var requireData = require("./data");
var Data = requireData.Data;
var Bay = requireData.Bay;








exports.testUnits = function(test) {

	test.ok(Size.kb == 1024);
	Size.kb = 5;//this won't change it, but also won't throw an exception
	test.ok(Size.kb == 1024);//make sure Objet.freeze(Size) worked

	test.done();
}













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












//write a test for slice that works with some realistic, but very large files, like 9gb and 500gb, see how large a file you have to make to hit javascript's int limit and get overflow
/*
var Slice = measure.Slice;

exports.testSlice = function(test) {

	//confirm we're getting as many pieces as we should
	test.ok(Slice(1).pieces() == 1);//a 1 byte file is 1 piece

	test.ok(Slice(MB() - 1).pieces() == 1);//one less
	test.ok(Slice(MB()).pieces()     == 1);//and exactly 1 MB are 1 piece, while
	test.ok(Slice(MB() + 1).pieces() == 2);//one more bumps up to 2 pieces

	test.ok(Slice((2 * MB()) - 1).pieces() == 2);//same thing around 2mb
	test.ok(Slice((2 * MB())).pieces()     == 2);
	test.ok(Slice((2 * MB()) + 1).pieces() == 3);

	test.ok(Slice((5 * GB()) - 1).pieces() == 5120);//and around 5gb
	test.ok(Slice((5 * GB())).pieces()     == 5120);
	test.ok(Slice((5 * GB()) + 1).pieces() == 5121);

	//make sure we can scan exactly to the end of the file
	function edge(z) {
		var s = Slice(z);
		test.ok(s.piece(s.pieces()) == s.size());//if a file has n pieces, piece(n) should be exactly beyond the final byte
	}
	edge(1);//one byte
	edge(MB() - 1);//around a megabyte
	edge(MB());
	edge(MB() + 1);
	edge((789 * MB()) - (123 * KB()) + 456);//some large files
	edge((789 * GB()) - (123 * KB()) + 456);

	//make sure the piece boundaries are what we expect
	var file1 = Slice(1804787);
	test.ok(file1.pieces() == 2);
	test.ok(file1.piece(0) == 0);
	test.ok(file1.piece(1) == 902393);
	test.ok(file1.piece(2) == 1804787);

	var file2 = Slice(8030559);
	test.ok(file2.pieces() == 8);
	test.ok(file2.piece(4) == 4015279);
	test.ok(file2.piece(5) == 5019099);
	test.ok(file2.piece(6) == 6022919);

	var file3 = Slice(1417407005);
	test.ok(file3.pieces() == 1352);
	test.ok(file3.piece(999)  == 1047329584);
	test.ok(file3.piece(1000) == 1048377962);
	test.ok(file3.piece(1001) == 1049426340);

	test.done();
}
*/









//put this in measure number to watch out for it
/*
	test.ok((0 < 1) == true);
	test.ok((undefined < 1) == false);
*/




var getType = requireMeasure.getType;
var isType = requireMeasure.isType;
var checkType = requireMeasure.checkType;

exports.testGetType = function(test) {

	//nothings
	test.ok("undefined" == getType());//nothing passed
	test.ok("undefined" == getType(undefined));
	test.ok("undefined" == getType(Data().anUndefinedMember));

	//boolean
	test.ok("boolean" == getType(false));
	test.ok("boolean" == getType(true));

	//number
	test.ok("number" == getType(0));
	test.ok("number" == getType(500));
	test.ok("number" == getType(-1.2));
	test.ok("number" == getType(Infinity));
	test.ok("number" == getType(NaN));

	//string
	test.ok("string" == getType(""));
	test.ok("string" == getType("hi"));

	//function
	test.ok("function" == getType(function(){}));
	test.ok("function" == getType(Math.sin));
	test.ok("function" == getType(isType));
	test.ok("function" == getType(Data().size));

	//javascript object
	test.ok("object" == getType(null));//null has been an object since the beginning of javascript
	test.ok("object" == getType({a:1}));//hash
	test.ok("object" == getType([1, 2, 4]));//array
	test.ok("object" == getType(/s/));//node says a regular expression literal is an object

	//platform object
	test.ok("object" == getType(new Date()));//javascript object

	//node object
	test.ok("object" == getType(new Buffer(0)));//node object
	test.ok("object" == getType(new Buffer(8)));

	//program object with type() method
	test.ok("Bay"  == getType(Bay()));
	test.ok("Data" == getType(Bay().data()));
	test.ok("Clip" == getType(Bay().data().take()));

	//program object without that method
	function Sample() {
		function method() {}
		return { method:method }//no type() method
	}
	test.ok("object" == getType(Sample()));

	test.done();
}

exports.testIsType = function(test) {

	//platform types
	test.ok(isType("hi", "string"));
	test.ok(isType(7, "number"));
	test.ok(isType(true, "boolean"));

	//custom types
	var bay = Bay("hi");
	test.ok(isType(bay, "Bay"));
	test.ok(isType(bay.data(), "Data"));
	test.ok(isType(bay.data().take(), "Clip"));

	test.done();
}












