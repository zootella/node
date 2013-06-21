
var log = console.log;

var requireText = require("./text");
var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

var say = requireText.say;
var make = requireText.make;


// Constants

//physically defined constants, like Size and Time






















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




















//   __  __       _   _     
//  |  \/  | __ _| |_| |__  
//  | |\/| |/ _` | __| '_ \ 
//  | |  | | (_| | |_| | | |
//  |_|  |_|\__,_|\__|_| |_|
//                          

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

	function _check(n) {
		checkType(n, "number");                      // Make sure n is a number
		if (isNaN(n))              throw "bounds";   // Not the weird not a number thing
		if (!isFinite(n))          throw "overflow"; // Not too big for floating point
		if (n > 9007199254740992)  throw "overflow"; // Not too big for int
		if (n + 1 === n)           throw "overflow"; // Not too big for addition to work
		if (Math.floor(n) !== n)   throw "type";     // A whole number
	}

	_check(i);
	_check(min);
	if (i < min) throw "bounds"; // With the minimum value or larger
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











//functions that do the following
//given a size, tell you how many pieces there are
//given a size and piece index, give you the stripe of that piece
//given a size and piece index, give you the number of chunks
//given a size and piece index and chunk index, give you the stripe of that chunk

//be able to pipeline the entire collection
//to do this, specify the hash of a collection, and a stripe of chunks you want
//really, be able to pipeline even more than that, pipeline a wole user, or information about several postings
//actually just be able to pipeline anything with multiple queued requests
//but pipeline a collection with a single short request
//which is, the hash of the collection, a starting chunk index, and a number of chunks to send
//so here to service that, have functions that zoom down to bytes starting from
//collection
//file
//piece
//chunk

//and the underscore function that powers all these
//takes a size, a max slice size, and tells how many
//takes a size, a max slice size, and index, and returns a stripe


//maybe call this piece instead of slice, even though it's for piece and chunk






// How many pieces that are piece or smaller are in file
function sliceN(piece, file) {
	check(piece, 1); // piece is the largest a piece can be, like 1mb or 16kb
	check(file, 1);  // file is the size of the file or piece of the file to slice

	var n = divide(file, piece).ceiling; // Any remainder will mean one additional piece

	check(n, 1); // Every file has to be at least 1 piece
	return n;
}

// Stripe i in file which was sliced into pieces piece or smaller
function sliceStripe(piece, file, i) {
	var n = sliceN(piece, file); // Find out how many pieces there are
	if (i < 0 || i >= n) throw "bounds"; // Make sure i is a valid piece index

	var a = scale(i,     file, n).whole; // Byte index of start of stripe i
	var b = scale(i + 1, file, n).whole; // Byte index of end of stripe i
	if (scale(n, file, n).whole != file) throw "bounds"; // Make sure the last stripe matches the end of the file

	return Stripe(a, b - a); // Stripe i is from a to b
}

exports.sliceN = sliceN;
exports.sliceStripe = sliceStripe;


//if the file size limit is a problem, instead of interleaving them with scale, you could figure out exactly how many of each there are, and put all the small ones first and all the big ones second






//if a piece is 1mb or smaller and a chunk is 16kb or smaller, you should probably make the medium bin 16kb instead of 8kb so it can hold a whole chunk
//also, you have a feeling that this matches something in node, like the size of a buffer that gets put in c space rather than v8 space

//what parts you have is probably best expressed as a stripe pattern of chunks, not bytes, and not a spray pattern
//a 2gb file has just 2048 pieces and 131072 chunks, so these numbers are very reasonable to work with and will be very small to send in outline across the wire













//next things to do

//Now and Duration, hopefully that's all you'll need
//Range and Stripe
//Describe



function Stripe2(set_i, set_w) {
	var _i = set_i;
	var _w = set_w;

	function z() { return _i + _w; }
	function text() { return _i + "-" + _w; }
	function text2() { return _i + "-" + _w; }

	var _return = {
		i:_i, w:_w, z:z, text:text, text2:text2()
	}
	Object.freeze(_return);
	return _return;
}
exports.Stripe2 = Stripe2;

//look thorugh existing objects to find others that have immutable members that can be just .i, not .i()




