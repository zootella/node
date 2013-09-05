
var log = console.log;



//implement close and pulse, as simply as possible


var list = [];

function printList() {
	log("");
	log("list length: " + list.length);
	for (var i = 0; i < list.length; i++)
		log("" + list[i]);
}




function State() {

	var s = {};
	s._closed = false;

	s.already = function() {
		if (s._closed) return true; // We're already closed, return true to return from the close() function
		s._closed = true;           // Mark this object as now permanently closed
		return false;               // Return false to run the contents of your close() function this first and only time
	};

	s.close = function() {};
	s.pulse = function() {};
	s.pulseScreen = function() {};

	list.push(s);
	return s;
}











function dingStart() { // Request a repeating pulse to update clocks and notice if nothing is happening
	setInterval(function() { // Make a repeating timer to call this function

		for (var i = 0; i < list.length; i++)
			list[i].pulse();

		}, 100);
}






exports.State = State;
exports.printList = printList;
exports.dingStart = dingStart;




