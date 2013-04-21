

var log = console.log;

var data = require("./data");
var Data = data.Data;
var base64 = data.base64;

var text = require("./text");
var make = text.make;
var is = text.is;
var blank = text.blank;
var size = text.size;
var first = text.first;
var get = text.get;
var start = text.start;
var end = text.end;
var beyond = text.beyond;
var chop = text.chop;
var clip = text.clip;


var search = text.search; // Only exported for testing

var upper = text.upper;
var lower = text.lower;




//   ____  _        _             
//  / ___|| |_ _ __(_)_ __   __ _ 
//  \___ \| __| '__| | '_ \ / _` |
//   ___) | |_| |  | | | | | (_| |
//  |____/ \__|_|  |_|_| |_|\__, |
//                          |___/ 

exports.testMake = function(test) {

	test.ok(make("a", "b", "cd") == "abcd");
	test.ok(make("aaa", "", "bbb") == "aaabbb");//middle string is blank

	test.done();
}

exports.testEqualsQuotes = function(test) {

	function likeBlank(v) { test.ok(v == ""); test.ok(!(v != "")); }
	function likeText(v)  { test.ok(v != ""); test.ok(!(v == "")); }

	likeText(undefined);//undefined and null
	likeText(null);

	likeBlank(false);//boolean values
	likeText(true);

	likeBlank(0);//numbers
	likeText(1);

	likeBlank([]);//empty objects
	likeText({});
	likeBlank(new Buffer(0));//platform object
	likeText(new Buffer(1));

	likeText(function(){});//function
	likeText(console.log);

	likeBlank("");//strings
	likeText("a");

	test.done();
}

exports.testIsBlank = function(test) {

	test.ok(is("a"));//standard use
	test.ok(blank(""));

	//throws for non string
	try { is(null);             test.fail(); } catch (e) { test.ok(e == "type"); }
	try { is(1);                test.fail(); } catch (e) { test.ok(e == "type"); }
	try { blank(false);         test.fail(); } catch (e) { test.ok(e == "type"); }
	try { blank(new Buffer(0)); test.fail(); } catch (e) { test.ok(e == "type"); }

	test.done();
}

exports.testLengthSize = function(test) {

	var s;

	s = "a";//ascii
	test.ok(s.length == 1);
	test.ok(size(s) == 1);

	s = "ö";//rock dots
	test.ok(s.length == 1);
	test.ok(size(s) == 2);//two bytes
	test.ok(Data(s).base16() == "c3b6");

	s = "خ";//arabic ha
	test.ok(s.length == 1);
	test.ok(size(s) == 2);//two bytes

	s = "の";//hiragana no
	test.ok(s.length == 1);
	test.ok(size(s) == 3);//three bytes
	test.ok(Data(s).base16() == "e381ae");

	// The number of characters in string s is s.length
	// MDN warns: This property returns the number of code units in the string. UTF-16, the string format used by JavaScript, uses a single 16-bit code unit to represent the most common characters, but needs to use two code units for less commonly-used characters, so it's possible for the value returned by length to not match the actual number of characters in the string.
	//TODO write a test that demonstrates how s.length fails, then a function that corrects it

	test.done();
}

exports.testFirst = function(test) {

	var s = "abc";
	test.ok(first(s) == "a");
	test.ok(get(s, 0) == "a");
	test.ok(get(s) == "a");//you can also just omit the 0

	test.done();
}

exports.testLengthGet = function(test) {

	var s;
	s = "abc";
	test.ok(s.length == 3);
	test.ok(get(s, 0) == "a");
	test.ok(get(s, 1) == "b");
	test.ok(get(s, 2) == "c");
	try { get(s, -1); test.fail(); } catch (e) { test.ok(e == "bounds"); }
	try { get(s, 3);  test.fail(); } catch (e) { test.ok(e == "bounds"); }

	s = "一二三";
	test.ok(s.length == 3);
	test.ok(get(s, 0) == "一");
	test.ok(get(s, 1) == "二");
	test.ok(get(s, 2) == "三");
	try { get(s, -1); test.fail(); } catch (e) { test.ok(e == "bounds"); }
	try { get(s, 3);  test.fail(); } catch (e) { test.ok(e == "bounds"); }

	s = "中文 español English हिन्दी العربية português বাংলা русский 日本語 ਪੰਜਾਬੀ";//international string literal
	s64 = "5Lit5paHIGVzcGHDsW9sIEVuZ2xpc2gg4KS54KS/4KSo4KWN4KSm4KWAINin2YTYudix2KjZitipIHBvcnR1Z3XDqnMg4Kas4Ka+4KaC4Kay4Ka+INGA0YPRgdGB0LrQuNC5IOaXpeacrOiqniDgqKrgqbDgqJzgqL7gqKzgqYA=";//same text as utf8 bytes encoded as base64
	test.ok(s == base64(s64).toString());//turn data into text and compare
	test.ok(Data(s).same(base64(s64)));//turn text into data and compare

	test.ok(s.length == 68);
	test.ok(get(s, 0) == "中");
	test.ok(get(s, 1) == "文");
	test.ok(get(s, 41) == "ê");
	test.ok(get(s, 66) == "ਬ");
	test.ok(get(s, 67) == "ੀ");

	s = "español 中文 বাংলা português";
	test.ok(s.length == 26);
	test.ok(get(s, 0) == "e");
	test.ok(get(s, 4) == "ñ");

	test.ok(get(s, 8) == "中");
	test.ok(get(s, 9) == "文");

	test.ok(get(s, 11) == "ব");//the closing quotes may not line up vertically, because a fixed width font isn't fixed width for international characters
	test.ok(get(s, 12) == "া");
	test.ok(get(s, 13) == "ং");
	test.ok(get(s, 14) == "ল");
	test.ok(get(s, 15) == "া");

	test.ok(get(s, 24) == "ê");

	test.done();
}

