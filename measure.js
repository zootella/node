
require("./load").load("measure", function() { return this; });























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














//   _                
//  | |    ___   __ _ 
//  | |   / _ \ / _` |
//  | |__| (_) | (_| |
//  |_____\___/ \__, |
//              |___/ 

// Log the given list of anything on the console, prefixed with the day and time
function log() {
	var t = sayDateTemplate(now().time, "ddHH12:MMaSS.TTT") + "  ";
	for (var i = 0; i < arguments.length; i++)
		t += say(arguments[i]);
	console.log(t);
}

exports.log = log;






















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
	a.ceiling   = Math.ceil(n / d);  // Round up
	a.round     = Math.round(n / d); // Round to nearest
	a.remainder = n % d;             // Remainder
	a.decimal   = n / d;             // Floating point number

	check(a.whole, 0); // Check our answer before returning it
	check(a.remainder, 0);
	if ((d * a.whole) + a.remainder !== n)                     Mistake.log({ name:"divide remainder", n:n, d:d, a:a });
	if (a.whole + ((a.remainder === 0) ? 0 : 1) !== a.ceiling) Mistake.log({ name:"divide ceiling",   n:n, d:d, a:a });
	return Object.freeze(a);
}

// Calculate (n * m) / d
function scale(n, m, d) { return divide(multiply(n, m), d); }

// Make sure i is a whole number with a minimum value of min or larger
function check(i, min) {

	function _check(n) {
		checkType(n, "number");                      // Make sure n is a number
		if (isNaN(n))              toss("bounds");   // Not the weird not a number thing
		if (!isFinite(n))          toss("overflow"); // Not too big for floating point
		if (n > 9007199254740992)  toss("overflow"); // Not too big for int
		if (n + 1 === n)           toss("overflow"); // Not too big for addition to work
		if (Math.floor(n) !== n)   toss("type");     // A whole number
	}

	_check(i);
	_check(min);
	if (i < min) toss("bounds"); // With the minimum value or larger
}

// Return 0 instead of throwing an exception if d is 0
// Who says you can't divide by zero? OH SHI-
function divideByZero(n, d) {
	if (d === 0) return 0; // If d is negative or not a number, still throw an exception
	return divide(n, d);
}
function scaleByZero(n, m, d) { return divideByZero(multiply(n, m), d); }

exports.multiply = multiply;
exports.divide = divide;
exports.scale = scale;
exports.check = check;
exports.divideByZero = divideByZero;
exports.scaleByZero = scaleByZero;


//things to change with check
//name it checkNumber, and use it elsewhere in the code
//have min be optional, if !min min = 0, change check(n, 0) to just check(n)























//   _____ _                
//  |_   _(_)_ __ ___   ___ 
//    | | | | '_ ` _ \ / _ \
//    | | | | | | | | |  __/
//    |_| |_|_| |_| |_|\___|
//                          

// Make a When object to record the date and time right now
function now() { return When(Date.now()); } // Save the number of milliseconds between January 1970 and right now

// The time when something happened
function When(t) {
	check(t, 0); // Allow a time in the future, but not before 1970

	var _time = t;                                          // Save the given time
	function expired(t) { check(t, 0); return t <= age(); } // True if t or more milliseconds have passed since this when
	function age() { return Date.now() - _time; }           // The number of milliseconds that have passed since this when
	function text() { return sayDateAndTime(_time); }       // Convert into text like "2002 Jun 22 Sat 11:09a 49.146s"

	return Object.freeze({                  // Freeze the public interface your object is returning to include immutable properties
		time:_time, expired:expired, age:age, // For instance, setting now.time doesn't change it
		text:text,                            // Without this, you would have to access it with the function now.time()
		type:function(){ return "When"; }
	});
}

// Return the time that happened first, and is oldest
function earlier(w1, w2) {
	checkType(w1, "When");
	checkType(w2, "When");
	return w1.time < w2.time ? w1 : w2;
}
// Return the time that happened last, and is youngest
function recent(w1, w2) {
	checkType(w1, "When");
	checkType(w2, "When");
	return w1.time > w2.time ? w1 : w2;
}

