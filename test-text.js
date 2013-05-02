

var log = console.log;

var data = require("./data");
var Data = data.Data;
var base64 = data.base64;

var text = require("./text");













var make = text.make;
var is = text.is;
var blank = text.blank;

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
	test.ok(Data(s).size() == 1);

	s = "ö";//umlaut
	test.ok(s.length == 1);
	test.ok(Data(s).size() == 2);//two bytes
	test.ok(Data(s).base16() == "c3b6");

	s = "خ";//arabic ha
	test.ok(s.length == 1);
	test.ok(Data(s).size() == 2);//two bytes

	s = "の";//hiragana no
	test.ok(s.length == 1);
	test.ok(Data(s).size() == 3);//three bytes
	test.ok(Data(s).base16() == "e381ae");

	// The number of characters in string s is s.length
	// MDN warns: This property returns the number of code units in the string. UTF-16, the string format used by JavaScript, uses a single 16-bit code unit to represent the most common characters, but needs to use two code units for less commonly-used characters, so it's possible for the value returned by length to not match the actual number of characters in the string.
	//TODO write a test that demonstrates how s.length fails, then a function that corrects it

	test.done();
}







exports.testFirst = function(test) {

	var s = "abc";
	test.ok(s.first() == "a");
	test.ok(s.get(0) == "a");
	test.ok(s.get() == "a");//you can also just omit the 0

	test.done();
}

exports.testLengthGet = function(test) {

	var s;
	s = "abc";
	test.ok(s.length == 3);
	test.ok(s.get(0) == "a");
	test.ok(s.get(1) == "b");
	test.ok(s.get(2) == "c");
	try { s.get(-1); test.fail(); } catch (e) { test.ok(e == "bounds"); }
	try { s.get(3);  test.fail(); } catch (e) { test.ok(e == "bounds"); }

	s = "一二三";
	test.ok(s.length == 3);
	test.ok(s.get(0) == "一");
	test.ok(s.get(1) == "二");
	test.ok(s.get(2) == "三");
	try { s.get(-1); test.fail(); } catch (e) { test.ok(e == "bounds"); }
	try { s.get(3);  test.fail(); } catch (e) { test.ok(e == "bounds"); }

	s = "中文 español English हिन्दी العربية português বাংলা русский 日本語 ਪੰਜਾਬੀ";//international string literal
	s64 = "5Lit5paHIGVzcGHDsW9sIEVuZ2xpc2gg4KS54KS/4KSo4KWN4KSm4KWAINin2YTYudix2KjZitipIHBvcnR1Z3XDqnMg4Kas4Ka+4KaC4Kay4Ka+INGA0YPRgdGB0LrQuNC5IOaXpeacrOiqniDgqKrgqbDgqJzgqL7gqKzgqYA=";//same text as utf8 bytes encoded as base64
	test.ok(s == base64(s64).toString());//turn data into text and compare
	test.ok(Data(s).same(base64(s64)));//turn text into data and compare

	test.ok(s.length == 68);
	test.ok(s.get(0) == "中");
	test.ok(s.get(1) == "文");
	test.ok(s.get(41) == "ê");
	test.ok(s.get(66) == "ਬ");
	test.ok(s.get(67) == "ੀ");

	s = "español 中文 বাংলা português";
	test.ok(s.length == 26);
	test.ok(s.get(0) == "e");
	test.ok(s.get(4) == "ñ");

	test.ok(s.get(8) == "中");
	test.ok(s.get(9) == "文");

	test.ok(s.get(11) == "ব");//the closing quotes may not line up vertically, because a fixed width font isn't fixed width for international characters
	test.ok(s.get(12) == "া");
	test.ok(s.get(13) == "ং");
	test.ok(s.get(14) == "ল");
	test.ok(s.get(15) == "া");

	test.ok(s.get(24) == "ê");

	test.done();
}

exports.testStartEndBeyondChop = function(test) {

	var s = "abcdefgh";
	test.ok(s.start(3)  == "abc");
	test.ok(s.end(3)    ==      "fgh");
	test.ok(s.beyond(3) ==    "defgh");
	test.ok(s.chop(3)   == "abcde");

	test.done();
}

