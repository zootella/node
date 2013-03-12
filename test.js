

var log = console.log;



var base = require('./base');//functions
var Data = require("./base").Data;//objects

var base16 = base.base16;
var toByte = base.toByte;

/*
var o = {};
require('./base').includeAll(o);//this works when it's o, but not when it's this
o.sampleFunction();
*/

//ok, now let's write some tests!

//write these tests like a kids story that shows how easy it is to do powerful stuff with your library
//for instance, start out in data by saying, what a data object is, why you might want to make one
//and then say, you can make a data object from anything that has binary data inside it


exports.testData = function(test) {

	//make an empty data
	var d;
	d = new Data();
	test.ok(!d.size());

	//boolean
	d = new Data(true);
	test.ok(d.toString() == "t");
	d = new Data(false);
	test.ok(d.toString() == "f");

	//byte
	d = new toByte(0x01);//javascript can't tell the difference between numbers and bytes, so you have to use toByte(), which returns a Data object
	test.ok(d.base16() == "01");

	//number
	d = new Data(123);
	test.ok(d.toString() == "123");
	d = new Data(-5);
	test.ok(d.toString() == "-5");
	d = new Data(1.20);
	test.ok(d.toString() == "1.2");//note how it chops off the unnecessary trailing zero

	//string
	d = new Data("ab\r\n");
	test.ok(d.base16() == "61620d0a");//ascii characters a and b are 0x61 and 0x62

	//buffer
	var b = new Buffer("00ff01aa", "hex");
	d = new Data(b);
	test.ok(d.base16() == "00ff01aa");

	test.done();
};

exports.testCopy = function(test) {

	var buffer = new Buffer("00aa0000", "hex");//make a buffer that has aa in it
	var looking = new Data(buffer);//make a data that looks at it
	var copied = looking.copyData();//copy the data to a new data object

	buffer.writeUInt8(0xbb, 1);//change the aa to bb

	test.ok(looking.base16() == "00bb0000");//looking sees the change, while
	test.ok(copied.base16() == "00aa0000");//copied is protected from it

	test.done();
};

exports.testOut = function(test) {

	//buffer
	var d = base16("0d0a");
	var b = d.toBuffer();
	test.ok(b.readUInt8(0) == 0x0d);
	test.ok(b.readUInt8(1) == 0x0a);

	//string
	d = new Data("hello");
	var s = d.toString();
	test.ok(s == "hello");

	//number
	d = new Data(786);
	var i = d.toNumber();
	test.ok(i == 786);

	//boolean
	d = new Data(false);
	var f = d.toBoolean();
	test.ok(!f);

	test.done();
};

exports.testSize = function(test) {

	//empty
	var d = new Data();
	test.ok(!d.size());
	test.ok(!d.hasData());
	test.ok(d.isEmpty());

	//full
	d = new Data("hi");
	test.ok(d.size() == 2);
	test.ok(d.hasData());
	test.ok(!d.isEmpty());

	//unicode
	var s = "\u4e00\u4e8c\u4e09"//chinese one, two, three
	d = new Data(s);
	test.ok(s.length == 3);//3 unicode characters become
	test.ok(d.size() == 9);//9 bytes of utf8 data

	test.done();
};

exports.testClip = function(test) {

	//make 6 test bytes
	var d = base16("aabbccddeeff");
	test.ok(d.size() == 6);
	var c;

	//lots of ways to clip out parts of that, data is immutable, so c is different
	c = d.start(2);   test.ok(c.base16() == "aabb"        );
	c = d.end(2);     test.ok(c.base16() ==         "eeff");
	c = d.after(2);   test.ok(c.base16() ==     "ccddeeff");
	c = d.chop(2);    test.ok(c.base16() == "aabbccdd"    );
	c = d.clip(2, 3); test.ok(c.base16() ==     "ccddee"  );

	//clip nothing
	c = d.clip(0, 0); test.ok(c.base16() == "");
	c = d.clip(6, 0); test.ok(c.base16() == "");//clipping 0 from the end is ok
	try { d.clip(6, 1); test.fail(); } catch (e) {}//clipping 1 from the end is not
	try { d.clip(7, 0); test.fail(); } catch (e) {}//clipping 0 from beyond the end is not

	//first
	var b = d.first();
	test.ok(b == 0xaa);

	//get
	test.ok(d.get(0) == 0xaa);
	test.ok(d.get(1) == 0xbb);
	test.ok(d.get(5) == 0xff);

	//throw chop if out of range
	try {
		d.get(6);
		test.fail();
	} catch (e) {}//throws chop

	try { d.get(-1); test.fail(); } catch (e) {}//before the start
	try { d.get(6); test.fail(); } catch (e) {}//after the end

	try { d.clip(-1, 2); test.fail(); } catch (e) {}//sticking out before the start
	try { d.clip(-2, 2); test.fail(); } catch (e) {}//entirely before the start
	try { d.clip(5, 2); test.fail(); } catch (e) {}//sticking out after the end
	try { d.clip(6, 2); test.fail(); } catch (e) {}//entirely after the end

	test.done();
}

