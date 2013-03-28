





//use div() everywhere instead of /


// Make sure n and d are positive integers, and d is not 0
// Calculate numerator / denominator
// Return the integer division and remainder
function div(n, d) {

	function check(i, min) {
		if (typeof i !== "number") throw "type";
		if (!Number.isInteger(i)) throw "type";
		if (i < min) throw "range";
	}

	check(n, 0);
	check(d, 1);

	var a = {};
	a.ans = Math.floor(n / d); // Answer
	a.rem = n % d; // Remainder

	check(a.ans, 0);
	check(a.rem, 0);
	if ((d * a.ans) + a.rem !== n) throw "impossible"; // Check our answer before returning it
	return a;
}


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

