





//use div() everywhere instead of /


// Makes sure n and d are positive, and d is not 0
// Calculates numerator / denominator
// Returns the integer division and remainder
function div(n, d) {
	if (typeof n !== "number" || typeof d !== "number") throw "type";
	if (!Number.isInteger(n) || !Number.isInteger(d)) throw "type";
	if (n < 0 || d < 1) throw "range";

	var a = {};
	a.ans = Math.floor(n / d); // Answer
	a.rem = n % d; // Remainder
	if ((d * a.ans) + a.rem !== n) throw "impossible"; // Check our answer before returning it
	return a;
}


exports.testDiv = function(test) {

	var a;

	a = div(10, 3);
	test.ok(a.ans == 3);
	test.ok(a.rem == 1);
	test.ok(a.rem);//has a remainder

	a = div(12, 3);
	test.ok(a.ans == 4);
	test.ok(a.rem == 0);
	test.ok(!a.rem);//doesn't have a remainder

	a = div(123456789, 555);
	test.ok(a.ans == 222444);
	test.ok(a.rem == 369);

	//catch errors
	try { div("potato", 1); test.fail(); } catch (e) {}//not a number
	try { div(1.5, 1);      test.fail(); } catch (e) {}//not an integer
	try { div(-2, 1);       test.fail(); } catch (e) {}//negative
	try { div(10, 0);       test.fail(); } catch (e) {}//divide by zero

	test.done();
}

