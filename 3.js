

var log = console.log;


//types data needs to eat



//fundamental types for data

//boolean, true and false become "t" and "f"
//byte, use an int 0x00 0 through 0xff 255, this is nice (use a separate intToByte() byteToInt() that goes through buffer)
//int, text numerals like "786"
//string, from javascript, UTF8 through node buffer
//buffer, from node (and then something that can be converted into a buffer)
//object, anything that has a toBuffer() method on it

//your job is to turn each of these into a node buffer, from there turning it into a data will be easy






exports.testByteToInt = function(test) {

	function roundTrip(i) {
		var b = intToByte(i);
		return byteToInt(b);
	}

	test.ok(roundTrip(0) === 0);
	test.ok(roundTrip(5) === 5);
	test.ok(roundTrip(255) === 255);

	test.ok(roundTrip(0x00) === 0x00);
	test.ok(roundTrip(0xff) === 0xff);
	test.done();
};




log = console.log;


//trying to use date2 like a this pointer, without using new anywhere
var dataFunction = function dataSelf() {
	var me = dataSelf;

	var animal = "mammal";
	var year = 11;
	var personal = "secrets";

	return {
		animal:animal,
		year:year,
		me:me
	};
}

var d = dataFunction()
log(d.animal);
log(d.year);
log(d.me);//this works, you got it
log(d.me.personal);//doesn't work, you've got the function, but not the object contents




exports.testSomething = function(test) {
	test.ok(true);
	test.done();
};





