

var requireText = require("./text");
var requireState = require("./state");
var requireData = require("./data");

var log = requireText.log;










//example object that needs to get closed

var State = requireState.State;

function Resource() {

	var state = State();
	state.close = function() {
		if (state.already()) { log("already closed"); return; }

		log("closed the resource");
	};
	state.pulse = function() {

		log("pulse");
	}


	state.text = function() { return "hi from the state object"; }



	return {
		state:state
	};
};



log("going to make a resource");

var r = Resource();







//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

var mistakeLog = requireState.mistakeLog;
var mistakeStop = requireState.mistakeStop;








//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

var close = requireState.close;
var open = requireState.open;
var done = requireState.done;
var Data = requireData.Data;

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
/*
	var r = Resource();//make a new object that we must close
	test.ok(open(r));//starts out open
	test.ok(!done(r));
	close(r);//close it
	test.ok(!open(r));//confirm it's closed
	test.ok(done(r));

	var u;//not set to anything
	test.ok(!open(u));//neither open nor closed
	test.ok(!done(u));

	var n = null;//set to null
	test.ok(!open(n));
	test.ok(!done(n));

	var o = Data();//set to an object that doesn't need to be closed
	test.ok(!open(o));
	test.ok(!done(o));


	//try closing u, n, and o also, that should probably log exceptions but keep going, you think
	*/

	test.done();
}





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










