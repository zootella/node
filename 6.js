
log = console.log;



function ascii(c) { return c.charCodeAt(0); } // Turn "A" into 65
//log(ascii("A"));



// Given a number like 255 or 0xff, compose text to show the 32 bits with 8 base 16 characters like "000000ff (255)"
function sayBits(n) {
	var i = n;
	if (i < 0)
		i = 0xffffffff + i + 1;
	var s = i.toString(16);
	while (s.length < 8)
		s = "0" + s;
	return s + " (" + n + ")";
}



function left(i, bits) {
	if (bits < 0 || bits > 32) throw "range";
	var a = i << bits;
	log(sayBits(i) + " << " + bits + " is"); log(sayBits(a)); log();
	return a;
}

function right(i, bits) {
	if (bits < 0 || bits > 32) throw "range";
	var a = i >>> bits;
	log(sayBits(i) + " >> " + bits + " is"); log(sayBits(a)); log();
	return a;
}


exports.testSayBits = function(test) {

	test.ok(sayBits(-2147483648) === "80000000 (-2147483648)");//smallest possible 32 bit signed number
	test.ok(sayBits(-2147483647) === "80000001 (-2147483647)");
	test.ok(sayBits(-2147483646) === "80000002 (-2147483646)");
	test.ok(sayBits(-2147483645) === "80000003 (-2147483645)");

	test.ok(sayBits(-3) === "fffffffd (-3)");//small negative numbers
	test.ok(sayBits(-2) === "fffffffe (-2)");
	test.ok(sayBits(-1) === "ffffffff (-1)");
	test.ok(sayBits(0)  === "00000000 (0)");//zero
	test.ok(sayBits(1)  === "00000001 (1)");
	test.ok(sayBits(2)  === "00000002 (2)");
	test.ok(sayBits(3)  === "00000003 (3)");//small positive numbers

	test.ok(sayBits(2147483644) === "7ffffffc (2147483644)");
	test.ok(sayBits(2147483645) === "7ffffffd (2147483645)");
	test.ok(sayBits(2147483646) === "7ffffffe (2147483646)");
	test.ok(sayBits(2147483647) === "7fffffff (2147483647)");//largest possible 32 bit signed number

	test.done();
};

log(sayBits(2147483645));
log(sayBits(2147483646));
log(sayBits(2147483647));//maximum

log(sayBits(2147483648));// "80000000", same as -2147483648
log(sayBits(2147483649));// "80000001", same as -2147483647
log(sayBits(2147483650));// "80000002", same as -2147483646
log(sayBits(2147483651));// "80000003", same as -2147483645

log(sayBits(-2147483648));
log(sayBits(-2147483647));
log(sayBits(-2147483646));
log(sayBits(-2147483645));




exports.testShift = function(test) {

	test.ok(left(0x00000000, 0) == 0x00000000);//shifting zero is always zero
	test.ok(left(0x00000000, 1) == 0x00000000);

	test.ok(left(0x00000008, 1) == 0x00000010);//walking a bit up to the left
	test.ok(left(0x00000080, 1) == 0x00000100);
	test.ok(left(0x00000800, 1) == 0x00001000);
	test.ok(left(0x00008000, 1) == 0x00010000);
	test.ok(left(0x00080000, 1) == 0x00100000);
	test.ok(left(0x00800000, 1) == 0x01000000);
	test.ok(left(0x08000000, 1) == 0x10000000);

	test.ok(left(0x80000000, 1) == 0x00000000);//and then beyond the edge

//	test.ok(left(0x80000000, 1) == 0x00000000);

	test.done();
};






//write unit tests for url encoding, including international characters







//bitwise operators treat their operands as a sequence of 32 bits
//write a function that takes a var and shows it as a sequence of those bits

// f    f    f    f    f    f    f    f       8 base16 letters
// 0000 0000 0000 0000 0000 0000 0000 0000    32 bits

// 0 0000
// 1 0001 <
// 2 0010 <
// 3 0011
// 4 0100 <
// 5 0101
// 6 0110
// 7 0111
// 8 1000 <
// 9 1001
// a 1010
// b 1011
// c 1100
// d 1101
// e 1110
// f 1111

