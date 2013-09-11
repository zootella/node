
var requireText = require("./text");
var hasMethod = requireText.hasMethod;
var line = requireText.line;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var Time = requireMeasure.Time;
var now = requireMeasure.now;
var When = requireMeasure.When;
var earlier = requireMeasure.earlier;
var recent = requireMeasure.recent;
var Duration = requireMeasure.Duration;
var Ago = requireMeasure.Ago;










//design goal
//there's only one global pulse list
//but individual unit tests can use it, and confirm that it's put away at the end of each one
//and two whole different applications running in the same process can share it, and it all works
//think of it as part of the platform, not your application

//have the 4s timeout built into the base, so you get it enforced for free automatically everywheres

//it was bad design to have monitor make decisions, it should only measure performance, so a monitor of empty functions would work just as well








//finish log
//add the time
//have it put spaces between arguments, unlike say
//move it to where it can use the time
//use it everywhere instead of console.log








//   ____                       
//  |  _ \  ___ _ __ ___   ___  
//  | | | |/ _ \ '_ ` _ \ / _ \ 
//  | |_| |  __/ | | | | | (_) |
//  |____/ \___|_| |_| |_|\___/ 
//                              

// Run a demo with a command line:
// $ node file.js demo name
var _demo = false;
function demo(name) {
	if (!_demo && process.argv[2] == "demo" && process.argv[3] == name) {
		_demo = true; // Make sure to run only one demo even if there are two with the same name
		return true;
	}
	return false;
}
exports.demo = demo;
















//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

// Log e, but let the program keep running
function mistakeLog(e) {
	var s = "";
	s += line("Mistake log:");
	s += line(e);
	log(s);
}

// Log e and stop the program, this function does not return
function mistakeStop(e) {
	var s = "";
	s += line("Mistake stop:");
	s += line(e);
	log(s);

	process.exit(1); // Terminate the process right here without closing the program properly
}

exports.mistakeLog = mistakeLog;
exports.mistakeStop = mistakeStop;

//TODO get the stack trace from the exception, keep stuff you get by default like file, line number, and ^ by line of code
//TODO show the error to the user, like write a .txt file and shell execute it before exiting
//TODO send the error in a packet to the programmer




















//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

// Close o ignoring null and exceptions
function close(o) {
	if (!o) return;
	try {
		o.state.close();
	} catch (e) { mistakeLog(e); } // Keep going to close the next object
}

function isClosed(o) { return o && o.state && o.state._closed;  } // True if o exists, needs to be closed, and is closed
function isOpen(o) { return o && o.state && !o.state._closed; } // True if o exists, needs to be closed, and is not closed yet

exports.close = close;
exports.isClosed = isClosed;
exports.isOpen = isOpen;

//   ____  _        _       
//  / ___|| |_ __ _| |_ ___ 
//  \___ \| __/ _` | __/ _ \
//   ___) | || (_| | ||  __/
//  |____/ \__\__,_|\__\___|
//                          

// Make a state inside your object so the program will pulse it, and notice if you forget to later close it
function makeState() {
	var state = {}; // The state object we will fill and return

	state._closed = false; // True once the containing object has been closed, and promises to not change again
	state.isClosed = function() { return state._closed; }
	state.isOpen = function() { return !state._closed; } // Not closed yet
	state.confirmOpen = function() { if (state._closed) throw "state"; } // Make sure the containing object isn't closed before doing something that would change it

	// Mark this object as closed, and only do this once
	// Start your close() function with the line "if (state.already()) return;"
	// The first time already() runs, it marks this object as closed and returns false
	// Try calling it again, and it will just return true
	state.already = function() {
		if (state._closed) return true; // We're already closed, return true to return from the close() function
		state._closed = true;           // Mark this object as now permanently closed
		soon();                         // Have the program pulse soon so the object that made this one can notice it finished
		return false;                   // Return false to run the contents of your close() function this first and only time
	};

	// Close your objects inside, put away resources, and never change again
	// Your object that contains state must have this function
	// state.close = function() {};

	// Notice things inside your object that have changed or finished, and do the next step to move forward
	// Set your own function, and the program will call it periodically
	// state.pulse = function() {};

	// Compose text and information for the user based on the new current state of things
	// Set your own function, and the program will call it periodically
	// state.pulseScreen = function() {};

	return state;
};

