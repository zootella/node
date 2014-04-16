

var requireEvents = require("events");

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var now = requireMeasure.now;
var Time = requireMeasure.Time;
var Speed = requireMeasure.Speed;
var items = requireMeasure.items;

var requireState = require("./state");
var demo = requireState.demo;








//see how fast node can loop with events, three different ways
if (demo("set-timeout")) { eventSpeed("timeout"); }//~60 events/s
if (demo("set-immediate")) { eventSpeed("immediate"); }//~100k events/s
if (demo("process-next-tick")) { eventSpeed("tick"); }//node warning to use setImmediate instead

function eventSpeed(method) {

	var speed = Speed(Time.second);
	var start = now();
	var count = 0;
	var limit = 4*Time.second;

	log("this will take ", limit, "ms, using ", method, " method");
	once();

	function once() {
		if (!start.expired(limit)) {//still within the time limit

			//count another loop
			count++;
			speed.count();

			//run this again in a new event right away
			if      (method == "timeout")   setTimeout(once, 0);
			else if (method == "immediate") setImmediate(once);
			else if (method == "tick")      process.nextTick(once);
			else throw "argument";

		} else {//time's up

			//say how fast we went
			log("counted ", count, " loops in ", start.age(), "ms");
			log("measured speed of ", speed.speed(Time.second), " loops/second");
		}
	}
}












//function, event, process.nextTick, setTimeout, setImmediate, a resource that finishes on the first pulse, your code here
//generalized form that makes it easy to put in whatever new code you want
//maybe a function followed by an event
//says how many times in 4s rather than how long it takes to do x cycles
//use sayunits to make the output understandable
//have it run 3 times for 2 seconds each, putting out 3 numbers, so it can warm up properly



//===zeroith, the empty pulse case

if (demo("idea-p")) {

}


//have a first group of these that you can't stick your own code in, and only show the maximum speed of node
//have a second group where you can stick your own code in, which are slower
//have a third one where you just show the speed of pulse, a resource that finishes on the first pulse, and then creates a new one




/*
if (demo("loop")) {
	for (var i = 0; i < 8; i++) {

		var t = Date.now();
		var n = 0;

		while (true) {
			if (t + 1000 < Date.now()) break;
			n++;
		}

		log(items(n, "loop"), "/1second");
	}
}
*/






//node events are synchronous
//sending an event is just like calling a function, and a speed loop will cause a stack overflow

//this demo will log received before sent
if (demo("event")) {

	function f() {
		log("received");
	}

	var e = new requireEvents.EventEmitter();
	e.on("event name", f);

	e.emit("event name");
	log("sent");
}

//same thing, written as a test
exports.testEventSynchronous = function(test) {

	var s = "";

	function f() {
		s += "received;";
	}

	var e = new requireEvents.EventEmitter();
	e.on("event name", f);

	e.emit("event name");//works less like an event, more like just calling f()
	s += "sent;";

	test.ok(s == "received;sent;");//not the order you would expect
	test.done();
}







//we can't speed loop process.nextTick either, because node notices and complains
//"(node) warning: Recursive process.nextTick detected. This will break in the next  version of node. Please use setImmediate for recursive deferral."
//having f and g call each other doesn't avoid this, either
if (demo("tick")) {

	function tick() {
		log("logging this slows it down enough it doesn't complain immediately");
		process.nextTick(tick);
	}

	tick();
}



//you need to make a demo not an if, but a function, like a test




/*
if (demo("timeout")) { demoTimeout(); }
function demoTimeout() {

	var loop = 0;
	var t;
	var n;
	start();

	function start() {
		t = Date.now();
		n = 0;
		timeout();
	}

	function timeout() {
		if (t + 1000 < Date.now()) {
			log(items(n, "timeout"), "/1second");
			loop++;
			if (loop < 8) start();
		} else {
			n++;
			setTimeout(timeout, 0);
		}
	}
}
*/




if (demo("timeout")) { demoTimeout("timeout"); }
if (demo("immediate")) { demoTimeout("immediate"); }
if (demo("tick7")) { demoTimeout("tick"); }
function demoTimeout(method) {

	var l = 0;
	var t = Date.now();
	var n = 0;
	set();

	function set() {
		if      (method == "timeout")   setTimeout(f, 0);
		else if (method == "immediate") setImmediate(f);
		else if (method == "tick")      process.nextTick(f);
	}

	function f() {
		if (t + 1000 < Date.now()) {
			log(items(n, method), "/1second");
			l++;
			if (l < 8) {
				t = Date.now();
				n = 0;
				set();
			}
		} else {
			n++;
			set();
		}
	}
}

//pulse should use setImmediate because it's fast and the other options don't work
//events are synchronous, setTimeout is slow, and process.nextTick has a warning





/*


if (demo("immediate")) {
	for (var i = 0; i < 8; i++) {

		var t = Date.now();
		var n = 0;

		function immediate() {
			if (t + 1000 < Date.now()) {
				log(items(n, "immediate"), "/1second");
			} else {
				n++;
				setImmediate(timeout);
			}
		}

		immediate();
	}
}
*/

//your second f clobbers the first because demos are in if statements, not functions
//be careful about this









function yourAsynchronousCodeHere() {

}
function asynchronousCodeFinished() {

}
	



//basic event emitter demo















