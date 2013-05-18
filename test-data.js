
var log = console.log;

var data = require("./data");//functions
var Size = data.Size;
var Data = data.Data;
var toByte = data.toByte;
var base16 = data.base16;
var base32 = data.base32;
var base62 = data.base62;
var base64 = data.base64;
var Bay = data.Bay;
var mediumBin = data.mediumBin;
var bigBin = data.bigBin;
var testBin = data.testBin;
var sortData = data.sortData;

var encrypt = require("./encrypt");
var randomData = encrypt.randomData;



//ok, now let's write some tests!
//write these tests like a kids story that shows how easy it is to do powerful stuff with your library
//for instance, start out in data by saying, what a data object is, why you might want to make one
//and then say, you can make a data object from anything that has binary data inside it














exports.testBufferShift = function(test) {

	test.done();
}

exports.testBufferCopy = function(test) {

	test.done();
}



















//   ____        _        
//  |  _ \  __ _| |_ __ _ 
//  | | | |/ _` | __/ _` |
//  | |_| | (_| | || (_| |
//  |____/ \__,_|\__\__,_|
//                        

exports.testType = function(test) {

	var d = Data();
	var b = Bay();

	d.isData();//here's a way to tell if the var you've been given is a Data object
	b.isBay();

	try { d.isBay(); test.fail(); } catch (e) { test.ok(e.name == "TypeError"); }
	try { b.isData(); test.fail(); } catch (e) { test.ok(e.name == "TypeError"); }

	test.done();
}

exports.testDataMake = function(test) {

	//make an empty data
	var d;
	d = Data();
	test.ok(!d.size());

	//boolean
	d = Data(true);
	test.ok(d.toString() == "t");
	d = Data(false);
	test.ok(d.toString() == "f");

	//byte
	d = new toByte(0x01);//javascript can't tell the difference between numbers and bytes, so you have to use toByte(), which returns a Data object
	test.ok(d.base16() == "01");

	//number
	d = Data(123);
	test.ok(d.toString() == "123");
	d = Data(-5);
	test.ok(d.toString() == "-5");
	d = Data(1.20);
	test.ok(d.toString() == "1.2");//note how it chops off the unnecessary trailing zero

	//string
	d = Data("ab\r\n");
	test.ok(d.base16() == "61620d0a");//ascii characters a and b are 0x61 and 0x62

	//buffer
	var b = new Buffer("00ff01aa", "hex");
	d = Data(b);
	test.ok(d.base16() == "00ff01aa");

	test.done();
};

exports.testDataCopy = function(test) {

	var buffer = new Buffer("00aa0000", "hex");//make a buffer that has aa in it
	var looking = Data(buffer);//make a data that looks at it
	var copied = looking.copyMemory();//copy the bytes in memory to a new data object

	buffer.writeUInt8(0xbb, 1);//change the aa to bb

	test.ok(looking.base16() == "00bb0000");//looking sees the change, while
	test.ok(copied.base16() == "00aa0000");//copied is protected from it

	test.done();
};

exports.testDataOut = function(test) {

	//buffer
	var d = base16("0d0a");
	var b = d.toBuffer();
	test.ok(b.readUInt8(0) == 0x0d);
	test.ok(b.readUInt8(1) == 0x0a);

	//string
	d = Data("hello");
	var s = d.toString();
	test.ok(s == "hello");

	//number
	d = Data(786);
	var i = d.toNumber();
	test.ok(i == 786);

	//boolean
	d = Data(false);
	var f = d.toBoolean();
	test.ok(!f);

	test.done();
};

exports.testDataSize = function(test) {

	//empty
	var d = Data();
	test.ok(!d.size());
	test.ok(!d.hasData());
	test.ok(d.isEmpty());

	//full
	d = Data("hi");
	test.ok(d.size() == 2);
	test.ok(d.hasData());
	test.ok(!d.isEmpty());

	//unicode
	var s = "\u4e00\u4e8c\u4e09"//chinese one, two, three
	d = Data(s);
	test.ok(s.length == 3);//3 unicode characters become
	test.ok(d.size() == 9);//9 bytes of utf8 data

	//unicde in literals works, too
	var s2 = "一二三";//chinese one, two, three
	var d2 = Data(s2);
	test.ok(d.same(d2));
	test.ok(d.base16() == "e4b880e4ba8ce4b889");//each triple starts with byte e4

	test.done();
};

