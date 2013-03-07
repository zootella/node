
// access the doubled module in the neighboring lib folder
var doubled = require('../lib/doubled');

// test the doubled.calculate() method
exports['calculate'] = function(test) {  // nodeunit passes us the test object
	test.equal(doubled.calculate(2), 4); // confirm you give it two, and it returns 4
	test.done();
};


