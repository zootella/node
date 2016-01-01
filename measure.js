
require("./load").load("measure", function() { return this; });

var platformUtility = require("util");
var platformBigNumber = require('bignumber.js');























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
	if (!platformCharm) { // Before code calls stick(), we're just using console.log
		stamp.apply(this, arguments); // Pass stamp the same arguments we were given
	} else {      // We're using charm, and may have text to stick on the end of the console
		stickErase();
		stamp.apply(this, arguments);
		stickDraw();
	}

	function stamp() { // Log the given arguments on a single line of text after the day and time
		var t = sayDateTemplate(now().time, "ddHH12:MMaSS.TTT") + "  ";
		for (var i = 0; i < arguments.length; i++) t += say(arguments[i]);
		console.log(t);
	}
}

//   ____  _   _      _    
//  / ___|| |_(_) ___| | __
//  \___ \| __| |/ __| |/ /
//   ___) | |_| | (__|   < 
//  |____/ \__|_|\___|_|\_\
//                         

var platformCharm; // Undefined until something calls stick(), at which point we start using charm
var lines = [];    // Array of lines of text to keep stuck to the end of the terminal

// Stick the given lines of text to the end of the console
// Each line can be an argument, like stick("line1", "line2"), or a single string with newlines
function stick() {
	if (!platformCharm) { // Load the charm module to start using it, if we haven't already
		platformCharm = require("charm")(); // Charm wants us to execute the returned function and save that result
		platformCharm.pipe(process.stdout);
		// Charm documentation reccommends platformCharm.on("^C", process.exit); but demos are closing naturally without it
	}

	var a = []; // Separate lines of text and put them in a
	a.add(""); // Start stick text with a blank line to keep it visually separate from log lines above
	if (!arguments.length) a.add(""); // Make stick() the same as stick("")

	for (var i = 0; i < arguments.length; i++) {
		var s = say(arguments[i]); // Turn each argument into text
		a = a.concat(s.swap("\r\n", "\n").swap("\r", "\n").rip("\n")); // Separate multiple lines in a single string
	}

	var l = []; // Wrap long lines and put them in l
	for (var i = 0; i < a.length; i++) {
		var s = a[i];
		var indent = ""; // No indent before the line wraps
		var wrap = process.stdout.columns - 2; // Make 2 narrower to keep a newline from wrapping onto the next line
		if (s.length) { // This line has text
			while (s.length) {
				var before, after;
				if (s.length <= wrap) { before = s;             after = "";             }
				else                  { before = s.start(wrap); after = s.beyond(wrap); }
				l.add(indent + before);
				s = after;
				if (!indent.length) { // Wrapped lines get a hanging indent
					indent = "  ";
					wrap -= indent.length;
				}
			}
		} else { // We're on a blank line
			l.add(s); // Add the blank line to the finished array
		}
	}

	if (!arraySame(lines, l)) {          // Only update the text on the screen if it's actually changed
		if (lines.length != l.length) {    // Different number of lines, redraw the whole thing
			stickErase();
			lines = l;
			stickDraw();
		} else {                           // Same number of lines, redraw only the lines that have changed
			platformCharm.cursor(false);     // Hide the cursor, otherwise you can see it moving to each line
			platformCharm.up(lines.length);
			for (var i = 0; i < lines.length; i++) {
				if (lines[i] != l[i]) {        // Line different
					platformCharm.erase("line");
					console.log(l[i]);           // Write the line and move down to the next one
					lines[i] = l[i];             // Remember what we have on the screen
				} else {                       // Line same
					platformCharm.down(1);       // Move down without blinking the line
				}
			}
			platformCharm.cursor(true);      // Show the cursor again
		}
	}
}

function stickErase() {
	if (lines.length > 0) {
		platformCharm.up(lines.length);
		platformCharm.erase("down");
	}
}

function stickDraw() {
	for (var i = 0; i < lines.length; i++) console.log(lines[i]); // Stick lines at the end of the console
}

//   _  __          _                         _ 
//  | |/ /___ _   _| |__   ___   __ _ _ __ __| |
//  | ' // _ \ | | | '_ \ / _ \ / _` | '__/ _` |
//  | . \  __/ |_| | |_) | (_) | (_| | | | (_| |
//  |_|\_\___|\__, |_.__/ \___/ \__,_|_|  \__,_|
//            |___/                             

var platformKeypress; // The keypress module, once we load it
var keyMap = {};      // keyMap["n"] is the array of functions we'll call when the user presses the n key

// Call f when the user presses the key for a character like "n", "8", "*", "tab", or "escape"
// "any" to get all the events, "exit" to get escape and control+c
function keyboard(character, f) {
	if (!platformKeypress) {                    // Load the keypress module to start using it, if we haven't already
		platformKeypress = require("keypress");
		platformKeypress(process.stdin);          // Have standard in emit "keypress" events
		process.stdin.setRawMode(true);           // Change other standard in settings for using the keypress module
		process.stdin.resume();
		process.stdin.on("keypress", keyPressed); // Call keyPressed() below on "keypress" events
	}

	if (!keyMap[character]) keyMap[character] = []; // Make an array for the first function
	keyMap[character].add(f);
}

