

var log = console.log;



//see if you can make a function that will hold onto a this pointer
//and have that work if you call it with new or not


var Demo = function (a) {

	//this

	//that
	var that = this;

	//me
	var me;
	var setMe = function () { me = this; }
	setMe();


	//setup
	var holding = a;
	function getHolding() { return holding; }


	//methods
	function getThis() { return this; }
	function getThat() { return that; }
	function getMe() { return me; }

	return {
		getHolding:getHolding,

		getThis:getThis,
		getThat:getThat,
		getMe:getMe
	}
}



var d1 = Demo("apple");
var d2 = Demo("banana");

log();
log("d1 holding: " + d1.getHolding());
log("d1 this:    " + d1.getThis().getHolding());
//log("d1 that:    " + d1.getThat().getHolding());
//log("d1 me:      " + d1.getMe().getHolding());

log();
log("d2 holding: " + d2.getHolding());
log("d2 this:    " + d2.getThis().getHolding());
//log("d2 that:    " + d2.getThat().getHolding());
//log("d2 me:      " + d2.getMe().getHolding());

var d3 = new Demo("red");
var d4 = new Demo("green");

log();
log("d3 holding: " + d3.getHolding());
log("d3 this:    " + d3.getThis().getHolding());
//log("d3 that:    " + d3.getThat().getHolding());
//log("d3 me:      " + d3.getMe().getHolding());

log();
log("d4 holding: " + d4.getHolding());
log("d4 this:    " + d4.getThis().getHolding());
//log("d4 that:    " + d4.getThat().getHolding());
//log("d4 me:      " + d4.getMe().getHolding());


/*
//the revealing module pattern from
http://www.joezimjs.com/javascript/javascript-closures-and-the-module-pattern/

var Module = (function() {
	// All functions now have direct access to each other
	var privateFunc = function() {
			publicFunc1();
	};
 
	var publicFunc1 = function() {
			publicFunc2();
	};
 
	var publicFunc2 = function() {
			privateFunc();
	};
 
	// Return the object that is assigned to Module
	return {
			publicFunc1: publicFunc1,
			publicFunc2: publicFunc2
	};
}());
*/
