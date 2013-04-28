

var log = console.log;

var data = require("./data");



//String
//Cut
//Find
//Format
//Describe
//Number
//Encode



/* Warning: This file contains some long lines (Like this one!). So maximize the window or just turn word wrap on, and quit complaining. Screens were 80 characters wide a long, long time ago, and nobody cares anymore. Seriously. */



//how to polyfill
/*
if(!('contains' in String.prototype))
  String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };
*/
//don't polyfill, exactly, rather if something is already defined, throw "platform"


/*
 * These are a few of my favorite strings.
 */



//   ____  _        _             
//  / ___|| |_ _ __(_)_ __   __ _ 
//  \___ \| __| '__| | '_ \ / _` |
//   ___) | |_| |  | | | | | (_| |
//  |____/ \__|_|  |_|_| |_|\__, |
//                          |___/ 

// Concatenate all the given strings together
// For instance, make("a", "b", "c") is "abc"
// Instead of make(), you can also just use "a" + "b" + "c"
function make() {
	var s = "";
	for (var i = 0; i < arguments.length; i++)
		s += arguments[i]; // Using + is actually must faster than s.concat() or [].join()
	return s;
}

// True if s is a string with some text
// Instead of is(), you can also just use s == ""
function is(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return false;
	return true;
}

// True if s is a string that's blank
// Instead of blank, you can also just use s != ""
function blank(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return true;
	return false;
}

exports.make = make;
exports.is = is;
exports.blank = blank;

// Get the first character in s
function first(s) { return get(s, 0); }
// Get the character a distance i in characters into the string s
function get(s, i) {
	if (!i) i = 0; // Turn undefined into 0 so math below works
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charAt(i);
}

function start(s, n)  { return clip(s, 0, n); }            // Clip out the first n characters of s, start(3) is CCCccccccc	
function end(s, n)    { return clip(s, s.length - n, n); } // Clip out the last n characters of s, end(3) is cccccccCCC	
function beyond(s, i) { return clip(s, i, s.length - i); } // Clip out the characters beyond index i in s, beyond(3) is cccCCCCCCC	
function chop(s, n)   { return clip(s, 0, s.length - n); } // Chop the last n characters off the end of s, returning the start before them, chop(3) is CCCCCCCccc	
function clip(s, i, n) {                                   // Clip out part of s, clip(5, 3) is cccccCCCcc
	if (!i) i = 0; // Turn undefined into 0 so math below works
	if (!n) n = 0;
	if (i < 0 || n < 0 || i + n > s.length) throw "bounds"; // Make sure the requested index and number of characters fits inside s
	return s.slice(i, i + n); // Using slice instead of substr or substring
}

exports.first = first;
exports.get = get;

exports.start = start;
exports.end = end;
exports.beyond = beyond;
exports.chop = chop;
exports.clip = clip;

String.prototype.first  = function()     { return first(this);        }
String.prototype.get    = function(i)    { return get(this,    i);    }

String.prototype.start  = function(n)    { return start(this,  n);    }
String.prototype.end    = function(n)    { return end(this,    n);    }
String.prototype.beyond = function(i)    { return beyond(this, i);    }
String.prototype.chop   = function(n)    { return chop(this,   n);    }
String.prototype.clip   = function(i, n) { return clip(this,   i, n); }

// Compare two strings, case sensitive, or just use s1 == s2 instead
function same(s1, s2) {
	var p = _samePlatform(s1, s2);
	var c = _sameCustom(s1, s2);
	if (p != c) Mistake.log({ name:"same", s1:s1, s2:s2, p:p, c:c }); //TODO do the way that's faster instead of this check
	return c; // Return custom
}
function _samePlatform(s1, s2) { return s1 == s2; }
function _sameCustom(s1, s2) {
	if (s1.length != s2.length) return false;       // Make sure s1 and s2 are the same length
	else if (s1.length == 0) return true;           // Blanks are the same
	return _find(s1, s2, true, false, false) != -1; // Search at the start only
}

// Compare two strings, matching cases
function match(s1, s2) {
	var p = _matchPlatform(s1, s2);
	var c = _matchCustom(s1, s2);
	if (p != c) Mistake.log({ name:"match", s1:s1, s2:s2, p:p, c:c }); //TODO do the way that's faster instead of this check
	return c; // Return custom
}
function _matchPlatform(s1, s2) { return s1.toLocaleLowerCase() == s2.toLocaleLowerCase(); }
function _matchCustom(s1, s2) {
	if (s1.length != s2.length) return false;      // Make sure s1 and s2 are the same length
	else if (s1.length == 0) return true;          // Blanks are the same
	return _find(s1, s2, true, false, true) != -1; // Search at the start only
}

