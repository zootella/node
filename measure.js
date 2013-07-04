
var log = console.log;

var requireText = require("./text");
var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

var say = requireText.say;
























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
//have min be optional, if !min min = 0, change check(n, 0) to just check(n)




































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



















// A Now remembers the moment when it was made
function Now() {

	var _time = Date.now();                                 // Save the number of milliseconds between January 1970 and right now
	function expired(t) { check(t, 0); return t <= age(); } // True if t or more milliseconds have passed since this Now was made
	function age() { return Date.now() - _time; }           // The number of milliseconds that have passed since this Now was made
	function text() { return sayDayAndTime(_time); }        // Convert into text like "Sat 11:09a 49.146s"

	return Object.freeze({                  // Freeze the public interface your object is returning to include immutable properties
		time:_time, expired:expired, age:age, // For instance, setting now.time doesn't change it
		text:text,                            // Without this, you would have to access it with the function now.time()
		type:function(){ return "Now"; }
	});
}
exports.Now = Now;


//do Duration, those two might be all you need


















// Make a Speed object, tell it distances traveled or counts when they happen, and get the current speed
// Given a window of 3*Time.second, the object will keep between 2 and 4 seconds of data to calculate the current speed
function Speed(window) {
	check(window, 100); // The smallest allowed window is 1/10 of a second

	var _created = Now();                   // When this Speed object was created, and the start of column 0
	var _width = scale(window, 2, 3).whole; // The width in milliseconds of all the columns in time after that

	var _column   = 0; // The column index, 0 or more, we last added to
	var _current  = 0; // The total distance recorded in that column of time
	var _previous = 0; // The total distance we recorded in the previous column of time

	function distance(d) { return add(d, 1);    } // Record that we just traveled the given distance or counted the given number of events
	function count()     { return add(1, 1);    } // Record that we just counted another event
	function speed(unit) { return add(0, unit); } // Find out how fast we're going right now, 0 or more distance units or events per given time unit, like Time.second

	// Given a distance to add, or 0 to add nothing, calculate our speed right now in the given unit of time and decimal places
	// For instance, set unit to Time.second * 1000 to get the speed in thousandths of distance units per second
	function add(distance, unit) {
		check(distance, 0);
		check(unit, 1);

		var a = divide(_created.age(), _width);
		var columnNow = a.whole; // The column index, 0 or more, that the current time places us in now
		var time = a.remainder;  // How long we've been in the current column

		if (columnNow != 0) time += _width;    // After column 0, we also have distances from the previous column in time

		if (_column == columnNow) {            // We're still in the same column we last added a distance to, no cycle necessary
		} else if (_column + 1 == columnNow) { // Time has moved us into the next column
			_previous = _current;                // Cycle the totals
			_current = 0;
		} else {                               // Time has moved us two or more columns forward
			_previous = 0;                       // Zero both totals
			_current = 0;
		}

		_current += distance; // Add any given distance to the current total
		_column = columnNow;  // Record the column number we put it in, and the column we cycled to above
		
		if (time < 100) return 0; // Avoid reporting huge or inaccurate speeds at the very start
		return scale(unit, _current + _previous, time).whole; // Rate is distance over time
	}

	return {
		distance:distance, count:count, speed:speed, add:add,
		type:function(){ return "Speed"; }
	};
}
exports.Speed = Speed;

































































//    ____      _ _                  
//   / ___|   _| | |_ _   _ _ __ ___ 
//  | |  | | | | | __| | | | '__/ _ \
//  | |__| |_| | | |_| |_| | | |  __/
//   \____\__,_|_|\__|\__,_|_|  \___|
//                                   