// The user pessed a key on the keyboard
function keyPressed(character, key) {
	soon(); // Pulse soon on user input
	if (!key) key = {}; // On some keys, like numbers, keypress only gives us character
	key.character = character; // Group the two parameters together

	callAll(keyMap["any"], key); // Call the functions that want to know about any key
	callAll(keyMap[key.character], key); // Just one key
	if (key.name && key.name != key.character) callAll(keyMap[key.name], key); // The key by a different name
	if (key.name == "escape" || (key.name == "c" && key.ctrl)) callAll(keyMap["exit"], key); // Call the exit functions on escape and control+c

	function callAll(a, p) { if (a) for (var i = 0; i < a.length; i++) a[i](p); } // Call all the functions in array a, giving each one parameter p
}

// Stop listening for keyboard keys
function closeKeyboard() {
	keyMap = {};
	process.stdin.pause(); // Tell standard in to stop sending us keypress events, allowing the process to close
}

var inspect = platformUtility.inspect; // Rename instead of wrapping

exports.log = log;
exports.stick = stick;
exports.keyboard = keyboard;
exports.closeKeyboard = closeKeyboard;
exports.inspect = inspect;



















//   __  __       _   _     
//  |  \/  | __ _| |_| |__  
//  | |\/| |/ _` | __| '_ \ 
//  | |  | | (_| | |_| | | |
//  |_|  |_|\__,_|\__|_| |_|
//                          

// Make sure n is a whole integer with a minimum value of
var min0 = checkNumber;                                                                // 0 or larger, same as checkNumber
function min1(n)        { checkNumber(n);                 if (n < 1) toss("bounds"); } // 1 or larger
function checkMin(n, m) { checkNumber(n); checkNumber(m); if (n < m) toss("bounds"); } // m or larger

// Given a number, make sure it's a 0+ integer
function checkNumber(n) {
	checkNumberMath(n);  // Use math tools
	var s = n+"";        // Convert into numerals
	checkNumerals(s);    // Make sure just numerals
	checkNumeralsFit(s); // Make sure small enough for the number type to keep as an integer
}

// Use number and math checks to make sure n is a 0+ integer
function checkNumberMath(n) {
	if (typeof n != "number")        toss("type",     {watch:{n:n}, note:"type"});     // Make sure n is a number
	if (isNaN(n))                    toss("bounds",   {watch:{n:n}, note:"nan"});      // Not the weird not a number thing
	if (!isFinite(n))                toss("overflow", {watch:{n:n}, note:"infinity"}); // Not too big for floating point
	if (n > Number.MAX_SAFE_INTEGER) toss("overflow", {watch:{n:n}, note:"max"});      // Not too big to keep as an integer
	if (n + 1 === n)                 toss("overflow", {watch:{n:n}, note:"plus"});     // Not too big for addition to work
	if (Math.floor(n) !== n)         toss("type",     {watch:{n:n}, note:"floor"});    // A whole number
	if (n < 0)                       toss("bounds",   {watch:{n:n}, note:"negative"}); // Not negative
}

// Given a string, make sure it's the numerals of a 0+ integer
function checkNumerals(s) {
	if (typeof s != "string") toss("type");
	if (s.length == 0) {
		toss("data");                        // Length 0, "" not valid
	} else if (s.length == 1) {
		var a = s.charCodeAt(0);
		if (a < 48 || a > 57) toss("data");  // Length 1, "0" through "9" valid
	} else {
		var a = s.charCodeAt(0);
		if (a < 49 || a > 57) toss("data");  // Length 2+, first numeral must be "1" through "9"
		for (var i = 1; i < s.length; i++) { // Remaining numerals must be "0" through "9"
			var a = s.charCodeAt(i);
			if (a < 48 || a > 57) toss("data");
		}
	}
}

// Given a valid string of 0+ numerals, make sure the integer value is small enough for the number type to keep as an integer
function checkNumeralsFit(s) { if (!numeralsFit(s)) toss("overflow"); }
function numeralsFit(s) { return compareCheckedNumerals(s, Number.MAX_SAFE_INTEGER+"") <= 0; } // Factoring the +"" outside doesn't speed this up

// Parse 0+ text like "789" into the number 789, throw rather than returning a number too big to keep as an integer
function numeralsToNumber(s) {
	checkNumerals(s);
	checkNumeralsFit(s);
	var n = parseInt(s, 10); // Must specify a radix like base 10
	checkSame(s, n+""); // Guard against parseInt's dangerously accommodating parsing style by ensuring that the number we made becomes the same text we made it from
	checkNumberMath(n);
	return n;
}

// Make sure a and b are the same value and type
function checkSame(a, b) { if (a !== b) toss("data"); }

// Determine which number should appear first in sorted order, 0 if same, negative if n1 then n2, positive if n2 first
function compareNumber(n1, n2)   { checkNumber(n1);   checkNumber(n2);   return compareCheckedNumber(n1, n2);   }
function compareNumerals(s1, s2) { checkNumerals(s1); checkNumerals(s2); return compareCheckedNumerals(s1, s2); }
function compareCheckedNumber(n1, n2)   { return n1 - n2; } // Faster if you are sure the numbers are already valid
function compareCheckedNumerals(s1, s2) { return (s1.length == s2.length) ? s1.localeCompare(s2) : s1.length - s2.length; }

exports.min0 = min0;
exports.min1 = min1;
exports.checkMin = checkMin;

