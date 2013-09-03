
var requireText = require("./text");

var requireMeasure = require("./measure");
var Time = requireMeasure.Time;







//design goal
//there's only one global pulse list
//but individual unit tests can use it, and confirm that it's put away at the end of each one
//and two whole different applications running in the same process can share it, and it all works
//think of it as part of the platform, not your application

//have the 4s timeout built into the base, so you get it enforced for free automatically everywheres

//it was bad design to have monitor make decisions, it should only measure performance, so a monitor of empty functions would work just as well





// Close o ignoring null and exceptions
function close(o) {
	if (!o) return;
	try {
		o.state.close();
	} catch (e) { mistakeLog(e); } // Keep going to close the next object
}

function open(o) { return o && !o.state.closed(); } // True if o exists and is not yet closed
function done(o) { return o && o.state.closed(); } // True if o exists and is closed

exports.close = close;
exports.open = open;
exports.done = done;














//   ____  _        _       
//  / ___|| |_ __ _| |_ ___ 
//  \___ \| __/ _` | __/ _ \
//   ___) | || (_| | ||  __/
//  |____/ \__\__,_|\__\___|
//                          

// Make a state inside your object so the program will pulse it, and notice if you forget to later close it
function State() {

	// True once this object has been closed, and promises to not change again
	var _closed = false;
	function closed() { return _closed; }

	// Mark this object as closed, and only do this once
	// Start your close() function with the line "if (already()) return;"
	// The first time already() runs, it marks this object as closed and returns false
	// Try calling it again, and it will just return true
	function already() {
		if (_closed) return true; // We're already closed, return true to return from the close() function
		_closed = true;           // Mark this object as now permanently closed
		soon();                   // Have the program pulse soon so the object that made this one can notice it finished
		return false;             // Return false to run the contents of your close() function this first and only time
	};

	// Close your objects inside, put away resources, and never change again
	// Your object that contains State must have this function
	function close() {};

	// Notice things inside your object that have changed or finished, and do the next step to move forward
	// Set your own function here, and the program will call it periodically
	function pulse() {};

	// Compose text and information for the user based on the new current state of things
	// Set your own function here, and the program will call it periodically
	function pulseScreen() {};

	var o = {
		closed:closed, already:already,
		close:close, pulse:pulse, pulseScreen:pulseScreen,
	};

	// Add this new object that needs to be closed to the program's list of open objects to keep track of it
	// It's safe to add to the end even during a pulse because we loop by index number
	// The objects in the list are in the order they were made so contained objects are after those that made them
	list.add(o);
	dingStart(); // Start the ding if it's not started already
	soon();      // Have the program pulse this new object soon

	return o;
};
exports.State = State;

//   _     _     _   
//  | |   (_)___| |_ 
//  | |   | / __| __|
//  | |___| \__ \ |_ 
//  |_____|_|___/\__|
//                   

var list = []; // Every object the program needs to close, and hasn't yet

// Remove objects that got closed from the list
function clear() {
	for (var i = list.length - 1; i >= 0; i--) { // Loop backwards so we can remove things along the way
		var o = list[i];
		if (done(o)) // Only remove closed objects
			list.remove(i);
	}
	if (!list.length) dingStop(); // Stop the ding if the list is empty
}













//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

var start = false; // true when we've set next tick to call pulseAll(), and it hasn't yet
var again = false; // true when an object has requested another pass up the pulse list

// Pulse soon if we haven't pulsed in awhile
function ding() {
	if (!start &&     // If the program isn't already pulsing or set to start, and
		monitor.ding()) // It's been longer than the delay since the last pulse finished
		soon();         // Have the program pulse soon to notice things that have timed out
}

// An object in the program has changed or finished
// Pulse soon so the object that made it can notice and take the next step forward
function soon() {

	// Start a pulse if one isn't already happening
	if (!start) { // No need to start a new pulse if we're doing one now already
		start = true;
		process.nextTick(function() { // Run this function separately and soon
			try {
				pulseAll();
			} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
		});
	}

	// Have the pulse loop up the list again
	again = true;
}

// Pulse all the open objects in the program until none request another pulse soon
function pulseAll() {
	monitorStart();
	
	// Pulse up the list in many passes until no object requests another pulse soon
	while (again) {
		again = false; // Don't loop again unless an object we pulse below calls soon() above
		if (monitorLoop()) break; // Quit early if this pulse goes over the time limit

		// Pulse up the list in a single pass
		for (var i = list.length - 1; i >= 0; i--) { // Loop backwards to pulse contained objects before the older objects that made them
			if (open(list[i])) { // Skip closed objects
				try {
					list[i].pulse(); // Pulse the object so it notices things that have finished and moves to the next step
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}
	
	// In a single pass after that, pulse up the list to have objects compose information for the user
	if (screen.enough()) { // Only update the screen 5 times a second
		for (var i = list.length - 1; i >= 0; i--) {
			if (open(list[i])) { // Skip closed objects
				try {
					list[i].pulseUser(); // Pulse the object to have it compose text for the user to show current information
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}
	
	clear(); // Remove closed objects from the list all at once at the end
	monitorEnd(list.length);
	start = false; // Allow the next call to soon() to start a new pulse
}

// Make sure we don't update the screen too frequently
var screen = Ago(Time.delay);

// When the program or test is done, make sure you closed every object, and stop things so the process can exit
function checkClose() {

	// Make sure the program closed every object before trying to exit
	clear();           // Remove closed objects from the list
	if (list.length) { // We should have closed them all, but didn't

		var s = say(size, " objects open:\r\n"); // Compose text about the objects still open by mistake
		for (var i = 0; i < size; i++) {
			s += say(list[i], "\r\n");
		}
		mistakeStop(s); // Log the text and exit the process
	}

	log(monitorDescribeEfficiency()); // Log performance and efficiency statistics
}
