exports.testDataClip = function(test) {

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
	c = d.clip(0, 0); test.ok(c.base16() == "");//clipping 0 from the start is ok
	c = d.clip(6, 0); test.ok(c.base16() == "");//clipping 0 from the end is ok
	try { d.clip(6, 1); test.fail(); } catch (e) { test.ok(e == "chop"); }//clipping 1 from the end is not
	try { d.clip(7, 0); test.fail(); } catch (e) { test.ok(e == "chop"); }//clipping 0 from beyond the end is not

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
	} catch (e) { test.ok(e == "chop"); }//throws chop

	try { d.get(-1); test.fail(); } catch (e) { test.ok(e == "chop"); }//before the start
	try { d.get(6); test.fail(); } catch (e) { test.ok(e == "chop"); }//after the end

	try { d.clip(-1, 2); test.fail(); } catch (e) { test.ok(e == "chop"); }//sticking out before the start
	try { d.clip(-2, 2); test.fail(); } catch (e) { test.ok(e == "chop"); }//entirely before the start
	try { d.clip(5, 2); test.fail(); } catch (e) { test.ok(e == "chop"); }//sticking out after the end
	try { d.clip(6, 2); test.fail(); } catch (e) { test.ok(e == "chop"); }//entirely after the end

	test.done();
}

