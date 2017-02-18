console.log("text test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };
















//   _____                 
//  |_   _|   _ _ __   ___ 
//    | || | | | '_ \ / _ \
//    | || |_| | |_) |  __/
//    |_| \__, | .__/ \___|
//        |___/|_|         

// hasPropertyOfType, hasMethod, getType, isType, checkType

expose.test("text hasPropertyOfType", function(ok, done) {

	var u;//undefined
	ok(!hasPropertyOfType(u, "name", "string"));
	ok(!hasPropertyOfType(u, "name", "function"));

	var s = "hi";//string
	ok(!hasPropertyOfType(s, "name", "string"));
	ok(!hasPropertyOfType(s, "name", "function"));
	ok(hasPropertyOfType(s, "charAt", "function"));//comes with the platform
	ok(hasPropertyOfType(s, "rip", "function"));//a function we added

	var e = {};//empty object
	ok(!hasPropertyOfType(e, "name", "string"));
	ok(!hasPropertyOfType(e, "name", "function"));

	var a = [];//empty array
	ok(!hasPropertyOfType(a, "name", "string"));
	ok(!hasPropertyOfType(a, "name", "function"));
	ok(hasPropertyOfType(a, "splice", "function"));//comes with the platform
	ok(hasPropertyOfType(a, "add", "function"));//a function we added

	var o = {};//object with
	o.name1 = "string value";//string property
	o.name2 = function() { return "return value"; }//function property

	ok(!hasPropertyOfType(o, "name",  "string"));//still no property named "name"
	ok(!hasPropertyOfType(o, "name",  "function"));

	ok(hasPropertyOfType(o,  "name1", "string"));
	ok(!hasPropertyOfType(o, "name1", "function"));

	ok(!hasPropertyOfType(o, "name2", "string"));
	ok(hasPropertyOfType(o,  "name2", "function"));

	var d = Data();//custom program objects
	var p = working();//Path object

	ok(hasPropertyOfType(d, "type", "string"));//type is always a string
	ok(hasPropertyOfType(p, "type", "string"));
	ok(hasPropertyOfType(d, "text", "function"));//Data has a text function
	ok(hasPropertyOfType(p, "text", "string"));//Path is immutable and has a text string

	ok(!hasPropertyOfType(d, "type", "function"));//valid names, incorrect types
	ok(!hasPropertyOfType(p, "type", "function"));
	ok(!hasPropertyOfType(d, "text", "string"));
	ok(!hasPropertyOfType(p, "text", "function"));

	ok(hasPropertyOfType(d, "base16", "function"));//methods
	ok(hasPropertyOfType(p, "subtract", "function"));

	done();
});

expose.test("text hasMethod", function(ok, done) {

	ok(hasMethod(Data(), "base62"));//there
	ok(!hasMethod(Data(), "notFound"));//not found

	ok(!hasMethod(undefined, "name"));//not an object, returns false
	ok(!hasMethod(null, "name"));
	ok(!hasMethod(false, "name"));
	ok(!hasMethod(0, "name"));
	ok(!hasMethod("hi", "name"));

	done();
});

expose.test("text getType", function(ok, done) {

	//nothings
	ok("undefined" == getType());//nothing passed
	ok("undefined" == getType(undefined));
	ok("undefined" == getType(Data().anUndefinedMember));

	//boolean
	ok("boolean" == getType(false));
	ok("boolean" == getType(true));

	//number
	ok("number" == getType(0));
	ok("number" == getType(500));
	ok("number" == getType(-1.2));
	ok("number" == getType(Infinity));
	ok("number" == getType(NaN));

	//string
	ok("string" == getType(""));
	ok("string" == getType("hi"));

	//function
	ok("function" == getType(function(){}));
	ok("function" == getType(Math.sin));
	ok("function" == getType(isType));
	ok("function" == getType(Data().size));

	//javascript object
	ok("object" == getType(null));//null has been an object since the beginning of javascript
	ok("object" == getType({a:1}));//hash
	ok("object" == getType([1, 2, 4]));//array
	ok("object" == getType(/s/));//node says a regular expression literal is an object

	//platform object
	ok("object" == getType(new Date()));//javascript object

	//node object
	ok("object" == getType(new Buffer(0)));//node object
	ok("object" == getType(new Buffer(8)));

	//program object with type member
	ok("Bay"  == getType(Bay()));
	ok("Data" == getType(Bay().data()));
	ok("Clip" == getType(Bay().data().clip()));

	//program object without that method
	function Sample() {
		function method() {}
		return { method:method }//no type() method
	}
	ok("object" == getType(Sample()));

	done();
});

expose.test("text getType Error", function(ok, done) {

	required.fs.open("notfound.ext", "r", function(e, file) {//make a platform error object
		var o = {};//and an empty object

		ok(typeof o == "object");//typeof sees both as just objects
		ok(typeof e == "object");

		ok(!(o instanceof Error));//instanceof sees the error
		ok(e instanceof Error);

		ok(getType(o) == "object");//getType can distinguish the two
		ok(getType(e) == "Error");

		done();//mark the test done in the callback
	});
});
























//      _                         
//     / \   _ __ _ __ __ _ _   _ 
//    / _ \ | '__| '__/ _` | | | |
//   / ___ \| |  | | | (_| | |_| |
//  /_/   \_\_|  |_|  \__,_|\__, |
//                          |___/ 

expose.test("text array", function(ok, done) {

	var a = [];
	a.add("a");//add to the end of the array
	a.add("b");
	a.add("c");
	ok(a.length == 3);
	ok(a[2] == "c");

	var o = a.remove(1);//remove b, which is a distance 1 into the array
	ok(a.length == 2);//that changed the length
	ok(a[0] == "a");
	ok(a[1] == "c");//and the index of items afterwards

	ok(o == "b");//remove returned it

	function out(a, i) {//out of bounds
		try {
			a.remove(i);
			ok(false);
		} catch (e) { ok(e.name == "bounds"); }
	}
	out(a, -1);
	out(a, 2);

	done();
});

expose.test("text arraySame", function(ok, done) {

	ok(arraySame([], []));
	ok(arraySame(["a"], ["a"]));
	ok(!arraySame(["a"], ["A"]));
	ok(!arraySame(["a", "b"], ["a"]));
	ok(arraySame(["a", "b"], ["a", "b"]));
	ok(!arraySame(["a", "2"], ["a", 2]));//different because arraySame uses triple equals

	done();
});






















//    ____ _                          _            
//   / ___| |__   __ _ _ __ __ _  ___| |_ ___ _ __ 
//  | |   | '_ \ / _` | '__/ _` |/ __| __/ _ \ '__|
//  | |___| | | | (_| | | | (_| | (__| ||  __/ |   
//   \____|_| |_|\__,_|_|  \__,_|\___|\__\___|_|   
//                                                 

// is, blank, compareText

expose.test("text length size", function(ok, done) {

	var s;

	s = "a";//ascii
	ok(s.length == 1);
	ok(Data(s).size() == 1);

	s = "ö";//umlaut
	ok(s.length == 1);
	ok(Data(s).size() == 2);//two bytes
	ok(Data(s).base16() == "c3b6");

	s = "خ";//arabic ha
	ok(s.length == 1);
	ok(Data(s).size() == 2);//two bytes

	s = "の";//hiragana no
	ok(s.length == 1);
	ok(Data(s).size() == 3);//three bytes
	ok(Data(s).base16() == "e381ae");

	// The number of characters in string s is s.length
	// MDN warns: This property returns the number of code units in the string. UTF-16, the string format used by JavaScript, uses a single 16-bit code unit to represent the most common characters, but needs to use two code units for less commonly-used characters, so it's possible for the value returned by length to not match the actual number of characters in the string.
	//TODO write a test that demonstrates how s.length fails, then a function that corrects it

	done();
});

expose.test("text equals quotes", function(ok, done) {

	function likeBlank(v) { ok(v == ""); ok(!(v != "")); }
	function likeText(v)  { ok(v != ""); ok(!(v == "")); }

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

	done();
});

expose.test("text is blank", function(ok, done) {

	ok(is("a"));//standard use
	ok(blank(""));

	//throws for non string
	try { is(null);             ok(false); } catch (e) { ok(e.name == "type"); }
	try { is(1);                ok(false); } catch (e) { ok(e.name == "type"); }
	try { blank(false);         ok(false); } catch (e) { ok(e.name == "type"); }
	try { blank(new Buffer(0)); ok(false); } catch (e) { ok(e.name == "type"); }

	done();
});

expose.test("text lower upper", function(ok, done) {

	//use
	ok("A".lower() == "a");
	ok("a".upper() == "A");
	ok("Shhhh. Whisper, please.".lower() == "shhhh. whisper, please.");
	ok("Do you want to buy a duck?".upper() == "DO YOU WANT TO BUY A DUCK?");

	//greek alphabet
	var greekLower = "αβγδεζηθικλμνξοπρστυφχψω";
	var greekUpper = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
	ok(greekLower.upper() == greekUpper);
	ok(greekUpper.lower() == greekLower);

	done();
});

expose.test("text code", function(ok, done) {

	ok("A".code() == 65);//you can omit i to get the first character

	var s = "\0\r\n\x0d\x0a\t\"";//control characters
	ok(s.length == 7);
	ok(s.code(0) == 0);//null
	ok(s.code(1) == 0x0d);//r
	ok(s.code(2) == 0x0a);//n
	ok(s.code(3) == 0x0d);//r
	ok(s.code(4) == 0x0a);//n
	ok(s.code(5) == 9);//tab
	ok(s.code(6) == 34);//quote

	s = "09AZaz";//letters and numbers
	ok(s.code(0) == 48);
	ok(s.code(1) == 57);
	ok(s.code(2) == 65);
	ok(s.code(3) == 90);
	ok(s.code(4) == 97);
	ok(s.code(5) == 122);

	s = " !.^_";//punctuation
	ok(s.code(0) == 32);
	ok(s.code(1) == 33);
	ok(s.code(2) == 46);
	ok(s.code(3) == 94);
	ok(s.code(4) == 95);

	s = "español";//europe
	ok(s.length == 7);
	ok(s.code(0) == 101);
	ok(s.code(4) == 241);//beyond the ascii table
	ok(s.code(6) == 108);

	s = "中文";//asia
	ok(s.length == 2);
	ok(s.code(0) == 20013);//tens of thousands
	ok(s.code(1) == 25991);

	s = "مرحبا";//arabic
	ok(s.length == 5);
	ok(s.code(0) == 1605);//just thousands
	ok(s.code(1) == 1585);
	ok(s.code(2) == 1581);
	ok(s.code(3) == 1576);
	ok(s.code(4) == 1575);

	done();
});

expose.test("text range", function(ok, done) {

	ok("a".range("a", "z"));//first
	ok("z".range("a", "z"));//last
	ok("k".range("a", "z"));//middle
	ok("5".range("5", "5"));//only

	ok(!"0".range("a", "z"));//outside
	ok(!"A".range("a", "z"));

	done();
});

expose.test("text isLetter isNumber", function(ok, done) {

	ok("a".isLetter());//lower
	ok("b".isLetter());
	ok("z".isLetter());

	ok("A".isLetter());//upper
	ok("K".isLetter());
	ok("Z".isLetter());

	ok("0".isNumber());//number
	ok("2".isNumber());
	ok("9".isNumber());

	//blank is false, doesn't throw
	ok(!"".isLetter());

	function neither(c) {
		ok(!c.isLetter());
		ok(!c.isNumber());
	}

	neither(" ");
	neither(":");
	neither("/");
	neither("!");
	neither("\0");
	neither("\r");

	done();
});

expose.test("text isSpace", function(ok, done) {

	ok("".isSpace());
	ok(" ".isSpace());
	ok("\r\n".isSpace());
	ok(!"a".isSpace());

	done();
});

expose.test("text compareText sort", function(ok, done) {
//TODO this works on node 10, doesn't on node 12, figure out why, switch to a method of comparing text that works on both
/*
	//make sure we got the sign right
	ok(compareText("a", "b") < 0);//negative, correct order
	ok(compareText("a", "a") == 0);//zero, tie
	ok(compareText("b", "a") > 0);//positive, reverse order

	//but what this is really good for is sorting arrays
	function run(before, sorted) {
		var a = before.rip(",");
		a.sort(compareText);
		ok(a + "" == sorted);
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
	ok("一".code() == 0x4e00);//one is first
	ok("二".code() == 0x4e8c);//two is third
	ok("三".code() == 0x4e09);//three is second

	var greek = "α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω";//sort the greek alphabet
	run("β,γ,δ,ε,φ,ξ,ο,π,ρ,σ,α,θ,χ,ψ,ω,μ,ν,ζ,η,κ,λ,ι,τ,υ", greek);
	run("α,β,λ,δ,ε,υ,γ,φ,κ,ρ,π,ω,μ,ν,ξ,ο,ζ,η,χ,ψ,σ,τ,θ,ι", greek);
	run("θ,ι,κ,δ,ε,ω,χ,ψ,β,ξ,ο,ν,τ,υ,α,ζ,ρ,σ,γ,π,λ,η,φ,μ", greek);
*/
	done();
});





















//    ____ _ _       
//   / ___| (_)_ __  
//  | |   | | | '_ \ 
//  | |___| | | |_) |
//   \____|_|_| .__/ 
//            |_|    

expose.test("text first", function(ok, done) {

	var s = "abc";
	ok(s.first() == "a");
	ok(s.get(0) == "a");
	ok(s.get() == "a");//you can also just omit the 0

	done();
});

expose.test("text length get", function(ok, done) {

	var s;
	s = "abc";
	ok(s.length == 3);
	ok(s.get(0) == "a");
	ok(s.get(1) == "b");
	ok(s.get(2) == "c");
	ok(s.get(-1) == "");
	ok(s.get(3) == "");

	s = "一二三";
	ok(s.length == 3);
	ok(s.get(0) == "一");
	ok(s.get(1) == "二");
	ok(s.get(2) == "三");
	ok(s.get(-1) == "");
	ok(s.get(3) == "");

	s = "中文 español English हिन्दी العربية português বাংলা русский 日本語 ਪੰਜਾਬੀ";//international string literal
	s64 = "5Lit5paHIGVzcGHDsW9sIEVuZ2xpc2gg4KS54KS/4KSo4KWN4KSm4KWAINin2YTYudix2KjZitipIHBvcnR1Z3XDqnMg4Kas4Ka+4KaC4Kay4Ka+INGA0YPRgdGB0LrQuNC5IOaXpeacrOiqniDgqKrgqbDgqJzgqL7gqKzgqYA=";//same text as utf8 bytes encoded as base64
	ok(s == base64(s64).text());//turn data into text and compare
	ok(Data(s).same(base64(s64)));//turn text into data and compare

	ok(s.length == 68);
	ok(s.get(0) == "中");
	ok(s.get(1) == "文");
	ok(s.get(41) == "ê");
	ok(s.get(66) == "ਬ");
	ok(s.get(67) == "ੀ");

	s = "español 中文 বাংলা português";
	ok(s.length == 26);
	ok(s.get(0) == "e");
	ok(s.get(4) == "ñ");

	ok(s.get(8) == "中");
	ok(s.get(9) == "文");

	ok(s.get(11) == "ব");//the closing quotes may not line up vertically, because a fixed width font isn't fixed width for international characters
	ok(s.get(12) == "া");
	ok(s.get(13) == "ং");
	ok(s.get(14) == "ল");
	ok(s.get(15) == "া");

	ok(s.get(24) == "ê");

	done();
});

expose.test("text start end beyond chop", function(ok, done) {

	var s = "abcdefgh";
	ok(s.start(3)  == "abc");
	ok(s.end(3)    ==      "fgh");
	ok(s.beyond(3) ==    "defgh");
	ok(s.chop(3)   == "abcde");

	done();
});

expose.test("text clip", function(ok, done) {

	var s = "abcdefgh";
	ok(s.clip(1, 2) == "bc");//middle
	ok(s.clip(0, 2) == "ab");//start
	ok(s.clip(6, 2) == "gh");//end
	ok(s.clip(0, 8) == "abcdefgh");//everything
	ok(s.clip(0, 0) == "");//nothing start
	ok(s.clip(8, 0) == "");//nothing end
	ok(s.clip(4, 0) == "");//nothing middle

	ok(typeof s.clip(0, 0) === "string");//make sure nothing gives us ""

	try { s.clip(-1, 1); ok(false); } catch (e) { ok(e.name == "bounds"); }//before start
	try { s.clip(8, 1); ok(false); } catch (e) { ok(e.name == "bounds"); }//beyond end

	try { s.clip(-1, 0); ok(false); } catch (e) { ok(e.name == "bounds"); }//nothing before start
	try { s.clip(9, 0); ok(false); } catch (e) { ok(e.name == "bounds"); }//nothing beyond end

	done();
});




















//   _____ _           _ 
//  |  ___(_)_ __   __| |
//  | |_  | | '_ \ / _` |
//  |  _| | | | | | (_| |
//  |_|   |_|_| |_|\__,_|
//                       

expose.test("text same match", function(ok, done) {

	function run(answerMatch, answerCase, s1, s2) {

		ok(answerMatch == match(s1, s2));
		ok(answerCase == same(s1, s2));
		ok(answerCase == (s1 == s2));

		ok(answerMatch == match(s2, s1));//flip inputs
		ok(answerCase == same(s2, s1));
		ok(answerCase == (s2 == s1));
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

	done();
});

expose.test("text starts ends has", function(ok, done) {

	ok("abcd".starts("ab"));
	ok("abcd".ends("cd"));
	ok("abcd".has("bc"));

	done();
});

expose.test("text find last findMatch", function(ok, done) {

	//no tag
	try { "abcd".find(""); ok(false); } catch (e) { ok(e.name == "argument"); }

	//basic use
	ok(0  == "abcd".find(  "ab"));//first
	ok(2  == "abcd".find(    "cd"));//last
	ok(1  == "abcd".find(   "bc"));//middle
	ok(-1 == "abcd".find("YZ"));//not found

	//tag longer
	ok(-1 == "abcd".find(  "abcdef"));//tag matches but longer beyond end
	ok(-1 == "abcd".find("YZabcd"));//tag matches but longer before start
	ok(-1 == "abcd".find(  "abcE"));//tag matches at start

	//forward and reverse
	ok( 1 == " abc ab bcde abcd ".find("ab"));
	ok(13 == " abc ab bcde abcd ".last("ab"));
	ok( 2 == " abc ab bcde abcd ".find("bc"));
	ok(14 == " abc ab bcde abcd ".last("bc"));
	ok( 9 == " abc ab bcde abcd ".find("cd"));
	ok(15 == " abc ab bcde abcd ".last("cd"));
	ok(10 == " abc ab bcde abcd ".find("de"));
	ok(10 == " abc ab bcde abcd ".last("de"));

	//matching cases
	ok(0 == "abcd".findMatch("AB"));//first
	ok(2 == "abcd".findMatch(  "cD"));//last
	ok(1 == "abcd".findMatch( "Bc"));//middle

	//international
	var s = "español 中文 বাংলা português";
	ok( 0 == s.find("español"));
	ok( 8 == s.find("中文"));
	ok(11 == s.find("বাংলা"));
	ok(17 == s.find("português"));

	//international matching cases
	ok(-1 == s.find(     "ESPAÑOL"));
	ok( 0 == s.findMatch("ESPAÑOL"));
	ok(-1 == s.find(     "PORTUGUÊS"));
	ok(17 == s.findMatch("PORTUGUÊS"));

	//international forward and reverse
	s = " X বাংলা X বাংলা X ";
	ok( 3 == s.find("বাংলা"));
	ok(11 == s.last("বাংলা"));

	done();
});

expose.test("text either eitherMatch", function(ok, done) {

	var s = "sample abc text def and more";

	ok(s.either("abc", "xyz") == 7);//first found
	ok(s.either("xyz", "abc") == 7);//second found

	ok(s.either("abc", "def") == 7);//both found
	ok(s.either("aBC", "def") == 16);//first case mismatch
	ok(s.eitherMatch("aBC", "def") == 7);//matching cases

	done();
});










//    ____      _   
//   / ___|   _| |_ 
//  | |  | | | | __|
//  | |__| |_| | |_ 
//   \____\__,_|\__|
//                  

expose.test("text before after last match", function(ok, done) {

	var s = "apple<tag>banana<tag>carrot";

	//before and after
	ok(s.before(    "<tag>") == "apple");
	ok(s.after(     "<tag>") ==           "banana<tag>carrot");
	ok(s.beforeLast("<tag>") == "apple<tag>banana");
	ok(s.afterLast( "<tag>") ==                      "carrot");

	//cut
	var c = s.cutLastMatch("<TAG>");//tag uppercase, matching on
	ok(c.found);
	ok(c.before == "apple<tag>banana");
	ok(c.tag    == "<tag>");//tag lowercase from s
	ok(c.after  == "carrot");

	s = "Sample text";

	//not found
	ok(s.before(         "E") == "Sample text");//not found, all before
	ok(s.after(          "E") == "");
	ok(s.beforeLast(     "E") == "Sample text");
	ok(s.afterLast(      "E") == "");

	//case matching
	ok(s.beforeMatch(    "E") == "Sampl");
	ok(s.afterMatch(     "E") ==       " text");
	ok(s.beforeLastMatch("E") == "Sample t");
	ok(s.afterLastMatch( "E") ==          "xt");

	done();
});

expose.test("text swap swapMatch", function(ok, done) {

	var s = "Abacore tuna is absolutely the best.";
	ok(s.swapMatch("ab", "Ba") == "Baacore tuna is Basolutely the best.");

	s = "Yesterday. Bill said it. That's when Bill was in here.";
	ok(s.swapMatch("bill", "REDACTED") == "Yesterday. REDACTED said it. That's when REDACTED was in here.");

	ok("aaaaa".swap("aa", "bb") == "bbbba");//replaced 2 whole instances
	ok("aaaaa".swap("aa", "bbb") == "bbbbbba");

	done();
});

expose.test("text parse", function(ok, done) {

	var p = "He <b>really</b> wants to go.".parse("<b>", "</b>");
	ok(p.found     == true);
	ok(p.before    == "He ");
	ok(p.tagBefore == "<b>");
	ok(p.middle    == "really");
	ok(p.tagAfter  == "</b>");
	ok(p.after     == " wants to go.");

	function f(s, t1, t2, found, before, tagBefore, middle, tagAfter, after) {
		var p = s.parse(t1, t2);
		ok(p.found     == found);
		ok(p.before    == before);
		ok(p.tagBefore == tagBefore);
		ok(p.middle    == middle);
		ok(p.tagAfter  == tagAfter);
		ok(p.after     == after);
	}

	f("a[b]c", "[", "]", true, "a", "[", "b", "]", "c");//different tags
	f("a[b[c", "[", "[", true, "a", "[", "b", "[", "c");//same tags

	f("a[b c", "[", "]", false, "a[b c", "", "", "", "");//missing second
	f("a b]c", "[", "]", false, "a b]c", "", "", "", "");//missing first
	f("a b c", "[", "]", false, "a b c", "", "", "", "");//missing both

	done();
});

















//   _____     _           
//  |_   _| __(_)_ __ ___  
//    | || '__| | '_ ` _ \ 
//    | || |  | | | | | | |
//    |_||_|  |_|_| |_| |_|
//                         

expose.test("text trim", function(ok, done) {

	ok("hi".trim() == "hi");
	ok(" hi ".trim() == "hi");//spaces
	ok("\rhi\r".trim() == "hi");//single newline characters
	ok("\nhi\n".trim() == "hi");
	ok("\r\nhi\r\n".trim() == "hi");//windows newlines
	ok("\thi\t".trim() == "hi");//tabs
	ok(" \t\r\nwords inside\r \n\t".trim() == "words inside");//everything

	ok(" hi ".trimStart() == "hi ");
	ok(" hi ".trimEnd()   == " hi");

	done();
});

expose.test("text onStart onEnd offStart offEnd", function(ok, done) {

	//on start and end
	ok("/folder".onStart("/") == "/folder");//already there
	ok("folder".onStart("/") == "/folder");//added it

	ok("folder/".onEnd("/") == "folder/");//already there
	ok("folder".onEnd("/") == "folder/");//added it

	ok("folder///".onEnd("//") == "folder///");//already there
	ok("folderABC".onEnd("AB") == "folderABCAB");//added it

	//off start and end
	ok("/folder".offStart("/") == "folder");//removed it
	ok("folder".offStart("/") == "folder");//didn't need to
	ok("///folder".offStart("/") == "folder");//removed multiple

	ok("folder/".offEnd("/") == "folder");//removed it
	ok("folder".offEnd("/") == "folder");//didn't need to
	ok("folder///".offEnd("/") == "folder");//removed multiple

	//off
	var s = " --_ folder-_-- -";
	ok(s.off(" ") == "--_ folder-_-- -");
	ok(s.off("-") == " --_ folder-_-- ");
	ok(s.off(" ", "-") == "_ folder-_");
	ok(s.off(" ", "-", "_") == "folder");

	done();
});

expose.test("text widen", function(ok, done) {

	//on start and end
	ok("note".widenStart(10) == "      note");//space is default
	ok("1".widenEnd(4, "0") == "1000");

	done();
});











//   ____  _       
//  |  _ \(_)_ __  
//  | |_) | | '_ \ 
//  |  _ <| | |_) |
//  |_| \_\_| .__/ 
//          |_|    

expose.test("text rip", function(ok, done) {

	// Make sure rip will throw if you try to give it a regular expression
	try {
		"hello".rip(/abc/);
		ok(false);
	} catch (e) { ok(e.name == "type"); }

	function view(a) {
		var s = "";
		for (var i = 0; i < a.length; i++)
			s += "<" + a[i] + ">";
		return s;
	}
	function f(s, v) { ok(view(s.rip(",")) == v); }

	//patterns

	f("", "<>");//empty
	f(",", "<><>");
	f(",,", "<><><>");
	f(",,,", "<><><><>");

	f("a", "<a>");//one
	f(",a", "<><a>");
	f("a,", "<a><>");
	f(",a,", "<><a><>");

	f("a,b", "<a><b>");//two
	f(",a,b", "<><a><b>");
	f("a,b,", "<a><b><>");
	f(",a,b,", "<><a><b><>");

	f("a", "<a>");//double
	f(",,a", "<><><a>");
	f("a,,", "<a><><>");
	f(",,a,,", "<><><a><><>");

	f("a,,b", "<a><><b>");//double two
	f(",,a,,b", "<><><a><><b>");
	f("a,,b,,", "<a><><b><><>");
	f(",,a,,b,,", "<><><a><><b><><>");

	f(",a,,b", "<><a><><b>");//single and double
	f(",,a,b", "<><><a><b>");
	f("a,b,,", "<a><b><><>");
	f("a,,b,", "<a><><b><>");

	//features

	ok(view("a , ,,b".rip(",", false, false)) == "<a >< ><><b>");
	ok(view("a , ,,b".rip(",", true,  false)) == "<a><><><b>");//trim items
	ok(view("a , ,,b".rip(",", false, true))  == "<a >< ><b>");//skip blanks
	ok(view("a , ,,b".rip(",", true,  true))  == "<a><b>");//both

	//words

	var s = "  somewhere here  is  my tulip";

	ok(view(s.ripWords(false, false)) == "<><><somewhere><here><><is><><my><tulip>");
	ok(view(s.ripWords(true,  false)) == "<><><somewhere><here><><is><><my><tulip>");//trim
	ok(view(s.ripWords(false, true))  == "<somewhere><here><is><my><tulip>");//skip
	ok(view(s.ripWords(true,  true))  == "<somewhere><here><is><my><tulip>");//both

	//lines

	var du = "One\nTwo\nThree";//unix
	var dw = "One\r\nTwo\r\nThree";//windows

	var d1 = "\r\nOne\r\nTwo\r\nThree";//blank line at start
	var d2 = "One\r\nTwo\r\n\r\nThree";//blank line in middle
	var d3 = "One\r\nTwo\r\nThree\r\n";//blank line at end

	var da = "<One><Two><Three>";

	ok(view(du.ripLines(false, false)) == da);
	ok(view(dw.ripLines(true,  false)) == da);//trim windows line endings

	ok(view(d1.ripLines(true, true)) == da);//trim and skip
	ok(view(d2.ripLines(true, true)) == da);
	ok(view(d3.ripLines(true, true)) == da);

	ok(view(d1.ripLines(true, false)) == "<><One><Two><Three>");//just trim
	ok(view(d2.ripLines(true, false)) == "<One><Two><><Three>");
	ok(view(d3.ripLines(true, false)) == "<One><Two><Three><>");

	done();
});














//    ____                                     
//   / ___|___  _ __ ___  _ __   ___  ___  ___ 
//  | |   / _ \| '_ ` _ \| '_ \ / _ \/ __|/ _ \
//  | |__| (_) | | | | | | |_) | (_) \__ \  __/
//   \____\___/|_| |_| |_| .__/ \___/|___/\___|
//                       |_|                   

// say, line, lines, table

expose.test("text say", function(ok, done) {

	ok(say("hi") == "hi");
	ok(say(7) == "7");//easy way to turn a number into numerals
	ok(say("boolean is ", false) == "boolean is false");//works with booleans too

	ok(say("a", "b", "cd") == "abcd");
	ok(say("aaa", "", "bbb") == "aaabbb");//middle string is blank

	ok(say("a", 2, "b") == "a2b");

	done();
});

expose.test("text line", function(ok, done) {

	ok(line("hi") == "hi\r\n");
	ok(line("a", 2, "b") == "a2b\r\n");
	ok(line("") == "\r\n");//blank line

	done();
});

expose.test("text fill", function(ok, done) {
	
	ok("".fill() == "");//blank
	ok("hello".fill() == "hello");//no tags

	ok("#ab".fill(7) == "7ab");//start
	ok("a#b".fill(7) == "a7b");//middle
	ok("ab#".fill(7) == "ab7");//end

	ok("###".fill("a", "b", "c")      == "abc");//multiple
	ok("###".fill("a", "b", "c", "d") == "abcd");//too many
	ok("###".fill("a", "b")           == "ab#");//too few

	// What if you want to include a # that doesn't get replaced? Assemble your string the old fasioned way, or replace a # in the format string with "#" as an additional argument, like this:
	ok("Assumed # of kittens: #.".fill("#", 4) == "Assumed # of kittens: 4.");

	done();
});

expose.test("text lines table", function(ok, done) {

	//check formatting
	ok(table([
		["a",     "b",      "c"],
		["apple", "banana", "carrot"]]) ==
	lines(
		"a      b       c",
		"apple  banana  carrot"));
	ok(table([
		["Item",   "Color"],
		["-",      "-"],
		["leaf",   "green"],
		["apple",  "red"],
		["banana", "yellow"]]) ==
	lines(
		"Item    Color",
		"-       -",
		"leaf    green",
		"apple   red",
		"banana  yellow"));

	//cells with more than just string literals
	function fun() { return "answer"; }
	ok(table([
		["Name",   "Value"],
		["-",      "-"],
		["number", 7], // A number instead of a string literal
		["return", fun()]]) == // A function call instead
	lines(
		"Name    Value",
		"-       -",
		"number  7",
		"return  answer"));

	//string output
	ok(table([["A", "B"], ["CC", "DD"]]) == "A   B\r\nCC  DD\r\n");
	ok(table([["AA", "B"], ["C", "DD"]]) == "AA  B\r\nC   DD\r\n");

	//blank cells	
	ok(table([
		["apple apricot", "", "c"],//cell b is blank
		["dictionary", "eggs earth eager", "f"]]) ==
	lines(
		"apple apricot                    c",
		"dictionary     eggs earth eager  f"));

	done();
});








































//   _____                     _      
//  | ____|_ __   ___ ___   __| | ___ 
//  |  _| | '_ \ / __/ _ \ / _` |/ _ \
//  | |___| | | | (_| (_) | (_| |  __/
//  |_____|_| |_|\___\___/ \__,_|\___|
//                                    

expose.test("text encodeURIComponent decodeURIComponent", function(ok, done) {

	//encode characters
	ok(encodeURIComponent("A") == "A");//lets A pass through
	ok(encodeURIComponent("-") == "-");//lets hyphen pass through
	ok(encodeURIComponent(" ") == "%20");//turns space into %20
	ok(encodeURIComponent("%") == "%25");
	ok(encodeURIComponent("&") == "%26");
	ok(encodeURIComponent("+") == "%2B");//writes base16 in upper case
	ok(encodeURIComponent(",") == "%2C");
	ok(encodeURIComponent("\r\n") == "%0D%0A");

	//decode them back
	ok(decodeURIComponent("A")   == "A");
	ok(decodeURIComponent("-")   == "-");
	ok(decodeURIComponent("%20") == " ");
	ok(decodeURIComponent("%25") == "%");
	ok(decodeURIComponent("%26") == "&");
	ok(decodeURIComponent("%2B") == "+");
	ok(decodeURIComponent("%2C") == ",");
	ok(decodeURIComponent("%0D%0A") == "\r\n");

	//double space and double encode
	ok(encodeURIComponent("  ") == "%20%20");//two spaces
	ok(encodeURIComponent(encodeURIComponent(" ")) == "%2520");//double encode

	//see if it can decode lowercase base 16
	ok(decodeURIComponent("%2C") == ",");//uppercase, what it produces
	ok(decodeURIComponent("%2c") == ",");//lowercase, it accepts that also

	//see what happens if you give decode characters that should have been encoded
	ok(decodeURIComponent(" ") == " ");//these pass through
	ok(decodeURIComponent("&") == "&");
	ok(decodeURIComponent("+") == "+");//plus stays plus, doesn't become space
	try {
		decodeURIComponent("%");//just a percent throws URIError
		ok(false);
	} catch (e) { ok(e.name == "URIError"); }

	//looking at plus and space
	ok(encodeURIComponent("hello you")   == "hello%20you");//encode
	ok(decodeURIComponent("hello%20you") == "hello you");//decode
	ok(decodeURIComponent("hello+you")   == "hello+you");//doesn't decode spaces

	done();
});

expose.test("text encode decode", function(ok, done) {

	function round(plain, encoded) {
		ok(plain.encode() == encoded);//confirm plain encodes into encoded
		ok(encoded.decode() == plain);//confirm encoded decodes back into plain
	}
	function unchanged(plain) { round(plain, plain); }//confirm encoding and decoding plain doesn't change it
	function decodeInvalid(encoded) {
		try {
			encoded.decode();
			ok(false);
		} catch (e) { ok(e.name == "data"); }
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
	ok("%2c".decode() == ",");//decode accepts lowercase also

	//space, plus, and %20
	round("a b", "a+b");//custom enhancement encodes space into + instead of %20
	round("a+b", "a%2Bb");//plus gets encoded into %2B
	ok("a+b".decode()   == "a b");//decodes both plus and %20 back to space
	ok("a%20b".decode() == "a b");

	//percent and decoding a fragment
	round("%", "%25");//percent becomes %25, and back again
	decodeInvalid("%");//trying to decode an incomplete code throws data
	decodeInvalid("%2");
	decodeInvalid("%0G");//invalid base16 code

	//international
	function roundData(plain, encoded, base16) {
		round(plain, encoded);//confirm encoding works both ways
		ok(Data(plain).base16() == base16);//and the bytes in base16 match
	}
	roundData("a", "a", "61");
	roundData("ö", "%C3%B6", "c3b6");
	roundData("خ", "%D8%AE", "d8ae");
	roundData("の", "%E3%81%AE", "e381ae");
	roundData("一二三", "%E4%B8%80%E4%BA%8C%E4%B8%89", "e4b880e4ba8ce4b889");

	done();
});

expose.test("text encode decode", function(ok, done) {

	ok("¶".data().base16() == "c2b6");//we're using the standard unicode pilcrow character
	ok("\n".pilcrow().data().base16() == "c2b6");//utf8

	ok("windows newline\r\nunix newline\nextra line".pilcrow() == "windows newline¶unix newline¶extra line");

	done();
});
















































});
console.log("text test/");