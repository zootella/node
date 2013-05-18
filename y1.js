
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















// Turn base 62-encoded text back into the data it was made from
function base62(s, bay) {
	var p = Parse(bay);
	try {

		// Loop for each character in the text
		var c;           // The character we are converting into bits
		var code;        // The bits the character gets turned into
		var hold = 0;    // A place to hold bits from several characters until we have 8 and can write a byte
		var bits = 0;    // The number of bits stored in the right side of hold right now
		for (var i = 0; i < s.length; i++) {

			// Get a character from the text
			c = s.get(i);
			if      (c.range("0", "9")) code = c.code() - "0".code();      // '0'  0 000000 through '9'  9 001001
			else if (c.range("a", "z")) code = c.code() - "a".code() + 10; // 'a' 10 001010 through 'z' 35 100011
			else if (c.range("A", "Y")) code = c.code() - "A".code() + 36; // 'A' 36 100100 through 'Y' 60 111100
			else if (c.range("Z", "Z")) code = 61;                         // 'Z' indicates 61 111101, 62 111110, or 63 111111 are next, we will just write four 1s
			else throw "data";                                             // Invalid character

			// Insert the bits from code into hold
			if (code == 61) { hold = (hold << 4) | 15;   bits += 4; } // Insert 1111 for 'Z'
			else            { hold = (hold << 6) | code; bits += 6; } // Insert 000000 for '0' through 111100 for 'Y'

			// If we have enough bits in hold to write a byte
			if (bits >= 8) {

				// Move the 8 leftmost bits in hold to our Bay object
				p.add(toByte((hold >>> (bits - 8)) & 0xff));
				bits -= 8; // Remove the bits we wrote from hold, any extra bits there will be written next time
			}
		}
		return p.check(same, toBase62, s);

	} catch (e) { p.reset(); throw e; }
}































