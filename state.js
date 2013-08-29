










function isOpen(o) { return o && o.state && !o.state.closed(); } // True if o needs to be closed, and isn't yet
function isDone(o) { return o && o.state && o.state.closed(); }  // True if o needs to be closed, and is

// Close o and return with it closed
function close(o) {
	if (o && o.state) { // Ignore no o or and o that doesn't need to be closed
		try {
			o.state.close();
		} catch (e) { /*TODO mistake log*/ } // Log an exception but keep going
	}
}




//Pulse


function soon() {}

function pulseAll() {

	for (var i = 0; i < list.length; i++) {//change it to go backwards
		list[i].pulse();
	}
}

function add(o) {
	list.push(o);
}

function clear() {}

var list = [];

function confirmAllClosed() {
	return '';
}

function stop() {}




var program = {};
program.pulse = newPulse();




var newState = function() {

	//functions you can override
	function close() {};// you have to override this one
	function pulse() {};
	function pulseScreen() {};

	var _closed = false;
	function closed() { return _closed; }
	function already() {
		if (_closed) return true;
		_closed = true;
		return false;
	};

	var use = {
		close:close,
		pulse:pulse,
		pulseScreen:pulseScreen,
		closed:closed,
		already:already
	};
	program.pulse.add(use);
	return use;
};



var newFile = function() {

	var state = newState();
	state.close = function() {
		if (state.already()) { log('already closed'); return; }

	};

	state.pulse = function() {

		log('pulse!');
	}

	return {
		state:state
	};
};


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






// ERROR

/*

//have name, info
//info.wrap is an exception we're wrapping
//info.note is a note about what happened

//current usage
throw "chop";
if (e == "chop");
//new usage
throw error("chop");
throw error("chop", {note: "a note about what happened"});
throw error("chop", {wrap: e});
//and checking
if (e.name == "chop") log(e.info.wrap);

function error(name, info) {
	return {
		name: name,
		info: info
	}
}


function error(name, note, more) {
	return {
		name: name,
		note: note,
		more: more
	}
}

//before: throw "data";        if (e == "data");
//after:  throw error("data"); if (e.name == "data");
//so, only 4 characters longer

//and now you can add detailed notes
//and wrap and carry an exception you got in more, for instance

//but you don't have to do the horrible java thing where each kind of exception is a separate type
//or wrap up hashes on the fly, either

*/