// Program settings for which comma and decimal separator to use
// The functions below use this object to compose the text they return
function Culture() {

	set("e"); // Set default

	function set(c) {
		if (c == "e") { // English
			_culture   = "e";
			_separator = ",";
			_decimal   = ".";
			_clock     = 12;
		} else if (c == "f") { // French
			_culture   = "f";
			_separator = ".";
			_decimal   = ",";
			_clock     = 24;
		} else { // International/global/futuristic/cyberpunk
			_culture   = "i";
			_separator = " "; // U+2009 thin space
			_decimal   = "·"; // U+00B7 middle dot
			_clock     = 24;
		}
	}

	function get()       { return _culture;   } var _culture;   // Which culture we're set to
	function separator() { return _separator; } var _separator; // Thousands separator
	function decimal()   { return _decimal;   } var _decimal;   // Decimal separator
	function clock()     { return _clock;     } var _clock;     // Hours on the clock

	return {
		set:set, get:get,
		separator:separator, decimal:decimal, clock:clock,
		type:function(){ return "Culture"; }
	};
}
var culture = Culture();

exports.optionCulture = culture;//first time trying to export a global var






//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         

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
	if      (n == 0) return say("0 ", name, "s");           // "0 names"
	else if (n == 1) return say("1 ", name);                // "1 name"
	else             return say(commas(n), " ", name, "s"); // "2 names" and up
}

exports.widen = widen;
exports.commas = commas;
exports.items = items;






//   _____               _   _             
//  |  ___| __ __ _  ___| |_(_) ___  _ __  
//  | |_ | '__/ _` |/ __| __| |/ _ \| '_ \ 
//  |  _|| | | (_| | (__| |_| | (_) | | | |
//  |_|  |_|  \__,_|\___|\__|_|\___/|_| |_|
//                                         

// Describe a/b like "1.234"
// Specify decimal to include that many decimal places, otherwise round down
function sayDivide(n, d, decimal) {
	return commas(scale(_tens(decimal), n, d).whole, decimal);
}

// Describe a/b like "81.211% 912/1,123"
// Specify decimal to include that many decimal places in the percentage
function sayPercent(n, d, decimal) {
	return say(commas(scale(100 * _tens(decimal), n, d).whole, decimal), "% ", commas(n), "/", commas(d));
}

// Describe a/b like "6% 1122mb/18gb"
// Specify decimal like 1 and units like "kb" to make it like "50.0% 1,024.0kb/2,048.0kb"
function sayProgress(n, d, decimal, units) {
	return say(commas(scale(100 * _tens(decimal), n, d).whole, decimal), "% ", saySize(n, decimal, units), "/", saySize(d, decimal, units));
}

// Given a number of decimal places, return the necessary multiplier
// For instance _tens(0) is 1, _tens(1) is 10, 2 is 100, 3 is 1000, and so on
function _tens(decimal) {
	if (!decimal) decimal = 0; // By default, no decimal places, and a multiplier of 1
	check(decimal, 0);
	var m = 1;
	for (var i = 0; i < decimal; i++) m *= 10;
	return m;
}

exports.sayDivide = sayDivide;
exports.sayPercent = sayPercent;
exports.sayProgress = sayProgress;






//   ____  _         
//  / ___|(_)_______ 
//  \___ \| |_  / _ \
//   ___) | |/ /  __/
//  |____/|_/___\___|
//                   

// Size constants
var Size = {};
Size.b  = 1;            // One byte
Size.kb = 1024*Size.b;  // Number of bytes in a kilobyte, using the binary prefix instead of the decimal one
Size.mb = 1024*Size.kb; // Number of bytes in a megabyte
Size.gb = 1024*Size.mb; // Number of bytes in a gigabyte
Size.tb = 1024*Size.gb; // Number of bytes in a terabyte
Size.pb = 1024*Size.tb; // Number of bytes in a petabyte

Size.value = 20; // A SHA1 hash value is 20 bytes

Size.medium =  8*Size.kb; // 8 KB in bytes, the capacity of a normal Bin, our buffer size for TCP sockets
Size.big    = 64*Size.kb; // 64 KB in bytes, the capacity of a big Bin, our buffer size for UDP packets

Size.max = 9007199254740992; // Largest number that JavaScript keeps as an integer, 2^53
Object.freeze(Size);

