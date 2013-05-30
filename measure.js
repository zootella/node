
var log = console.log;



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


//things to change with check
//name it checkNumber, and use it elsewhere in the code
//have min be optional, if !min min = 0, change check(n, 0) to just chekc(n)



































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
		return divide(_total, _n).whole;
	}

	// The current average, 0 before we have any values
	function averageFloat() {
		if (!_n) return 0;
		return divide(_total, _n).decimal; // Use the division operator to get the floating point result
	}
	
	// The current average in thousandths, given 4, 5, and 6, the average is 5000
	function averageThousandths() { return averageMultiply(1000); }
	// The current average multiplied by the given number. */
	function averageMultiply(m) {
		if (!_n) return 0;
		return scale(m, _total, _n).whole;
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
		type:function(){ return "Average"; }
	};
}

exports.Average = Average;


















/*
function Slice(z) { // Takes the size of the file in bytes
	if (z < 1) throw "bounds"; // File size must be 1 byte or more

	var _size = z;

	// The file size in bytes
	function size() { return _size; }

	// How many pieces the file has
	// Pieces can be 1 MB or smaller, so a file just over 1 MB has 2 pieces
	function pieces() { return Math.ceil(size() / MB()); }

	// The distance in bytes from the start of the file to the boundary of the given piece index i
	// For instance, the first piece starts at piece(0), the second starts at piece(1), and so on
	// If a file has n pieces, piece(n) will be the size of the file
	function piece(index) {
		if (index < 0 || index > pieces()) throw "bounds";
		return Math.floor((index * size()) / pieces()) // Multiply before we divide, and round down to the nearst byte
	}

	return {
		size:size,
		pieces:pieces,
		piece:piece
	};
}
exports.Slice = Slice;
//TODO actually write this, it's not good or checked yet
//obviously use divide, multiply, and scale here
//also, the whole design is wrong, it should work with Stripe, you have to write Range and Stripe first
*/

//if a piece is 1mb or smaller and a chunk is 16kb or smaller, you should probably make the medium bin 16kb instead of 8kb so it can hold a whole chunk
//you could hash it right in memory, for instance
//or maybe this isn't necessary, you need to think about it some more



// Text that describes the type of o, like "string" or "Data"
function getType(o) {
	try {
		return o.type(); // Try to call the type() method we add to custom objects
	} catch (e) {
		return typeof o; // If that doesn't work, use the typeof operator
	}
}
function isType(o, name) { return getType(o) == name; } // True if object o is of type name
function checkType(o, name) { if (!isType(o, name)) throw "type"; } // Throw type if o is not of type name

// True if o is an object with a function o.name() you can call
function hasMethod(o, name) {
	try {
		return typeof o[name] == "function";
	} catch (e) {
		return false;
	}
}

exports.getType = getType;
exports.isType = isType;
exports.checkType = checkType;
exports.hasMethod = hasMethod;









	
	

