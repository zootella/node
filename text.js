

var log = console.log;

var data = require("./data");
var Data = data.Data;





//how to polyfill
/*
if(!('contains' in String.prototype))
  String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };
*/


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

// How many bytes the given text take up encoded into UTF-8
function size(s) {
	return Data(s).size();
}

exports.make = make;
exports.is = is;
exports.blank = blank;
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

exports.first = first;
exports.get = get;
exports.start = start;
exports.end = end;
exports.beyond = beyond;
exports.chop = chop;
exports.clip = clip;

// Compare two strings, case sensitive, or just use s1 == s2 instead
function same(s1, s2) {
	var a1 = samePlatform(s1, s2);
	var a2 = sameCustom(s1, s2);
	if (a1 != a2) throw "check"; //TODO do the way that's faster instead of this check
	return a1;
}
function samePlatform(s1, s2) { return s1 == s2; }
function sameCustom(s1, s2) {
	if (s1.length != s2.length) return false;        // Make sure s1 and s2 are the same length
	else if (s1.length == 0) return true;              // Blanks are the same
	return search(s1, s2, true, false, false) != -1; // Search at the start only
}

// Compare two strings, matching cases
function match(s1, s2) {
	var a1 = sameMatchPlatform(s1, s2);
	var a2 = sameMatchCustom(s1, s2);
	if (a1 != a2) throw "check"; //TODO do the way that's faster instead of this check
	return a1;
}
function matchPlatform(s1, s2) { return s1.toLocaleLowerCase() == s2.toLocaleLowerCase(); }
function matchCustom(s1, s2) {
	if (s1.length != s2.length) return false;       // Make sure s1 and s2 are the same length
	else if (s1.length == 0) return true;             // Blanks are the same
	return search(s1, s2, true, false, true) != -1; // Search at the start only
}

function starts(s, tag)      { return search(s, tag, true,  false, false) != -1; } // True if s starts with tag, case sensitive
function startsMatch(s, tag) { return search(s, tag, true,  false, true)  != -1; } // True if s starts with tag, matches cases
function ends(s, tag)        { return search(s, tag, false, false, false) != -1; } // True if s ends with tag, case sensitive
function endsMatch(s, tag)   { return search(s, tag, false, false, true)  != -1; } // True if s ends with tag, matches cases
function has(s, tag)         { return search(s, tag, true,  true,  false) != -1; } // True if s contains tag, case sensitive
function hasMatch(s, tag)    { return search(s, tag, true,  true,  true)  != -1; } // True if s contains tag, matches cases

function find(s, tag)      { return search(s, tag, true,  true, false); } // Find the character index in s where tag appears, case sensitive, -1 not found
function findMatch(s, tag) { return search(s, tag, true,  true, true);  } // Find the character index in s where tag appears, matches cases, -1 not found
function last(s, tag)      { return search(s, tag, false, true, false); } // Find the character index in s where tag last appears, case sensitive, -1 not found
function lastMatch(s, tag) { return search(s, tag, false, true, true);  } // Find the character index in s where tag last appears, matches cases, -1 not found

// Find where in s tag appears, the character index, or -1 not found
// forward: true to search forwards from the start, false to search backwards from the end
// scan:    true to scan across all the positions possible in s, false to only look at the starting position
// match:   true to match upper and lower case characters, false to treat upper and lower case characters as different
function search(s, tag, forward, scan, match) {
	var a1 = searchPlatform(s, tag, forward, scan, match);
	var a2 = searchCustom(s, tag, forward, scan, match);
	if (a1 != a2) throw "check"; //TODO do the way that's faster instead of this check
	return a1;
}
function searchPlatform(s, tag, forward, scan, match) { // Using JavaScript
	if (!tag.length) throw "argument";
	if (match) { s = s.toLocaleLowerCase(); tag = tag.toLocaleLowerCase(); } // Lowercase everything to match cases
	return forward ? s.indexOf(tag) : s.lastIndexOf(tag); // Find the first or last index of the tag
}
function searchCustom(s, tag, forward, scan, match) { // Using our own code

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
exports.samePlatform = samePlatform;
exports.sameCustom = sameCustom;
exports.match = match;
exports.matchPlatform = matchPlatform;
exports.matchCustom = matchCustom;

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

exports.search = search;
exports.searchPlatform = searchPlatform;
exports.searchCustom = searchCustom;

function before(s, tag)          { return split(s, tag, true,  false).before; } // The part of s before tag, s if not found, case sensitive
function beforeMatch(s, tag)     { return split(s, tag, true,  true ).before; } // The part of s before tag, s if not found, matches cases
function beforeLast(s, tag)      { return split(s, tag, false, false).before; } // The part of s before the last place tag appears, s if not found, case sensitive
function beforeLastMatch(s, tag) { return split(s, tag, false, true ).before; } // The part of s before the last place tag appears, s if not found, matches cases

function after(s, tag)          { return split(s, tag, true,  false).after; } // The part of s after tag, "" if not found, case sensitive
function afterMatch(s, tag)     { return split(s, tag, true,  true ).after; } // The part of s after tag, "" if not found, matches cases
function afterLast(s, tag)      { return split(s, tag, false, false).after; } // The part of s after the last place tag appears, "" if not found, case sensitive
function afterLastMatch(s, tag) { return split(s, tag, false, true ).after; } // The part of s after the last place tag appears, "" if not found, matches cases

function cut(s, tag)          { return split(s, tag, true,  false); } // Cut s around tag to get what's before and after, case sensitive
function cutMatch(s, tag)     { return split(s, tag, true,  true ); } // Cut s around tag to get what's before and after, matches cases
function cutLast(s, tag)      { return split(s, tag, false, false); } // Cut s around the last place tag appears to get what's before and after, case sensitive
function cutLastMatch(s, tag) { return split(s, tag, false, true ); } // Cut s around the last place tag appears to get what's before and after, matches cases

// Split s around tag, finding the parts before and after it
// forward: true to find the first place the tag appears, false to search backwards from the end
// match:   true to match upper and lower case characters, false to be case-sensitive
function split(s, tag, forward, match) {
	var i = search(s, tag, forward, true, match); // Search s for tag
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
















function replace() {}
/*
c replace
j replace
js replace
*/

//write a test to see how it replaces "aaaaa" "aa" "bb", should be "bbbba", you think

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

include the feature where you can trim everything in the given string of tags
*/

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




// Find where tag1 or tag2 first appears in s, -1 if neither found
function either(s, tag1, tag2) {
	var i1 = find(s, tag1); // Search for both
	var i2 = find(s, tag2);
	if (i1 == -1 && i2 == -1) return -1; // Both not found
	else if (i1 == -1) return i2; // One found, but not the other
	else if (i2 == -1) return i1;
	else return Math.min(i1, i2); // Both found, return the one that appears first
}


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






























