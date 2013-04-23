

var log = console.log;

var data = require("./data");
var Data = data.Data;
var base64 = data.base64;

var text = require("./text");









//   ____  _        _             
//  / ___|| |_ _ __(_)_ __   __ _ 
//  \___ \| __| '__| | '_ \ / _` |
//   ___) | |_| |  | | | | | (_| |
//  |____/ \__|_|  |_|_| |_|\__, |
//                          |___/ 

var make = text.make;
var is = text.is;
var blank = text.blank;
var size = text.size;

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

	s = "ö";//umlaut
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

var first = text.first;
var get = text.get;
var start = text.start;
var end = text.end;
var beyond = text.beyond;
var chop = text.chop;
var clip = text.clip;

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

var same = text.same;
var _samePlatform = text._samePlatform;
var _sameCustom = text._sameCustom;
var match = text.match;
var _matchPlatform = text._matchPlatform;
var _matchCustom = text._matchCustom;

var starts = text.starts;
var startsMatch = text.startsMatch;
var ends = text.ends;
var endsMatch = text.endsMatch;
var has = text.has;
var hasMatch = text.hasMatch;

var find = text.find;
var findMatch = text.findMatch;
var last = text.last;
var lastMatch = text.lastMatch;

var _find = text._find;
var _findPlatform = text._findPlatform;
var _findCustom = text._findCustom;

exports.testSamePlatformCustom = function(test) {

	function run(answerMatch, answerCase, s1, s2) {

		test.ok(answerMatch == _matchPlatform(s1, s2));
		test.ok(answerMatch == _matchCustom(s1, s2));
		test.ok(answerCase == _samePlatform(s1, s2));
		test.ok(answerCase == _sameCustom(s1, s2));

		test.ok(answerMatch == _matchPlatform(s2, s1));//flip inputs
		test.ok(answerMatch == _matchCustom(s2, s1));
		test.ok(answerCase == _samePlatform(s2, s1));
		test.ok(answerCase == _sameCustom(s2, s1));
	}

	//same
	run(true, true, "", "");//blank
	run(true, true, "abc", "abc");//same case

	//different
	run(false, false, "", "a");//blank
	run(false, false, "abc", "yz");//different
	run(false, false, "abc", "ab");//contained

	//different cases
	run(true, false, "Abc", "abc");
	run(true, false, "Different Cases", "different cases");

	//international
	run(true, true, "中文", "中文");
	run(true, true, "বাংলা", "বাংলা");
	run(true, false, "español", "ESPAÑOL");
	run(true, false, "português", "PORTUGUÊS");

	test.done();
}

exports.testStartsEndsHas = function(test) {

	test.ok(starts("abcd", "ab"));
	test.ok(ends("abcd", "cd"));
	test.ok(has("abcd", "bc"));

	test.done();
}

exports.testFindPlatformCustom = function(test) {

	//no tag
	try { _findPlatform("abcd", "", true, true, false); test.fail(); } catch (e) { test.ok(e == "argument"); }
	try {   _findCustom("abcd", "", true, true, false); test.fail(); } catch (e) { test.ok(e == "argument"); }

	function both(found, s, tag, forward, match) {
		test.ok(found == _findPlatform(s, tag, forward, true, match));
		test.ok(found == _findCustom(s, tag, forward, true, match));
	}

	//basic use
	both(0,  "abcd",   "ab",     true, false);//first
	both(2,  "abcd",     "cd",   true, false);//last
	both(1,  "abcd",    "bc",    true, false);//middle
	both(-1, "abcd", "YZ",       true, false);//not found

	//tag longer
	both(-1, "abcd",   "abcdef", true, false);//tag matches but longer beyond end
	both(-1, "abcd", "YZabcd",   true, false);//tag matches but longer before start
	both(-1, "abcd",   "abcE",   true, false);//tag matches at start

	//forward and reverse
	both(1,  " abc ab bcde abcd ", "ab", true,  false);
	both(13, " abc ab bcde abcd ", "ab", false, false);
	both(2,  " abc ab bcde abcd ", "bc", true,  false);
	both(14, " abc ab bcde abcd ", "bc", false, false);
	both(9,  " abc ab bcde abcd ", "cd", true,  false);
	both(15, " abc ab bcde abcd ", "cd", false, false);
	both(10, " abc ab bcde abcd ", "de", true,  false);
	both(10, " abc ab bcde abcd ", "de", false, false);

	//matching cases
	both(0,  "abcd",   "AB",     true, true);//first
	both(2,  "abcd",     "cD",   true, true);//last
	both(1,  "abcd",    "Bc",    true, true);//middle

	//international
	var s = "español 中文 বাংলা português";
	both(0, s, "español", true, false);
	both(8, s, "中文", true, false);
	both(11, s, "বাংলা", true, false);
	both(17, s, "português", true, false);

	//international matching cases
	both(-1, s, "ESPAÑOL", true, false);
	both(0,  s, "ESPAÑOL", true, true);
	both(-1, s, "PORTUGUÊS", true, false);
	both(17, s, "PORTUGUÊS", true, true);

	//international forward and reverse
	s = " X বাংলা X বাংলা X ";
	both(3,  s, "বাংলা", true,  false);
	both(11, s, "বাংলা", false, false);

	test.done();
}

var before = text.before;
var beforeMatch = text.beforeMatch;
var beforeLast = text.beforeLast;
var beforeLastMatch = text.beforeLastMatch;

var after = text.after;
var afterMatch = text.afterMatch;
var afterLast = text.afterLast;
var afterLastMatch = text.afterLastMatch;

var cut = text.cut;
var cutMatch = text.cutMatch;
var cutLast = text.cutLast;
var cutLastMatch = text.cutLastMatch;

var _cut = text._cut;

exports.testCut = function(test) {

	var s = "apple<tag>banana<tag>carrot";

	//before and after
	test.ok(before(s,     "<tag>") == "apple");
	test.ok(after(s,      "<tag>") ==           "banana<tag>carrot");
	test.ok(beforeLast(s, "<tag>") == "apple<tag>banana");
	test.ok(afterLast(s,  "<tag>") ==                      "carrot");

	//cut
	var c = cutLastMatch(s, "<TAG>");//tag uppercase, matching on
	test.ok(c.found);
	test.ok(c.before == "apple<tag>banana");
	test.ok(c.tag    == "<tag>");//tag lowercase from s
	test.ok(c.after  == "carrot");

	s = "Sample text";

	//not found
	test.ok(before(s,          "E") == "Sample text");//not found, all before
	test.ok(after(s,           "E") == "");
	test.ok(beforeLast(s,      "E") == "Sample text");
	test.ok(afterLast(s,       "E") == "");

	//case matching
	test.ok(beforeMatch(s,     "E") == "Sampl");
	test.ok(afterMatch(s,      "E") ==       " text");
	test.ok(beforeLastMatch(s, "E") == "Sample t");
	test.ok(afterLastMatch(s,  "E") ==          "xt");

	test.done();
}










var replace = text.replace;
var replaceMatch = text.replaceMatch;

exports.testReplace = function(test) {




	test.done();
}

//write a test to see how it replaces "aaaaa" "aa" "bb", should be "bbbba", you think














var upper = text.upper;
var lower = text.lower;

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







