

var log = console.log;

var requireData = require("./data");
var Data = requireData.Data;
var Bay = requireData.Bay;
var base64 = requireData.base64;

var requireText = require("./text");

















//   _____                 
//  |_   _|   _ _ __   ___ 
//    | || | | | '_ \ / _ \
//    | || |_| | |_) |  __/
//    |_| \__, | .__/ \___|
//        |___/|_|         

var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

exports.testHasMethod = function(test) {

	test.ok(hasMethod(Data(), "base62"));//there
	test.ok(!hasMethod(Data(), "notFound"));//not found

	test.ok(!hasMethod(undefined, "name"));//not an object, returns false
	test.ok(!hasMethod(null, "name"));
	test.ok(!hasMethod(false, "name"));
	test.ok(!hasMethod(0, "name"));
	test.ok(!hasMethod("hi", "name"));

	test.done();
}

exports.testGetType = function(test) {

	//nothings
	test.ok("undefined" == getType());//nothing passed
	test.ok("undefined" == getType(undefined));
	test.ok("undefined" == getType(Data().anUndefinedMember));

	//boolean
	test.ok("boolean" == getType(false));
	test.ok("boolean" == getType(true));

	//number
	test.ok("number" == getType(0));
	test.ok("number" == getType(500));
	test.ok("number" == getType(-1.2));
	test.ok("number" == getType(Infinity));
	test.ok("number" == getType(NaN));

	//string
	test.ok("string" == getType(""));
	test.ok("string" == getType("hi"));

	//function
	test.ok("function" == getType(function(){}));
	test.ok("function" == getType(Math.sin));
	test.ok("function" == getType(isType));
	test.ok("function" == getType(Data().size));

	//javascript object
	test.ok("object" == getType(null));//null has been an object since the beginning of javascript
	test.ok("object" == getType({a:1}));//hash
	test.ok("object" == getType([1, 2, 4]));//array
	test.ok("object" == getType(/s/));//node says a regular expression literal is an object

	//platform object
	test.ok("object" == getType(new Date()));//javascript object

	//node object
	test.ok("object" == getType(new Buffer(0)));//node object
	test.ok("object" == getType(new Buffer(8)));

	//program object with type() method
	test.ok("Bay"  == getType(Bay()));
	test.ok("Data" == getType(Bay().data()));
	test.ok("Clip" == getType(Bay().data().clip()));

	//program object without that method
	function Sample() {
		function method() {}
		return { method:method }//no type() method
	}
	test.ok("object" == getType(Sample()));

	test.done();
}


























//      _                         
//     / \   _ __ _ __ __ _ _   _ 
//    / _ \ | '__| '__/ _` | | | |
//   / ___ \| |  | | | (_| | |_| |
//  /_/   \_\_|  |_|  \__,_|\__, |
//                          |___/ 

exports.testArray = function(test) {

	var a = [];
	a.add("a");//add to the end of the array
	a.add("b");
	a.add("c");
	test.ok(a.length == 3);
	test.ok(a[2] == "c");

	var o = a.remove(1);//remove b, which is a distance 1 into the array
	test.ok(a.length == 2);//that changed the length
	test.ok(a[0] == "a");
	test.ok(a[1] == "c");//and the index of items afterwards

	test.ok(o == "b");//remove returned it

	function out(a, i) {//out of bounds
		try {
			a.remove(i);
			test.fail();
		} catch (e) { test.ok(e == "bounds"); }
	}
	out(a, -1);
	out(a, 2);

	test.done();
}























//    ____ _                          _            
//   / ___| |__   __ _ _ __ __ _  ___| |_ ___ _ __ 
//  | |   | '_ \ / _` | '__/ _` |/ __| __/ _ \ '__|
//  | |___| | | | (_| | | | (_| | (__| ||  __/ |   
//   \____|_| |_|\__,_|_|  \__,_|\___|\__\___|_|   
//                                                 

var is = requireText.is;
var blank = requireText.blank;
var sortText = requireText.sortText;

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

exports.testIsSpace = function(test) {

	test.ok("".isSpace());
	test.ok(" ".isSpace());
	test.ok("\r\n".isSpace());
	test.ok(!"a".isSpace());

	test.done();
}

