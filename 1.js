
var log = console.log;

exports.testSomething = function(test) {
	test.ok(true);
	test.done();
};


//use node Buffer to make Data, Bay, Bin, and Convert
//from there, make Outline
//write nodeunit tests right alongside the other code



var convertStringToBuffer = function(string) {
	if (typeof string != "string") throw "type";
	return new Buffer(string); // Default utf8
}

var convertBufferToString = function(buffer) {
	if (!Buffer.isBuffer(buffer)) throw "type";
	return buffer.toString();
}




//make sure you understand how buffer.copy works
exports.testBufferCopy = function(test) {

	var source = new Buffer(8);
	var target = new Buffer(8);

	source[0] = 97;//ascii a
	source[1] = 97;//ascii a
	source[2] = 97 + 1;//ascii b
	source[3] = 97 + 2;//ascii c
	source[4] = 97 + 2;//ascii c
	source[5] = 97 + 2;//ascii c
	source[6] = 97 + 1;//ascii b
	source[7] = 97;//ascii a

	var start = 2;
	var hold = 5;
	source.copy(target, 0, start, start + hold);

	test.equal(target[0], 97 + 1);
	test.equal(target[1], 97 + 2);
	test.equal(target[2], 97 + 2);
	test.equal(target[3], 97 + 2);
	test.equal(target[4], 97 + 1);

	test.done();
};

exports.testBufferCompact = function(test) {

	var b = new Buffer(8);

	b[0] = 97;//ascii a
	b[1] = 97;//ascii a
	b[2] = 97 + 1;//ascii b
	b[3] = 97 + 2;//ascii c
	b[4] = 97 + 2;//ascii c
	b[5] = 97 + 2;//ascii c
	b[6] = 97 + 1;//ascii b
	b[7] = 97;//ascii a

	var start = 2;
	var hold = 5;
	b.copy(b, 0, start, start + hold);

	test.equal(b[0], 97 + 1);
	test.equal(b[1], 97 + 2);
	test.equal(b[2], 97 + 2);
	test.equal(b[3], 97 + 2);
	test.equal(b[4], 97 + 1);

	test.done();
};



exports.testStringToBufferLength = function(test) {

	var s = "\u00bd + \u00bc = \u00be";
	var buffer = new Buffer(s);

	var byteLength = Buffer.byteLength(s);
	var bufferLength = buffer.length;

	test.equal(byteLength, bufferLength);

	test.done();
};



//here are all the functions you need to write
//to data
//data byte(n)
//data base16(s)
//data base32(s) //node provides
//data base62(s)
//data base64(s) //node provides

//here are all the methods you need to write
//from data
//number d.get(i), data d.clip(i, 1)
//string d.base16();
//string d.bsae32(); //node provides
//string d.bsae62();
//string d.base64(); //node provides









