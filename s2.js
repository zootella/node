
var log = console.log;


var requireS1 = require("./s1");

var State = requireS1.State;
var printList = requireS1.printList;
var dingStart = requireS1.dingStart;





function Resource() {

	var state = State();
	state.close = function() {
		if (state.already()) { log("already closed"); return; }

		log("closed the resource");
	};
	state.pulse = function() {

		log("pulse resource");
	}

	return {
		state:state
	};
};

function File() {

	var state = State();
	state.close = function() {
		if (state.already()) { log("already closed"); return; }

		log("closed the file");
	};
	state.pulse = function() {

		log("pulse file");
	}

	return {
		state:state
	};
};



var r1 = Resource();
var r2 = File();


dingStart();







