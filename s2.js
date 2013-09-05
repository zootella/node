
var log = console.log;


var requireS1 = require("./s1");

var makeState = requireS1.makeState;
var printList = requireS1.printList;





function Resource(name) {

	var state = makeState(name);
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




log("before");
printList();
var r1 = Resource("resource 1");
log("after");
printList();