function starts(s, tag)      { return _find(s, tag, true,  false, false) != -1; } // True if s starts with tag, case sensitive
function startsMatch(s, tag) { return _find(s, tag, true,  false, true)  != -1; } // True if s starts with tag, matches cases
function ends(s, tag)        { return _find(s, tag, false, false, false) != -1; } // True if s ends with tag, case sensitive
function endsMatch(s, tag)   { return _find(s, tag, false, false, true)  != -1; } // True if s ends with tag, matches cases
function has(s, tag)         { return _find(s, tag, true,  true,  false) != -1; } // True if s contains tag, case sensitive
function hasMatch(s, tag)    { return _find(s, tag, true,  true,  true)  != -1; } // True if s contains tag, matches cases

function find(s, tag)      { return _find(s, tag, true,  true, false); } // Find the character index in s where tag appears, case sensitive, -1 not found
function findMatch(s, tag) { return _find(s, tag, true,  true, true);  } // Find the character index in s where tag appears, matches cases, -1 not found
function last(s, tag)      { return _find(s, tag, false, true, false); } // Find the character index in s where tag last appears, case sensitive, -1 not found
function lastMatch(s, tag) { return _find(s, tag, false, true, true);  } // Find the character index in s where tag last appears, matches cases, -1 not found

// Find where in s tag appears, the character index, or -1 not found
// forward: true to search forwards from the start, false to search backwards from the end
// scan:    true to scan across all the positions possible in s, false to only look at the starting position
// match:   true to match upper and lower case characters, false to treat upper and lower case characters as different
function _find(s, tag, forward, scan, match) {
	var p = _findPlatform(s, tag, forward, scan, match);
	var c = _findCustom(s, tag, forward, scan, match);
	if (scan && p != c) Mistake.log({ name:"_find", s:s, tag:tag, forward:forward, scan:scan, match:match, p:p, c:c }); //TODO do the way that's faster instead of this check
	return c; // Return custom
}
function _findPlatform(s, tag, forward, scan, match) { // Using JavaScript
	if (!tag.length) throw "argument";
	if (match) { s = s.toLocaleLowerCase(); tag = tag.toLocaleLowerCase(); } // Lowercase everything to match cases
	return forward ? s.indexOf(tag) : s.lastIndexOf(tag); // Find the first or last index of the tag
}
function _findCustom(s, tag, forward, scan, match) { // Using our own code

	// Get and check the lengths
	if (!tag.length) throw "argument"; // The tag cannot be blank
	if (s.length < tag.length) return -1; // If s is blank, return -1

	// Our search will scan s from the start index through the end index
	var start = forward ? 0                     : s.length - tag.length;
	var end   = forward ? s.length - tag.length : 0;
	var step  = forward ? 1                     : -1;

	if (!scan) end = start; // If we're not allowed to scan across the text, set end to only look one place
	for (var si = start; si != end + step; si += step) { // Scan si from the start through the end in the specified direction

		for (var ti = 0; ti < tag.length; ti++) { // Look for the tag at si

			var sc = s.charAt(si + ti); // Get the characters to compare
			var tc = tag.charAt(ti);

			if (match) { // The caller requested matching cases
				sc = sc.toLocaleLowerCase(); // Change both characters to lower case so they match
				tc = tc.toLocaleLowerCase();
			}
			if (sc !== tc) break; // Mismatch found, break to move to the next spot in s
		}
		if (ti === tag.length) return si; // We found the tag at si, return it
	}
	return -1; // Not found
}

exports.same = same;
exports._samePlatform = _samePlatform;
exports._sameCustom = _sameCustom;
exports.match = match;
exports._matchPlatform = _matchPlatform;
exports._matchCustom = _matchCustom;

exports.starts = starts;
exports.startsMatch = startsMatch;
exports.ends = ends;
exports.endsMatch = endsMatch;
exports.has = has;
exports.hasMatch = hasMatch;

exports.find = find;
exports.findMatch = findMatch;
exports.last = last;
exports.lastMatch = lastMatch;

exports._find = _find;
exports._findPlatform = _findPlatform;
exports._findCustom = _findCustom;

function before(s, tag)          { return _cut(s, tag, true,  false).before; } // The part of s before tag, s if not found, case sensitive
function beforeMatch(s, tag)     { return _cut(s, tag, true,  true ).before; } // The part of s before tag, s if not found, matches cases
function beforeLast(s, tag)      { return _cut(s, tag, false, false).before; } // The part of s before the last place tag appears, s if not found, case sensitive
function beforeLastMatch(s, tag) { return _cut(s, tag, false, true ).before; } // The part of s before the last place tag appears, s if not found, matches cases