exports.checkNumber = checkNumber;
exports.checkNumberMath = checkNumberMath;
exports.checkNumerals = checkNumerals;

exports.checkNumeralsFit = checkNumeralsFit;
exports.numeralsFit = numeralsFit;

exports.numeralsToNumber = numeralsToNumber;
exports.checkSame = checkSame;

exports.compareNumber = compareNumber;
exports.compareNumerals = compareNumerals;
exports.compareCheckedNumber = compareCheckedNumber;
exports.compareCheckedNumerals = compareCheckedNumerals;

// A 0+ integer of unlimited size
function Int(p) { // Takes a number like 5, a string of numerals like "789", a bignumber.js BigNumber, or another Int
	if (isType(p, "Int")) return p; // Return the given Int instead of making a new one, the value inside an Int can't change
	var o = {};
	o.v = _3type(p); // Parse the given parameter, keeping together v.s() numerals, and v.n() number and v.b() BigNumber once we have them or they are necessary
	o.inside = o.v.inside; // Point to function, see which types v has built up with text like "bns" or "--s" for testing

	o.multiply             = function(q) { return  _mul(o.v, q); } // p * q   p.multiply(q)              p._("*", q)
	o.divide               = function(q) { return  _div(o.v, q); } // p / q   p.divide(q)                p._("/", q)
	o.modulo               = function(q) { return  _mod(o.v, q); } // p % q   p.modulo(q)                p._("%", q)

	o.add                  = function(q) { return  _add(o.v, q); } // p + q   p.add(q)                   p._("+", q)
	o.subtract             = function(q) { return  _sub(o.v, q); } // p - q   p.subtract(q)              p._("-", q)
	o.increment            = function()  { return  _add(o.v, 1); } // p++     p.increment()              p._("++")
	o.decrement            = function()  { return  _sub(o.v, 1); } // p--     p.decrement()              p._("--")

	o.equals               = function(q) { return  _equ(o.v, q); } // p == q  p.equals(q)                p._("==", q)
	o.nonequal             = function(q) { return !_equ(o.v, q); } // p != q  p.nonequal(q)              p._("!=", q)
	o.not                  = function()  { return  _equ(o.v, 0); } // !p      p.not()                    p._("!")
	o.is                   = function()  { return !_equ(o.v, 0); } // p       p.is()                     p._("")       To boolean, commonly used

	o.greaterThan          = function(q) { return  _gth(o.v, q); } // p > q   p.greaterThan(q)           p._(">", q)
	o.greaterThanOrEqualTo = function(q) { return  _gte(o.v, q); } // p >= q  p.greaterThanOrEqualTo(q)  p._(">=", q)
	o.lessThan             = function(q) { return  _lth(o.v, q); } // p < q   p.lessThan(q)              p._("<", q)
	o.lessThanOrEqualTo    = function(q) { return  _lte(o.v, q); } // p <= q  p.lessThanOrEqualTo(q)     p._("<=", q)

	o._ = function(c, q) { return _calculate(o, c, q); } // Who says JavaScript can't do operator overloading?
	o.text = o.v.s();
	o.hasNumber = function() { return o.v.fit; } // True if our value is small enough to fit in a number as an integer, not a floating point number
	o.toNumber = o.v.n; // Point to function, throws if too big
	o.type = "Int";
	return freeze(o);
}
function _3type(p) { // Parse the parameter given to Int or a method on Int, keeping the same integer value in up to 3 different types
	var type = getType(p);
	if (type == "Int") return p.v; // We got an Int, return the value inside instead of making a new one

	// Hold the same integer value 1, 2 or 3 different ways, keeping the type we were given, only converting when necessary, and checking everything we can with the types we have
	var b = "none"; // Our integer value in a BigNumber object, or "none" before we have one
	var n = "none"; // Our integer value in a number type variable, or "none" before we have one, or if our value won't fit
	var s = "none"; // Our integer value as a string of numerals, we always have this type

	if (hasMethod(p, "dividedToIntegerBy")) { b = p;                     s = b.toFixed(0); checkNumerals(s);                      } // Given a BigNumber, make and check numerals
	else if (type == "number")              { n = p; checkNumberMath(n); s = n+"";         checkNumerals(s); checkNumeralsFit(s); } // Given a number, check it, make numerals, and check them
	else if (type == "string")              {                            s = p;            checkNumerals(s);                      } // Given numerals, check them
	else { toss("type"); } // Int(p).method(p) only accepts p as an Int, BigNumber, number, or string

	var o = {}; // Return, or make, check, keep, and return, our value in a BigNumber, number, or string ♫ There's three ways of saying, the very same thing
	o.b = function() { if (b !== "none") return b; b = new platformBigNumber(s); checkSame(s, b.toFixed(0)); return b; } // Make from numerals rather than number to avoid 15 digit limit
	o.n = function() { if (n !== "none") return n; n = numeralsToNumber(s);                                  return n; }
	o.s = function() {                   return s;                                                                     }

	o.fit = numeralsFit(s); // Small enough to fit
	o.bs = function() { return b !== "none" ? b : s; } // Our value in a BigNumber if we have one, numerals otherwise
	o.inside = function() { return "###".fill(b === "none" ? "-" : "b", n === "none" ? "-" : "n", s === "none" ? "-" : "s"); } // Show which types we've built up
	return o;
}
//                                                                    Small values            use number for speed             Potentially large values use BigNumber instead
function _mul(v, q) { var w = _3type(q);                       return _bothFitProduct(v, w) ? Int(v.n() * w.n())             : Int(v.b().times(             w.bs())); }
function _div(v, q) { var w = _3type(q); _checkDivide(v, w);   return _bothFit(v, w)        ? Int(Math.floor(v.n() / w.n())) : Int(v.b().dividedToIntegerBy(w.bs())); }
function _mod(v, q) { var w = _3type(q); _checkDivide(v, w);   return _bothFit(v, w)        ? Int(v.n() % w.n())             : Int(v.b().mod(               w.bs())); }
function _add(v, q) { var w = _3type(q);                       return _bothFitProduct(v, w) ? Int(v.n() + w.n())             : Int(v.b().plus(              w.bs())); }
function _sub(v, q) { var w = _3type(q); _checkSubtract(v, w); return _bothFit(v, w)        ? Int(v.n() - w.n())             : Int(v.b().minus(             w.bs())); }

