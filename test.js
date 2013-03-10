

var log = console.log;



var base = require('./base');//functions
var Data = require("./base").Data;//objects

var hex = base.fromBase16;

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
	d = new Data(base.intToByte(0x01));//javascript can't tell the difference between numbers and bytes, so you have to use inToByte(), which returns a node buffer
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
	var d = hex("0d0a");
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
	var d = hex("aabbccddeeff");
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

	var d = hex("aabbccddeeff");

	//find single byte
	test.ok(d.find(hex("aa")) == 0);//first
	test.ok(d.find(hex("bb")) == 1);//second
	test.ok(d.find(hex("ff")) == 5);//last
	test.ok(d.find(hex("00")) == -1);//not found

	//more bytes
	test.ok(d.find(hex("aabb")) == 0);//start
	test.ok(d.find(hex("bbccdd")) == 1);//inside
	test.ok(d.find(hex("eeff")) == 4);//end
	test.ok(d.find(hex("0011")) == -1);//not there at all
	test.ok(d.find(hex("ff00")) == -1);//off end

	//same
	test.ok(d.same(hex("aabbccddeeff")));//same
	test.ok(!d.same(hex("aab0ccddeeff")));//different
	test.ok(!d.same(hex("aabbccddeeff00")));//too long
	test.ok(!d.same(hex("aabbccddee")));//too short

	//starts
	test.ok(d.starts(hex("aabb")));//starts
	test.ok(!d.starts(hex("aa00")));//not found
	test.ok(!d.starts(hex("bbcc")));//has, but not at the start

	//ends
	test.ok(d.ends(hex("eeff")));//ends
	test.ok(!d.ends(hex("aa00")));//not found
	test.ok(!d.ends(hex("ddee")));//has, but not at the end

	//has
	test.ok(d.has(hex("aabb")));//start
	test.ok(d.has(hex("bbcc")));//middle
	test.ok(d.has(hex("eeff")));//end
	test.ok(!d.has(hex("0011")));//different
	test.ok(!d.has(hex("ff00")));//off end

	//find first and last
	d = hex("aa010203aaaaaaaa010203aa");
	test.ok(d.find(hex("010203")) == 1);//first instance
	test.ok(d.last(hex("010203")) == 8);//last instance

	test.done();
}

exports.testFind = function(test) {

	var d = hex("01aabbcc05060708aabbcc12");

	//first
	var s = d.split(hex("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(hex("01")));
	test.ok(s.tag.same(hex("aabbcc")));
	test.ok(s.after.same(hex("05060708aabbcc12")));

	//last
	var s = d.splitLast(hex("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(hex("01aabbcc05060708")));
	test.ok(s.tag.same(hex("aabbcc")));
	test.ok(s.after.same(hex("12")));

	//not found
	var s = d.splitLast(hex("0507"));
	test.ok(!s.found);//not found
	test.ok(s.before.same(hex("01aabbcc05060708aabbcc12")));//all before
	test.ok(s.tag.same(hex("")));
	test.ok(s.after.same(hex("")));

	test.done();
}


//you still need to test base16, 32, quote, and strike
//confirm that fromBase16 throws on odd characters or anything in there not 0-f