function after(s, tag)          { return _cut(s, tag, true,  false).after; } // The part of s after tag, "" if not found, case sensitive
function afterMatch(s, tag)     { return _cut(s, tag, true,  true ).after; } // The part of s after tag, "" if not found, matches cases
function afterLast(s, tag)      { return _cut(s, tag, false, false).after; } // The part of s after the last place tag appears, "" if not found, case sensitive
function afterLastMatch(s, tag) { return _cut(s, tag, false, true ).after; } // The part of s after the last place tag appears, "" if not found, matches cases

function cut(s, tag)          { return _cut(s, tag, true,  false); } // Cut s around tag to get what's before and after, case sensitive
function cutMatch(s, tag)     { return _cut(s, tag, true,  true ); } // Cut s around tag to get what's before and after, matches cases
function cutLast(s, tag)      { return _cut(s, tag, false, false); } // Cut s around the last place tag appears to get what's before and after, case sensitive
function cutLastMatch(s, tag) { return _cut(s, tag, false, true ); } // Cut s around the last place tag appears to get what's before and after, matches cases

// Cut s around tag, finding the parts before and after it
// forward: true to find the first place the tag appears, false to search backwards from the end
// match:   true to match upper and lower case characters, false to be case-sensitive
function _cut(s, tag, forward, match) {
	var i = _find(s, tag, forward, true, match); // Search s for tag
	if (i == -1) {
		return {
			found:  false, // Not found, make before s and after blank
			before: s,
			tag:    "", // No tag because it's not a part of s
			after:  ""
		};
	} else {
		return {
			found:  true, // We found the tag at i, clip out the text before and after it
			before: start(s, i),
			tag:    clip(s, i, tag.length), // Include tag to have all parts of s
			after:  beyond(s, i + tag.length)
		};
	}
}

exports.before = before;
exports.beforeMatch = beforeMatch;
exports.beforeLast = beforeLast;
exports.beforeLastMatch = beforeLastMatch;

exports.after = after;
exports.afterMatch = afterMatch;
exports.afterLast = afterLast;
exports.afterLastMatch = afterLastMatch;

exports.cut = cut;
exports.cutMatch = cutMatch;
exports.cutLast = cutLast;
exports.cutLastMatch = cutLastMatch;

exports._cut = _cut;

//stuff beyond this point isn't in order yet





// In a single pass through s, replace whole instances of t1 with t2, like swap("a-b-c", "-", "_") is "a_b_c"
function swap(s, t1, t2)      { return _swap(s, t1, t2, false); } // Case sensitive
function swapMatch(s, t1, t2) { return _swap(s, t1, t2, true);  } // Matches cases
function _swap(s, t1, t2, match) {
	var s2 = "";                        // Target string to fill with text as we break off parts and make the replacement
	while (is(s)) {                     // Loop until s is blank, also makes sure it's a string
		var c = _cut(s, t1, true, match); // Cut s around the first instance of the tag in it
		s2 += c.before;                   // Move the part before from s to done
		if (c.found) s2 += t2;
		s = c.after;
	}
	return s2;
	// Why not use JavaScript's s.replace() instead? Well, it can't match cases without regular expressions, /i might not do as good a job as toLocaleLowerCase(), and wrapping input that might be data from a user as a regular expression is a bad idea.
}

exports.swap = swap;
exports.swapMatch = swapMatch;






// Convert lower case characters in s to upper case
function upper(s) {
	var u = s.toLocaleUpperCase(); // Use instead of toUpperCase() to work for locales without the default Unicode case mappings
	if (s.length != u.length) Mistake.log({ name:"upper", s:s, u:u }); // Make sure the case change didn't change the length
	return u;
}

// Convert upper case characters in s to lower case
function lower(s) {
	var l = s.toLocaleLowerCase();
	if (s.length != l.length) Mistake.log({ name:"lower", s:s, l:l });
	return l;
}

exports.upper = upper;
exports.lower = lower;

String.prototype.upper = function() { return upper(this); }
String.prototype.lower = function() { return lower(this); }






// The Unicode number value of the character a distance i characters into s
// Also gets ASCII codes, code("A") is 65
// You can omit i to get the code of the first character
function code(s, i) {
	if (!i) i = 0; // Turn undefined into 0 so the math below works
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charCodeAt(i);
}

