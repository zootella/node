
var log = console.log;



//implement close and pulse, as simply as possible


var list = [];

function printList() {
	log("");
	log("list length: " + list.length);
	for (var i = 0; i < list.length; i++)
		log("" + list[i]);
}




function makeState() {
	var state = {};

	state._closed = false;
	state.already = function() {
		if (state._closed) return true; // We're already closed, return true to return from the close() function
		state._closed = true;           // Mark this object as now permanently closed
		return false;               // Return false to run the contents of your close() function this first and only time
	};

	return state;
}

function listState(o) {
	list.push(o);
	return o;
}











function dingStart() { // Request a repeating pulse to update clocks and notice if nothing is happening
	setInterval(function() { // Make a repeating timer to call this function

		for (var i = 0; i < list.length; i++)
			list[i].state.pulse();

		}, 1000);
}






exports.makeState = makeState;
exports.listState = listState;
exports.printList = printList;
exports.dingStart = dingStart;




