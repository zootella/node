
var log = console.log;



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



var newData = function(add) {

	if (!add) {

	} else if (typeof add == "string") {

	}



	function toBuffer() {
	}


	return {};
}


var newObject = function() {

	return {};
};






var bay = newBay();


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






exports.testSomething = function(test) {
	test.equal(5, 5, "you can write a note here");
	test.done();
};








