

var log = console.log;

var data = require("./data");
var Data = data.Data;






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

exports.make = make;

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

// How many bytes the given text take up encoded into UTF-8
function size(s) {
	return Data(s).size();
}

exports.is = is;
exports.blank = blank;
// Use s.length
exports.size = size;

// Get the first character in s
function first(s) { return get(s, 0); }
// Get the character a distance i in characters into the string s
function get(s, i) {
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charAt(i);
}

function start(s, n)  { return clip(s, 0, n); }            // Clip out the first n characters of s, start(3) is CCCccccccc	
function end(s, n)    { return clip(s, s.length - n, n); } // Clip out the last n characters of s, end(3) is cccccccCCC	
function beyond(s, i) { return clip(s, i, s.length - i); } // Clip out the characters beyond index i in s, beyond(3) is cccCCCCCCC	
function chop(s, n)   { return clip(s, 0, s.length - n); } // Chop the last n characters off the end of s, returning the start before them, chop(3) is CCCCCCCccc	
function clip(s, i, n) {                                  // Clip out part of s, clip(5, 3) is cccccCCCcc
	if (i < 0 || n < 0 || i + n > s.length) throw "bounds"; // Make sure the requested index and number of characters fits inside s
	return s.slice(i, i + n); // Using slice instead of substr or substring
}
//TODO test the bounds the same way you did data

exports.first = first;
exports.get = get;
exports.start = start;
exports.end = end;
exports.beyond = beyond;
exports.chop = chop;
exports.clip = clip;



// Compare two strings, matching cases
function sameMatch(s1, s2) {
	if (s1.length() != s2.length()) return false;   // Make sure s1 and s2 are the same length
	else if (s1.length() == 0) return true;         // Blanks are the same
	return search(s1, s2, true, false, true) != -1; // Search at the start only
}
// Compare two strings, case sensitive
function same(s1, s2) {
	if (s1.length() != s2.length()) return false;    // Make sure s1 and s2 are the same length
	else if (s1.length() == 0) return true;          // Blanks are the same
	return search(s1, s2, true, false, false) != -1; // Search at the start only
}


function startsMatch(s, tag) { return search(s, tag, true,  false, true)  != -1; } // True if s starts with tag, matching cases
function starts(s, tag)      { return search(s, tag, true,  false, false) != -1; } // True if s starts with tag, case sensitive
function endsMatch(s, tag)   { return search(s, tag, false, false, true)  != -1; } // True if s ends with tag, matching cases
function ends(s, tag)        { return search(s, tag, false, false, false) != -1; } // True if s ends with tag, case sensitive
function hasMatch(s, tag)    { return search(s, tag, true,  true,  true)  != -1; } // True if s contains tag, matching cases
function has(s, tag)         { return search(s, tag, true,  true,  false) != -1; } // True if s contains tag, case sensitive

// Find where tag1 or tag2 first appears in s, -1 if neither found
function either(s, tag1, tag2) {
	int i1 = find(s, tag1); // Search for both
	int i2 = find(s, tag2);
	if (i1 == -1 && i2 == -1) return -1; // Both not found
	else if (i1 == -1) return i2; // One found, but not the other
	else if (i2 == -1) return i1;
	else return Math.min(i1, i2); // Both found, return the one that appears first
}

function findMatch(s, tag) { return search(s, tag, true, true, true); } // Find the character index in s where tag appears, matching cases, -1 not found
function find(s, tag)      { return search(s, tag, true, true, false); } // Find the character index in s where tag appears, case sensitive, -1 not found
function lastMatch(s, tag) { return search(s, tag, false, true, true); } // Find the character index in s where tag last appears, matching cases, -1 not found
function last(s, tag)      { return search(s, tag, false, true, false); } // Find the character index in s where tag last appears, case sensitive, -1 not found





/*
c starts, trails, has, find

j starts, startsCase, ends, endsCase
j has, hasCase
j find, findCase, last, lastCase, search

js contains
js startsWith, endsWith
js indexOf, lastIndexOf
*/



// Find where in s tag appears, the character index, or -1 not found
// forward: true to search forwards from the start, false to search backwards from the end
// scan:    true to scan across all the positions possible in s, false to only look at the starting position
// match:   true to match upper and lower case characters, false to treat upper and lower case characters as different

//TODO say what it does if s or tag are blank
function search(s, tag, forward, scan, match) {

	// Get and check the lengths
	if (!tag.length) throw "argument";
	if (s.length < tag.length) return -1;

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
				sc = lower(sc); // Change both characters to lower case so they match
				tc = lower(tc);
			}
			if (sc !== tc) break; // Mismatch found, break to move to the next spot in s
		}
		if (ti === tag.length) return si; // We found the tag at si, return it
	}
	return -1; // Not found
}

exports.search = search; // Only exported for testing










function before() {}
function after() {}
function around() {}
/*
c before, after, split
j before, after, beforeLast, afterLast, split, splitCase, splitLast, splitLastCase, split
*/

function replace() {}
/*
c replace
j replace
js replace
*/

function on() {}
function off() {}
/*
c on, off
*/

function trim() {}
/*
trim
c trim
j trim
js trim
js trimLeft
js trimRight
*/

function same(s1, s2) {}
function sort(s1, s2) {}
/*
c same, compare
j same, sameCase
js localeCompare
*/

function upper(s) { return s.toLocaleUpperCase(); }
function lower(s) { return s.toLocaleLowerCase(); }
/*
js toLocaleLowerCase
js toLocaleUpperCase
js toLowerCase
js toUpperCase
*/
exports.upper = upper;
exports.lower = lower;

// The Unicode number value of the character a distance i characters into s
// Also gets ASCII codes, code("A") is 65
// You can omit i to get the code of the first character
function code(s, i) {
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charCodeAt(i);
}
exports.code = code;
function fromCode(n) {}
/*
js charCodeAt
js String.fromCharCode
*/

function isLetter(c) {}
function isNumber(c) {}
/*
j isLetter
j isNumber
*/

function number(s) {}
function numerals(n) {}
/*
c number
*/




/*
(do later)

j findEither
c parse

c words
js split
j group, line
j lines, words, words
j line
j table

c SayNumber

c InsertCommas
c SayTime
c SayNow
c UriDecode, UriEncode
c SafeFileName
j quote

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






