exports.testSort = function(test) {

	//make sure we got the sign right
	test.ok(sortText("a", "b") < 0);//negative, correct order
	test.ok(sortText("a", "a") == 0);//zero, tie
	test.ok(sortText("b", "a") > 0);//positive, reverse order

	//but what this is really good for is sorting arrays
	function run(before, sorted) {
		var a = before.rip(",");
		a.sort(sortText);
		if (sorted)
			test.ok(a + "" == sorted);
		else
			log(a + "");
	}
	run("b,c,a", "a,b,c");
	run("c,b,a", "a,b,c");
	run("a,c,b", "a,b,c");

	run("A,b,a,B", "A,B,a,b");//capitals are first in the ascii table

	run("Bäume,Baume", "Baume,Bäume");//german trees go last

	run("一,二,三", "一,三,二");//this looks wrong, but consistant
	run("二,一,三", "一,三,二");
	run("三,一,二", "一,三,二");
	run("二,三,一", "一,三,二");
	test.ok("一".code() == 0x4e00);//one is first
	test.ok("二".code() == 0x4e8c);//two is third
	test.ok("三".code() == 0x4e09);//three is second

	var greek = "α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω";//sort the greek alphabet
	run("β,γ,δ,ε,φ,ξ,ο,π,ρ,σ,α,θ,χ,ψ,ω,μ,ν,ζ,η,κ,λ,ι,τ,υ", greek);
	run("α,β,λ,δ,ε,υ,γ,φ,κ,ρ,π,ω,μ,ν,ξ,ο,ζ,η,χ,ψ,σ,τ,θ,ι", greek);
	run("θ,ι,κ,δ,ε,ω,χ,ψ,β,ξ,ο,ν,τ,υ,α,ζ,ρ,σ,γ,π,λ,η,φ,μ", greek);

	test.done();
}


















//   _   _                 _               
//  | \ | |_   _ _ __ ___ | |__   ___ _ __ 
//  |  \| | | | | '_ ` _ \| '_ \ / _ \ '__|
//  | |\  | |_| | | | | | | |_) |  __/ |   
//  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|   
//                                         

var number = requireText.number;
var number16 = requireText.number16;
var numerals = requireText.numerals;
var numerals16 = requireText.numerals16;

