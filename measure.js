
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





/*

package org.zootella.base.time;

/** Make a Speed object, tell it distances traveled or counts when they happen, and get the current speed. *
public class Speed {
	
	/**
	 * Make a new Speed object that can keep track of how fast you're traversing a distance or counting events.
	 * Given a window of 3 * Time.second, the object will keep between 2 and 4 seconds of data to calculate the current speed.
	 *
	public Speed(long window) {
		created = new Now();    // Record that column 0 started now
		width = window * 2 / 3; // Calculate the column width
	}

	/** When this Speed object was created, and the start of column 0. *
	private final Now created;
	/** The width in milliseconds of all the columns in time after that. *
	private final long width;
	
	/** The column index, 0 or more, we last added to. *
	private long column;
	/** The total distance recorded in that column of time. *
	private long current;
	/** The total distance we recorded in the previous column of time. *
	private long previous;

	/** Record that we just traveled the given distance or counted the given number of events. *
	public void distance(long distance) { add(distance, 1); }
	/** Record that we just counted another event. *
	public void count() { add(1, 1); }
	/** Find out how fast we're going right now, 0 or more distance units or events per given time unit, like Time.second. *
	public long speed(long multiply) { return add(0, multiply); }
	
	/** Given a distance to add, or 0 to add nothing, calculate our speed right now in the given unit of time and decimal places, like Time.second * Describe.thousandths. *
	public long add(long distance, long multiply) {
		
		long age = Time.now() - created.time; // Age of this Speed object
		long columnNow = age / width;         // The column index, 0 or more, the current time places us in now
		long time = age % width;              // How long we've been in the current column
		if (columnNow != 0) time += width;    // After column 0, we also have distances from the previous column in time

		if (column == columnNow) {            // We're still in the same column we last added a distance to, no cycle necessary
		} else if (column + 1 == columnNow) { // Time has moved us into the next column
			previous = current;               // Cycle the totals
			current = 0;
		} else {                              // Time has moved us two or more columns forward
			previous = 0;                     // Zero both totals
			current = 0;
		}

		current += distance; // Add any given distance to the current total
		column = columnNow; // Record the column number we put it in, and the column we cycled to above
		
		if (time < required) return 0; // Avoid reporting huge or inaccurate speeds at the very start
		else return multiply * (current + previous) / time; // Rate is distance over time
	}
	
	/** Don't report a speed at the very start because we don't have enough data yet. *
	public static long required = Time.second / 10;
}

*/



















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

	function get()       { return _culture;   } var _culture;
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
	if      (n == 0) return make("0 ", name, "s");           // "0 names"
	else if (n == 1) return make("1 ", name);                // "1 name"
	else             return make(commas(n), " ", name, "s"); // "2 names" and up
}

exports.widen = widen;
exports.commas = commas;
exports.items = items;



// ---- Fraction ----

// Describe a/b like "1.234"
function sayDivide(n, d, decimal) {
	return commas(scale(_tens(decimal), n, d).whole, decimal);
}

// Describe a/b like "81.211% 912/1,123"
function sayPercent(n, d, decimal) {
	return make(commas(scale(100 * _tens(decimal), n, d).whole, decimal), "% ", commas(n), "/", commas(d));
}

function sayProgress(n, d, decimal, units) {
	return make(commas(scale(100 * _tens(decimal), n, d).whole, decimal), "% ", saySize(n, decimal, units), "/", saySize(d, decimal, units));
}

// Given a number of decimal places, return the necessary multiplier
// For instance _tens(0) is 1, _tens(1) is 10, 2 is 100, 3 is 1000, and so on
function _tens(decimal) {
	if (!decimal) decimal = 0; // By default, no decimal places, and a multiplier of 1
	var m = 1;
	for (var i = 0; i < decimal; i++) m *= 10;
	return m;
}

exports.sayDivide = sayDivide;
exports.sayPercent = sayPercent;
exports.sayProgress = sayProgress;










// ---- Size ----