function Stripe(setI, setSize) {
	check(setI, 0);
	check(setSize, 1);

	var _i = setI;
	var _size = setSize;

	function i() { return _i; } // The distance from the origin to the start of this Stripe, 0 or more
	function size() { return _size; } // The size of this Stripe, it's width, 1 or more



	function same(s) {
		checkType(s, "Stripe");
		return _i == s.i() && _size == s.size();
	}

	function text() {
		return _i + "_" + _size;
	}



	return {
		i:i, size:size,
		same:same, text:text,
		type:function(){ return "Stripe"; }
	};
}
exports.Stripe = Stripe;





//here's what you want to do with time
//get the time right now as a number of milliseconds since 1970
//save one of those numbers, and see it later
//see how long it's been since one, t.expired(t)
//start and then stop something, and measure both times, Duration

//turn a ms count into text for the user in several forms
//a long form, with the year and month and day
//a shorter form, with just the day of the week
//a developer form, with the day of the week down to milliseconds
//options for universal or local time
//options for 24hr or am/pm

//turn a delta of ms into text for the user
//this one is simpler, it's a count of days, hours, minuts, seconds, ms

//size
//bytes
//kb
//mb
//most appropriate unit, like 1234sb

//speed
//msot appropriate unit/s
//seconds/megabyte, that's an interesting way of doing it


//go through your java and c projects to collect all the outputs
//plan out a unified design before you start coding
//or just jump in, it's all pretty easy, actually

//notice how these are all going to be functions, not objects, because counts of bytes and counts of milliseconds are just going to be javascript numbers, which is great






function now() { return Time(Date.now()); }


function Time(setTime) {
	check(setTime, 0);

	var _time = setTime;
	function time() { return _time; }

	return {
		time:time,
		type:function(){ return "Now"; }
	};
}

//maybe also have one where you give it a number you created sometime earlier
//have the object be called Time
//and have a function now() that returns a Time set to right now
//be able to get the time now, save it as a number, and then turn it into text for the user

//remember the way fzero formats race times: 2'22"56
//this is kind of cooler looking and way more standard that your 2m 22.560s

//the program never records a time in the future
//if you ever encounter one, just throw bounds
//the way to do the future is now().expired(4 * Time.second), not now() + 4*Time.second





//maybe rename sortText, sortData, sortOutline to compareText, compareData, compareOutline, because that's what's really happening, that is the standard name, and o.sort() and a.sort() become distinct
//take a look at the mdn documentation to decide about this



















//waht if instead you set an international pack, and these functions used it

var Pack = {};
Pack.separator = " ";
Pack.ampm = true;
Pack.commasOrDecimal = "something";//define if it's 1,234.5 or 1.234,5
//have a setPack function you can use to customize behavior
//this is a great idea, it will make the argumetns below much easier












































// ---- Culture ----

function Culture() {

	set("e"); // Set default

	function set(c) {
		if (c == "e") { // English
			_culture   = "e";
			_separator = ",";
			_decimal   = ".";
			_hours     = 12;
		} else if (c == "f") { // French
			_culture   = "f";
			_separator = ".";
			_decimal   = ",";
			_hours     = 24;
		} else { // International/global/futuristic/cyberpunk
			_culture   = "i";
			_separator = " "; // U+2009 thin space
			_decimal   = "·"; // U+00B7 middle dot
			_hours     = 24;
		}
	}

	function get()       { return _culture;   } var _culture;
	function separator() { return _separator; } var _separator; // Thousands separator
	function decimal()   { return _decimal;   } var _decimal;   // Decimal separator
	function hours()     { return _hours;     } var _hours;     // Hours on the clock

	return {
		set:set, get:get,
		separator:separator, decimal:decimal, hours:hours,
		type:function(){ return "Culture"; }
	};
}
var culture = Culture();






// ---- Number ----

// Add c characters to the start of s until it's width long
// For instance, widen("1", 3) is "001"
function widen(s, width, c) {
	s = say(s);
	if (!c) c = "0";
	while (s.length < width) s = c + s;
	return s;
}

// Format numerals with thousands and decimal separator, like "1,234.567"
// Optionally specify the number of decimal digits, like 3
function commas(s, decimal) {
	s = say(s);

	var t = ""; // Target text to build and return
	var u = ""; // Temporary string

	if (decimal) {                            // There are decimal digits
		s = widen(s, decimal + 1);              // Prepend enough leading zeros to compose "0.001"
		t = culture.decimal() + s.end(decimal); // Start t like ".001"
		s = s.chop(decimal);                    // Remove the trailing "001" from s
	}

	while (s.length > 3) { // Move commas and groups of 3 characters from s to t
		u = s.end(3);
		s = s.chop(3);
		t = culture.separator() + u + t;
	}
	return s + t; // Move the leading group of up to 3 characters
}

