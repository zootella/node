

var log = console.log;

var data = require("./data");
var Data = data.Data;
var base64 = data.base64;


//try using utf8 right in the source code

exports.testEurope = function(test) {

	var s = "ö";//rock dots
	var d = Data(s);

	test.ok(s.length == 1);
	test.ok(d.size() == 2);
	test.ok(d.base16() == "c3b6");

	test.done();
}

exports.testAsia = function(test) {

	var s = "の";//hiragana no
	var d = Data(s);

	test.ok(s.length == 1);
	test.ok(d.size() == 3);
	test.ok(d.base16() == "e381ae");

	test.done();
}

//TODO add tests to confirm you can find international characters in text, split on them, and so on


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


//merge this with ascii(), call it code(s, i), probably

function ascii(c) { return c.charCodeAt(0); } // Turn "A" into 65
//see if you can just leave out i to get the first character, have a test for that
//you probably want to have if (!i) i = 0;


function getUnicodeValue(s, i) {
	if (i < 0 || i > s.length - 1) throw "bounds";
	return s.charCodeAt(i);
}

exports.testUnicodeValue = function(test) {

	test.done();
}

function make() {
	var s = "";
	for (var i = 0; i < arguments.length; i++)
		s += arguments[i];
	return s;
}

exports.testMake = function(test) {

	test.ok(make("a", "b", "cd") == "abcd");

	test.done();
}




//maybe you should also make your own StringBuffer in here
//and then use it in encode, rather than the weird thing you have there
//call it TextBay, for instance, and have an add() method, and say()