// True if s has a code in the range of c1 through c2
// For instance, range("m", "a", "z") == true
// Takes three strings to look at the first character of each
function range(s, c1, c2) { return (code(s) >= code(c1)) && (code(s) <= code(c2)); }
function isLetter(s) { return range(s, "a", "z") || range(s, "A", "Z"); } // True if the first character in s is a letter "a" through "z" or "A" through "Z"
function isNumber(s) { return range(s, "0", "9"); } // True if the first character in s is a digit "0" through "9"

exports.code = code;
exports.range = range;
exports.isLetter = isLetter;
exports.isNumber = isNumber;

String.prototype.code = function() { return code(this); }
String.prototype.range = function(c1, c2) { return range(this, c1, c2); }









// Find where tag1 or tag2 first appears in s, -1 if neither found
function either(s, tag1, tag2) { return _either(s, tag1, tag2, false); } // Case sensitive
function eitherMatch(s, tag1, tag2) { return _either(s, tag1, tag2, true); } // Matches cases
function _either(s, tag1, tag2, match) {
	var i1 = _find(s, tag1, true, true, match); // Search for both
	var i2 = _find(s, tag2, true, true, match);
	if (i1 == -1 && i2 == -1) return -1; // Both not found
	else if (i1 == -1) return i2; // One found, but not the other
	else if (i2 == -1) return i1;
	else return Math.min(i1, i2); // Both found, return the one that appears first
}

exports.either = either;
exports.eitherMatch = eitherMatch;
exports._either = _either;








// Confirm s starts or ends with tag, inserting it if necessary
function onStart(s, tag)      { return _on(s, tag, true); }
function onEnd(s, tag)        { return _on(s, tag, false); }
function _on(s, tag, forward) {
	if (forward) { if (!starts(s, tag)) s = tag + s; } // Find and insert at start
	else         { if (!ends(s, tag))   s = s + tag; } // Find and insert at end
	return s;
}

// Confirm s does not start or end with tag, removing multiple instances of it if necessary
function offStart(s, tag)      { return _off(s, tag, true); }
function offEnd(s, tag)        { return _off(s, tag, false); }
function _off(s, tag, forward) {
	if (forward) { while(starts(s, tag)) s = beyond(s, tag.length); } // Remove tag from the start of s
	else         { while(ends(s, tag)) s = chop(s, tag.length); } // Remove tag from the end of s
	return s;
}

// Remove any number of tags from the start and end of s, like off(s, " ", "-", "_")
function off(s) {

	// Remove the tags from the start of s until gone
	while (true) {
		var none = true;
		for (var i = 1; i < arguments.length; i++) { // Skip the 0th argument, which is s
			if (starts(s, arguments[i])) {
				s = beyond(s, arguments[i].length);
				none = false;
			}
		}
		if (none) break;
	}

	// Remove the tags from the end of the string until gone
	while (true) {
		var none = true;
		for (var i = 1; i < arguments.length; i++) {
			if (ends(s, arguments[i])) {
				s = chop(s, arguments[i].length);
				none = false;
			}
		}
		if (none) break;
	}

	return s;
}

exports.onStart = onStart;
exports.onEnd = onEnd;
exports._on = _on;

exports.offStart = offStart;
exports.offEnd = offEnd;
exports._off = _off;

exports.off = off;









//the round trip strict trick is really cool
//you could use it for base16, 32, 62 also
//and also maybe generalize it so you can call one function that does it

//s is the text we parsed
//o is the object we parsed it into
//f is the function that turns o back into text
function parseCheck(s, t) { if (s !== t) throw "data"; }
function parseCheckMatch(s, t) { if (!match(s, t)) throw "data"; }
//call this in number, base16, 32, 62
//this is a great idea








function number(s) { return _number(s, 10); }
function number16(s) { return _number(s, 16); }
function _number(s, base) {
	if (typeof s !== "string") throw "type";
	var n = parseInt(s, base);
	if (isNaN(n)) throw "data";
	if (!match(_numerals(n, base), s)) throw "data"; // Guard against parseInt's dangerously accommodating parsing style by ensuring that the number we made becomes the same text we made it from
	return n;
}

function numerals(n) { return _numerals(n, 10); }
function numerals16(n) { return _numerals(n, 16); }
function _numerals(n, base) {
	if (typeof n !== "number") throw "type";
	return n.toString(base);
}

exports.number = number;
exports.number16 = number16;
exports._number = _number;

exports.numerals = numerals;
exports.numerals16 = numerals16;
exports._numerals = _numerals;