// Given a number and a name, compose text like "5 objects"
function items(n, name) {
	if      (n == 0) return "0 " + name + "s";                            // "0 names"
	else if (n == 1) return "1 " + name;                                  // "1 name"
	else             return separate(say(n), c, allowFour) + " " + name + "s"; // "2 names" and up
}

exports.widen = widen;
exports.commas = commas;
exports.items = items;



// ---- Fraction ----

// Describe a/b like "1.234"
function sayDivide(n, d) {
	if (d == 0) return "undefined";
	return commas(scale(n, 1000, d).whole, 3);
}

/** Describe a/b like "81.211% 912/1,123". *
public static String percent(long a, long b) {
	String s = Describe.commas(a) + "/" + Describe.commas(b);
	if (b != 0) s = Describe.decimal(Describe.thousandths * Describe.percent * a / b, 3) + "% " + s;
	return s;
}
*/

// ---- Progress ----

//fractions of sizes












// ---- Size ----


// Size constants
var Size = {};

Size.kb = 1024;           // Number of bytes in a kilobyte, using the binary prefix instead of the decimal one
Size.mb = 1024 * Size.kb; // Number of bytes in a megabyte
Size.gb = 1024 * Size.mb; // Number of bytes in a gigabyte
Size.tb = 1024 * Size.gb; // Number of bytes in a terabyte

Size.value  = 20;           // A SHA1 hash value is 20 bytes

Size.medium =  8 * Size.kb; // 8 KB in bytes, the capacity of a normal Bin, our buffer size for TCP sockets
Size.big    = 64 * Size.kb; // 64 KB in bytes, the capacity of a big Bin, our buffer size for UDP packets

Size.piece =  1 * Size.mb; // A piece is 1mb or smaller
Size.chunk = 16 * Size.kb; // A chunk is 16kb or smaller

Size.max = 9007199254740992;//largest number that javascript can handle as an integer, 2^53

Object.freeze(Size);
exports.Size = Size;


/*


function saySize(n, units) {
	check(n, 0);

	// Given units
	if (units == "b")  return make(commas(n),                          "b");
	if (units == "kb") return make(commas(divide(n, Size.kb).ceiling), "kb"); // Round up so 1 byte is 1kb, not 0kb
	if (units == "mb") return make(commas(divide(n, Size.mb).ceiling), "mb");
	if (units == "gb") return make(commas(divide(n, Size.gb).ceiling), "gb");
	if (units == "tb") return make(commas(divide(n, Size.tb).ceiling), "tb"); // Down here, 1 byte is also 1tb, which makes less sense

	// No units given, compose text like "1234mb" with the appropriate unit
	var d = 1; // Starting unit of 1 byte
	var u = 0;
	var unit = ["b", "kb", "mb", "gb", "tb"];
	while (u < unit.length) { // Loop until we're out of units

		var w = divide(n, d).whole; // Find out how many of the current unit we have
		if (w <= 9999) return make(w, unit[u]); // Four digits or less, use this unit

		d *= 1024; // Move to the next larger unit
		u++;
	}
	throw "overflow"; // We ran out of units, not really possible because Size.max is 8191tb
}


// ---- Speed ----

/*
	/** Given a number of bytes transferred in a second, describe the speed in kilobytes per second like "2.24 KB/s". *
	public static String speed(int bytesPerSecond) {
		int i = (bytesPerSecond * 100) / 1024; // Compute the number of hundreadth kilobytes per second
		if      (i == 0)    return "";                                                                                      // Return "" instead of "0.00 KB/s"
		else if (i <    10) return "0.0" + i + " KB/s";                                                                     // 1 digit   "0.09 KB/s"
		else if (i <   100) return "0." + i + " KB/s";                                                                      // 2 digits  "0.99 KB/s"
		else if (i <  1000) return Text.start(Number.toString(i), 1) + "." + Text.clip(Number.toString(i), 1, 2) + " KB/s"; // 3 digits  "9.99 KB/s"
		else if (i < 10000) return Text.start(Number.toString(i), 2) + "." + Text.clip(Number.toString(i), 2, 1) + " KB/s"; // 4 digits  "99.9 KB/s"
		else                return commas(Text.chop(Number.toString(i), 2)) + " KB/s";                                      // 5 or more "999 KB/s" or "1,234 KB/s"
	}
*/