// Make a Duration that will record the given start time to the given stop time, or just start to right now
function Duration(setStart, setStop) {

	if (!setStop) setStop = now();
	checkType(setStart, "When");
	checkType(setStop, "When");
	if (setStop.time < setStart.time) toss("bounds"); // Make sure stop is at or after start

	var _start = setStart; // The time when this Duration started
	var _stop = setStop;   // The time when this Duration stopped, the same as start or afterwards

	// The length of this Duration in milliseconds, 0 or more
	function time() {
		return _stop.time - _start.time;
	}
	// The length of this Duration in milliseconds, 1 or more
	function timeSafe() {
		var t = time();
		if (t < 1) t = 1; // A 0 might end up on the bottom of a speed fraction
		return t;
	}

	// When this duration ended and how long it took, like "Wed 1:39p 58.023s in 278ms"
	function text() { return say(_stop, " in ", time(), "ms"); }

	return Object.freeze({
		start:_start, stop:_stop,
		time:time, timeSafe:timeSafe, text:text,
		type:function(){ return "Duration"; }
	});
}

// Make an Ago to ask it permission to do something you want to only do once every i milliseconds
function Ago(i) {

	check(i, 0);
	var _interval = i;  // Time interval between events

	var _set = 0;       // The number of milliseconds between January 1970 and when we were last set, 0 if we've never been set

	function enough() { // True if enough time has passed since the last event
		var n = Date.now();         // Get the time now
		if (_set + _interval < n) { // It's past the interval
			_set = n;                 // Record that a new event will happen now
			return true;              // Give permission to do the event
		} else {
			return false;
		}
	}

	return {
		enough:enough,
		type:function(){ return "Ago"; }
	};
}

exports.now = now;
exports.When = When;
exports.earlier = earlier;
exports.recent = recent;
exports.Duration = Duration;
exports.Ago = Ago;





















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
	if (!d) return ""; // Show the user blank on divide by 0 instead of throwing
	return commas(scale(_tens(decimal), n, d).whole, decimal);
}

// Describe a/b like "81.211% 912/1,123"
// Specify decimal to include that many decimal places in the percentage
function sayPercent(n, d, decimal) {
	if (!d) return "";
	return say(commas(scale(100 * _tens(decimal), n, d).whole, decimal), "% ", commas(n), "/", commas(d));
}

// Describe a/b like "6% 1122mb/18gb"
// Specify decimal like 1 and units like "kb" to make it like "50.0% 1,024.0kb/2,048.0kb"
function sayProgress(n, d, decimal, units) {
	if (!d) return "";
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

// Describe the given size like "98kb (101,289 bytes)" with the exact number of bytes in parenthesis
function saySizeBytes(n, decimal, units) {
	return say(saySize(n, decimal, units), " (", items(n, "byte"), ")");
}

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
	toss("overflow"); // We ran out of units, not really possible because Size.max is 8191tb
}

exports.Size = Size;
exports.saySizeBytes = saySizeBytes;
exports.saySize = saySize;






//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

// Describe the speed of the given number of bytes transferred in the given number of milliseconds
// Optionally specify a number of decimal places and a unit
function saySpeedDivide(bytes, milliseconds, decimal, units) {
	if (!milliseconds) return ""; // Show the user blank instead of throwing on divide by 0
	return saySpeed(scale(bytes, Time.second, milliseconds).round); // Calculate bytes per second
}

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

exports.saySpeedDivide = saySpeedDivide;
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

Time.second = 1000;           // 1000, number of milliseconds in a second
Time.minute = 60*Time.second; // 60000, number of milliseconds in a minute
Time.hour   = 60*Time.minute; // 3600000, number of milliseconds in an hour
Time.day    = 24*Time.hour;   // 86400000, number of milliseconds in a day
Time.month  = 2629800000;     // 1/12 of 365.25 days in milliseconds
Time.year   = 31557600000;    // 365.25 days in milliseconds

Time.quick = 100;          // 1/10 second, a quick amount of time for the user, half the delay
Time.delay = 200;          // 1/5 second, pulse 5 times a second
Time.out   = 4*Time.second // 4 seconds, a longer amount of time for the user

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

/*
Date template codes

--------------------------------------  Year, in 4 and 2 digits
YYYY YY
2002 02

--------------------------------------  Month number, and month name on the calendar
OO O  CCCC Cccc cccc CCC Ccc ccc CC cc
05 5  JUNE June june JUN Jun jun J  j

--------------------------------------  Number of day in month, leading zero or shortest possible
NN N
09 9
10 10

--------------------------------------  Day name in the week
DDDD   Dddd   dddd   DDD Ddd ddd DD dd
FRIDAY Friday friday FRI Fri fri F  f 

--------------------------------------  Hour on 24 and 12 hour clocks, and AM/PM text
HH24 H24 HH12 H12  AA aa A a
13   13  01   1    PM pm P p

--------------------------------------  Minute, second, and millisecond
MM M  : SS S : TTT TT T
15 15 : 08 8 : 078 78 78
*/

