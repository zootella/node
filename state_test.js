
var platformEvent = require("events");
var platformFile = require("fs");

require("./load").load("state_test", function() { return this; });








//   ____                       
//  |  _ \  ___ _ __ ___   ___  
//  | | | |/ _ \ '_ ` _ \ / _ \ 
//  | |_| |  __/ | | | | | (_) |
//  |____/ \___|_| |_| |_|\___/ 
//                              

//example of synchronous code
if (demo("example")) { example(); }
function example() {

	function f() {//example synchronous code makes a guid
		log("a unique value: ", unique().base62());
	}

	f();//just call our synchronous function once
}

//example using that synchronous code with speedLoop
if (demo("example-loop")) { exampleLoop(); }
function exampleLoop() {

	function f() {//example synchronous code makes a guid
		var s = unique().base62();
	}

	speedLoop(f, "unique");//give our synchronous function to speed loop, which will call it over and over
}

//example of asynchronous code
if (demo("example-next")) { exampleNext(); }
function exampleNext() {

	function f() {//example asynchronous code looks at a file on the disk
		platformFile.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			log("exception '#', resolved path '#'".fill(e, resolvedPath));
		}
	}

	f();//just call our asynchronous function once
}

//example using that asynchronous code with speedLoopNext
if (demo("example-loop-next")) { exampleLoopNext(); }
function exampleLoopNext() {

	function f() {//example asynchronous code looks at a file on the disk
		platformFile.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			callWhenDone();
		}
	}

	var callWhenDone = speedLoopNext(f, "look");//get the function we have to call when our code is done
	f();//call our asynchronous function once to get the whole thing started
}

//empty speedLoop to see maximum speed
if (demo("example-empty")) { exampleEmpty(); }
function exampleEmpty() {

	function f() {
	}

	speedLoop(f, "empty");
}

//empty speedLoopNext to see maximum speed
if (demo("example-empty-next")) { exampleEmptyNext(); }
function exampleEmptyNext() {

	function f() {
		callWhenDone();//ordinarily, f would call callWhenDone in a callback, but it's ok to call it directly too
	}

	var callWhenDone = speedLoopNext(f, "empty");
	f();
}




//write duplicates or replacements for all these, starting with speed-timeout










//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

//run code that throws an exception
if (demo("throw")) { demoThrow(); }
function demoThrow() {

	Data("hello").start(6);//throws chop
}

//catch an exception and sand it to mistakeLog(e)
if (demo("mistake-log")) { demoMistakeLog(); }
function demoMistakeLog() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }

	log("code after runs");
}

//catch an exception and sand it to mistakeStop(e)
if (demo("mistake-stop")) { demoMistakeStop(); }
function demoMistakeStop() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }

	log("code after does not run");
}

//code in a timeout function that throws an exception
//confirms that an uncaught exception in a timeout function ends the node process, even if there are more events that might work later
if (demo("timeout-throw")) { demoTimeoutThrow(); }
function demoTimeoutThrow() {
	log("setting timeouts for 2 and 4 seconds from now");

	setTimeout(function() {//in 4 seconds, this function will run successfully

		log("ran after 4 seconds");//never runs, the uncaught exception at 2 seconds ends the node process

	}, 4000);

	setTimeout(function() {//in 2 seconds, this function will run and throw

		log("ran after 2 seconds");
		Data("hello").start(6);//throws chop

	}, 2000);
}










//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

exports.testIf = function(test) {

	var c;
	test.ok(!c);//not defined yet, false

	c = undefined;
	test.ok(!c);//set to undefined, false

	c = null;
	test.ok(!c);//set to null, false

	c = {};
	test.ok(c);//set to empty hash, true

	done(test);
}

exports.testMissing = function(test) {

	//trying out some ways to tell between false and undefined
	var u;//undefined

	test.ok(u == undefined);//both regular == and super cautious === seem to do it
	test.ok(!(u == true));
	test.ok(!(u == false));

	test.ok(u === undefined);
	test.ok(!(u === true));
	test.ok(!(u === false));

	//new empty object
	var o = {};
	o.yes = true;//make yes or no
	o.no = false;

	test.ok(o.yes);
	test.ok(!o.no);
	test.ok(!o.missing);//doesn't throw, o.missing is undefined which becomes false

	test.ok(o.yes       == true);//true
	test.ok(!(o.no      == true));//false
	test.ok(!(o.missing == true));//false

	test.ok(o.yes       != undefined);//true
	test.ok(o.no        != undefined);//true
	test.ok(!(o.missing != undefined));//false

	done(test);
}

