

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



function closeTest(test) {
	if (closeCheck()) test.fail();
	test.done();
}
//figure out when to log, when to exit, and when to test fail on this
//you want to say why it failed, that the following n objects were left open

exports.testSomething = function(test) {

	closeTest(test);
}



//also make sur eyou are say()ing the objects that are still open
//and make data and file and others have text() that describe what's going on with them





//write an example that has a resource that finishes after 2 seconds of pulsing









//example object that needs to get closed
function Resource() {
	var state = makeState();
	state.close = function() {
		if (state.already()) return;
	};
	return listState({
		state:state
	});
};








//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

//run these examples with a command like:
//>node test-state.js example-name

//run code that throws an exception
if (demo("throw")) {

	Data("hello").start(6);//throws chop
}

//code in a timeout function that throws an exception
//confirms that an uncaught exception in a timeout function ends the node process, even if there are more events that might work later
if (demo("timeout-throw")) {

	setTimeout(function() {//in 4 seconds, this function will run successfully

		log("ran after 4 seconds");//never runs, the uncaught exception at 2 seconds ends the node process

	}, 4000);

	setTimeout(function() {//in 2 seconds, this function will run and throw

		log("ran after 2 seconds");
		Data("hello").start(6);//throws chop

	}, 2000);
}

//catch an exception and sand it to mistakeLog(e)
if (demo("log")) {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }
}

//catch an exception and sand it to mistakeStop(e)
if (demo("stop")) {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }
}

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



//move some of these into pulse

//write one where it makes a resource that finishes on the first pulse as fast as it can, and sees how many it can do in 10 seconds
//then try that with settimeout, setimmediate, and nexttick



//writing unit tests when you can, examples when you can't, get all the basic functionality of state.js covered here










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


	//try closing u, n, and o also, that should probably log exceptions but keep going, you think

	test.done();
}



/*
var r = Resource();
close(r);
*/




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


















exports.testState = function(test) {

	test.done();
}




//have two fake objects in here that need to be closed
//test the ability of the system to show that both are closed
//and to complain when one is not closed







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









//make an object that needs to be closed, and forget to close it
if (demo("forget")) {

	var m = Resource();
	closeCheck();//forgot to close it
}
