function _equ(v, q) { var w = _3type(q);                       return _bothFit(v, w)        ? v.n() == w.n()                 : v.b().equals(                w.bs());  }
function _gth(v, q) { var w = _3type(q);                       return _bothFit(v, w)        ? v.n() >  w.n()                 : v.b().greaterThan(           w.bs());  }
function _gte(v, q) { var w = _3type(q);                       return _bothFit(v, w)        ? v.n() >= w.n()                 : v.b().greaterThanOrEqualTo(  w.bs());  }
function _lth(v, q) { var w = _3type(q);                       return _bothFit(v, w)        ? v.n() <  w.n()                 : v.b().lessThan(              w.bs());  }
function _lte(v, q) { var w = _3type(q);                       return _bothFit(v, w)        ? v.n() <= w.n()                 : v.b().lessThanOrEqualTo(     w.bs());  }

function _checkDivide(v, w)    { if (w.s() == "0") toss("math"); }                               // Who says you can't divide by zero? OH SHI-
function _checkSubtract(v, w)  { if (compareCheckedNumerals(v.s(), w.s()) < 0) toss("bounds"); } // Make sure v - w will be 0+, as negative values aren't allowed
function _bothFit(v, w)        { return v.fit && w.fit; }                                        // True if both values will fit in numbers, so we can use minus, divide, and modulo
function _bothFitProduct(v, w) {                                                                 // True if adding or multipling the given two numbers can't produce an answer that's too big
	return _bothFit(v, w) && v.s().length + w.s().length < (Number.MAX_SAFE_INTEGER+"").length;    // Even if v and w are all 9s, a*b will still be a digit shorter than max safe integer
}
function _calculate(o, c, q) {
	if      (c === "*")  { return o.multiply(q);             }
	else if (c === "/")  { return o.divide(q);               }
	else if (c === "%")  { return o.modulo(q);               }

	else if (c === "+")  { return o.add(q);                  }
	else if (c === "-")  { return o.subtract(q);             }
	else if (c === "++") { return o.increment();             }
	else if (c === "--") { return o.decrement();             }

	else if (c === "==") { return o.equals(q);               }
	else if (c === "!=") { return o.nonequal(q);             }
	else if (c === "!")  { return o.not();                   }
	else if (c === "")   { return o.is();                    }

	else if (c === ">")  { return o.greaterThan(q);          }
	else if (c === ">=") { return o.greaterThanOrEqualTo(q); }
	else if (c === "<")  { return o.lessThan(q);             }
	else if (c === "<=") { return o.lessThanOrEqualTo(q);    }
	else { toss("code"); }
}

// A fraction of integer values, like 1/1 or 10/3
// For the numerator and denominator, pass in numbers, strings of numerals, or arrays of those to multiply together, like Fraction([2, 5], 3) to get 10/3
function Fraction(n, d) {
	var o = {};
	o.numerator   = _multiplyArray(n); // My numerator's up, up, up ♫
	o.denominator = _multiplyArray(d); // My denominator's down, down, down
	if (o.denominator.equals(0)) return null; // Return null instead of throwing an exception

	o.remainder = o.numerator.modulo(o.denominator);
	o.whole     = o.numerator.divide(o.denominator);
	var r2 = o.remainder.multiply(2); // Double the remainder to see if it's less than half the denominator
	if      (r2.equals(0))               { o.round = o.whole;        o.ceiling = o.whole;        } // Flat, all whole
	else if (r2.lessThan(o.denominator)) { o.round = o.whole;        o.ceiling = o.whole.add(1); } // Remainder less than half, round down
	else                                 { o.round = o.whole.add(1); o.ceiling = o.round;        } // Remainder half or more, round up

	o.scale = function(v, w) { return Fraction(o.numerator.multiply(_multiplyArray(v)), o.denominator.multiply(_multiplyArray(w))); }
	o.text = function() { sayUnitPerUnit(o); }
	o.type = "Fraction";
	return freeze(o);
}
function _multiplyArray(a) { // Turn 10, "10", or [2, "5"] into Int(10)
	var i;
	if (Array.isArray(a)) {
		for (var j = 0; j < a.length; j++) i = !j ? Int(a[j]) : i.multiply(a[j]);
	} else {
		i = Int(a);
	}
	if (!i) toss("type"); // Throw on undefinied and empty array
	return i;
}