// Describe the given number of bytes like "97kb" or "9536gb" using 4 digits or less with the most appropriate unit
// Optionally specify a number of decimal places and a unit, like 3 and "mb" for text like "9,419.006mb"
function saySize(n, decimal, units) {
	check(n, 0);

	// Given units
	if (units == "b")  return say(commas(scale(_tens(decimal), n, Size.b).ceiling,  decimal), "b");
	if (units == "kb") return say(commas(scale(_tens(decimal), n, Size.kb).ceiling, decimal), "kb"); // Round up so 1 byte is 1kb, not 0kb
	if (units == "mb") return say(commas(scale(_tens(decimal), n, Size.mb).ceiling, decimal), "mb"); // 1 byte is also 1mb
	if (units == "gb") return say(commas(scale(_tens(decimal), n, Size.gb).whole,   decimal), "gb"); // For gigabyte and larger, round down
	if (units == "tb") return say(commas(scale(_tens(decimal), n, Size.tb).whole,   decimal), "tb");
	if (units == "pb") return say(commas(scale(_tens(decimal), n, Size.pb).whole,   decimal), "pb");

	// No units given, compose text like "1234mb" with the appropriate unit and no decimal places
	var d = 1; // Starting unit of 1 byte
	var u = 0;
	var unit = ["b", "kb", "mb", "gb", "tb", "pb"];
	while (u < unit.length) { // Loop until we're out of units

		var w = divide(n, d).whole; // Find out how many of the current unit we have
		if (w <= 9999) return say(w, unit[u]); // Four digits or less, use this unit

		d *= 1024; // Move to the next larger unit
		u++;
	}
	throw "overflow"; // We ran out of units, not really possible because Size.max is 8191tb
}

exports.Size = Size;
exports.saySize = saySize;






//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

// Describe the given number of bytes transferred in a second
// Optionally specify a number of decimal places and a unit
function saySpeed(bytesPerSecond, decimal, units) {
	return saySize(bytesPerSecond, decimal, units) + "/s";
}

// Describe the given a number of bytes transferred in a second in kilobytes per second like "2.24kb/s"
function saySpeedKbps(bytesPerSecond) {
	var i = scale(100, bytesPerSecond, Size.kb).whole; // Compute the number of hundreadth kilobytes per second
	if      (i <     1) return "0.00kb/s";                                           //           "0.00kb/s"
	else if (i <    10) return say("0.0", i, "kb/s");                                // 1 digit   "0.09kb/s"
	else if (i <   100) return say("0.", i, "kb/s");                                 // 2 digits  "0.99kb/s"
	else if (i <  1000) return say(say(i).start(1), ".", say(i).clip(1, 2), "kb/s"); // 3 digits  "9.99kb/s"
	else if (i < 10000) return say(say(i).start(2), ".", say(i).clip(2, 1), "kb/s"); // 4 digits  "99.9kb/s", omit hundreadths
	else                return say(commas(say(i).chop(2)), "kb/s");                  // 5 or more "999kb/s" or "1,234kb/s"
}

// Say how long it takes to transfer a megabyte, like "42s/mb"
// The given bytes per second must be 1 through Size.mb, returns blank otherwise
// Good for making a slow speed make sense
function saySpeedTimePerMegabyte(bytesPerSecond) {
	check(bytesPerSecond, 0);
	if (bytesPerSecond < 1 || bytesPerSecond > Size.mb) return ""; // 0 would be forever, larger than 1mb would be 0s/mb
	return sayTimeRemaining(scale(Time.second, Size.mb, bytesPerSecond).whole) + "/mb";
}

exports.saySpeed = saySpeed;
exports.saySpeedKbps = saySpeedKbps;
exports.saySpeedTimePerMegabyte = saySpeedTimePerMegabyte;






//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

// Time constants
var Time = {};
Time.second = 1000;             // 1000, number of milliseconds in a second
Time.minute = 60 * Time.second; // 60000, number of milliseconds in a minute
Time.hour   = 60 * Time.minute; // 3600000, number of milliseconds in an hour
Time.day    = 24 * Time.hour;   // 86400000, number of milliseconds in a day
Time.month  = 2629800000;       // 1/12 of 365.25 days
Time.year   = 31557600000;      // 365.25 days
Object.freeze(Time);

