




// Constants

//physically defined constants, like Size and Time




//   _   _       _ _       
//  | | | |_ __ (_) |_ ___ 
//  | | | | '_ \| | __/ __|
//  | |_| | | | | | |_\__ \
//   \___/|_| |_|_|\__|___/
//                         

// Time constants
var Time = {};
Time.second = 1000;             // Number of milliseconds in a second
Time.minute = 60 * Time.second; // Number of milliseconds in a minute
Time.hour   = 60 * Time.minute; // Number of milliseconds in an hour
Time.day    = 24 * Time.hour;   // Number of milliseconds in a day
Object.freeze(Time);

// Size constants
var Size = {};
Size.kb = 1024;           // Number of bytes in a kilobyte
Size.mb = 1024 * Size.kb; // Number of bytes in a megabyte
Size.gb = 1024 * Size.mb; // Number of bytes in a gigabyte
Size.tb = 1024 * Size.gb; // Number of bytes in a terabyte
Size.value  = 20;           // A SHA1 hash value is 20 bytes
Size.medium =  8 * Size.kb; // 8 KB in bytes, the capacity of a normal Bin, our buffer size for TCP sockets
Size.big    = 64 * Size.kb; // 64 KB in bytes, the capacity of a big Bin, our buffer size for UDP packets
Object.freeze(Size);

exports.Time = Time;
exports.Size = Size;




/*
 __  __       _   _     
|  \/  | __ _| |_| |__  
| |\/| |/ _` | __| '_ \ 
| |  | | (_| | |_| | | |
|_|  |_|\__,_|\__|_| |_|
                        
*/
/*
 ____                       
/ ___| _ __   __ _  ___ ___ 
\___ \| '_ \ / _` |/ __/ _ \
 ___) | |_) | (_| | (_|  __/
|____/| .__/ \__,_|\___\___|
      |_|                   
*/
/*
 _____ _                
|_   _(_)_ __ ___   ___ 
  | | | | '_ ` _ \ / _ \
  | | | | | | | | |  __/
  |_| |_|_| |_| |_|\___|
                        
*/
/*
 ____       _   _                  
|  _ \ __ _| |_| |_ ___ _ __ _ __  
| |_) / _` | __| __/ _ \ '__| '_ \ 
|  __/ (_| | |_| ||  __/ |  | | | |
|_|   \__,_|\__|\__\___|_|  |_| |_|
                                   
*/
/*
 _   _                 _               
| \ | |_   _ _ __ ___ | |__   ___ _ __ 
|  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
| |\  | |_| | | | | | | |_) |  __/ |   
|_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
                                       
*/












//here's where you put everything about
//converting between numbers and data
//math functions like div
//math and statistics objects like Average and Speed
//measuring tools like Stripe and Range
//StripePattern and SprayPattern

















// Make sure n and d are positive integers, and d is not 0
// Calculate numerator / denominator
// Return the integer division and remainder
function div(n, d) {

	function check(i, min) {
		if (typeof i !== "number") throw "type"; // Make sure i is a number
		if (Math.floor(i) !== i) throw "integer"; // A whole number
		if (i < min) throw "bounds"; // With the minimum value or larger
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









// Calculate n1 * n2
// Make sure the answer doesn't overflow the largest value a number can hold
function multiply(n1, n2) {
	check(n1, 0);
	check(n2, 0);

	var a = n1 * n2;

	check(a, 0);
	return a;
}

// Calculate n / d
// Make sure n and d are positive integers, and d is not 0
// Calculate numerator / denominator
// Return the integer division and remainder
function divide(n, d) {
	check(n, 0);
	check(d, 1); // Throw before trying to divide by zero

	var a = {}; // Answer
	a.whole     = Math.floor(n / d); // Round down
	a.remainder = n % d;             // Remainder
	a.decimal   = n / d;             // Floating point number
	a.ceiling   = Math.ceil(n / d);  // Round up

	check(a.whole, 0); // Check our answer before returning it
	check(a.remainder, 0);
	if ((d * a.whole) + a.remainder !== n)                     Mistake.log({ name:"divide remainder", n:n, d:d, a:a });
	if (a.whole + ((a.remainder === 0) ? 0 : 1) !== a.ceiling) Mistake.log({ name:"divide ceiling",   n:n, d:d, a:a });
	return a;
}

// Calculate (n * m) / d
function scale(n, m, d) { return divide(multiply(n, m), d); }

// Make sure i is a whole number with a minimum value of min or larger
function check(i, min) {
	if (typeof i !== "number") throw "type";     // Make sure i is a number
	if (isNaN(i))              throw "bounds";   // Not the weird not a number thing
	if (!isFinite(i))          throw "overflow"; // Not too big for floating point
	if (i > 9007199254740992)  throw "overflow"; // Not too big for int
	if (i + 1 === i)           throw "overflow"; // Not too big for addition to work
	if (Math.floor(i) !== i)   throw "type";     // A whole number
	if (i < min)               throw "bounds";   // With the minimum value or larger
}

exports.multiply = multiply;
exports.divide = divide;
exports.scale = scale;
exports.check = check;



































// Calculate the average of a number of vales as they are produced
function Average() {

	function n()       { return _n;       } var _n       = 0; // How many values we have, 0 before you add one
	function total()   { return _total;   } var _total   = 0; // The total sum of all the given values

	function minimum() { return _minimum; } var _minimum = 0; // The smallest value we have seen, 0 before we have any values
	function maximum() { return _maximum; } var _maximum = 0; // The largest value we have seen, 0 before we have any values
	function recent()  { return _recent;  } var _recent  = 0; // The most recent value that you added, 0 before we have any values

	// Record a new value to make it a part of this average
	function add(value) {
		_n++; // Count another value
		_total += value; // Add the value to our total
		if (_n == 1 || value < _minimum) _minimum = value; // First or smallest value
		if (_n == 1 || value > _maximum) _maximum = value; // First or largest value
		_recent = value; // Remember the most recent value
	}

	// The current average, rounded down to a whole number, 0 before we have any values
	function average() {
		if (!_n) return 0;
		return div(_total, _n).ans;
	}

	// The current average, 0 before we have any values
	function averageFloat() {
		if (!_n) return 0;
		return _total / _n; // Use the division operator to get the floating point result
	}
	
	// The current average in thousandths, given 4, 5, and 6, the average is 5000
	function averageThousandths() { return averageMultiply(1000); }
	// The current average multiplied by the given number. */
	function averageMultiply(multiply) {
		if (!_n) return 0;
		return div(multiply * _total, _n).ans;
	}

	// Text that describes the current average, like "5.000", "Undefined" before we have any values
	function say() {
		if (!_n) return "Undefined";
		throw "todo"; //TODO return Describe.decimal(averageThousandths(), 3);
	}

	return {
		n:n, total:total,
		minimum:minimum, maximum:maximum, recent:recent,
		add:add,
		average:average, averageFloat:averageFloat, averageThousandths:averageThousandths, averageMultiply:averageMultiply,
		say:say,
		isAverage:function(){}
	};
}

exports.Average = Average;







	
	