exports.Int = Int;
exports.Fraction = Fraction;
exports._multiplyArray = _multiplyArray;

function divideFast(n, d) { return Math.floor(n / d);               } // Shorter than using Math.floor directly, and easily see where you use it
function divideSafe(n, d) { return Fraction(n, d).whole.toNumber(); } // Likely fast enough, or just use Fraction directly

exports.divideFast = divideFast;
exports.divideSafe = divideSafe;

























//TODO change this to When, you've already got time below

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
	min1(t); // Allow a time in the future from now, but not before 1970, and not 0 which is more likely a mistake than exactly 1970

	var o = {};
	o.time     = t;                                               // Save the given time
	o.age      = function()  { return Date.now() - t; }           // The number of milliseconds that have passed since this when
	o.expired  = function(t) { min0(t); return t <= o.age(); }    // True if t or more milliseconds have passed since this when
	o.text     = function()  { return sayDateAndTime(t); }        // Describe like "2002 Jun 22 Sat 11:09a 49.146s"
	o.duration = function(finish) { return Duration(o, finish); } // Make a Duration using this When as the start time
	o.type = "When";
	return freeze(o);
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

// Make a Duration that will record when something started and finished, at the same time or later
function Duration(start, finish) {
	if (!finish) finish = now(); // Leave finish blank to make a Duration that's over right now
	checkType(start,  "When");
	checkType(finish, "When");
	if (finish.time < start.time) toss("bounds"); // Make sure finish is at or after start

	var o = {};
	o.start  = start;  // The start time
	o.finish = finish; // The finish time, the same as start or afterwards
	o.time   = finish.time - start.time; // How long the duration took in milliseconds
	o.text = function() { return say(finish, " after ", sayTime(o.time)); }
	o.type = "Duration";
	return freeze(o);
}

// Make an Ago to ask it permission to do something you want to only do once every i milliseconds
function Ago(i) {

	min0(i);
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
		type:"Ago"
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
		type:"Culture"
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

// Format numerals with thousands and decimal separator, like "1,234.567"
// Optionally specify the number of decimal digits, like 3
function commas(s, decimal) {
	s = say(s);

	var t = ""; // Target text to build and return
	var u = ""; // Temporary string

	if (decimal) {                            // There are decimal digits
		s = s.widenStart(decimal + 1, "0");     // Prepend enough leading zeros to compose "0.001"
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

exports.commas = commas;
exports.items = items;












//   ____  _         
//  / ___|(_)_______ 
//  \___ \| |_  / _ \
//   ___) | |/ /  __/
//  |____/|_/___\___|
//                   

// Size constants
var Size = {};
Size.b  = 1;                           // One byte
Size.kb = 1024*Size.b;                 // Number of bytes in a kibibyte, a kilobyte would be 1000 instead of 1024
Size.mb = 1024*Size.kb;                // Number of bytes in a mebibyte
Size.gb = 1024*Size.mb;                // Number of bytes in a gibibyte
Size.tb = 1024*Size.gb;                // Number of bytes in a tebibyte
Size.pb = 1024*Size.tb;                // Number of bytes in a pebibyte
Size.eb = "1152921504606846976";       // Number of bytes in a exbibyte, too large for number to hold as an integer
Size.zb = "1180591620717411303424";    // Number of bytes in a zebibyte
Size.yb = "1208925819614629174706176"; // Number of bytes in a yobibyte

Size.value = 20; // A SHA1 hash value is 20 bytes

Size.medium =  8*Size.kb; // 8 KB in bytes, the capacity of a normal Bin, our buffer size for TCP sockets
Size.big    = 64*Size.kb; // 64 KB in bytes, the capacity of a big Bin, our buffer size for UDP packets

freeze(Size);

// Describe the given number of bytes with text like "7gb 1023mb 0kb 19b" showing scale and exactness
function saySize(n, decimal) {
	n = _remove(n, decimal);

	function take(unit, name) {
		var d = Fraction(n, unit);                // See how many unit amounts are in n
		if (d.whole.greaterThan(0) || s.length) { // If 1 or more, or if we previously took a bigger unit
			s += say(d.whole, name, " ");           // Add it to the string like "5mb "
			n = d.remainder;                        // Subtract it from the total
		}
	}

	var s = "";
	take(Size.pb, "pb"); // Remove large units from n
	take(Size.tb, "tb");
	take(Size.gb, "gb");
	take(Size.mb, "mb");
	take(Size.kb, "kb");
	s += say(n, "b"); // What's left is 0-1023
	return s;
}

// Describe the given number of bytes with text like "9876mb" using 4 numerals or less
function saySize4(n, decimal) {
	n = _remove(n, decimal);

	var d = 1; // Starting unit of 1 byte
	var u = 0;
	var unit = ["b", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
	while (u < unit.length) { // Loop until we're out of units

		var w = Fraction(n, d).whole; // Find out how many of the current unit we have
		if (w.lessThanOrEqualTo(9999)) return say(w, unit[u]); // Four digits or less, use this unit

		d *= 1024; // Move to the next larger unit
		u++;
	}
	toss("overflow"); // We ran out of units
}

// Describe the given number of bytes with text like "9,419.006mb", picking the unit and optionally specifying decimal places
function saySizeB(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.b).whole,    decimal), "b");  } 
function saySizeK(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.kb).ceiling, decimal), "kb"); } // Round up so 1 byte is 1kb, not 0kb
function saySizeM(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.mb).ceiling, decimal), "mb"); } // 1 byte is also 1mb
function saySizeG(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.gb).whole,   decimal), "gb"); } // For gigabyte and larger, round down
function saySizeT(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.tb).whole,   decimal), "tb"); }
function saySizeP(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.pb).whole,   decimal), "pb"); }
function saySizeE(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.eb).whole,   decimal), "eb"); }
function saySizeZ(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.zb).whole,   decimal), "zb"); }
function saySizeY(n, decimal) { return say(commas(Fraction([_tens(decimal), n], Size.yb).whole,   decimal), "yb"); }