// Describe the given number of milliseconds with text like "13h 29m 0.991s"
function sayTime(t) {
	check(t, 0);

	function take(unit, name) {
		var d = divide(t, unit);                // See how many unit amounts are in t
		if (d.whole || s.length) {              // If 1 or more, or if we previously took a bigger unit
			s += say(commas(d.whole), name, " "); // Add it to the string like "5h "
			t = d.remainder;                      // Subtract it from the total
		}
	}

	var s = "";
	take(Time.year,   "y"); // Remove large units from t
	take(Time.month,  "m");
	take(Time.day,    "d");
	take(Time.hour,   "h");
	take(Time.minute, "m");

	s += say(commas(t, 3), "s"); // What's left is 0-59999, compose text like "0.000s" and "59.999s"
	return s;
}

// Describe the given number of milliseconds with text like "1m 24s" using one or two time units
// Coarse option to round down to the nearest 5 seconds so a countdown isn't distracting
// Good for telling the user how long the program predicts something will take
function sayTimeRemaining(t, coarse) {
	check(t, 0);

	// Compute the number of whole seconds, minutes, hours, and days in the given number of milliseconds
	var s = divide(t, Time.second).whole;
	var m = divide(t, Time.minute).whole;
	var h = divide(t, Time.hour).whole;
	var d = divide(t, Time.day).whole;

	// If coarse and above 5, round down to the nearest multiple of 5
	if (coarse && s > 5) s -= s % 5;
	
	// Compose and return a String that describes that amount of time
	if      (s <     60) return say(s, "s");                   // "0s" to "59s"
	else if (s <    600) return say(m, "m ", s - (m*60), "s"); // "1m 0s" to "9m 59s"
	else if (s <   3600) return say(m, "m");                   // "10m" to "59m"
	else if (s <  36000) return say(h, "h ", m - (h*60), "m"); // "1h 0m" to "9h 59m"
	else if (s < 259200) return say(h, "h");                   // "10h" to "71h"
	else                 return say(commas(d), "d");           // "3d" and up
}

// Describe the given number of milliseconds with text like 5'15"223
// Sports a global race style that's accurate to milliseconds
// Godo for telling the user exactly how long something took
function sayTimeRace(t) {
	check(t, 0);

	var m = divide(t, Time.minute).whole;
	var s = divide(t - (m*Time.minute), Time.second).whole;
	var ms = t - (m*Time.minute) - (s*Time.second);

	return "#'#\"#".fill(commas(m), widen(s, 2), widen(ms, 3));
}

exports.Time = Time;
exports.sayTime = sayTime;
exports.sayTimeRemaining = sayTimeRemaining;
exports.sayTimeRace = sayTimeRace;






//   ____        _       
//  |  _ \  __ _| |_ ___ 
//  | | | |/ _` | __/ _ \
//  | |_| | (_| | ||  __/
//  |____/ \__,_|\__\___|
//                       

// Turn the given number of milliseconds since 1970 into text like "2002 Jun 22 Sat 11:09a" with the year, month, day, and time
function sayDate(t) {
	var a = _date(t);
	return say(a.y, " ", a.m, " ", a.d, " ", a.w, " ", a.t);
}

// Turn the given number of milliseconds since 1970 into text like "2002 Jun 22 Sat 11:09a 49.146s" with everything
function sayDateAndTime(t) {
	var a = _date(t);
	return say(a.y, " ", a.m, " ", a.d, " ", a.w, " ", a.t, " ", a.s, culture.decimal(), a.ms, culture.clock() == 12 ? "s" : "");
}

// Turn the given number of milliseconds since 1970 into text like "Sat 11:09a 49.146s" with the day and time to milliseconds
function sayDayAndTime(t) {
	var a = _date(t);
	return say(a.w, " ", a.t, " ", a.s, culture.decimal(), a.ms, culture.clock() == 12 ? "s" : "");
}

