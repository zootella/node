

var log = console.log;

var data = require("./data");
var Data = data.Data;
var base64 = data.base64;


//try using utf8 right in the source code


// How many bytes the given text take up encoded into UTF-8
function size(s) {
	return Data(s).size();
}
exports.testSize = function(test) {

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

	test.done();
}

// Get the character a distance i in characters into the string s
function get(s, i) {
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charAt(i);
}
exports.testGet = function(test) {

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

// The Unicode number value of the character a distance i characters into s
// Also gets ASCII codes, code("A") is 65
// You can omit i to get the code of the first character
function code(s, i) {
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charCodeAt(i);
}
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

// Concatenate all the given strings together
// For instance, make("a", "b", "c") is "abc"
function make() {
	var s = "";
	for (var i = 0; i < arguments.length; i++)
		s += arguments[i];
	return s;
}
//TODO use TextBay instead of the loop above
exports.testMake = function(test) {

	test.ok(make("a", "b", "cd") == "abcd");
	test.ok(make("aaa", "", "bbb") == "aaabbb");//middle string is blank

	test.done();
}





//maybe you should also make your own StringBuffer in here
//and then use it in encode, rather than the weird thing you have there
//call it TextBay, for instance, and have an add() method, and say()



//TODO add tests to confirm you can find international characters in text, split on them, and so on



//here's a weird idea
//what if you replaced characters illegal for windows filenames with unicode characters that look similar



//go to and from data
//go to and from number, base 10 and base 16

//move Encode from data to text, but leave them as separate functions





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