//wait, number16("A") will fail--write a test that demonstrates this first, then adjust the code to make it pass by calling lower on each before the comparison, or by using match()
//and build that feature into parseCheck, have parseCheck and parseCheckMatch







// Fill in the blanks to compose text, like fill("Color #, Number #.", "red", 7);
// Like C's famous sprintf, but simpler and more in the style of a dynamically typed language
// You only really need one format specifier, #
// What if you want to include a # that doesn't get replaces? Assemble your string the old fasioned way with "# of kittens: " + kittens + ";"
function fill(s) {
	var t = "";
	for (var i = 1; i < arguments.length; i++) { // Skip the 0th argument, which is s
		var c = cut(s, "#");
		t += c.before + (arguments[i] + ""); // Turn the argument into a string
		s = c.after;
	}
	return t + s; // Include any part of s that remains
}

exports.fill = fill;














function widen(s, width, c) {
	if (!c) c = "0";
	while (s.length < width) s = c + s;
	return s;
}

exports.widen = widen;









// Insert commas between groups of three characters
// For example, commas("12345") == "12,345"
// In Europe, specify a custom separator like commas(s, ".")
function commas(s, c) {
	if (!c) c = ","; // Separate with comma by default
	var u = ""; // Temporary string
	var t = ""; // Target text to build and return
	while (s.length > 3) {// Move commas and groups of 3 characters from s to t
		u = end(s, 3);
		s = chop(s, 3);
		t = c + u + t;
	}
	return s + t; // Move the leading gorup of up to 3 characters
}

exports.commas = commas;












/** Format the given list of strings into a fixed width text table with the given number of columns. *
public static String table(int columns, String... cells) {
	
	int[] widths = new int[columns]; // Loop to determine how wide each column needs to be
	for (int i = 0; i < cells.length; i++) {
		if (widths[i % columns] < cells[i].length())
			widths[i % columns] = cells[i].length();
	}
	
	StringBuffer b = new StringBuffer(); // Loop for each cell to assemble the table
	for (int i = 0; i < cells.length; i++) {
		String s = cells[i];

		if (i % columns != columns - 1) {            // Before the last column
			while (s.length() < widths[i % columns]) // Make this cell wide enough for the column it's in
				s += " ";
			b.append(s + "  ");
		} else {                                     // Last column
			b.append(s + "\r\n");
		}
	}
	return b.toString();
}
*/
















function trimStart() {}
function trimEnd() {}
function trim() {}
function _trim() {}
function _trimPlatform() {}
function _trimCustom() {}
/*
trim
c trim
j trim
js trim
js trimLeft
js trimRight
*/





function sort(s1, s2) {}
/*
c same, compare
j same, sameCase
js localeCompare
*/











/*




js split

c parse
c words
c SayNumber

c UriDecode, UriEncode
c SafeFileName

j group, line
j lines, words, words
j line






(dont do)
j quote, because javascript allows single quotes
c SayTime, because these will be methods on time objects
c SayNow

(regular expressions)
js match
js search

(not used)
js quote
js toSource
js toString
js valueOf
*/



//write tests for these, confirm they throw on undefined and null
//or just write s.hasText() and s.isBlank(), and confirm those throw if s is undefined or null
//unlike previous code, don't treat s = null as a valid blank string




/*

if (!('trim' in String.prototype)) {
}


//read to find out when you should use in, and when hasOwnProperty
//maybe use in instead of hasOwnProperty in Bin, for instance

String.prototype.distance = function (arg) {
    alert(arg);
};

*/



//write them all as functions
//in a separate section, add them to String prototype

//add parse, it's not here for some reason

//write sortData(a, b) as a separate function

//watch rock dots go between upper and lower case
//watch french accents get alphebetized correctly

//write make safe for windows file name
//write url encode and decode parts

//look in cpp text code, this is the most recent and complete job you did with parse() and uri encoding of international characters 








//maybe you should also make your own StringBuffer in here
//and then use it in encode, rather than the weird thing you have there
//call it TextBay, for instance, and have an add() method, and say()
//no, they made + the fastest thing ever



//TODO add tests to confirm you can find international characters in text, split on them, and so on



//here's a weird idea
//what if you replaced characters illegal for windows filenames with unicode characters that look similar



//go to and from data
//go to and from number, base 10 and base 16

//move Encode from data to text, but leave them as separate functions













//after String in this file is where you'll put Describe



//yes, move Encode into text.js
//the parts of text.js will then be

//String
//Number
//Encode



//add to string's prototype at the bottom of each exports bunch, just doing the ones that make sense, obviously





//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         






