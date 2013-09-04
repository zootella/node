
var log = console.log;

var requireText = require("./text");
var requireState = require("./state");











exports.testReference = function(test) {

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


//see what happens when you call open(c) on c, which doesn't have a state inside






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




log("hi from the test file");






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

	return {
		state:state
	};
};


var r = Resource();






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










