



/*

var newColor = function() {
	var o = {};

	var color = 'green';

	o.setColor = function(c) {
		color = c;
	}

	o.getColor = function() {
		return color;
	}

	return o;
};

var newTiger = function() {
	var o = {};

	var color = newColor();
	color.setColor('yellow');

	var name = 'Tony';

	o.describe = function() {
		return name + ', who is ' + color.getColor();
	}

	return o;
};

var newElephant = function() {
	var o = {};

	var color = newColor();
	color.setColor('gray');

	var name = 'Dumbo';

	o.describe = function() {
		return name + ', who is ' + color.getColor();
	}

	return o;
};

var tiger = newTiger();
var elephant = newElephant();

console.log(tiger.describe());
console.log(elephant.describe());

*/






//this works
//so keep it
//and figure out how to do pulse in a similar way
//the program will have a list of all the close objects
//and maybe just try to call pulse() on them
//which is a function that needs to get defined not in newClose, but in the objects that have a clo member


var list = [];



var newClose = function() {
	var o = {};
	list.push(o);

	var c = false;
	o.closed = function() { return c; };
	o.already = function() {
		if (c) return true;
		c = true;
		return false;
	};

	o.demo = function() {
		console.log('demo');
	}

	return o;
}

var newFile = function() {
	var o = {};

	var clo = newClose();
	o.closed = function() { return clo.closed(); }
	o.close = function() {
		if (clo.already()) return;

	};

	clo.pulse = function() {
		console.log('pulse file');
	}

	return o;
}

var newSocket = function() {
	var o = {};

	var clo = newClose();
	o.closed = function() { return clo.closed(); }
	o.close = function() {
		if (clo.already()) return;

	};

	clo.pulse = function() {
		console.log('pulse socket');
	}

	return o;
}



var print = function() {
	console.log('file is ' + (file.closed() ? 'closed' : 'open'));
	console.log('socket is ' + (socket.closed() ? 'closed' : 'open'));
	console.log();
};






console.log('count of close objects: ' + list.length);
var file = newFile();
console.log('count of close objects: ' + list.length);
var socket = newSocket();
console.log('count of close objects: ' + list.length);
console.log('made objects');
print();

socket.close();
console.log('closed socket');
print();

file.close();
console.log('closed file');
print();

for (var o in list) {
	o.demo();
}




/*

var mixClose = function(hide) {

	hide.already = function() {
		hide.c = 'closed';
	};
};



var newFile = function() {
	var o = {};
	var c = 'open file';
	mixClose(this);

	o.close = function() {
		already();

	};

	o.say = function() {
		console.log(c);
	};

	return o;
}

var newSocket = function() {
	var o = {};
	var c = 'open socket';
	mixClose(this);

	o.close = function() {
		already();

	};

	o.say = function() {
		console.log(c);
	};

	return o;
}





var file = newFile();
var socket = newSocket();
console.log();
console.log('made objects');

file.say();
socket.say();

file.close();
console.log();
console.log('closed file');

file.say();
socket.say();

socket.close();
console.log();
console.log('closed socket');

file.say();
socket.say();






/*
var newBase = function() {
	var o = {};

	o.log = function(s) { console.log(s); } // Shortcut to log

	return o;
};


var addMore = function(o) {

	o.more1 = function() {
		console.log('more 1');
	}

	o.more2 = function() {
		console.log('more 2');
	}

	o.log = function(s) {
		console.log(s);
	}

	return o;//for chaining
}


var newCustomDefault = function(setA) { return newCustom(setA, 'default b'); }
var newCustom = function(setA, setB) {
	var o = {};
	addMore(this);//mix in some new private methods and variables even

	var a = setA;
	var b = setB;

	o.a = function() { return a; }
	o.b = function() { return b; }

	o.say = function() {
		log('hi');
		return a + ' ' + b;
	}

	return o;
};


var c1 = newCustom('a', 'b');
console.log(c1.say());

var c2 = newCustomDefault('a');
console.log(c2.say());


*/





/*

// Calculate the average of a number of values as they are produced
var newAverage = function() {
	var o = {};

	var n       = 0; o.n       = function() { return n; }       // How many values we have, 0 before you add one
	var total   = 0; o.total   = function() { return total; }   // The total sum of all the given values
	var minimum = 0; o.minimum = function() { return minimum; } // The smallest value we have seen, 0 before we have any values
	var maximum = 0; o.maximum = function() { return maximum; } // The largest value we have seen, 0 before we have any values
	var recent  = 0; o.recent  = function() { return recent; }  // The most recent value you added, 0 before we have any values

	// Record a new value to make it a part of this average
	o.add = function(value) {
		n++; // Count another value
		total += value; // Add the value to our total
		if (n === 1 || value < minimum) minimum = value; // First or smallest value
		if (n === 1 || value > maximum) maximum = value; // First or largest value
		recent = value; // Remember the most recent value
	},

	// The current average, 0 before we have any values
	o.average = function() {
		if (n === 0) return 0;
		return total / n;
	},

	// The current average in thousandths, given 4, 5, and 6, the average is 5000
	o.averageThousandths = function() { return averageMultiply(1000); },
	// The current average multiplied by the given number
	o.averageMultiply = function(multiply) {
		if (n === 0) return 0;
		return multiply * total / n;
	},

	// Text that describes the current average, like "5.000", "Undefined" before we have any values
	o.say = function() {
		if (n === 0) return 'Undefined';

		return o.average();

		return describe.decimal(averageThousandths(), 3);
	};

	return o;
};

var a = newAverage();
a.add(4);
a.add(5);
a.add(6);
console.log(a.say());//5

var b = newAverage();
b.add(0);
b.add(0);
b.add(1);
console.log(b.say());//.333

*/

/*
//bring in describe somehow, probably as a node module at this point, and then just see if that works later or not

// Calculate the average of a number of values as they are produced
var Average = function () {

	var n;       // How many values we have, 0 before you add one
	var total;   // The total sum of all the given values
	var minimum; // The smallest value we have seen, 0 before we have any values
	var maximum; // The largest value we have seen, 0 before we have any values
	var recent;  // The most recent value you added, 0 before we have any values

	return {
		n:       function () { return n; },
		total:   function () { return total; },
		minimum: function () { return minimum; },
		maximum: function () { return maximum; },
		recent:  function () { return recent; },

		// Record a new value to make it a part of this average
		add: function (value) {
			n++; // Count another value
			total += value; // Add the value to our total
			if (n === 1 || value < minimum) minimum = value; // First or smallest value
			if (n === 1 || value > maximum) maximum = value; // First or largest value
			recent = value; // Remember the most recent value
		},

		// The current average, 0 before we have any values
		averageDecimal: function () {
			if (n === 0) return 0;
			return total / n;
		},

		// The current average, rounded down to a whole number, 0 before we have any values
		averageNumber: function () {
			if (n === 0) return 0;
			return Math.floor(total / n);
		},

		// The current average in thousandths, given 4, 5, and 6, the average is 5000
		averageThousandths: function () { return averageMultiply(1000); },
		// The current average multiplied by the given number
		averageMultiply: function (multiply) {
			if (n === 0) return 0;
			return multiply * total / n;
		},

		// Text that describes the current average, like "5.000", "Undefined" before we have any values
		say: function () {
			if (n === 0) return 'Undefined';
			return describe.decimal(averageThousandths(), 3);
		}
	};
};






//here
console.log('hi');



//and then write the tests right here!
//and run them right now from the command line
//make sure that floor thing works



//then, figure out the best/right way to use an Average in code in another file


*/