exports.testDataFind = function(test) {

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

exports.testDataCut = function(test) {

	var d = base16("01aabbcc05060708aabbcc12");

	//first
	var s = d.cut(base16("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(base16("01")));
	test.ok(s.tag.same(base16("aabbcc")));
	test.ok(s.after.same(base16("05060708aabbcc12")));

	//last
	var s = d.cutLast(base16("aabbcc"));
	test.ok(s.found);
	test.ok(s.before.same(base16("01aabbcc05060708")));
	test.ok(s.tag.same(base16("aabbcc")));
	test.ok(s.after.same(base16("12")));

	//not found
	var s = d.cutLast(base16("0507"));
	test.ok(!s.found);//not found
	test.ok(s.before.same(base16("01aabbcc05060708aabbcc12")));//all before
	test.ok(s.tag.same(base16("")));
	test.ok(s.after.same(base16("")));

	test.done();
}

exports.testDataSay = function(test) {

	var d = Data("\r\n");
	test.ok(d.toString() == "\r\n");
	test.ok(d.say() == "0d0a");
	test.ok(d.base16() == "0d0a");

	test.done();
}

exports.testClip = function(test) {

	var c = Data("abcde").take();//wrap a clip around 5 ascii bytes
	test.ok(c.data().toString() == "abcde");//look at them
	test.ok(c.size() == 5);//check the size
	test.ok(!c.isEmpty());
	test.ok(c.hasData());

	var c2 = c.copy();//make a copy that we can change separately

	c.remove(2);//remove the first 2 bytes
	test.ok(c.data().toString() == "cde");
	test.ok(c.size() == 3);

	c.remove(3);//remove all the others
	test.ok(c.isEmpty());

	test.ok(c2.size() == 5);//confirm the copy didn't change

	c2.remove(0);//removing nothing is ok
	test.ok(c2.size() == 5);

	try {
		c2.remove(6);//try to remove too much
		test.fail();
	} catch (e) { test.ok(e == "chop"); }//make sure we got chop
	test.ok(c2.size() == 5);//and that didn't change the clip

	c2.keep(4);//use keep instead of remove
	test.ok(c2.size() == 4);
	test.ok(c2.data().toString() == "bcde");

	c2.remove(1);
	test.ok(c2.size() == 3);
	test.ok(c2.data().toString() == "cde");

	c2.keep(1);
	test.ok(c2.size() == 1);
	test.ok(c2.data().toString() == "e");

	c2.keep(0);
	test.ok(c2.isEmpty());
	test.ok(c2.data().toString() == "");

	test.done();
}

exports.testClipRemoveData = function(test) {

	var c = Data("abcde").take();//wrap a clip around 5 ascii bytes
	var c2 = c.remove(2);//remove the first 2 bytes
	test.ok(c2.toString() == "ab");//confirm you got them
	test.ok(c.data().toString() == "cde");//and the clip is what remains

	test.done();
}

exports.testSortData = function(test) {

	//first, let's test some get
	var d = base16("00ff0a05");
	test.ok(d.get(0) == 0);
	test.ok(d.get(1) == 255);
	test.ok(d.get(2) == 10);
	test.ok(d.get(3) == 5);

	function same(s1, s2) {
		var d1 = base16(s1);
		var d2 = base16(s2);
		test.ok(d1.same(d2));//use find also
		test.ok(sortData(d1, d2) == 0);
	}
	function order(s1, s2) {
		var d1 = base16(s1);
		var d2 = base16(s2);
		test.ok(sortData(d1, d2) < 0);
		test.ok(sortData(d2, d1) > 0);//reverse the order
	}

	same("", "");//same
	same("00", "00");
	same("00ff", "00ff");

	order("aaaaaa", "aaaabb");//different values, same size
	order("aaaaaa", "aabbaa");
	order("aaaaaa", "bbaaaa");
	order("00aaaa", "aa00aa");//lower bytes before do matter
	order("aaaaaa", "bb00aa");//lower bytes after don't

	order("", "00");//blank wins
	order("", "ff");
	order("", "0507");

	order("00", "0000");//shorter wins on first byte tie
	order("05", "0505");
	order("05", "0500");//doesn't matter what the second byte is
	order("05", "05ff");

	order("04", "0505");
	order("0505", "06");//smaller byte is more important than smaller size

	test.done();
}



























//   ____              
//  | __ )  __ _ _   _ 
//  |  _ \ / _` | | | |
//  | |_) | (_| | |_| |
//  |____/ \__,_|\__, |
//               |___/ 

exports.testBayExample = function(test) {

	var b = Bay();//simple common use
	b.add("a");
	b.add("b");
	b.add("c");
	test.ok(b.data().same(Data("abc")));

	b = Bay(base16("00aa00ff"));//larger use
	for (var i = 0; i < 100; i++)
		b.add(base16("2222222222222222"));
	b.add(base16("11bb11ee"));
	test.ok(b.size() == 808);
	test.ok(b.data().start(6).same(base16("00aa00ff2222")));
	test.ok(b.data().end(6).same(base16("222211bb11ee")));

	test.done();
}

exports.testBayPrepare = function(test) {

	var dataA = "aaaaaaaaaa";//10 bytes of ascii characters
	var dataB = "BBBBBBBBBB";
	var dataC = "cccccccccc";
	var dataD = "DDDDDDDDDD";
	var dataE = "eeeeeeeeee";
	var dataF = "FFFFFFFFFF";
	var dataG = "gggggggggg";
	var dataH = "HHHHHHHHHH";

	//inside prepare(), cover the four cases of make, enlarge, shift, and fill
	var b = Bay();
	test.ok(!b.size());//starts out empty
	test.ok(!b.hasData());

	b.add(dataA); test.ok(b.size() == 10);//prepare make, capacity is 10, the buffer fits its first contents perfectly
	test.ok(b.hasData());
	b.add(dataB); test.ok(b.size() == 20);//prepare enlarge, now the capacity is 64 bytes, with data in the first 20
	b.add(dataC); test.ok(b.size() == 30);//prepare fill
	b.add(dataD); test.ok(b.size() == 40);//prepare fill

	b.keep(17);//remove
	test.ok(b.size() == 17);
	test.ok(b.data().same(Data("cccccccDDDDDDDDDD")));

	b.add(dataE);//prepare fill
	test.ok(b.size() == 27);//capacity 64, start 23, hold 27, so there are 14 bytes of space at the end
	test.ok(b.data().same(Data("cccccccDDDDDDDDDDeeeeeeeeee")));
	b.add(dataF);//prepare fill
	test.ok(b.size() == 37);//now there are just 4 bytes of space at the end

	b.add(dataG);//prepare shift
	test.ok(b.size() == 47);
	test.ok(b.data().same(Data("cccccccDDDDDDDDDDeeeeeeeeeeFFFFFFFFFFgggggggggg")));

	b.add(dataH);//prepare fill
	test.ok(b.size() == 57);

	b.add(dataA);//prepare enlarge
	test.ok(b.size() == 67);//now the capacity is 67*3/2=100.5, floor down to 100
	test.ok(b.data().start(20).same(Data("cccccccDDDDDDDDDDeee")));
	test.ok(b.data().end(12).same(Data("HHaaaaaaaaaa")));

	b.keep(15);
	test.ok(b.size() == 15);
	test.ok(b.data().same(Data("HHHHHaaaaaaaaaa")));

	b.clear();
	test.ok(!b.size());
	test.ok(!b.hasData());
	test.ok(b.data().same(Data()));

	test.done();
}
























//   ____  _       
//  | __ )(_)_ __  
//  |  _ \| | '_ \ 
//  | |_) | | | | |
//  |____/|_|_| |_|
//                 

exports.testBinType = function(test) {

	//different things you can add from
	var b = mediumBin();
	b.add(mediumBin());//add from another bin
	b.add(Bay());//add from a bay
	b.add(Data().take());//add from a clip
	try {
		b.add(Data());//don't let the user add from a data
		test.fail();
	} catch (e) { test.ok(e == "type"); }

	test.done();
}

exports.testBinAdd = function(test) {

	var b = testBin();
	test.ok(b.capacity() == 8);

	//add from bin when empty
	var bin = testBin();
	bin.add(Data("abc").take());
	test.ok(b.size() == 0);
	test.ok(bin.size() == 3);
	b.add(bin);//because b is empty, the bins will swap buffers instead of copying memory
	test.ok(b.size() == 3);
	test.ok(bin.size() == 0);

	//add from bin when not empty
	bin.add(Data("de").take());
	test.ok(b.size() == 3);
	test.ok(bin.size() == 2);
	b.add(bin);//this time, we copy across the memory instead
	test.ok(b.size() == 5);
	test.ok(b.data().toString() == "abcde");
	test.ok(bin.size() == 0);

	b.keep(2);
	test.ok(b.size() == 2);
	test.ok(b.data().toString() == "de");

	//add from bay
	var bay = Bay("fgh");
	b.add(bay);
	test.ok(b.data().toString() == "defgh");
	test.ok(bay.isEmpty());//add() removed what the bin took from bay

	//add from clip
	var data = Data("ijk");
	var clip = data.take();//wrap a Clip object around data
	test.ok(clip.size() == 3);
	test.ok(b.hasSpace());
	b.add(clip);
	test.ok(clip.isEmpty());
	test.ok(b.data().toString() == "defghijk");//8 bytes, no more space
	test.ok(b.isFull());

	test.done();
}

exports.testBinOverflow = function(test) {

	var b = testBin();
	b.add(Data("aaaaa").take());
	test.ok(b.space() == 3);

	//setup a bin
	var bin = testBin();
	bin.add(Data("bbbbbbbb").take());
	//add from it
	b.add(bin);
	test.ok(b.data().toString() == "aaaaabbb");
	test.ok(bin.data().toString() == "bbbbb");
	//remove some
	b.remove(4);
	test.ok(b.data().toString() == "abbb");
	test.ok(b.size() == 4);

	//setup a bay
	var bay = Bay("cccccc");
	//add from it
	b.add(bay);
	test.ok(b.data().toString() == "abbbcccc");
	test.ok(bay.data().toString() == "cc");
	//remove some
	b.remove(3);
	test.ok(b.space() == 3);

	//setup a clip
	var clip = Data("ddddd").take();
	test.ok(clip.size() == 5);
	//add from it
	b.add(clip);
	test.ok(b.data().toString() == "bccccddd")
	test.ok(clip.size() == 2);

	test.done();
}

exports.testBinRecycle = function(test) {

	//use the recycle bin
	var b1 = mediumBin();//allocated
	b1.recycle();//recycled
	var b2 = mediumBin();//got from recycling
	var b3 = mediumBin();//allocated

	//can't add after recycling
	var b = mediumBin();
	b.add(Data("a").take());
	b.recycle();
	try {
		b.add(Data("a").take());
		test.fail();
	} catch (e) {}

	test.done();
}































//   _____                     _      
//  | ____|_ __   ___ ___   __| | ___ 
//  |  _| | '_ \ / __/ _ \ / _` |/ _ \
//  | |___| | | | (_| (_) | (_| |  __/
//  |_____|_| |_|\___\___/ \__,_|\___|
//                                    

exports.testEncodeByte = function(test) {

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

	try { d = toByte(-1); test.fail(); } catch (e) { test.ok(e == "bounds"); }//too small
	try { d = toByte(256); test.fail(); } catch (e) { test.ok(e == "bounds"); }//too big

	test.done();
}

exports.testEncodeBase = function(test) {

	function set(h) {

		var d = base16(h.s16);//make sure the text encoded all 4 ways becomes the same data
		test.ok(d.same(base32(h.s32)));
		test.ok(d.same(base62(h.s62)));
		test.ok(d.same(base64(h.s64)));

		test.ok(h.s16 == d.base16());//and make sure that data converts back into the same text
		test.ok(h.s32 == d.base32());
		test.ok(h.s62 == d.base62());
		test.ok(h.s64 == d.base64());
	}

	//blank is ok
	set({
		s16: "",
		s32: "",
		s62: "",
		s64: ""
	})

	//small test values
	set({
		s16: "89",// 1000 1001
		s32: "re",
		s62: "yg",
		s64: "iQ=="
	})
	set({
		s16: "89ab",// 1000 1001 1010 1011
		s32: "rgvq",
		s62: "yqI",
		s64: "ias="
	})

	//random 20 byte values
	set({
		s16: "06a4ce40189d297aed4657d0e524dd46c3831647",
		s32: "a2sm4qaytuuxv3kgk7iokjg5i3bygfsh",
		s62: "1Gjeg1ytanHJhBvgVijthIe35As",
		s64: "BqTOQBidKXrtRlfQ5STdRsODFkc="
	});
	set({
		s16: "19e6cd2733d87b4e7f04d43358bfc9c7a15027af",
		s32: "dhtm2jzt3b5u47ye2qzvrp6jy6qvaj5p",
		s62: "6urd9PfouQVZMjkcRyZYD7El0DHM",
		s64: "GebNJzPYe05/BNQzWL/Jx6FQJ68="
	});
	set({
		s16: "e96748c8c8361673feb0e2ed6870ba06defe819e",
		s32: "5ftursgigylhh7vq4lwwq4f2a3pp5am6",
		s62: "Wmt8OcwS5DfZH3yXmxMKwruZW1Dw",
		s64: "6WdIyMg2FnP+sOLtaHC6Bt7+gZ4="
	});
	set({
		s16: "c3c8f2f620e12b5c378a78c8f07416a073aa98ec",
		s32: "ypepf5ra4evvyn4kpdepa5awubz2vghm",
		s62: "MYzOZowUiJsdUFUOf1Q5G1PGFzI",
		s64: "w8jy9iDhK1w3injI8HQWoHOqmOw="
	});
	set({
		s16: "515746bf84532461fc8f5bcb6306c9d3d81f13af",
		s32: "kflunp4ekmsgd7eplpfwgbwj2pmb6e5p",
		s62: "klt6LUhj967YzRLboMr9QZo7NeL",
		s64: "UVdGv4RTJGH8j1vLYwbJ09gfE68="
	});

	//black and white
	set({
		s16: "00",
		s32: "aa",
		s62: "00",
		s64: "AA=="
	});
	set({
		s16: "ff",
		s32: "74",
		s62: "ZY",
		s64: "/w=="
	});
	set({
		s16: "0000",
		s32: "aaaa",
		s62: "000",
		s64: "AAA="
	});
	set({
		s16: "ffff",
		s32: "777q",
		s62: "ZZZY",
		s64: "//8="
	});
	set({
		s16: "00000000",
		s32: "aaaaaaa",
		s62: "000000",
		s64: "AAAAAA=="
	});
	set({
		s16: "ffffffff",
		s32: "777777y",
		s62: "ZZZZZZZY",
		s64: "/////w=="
	});
	set({
		s16: "0000000000000000",
		s32: "aaaaaaaaaaaaa",
		s62: "00000000000",
		s64: "AAAAAAAAAAA="
	});
	set({
		s16: "ffffffffffffffff",
		s32: "7777777777776",
		s62: "ZZZZZZZZZZZZZZZY",
		s64: "//////////8="
	});

	//stripy
	set({
		s16: "00",
		s32: "aa",
		s62: "00",
		s64: "AA=="
	});
	set({
		s16: "00ff",
		s32: "ad7q",
		s62: "0fY",
		s64: "AP8="
	});
	set({
		s16: "00ff00ff",
		s32: "ad7qb7y",
		s62: "0fY0ZY",
		s64: "AP8A/w=="
	});
	set({
		s16: "00ff00ff00ff00ff",
		s32: "ad7qb7ya74ap6",
		s62: "0fY0ZY0ZY0ZY",
		s64: "AP8A/wD/AP8="
	});
	set({
		s16: "00ff00ff00ff00ff00ff00ff00ff00ff",
		s32: "ad7qb7ya74ap6ah7ad7qb7ya74",
		s62: "0fY0ZY0ZY0ZY0ZY0ZY0ZY0ZY",
		s64: "AP8A/wD/AP8A/wD/AP8A/w=="
	});
	set({
		s16: "00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff00ff",
		s32: "ad7qb7ya74ap6ah7ad7qb7ya74ap6ah7ad7qb7ya74ap6ah7ad7q",
		s62: "0fY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY0ZY",
		s64: "AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8="
	});

	//test vectors from rfc 4648
	set({
		s16: "66",//"f"
		s32: "my",
		s62: "pw",
		s64: "Zg=="
	});
	set({
		s16: "666f",
		s32: "mzxq",
		s62: "pCY",
		s64: "Zm8="
	});
	set({
		s16: "666f6f",//"foo"
		s32: "mzxw6",
		s62: "pCZrM",
		s64: "Zm9v"
	});
	set({
		s16: "666f6f62",
		s32: "mzxw6yq",
		s62: "pCZrS8",
		s64: "Zm9vYg=="
	});
	set({
		s16: "666f6f6261",
		s32: "mzxw6ytb",
		s62: "pCZrS9x",
		s64: "Zm9vYmE="
	});
	set({
		s16: "666f6f626172",//"foobar"
		s32: "mzxw6ytboi",
		s62: "pCZrS9xsw",
		s64: "Zm9vYmFy"
	});

	test.done();
}

exports.testEncodeInvalid = function(test) {

	//uppercase
	test.ok(base16("0D0a").base16() == "0d0a");//base16 uppercase is ok
	test.ok(base32("ad7QB7y").base32() == "ad7qb7y");//base32 uppercase is ok, while base 62 and 64 are case sensitive

	//extra characters
	bad16(" 06a4ce40189d297aed4657d0e524dd46c3831647 ");//spaces aren't allowed
	bad32(" a2sm4qaytuuxv3kgk7iokjg5i3bygfsh ");
	bad62(" 1Gjeg1ytanHJhBvgVijthIe35As ");

	function bad16(s) { try { base16(s); test.fail(); } catch (e) { test.ok(e == "data"); } }

	bad16("0");//odd
	bad16("000");
	bad16("00000");
	bad16("f");
	bad16("fff");
	bad16("fffff");

	bad16("P");
	bad16("PV");

	bad16("x");
	bad16("xx");
	bad16("xyz");
	bad16("0g");//node 0.8 doesn't throw, but should, node 0.10 does
	bad16("0d0a0h0d0a");

	bad16(" 00ff");//space
	bad16("00ff ");
	bad16(" 00ff ");
	bad16("  00  ff  ");

	function bad32(s) { try { base32(s); test.fail(); } catch (e) { test.ok(e == "data"); } }

	bad32("1");//1 and 8 are illegal characters
	bad32("88");

	function bad62(s) { try { base62(s); test.fail(); } catch (e) { test.ok(e == "data"); } }

	bad62("--");//base62 doesn't use any puncutation at all

	function bad64(s) { try { base64(s); test.fail(); } catch (e) { test.ok(e == "data"); } }//you cant find anything to make node's base64 throw, but the round trip check works wonders

	bad64("AP8A/w");//require the trailing equals
	bad64("AP ! 8A/w==");//insert bad characters

	test.done();
};













var quote = data.quote;
var unquote = data.unquote;
var quoteCount = data.quoteCount;
var quoteMore = data.quoteMore;
var quoteIs = data.quoteIs;

exports.testQuoteUnquote = function(test) {

	function both(plain, quoted) {
		var p = Data(plain);//encode the given plain text as data using utf8
		test.ok(quote(p) == quoted);
		test.ok(unquote(quoted).same(p));
	}

	both('hi', '"hi"');//text
	both('\r\n', '0d0a');//binary
	both('Hello\r\n', '"Hello"0d0a');//mix

	both('"', '22');//quote
	both('"hello"', '22"hello"22');
	both('quote " character', '"quote "22" character"');






	//try a bunch of international stuff, see if later bytes in multibyte charcters get encoded as ascii or not

	//bring in the tests from junit here also, this is one rare area where you actually have some tests to port over

	test.done();
}

exports.testUnquoteInvalid = function(test) {


	//confirm common mistakes throw data




	test.done();
}

exports.testCount = function(test) {

	//confirm s starts with the given number of text bytes or data bytes
	function both(s, textBytes, dataBytes) {
		test.ok(quoteCount(Data(s), true) == textBytes);
		test.ok(quoteCount(Data(s), false) == dataBytes);
	}

	both("a",       1, 0);//only text
	both("abc",     3, 0);
	both("abc\r\n", 3, 0);//text first
	both("\r\nabc", 0, 2);//data first
	both("\r\n",    0, 2);//only data

	test.done();
}

exports.testMoreText = function(test) {

	function run(s, answer) {
		test.ok(quoteMore(Data(s)) == answer);//turn s into data and scan all its bytes
	}

	run("a", true);//one byte of text has more text
	run("\0", false);//one byte of data has more data

	run("aa\n", true);//majority rule
	run("a\r\n", false);

	run("a\n", false);//if its a tie, data wins
	run("ab\r\n", false);

	run("の", false);//international, treated as data

	test.done();
}

exports.testIsText = function(test) {

	//turn s into data in utf8, then get the first byte, and see if that byte is ascii space through tilde except quote
	function confirmText(s) { test.ok(quoteIs(Data(s).first())) }
	function confirmNotText(s) { test.ok(!quoteIs(Data(s).first())) }

	confirmText(" ");
	confirmText("a");
	confirmText("A");
	confirmText("7");
	confirmText("~");

	confirmNotText("\r");
	confirmNotText("\n");
	confirmNotText("\0");
	confirmNotText("の");//this splits into 3 bytes, the first of which is not text

	confirmNotText('"');//the quote charcter is special, treat it as data

	test.done();
}

















//here's the test you write for parse
//make a parse object, then have it parse some base16 text
//the first one works, confirm it's there
//the second one works, confirm 1 and 2 are there
//the third one starts out valid, but then goes invalid halfway through, confirm you get throws data, and 1 and 2 are still there
//the fourth one is valid, confirm what you have is 1, 2, 4



//a simpler test
//make a bay
//put "hi" in it
//parse some invalid text
//confirm it's just still "hi" in it








//    ___        _   _ _            
//   / _ \ _   _| |_| (_)_ __   ___ 
//  | | | | | | | __| | | '_ \ / _ \
//  | |_| | |_| | |_| | | | | |  __/
//   \___/ \__,_|\__|_|_|_| |_|\___|
//                                  




















