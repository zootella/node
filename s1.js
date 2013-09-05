
var log = console.log;






var list = [];

function makeState(name) {

	var state = {};
	state.name = name;
	state._closed = false;
	state.closed = function() { return state._closed; }

	state.already = function() {
		if (_closed) return true; // We're already closed, return true to return from the close() function
		_closed = true;           // Mark this object as now permanently closed
		return false;             // Return false to run the contents of your close() function this first and only time
	};

	state.close = function() {};
	state.pulse = function() {};
	state.pulseScreen = function() {};

	state.text = function() { return "text of " + name; }

	list.push(state);

	return state;
}
exports.makeState = makeState;



function printList() {
	log("list length: " + list.length);
	for (var i = 0; i < list.length; i++)
		log("" + list[i].text());
}
exports.printList = printList;








