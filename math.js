





// Make sure n and d are positive integers, and d is not 0
// Calculate numerator / denominator
// Return the integer division and remainder
function div(n, d) {

	function check(i, min) {
		if (typeof i !== "number") throw "type"; // Make sure i is a number
		if (Math.floor(i) !== i) throw "integer"; // A whole number
		if (i < min) throw "range"; // With the minimum value or larger
	}

	check(n, 0);
	check(d, 1); // Throw before trying to divide by zero

	var a = {};
	a.ans = Math.floor(n / d); // Answer
	a.rem = n % d; // Remainder

	check(a.ans, 0);
	check(a.rem, 0);
	if ((d * a.ans) + a.rem !== n) throw "impossible"; // Check our answer before returning it
	return a;
}

exports.div = div;