exports.testFind = function(test) {

	var d = base16("aabbccddeeff");

	//find single byte
	test.ok(d.find(base16("aa")) == 0);//first
	test.ok(d.find(base16("bb")) == 1);//second
	test.ok(d.find(base16("ff")) == 5);//last
	test.ok(d.find(base16("00")) == -1);//not found

	//more bytes
	test.ok(d.find(base16("aabb")) == 0);//start
	test.ok(d.find(base16("bbccdd")) == 1);//inside
	test.ok(d.find(base16("eeff")) == 4);//end
	test.ok(d.find(base16("0011")) == -1);//not there at all
	test.ok(d.find(base16("ff00")) == -1);//off end

	//same
	test.ok(d.same(base16("aabbccddeeff")));//same
	test.ok(!d.same(base16("aab0ccddeeff")));//different
	test.ok(!d.same(base16("aabbccddeeff00")));//too long
	test.ok(!d.same(base16("aabbccddee")));//too short

	//starts
	test.ok(d.starts(base16("aabb")));//starts
	test.ok(!d.starts(base16("aa00")));//not found
	test.ok(!d.starts(base16("bbcc")));//has, but not at the start

	//ends
	test.ok(d.ends(base16("eeff")));//ends
	test.ok(!d.ends(base16("aa00")));//not found
	test.ok(!d.ends(base16("ddee")));//has, but not at the end

	//has
	test.ok(d.has(base16("aabb")));//start
	test.ok(d.has(base16("bbcc")));//middle
	test.ok(d.has(base16("eeff")));//end
	test.ok(!d.has(base16("0011")));//different
	test.ok(!d.has(base16("ff00")));//off end

	//find first and last
	d = base16("aa010203aaaaaaaa010203aa");
	test.ok(d.find(base16("010203")) == 1);//first instance
	test.ok(d.last(base16("010203")) == 8);//last instance

	test.done();
}

exports.testFind = function(test) {

	var d = base16("01aabbcc05060708aabbcc12");

	//first
	var s = d.split(base16("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(base16("01")));
	test.ok(s.tag.same(base16("aabbcc")));
	test.ok(s.after.same(base16("05060708aabbcc12")));

	//last
	var s = d.splitLast(base16("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(base16("01aabbcc05060708")));
	test.ok(s.tag.same(base16("aabbcc")));
	test.ok(s.after.same(base16("12")));

	//not found
	var s = d.splitLast(base16("0507"));
	test.ok(!s.found);//not found
	test.ok(s.before.same(base16("01aabbcc05060708aabbcc12")));//all before
	test.ok(s.tag.same(base16("")));
	test.ok(s.after.same(base16("")));

	test.done();
}



exports.testByte = function(test) {

	var d;

	d = toByte(0x00);//smallest value
	test.ok(d.size() == 1);
	test.ok(d.base16() == "00");
	d = toByte(0);
	test.ok(d.size() == 1);
	test.ok(d.base16() == "00");

	d = toByte(0x05);//an example value
	test.ok(d.size() == 1);
	test.ok(d.base16() == "05");
	d = toByte(5);
	test.ok(d.size() == 1);
	test.ok(d.base16() == "05");

	d = toByte(0xff);//largest value
	test.ok(d.size() == 1);
	test.ok(d.base16() == "ff");
	d = toByte(255);
	test.ok(d.size() == 1);
	test.ok(d.base16() == "ff");

	try { d = toByte(-1); test.fail(); } catch (e) {}//too small
	try { d = toByte(256); test.fail(); } catch (e) {}//too big

	test.done();
}

exports.testEncode = function(test) {

	var d;

	//""valid
	//"0"invalid
	//"00"valid
	//"000"invalid

	//test
	//even and odd numbers
	//upper and lower case
	//characters outside 0-9a-f, like P


	try {
		d = base16("0");
		test.fail();
	} catch (e) {}


	test.done();
};

exports.testStringBuffer = function(test) {

	//here's how you do a string buffer in javascript
	var b = [];
	for (var i = 0; i < 100; i++) {
		b.push("" + i);
	}
	var s = b.join("");
	log(s);
	//so that's simple enough



	test.done();
}






//you still need to test base16, 32, quote, and strike
//confirm that base16 throws on odd characters or anything in there not 0-f

