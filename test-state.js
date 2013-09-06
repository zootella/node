
var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireState = require("./state");
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

//example of running code that throws an exception
if (process.argv[2] == "example-throw") {

	Data("hello").start(6);//throws chop
}

//example of catching an exception and sending it to mistakeLog(e)
if (process.argv[2] == "example-log") {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }
}

//example of catching an exception and sending it to mistakeStop(e)
if (process.argv[2] == "example-stop") {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }
}

//example of code in a pulse function that throws an exception
if (process.argv[2] == "example-pulse-throw") {

	function Unstable() {
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

	var u = Unstable();//make a new unstable object, which will throw on the first pulse
}

//example of making an object that needs to be closed, and closing it
if (process.argv[2] == "example-close") {

	var m = Resource();
	close(m);
	closeCheck();
}

//example of making an object that needs to be closed, and forgetting to close it
if (process.argv[2] == "example-forget") {

	var m = Resource();
	closeCheck();//forgot to close it
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