// We just made an object that has state, pulse it periodically, and make sure we close it
function listState(o) {

	// Add the given new object that needs to be closed to the program's list of open objects to keep track of it
	// It's safe to add to the end of the list even during a pulse because we loop by index number
	// The objects in the list are in the order they were made, so contained objects are after those that made them
	list.add(o);
	dingStart(); // Start the ding if it's not started already
	soon();      // Have the program pulse this new object soon
	return o;    // Return the same object to pass it through
}

exports.makeState = makeState;
exports.listState = listState;

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
		if (isClosed(list[i])) // Only remove closed objects
			list.remove(i);
	}
	if (!list.length) dingStop(); // Stop the ding if the list is empty
}

//   ____  _             
//  |  _ \(_)_ __   __ _ 
//  | | | | | '_ \ / _` |
//  | |_| | | | | | (_| |
//  |____/|_|_| |_|\__, |
//                 |___/ 

// A timer that will cause a pulse to happen even if nothing else does
var timer = null; // A interval timer set to repeat, or null if we don't have one

function dingStart() { // Request a repeating pulse to update clocks and notice if nothing is happening
	if (!timer) {
		timer = setInterval(function() { // Make a repeating timer to call this function
			try {
				if (!timer) return; // Don't do anything if the ding is stopped
				
				// Pulse soon if we haven't pulsed in a while
				if (!start &&    // If the program isn't already pulsing or set to start, and
					monitorDing()) // It's been longer than the delay since the last pulse finished
					soon();        // Have the program pulse soon to notice things that have timed out

			} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
		}, Time.quick); // Check every half delay to catch nothing happening sooner
	}
}

function dingStop() { // Stop requesting these repeating pulses
	if (timer) {
		clearInterval(timer); // Stop and discard the timer, keeping it might prevent the program from closing
		timer = null; // Discard the timer object so a future call to dingStart() can start things again
	}
}















//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

var start = false; // true when we've set next tick to call _pulse(), and it hasn't yet
var again = false; // true when an object has requested another pass up the pulse list

// An object in the program has changed or finished
// Pulse soon so the object that made it can notice and take the next step forward
function soon() {

	// Start a pulse if one isn't already happening
	if (!start) { // No need to start a new pulse if we're doing one now already
		start = true;
		setImmediate(_pulse); // Run the _pulse function separately and soon
	}

	// Have the pulse loop up the list again
	again = true;
}

