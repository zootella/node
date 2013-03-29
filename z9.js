





var makeCounter = function() {
	var o = {};

	//the current count
	o.getCount = function() { return count; }
	var count = 0;

	//count one more
	o.increment = function() {
		count++;
	}

	return o;
};

var c = makeCounter();
console.log(c.getCount());
c.increment();
console.log(c.getCount());
c.increment();
console.log(c.getCount());




/*




var makePerson = function(setName, setAge) {
	var o = {};


	//private members
	var name = setName;
	var age = setAge;

	//public methods
	o.say = function() {
		return name + ' is ' + age;
	}
	o.birthday = function() {
		incrementAge();//a public method can call a private one
	}

	//private methods
	incrementAge = function() {
		age++;//a private method can access and set a private member
	}


	return o;
};

var a;
a = makePerson('Adam', 3);
console.log(a.say()); //3

a.birthday();
console.log(a.say()); //4






/*
//an example object
var Example = function() {

	//private members
	var s = '';

	//private methods
	function privateNote(note) {
		s += 'private ' + note + ', ';
	}

	function privateDo() {
		privateNote('A');
		publicNote('B');
	}

	//public methods
	return {

		publicNote: function (note) {
			s += 'public ' + note + ', ';
		},

		publicDo: function () {
			privateNote('C');
			publicNote('D');
		},

		say: function () {
			return s;
		}
	};
};


*/