// Given a number of milliseconds since January 1970, generate information about the local date and time
function _date(t) {

	var date = new Date(t);
	var y = date.getFullYear(); // Year

	var m;
	switch (date.getMonth()) { // Month, 0-11
		case  0: m = "Jan"; break;
		case  1: m = "Feb"; break;
		case  2: m = "Mar"; break;
		case  3: m = "Apr"; break;
		case  4: m = "May"; break;
		case  5: m = "Jun"; break;
		case  6: m = "Jul"; break;
		case  7: m = "Aug"; break;
		case  8: m = "Sep"; break;
		case  9: m = "Oct"; break;
		case 10: m = "Nov"; break;
		case 11: m = "Dec"; break;
	}

	var d = date.getDate(); // Day of the month, 1-31

	var w;
	switch (date.getDay()) { // Day of the week, 0-6
		case 0: w = "Sun"; break;
		case 1: w = "Mon"; break;
		case 2: w = "Tue"; break;
		case 3: w = "Wed"; break;
		case 4: w = "Thu"; break;
		case 5: w = "Fri"; break;
		case 6: w = "Sat"; break;
	}

	var t;                           // Time of day
	var hours = date.getHours();     // Hour 0-23
	var minutes = date.getMinutes(); // Minute 0-59
	if (culture.clock() == 12) {     // 12 hour time, like "12:01a", "9:30a" or "2:55p"
		if      (hours == 0)  t = "#:#a".fill(hours + 12, widen(minutes, 2)); // 0 hours is 12a
		else if (hours < 12)  t = "#:#a".fill(hours,      widen(minutes, 2)); // 1 hours is 1a
		else if (hours == 12) t = "#:#p".fill(hours,      widen(minutes, 2)); // 12 hours is 12p
		else                  t = "#:#p".fill(hours - 12, widen(minutes, 2)); // 13 hours is 1p, 23 hours is 11p
	} else {                         // 24 hour time, like "00:01", "09:30" or "14:55"
		t = "#:#".fill(widen(hours, 2), widen(minutes, 2));
	}

	var s = widen(date.getSeconds(), 2); // Second 0-59
	var ms = widen(date.getMilliseconds(), 3); // Millisecond 0-999

	return { y:y, m:m, d:d, w:w, t:t, s:s, ms:ms };
}

exports.sayDate = sayDate;
exports.sayDateAndTime = sayDateAndTime;
exports.sayDayAndTime = sayDayAndTime;






































//if a piece is 1mb or smaller and a chunk is 16kb or smaller, you should probably make the medium bin 16kb instead of 8kb so it can hold a whole chunk
//also, you have a feeling that this matches something in node, like the size of a buffer that gets put in c space rather than v8 space

//what parts you have is probably best expressed as a stripe pattern of chunks, not bytes, and not a spray pattern
//a 2gb file has just 2048 pieces and 131072 chunks, so these numbers are very reasonable to work with and will be very small to send in outline across the wire





function Stripe(set_i, set_w) {
	check(set_i, 0);
	check(set_w, 1);

	var _i = set_i;   // The distance from the origin to the start of this Stripe, 0 or more
	var _w = set_w;   // The size of this Stripe, its width, 1 or more
	var _z = _i + _w; // The extent of this Stripe, the index of the far edge

	function same(s) {
		checkType(s, "Stripe");
		return _i == s.i && _w == s.w;
	}

	function text() { return "i#w#".fill(_i, _w); }

	return Object.freeze({
		i:_i, w:_w, z:_z,
		same:same, text:text,
		type:function(){ return "Stripe"; }
	});
}
exports.Stripe = Stripe;









//    ____ _                 _                      _   ____  _               
//   / ___| |__  _   _ _ __ | | __   __ _ _ __   __| | |  _ \(_) ___  ___ ___ 
//  | |   | '_ \| | | | '_ \| |/ /  / _` | '_ \ / _` | | |_) | |/ _ \/ __/ _ \
//  | |___| | | | |_| | | | |   <  | (_| | | | | (_| | |  __/| |  __/ (_|  __/
//   \____|_| |_|\__,_|_| |_|_|\_\  \__,_|_| |_|\__,_| |_|   |_|\___|\___\___|
//                                                                            