exports.testStartEndBeyondChop = function(test) {

	var s = "abcdefgh";
	test.ok( start(s, 3) == "abc");
	test.ok(   end(s, 3) ==      "fgh");
	test.ok(beyond(s, 3) ==    "defgh");
	test.ok(  chop(s, 3) == "abcde");

	test.done();
}

exports.testClip = function(test) {

	var s = "abcdefgh";
	test.ok(clip(s, 1, 2) == "bc");//middle
	test.ok(clip(s, 0, 2) == "ab");//start
	test.ok(clip(s, 6, 2) == "gh");//end
	test.ok(clip(s, 0, 8) == "abcdefgh");//everything
	test.ok(clip(s, 0, 0) == "");//nothing start
	test.ok(clip(s, 8, 0) == "");//nothing end
	test.ok(clip(s, 4, 0) == "");//nothing middle

	test.ok(typeof clip(s, 0, 0) === "string");//make sure nothing gives us ""

	try { clip(s, -1, 1); test.fail(); } catch (e) { test.ok(e == "bounds"); }//before start
	try { clip(s, 8, 1); test.fail(); } catch (e) { test.ok(e == "bounds"); }//beyond end

	try { clip(s, -1, 0); test.fail(); } catch (e) { test.ok(e == "bounds"); }//nothing before start
	try { clip(s, 9, 0); test.fail(); } catch (e) { test.ok(e == "bounds"); }//nothing beyond end

	test.done();
}








exports.testSearch = function(test) {

	test.ok(search("abcd", "bc", true, true, true) == 1);

	test.done();
}

//c find
// Takes text r and t, and direction and matching
// Finds in r the first or last instance of t
// Returns the zero based index of t in r, or -1 if not found or if r or t are blank




exports.testUpperLower = function(test) {

	test.ok(upper("a") == "A");//very simple use
	test.ok(lower("A") == "a");

	//try with international characters



	test.done();
}







/*

length, size
js length

get, code
js charAt
js charCodeAt

make
c make
j add
js concat

upper, lower
c upper, lower

c number
j isLetter
j isNumber

is, blank
c is, isblank
j isBlank, is

c same, compare
j same, sameCase
js localeCompare

c starts, trails, has, find
j starts, startsCase, ends, endsCase
j has, hasCase
j findEither, find, findCase, last, lastCase, search
js contains
js startsWith, endsWith
js indexOf, lastIndexOf

c parse

c before, after, split
j before, after, beforeLast, afterLast, split, splitCase, splitLast, splitLastCase, split

c replace
j replace

c clip
j clip, start, end, after, chop

c on, off

c trim
j trim

c words
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






js match
js quote
js replace
js search
js slice
js split
js substr
js substring
js toLocaleLowerCase
js toLocaleUpperCase
js toLowerCase
js toSource
js toString
js toUpperCase
js trim
js trimLeft
js trimRight
js valueOf
js String.fromCharCode



*/




var code = text.code;
exports.testCode = function(test) {

	test.ok(code("A") == 65);//you can omit i to get the first character

	var s = "\0\r\n\x0d\x0a\t\"";//control characters
	test.ok(s.length == 7);
	test.ok(code(s, 0) == 0);//null
	test.ok(code(s, 1) == 0x0d);//r
	test.ok(code(s, 2) == 0x0a);//n
	test.ok(code(s, 3) == 0x0d);//r
	test.ok(code(s, 4) == 0x0a);//n
	test.ok(code(s, 5) == 9);//tab
	test.ok(code(s, 6) == 34);//quote

	s = "09AZaz";//letters and numbers
	test.ok(code(s, 0) == 48);
	test.ok(code(s, 1) == 57);
	test.ok(code(s, 2) == 65);
	test.ok(code(s, 3) == 90);
	test.ok(code(s, 4) == 97);
	test.ok(code(s, 5) == 122);

	s = " !.^_";//punctuation
	test.ok(code(s, 0) == 32);
	test.ok(code(s, 1) == 33);
	test.ok(code(s, 2) == 46);
	test.ok(code(s, 3) == 94);
	test.ok(code(s, 4) == 95);

	s = "español";//europe
	test.ok(s.length == 7);
	test.ok(code(s, 0) == 101);
	test.ok(code(s, 4) == 241);//beyond the ascii table
	test.ok(code(s, 6) == 108);

	s = "中文";//asia
	test.ok(s.length == 2);
	test.ok(code(s, 0) == 20013);//tens of thousands
	test.ok(code(s, 1) == 25991);

	s = "مرحبا";//arabic
	test.ok(s.length == 5);
	test.ok(code(s, 0) == 1605);//just thousands
	test.ok(code(s, 1) == 1585);
	test.ok(code(s, 2) == 1581);
	test.ok(code(s, 3) == 1576);
	test.ok(code(s, 4) == 1575);

	test.done();
}







