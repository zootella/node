
var log = console.log;


var requireState = require("./s1");

var makeState = requireState.makeState;
var listState = requireState.listState;
var printList = requireState.printList;
var dingStart = requireState.dingStart;





function Resource(name) {

	var _name = name;

	var state = makeState();
	state.close = function() {
		if (state.already()) { log("already closed"); return; }

		log("closed the resource");
	};
	state.pulse = function() {
		log("pulse resource " + _name);
	}

	return listState({
		state:state
	});
};




var r1 = Resource("icon");
var r2 = Resource("menu");


dingStart();


