// bytes is the number of bytes in the file
// chunks in the number of chunks in the file
// pieces is the number of pieces in the file
// indices and stripes are in units of bytes, chunks, or pieces, as named

// How many chunks there are in a file of size bytes
function numberOfChunks(bytes) {
	check(bytes, 1);
	return divide(bytes, 16*Size.kb).ceiling; // A chunk is 16kb or smaller
}
// How many pieces there are in a file of size bytes
function numberOfPieces(bytes) {
	check(bytes, 1);
	var chunks = numberOfChunks(bytes);
	return divide(chunks, 64).ceiling; // A piece is 64 chunks or fewer, making it 1mb or smaller
}

// Where the given chunk index is in a file of size bytes
function indexChunkToByte(bytes, chunkIndex) {
	check(bytes, 1);
	check(chunkIndex, 0);
	var chunks = numberOfChunks(bytes);
	if (chunkIndex > chunks) throw "bounds";
	return scale(bytes, chunkIndex, chunks).whole; // Without using bignum, a file larger than 511gb will overflow
}
// What chunk index the given piece index is in a file of size bytes
function indexPieceToChunk(bytes, pieceIndex) {
	check(bytes, 1);
	check(pieceIndex, 0);
	var chunks = numberOfChunks(bytes);
	var pieces = numberOfPieces(bytes);
	if (pieceIndex > pieces) throw "bounds";
	return scale(chunks, pieceIndex, pieces).whole;
}
// Where the given piece index is in a file of size bytes
function indexPieceToByte(bytes, pieceIndex) {
	return indexChunkToByte(bytes, indexPieceToChunk(bytes, pieceIndex));
}

// Where in bytes the given stripe of chunks is in a file of size bytes
function stripeChunkToByte(bytes, chunkStripe) {
	var i = indexChunkToByte(bytes, chunkStripe.i);
	var z = indexChunkToByte(bytes, chunkStripe.z);
	return Stripe(i, z - i);
}
// Where in chunks the given stripe of pieces is in a file of size bytes
function stripePieceToChunk(bytes, pieceStripe) {
	var i = indexPieceToChunk(bytes, pieceStripe.i);
	var z = indexPieceToChunk(bytes, pieceStripe.z);
	return Stripe(i, z - i);
}
// Where in bytes the given stripe of pieces is in a file of size bytes
function stripePieceToByte(bytes, pieceStripe) {
	var i = indexPieceToByte(bytes, pieceStripe.i);
	var z = indexPieceToByte(bytes, pieceStripe.z);
	return Stripe(i, z - i);
}

exports.numberOfChunks = numberOfChunks;
exports.numberOfPieces = numberOfPieces;

exports.indexChunkToByte = indexChunkToByte;
exports.indexPieceToChunk = indexPieceToChunk;
exports.indexPieceToByte = indexPieceToByte;

exports.stripeChunkToByte = stripeChunkToByte;
exports.stripePieceToChunk = stripePieceToChunk;
exports.stripePieceToByte = stripePieceToByte;

























//make your own log that takes any number of anythings, calls say on each one, and also logs to a file later if you want

//have return freeze({})
//and is there anywhere you wouldn't want to use that, actually?
//that prevents you from messing up an object, but does it prevent you from making a mutable object?





//maybe rename sortText, sortData, sortOutline to compareText, compareData, compareOutline, because that's what's really happening, that is the standard name, and o.sort() and a.sort() become distinct
//take a look at the mdn documentation to decide about this




//look thorugh existing objects to find others that have immutable members that can be just .i, not .i()
//in fact, what would happen if you did return Object.freeze({}) for every object? why not just do that
//that woudl work, right? it woudl just mean the functions can't change to a different function, members inside can still change




/*
code node
add to divide
a.round
it it's half or more, it's up, otherwise it's down
and then use it for saySize gb, tb, pb
and also use it for 1.234mb, have the 4 rounded, not chopped
*/







//next things to do

//Now and Duration, hopefully that's all you'll need
//Range and Stripe
//Describe