// Size constants
var Size = {};
Size.b  = 1;              // One byte
Size.kb = 1024 * Size.b;  // Number of bytes in a kilobyte, using the binary prefix instead of the decimal one
Size.mb = 1024 * Size.kb; // Number of bytes in a megabyte
Size.gb = 1024 * Size.mb; // Number of bytes in a gigabyte
Size.tb = 1024 * Size.gb; // Number of bytes in a terabyte
Size.pb = 1024 * Size.tb; // Number of bytes in a petabyte

Size.value = 20; // A SHA1 hash value is 20 bytes

Size.medium =  8 * Size.kb; // 8 KB in bytes, the capacity of a normal Bin, our buffer size for TCP sockets
Size.big    = 64 * Size.kb; // 64 KB in bytes, the capacity of a big Bin, our buffer size for UDP packets

Size.piece =  1 * Size.mb; // A piece is 1mb or smaller
Size.chunk = 16 * Size.kb; // A chunk is 16kb or smaller

Size.max = 9007199254740992; // Largest number that JavaScript keeps as an integer, 2^53
Object.freeze(Size);

// Describe the given number of bytes like "97kb" or "9536gb" using 4 digits or less with the most appropriate unit
// Optionally specify a number of decimal places and a unit, like 3 and "mb" for text like "9,419.006mb"
function saySize(n, decimal, units) {
	check(n, 0);

	// Given units
	if (units == "b")  return make(commas(scale(_tens(decimal), n, Size.b).ceiling,  decimal), "b");
	if (units == "kb") return make(commas(scale(_tens(decimal), n, Size.kb).ceiling, decimal), "kb"); // Round up so 1 byte is 1kb, not 0kb
	if (units == "mb") return make(commas(scale(_tens(decimal), n, Size.mb).ceiling, decimal), "mb"); // 1 byte is also 1mb
	if (units == "gb") return make(commas(scale(_tens(decimal), n, Size.gb).whole,   decimal), "gb"); // For gigabyte and larger, round down
	if (units == "tb") return make(commas(scale(_tens(decimal), n, Size.tb).whole,   decimal), "tb");
	if (units == "pb") return make(commas(scale(_tens(decimal), n, Size.pb).whole,   decimal), "pb");

	// No units given, compose text like "1234mb" with the appropriate unit and no decimal places
	var d = 1; // Starting unit of 1 byte
	var u = 0;
	var unit = ["b", "kb", "mb", "gb", "tb", "pb"];
	while (u < unit.length) { // Loop until we're out of units

		var w = divide(n, d).whole; // Find out how many of the current unit we have
		if (w <= 9999) return make(w, unit[u]); // Four digits or less, use this unit

		d *= 1024; // Move to the next larger unit
		u++;
	}
	throw "overflow"; // We ran out of units, not really possible because Size.max is 8191tb
}

exports.Size = Size;
exports.saySize = saySize;







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

//have another one which does 9999wb/s

//and a third which is 42s/mb



// ---- Time ----

// Time constants
var Time = {};
Time.second = 1000;             // Number of milliseconds in a second
Time.minute = 60 * Time.second; // Number of milliseconds in a minute
Time.hour   = 60 * Time.minute; // Number of milliseconds in an hour
Time.day    = 24 * Time.hour;   // Number of milliseconds in a day
Object.freeze(Time);

// Describe the given number of milliseconds with text like "1m 24s" using one or two time units
// Coarse option to count down in big steps, like "10s" and "5s"
// Good for telling the user how long the program predicts something will take
function sayTime(t, coarse) {

	// Compute the number of whole seconds, minutes, hours, and days in the given number of milliseconds
	var s = divide(t, Time.second).whole;
	var m = divide(t, Time.minute).whole;
	var h = divide(t, Time.hour).whole;
	var d = divide(t, Time.day).whole;

	// If coarse and above 5, round down to the nearest multiple of 5
	if (coarse && s > 5) s -= s % 5;
	
	// Compose and return a String that describes that amount of time
	if      (s <     60) return make(s, "s");                   // "0s" to "59s"
	else if (s <    600) return make(m, "m ", s - (m*60), "s"); // "1m 0s" to "9m 59s"
	else if (s <   3600) return make(m, "m");                   // "10m" to "59m"
	else if (s <  36000) return make(h, "h ", m - (h*60), "m"); // "1h 0m" to "9h 59m"
	else if (s < 259200) return make(h, "h");                   // "10h" to "71h"
	else                 return make(commas(d), "d");           // "3d" and up
}