// Turn the given number of milliseconds since 1970 into text like "2002 Jun 22 Sat 11:09a" with the year, month, day, and time
function sayDate(t) {
	if (culture.clock() == 12) return sayDateTemplate(t, "YYYY Ccc N Ddd H12:MMa");
	else                       return sayDateTemplate(t, "YYYY Ccc N Ddd HH24:MM");
}

// Turn the given number of milliseconds since 1970 into text like "2002 Jun 22 Sat 11:09a 49.146s" with everything
function sayDateAndTime(t) {
	if (culture.clock() == 12) return sayDateTemplate(t, "YYYY Ccc N Ddd H12:MMa SS#TTTs".fill(culture.decimal()));
	else                       return sayDateTemplate(t, "YYYY Ccc N Ddd HH24:MM SS#TTT".fill(culture.decimal()));
}

// Turn the given number of milliseconds since 1970 into text like "Sat 11:09a 49.146s" with the day and time to milliseconds
function sayDayAndTime(t) {
	if (culture.clock() == 12) return sayDateTemplate(t, "Ddd H12:MMa SS#TTTs".fill(culture.decimal()));
	else                       return sayDateTemplate(t, "Ddd HH24:MM SS#TTT".fill(culture.decimal()));
}

// Given a number of milliseconds since 1970 and a template string like "YYYY Ccc N Ddd H12:MMa", compose text like "2002 Jun 22 Sat 11:09a"
function sayDateTemplate(t, s) {

	var d = dateParts(t);

	// Replace tags with numbers
	s = s.swap("YYYY", d.YYYY); // Year
	s = s.swap("YY", d.YY);

	s = s.swap("OO", d.OO); // Month number
	s = s.swap("O", d.O);

	s = s.swap("NN", d.NN); // Number of day in month
	s = s.swap("N", d.N);

	s = s.swap("MM", d.MM); // Minute, second, and millisecond
	s = s.swap("M", d.M);
	s = s.swap("SS", d.SS);
	s = s.swap("S", d.S);
	s = s.swap("TTT", d.TTT);
	s = s.swap("TT", d.TT);
	s = s.swap("T", d.T);

	s = s.swap("HH24", d.HH24); // 24 hour clock
	s = s.swap("H24", d.H24);

	s = s.swap("HH12", d.HH12); // 12 hour clock
	s = s.swap("H12", d.H12);

	// Replace tags with text after that, careful to not generate remaining tags
	s = s.swap("AA", d.AA); // AM and PM
	s = s.swap("aa", d.aa);
	s = s.swap("A", d.A);
	s = s.swap("a", d.a);

	s = s.swap("DDDD", d.DDDD); // Name of day in week
	s = s.swap("Dddd", d.Dddd);
	s = s.swap("dddd", d.dddd);
	s = s.swap("DDD", d.DDD);
	s = s.swap("Ddd", d.Ddd);
	s = s.swap("ddd", d.ddd);
	s = s.swap("DD", d.DD); // Double character to avoid matching text that already got copied in
	s = s.swap("dd", d.dd);

	s = s.swap("CCCC", d.CCCC); // Month name
	s = s.swap("Cccc", d.Cccc);
	s = s.swap("cccc", d.cccc);
	s = s.swap("CCC", d.CCC);
	s = s.swap("Ccc", d.Ccc);
	s = s.swap("ccc", d.ccc);
	s = s.swap("CC", d.CC);
	s = s.swap("cc", d.cc);

	return s;
}