//example object that needs to get closed
function Resource(setName) {

	var _name = setName;//save the given name
	function text() {//describe this resource as text
		if (_name) return _name;
		else       return "untitled resource";
	}

	var state = makeState();//a resource has state, meaning
	state.close = function() {//we have to remember to close it
		if (state.already()) return;
	};
	state.pulse = function() {//and the program will pulse it for us
		var s = "pulse";
		if (_name) s += " " + _name;
		log(s);
	}

	return listState({//remember to pass the return object through listState()
		state:state,
		text:text
	});
};

exports.testClose = function(test) {

	var r = Resource();//make a new object that we must close
	test.ok(isOpen(r));//starts out open
	test.ok(!isClosed(r));
	close(r);//close it
	test.ok(!isOpen(r));//confirm it's closed
	test.ok(isClosed(r));

	var u;//not set to anything
	test.ok(!isOpen(u));//neither open nor closed
	test.ok(!isClosed(u));

	var n = null;//set to null
	test.ok(!isOpen(n));
	test.ok(!isClosed(n));

	var o = Data();//set to an object that doesn't need to be closed
	test.ok(!isOpen(o));
	test.ok(!isClosed(o));

	done(test);
}

exports.testCycle = function(test) {

	var r;
	test.ok(!r);//not made yet
	r = Resource();
	test.ok(isOpen(r));//new and open
	close(r);
	test.ok(isClosed(r));//closed
	r = null;
	test.ok(!r);//discarded

	done(test);
}

exports.testCloseTwo = function(test) {

	var r1 = Resource();//make two resources
	var r2 = Resource();
	test.ok(isOpen(r1));//both start out open
	test.ok(isOpen(r2));

	close(r2);//close one
	test.ok(isOpen(r1));//confirm this didn't change the first one
	test.ok(isClosed(r2));

	close(r1);//close the other one
	test.ok(isClosed(r1));//now they're both closed
	test.ok(isClosed(r2));

	done(test);
}

















//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

//an object getting pulsed
if (demo("pulse")) { demoPulse(); }
function demoPulse() {

	function ExamplePulse() {

		var state = makeState();
		state.close = function() {
			if (state.already()) return;
		};
		state.pulse = function() {
			log("pulse");
		}

		return listState({
			state:state
		});
	};

	log("here we go");
	var u = ExamplePulse();
}

//code in a pulse function that throws an exception
//pulse will catch the exception so we don't need to catch it here
if (demo("pulse-throw")) { demoPulseThrow(); }
function demoPulseThrow() {

	function ExamplePulseThrow() {

		var state = makeState();
		state.close = function() {
			if (state.already()) return;
		};
		state.pulse = function() {
			Data("hello").start(6);//throws chop
		}

		return listState({
			state:state
		});
	};

	var u = ExamplePulseThrow();//make a new object which will throw on the first pulse
}

//make an object that needs to be closed, and close it
if (demo("close")) { demoClose(); }
function demoClose() {

	var m = Resource();
	close(m);
	closeCheck();
	//with no more code to run here, the process exits normally
}

//make an object that needs to be closed, and forget to close it
if (demo("forget")) { demoForget(); }
function demoForget() {

	var m = Resource("forgotten resource");
	closeCheck();//forgot to close it
}

//two objects that pulse and then close after 2 and 4 seconds
//when both objects are closed, the process will exit
if (demo("pulse-two")) { demoPulseTwo(); }
function demoPulseTwo() {

	function Pulse1() {
		var state = makeState();
		state.close = function() {
			if (state.already()) return;
			log("closed 1");
		};
		state.pulse = function() {
			log("pulse 1");
			if (start.expired(2*Time.second)) state.close();//close this pulse1 object
		}
		return listState({
			state:state
		});
	};

	function Pulse2() {
		var state = makeState();
		state.close = function() {
			if (state.already()) return;
			log("closed 2");
		};
		state.pulse = function() {
			log("pulse 2");
			if (start.expired(4*Time.second)) state.close();
		}
		return listState({
			state:state
		});
	};

	var start = now();//make a note of the start time

	var pulse1 = Pulse1();
	var pulse2 = Pulse2();
}