exports.Size = Size;
exports.saySize = saySize;
exports.saySize4 = saySize4;
exports.saySizeB = saySizeB;
exports.saySizeK = saySizeK;
exports.saySizeM = saySizeM;
exports.saySizeG = saySizeG;
exports.saySizeT = saySizeT;
exports.saySizeP = saySizeP;
exports.saySizeE = saySizeE;
exports.saySizeZ = saySizeZ;
exports.saySizeY = saySizeY;


















//   _____               _   _             
//  |  ___| __ __ _  ___| |_(_) ___  _ __  
//  | |_ | '__/ _` |/ __| __| |/ _ \| '_ \ 
//  |  _|| | | (_| | (__| |_| | (_) | | | |
//  |_|  |_|  \__,_|\___|\__|_|\___/|_| |_|
//                                         

// Compose text that describes a division of f.numerator per f.denominator numbers, milliseconds, or bytes
// Customize pattern string s with #, #%, #/s, #.###, #.###%, #.###/s, and #/#
// Remainder option r whole, round, or ceiling, they all round down to whole by default

function sayUnitPerUnit(f, s, r) { return sayFraction(f, s, r, commas,  commas,  commas);  } // Average test score
function saySizePerSize(f, s, r) { return sayFraction(f, s, r, commas,  saySize, saySize); } // Pieces in a file, compression performance
function sayTimePerTime(f, s, r) { return sayFraction(f, s, r, commas,  sayTime, sayTime); } // Timer progress

function sayUnitPerSize(f, s, r) { return sayFraction(f, s, r, commas,  commas,  saySize); } // Requests or reads per mb in a file
function sayUnitPerTime(f, s, r) { return sayFraction(f, s, r, commas,  commas,  sayTime); } // Events per second

function saySizePerUnit(f, s, r) { return sayFraction(f, s, r, saySize, saySize, commas);  } // Average packet size
function saySizePerTime(f, s, r) { return sayFraction(f, s, r, saySize, saySize, sayTime); } // Data transfer speed

function sayTimePerUnit(f, s, r) { return sayFraction(f, s, r, sayTime, sayTime, commas);  } // How long it took to get a file on average
function sayTimePerSize(f, s, r) { return sayFraction(f, s, r, sayTime, sayTime, saySize); } // Number of seconds it takes to send a mb

// Functions sayF, sayN, and sayD to say fraction, numerator, and denominator based on what units they're in
// Functions must accept decimal as the second argument like sayF(300, 2) meaning the value got multiplied by 10 twice
function sayFraction(f, s, r, sayF, sayN, sayD) {
	if (!f) return ""; // Show the user blank on divide by 0

	if (!s) s = "#"; // Fill unspecified preferences with defaults
	if (!r) r = "whole";
	if (!sayF) sayF = commas;
	if (!sayN) sayN = commas;
	if (!sayD) sayD = commas;

	while (s.has("#/#")) f1();
	function f1() {
		s = s.swap("#/#", "#/#".fill(sayN(f.numerator), sayD(f.denominator))); // Turn #/# into 1/2
	}

	while (s.has("#")) f2();
	function f2() {
		var c = s.cut("#");
		var decimal = 0;
		if (c.after.starts(".#")) { // #.# or #.###
			while (c.after.get(decimal + 1) == "#") decimal++; // Count the number of decimal places, like # decimal 0, #.### decimal 3
			c = { before:c.before, after:c.after.beyond(1 + decimal) };
		}
		var t;
		if      (c.after.starts("%"))  { t = sayF(f.scale([        100, _tens(decimal)], 1)[r], decimal); } // #%  or #.###%
		else if (c.after.starts("/s")) { t = sayF(f.scale([Time.second, _tens(decimal)], 1)[r], decimal); } // #/s or #.###/s
		else                           { t = sayF(f.scale([             _tens(decimal)], 1)[r], decimal); } // #   or #.###
		s = say(c.before, t, c.after);
	}
	return s;
}

function _tens(decimal) { // Given a number of decimal places, return the necessary multiplier, _tens(0) is 1, _tens(1) is 10, 2 is 100, 3 is 1000, and so on
	if (!decimal) decimal = 0; // By default, no decimal places, and a multiplier of 1
	min0(decimal);
	var m = Int(1);
	for (var i = 0; i < decimal; i++) m = m.multiply(10);
	return m;
}
function _remove(i, decimal) { // Code above used scale to multiply i with 10, 100, 1000, or so on, restore the original number
	i = Int(i);
	if (decimal) {
		min0(decimal);
		while (decimal) {
			i = i.divide(10);
			decimal--;
		}
	}
	return i;
}

