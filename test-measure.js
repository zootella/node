
var log = console.log;

var measure = require("./measure");
var div     = measure.div;
var Average = measure.Average;




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
	try { div("potato", 1); test.fail(); } catch (e) {}//not a number
	try { div(1.5, 1);      test.fail(); } catch (e) {}//not an integer
	try { div(-2, 1);       test.fail(); } catch (e) {}//negative
	try { div(10, 0);       test.fail(); } catch (e) {}//divide by zero

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