exports.testClip = function(test) {

	var s = "abcdefgh";
	test.ok(s.clip(1, 2) == "bc");//middle
	test.ok(s.clip(0, 2) == "ab");//start
	test.ok(s.clip(6, 2) == "gh");//end
	test.ok(s.clip(0, 8) == "abcdefgh");//everything
	test.ok(s.clip(0, 0) == "");//nothing start
	test.ok(s.clip(8, 0) == "");//nothing end
	test.ok(s.clip(4, 0) == "");//nothing middle

	test.ok(typeof s.clip(0, 0) === "string");//make sure nothing gives us ""

	try { s.clip(-1, 1); test.fail(); } catch (e) { test.ok(e == "bounds"); }//before start
	try { s.clip(8, 1); test.fail(); } catch (e) { test.ok(e == "bounds"); }//beyond end

	try { s.clip(-1, 0); test.fail(); } catch (e) { test.ok(e == "bounds"); }//nothing before start
	try { s.clip(9, 0); test.fail(); } catch (e) { test.ok(e == "bounds"); }//nothing beyond end

	test.done();
}






var same = text.same;
var match = text.match;

exports.testSamePlatformCustom = function(test) {

	function run(answerMatch, answerCase, s1, s2) {

		test.ok(answerMatch == match(s1, s2));
		test.ok(answerCase == same(s1, s2));
		test.ok(answerCase == (s1 == s2));

		test.ok(answerMatch == match(s2, s1));//flip inputs
		test.ok(answerCase == same(s2, s1));
		test.ok(answerCase == (s2 == s1));
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

	test.ok("abcd".starts("ab"));
	test.ok("abcd".ends("cd"));
	test.ok("abcd".has("bc"));

	test.done();
}

exports.testFindPlatformCustom = function(test) {

	//no tag
	try { "abcd".find(""); test.fail(); } catch (e) { test.ok(e == "argument"); }

	function both(found, s, tag, forward, match) {
		test.ok(found == _findPlatform(s, tag, forward, true, match));
		test.ok(found == _findCustom(s, tag, forward, true, match));
	}

	//basic use
	test.ok(0  == "abcd".find(  "ab"));//first
	test.ok(2  == "abcd".find(    "cd"));//last
	test.ok(1  == "abcd".find(   "bc"));//middle
	test.ok(-1 == "abcd".find("YZ"));//not found

	//tag longer
	test.ok(-1 == "abcd".find(  "abcdef"));//tag matches but longer beyond end
	test.ok(-1 == "abcd".find("YZabcd"));//tag matches but longer before start
	test.ok(-1 == "abcd".find(  "abcE"));//tag matches at start

	//forward and reverse
	test.ok( 1 == " abc ab bcde abcd ".find("ab"));
	test.ok(13 == " abc ab bcde abcd ".last("ab"));
	test.ok( 2 == " abc ab bcde abcd ".find("bc"));
	test.ok(14 == " abc ab bcde abcd ".last("bc"));
	test.ok( 9 == " abc ab bcde abcd ".find("cd"));
	test.ok(15 == " abc ab bcde abcd ".last("cd"));
	test.ok(10 == " abc ab bcde abcd ".find("de"));
	test.ok(10 == " abc ab bcde abcd ".last("de"));

	//matching cases
	test.ok(0 == "abcd".findMatch("AB"));//first
	test.ok(2 == "abcd".findMatch(  "cD"));//last
	test.ok(1 == "abcd".findMatch( "Bc"));//middle

	//international
	var s = "español 中文 বাংলা português";
	test.ok( 0 == s.find("español"));
	test.ok( 8 == s.find("中文"));
	test.ok(11 == s.find("বাংলা"));
	test.ok(17 == s.find("português"));

	//international matching cases
	test.ok(-1 == s.find(     "ESPAÑOL"));
	test.ok( 0 == s.findMatch("ESPAÑOL"));
	test.ok(-1 == s.find(     "PORTUGUÊS"));
	test.ok(17 == s.findMatch("PORTUGUÊS"));

	//international forward and reverse
	s = " X বাংলা X বাংলা X ";
	test.ok( 3 == s.find("বাংলা"));
	test.ok(11 == s.last("বাংলা"));

	test.done();
}






exports.testCut = function(test) {

	var s = "apple<tag>banana<tag>carrot";

	//before and after
	test.ok(s.before(    "<tag>") == "apple");
	test.ok(s.after(     "<tag>") ==           "banana<tag>carrot");
	test.ok(s.beforeLast("<tag>") == "apple<tag>banana");
	test.ok(s.afterLast( "<tag>") ==                      "carrot");

	//cut
	var c = s.cutLastMatch("<TAG>");//tag uppercase, matching on
	test.ok(c.found);
	test.ok(c.before == "apple<tag>banana");
	test.ok(c.tag    == "<tag>");//tag lowercase from s
	test.ok(c.after  == "carrot");

	s = "Sample text";

	//not found
	test.ok(s.before(         "E") == "Sample text");//not found, all before
	test.ok(s.after(          "E") == "");
	test.ok(s.beforeLast(     "E") == "Sample text");
	test.ok(s.afterLast(      "E") == "");

	//case matching
	test.ok(s.beforeMatch(    "E") == "Sampl");
	test.ok(s.afterMatch(     "E") ==       " text");
	test.ok(s.beforeLastMatch("E") == "Sample t");
	test.ok(s.afterLastMatch( "E") ==          "xt");

	test.done();
}










exports.testSwap = function(test) {

	var s = "Abacore tuna is absolutely the best.";
	test.ok(s.swapMatch("ab", "Ba") == "Baacore tuna is Basolutely the best.");

	s = "Yesterday. Bill said it. That's when Bill was in here.";
	test.ok(s.swapMatch("bill", "REDACTED") == "Yesterday. REDACTED said it. That's when REDACTED was in here.");

	test.ok("aaaaa".swap("aa", "bb") == "bbbba");//replaced 2 whole instances
	test.ok("aaaaa".swap("aa", "bbb") == "bbbbbba");

	test.done();
}









exports.testUpperLower = function(test) {

	//use
	test.ok("A".lower() == "a");
	test.ok("a".upper() == "A");
	test.ok("Shhhh. Whisper, please.".lower() == "shhhh. whisper, please.");
	test.ok("Do you want to buy a duck?".upper() == "DO YOU WANT TO BUY A DUCK?");

	//greek alphabet
	var greekLower = "αβγδεζηθικλμνξοπρστυφχψω";
	var greekUpper = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
	test.ok(greekLower.upper() == greekUpper);
	test.ok(greekUpper.lower() == greekLower);

	test.done();
}







exports.testCode = function(test) {

	test.ok("A".code() == 65);//you can omit i to get the first character

	var s = "\0\r\n\x0d\x0a\t\"";//control characters
	test.ok(s.length == 7);
	test.ok(s.code(0) == 0);//null
	test.ok(s.code(1) == 0x0d);//r
	test.ok(s.code(2) == 0x0a);//n
	test.ok(s.code(3) == 0x0d);//r
	test.ok(s.code(4) == 0x0a);//n
	test.ok(s.code(5) == 9);//tab
	test.ok(s.code(6) == 34);//quote

	s = "09AZaz";//letters and numbers
	test.ok(s.code(0) == 48);
	test.ok(s.code(1) == 57);
	test.ok(s.code(2) == 65);
	test.ok(s.code(3) == 90);
	test.ok(s.code(4) == 97);
	test.ok(s.code(5) == 122);

	s = " !.^_";//punctuation
	test.ok(s.code(0) == 32);
	test.ok(s.code(1) == 33);
	test.ok(s.code(2) == 46);
	test.ok(s.code(3) == 94);
	test.ok(s.code(4) == 95);

	s = "español";//europe
	test.ok(s.length == 7);
	test.ok(s.code(0) == 101);
	test.ok(s.code(4) == 241);//beyond the ascii table
	test.ok(s.code(6) == 108);

	s = "中文";//asia
	test.ok(s.length == 2);
	test.ok(s.code(0) == 20013);//tens of thousands
	test.ok(s.code(1) == 25991);

	s = "مرحبا";//arabic
	test.ok(s.length == 5);
	test.ok(s.code(0) == 1605);//just thousands
	test.ok(s.code(1) == 1585);
	test.ok(s.code(2) == 1581);
	test.ok(s.code(3) == 1576);
	test.ok(s.code(4) == 1575);

	test.done();
}

exports.testRange = function(test) {

	test.ok("a".range("a", "z"));//first
	test.ok("z".range("a", "z"));//last
	test.ok("k".range("a", "z"));//middle
	test.ok("5".range("5", "5"));//only

	test.ok(!"0".range("a", "z"));//outside
	test.ok(!"A".range("a", "z"));

	test.done();
}

exports.testIsLetterIsNumber = function(test) {

	test.ok("a".isLetter());//lower
	test.ok("b".isLetter());
	test.ok("z".isLetter());

	test.ok("A".isLetter());//upper
	test.ok("K".isLetter());
	test.ok("Z".isLetter());

	test.ok("0".isNumber());//number
	test.ok("2".isNumber());
	test.ok("9".isNumber());

	//blank throws bounds
	try { "".isLetter(); test.fail(); } catch (e) { test.ok(e == "bounds"); }

	function neither(c) {
		test.ok(!c.isLetter());
		test.ok(!c.isNumber());
	}

	neither(" ");
	neither(":");
	neither("/");
	neither("!");
	neither("\0");
	neither("\r");

	test.done();
}






exports.testEither = function(test) {

	var s = "sample abc text def and more";

	test.ok(s.either("abc", "xyz") == 7);//first found
	test.ok(s.either("xyz", "abc") == 7);//second found

	test.ok(s.either("abc", "def") == 7);//both found
	test.ok(s.either("aBC", "def") == 16);//first case mismatch
	test.ok(s.eitherMatch("aBC", "def") == 7);//matching cases

	test.done();
}








exports.testOff = function(test) {

	//on start and end
	test.ok("/folder".onStart("/") == "/folder");//already there
	test.ok("folder".onStart("/") == "/folder");//added it

	test.ok("folder/".onEnd("/") == "folder/");//already there
	test.ok("folder".onEnd("/") == "folder/");//added it

	test.ok("folder///".onEnd("//") == "folder///");//already there
	test.ok("folderABC".onEnd("AB") == "folderABCAB");//added it

	//off start and end
	test.ok("/folder".offStart("/") == "folder");//removed it
	test.ok("folder".offStart("/") == "folder");//didn't need to
	test.ok("///folder".offStart("/") == "folder");//removed multiple

	test.ok("folder/".offEnd("/") == "folder");//removed it
	test.ok("folder".offEnd("/") == "folder");//didn't need to
	test.ok("folder///".offEnd("/") == "folder");//removed multiple

	//off
	var s = " --_ folder-_-- -";
	test.ok(s.off(" ") == "--_ folder-_-- -");
	test.ok(s.off("-") == " --_ folder-_-- ");
	test.ok(s.off(" ", "-") == "_ folder-_");
	test.ok(s.off(" ", "-", "_") == "folder");

	test.done();
}











var numerals = text.numerals;
var numerals16 = text.numerals16;

exports.testNumberNumerals = function(test) {

	function cycle(n, s10, s16) {
		test.ok(numerals(n) === s10);//number to text
		test.ok(numerals16(n) === s16);

		test.ok(s10.number() === n);//text to number
		test.ok(s16.number16() === n);
	}

	//confirm we can turn numbers into text and back again
	cycle(0, "0", "0");//zero and one
	cycle(1, "1", "1");
	cycle(10, "10", "a");//ten, note how base16 output is lower case
	cycle(789456123, "789456123", "2f0e24fb");
	cycle(-5, "-5", "-5");//negative
	cycle(-11, "-11", "-b");
	cycle(0xff, "255", "ff");//0x number literal, note how output text doesn't include the "0x" prefix
	cycle(-0x2f0e24fb, "-789456123", "-2f0e24fb");

	test.ok(numerals(123.456) === "123.456");//decimal
	test.ok(numerals(-123.456) === "-123.456");

	function bad(s) {
		try { s.number(); test.fail(); } catch (e) { test.ok(e == "data"); }
		try { s.number16(); test.fail(); } catch (e) { test.ok(e == "data"); }
	}

	//make sure text that isn't a perfect number can't become one
	bad("");//blank
	bad(" ");//space
	bad("potato");//a word
	bad("-");//punctuation
	bad(".");
	bad("k");

	bad("05");//leading zero

	bad(" 5");//spaces
	bad("5 ");
	bad(" 5 ");
	bad("5 6");

	//allow uppercase base16 as input, even though output is lowercase
	test.ok("A".number16() == 10);

	test.done();
}









exports.testFill = function(test) {
	
	test.ok("".fill() == "");//blank
	test.ok("hello".fill() == "hello");//no tags

	test.ok("#ab".fill(7) == "7ab");//start
	test.ok("a#b".fill(7) == "a7b");//middle
	test.ok("ab#".fill(7) == "ab7");//end

	test.ok("###".fill("a", "b", "c")      == "abc");//multiple
	test.ok("###".fill("a", "b", "c", "d") == "abcd");//too many
	test.ok("###".fill("a", "b")           == "ab#");//too few

	test.done();
}








exports.testWiden = function(test) {

	test.ok("1".widen(4) == "0001");//add leading zeros
	test.ok("12345".widen(4) == "12345");//already longer than that
	test.ok("1".widen(4, " ") == "   1");//spaces instead

	test.done();
}










exports.testCommas = function(test) {

	test.ok("".commas() == "");
	test.ok("1".commas() == "1");
	test.ok("12".commas() == "12");
	test.ok("123".commas() == "123");
	test.ok("1234".commas() == "1,234");
	test.ok("12345".commas() == "12,345");
	test.ok("123456".commas() == "123,456");
	test.ok("1234567".commas() == "1,234,567");

	test.ok("1234567".commas(".") == "1.234.567");

	test.done();
}












exports.testRipProtect = function(test) {

	//have a test where you had split a regular expression and watch it throw



	test.done();
}

exports.testRipPatterns = function(test) {

	function view(a) {
		var s = "";
		for (var i = 0; i < a.length; i++)
			s += "<" + a[i] + ">";
		return s;
	}
	function check(s, v) { test.ok(view(s.rip(",")) == v); }

	check("", "<>");//empty
	check(",", "<><>");
	check(",,", "<><><>");
	check(",,,", "<><><><>");

	check("a", "<a>");//one
	check(",a", "<><a>");
	check("a,", "<a><>");
	check(",a,", "<><a><>");

	check("a,b", "<a><b>");//two
	check(",a,b", "<><a><b>");
	check("a,b,", "<a><b><>");
	check(",a,b,", "<><a><b><>");

	check("a", "<a>");//double
	check(",,a", "<><><a>");
	check("a,,", "<a><><>");
	check(",,a,,", "<><><a><><>");

	check("a,,b", "<a><><b>");//double two
	check(",,a,,b", "<><><a><><b>");
	check("a,,b,,", "<a><><b><><>");
	check(",,a,,b,,", "<><><a><><b><><>");

	check(",a,,b", "<><a><><b>");//single and double
	check(",,a,b", "<><><a><b>");
	check("a,b,,", "<a><b><><>");
	check("a,,b,", "<a><><b><>");

	test.done();
}

exports.testRipFeatures = function(test) {

	//turn on trimItems and skipBlankItems



	test.done();
}

exports.testLines = function(test) {



	test.done();
}

exports.testWords = function(test) {



	test.done();
}








//what you should do with trim is just use it as in javascript
//and write a test here that demonstrates it correctly does what you want it to do
//it may do even more, but that's fine to leave unknown






























































