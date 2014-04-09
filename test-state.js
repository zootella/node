

var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var now = requireMeasure.now;
var Time = requireMeasure.Time;

var requireState = require("./state");
var demo = requireState.demo;
var mistakeLog = requireState.mistakeLog;
var mistakeStop = requireState.mistakeStop;
var closeCheck = requireState.closeCheck;
var done = requireState.done;
var close = requireState.close;
var isClosed = requireState.isClosed;
var isOpen = requireState.isOpen;
var makeState = requireState.makeState;
var listState = requireState.listState;

var requireData = require("./data");
var Data = requireData.Data;

































//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

//run code that throws an exception
if (demo("throw")) {

	Data("hello").start(6);//throws chop
}

//catch an exception and sand it to mistakeLog(e)
if (demo("mistake-log")) {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }

	log("code after runs");
}

//catch an exception and sand it to mistakeStop(e)
if (demo("mistake-stop")) {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }
}

//code in a timeout function that throws an exception
//confirms that an uncaught exception in a timeout function ends the node process, even if there are more events that might work later
if (demo("timeout-throw")) {
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
		var s = "resource";
		if (_name) s += " " + _name;
		return s;
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
if (demo("pulse")) {

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
if (demo("pulse-throw")) {

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
if (demo("close")) {

	var m = Resource();
	close(m);
	closeCheck();
}

//make an object that needs to be closed, and forget to close it
if (demo("forget")) {

	var m = Resource("name");
	closeCheck();//forgot to close it
}

//two objects that pulse and then close after 2 and 4 seconds
//when both objects are closed, the process will exit
if (demo("pulse-two")) {

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
	var r = Resource("test.done() isn't good enough");
	test.done();
}
*/

//uncomment this test to see the right way to do it, done(test)
//done(test) will notice the unclosed resource, tell nodeunit the test failed, and exit the process
/*
exports.testUseDoneTestInstead = function(test) {
	var r = Resource("use done(test) instead");
	done(test);
}
*/











//speed loop demos
//generalize it to a function followed by an event
//make it an interactive demo that shows current speed, and stop and start
//function, event, process.nextTick, setTimer, setImmediate

//make an object which finishes on the first pulse, and hook that into a loop to see how many you can do in 4s, this is a test of how fast soon is, really







//does state persist between two different tests? yes, it does, but write two tests to show it
//if you have a global var in this file, and one test sets it to "a", can the next test see the value as a?
//write some code to demonstrate how this works, actually
//ok, what if the state is in state.js, one of the tests is in test-state.js, and the second test is in test-measure.js, do they all share state
//maybe write that into a little three file example so you don't have to clutter stuff up here
//and then run the tests with nodeunit test-*.js or whatever

//related question: does process.exit() in a test prevent the next tests from running?
//try it, yes it does, now write a commented out test to show it