// Given a number of milliseconds since 1970, compose parts of the date and time like year, month, day, and hour
function dateParts(t) {

	var date = new Date(t); // Parse it with a JavaScript Date object
	var d = {}; // Empty object for us to fill and return

	// Numbers
	d.year        = date.getFullYear();     // Year
	d.month       = date.getMonth() + 1;    // Month, 0-11
	d.dayOfMonth  = date.getDate();         // Number of day in the month, 1-31
	d.dayOfWeek   = date.getDay()   + 1;    // Day of the week, 0-6
	d.hour        = date.getHours();        // Hour 0-23
	d.minute      = date.getMinutes();      // Minute 0-59
	d.second      = date.getSeconds();      // Second 0-59
	d.millisecond = date.getMilliseconds(); // Millisecond 0-999

	// Text
	d.YYYY = say(d.year); // Year
	d.YY = d.YYYY.end(2);

	d.O = say(d.month); // Month number
	d.OO = widen(d.O, 2);
	switch (d.month) { // Month name
		case  1: d.cc = "j"; d.CC = "J"; d.ccc = "jan"; d.Ccc = "Jan"; d.CCC = "JAN"; d.cccc = "january";   d.Cccc = "January";   d.CCCC = "JANUARY";   break;
		case  2: d.cc = "f"; d.CC = "F"; d.ccc = "feb"; d.Ccc = "Feb"; d.CCC = "FEB"; d.cccc = "february";  d.Cccc = "February";  d.CCCC = "FEBRUARY";  break;
		case  3: d.cc = "m"; d.CC = "M"; d.ccc = "mar"; d.Ccc = "Mar"; d.CCC = "MAR"; d.cccc = "march";     d.Cccc = "March";     d.CCCC = "MARCH";     break;
		case  4: d.cc = "a"; d.CC = "A"; d.ccc = "apr"; d.Ccc = "Apr"; d.CCC = "APR"; d.cccc = "april";     d.Cccc = "April";     d.CCCC = "APRIL";     break;
		case  5: d.cc = "y"; d.CC = "Y"; d.ccc = "may"; d.Ccc = "May"; d.CCC = "MAY"; d.cccc = "may";       d.Cccc = "May";       d.CCCC = "MAY";       break;
		case  6: d.cc = "j"; d.CC = "J"; d.ccc = "jun"; d.Ccc = "Jun"; d.CCC = "JUN"; d.cccc = "june";      d.Cccc = "June";      d.CCCC = "JUNE";      break;
		case  7: d.cc = "u"; d.CC = "U"; d.ccc = "jul"; d.Ccc = "Jul"; d.CCC = "JUL"; d.cccc = "july";      d.Cccc = "July";      d.CCCC = "JULY";      break;
		case  8: d.cc = "a"; d.CC = "A"; d.ccc = "aug"; d.Ccc = "Aug"; d.CCC = "AUG"; d.cccc = "august";    d.Cccc = "August";    d.CCCC = "AUGUST";    break;
		case  9: d.cc = "s"; d.CC = "S"; d.ccc = "sep"; d.Ccc = "Sep"; d.CCC = "SEP"; d.cccc = "september"; d.Cccc = "September"; d.CCCC = "SEPTEMBER"; break;
		case 10: d.cc = "o"; d.CC = "O"; d.ccc = "oct"; d.Ccc = "Oct"; d.CCC = "OCT"; d.cccc = "october";   d.Cccc = "October";   d.CCCC = "OCTOBER";   break;
		case 11: d.cc = "n"; d.CC = "N"; d.ccc = "nov"; d.Ccc = "Nov"; d.CCC = "NOV"; d.cccc = "november";  d.Cccc = "November";  d.CCCC = "NOVEMBER";  break;
		case 12: d.cc = "d"; d.CC = "D"; d.ccc = "dec"; d.Ccc = "Dec"; d.CCC = "DEC"; d.cccc = "december";  d.Cccc = "December";  d.CCCC = "DECEMBER";  break;
	}

	d.N = say(d.dayOfMonth); // Number of day in the month
	d.NN = widen(d.dayOfMonth, 2);

	switch (d.dayOfWeek) { // Day of the week
		case 1: d.dd = "s"; d.DD = "S"; d.ddd = "sun"; d.Ddd = "Sun"; d.DDD = "SUN"; d.dddd = "sunday";    d.Dddd = "Sunday";    d.DDDD = "SUNDAY";    break;
		case 2: d.dd = "m"; d.DD = "M"; d.ddd = "mon"; d.Ddd = "Mon"; d.DDD = "MON"; d.dddd = "monday";    d.Dddd = "Monday";    d.DDDD = "MONDAY";    break;
		case 3: d.dd = "t"; d.DD = "T"; d.ddd = "tue"; d.Ddd = "Tue"; d.DDD = "TUE"; d.dddd = "tuesday";   d.Dddd = "Tuesday";   d.DDDD = "TUESDAY";   break;
		case 4: d.dd = "w"; d.DD = "W"; d.ddd = "wed"; d.Ddd = "Wed"; d.DDD = "WED"; d.dddd = "wednesday"; d.Dddd = "Wednesday"; d.DDDD = "WEDNESDAY"; break;
		case 5: d.dd = "h"; d.DD = "H"; d.ddd = "thu"; d.Ddd = "Thu"; d.DDD = "THU"; d.dddd = "thursday";  d.Dddd = "Thursday";  d.DDDD = "THURSDAY";  break;
		case 6: d.dd = "f"; d.DD = "F"; d.ddd = "fri"; d.Ddd = "Fri"; d.DDD = "FRI"; d.dddd = "friday";    d.Dddd = "Friday";    d.DDDD = "FRIDAY";    break;
		case 7: d.dd = "u"; d.DD = "U"; d.ddd = "sat"; d.Ddd = "Sat"; d.DDD = "SAT"; d.dddd = "saturday";  d.Dddd = "Saturday";  d.DDDD = "SATURDAY";  break;
	}

	d.H24 = say(d.hour); // 24 hour time, for text like "00:01", "09:30" or "14:55"
	d.HH24 = widen(d.hour, 2);

	// 12 hour time, for text like "12:01a", "9:30a" or "2:55p"
	if      (d.hour ==  0) { d.H12 = say(d.hour + 12); d.HH12 = widen(d.hour + 12, 2); d.a = "a"; d.A = "A"; d.aa = "am"; d.AA = "AM";} // 0 hours is 12a
	else if (d.hour <  12) { d.H12 = say(d.hour);      d.HH12 = widen(d.hour,      2); d.a = "a"; d.A = "A"; d.aa = "am"; d.AA = "AM";} // 1 hours is 1a
	else if (d.hour == 12) { d.H12 = say(d.hour);      d.HH12 = widen(d.hour,      2); d.a = "p"; d.A = "P"; d.aa = "pm"; d.AA = "PM";} // 12 hours is 12p
	else                   { d.H12 = say(d.hour - 12); d.HH12 = widen(d.hour - 12, 2); d.a = "p"; d.A = "P"; d.aa = "pm"; d.AA = "PM";} // 13 hours is 1p, 23 hours is 11p

	d.M = say(d.minute); // Minute
	d.MM = widen(d.minute, 2);
	d.S = say(d.second); // Second
	d.SS = widen(d.second, 2);
	d.T = say(d.millisecond); // Millisecond, tick count
	d.TT = widen(d.millisecond, 2);
	d.TTT = widen(d.millisecond, 3);

	return d;
}