// Pulse all the open objects in the program until none request another pulse soon
function _pulse() {
	monitorStart();

	// Pulse up the list in many passes until no object requests another pulse soon
	while (again) {
		again = false; // Don't loop again unless an object we pulse below calls soon() above
		if (monitorLoop()) break; // Quit early if this pulse goes over the time limit

		// Pulse up the list in a single pass
		for (var i = list.length - 1; i >= 0; i--) { // Loop backwards to pulse contained objects before the older objects that made them
			if (isOpen(list[i]) && hasMethod(list[i].state, "pulse")) { // Skip closed objects
				try {
					list[i].state.pulse(); // Pulse the object so it notices things that have finished and moves to the next step
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}
	
	// In a single pass after that, pulse up the list to have objects compose information for the user
	if (screen.enough()) { // Only update the screen 5 times a second
		for (var i = list.length - 1; i >= 0; i--) {
			if (isOpen(list[i]) && hasMethod(list[i].state, "pulseUser")) { // Skip closed objects
				try {
					list[i].state.pulseUser(); // Pulse the object to have it compose text for the user to show current information
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

// When the program or test is done, make sure you closed every object
function closeCheck() {

	// Make sure the program closed every object before trying to exit
	clear();           // Remove closed objects from the list
	if (list.length) { // We should have closed them all, but didn't

		var s = line(size, " objects open:"); // Compose text about the objects still open by mistake
		for (var i = 0; i < size; i++) {
			s += line(list[i]);
		}
		log(s);
		process.exit(1);
	}

	log(monitorDescribeEfficiency()); // Log performance and efficiency statistics
}

exports.soon = soon;
exports.closeCheck = closeCheck;









//   __  __             _ _             
//  |  \/  | ___  _ __ (_) |_ ___  _ __ 
//  | |\/| |/ _ \| '_ \| | __/ _ \| '__|
//  | |  | | (_) | | | | | || (_) | |   
//  |_|  |_|\___/|_| |_|_|\__\___/|_|   
//                                      

// Record efficiency and performance statistics
	
// Count

/*
var countPulses   = 0; // How many pulses have happened
var countHitLimit = 0; // How many pulses have gone over the time limit and quit early

var objectsPerList = Average(); // The number objects in the list
var loopsPerPulse  = Average(); // The number of loops in a pulse
var timePerPulse   = Average(); // How long pulses last in milliseconds

var pulseSpeed = Speed(Time.second); // The speed at which pulses are happening right now, keep the most recent 1 second of data
var pulsesPerSecond = Maximum(); // The the highest speed we measured
*/

var p = now(); // The time when we last entered or left the pulse function
/*
var timeInside = 0; // How long the program has spent inside the pulse function, in milliseconds
var timeOutside = 0; // How long the program has spent outside the pulse function, in milliseconds

var loop = 0; // Count how many loops are in each pulse
*/

// Event

// True if it's been longer than the delay since the last pulse finished
function monitorDing() {
	return p.expired(Time.delay);
}

// A pulse started
function monitorStart() {
	/*
	countPulses++;
	pulsesPerSecond.add(pulseSpeed.add(1, Time.second * Describe.thousandths)); // 1 event, get speed in events per second, to the thousandths
	timeOutside += p.age(); // Measure how long we were outside
	*/
	p = now();
	/*
	loop = 0;
	*/
}

// Record another loop in the current pulse
function monitorLoop() {
	/*
	loop++;
	*/
	if (p.expired(Time.quick)) { /*countHitLimit++;*/ return true; } // Quit early if we're over the time limit
	return false;
}

// The pulse ended, the list has n objects in it
function monitorEnd(size) {
	/*
	objectsPerList.add(size);
	loopsPerPulse.add(loop);
	var inside = p.age(); // Measure how long we were inside
	*/
	p = now();
	/*
	timeInside += inside;
	timePerPulse.add(inside);
	*/
}

// Describe
// Compose text for the user about how efficiently the program is running
function monitorDescribeEfficiency() {
/*
	String mostObjectsPerList = Describe.commas(objectsPerList.maximum());
	String averageObjectsPerList = objectsPerList.toString();
	String nowObjectsPerList = Describe.commas(objectsPerList.recent());

	String mostLoopsPerPulse = Describe.commas(loopsPerPulse.maximum());
	String averageLoopsPerPulse = loopsPerPulse.toString();
	String nowLoopsPerPulse = Describe.commas(loopsPerPulse.recent()); //TODO does not work, you need an average of recent values, not a total in time
	
	String mostPulsesPerSecond = Describe.decimal(pulsesPerSecond.maximum(), 3);
	String averagePulsesPerSecond = Describe.divide(Time.second * countPulses, timeInside + timeOutside);
	String nowPulsesPerSecond = Describe.decimal(pulseSpeed.speed(Time.second * Describe.thousandths), 3);

	String mostTimePerPulse = Describe.commas(timePerPulse.maximum());
	String averageTimePerPulse = timePerPulse.toString();
	String nowTimePerPulse = Describe.commas(timePerPulse.recent());
	
	String pulsesHitTimeLimit = Describe.percent(countHitLimit, countPulses);
	String timeSpentPulsing = Describe.percent(timeInside, timeInside + timeOutside);
	
	var s = "";
	s += "pulse efficiency:\r\n";
	s += "\r\n";
	s += Text.table(4,
		"most",              "average",              "now",              "",
		mostObjectsPerList,  averageObjectsPerList,  nowObjectsPerList,  "objects/list",
		mostLoopsPerPulse,   averageLoopsPerPulse,   nowLoopsPerPulse,   "loops/pulse",
		mostPulsesPerSecond, averagePulsesPerSecond, nowPulsesPerSecond, "pulses/second",
		mostTimePerPulse,    averageTimePerPulse,    nowTimePerPulse,    "ms/pulse"));
	s += "\r\n";
	s += say(pulsesHitTimeLimit, " pulses hit time limit\r\n");
	s += say(timeSpentPulsing,   " ms time spent pulsing\r\n");
	return s;
	*/
	return "efficiency";
}








