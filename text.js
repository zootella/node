











/* Warning: This file contains some long lines (Like this one!). So maximize the window or just turn word wrap on, and quit complaining. Screens were 80 characters wide a long, long time ago, and nobody cares anymore. Seriously. */


/*
 * whiskers on mittens
 * 
 * These are a few of my favorite strings.
 */

















//   _____                 
//  |_   _|   _ _ __   ___ 
//    | || | | | '_ \ / _ \
//    | || |_| | |_) |  __/
//    |_| \__, | .__/ \___|
//        |___/|_|         

// True if o is an object with a function o.name() you can call
function hasMethod(o, name) { return o && typeof o[name] == "function"; }

// Text that describes the type of o, like "string" or "Data"
function getType(o) {
	if (hasMethod(o, "type")) return o.type(); // Ask the type() method we add to custom objects
	return typeof o;                           // Use the typeof operator
}
function isType(o, name) { return getType(o) == name; } // True if object o is of type name
function checkType(o, name) { if (!isType(o, name)) throw "type"; } // Throw type if o is not of type name

exports.hasMethod = hasMethod;
exports.getType = getType;
exports.isType = isType;
exports.checkType = checkType;









//      _                         
//     / \   _ __ _ __ __ _ _   _ 
//    / _ \ | '__| '__/ _` | | | |
//   / ___ \| |  | | | (_| | |_| |
//  /_/   \_\_|  |_|  \__,_|\__, |
//                          |___/ 

// Add o to the end of array a with a.add(o)
if ("add" in Array.prototype) throw "program";
Array.prototype.add = Array.prototype.push; // Just link to push

// Remove and return the element at index i in an array with a.remove(i)
// Shift remaining elements forward instead of leaving a hole
if ("remove" in Array.prototype) throw "program";
Array.prototype.remove = function(i) {
	if (i < 0 || i >= this.length) throw "bounds";
	var o = this[i];
	this.splice(i, 1); // At index i, remove 1 item and shift those after it towards the start
	return o;
}

//maybe write a get() that checks bounds as well, just to use when you're outside a tight loop and not absolutely sure










//   ____  _        _             
//  / ___|| |_ _ __(_)_ __   __ _ 
//  \___ \| __| '__| | '_ \ / _` |
//   ___) | |_| |  | | | | | (_| |
//  |____/ \__|_|  |_|_| |_|\__, |
//                          |___/ 

// Add function f to the String type so that s.name(a, b) calls and returns name(s, a, b)
function augment(f, name) {
	if (name in String.prototype)
		throw "program"; // Don't add a method to String over one already there

	String.prototype[name] = function() { // Call this function when you call s.name()
		var a = [this + ""]; // Coax the given this into a string, rather than an array of characters
		for (var i = 0; i < arguments.length; i++) // After this, add all the arguments from name(s)
			a.push(arguments[i]);
		return f.apply(this, a); // Call name(s, a) and return the result
	}
}











//    ____ _                          _            
//   / ___| |__   __ _ _ __ __ _  ___| |_ ___ _ __ 
//  | |   | '_ \ / _` | '__/ _` |/ __| __/ _ \ '__|
//  | |___| | | | (_| | | | (_| | (__| ||  __/ |   
//   \____|_| |_|\__,_|_|  \__,_|\___|\__\___|_|   
//                                                 

// True if s is a string with some text
// Instead of is(), you can also just use if (s == "") or if (!s.length)
function is(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return false;
	return true;
}

// True if s is a string that's blank
// Instead of blank, you can also just use if (s != "") or if (s.length)
function blank(s) {
	if (typeof s !== "string") throw "type";
	if (s.length === 0) return true;
	return false;
}

// Convert lower case characters in s to upper case
function upper(s) {
	var u = s.toLocaleUpperCase(); // Use instead of toUpperCase() to work for locales without the default Unicode case mappings
	if (s.length != u.length) mistakeLog({ name:"upper", s:s, u:u }); // Make sure the case change didn't change the length
	return u;
}