// Describe the given number of milliseconds with text like 5'15"223
// Sports a global race style that's accurate to milliseconds
// Godo for telling the user exactly how long something took
function sayTimeRace(t) {

	var m = divide(t, Time.minute).whole;
	var s = divide(t - (m*Time.minute), Time.second).whole;
	var ms = t - (m*Time.minute) - (s*Time.second);

	return "#'#\"#".fill(commas(m), widen(s, 2), widen(ms, 3));
}

exports.Time = Time;
exports.sayTime = sayTime;
exports.sayTimeRace = sayTimeRace;







// ---- Date ----

// Given a number of milliseconds since January 1970, compose the local day and time

// like "Fri 12:52p 07.023s"

function _sayCalendar(t) {

	var date = new Date(t);

	var y = date.getFullYear();//Returns the year (4 digits for 4-digit years) of the specified date according to local time.

	var m;
	switch (date.getMonth()) {
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

	var d = date.getDate();//Returns the day of the month (1-31) for the specified date according to local time.

	var w;
	switch (date.getDay()) {
		case 0: w = "Sun"; break;
		case 1: w = "Mon"; break;
		case 2: w = "Tue"; break;
		case 3: w = "Wed"; break;
		case 4: w = "Thu"; break;
		case 5: w = "Fri"; break;
		case 6: w = "Sat"; break;
	}

	var t;
	var hours = date.getHours();//Returns the hour (0-23) in the specified date according to local time
	var minutes = date.getMinutes();//Returns the minutes (0-59) in the specified date according to local time
	if (culture.clock() == 12) { // 12 hour time, like "12:01a", "9:30a" or "2:55p"

		if      (hours == 0)  t = "#:#a".fill(hours + 12, widen(minutes, 2)); // 0 hours is 12a
		else if (hours < 12)  t = "#:#a".fill(hours,      widen(minutes, 2)); // 1 hours is 1a
		else if (hours == 12) t = "#:#p".fill(hours,      widen(minutes, 2)); // 12 hours is 12p
		else                  t = "#:#p".fill(hours - 12, widen(minutes, 2)); // 13 hours is 1p, 23 hours is 11p

	} else { // 24 hour time, like "00:01", "09:30" or "14:55"

		t = "#:#".fill(widen(hours, 2), widen(minutes, 2));
	}

	var s = widen(date.getSeconds(), 2);//Returns the seconds (0-59) in the specified date according to local time

	var ms = widen(date.getMilliseconds(), 3);//Returns the milliseconds (0-999) in the specified date according to local time

	return { y:y, m:m, d:d, w:w, t:t, s:s, ms:ms };
}

function sayDate(t) {
	var a = _sayCalendar(t);
	return "# # # # #".fill(a.y, a.m, a.d, a.w, a.t);
}

function sayDateAndTime(t) {
	var a = _sayCalendar(t);
	return "# # # # # ####".fill(a.y, a.m, a.d, a.w, a.t, a.s, culture.decimal(), a.ms, culture.clock() == 12 ? "s" : "");
}

function sayDayAndTime(t) {
	var a = _sayCalendar(t);
	return "# # ####".fill(a.w, a.t, a.s, culture.decimal(), a.ms, culture.clock() == 12 ? "s" : "");
}

exports.sayDate = sayDate;
exports.sayDateAndTime = sayDateAndTime;
exports.sayDayAndTime = sayDayAndTime;





//2013 Jun 20 Thu 10:50p
//            Thu 10:50p 59.123s

//always show in the user's local time



























//first today, unify make and say





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




















