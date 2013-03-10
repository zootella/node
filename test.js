

var log = console.log;



var base = require('./base');//functions
var Data = require("./base").Data;//objects

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

	test.done();
};