exports.sayUnitPerUnit = sayUnitPerUnit;
exports.saySizePerSize = saySizePerSize;
exports.sayTimePerTime = sayTimePerTime;
exports.sayUnitPerSize = sayUnitPerSize;
exports.sayUnitPerTime = sayUnitPerTime;
exports.saySizePerUnit = saySizePerUnit;
exports.saySizePerTime = saySizePerTime;
exports.sayTimePerUnit = sayTimePerUnit;
exports.sayTimePerSize = sayTimePerSize;
exports.sayFraction = sayFraction;

//   ____                      _ 
//  / ___| _ __   ___  ___  __| |
//  \___ \| '_ \ / _ \/ _ \/ _` |
//   ___) | |_) |  __/  __/ (_| |
//  |____/| .__/ \___|\___|\__,_|
//        |_|                    

// Describe the given f number of bytes transferred in a second in kilobytes per second like "2.24kb/s"
function saySpeedKbps(f) {
	if (!f) return "";
	var i = f.scale([100, Time.second], Size.kb).whole; // Compute the number of hundreadth kilobytes per second
	if      (i.lessThan(    1)) return "0.00kb/s";                                           //           "0.00kb/s"
	else if (i.lessThan(   10)) return say("0.0", i, "kb/s");                                // 1 digit   "0.09kb/s"
	else if (i.lessThan(  100)) return say("0.", i, "kb/s");                                 // 2 digits  "0.99kb/s"
	else if (i.lessThan( 1000)) return say(say(i).start(1), ".", say(i).clip(1, 2), "kb/s"); // 3 digits  "9.99kb/s"
	else if (i.lessThan(10000)) return say(say(i).start(2), ".", say(i).clip(2, 1), "kb/s"); // 4 digits  "99.9kb/s", omit hundreadths
	else                        return say(commas(say(i).chop(2)), "kb/s");                  // 5 or more "999kb/s" or "1,234kb/s"
}

// Say how long it takes to transfer a megabyte, like "42s/mb"
// Given f in bytes per millisecond, bytes per second must be 1 through Size.mb, returns blank otherwise
// Good for making a slow speed make sense
function saySpeedTimePerMegabyte(f) {
	var bytesPerSecond = f.scale(Time.second, 1).whole;
	if (bytesPerSecond.lessThan(1) || bytesPerSecond.greaterThan(Size.mb)) return ""; // 0 would be forever, larger than 1mb would be 0s/mb
	return sayTimeRemaining(Fraction([Time.second, Size.mb], bytesPerSecond).whole) + "/mb";
}

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

freeze(Time);