// Convert upper case characters in s to lower case
function lower(s) {
	var l = s.toLocaleLowerCase();
	if (s.length != l.length) mistakeLog({ name:"lower", s:s, l:l });
	return l;
}

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

// True if the first character in s is a letter "a" through "z" or "A" through "Z"
function isLetter(s) {
	if (s == "") return false;
	return range(s, "a", "z") || range(s, "A", "Z");
}

// True if the first character in s is a digit "0" through "9"
function isNumber(s) {
	if (s == "") return false;
	return range(s, "0", "9");
}

// True if the given character or string is blank or entirely made up of whitespace characters
function isSpace(s) { return s.trim() == ""; } // See if it trims down to blank

// Determine which should appear first in sorted order
// Zero if same, negative if s1 then s2, positive if s2 first
function sortText(s1, s2) {
	checkType(s1, "string");
	checkType(s2, "string");
	return s1.localeCompare(s2);
}

exports.is = is;
exports.blank = blank;
augment(upper, "upper");
augment(lower, "lower");
augment(code, "code");
augment(range, "range");
augment(isLetter, "isLetter");
augment(isNumber, "isNumber");
augment(isSpace, "isSpace");
exports.sortText = sortText;















//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         

// Before returning object o we parsed from text s, make sure o turns back into exactly the same text
// This is a clever way to turn a forgiving parsing function into a very strict one
function parseCheck(oToString, s) { // Case sensitive
	if (oToString != s) throw "data";
}
function parseCheckMatch(oToString, s) { // Matches cases, use for things like base16 where both "a" and "A" are valid 10
	if (!match(oToString, s)) throw "data";
}

// Turn a string like "123" into the number 123
function number(s) { return _number(s, 10); }
function number16(s) { return _number(s, 16); } // Base 16, turn "A" into 10
function _number(s, base) {
	if (typeof s !== "string") throw "type";
	var n = parseInt(s, base);
	if (isNaN(n)) throw "data";
	parseCheckMatch(_numerals(n, base), s); // Guard against parseInt's dangerously accommodating parsing style by ensuring that the number we made becomes the same text we made it from
	return n;
}

// Turn a number like 123 into a string like "123"
function numerals(n) { return _numerals(n, 10); }
function numerals16(n) { return _numerals(n, 16); } // Base 16, turn 10 into "A"
function _numerals(n, base) {
	if (typeof n !== "number") throw "type";
	return n.toString(base);
}

exports.parseCheck = parseCheck;
exports.parseCheckMatch = parseCheckMatch;
exports.number = number;
exports.number16 = number16;
exports.numerals = numerals;
exports.numerals16 = numerals16;




















//    ____ _ _       
//   / ___| (_)_ __  
//  | |   | | | '_ \ 
//  | |___| | | |_) |
//   \____|_|_| .__/ 
//            |_|    

