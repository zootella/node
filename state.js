
var requireText = require("./text");







//design goal
//there's only one global pulse list
//but individual unit tests can use it, and confirm that it's put away at the end of each one
//and two whole different applications running in the same process can share it, and it all works
//think of it as part of the platform, not your application

//have the 4s timeout built into the base, so you get it enforced for free automatically everywheres






// Close o ignoring null and exceptions
function close(o) {
	if (!o) return;
	try {
		o.state.close();
	} catch (e) { mistakeLog(e); } // Keep going to close the next object
}

function open(o) { return o && !o.state.closed(); } // True if o exists and is not yet closed
function done(o) { return o && o.state.closed(); } // True if o exists and is closed














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

	// Start your close() function with the line "if (already()) return;"
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
		closed:closed, already:already
		close:close, pulse:pulse, pulseScreen:pulseScreen,
	};
	add(o); // Keep track of this new object that needs to be closed
	soon(); // Have the program pulse this new object soon
	return o;
};






//   _     _     _   
//  | |   (_)___| |_ 
//  | |   | / __| __|
//  | |___| \__ \ |_ 
//  |_____|_|___/\__|
//                   

var list = []; // Every object the program needs to close, and hasn't yet

/** Add a new object that extends Close to the program's list of open objects. */
function add(o) {
	list.add(o); // It's safe to add to the end even during a pulse because we loop by index number
	ding.start(); // Start the ding if it's not started already
}
// The objects in the list are in the order they were made so contained objects are after those that made them



/** Remove objects that got closed from our list. */
private void clear() {
	for (int i = list.length - 1; i >= 0; i--) { // Loop backwards so we can remove things along the way
		Close c = list[i];
		if (Close.done(c)) // Only remove closed objects
			list.remove(i);
	}

	//new feature idea: maybe also stop the ding if the list goes empty
}




/**
 * Call before the program exits to make sure we've closed every object.
 * @return Text about objects still open by mistake, or blank if there's no problem
 */
public String confirmAllClosed() {
	
	clear(); // Remove closed objects from the list
	
	int size = list.length;
	if (size == 0) return ""; // Good, we had closed them all already
	
	StringBuffer s = new StringBuffer(); // Compose and return text about the objects still open by mistake
	s.append(size + " objects open:\n");
	for (int i = 0; i < size; i++) {
		Close c = list[i];
		if (Close.open(c)) { // Skip closed objects
			s.append(c.toString() + "\n");
		}
	}
	return s.toString();
}








//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

	

// Start


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
	monitor.start();
	
	// Pulse up the list in many passes until no object requests another pulse soon
	while (again) {
		again = false; // Don't loop again unless an object we pulse below calls soon() above
		if (monitor.loop()) break; // Quit early if this pulse goes over the time limit

		// Pulse up the list in a single pass
		for (int i = list.length - 1; i >= 0; i--) { // Loop backwards to pulse contained objects before the older objects that made them
			var o = list[i];
			if (open(o)) { // Skip closed objects
				try {
					o.pulse(); // Pulse the object so it notices things that have finished and moves to the next step
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}
	
	// In a single pass after that, pulse up the list to have objects compose information for the user
	if (screen.enough()) { // Only update the screen 5 times a second
		for (int i = list.length - 1; i >= 0; i--) {
			var o = list[i];
			if (open(o)) { // Skip closed objects
				try {
					o.pulseUser(); // Pulse the object to have it compose text for the user to show current information
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}
	
	clear(); // Remove closed objects from the list all at once at the end
	monitor.end(list.length);
	start = false; // Allow the next call to soon() to start a new pulse
}


// Pulse the program soon so it can notice something that has finished or changed
function soon() {}

















//   _____ _ _      
//  |  ___(_) | ___ 
//  | |_  | | |/ _ \
//  |  _| | | |  __/
//  |_|   |_|_|\___|
//                  

function File() {

	var state = State();
	state.close = function() {
		if (state.already()) { log("already closed"); return; }

		log("closed the file");
	};
	state.pulse = function() {

		log("pulse the file");
	}

	return {
		state:state
	};
};