// Describe the given number of milliseconds with text like "13h 29m 0.991s"
function sayTime(t, decimal) {
	t = _remove(t, decimal);

	function take(unit, name) {
		var d = Fraction(t, unit);                // See how many unit amounts are in t
		if (d.whole.greaterThan(0) || s.length) { // If 1 or more, or if we previously took a bigger unit
			s += say(commas(d.whole), name, " ");   // Add it to the string like "5h "
			t = d.remainder;                        // Subtract it from the total
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
// Good for telling the user how long the program predicts something will take
function sayTimeRemaining(t)       { return _sayTimeRemaining(t, false); }
function sayTimeRemainingCoarse(t) { return _sayTimeRemaining(t, true);  } // Round down to the nearest 5 seconds so a countdown isn't distracting
function _sayTimeRemaining(t, coarse) {
	t = Int(t);

	// Compute the number of whole seconds, minutes, hours, and days in the given number of milliseconds
	var s = Fraction(t, Time.second).whole;
	var m = Fraction(t, Time.minute).whole;
	var h = Fraction(t, Time.hour).whole;
	var d = Fraction(t, Time.day).whole;

	// If coarse and above 5, round down to the nearest multiple of 5
	if (coarse && s.greaterThan(5)) s = s.subtract(s.modulo(5));
	
	// Compose and return a String that describes that amount of time
	if      (s.lessThan(    60)) return say(s, "s");                                   // "0s" to "59s"
	else if (s.lessThan(   600)) return say(m, "m ", s.subtract(m.multiply(60)), "s"); // "1m 0s" to "9m 59s"
	else if (s.lessThan(  3600)) return say(m, "m");                                   // "10m" to "59m"
	else if (s.lessThan( 36000)) return say(h, "h ", m.subtract(h.multiply(60)), "m"); // "1h 0m" to "9h 59m"
	else if (s.lessThan(259200)) return say(h, "h");                                   // "10h" to "71h"
	else                         return say(commas(d), "d");                           // "3d" and up
}

// Describe the given number of milliseconds with text like 5'15"223
// Sports a global race style that's accurate to milliseconds
// Godo for telling the user exactly how long something took
function sayTimeRace(t) {
	t = Int(t);

	var m = Fraction(t, Time.minute).whole;
	var s = Fraction(t.subtract(m.multiply(Time.minute)), Time.second).whole;
	var ms = t.subtract(m.multiply(Time.minute)).subtract(s.multiply(Time.second));

	return "#'#\"#".fill(commas(m), say(s).widenStart(2, "0"), say(ms).widenStart(3, "0"));
}

exports.Time = Time;
exports.sayTime = sayTime;
exports.sayTimeRemaining = sayTimeRemaining;
exports.sayTimeRemainingCoarse = sayTimeRemainingCoarse;
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
	d.OO = d.O.widenStart(2, "0");
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
	d.NN = say(d.dayOfMonth).widenStart(2, "0");

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
	d.HH24 = say(d.hour).widenStart(2, "0");

	// 12 hour time, for text like "12:01a", "9:30a" or "2:55p"
	if      (d.hour ==  0) { d.H12 = say(d.hour + 12); d.HH12 = say(d.hour + 12).widenStart(2, "0"); d.a = "a"; d.A = "A"; d.aa = "am"; d.AA = "AM";} // 0 hours is 12a
	else if (d.hour <  12) { d.H12 = say(d.hour);      d.HH12 = say(d.hour     ).widenStart(2, "0"); d.a = "a"; d.A = "A"; d.aa = "am"; d.AA = "AM";} // 1 hours is 1a
	else if (d.hour == 12) { d.H12 = say(d.hour);      d.HH12 = say(d.hour     ).widenStart(2, "0"); d.a = "p"; d.A = "P"; d.aa = "pm"; d.AA = "PM";} // 12 hours is 12p
	else                   { d.H12 = say(d.hour - 12); d.HH12 = say(d.hour - 12).widenStart(2, "0"); d.a = "p"; d.A = "P"; d.aa = "pm"; d.AA = "PM";} // 13 hours is 1p, 23 hours is 11p

	d.M = say(d.minute); // Minute
	d.MM = say(d.minute).widenStart(2, "0");
	d.S = say(d.second); // Second
	d.SS = say(d.second).widenStart(2, "0");
	d.T = say(d.millisecond); // Millisecond, tick count
	d.TT = say(d.millisecond).widenStart(2, "0");
	d.TTT = say(d.millisecond).widenStart(3, "0");

	return d;
}

exports.sayDate = sayDate;
exports.sayDateAndTime = sayDateAndTime;
exports.sayDayAndTime = sayDayAndTime;
exports.sayDateTemplate = sayDateTemplate;
exports.dateParts = dateParts;

//TODO split into * which is UTC, and *Local which is like they are now, just use Date.UTC() and Date()



















function Stripe(i, w) {
	min0(i);
	min1(w);
	var o = {};

	o.i = i;     // The distance from the origin to the start of this Stripe, 0 or more
	o.w = w;     // The size of this Stripe, its width, 1 or more
	o.z = i + w; // The extent of this Stripe, the index of the far edge

	o.same = function(s) {
		checkType(s, "Stripe");
		return i == s.i && w == s.w;
	}

	o.text = function() { return "i#w#".fill(i, w); }
	o.type = "Stripe";
	return freeze(o);
}

function Range(i, w) {
	min0(i);
	if (w !== -1) min0(w); //TODO use a string or something instead of a negative number
	var o = {};

	o.i = i; // The distance from the origin to the start of this Range, 0 or more
	o.w = w; // The size of this Range, its width, -1 no limit, 0 done, 1+ size

	o.same = function(s) {
		checkType(s, "Range");
		return i == s.i && w == s.w;
	}

	o.text = function() { return "i#w#".fill(i, w); }
	o.type = "Range";
	return freeze(o);
}

function sortStripe(){}
function sortRange(){}

exports.Stripe = Stripe;
exports.Range = Range;

//TODO lots more to bring over from chan, tests, and use in stripe pattern



























//TODO change this to be trivial, 16k, 1m, a single byte extra is fine



//if a piece is 1mb or smaller and a chunk is 16kb or smaller, you should probably make the medium bin 16kb instead of 8kb so it can hold a whole chunk
//also, you have a feeling that this matches something in node, like the size of a buffer that gets put in c space rather than v8 space

//what parts you have is probably best expressed as a stripe pattern of chunks, not bytes, and not a spray pattern
//a 2gb file has just 2048 pieces and 131072 chunks, so these numbers are very reasonable to work with and will be very small to send in outline across the wire





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
	min1(bytes);
	return Fraction(bytes, 16*Size.kb).ceiling.toNumber(); // A chunk is 16kb or smaller
}
// How many pieces there are in a file of size bytes
function numberOfPieces(bytes) {
	min1(bytes);
	var chunks = numberOfChunks(bytes);
	return Fraction(chunks, 64).ceiling.toNumber(); // A piece is 64 chunks or fewer, making it 1mb or smaller
}

// Where the given chunk index is in a file of size bytes
function indexChunkToByte(bytes, chunkIndex) {
	min1(bytes);
	min0(chunkIndex);
	var chunks = numberOfChunks(bytes);
	if (chunkIndex > chunks) toss("bounds");
	return Fraction([bytes, chunkIndex], chunks).whole.toNumber(); // Without using bignum, a 12gb file will overflow
}
// What chunk index the given piece index is in a file of size bytes
function indexPieceToChunk(bytes, pieceIndex) {
	min1(bytes);
	min0(pieceIndex);
	var chunks = numberOfChunks(bytes);
	var pieces = numberOfPieces(bytes);
	if (pieceIndex > pieces) toss("bounds");
	return Fraction([chunks, pieceIndex], pieces).whole.toNumber();
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





//make a single object, Meter
//which doesn't do anything but enclose and feed every other object you have that is good at monitoring a bunch of numbers over time
//biggest, smallest, average
//sample
//median, histogram
//speeds, a variety of different windows
//histogram of those speeds so you can understand how big the window should be