/*
exports.saySize = saySize;

// ---- Time ----

// Time constants
var Time = {};
Time.second = 1000;             // Number of milliseconds in a second
Time.minute = 60 * Time.second; // Number of milliseconds in a minute
Time.hour   = 60 * Time.minute; // Number of milliseconds in an hour
Time.day    = 24 * Time.hour;   // Number of milliseconds in a day
Object.freeze(Time);



/*
	/** Describe the given number of milliseconds with a String like "1 min 24 sec". *
	public static String time(long milliseconds) { return time(milliseconds, false); }
	/** Describe the given number of milliseconds with a String like "5 sec" or "10 sec", counting up in big steps. *
	public static String timeCoarse(long milliseconds) { return time(milliseconds, true); }
	/** Given a number of milliseconds, describe the length of time with a String like "1 min 24 sec". *
	private static String time(long milliseconds, boolean coarse) {
		
		// Compute the number of whole seconds, minutes, and hours in the given number of milliseconds
		long seconds = milliseconds / Time.second;
		if (coarse && seconds > 5) seconds -= seconds % 5; // If coarse and above 5, round down to the nearest multiple of 5
		long minutes = seconds / 60;
		long hours = minutes / 60;
		
		// Compose and return a String that describes that amount of time
		if      (seconds <    60) return seconds + " sec";                                        // "0 sec" to "59 sec"
		else if (seconds <   600) return minutes + " min " + (seconds - (minutes * 60)) + " sec"; // "1 min 0 sec" to "9 min 59 sec"
		else if (seconds <  3600) return minutes + " min";                                        // "10 min" to "59 min"
		else if (seconds < 36000) return hours + " hr " + (minutes - (hours * 60)) + " min";      // "1 hr 0 min" to "9 hr 59 min"
		else                      return commas(hours) + " hr";                                   // "10 hr" and up
	}
*/

// d h m s

//have a time format like a racing game with 5'15"22 or 5m 15s 220ms or 5 min 15 seconds 220 milliseconds



// ---- Date ----

/*
	/** Given a number of milliseconds since January 1970, compose the local day and time like "Fri 12:52p 07.023s". *
	public static String day(long milliseconds) {
		Calendar c = Calendar.getInstance();
		c.setTime(new Date(milliseconds));

		// "Fri "
		String s = "";
		int d = c.get(Calendar.DAY_OF_WEEK);
		switch (d) {
		case Calendar.MONDAY:    s = "Mon "; break;
		case Calendar.TUESDAY:   s = "Tue "; break;
		case Calendar.WEDNESDAY: s = "Wed "; break;
		case Calendar.THURSDAY:  s = "Thu "; break;
		case Calendar.FRIDAY:    s = "Fri "; break;
		case Calendar.SATURDAY:  s = "Sat "; break;
		case Calendar.SUNDAY:    s = "Sun "; break;
		}
		
		// "12:52p "
		int hour = c.get(Calendar.HOUR);
		if (hour == 0)
			hour = 12;
		s += numerals(hour, 1) + ":" + numerals(c.get(Calendar.MINUTE), 2);
		if (c.get(Calendar.AM_PM) == Calendar.AM)
			s += "a ";
		else
			s += "p ";

		// "07.023s"
		s += numerals(c.get(Calendar.SECOND), 2) + "." + numerals(c.get(Calendar.MILLISECOND), 3) + "s";

		return s;
	}
*/

//2013 Jun 20 Thu 22:50
//            Thu 22:50 59·123
//always show in the user's local time


































//this is not processing time, just saying it


//remove widen and separate from text to have them just here


//also look thorugh your c code to bring in stuff there



//use say(n) instead of numerals(n), it's shorter and easier to remember
//search all your code to do it this way




//all in all, don't bring in every kind of everything
//rather, write the simple international subset that the library will use







//make your own log that takes any number of anythings, calls say on each one, and also logs to a file later if you want

//maybe rename make to say
//do you really need both make() and say(), maybe combine them to just make(), and rename that say()
//try to find an instance where you need to call say, and couldn't just call make, the way things are now








//basically, the areas to say are
//Size, including progress
//Time, including time and date
//Speed, including seconds per megabyte




//have return freeze({})
//and is there anywhere you wouldn't want to use that, actually?
//that prevents you from messing up an object, but does it prevent you from making a mutable object?




