// Get the first character in s, or "" if s is ""
function first(s) { return get(s, 0); }
// Get the character a distance i in characters into s, or "" if s isn't long enough
function get(s, i) {
	if (!i) i = 0; // Turn undefined into 0 so math below works
	if (i < 0 || i > s.length - 1) return "";
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

augment(first, "first");
augment(get, "get");
augment(start, "start");
augment(end, "end");
augment(beyond, "beyond");
augment(chop, "chop");
augment(clip, "clip");











//   _____ _           _ 
//  |  ___(_)_ __   __| |
//  | |_  | | '_ \ / _` |
//  |  _| | | | | | (_| |
//  |_|   |_|_| |_|\__,_|
//                       

// Compare two strings, case sensitive, or just use s1 == s2 instead
function same(s1, s2) {
	var p = _samePlatform(s1, s2);
	var c = _sameCustom(s1, s2);
	if (p != c) mistakeLog({ name:"same", s1:s1, s2:s2, p:p, c:c }); //TODO do the way that's faster instead of this check
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
	if (p != c) mistakeLog({ name:"match", s1:s1, s2:s2, p:p, c:c }); //TODO do the way that's faster instead of this check
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
	if (scan && p != c) mistakeLog({ name:"_find", s:s, tag:tag, forward:forward, scan:scan, match:match, p:p, c:c }); //TODO do the way that's faster instead of this check
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

exports.same = same;
exports.match = match;
augment(starts, "starts");
augment(startsMatch, "startsMatch");
augment(ends, "ends");
augment(endsMatch, "endsMatch");
augment(has, "has");
augment(hasMatch, "hasMatch");
augment(find, "find");
augment(findMatch, "findMatch");
augment(last, "last");
augment(lastMatch, "lastMatch");
augment(either, "either");
augment(eitherMatch, "eitherMatch");














//    ____      _   
//   / ___|   _| |_ 
//  | |  | | | | __|
//  | |__| |_| | |_ 
//   \____\__,_|\__|
//                  

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

// Cut s around tag, separating the parts before and after it
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

// In a single pass through s, replace whole instances of t1 with t2, like swap("a-b-c", "-", "_") is "a_b_c"
function swap(s, t1, t2)      { return _swap(s, t1, t2, false); } // Case sensitive
function swapMatch(s, t1, t2) { return _swap(s, t1, t2, true);  } // Matches cases
function _swap(s, t1, t2, match) {
	var s2 = "";                        // Target string to fill with text as we break off parts and make the replacement
	while (s.length) {                  // Loop until s is blank, also makes sure it's a string
		var c = _cut(s, t1, true, match); // Cut s around the first instance of the tag in it
		s2 += c.before;                   // Move the part before from s to done
		if (c.found) s2 += t2;
		s = c.after;
	}
	return s2;
	// Why not use JavaScript's s.replace() instead? Well, it can't match cases without regular expressions, and wrapping input that might be data from a user as a regular expression is a bad idea. Also, /i might not do as good a job as toLocaleLowerCase().
}

// Parse out the part of s between t1 and t2
function parse(s, t1, t2) { return _parse(s, t1, t2, false); }
function parseMatch(s, t1, t2) { return _parse(s, t1, t2, true); }
function _parse(s, t1, t2, match) {
	s = _cut(s, t1, true, match).after;
	if (has(s, t2, match)) s = _cut(s, t2, true, match).before;
	else s = "";
	return s;
}

augment(before, "before");
augment(beforeMatch, "beforeMatch");
augment(beforeLast, "beforeLast");
augment(beforeLastMatch, "beforeLastMatch");
augment(after, "after");
augment(afterMatch, "afterMatch");
augment(afterLast, "afterLast");
augment(afterLastMatch, "afterLastMatch");
augment(cut, "cut");
augment(cutMatch, "cutMatch");
augment(cutLast, "cutLast");
augment(cutLastMatch, "cutLastMatch");
augment(swap, "swap");
augment(swapMatch, "swapMatch");
augment(parse, "parse");
augment(parseMatch, "parseMatch");
























//   _____     _           
//  |_   _| __(_)_ __ ___  
//    | || '__| | '_ ` _ \ 
//    | || |  | | | | | | |
//    |_||_|  |_|_| |_| |_|
//                         

// Use JavaScript's s.trim() to remove whitespace characters from both ends of s
function trimStart(s) { return s.trimLeft(); } // Remove whitespace characters from the start of s
function trimEnd(s) { return s.trimRight(); } // Remove whitespace characters from the end of s

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

augment(trimStart, "trimStart");
augment(trimEnd, "trimEnd");
augment(onStart, "onStart");
augment(onEnd, "onEnd");
augment(offStart, "offStart");
augment(offEnd, "offEnd");
augment(off, "off");































//   ____  _       
//  |  _ \(_)_ __  
//  | |_) | | '_ \ 
//  |  _ <| | |_) |
//  |_| \_\_| .__/ 
//          |_|    

// Make an array of all the parts of s that remain after ripping away all the instances of tag
// For instance, "a:b:c".rip(":") is ["a","b","c"]
// Works like JavaScript's split(), but with two additional features:
// True to trim whitespace from the start and end of each string in the array
// True to omit blank strings from the array
function ripWords(s, trimItems, skipBlankItems) { return rip(s, " ", trimItems, skipBlankItems); }
function ripLines(s, trimItems, skipBlankItems) { return rip(s, "\n", trimItems, skipBlankItems); }
function rip(s, tag, trimItems, skipBlankItems) {

	function sameArrayOfStrings(a1, a2) { // Determine if two arrays of strings are the same
		if (a1.length != a2.length) return false; // Must have the same length
		for (var i = 0; i < a1.length; i++)
			if (a1[i] !== a2[i]) return false; // Each string must be the same
		return true;
	}

	var p = _ripPlatform(s, tag, trimItems, skipBlankItems);
	var c = _ripCustom(s, tag, trimItems, skipBlankItems);
	if (!sameArrayOfStrings(p, c)) mistakeLog({ name:"split", s:s, tag:tag, p:p, c:c }); //TODO do the way that's faster instead of this check
	return c; // Return custom
}
function _ripPlatform(s, tag, trimItems, skipBlankItems) { // Implemented using s.split();

	if (typeof tag !== "string") throw "type"; // Don't pass split a regular expression without realizing it
	var a = s.split(tag);

	if (trimItems) { // Trim each item afterwards
		for (var i = 0; i < a.length; i++) {
			a[i] = a[i].trim();
		}
	}
	if (skipBlankItems) { // Remove blank items
		for (var i = a.length - 1; i >= 0; i--) { // Loop backwards so removing and item doesn't mess up the index number
			if (a[i] == "") { // Found a blank
				a.remove(i);
			}
		}
	}
	return a;
}
function _ripCustom(s, tag, trimItems, skipBlankItems) { // Implemented without using s.split();

	function add(w) { // Add the given word w to the array
		if (trimItems) w = w.trim(); // Trim the word, if the caller requested this feature
		if (!skipBlankItems || w != "") a.add(w); // Skip adding a blank word, if the caller requested this feature
	}

	var a = []; // The array we will fill and return
	while (true) {
		var c = s.cut(tag);  // Cut around the first instance of the tag
		if (!c.found) break; // Not found, leave the loop
		add(c.before);       // Add the word before to the array
		s = c.after;         // Set s to what's after to loop again
	}
	add(s); // Everything after the last tag is the last item
	return a;
}

augment(ripWords, "ripWords");
augment(ripLines, "ripLines");
augment(rip, "rip");




























//    ____                                     
//   / ___|___  _ __ ___  _ __   ___  ___  ___ 
//  | |   / _ \| '_ ` _ \| '_ \ / _ \/ __|/ _ \
//  | |__| (_) | | | | | | |_) | (_) \__ \  __/
//   \____\___/|_| |_| |_| .__/ \___/|___/\___|
//                       |_|                   

// Turn the given list of anything into text
// For instance, say("a", 2, "c") is "a2c"
function say() {
	var t = "";
	for (var i = 0; i < arguments.length; i++)
		t += _say(arguments[i]); // Using + is actually must faster than s.concat() or [].join()
	return t;
}

// Turn the given list of anything into text with a newline at the end
function line() {
	var t = "";
	for (var i = 0; i < arguments.length; i++)
		t += _say(arguments[i]);
	return t + newline;
}

// Turn anything into text the best way possible
function _say(o) {
	if      (typeof o == "string")     return o;            // Strings pass through
	else if (typeof o == "number")     return numerals(o);  // Convert a number into numerals
	else if (hasMethod(o, "text"))     return o.text();     // Call the object's text() method
	else if (hasMethod(o, "toString")) return o.toString(); // Use toString() instead
	else                               return o + "";       // Last resort, add to blank
}

// Use this line separator when composing text
var newline = "\r\n"; // Use both \r and \n to work on Unix and Windows

// Fill in the blanks to compose text, like fill("Color #, Number #.", "red", 7);
// Like C's famous sprintf, but simpler and more in the style of a dynamically typed language
// You only really need one format specifier, #
function fill(s) {
	var t = "";
	for (var i = 1; i < arguments.length; i++) { // Skip the 0th argument, which is s
		var c = cut(s, "#");
		t += c.before + say(arguments[i]);
		s = c.after;
	}
	return t + s; // Include any part of s that remains
}

// Concatenate the given strings together with a newline after each one
function lines() {
	var t = "";
	for (var i = 0; i < arguments.length; i++)
		t += say(arguments[i]) + newline;
	return t;
}

// Format list of rows like table(["head1", "head2"], ["value1", "value2"]) into a fixed width text table
function table() {

	var width = []; // Find the longest cell to calculate the width of each column
	for (var r = 0; r < arguments.length; r++)
		for (var c = 0; c < arguments[0].length; c++)
			if (!width[c] || width[c] < arguments[r][c].length) // Undefined or smaller
				width[c] = arguments[r][c].length;

	var t = "";
	for (var r = 0; r < arguments.length; r++) {      // Within each row
		for (var c = 0; c < arguments[0].length; c++) { // Loop for each column
			var cell = say(arguments[r][c]);              // Add blank to convert the argument into a string
			if (c == arguments[0].length - 1) {           // Last column
				t += cell + newline;                          // Add the cell text and newline characters
			} else {                                      // Column before the last column
				while (cell.length < width[c]) cell += " ";   // Pad the cell
				t += cell + "  ";                             // Add the cell and the separator for the next column
			}
		}
	}
	return t;
}

exports.say = say;
exports.line = line;
augment(fill, "fill");
exports.lines = lines;
exports.table = table;



























//   _____                     _      
//  | ____|_ __   ___ ___   __| | ___ 
//  |  _| | '_ \ / __/ _ \ / _` |/ _ \
//  | |___| | | | (_| (_) | (_| |  __/
//  |_____|_| |_|\___\___/ \__,_|\___|
//                                    

// URI encode s, replacing reserved characters with percent codes
// Encodes every UTF-8 byte of the text except A-Z a-z 0-9 -_.!~*'()
// Encodes " " to "+" instead of "%20", which is ok when encoding the part of the URI after the "?"
function encode(s) {
	return encodeURIComponent(s).swap("%20", "+"); // Encode, then turn spaces into plusses
}

// URI decode s, decoding percent sequences like "%3F" into the characters they represent
// Decodes both "%20" and "+" into " " in case spaces got encoded into plusses, ok because "+" would have gotten encoded into "%2B"
function decode(s) {
	try {
		return decodeURIComponent(s.swap("+", "%20")); // Decode plusses, then everything
	} catch (e) {
		if (e.name == "URIError") throw "data"; // Turn URIError into data
		else throw e; // Throw something else we didn't expect
	}
}

// Replace characters not allowed in Windows file names with acceptable ones
function safeFileName(s) {
	s = s.swap("\"", "”"); // Pick Unicode characters that look similar
	s = s.swap("\\", "﹨");
	s = s.swap("/",  "⁄");
	s = s.swap(":",  "։");
	s = s.swap("*",  "﹡");
	s = s.swap("?",  "﹖");
	s = s.swap("<",  "‹");
	s = s.swap(">",  "›");
	s = s.swap("|",  "।");
	return s;
}

augment(encode, "encode");
augment(decode, "decode");
exports.safeFileName = safeFileName;















































/*

(do in data because you need to use clip)
j group, line


(dont do)
j quote, because javascript allows single quotes
c SayTime, SayNow, because these will be methods on time objects

(regular expressions)
js match
js search

(not used)
js quote
js toSource
js toString
js valueOf
*/












//write sortData(a, b) as a separate function

//watch rock dots go between upper and lower case
//watch french accents get alphebetized correctly

//along with uri encode and decode, have html escape to make it safe to show in the page






//write a test where you turn unicode characters into data, look at just the first part of them, turn that back into text, and then see what they look like
//figure out if there is a parsing danger here, for instance, can the first half or third of a unicode character look like another character
//hopefully not, but you need to check it out
