//uncomment this test to see why test.done() doesn't work
//test.done() won't notice the unclsoed resource
//all the tests will pass, but the process will stay open, and the resource will keep pulsing
/*
exports.testDoneNotGoodEnough = function(test) {
	var r = Resource("resource test done");
	test.done();
}
*/

//uncomment this test to see the right way to do it, done(test)
//done(test) will notice the unclosed resource, tell nodeunit the test failed, and exit the process
//nodeunit doesn't seem to respond to the failed test, but will complain that the process ended without a test being done
/*
exports.testUseDoneTestInstead = function(test) {
	var r = Resource("resource done test");
	done(test);
}
*/








//nodeunit persists values between different tests
//this example shows it in this file, but it also happens with global state in other files this file uses

var globalVariable;

exports.testPersists1 = function(test) {//runs first

	globalVariable = "value 1";//set the global variable
	test.ok(globalVariable == "value 1");
	done(test);
}

exports.testPersists2 = function(test) {//runs afterwards

	test.ok(globalVariable == "value 1");//it's still set to the value from the previous test
	done(test);
}
















//   _____                 _     ____                      _ 
//  | ____|_   _____ _ __ | |_  / ___| _ __   ___  ___  __| |
//  |  _| \ \ / / _ \ '_ \| __| \___ \| '_ \ / _ \/ _ \/ _` |
//  | |___ \ V /  __/ | | | |_   ___) | |_) |  __/  __/ (_| |
//  |_____| \_/ \___|_| |_|\__| |____/| .__/ \___|\___|\__,_|
//                                    |_|                    

//node events are synchronous
//this demo will log received before sent
//written both as a demo and a test
if (demo("event-order")) { demoEventOrder(); }
function demoEventOrder() {

	function f() {
		log("received");
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);

	e.emit("name");
	log("sent");
}
exports.testEventSynchronous = function(test) {

	var s = "";

	function f() {
		s += "received;";
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);

	e.emit("name");//works less like an event, more like just calling f()
	s += "sent;";

	test.ok(s == "received;sent;");//not the order you would expect
	test.done();
}

//sending an event is just like calling a function
//a speed loop causes a stack overflow
//"RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
if (demo("loop-event")) { demoLoopEvent(); }
function demoLoopEvent() {

	function f() {
		log("logging this slows it down so it doesn't complain immediately");
		e.emit("name");
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);
	e.emit("name");
}

//we can't speed loop process.nextTick either, because node notices and complains
//"(node) warning: Recursive process.nextTick detected. This will break in the next  version of node. Please use setImmediate for recursive deferral. RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
if (demo("loop-tick")) { demoLoopTick(); }
function demoLoopTick() {

	function f() {
		process.nextTick(f);
	}

	f();
}

//see how fast node can notify itself asynchronously three different ways
if (demo("speed-timeout"))   { demoSpeed("timeout"); }
if (demo("speed-immediate")) { demoSpeed("immediate"); }
if (demo("speed-tick"))      { demoSpeed("tick"); }
function demoSpeed(method) {

	var l = 0;         //number of second long loops we've completed
	var t = Date.now();//time the current loop started
	var n = 0;         //events we've counted in the current loop
	start();

	function start() {
		if      (method == "timeout")   setTimeout(end, 0);   //~64 timeouts/s
		else if (method == "immediate") setImmediate(end);    //~480k immediates/s
		else if (method == "tick")      process.nextTick(end);//node warning and error
	}

	function end() {
		if (t + 1000 < Date.now()) {
			log(items(n, method), "/second");
			l++;
			if (l < 8) {
				t = Date.now();
				n = 0;
				start();
			}
		} else {
			n++;
			start();
		}
	}
}

//now let's use the pulse system
//~16k pulses/s, not as fast as immediate by itself, but plenty fast
if (demo("speed-pulse")) { demoSpeedPulse(); }
function demoSpeedPulse() {

	function SpeedResource() {//a resource that finishes on the first pulse

		var state = makeState();
		state.close = function() {
			if (state.already()) return;
		};
		state.pulse = function() {
			end();//close this resource on the first pulse
		}

		return listState({
			state:state
		});
	};

	var r;
	function start() {
		r = SpeedResource();//make a resource
	}

	function end() {
		close(r);//close the resource
		callWhenDone();//have speedLoopNext record another cycle and maybe call start again
	}

	function allDone() {//speedLoopNext calls this once after the last cycle of the last second
		closeCheck();
	}

	var callWhenDone = speedLoopNext(start, "pulse", allDone);
	start();
}














