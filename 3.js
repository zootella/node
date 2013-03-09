
var log = console.log;






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