exports.sayDate = sayDate;
exports.sayDateAndTime = sayDateAndTime;
exports.sayDayAndTime = sayDayAndTime;
exports.sayDateTemplate = sayDateTemplate;
exports.dateParts = dateParts;





























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



function sortStripe(){}







//change this so just the last one is smaller
//it's simpler, doesn't need bignum, and would be better for live
//and sha1 works just fine on small data

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
	if (chunkIndex > chunks) toss("bounds");
	return scale(bytes, chunkIndex, chunks).whole; // Without using bignum, a 12gb file will overflow
}
// What chunk index the given piece index is in a file of size bytes
function indexPieceToChunk(bytes, pieceIndex) {
	check(bytes, 1);
	check(pieceIndex, 0);
	var chunks = numberOfChunks(bytes);
	var pieces = numberOfPieces(bytes);
	if (pieceIndex > pieces) toss("bounds");
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
		toss("todo"); //TODO return Describe.decimal(averageThousandths(), 3);
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

// Make a Speed object, tell it distances traveled or counts when they happen, and get the current speed
// Given a window of 3*Time.second, the object will keep between 2 and 4 seconds of data to calculate the current speed
function Speed(window) {
	check(window, 100); // The smallest allowed window is 1/10 of a second

	var _created = now();                   // When this Speed object was created, and the start of column 0
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

exports.Average = Average;
exports.Speed = Speed;








































//make your own log that takes any number of anythings, calls say on each one, and also logs to a file later if you want

//have return freeze({})
//and is there anywhere you wouldn't want to use that, actually?
//that prevents you from messing up an object, but does it prevent you from making a mutable object?









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