exports.testNumberNumerals = function(test) {

	function cycle(n, s10, s16) {
		test.ok(numerals(n) === s10);//number to text
		test.ok(numerals16(n) === s16);

		test.ok(number(s10) === n);//text to number
		test.ok(number16(s16) === n);
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
		try { number(s); test.fail(); } catch (e) { test.ok(e == "data"); }
		try { number16(s); test.fail(); } catch (e) { test.ok(e == "data"); }
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
	test.ok(number16("A") == 10);

	test.done();
}














//    ____ _ _       
//   / ___| (_)_ __  
//  | |   | | | '_ \ 
//  | |___| | | |_) |
//   \____|_|_| .__/ 
//            |_|    

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
	test.ok(s == base64(s64).text());//turn data into text and compare
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




















//   _____ _           _ 
//  |  ___(_)_ __   __| |
//  | |_  | | '_ \ / _` |
//  |  _| | | | | | (_| |
//  |_|   |_|_| |_|\__,_|
//                       

var same = requireText.same;
var match = requireText.match;

exports.testSameMatch = function(test) {

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

exports.testFindLast = function(test) {

	//no tag
	try { "abcd".find(""); test.fail(); } catch (e) { test.ok(e == "argument"); }

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

exports.testEither = function(test) {

	var s = "sample abc text def and more";

	test.ok(s.either("abc", "xyz") == 7);//first found
	test.ok(s.either("xyz", "abc") == 7);//second found

	test.ok(s.either("abc", "def") == 7);//both found
	test.ok(s.either("aBC", "def") == 16);//first case mismatch
	test.ok(s.eitherMatch("aBC", "def") == 7);//matching cases

	test.done();
}










//    ____      _   
//   / ___|   _| |_ 
//  | |  | | | | __|
//  | |__| |_| | |_ 
//   \____\__,_|\__|
//                  

exports.testBeforeAfterCut = function(test) {

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

exports.testParse = function(test) {

	test.ok("He <b>really</b> wants to go.".parse("<b>", "</b>") == "really");

	test.done();
}

















//   _____     _           
//  |_   _| __(_)_ __ ___  
//    | || '__| | '_ ` _ \ 
//    | || |  | | | | | | |
//    |_||_|  |_|_| |_| |_|
//                         

exports.testTrim = function(test) {

	test.ok("hi".trim() == "hi");
	test.ok(" hi ".trim() == "hi");//spaces
	test.ok("\rhi\r".trim() == "hi");//single newline characters
	test.ok("\nhi\n".trim() == "hi");
	test.ok("\r\nhi\r\n".trim() == "hi");//windows newlines
	test.ok("\thi\t".trim() == "hi");//tabs
	test.ok(" \t\r\nwords inside\r \n\t".trim() == "words inside");//everything

	test.ok(" hi ".trimStart() == "hi ");
	test.ok(" hi ".trimEnd()   == " hi");

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














//   ____  _       
//  |  _ \(_)_ __  
//  | |_) | | '_ \ 
//  |  _ <| | |_) |
//  |_| \_\_| .__/ 
//          |_|    

exports.testRip = function(test) {

	// Make sure rip will throw if you try to give it a regular expression
	try {
		"hello".rip(/abc/);
	} catch (e) { test.ok(e == "type"); }

	function view(a) {
		var s = "";
		for (var i = 0; i < a.length; i++)
			s += "<" + a[i] + ">";
		return s;
	}
	function check(s, v) { test.ok(view(s.rip(",")) == v); }

	//patterns

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

	//features

	test.ok(view("a , ,,b".rip(",", false, false)) == "<a >< ><><b>");
	test.ok(view("a , ,,b".rip(",", true,  false)) == "<a><><><b>");//trim items
	test.ok(view("a , ,,b".rip(",", false, true))  == "<a >< ><b>");//skip blanks
	test.ok(view("a , ,,b".rip(",", true,  true))  == "<a><b>");//both

	//words

	var s = "  somewhere here  is  my tulip";

	test.ok(view(s.ripWords(false, false)) == "<><><somewhere><here><><is><><my><tulip>");
	test.ok(view(s.ripWords(true,  false)) == "<><><somewhere><here><><is><><my><tulip>");//trim
	test.ok(view(s.ripWords(false, true))  == "<somewhere><here><is><my><tulip>");//skip
	test.ok(view(s.ripWords(true,  true))  == "<somewhere><here><is><my><tulip>");//both

	//lines

	var du = "One\nTwo\nThree";//unix
	var dw = "One\r\nTwo\r\nThree";//windows

	var d1 = "\r\nOne\r\nTwo\r\nThree";//blank line at start
	var d2 = "One\r\nTwo\r\n\r\nThree";//blank line in middle
	var d3 = "One\r\nTwo\r\nThree\r\n";//blank line at end

	var da = "<One><Two><Three>";

	test.ok(view(du.ripLines(false, false)) == da);
	test.ok(view(dw.ripLines(true,  false)) == da);//trim windows line endings

	test.ok(view(d1.ripLines(true, true)) == da);//trim and skip
	test.ok(view(d2.ripLines(true, true)) == da);
	test.ok(view(d3.ripLines(true, true)) == da);

	test.ok(view(d1.ripLines(true, false)) == "<><One><Two><Three>");//just trim
	test.ok(view(d2.ripLines(true, false)) == "<One><Two><><Three>");
	test.ok(view(d3.ripLines(true, false)) == "<One><Two><Three><>");

	test.done();
}














//    ____                                     
//   / ___|___  _ __ ___  _ __   ___  ___  ___ 
//  | |   / _ \| '_ ` _ \| '_ \ / _ \/ __|/ _ \
//  | |__| (_) | | | | | | |_) | (_) \__ \  __/
//   \____\___/|_| |_| |_| .__/ \___/|___/\___|
//                       |_|                   

var say = requireText.say;
var lines = requireText.lines;
var table = requireText.table;

exports.testSay = function(test) {

	test.ok(say("hi") == "hi");
	test.ok(say(7) == "7");//calls numerals(7) and easier to remember and type

	test.ok(say("a", "b", "cd") == "abcd");
	test.ok(say("aaa", "", "bbb") == "aaabbb");//middle string is blank

	test.ok(say("a", 2, "b") == "a2b");

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

	// What if you want to include a # that doesn't get replaced? Assemble your string the old fasioned way, or replace a # in the format string with "#" as an additional argument, like this:
	test.ok("Assumed # of kittens: #.".fill("#", 4) == "Assumed # of kittens: 4.");

	test.done();
}

exports.testLinesTable = function(test) {

	//check formatting
	test.ok(table(
		["a",     "b",      "c"],
		["apple", "banana", "carrot"]) ==
	lines(
		"a      b       c",
		"apple  banana  carrot"));
	test.ok(table(
		["Item",   "Color"],
		["-",      "-"],
		["leaf",   "green"],
		["apple",  "red"],
		["banana", "yellow"]) ==
	lines(
		"Item    Color",
		"-       -",
		"leaf    green",
		"apple   red",
		"banana  yellow"));

	//cells with more than just string literals
	function fun() { return "answer"; }
	test.ok(table(
		["Name",   "Value"],
		["-",      "-"],
		["number", 7], // A number instead of a string literal
		["return", fun()]) == // A function call instead
	lines(
		"Name    Value",
		"-       -",
		"number  7",
		"return  answer"));

	//string output
	test.ok(table(["A", "B"], ["CC", "DD"]) == "A   B\r\nCC  DD\r\n");
	test.ok(table(["AA", "B"], ["C", "DD"]) == "AA  B\r\nC   DD\r\n");

	//blank cells	
	test.ok(table(
		["apple apricot", "", "c"],//cell b is blank
		["dictionary", "eggs earth eager", "f"]) ==
	lines(
		"apple apricot                    c",
		"dictionary     eggs earth eager  f"));

	test.done();
}








































//   _____                     _      
//  | ____|_ __   ___ ___   __| | ___ 
//  |  _| | '_ \ / __/ _ \ / _` |/ _ \
//  | |___| | | | (_| (_) | (_| |  __/
//  |_____|_| |_|\___\___/ \__,_|\___|
//                                    

var safeFileName = requireText.safeFileName;

exports.testEncodeDecodeUriComponent = function(test) {

	//encode characters
	test.ok(encodeURIComponent("A") == "A");//lets A pass through
	test.ok(encodeURIComponent("-") == "-");//lets hyphen pass through
	test.ok(encodeURIComponent(" ") == "%20");//turns space into %20
	test.ok(encodeURIComponent("%") == "%25");
	test.ok(encodeURIComponent("&") == "%26");
	test.ok(encodeURIComponent("+") == "%2B");//writes base16 in upper case
	test.ok(encodeURIComponent(",") == "%2C");
	test.ok(encodeURIComponent("\r\n") == "%0D%0A");

	//decode them back
	test.ok(decodeURIComponent("A")   == "A");
	test.ok(decodeURIComponent("-")   == "-");
	test.ok(decodeURIComponent("%20") == " ");
	test.ok(decodeURIComponent("%25") == "%");
	test.ok(decodeURIComponent("%26") == "&");
	test.ok(decodeURIComponent("%2B") == "+");
	test.ok(decodeURIComponent("%2C") == ",");
	test.ok(decodeURIComponent("%0D%0A") == "\r\n");

	//double space and double encode
	test.ok(encodeURIComponent("  ") == "%20%20");//two spaces
	test.ok(encodeURIComponent(encodeURIComponent(" ")) == "%2520");//double encode

	//see if it can decode lowercase base 16
	test.ok(decodeURIComponent("%2C") == ",");//uppercase, what it produces
	test.ok(decodeURIComponent("%2c") == ",");//lowercase, it accepts that also

	//see what happens if you give decode characters that should have been encoded
	test.ok(decodeURIComponent(" ") == " ");//these pass through
	test.ok(decodeURIComponent("&") == "&");
	test.ok(decodeURIComponent("+") == "+");//plus stays plus, doesn't become space
	try {
		decodeURIComponent("%");//just a percent throws URIError
		tst.fail();
	} catch (e) { test.ok(e.name == "URIError"); }

	//looking at plus and space
	test.ok(encodeURIComponent("hello you")   == "hello%20you");//encode
	test.ok(decodeURIComponent("hello%20you") == "hello you");//decode
	test.ok(decodeURIComponent("hello+you")   == "hello+you");//doesn't decode spaces

	test.done();
}

exports.testEncodeDecode = function(test) {

	function round(plain, encoded) {
		test.ok(plain.encode() == encoded);//confirm plain encodes into encoded
		test.ok(encoded.decode() == plain);//confirm encoded decodes back into plain
	}
	function unchanged(plain) { round(plain, plain); }//confirm encoding and decoding plain doesn't change it
	function decodeInvalid(encoded) {
		try {
			encoded.decode();
			test.fail();
		} catch (e) { test.ok(e == "data"); }
	}

	//blank
	round("", "");//blank is ok

	//characters that don't get changed
	unchanged("abcABC");//alphabetic
	unchanged("0123456789");//decimal numerals
	unchanged("-_.!~*'()");//these puncutation marks

	//characters that get encoded
	round("?", "%3F");
	round("&", "%26");
	round(",", "%2C");//encode writes base 16 in uppercase
	test.ok("%2c".decode() == ",");//decode accepts lowercase also

	//space, plus, and %20
	round("a b", "a+b");//custom enhancement encodes space into + instead of %20
	round("a+b", "a%2Bb");//plus gets encoded into %2B
	test.ok("a+b".decode()   == "a b");//decodes both plus and %20 back to space
	test.ok("a%20b".decode() == "a b");

	//percent and decoding a fragment
	round("%", "%25");//percent becomes %25, and back again
	decodeInvalid("%");//trying to decode an incomplete code throws data
	decodeInvalid("%2");
	decodeInvalid("%0G");//invalid base16 code

	//international
	function roundData(plain, encoded, base16) {
		round(plain, encoded);//confirm encoding works both ways
		test.ok(Data(plain).base16() == base16);//and the bytes in base16 match
	}
	roundData("a", "a", "61");
	roundData("ö", "%C3%B6", "c3b6");
	roundData("خ", "%D8%AE", "d8ae");
	roundData("の", "%E3%81%AE", "e381ae");
	roundData("一二三", "%E4%B8%80%E4%BA%8C%E4%B8%89", "e4b880e4ba8ce4b889");

	test.done();
}

exports.testSafeFileName = function(test) {

	test.ok(safeFileName("normal") == "normal");
	test.ok(safeFileName('"\\/:*?<>|') == '”﹨⁄։﹡﹖‹›।');

	test.done();
}



































































