

var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireState = require("./state");
var demo = requireState.demo;
var mistakeLog = requireState.mistakeLog;
var mistakeStop = requireState.mistakeStop;
var close = requireState.close;
var isClosed = requireState.isClosed;
var isOpen = requireState.isOpen;
var makeState = requireState.makeState;
var listState = requireState.listState;
var closeCheck = requireState.closeCheck;

var requireData = require("./data");
var Data = requireData.Data;
















//write closeCheck() to:
//complain if anything's left open
//print performance statistics

//make an easy way to call it at the end of a demo or program
//and also call it at the end of every test, something like


/*
function closeTest(test) {
	if (closeCheck()) test.fail();
	test.done();
}
//figure out when to log, when to exit, and when to test fail on this
//you want to say why it failed, that the following n objects were left open

exports.testSomething = function(test) {

	closeTest(test);
}
*/


//also make sur eyou are say()ing the objects that are still open
//and make data and file and others have text() that describe what's going on with them





//write an example that has a resource that finishes after 2 seconds of pulsing

















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

	test.done();
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

	test.done();
}

//example object that needs to get closed
function Resource(setName) {

	var _name = setName;//save the given name
	function text() {//describe this resource as text
		var s = "Resource";
		if (_name) s += " " + _name;
		return s;
	}

	var state = makeState();
	state.close = function() {
		if (state.already()) return;
	};
	state.pulse = function() {
		var s = "pulse";
		if (_name) s += " " + _name;
		log(s);
	}

	return listState({
		state:state,
		text:text
	});
};


//see the name in the list when you leave one open
//see two of them pulse in a demo






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

	test.done();
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

	test.done();
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

	test.done();
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
	var u = ExamplePulse();//make a new unstable object, which will log on each pulse
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

	var u = ExamplePulseThrow();//make a new unstable object, which will throw on the first pulse
}

//make an object that needs to be closed, and close it
if (demo("close")) {

	var m = Resource();
	close(m);
	closeCheck();
}

//make an object that needs to be closed, and forget to close it
if (demo("forget")) {

	var m = Resource();
	closeCheck();//forgot to close it
}







//make an object which finishes on the first pulse, and hook that into a loop to see how many you can do in 4s, this is a test of how fast soon is, really




//move some of these into pulse

//write one where it makes a resource that finishes on the first pulse as fast as it can, and sees how many it can do in 10 seconds
//then try that with settimeout, setimmediate, and nexttick



//writing unit tests when you can, examples when you can't, get all the basic functionality of state.js covered here






//have a really simple demo that uses speed and just counts how fast node can run a loop






//speed loop demos
//generalize it to a function followed by an event
//make it an interactive demo that shows current speed, and stop and start
//function, event, process.nextTick, setTimer, setImmediate






//see what happens when you call open(c) on c, which doesn't have a state inside


//when it complains when something is open, have it write hte type, and call text() on it to have it describe itself






/*
//demo, turn this into a test
var f;
if (!f) log('no');
f = newFile();
if (open(f)) log('open');
close(f);
if (done(f)) log('done');
f = null;
if (!f) log('no');
*/

/*
var f1 = newFile();
var f2 = newFile();

program.pulse.pulseAll();
*/



















//have two fake objects in here that need to be closed
//test the ability of the system to show that both are closed
//and to complain when one is not closed































