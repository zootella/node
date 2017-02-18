console.log("state core\\");
contain(function(expose) {



var thisFile = "state.js"; // The name of this file











//have the 4s timeout built into the base, so you get it enforced for free automatically everywheres

//it was bad design to have monitor make decisions, it should only measure performance, so a monitor of empty functions would work just as well








// After a delay of t milliseconds, run the function f in a later event
function wait(t, f) {
	if (!t) setImmediate(f);  // Run f in the next event without any additional delay
	else    setTimeout(f, t); // In t milliseconds, run f
}

expose.core({wait});










//   ____                       
//  |  _ \  ___ _ __ ___   ___  
//  | | | |/ _ \ '_ ` _ \ / _ \ 
//  | |_| |  __/ | | | | | (_) |
//  |____/ \___|_| |_| |_|\___/ 
//                              

// Run a demo with a command like:
// $ node file.js demo name
var _demo = false;
function demo(name) {
	if (!_demo && process.argv[2] == "demo" && process.argv[3] == name) {
		_demo = true; // Make sure to run only one demo even if there are two with the same name
		return true;
	}
	return false;
}

expose.core({demo});

//   ____                      _   _                      
//  / ___| _ __   ___  ___  __| | | |    ___   ___  _ __  
//  \___ \| '_ \ / _ \/ _ \/ _` | | |   / _ \ / _ \| '_ \ 
//   ___) | |_) |  __/  __/ (_| | | |__| (_) | (_) | |_) |
//  |____/| .__/ \___|\___|\__,_| |_____\___/ \___/| .__/ 
//        |_|                                      |_|    

// See how many times the given synchronous function f runs in a second
// Logs a line like "0.000s 12,3456,678 name" with how long f took to run the first time, and then how many times it ran in 1 second
function speedLoop(name, f) {
	var warm = _speedWarm(f);
	var revolutions = _speedCycle(f);
	var s = commas(revolutions);
	s = s.widenStart(11); // Right align numbers logged separately
	log("# #  #".fill(sayTime(warm), s, name));
}

// See how many times the given synchronous function f runs in a second, 8 times
function speedLoop8(name, f) {
	log("first # took #".fill(name, sayTime(_speedWarm(f))));
	for (var s = 0; s < 8; s++) {                  // Repeat 8 times
		log(items(_speedCycle(f), name), "/second"); // Report how many cycles in that second
	}
}

// See how many times the given synchronous function f runs per second
function speedLoopForever(name, f) {

	var go = true;
	var seconds = 0;
	var cycles = 0;

	var warm = _speedWarm(f);
	report();
	run();

	function run() {
		if (go) {
			cycles += _speedCycle(f);
			seconds++;
			report();
			wait(0, run);
		}
	}

	function report() {
		var s = sayTime(warm);
		if (seconds) s += " " + commas(Fraction(cycles, seconds).whole);
		s += " " + name;
		stick(s);
	}

	keyboard("exit", function() {
		go = false;
		closeKeyboard();
		shutCheck();//have a shut check silent, only complains if something left open
	});
}

// How many milliseconds it takes to run f
function _speedWarm(f) {
	var t = Date.now();
	f();
	return Date.now() - t;
}

// How many times f runs in 1 second
// This function blocks as it runs for 1 second, appropriate in this case but unusual and not correct behavior for node
function _speedCycle(f) {
	var t = Date.now();
	var n = 0;
	while (Date.now() < t + 1000) {
		f();
		n++;
	}
	return n;
}

// See how many times the given asynchronous function f runs in a second, 8 times
// Returns a function for your asynchronous code to call when it's done
// Pass in an allDone function if you want to know when the 8 second test is over
function speedLoopNext(name, f, allDone) {

	var s = 0;          // Number of second long loops we've completed
	var t = Date.now(); // Time the current loop started
	var n = 0;          // Cycles we've counted in the current loop
	var first = true;   // Measure warm up speed

	var callWhenDone = function () {
		wait(0, function() {

			if (first) { // First cycle finished, measure warm up speed
				first = false;

				log("first # took #".fill(name, sayTime(Date.now() - t)));
				t = Date.now();
				n = 0;
				f();

			} else if (Date.now() < t + 1000) { // Still within the current second

				n++; // Count we ran the given code
				f(); // Run the given code again

			} else { // Finished a second

				log(items(n, name), "/second"); // Report how many cycles we completed in the last second
				s++; // Record we finished one more second

				if (s < 8) { // Still more seconds to do

					t = Date.now(); // Reset variables to go another second
					n = 0;
					f();

				} else { // That was the last second

					if (allDone) allDone();
				}
			}
		});
	}

	return callWhenDone; // Call this function when your asynchronous f() is done
}

expose.core({speedLoop, speedLoop8, speedLoopForever, speedLoopNext});



















//   __  __ _     _        _        
//  |  \/  (_)___| |_ __ _| | _____ 
//  | |\/| | / __| __/ _` | |/ / _ \
//  | |  | | \__ \ || (_| |   <  __/
//  |_|  |_|_|___/\__\__,_|_|\_\___|
//                                  

// Log e, but let the program keep running
function mistakeLog(e) {
	_logException(e);
}

// Log e and stop the program, this function does not return
function mistakeStop(e) {
	_logException(e);
	exit(); // Terminate the process right here without closing the program properly
}

// How many objects still need to be shut
function shutCount() {
	clear(); // Remove shut objects from the list
	return list.length;
}

// Call after you've shut all the objects the program used
function shutCheck() {
	if (shutCount()) { // We should have shut them all, but didn't
		log(_sayList());
		exit(); // Otherwise the pulse timer will keep the process running
	}
}
//TODO log(monitorDescribeEfficiency()); // Log performance and efficiency statistics

// Call after you've shut all the objects a test used
function customDone(test) {
	clear(); // Remove shut objects from the list
	if (list.length) { // We should have shut them all, but didn't
		log(_sayList());
		test.fail();
		exit(); // Stop here instead of running the remaining tests
	} else { // The test shut everything correctly
		test.done(); // Tell nodeunit the test finished successfully
	}
}
//TODO you renamed done to customDone, pick a better name

// Force the node process to exit immediately instead of closing by itself
// This function does not return
function exit() {
	log("process exit"); // Make a note the program isn't closing by itself
	process.exit(1); // Report a nonzero error code
}

// Compose text about the given exception
function _logException(e) {
	var s = say(e); // Works even if e isn't a mistake or error, and things are really broken
	log(s);
	//TODO show s in a window on the screen
	//TODO save s to a text file and open it so it appears even if the program is otherwise broken
	//TODO send s in a udp packet to a server
}

// Compose text about the objects left open in the pulse list
function _sayList() {
	var s = line(items(list.length, "object"), " not shut:"); // Compose text about the objects still open by mistake
	for (var i = 0; i < list.length; i++)
		s += line(list[i]); // Say each forgotten item on one or more lines of text
	return s;
}

expose.core({mistakeLog, mistakeStop, shutCount, shutCheck, customDone, exit});

//TODO check out process.on('uncaughtException'), and see how it works in node and electron











//   ____  _           _   
//  / ___|| |__  _   _| |_ 
//  \___ \| '_ \| | | | __|
//   ___) | | | | |_| | |_ 
//  |____/|_| |_|\__,_|\__|
//                         

// Shut the given objects, keeps going through null and exceptions
function shut() {
	for (var i = 0; i < arguments.length; i++) { // Use like shut(o) or shut(o1, o2, o3)
		var o = arguments[i];
		try {
			if (hasMethod(o, "isShut") && !o.isShut()) {
				o._private_isShut = true; // Mark this object as shut, and only do this once
				if (hasMethod(o, "_private_shutMethod")) o._private_shutMethod();
				soon(); // Have the program pulse soon so the object that made this one can notice it finished
			}
		} catch (e) { mistakeLog(e); }
	}
}

/*
Make your object so the program will pulse it, and notice if you forget to later shut it
Pass in and add on your shut, pulse, and pulseScreen methods like this:

var o = mustShut(function() {}); // Shut your objects inside, put away resources, and never change again
o.pulse = function() {};         // Notice things inside your object that have changed or finished, and do the next step to move forward
o.pulseScreen = function() {};   // Compose text and information for the user based on the current state of things
shut(o);                         // Shut your object when you're done with it so they're all shut when the program exits

canShut(s)      Provide a shut method, shut(o) works and is optional, o.pulse() not available
mustShut(s)     Provide a shut method, shut(o) is mandatory, you can add o.pulse() and o.pulseScreen()
pulseScreen(p)  Provide a pulseScreen method, shut(o) is mandatory, shut method not available
*/
function canShut(s) { // Takes your object's shut method s
	var o = {}; // The start of your object we will fill and return
	o._private_shutMethod = s;
	o._private_isShut = false;
	o.isShut = function() { return o._private_isShut; } // True once we're shut, and promise to not change again
	return o;
}
function mustShut(s) { // Takes your object's shut method
	var o = canShut(s);
	// Add the given new object that needs to be shut to the program's list of open objects to keep track of it
	// It's safe to add to the end of the list even during a pulse because we loop by index number
	// The objects in the list are in the order they were made, so contained objects are after those that made them
	list.add(o);
	dingStart(); // Start the ding if it's not started already
	soon();      // Have the program pulse this new object soon
	return o;
}
function pulseScreen(p) { // Takes your object's pulseScreen method
	var o = mustShut();
	o.pulseScreen = p;
	return o;
}

expose.core({shut, canShut, mustShut, pulseScreen});

//   _     _     _   
//  | |   (_)___| |_ 
//  | |   | / __| __|
//  | |___| \__ \ |_ 
//  |_____|_|___/\__|
//                   

var list = []; // Every object the program needs to shut, and hasn't yet

// Remove objects that got shut from the list
function clear() {
	for (var i = list.length - 1; i >= 0; i--) { // Loop backwards so we can remove things along the way
		if (list[i].isShut()) // Only remove shut objects
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










/*

true when we've set immediate to call pulse
start a pulse if one isn't going to happen or happening

soon() -> pulseSoon(), the longer name is better

screen enough is wrong, and will prevent a button from looking clicked immediately
it's enough that list[i] pulse can happne in while(again), while pulseScreen happens only once per pulse

some of these thigns change, others make a ttd note below
hopefully once you've got node streams figured out, you'll realize you don't need pulse at all probably, just pulseScreen

*/




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
		wait(0, _pulse); // Run the _pulse function separately and soon
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
			if (!list[i].isShut() && hasMethod(list[i], "pulse")) { // Skip shut objects
				try {
					list[i].pulse(); // Pulse the object so it notices things that have finished and moves to the next step
				} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
			}
		}
	}

	// In a single pass after that, pulse up the list to have objects compose information for the user
	for (var i = list.length - 1; i >= 0; i--) {
		if (!list[i].isShut() && hasMethod(list[i], "pulseScreen")) { // Skip shut objects
			try {
				list[i].pulseScreen(); // Pulse the object to have it compose text for the user to show current information
			} catch (e) { mistakeStop(e); } // Stop the program for an exception we didn't expect
		}
	}

	clear(); // Remove shut objects from the list all at once at the end
	monitorEnd(list.length);
	start = false; // Allow the next call to soon() to start a new pulse
}

expose.core({soon});


















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
//TODO code out here runs while load is going, don't call core functions like this out here
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

	var s = line("pulse efficiency:");
	return s;
}



























//TODO move this higher in the file, or in another file

//   ____                              
//  |  _ \ _ __ ___   ___ ___  ___ ___ 
//  | |_) | '__/ _ \ / __/ _ \/ __/ __|
//  |  __/| | | (_) | (_|  __/\__ \__ \
//  |_|   |_|  \___/ \___\___||___/___/
//                                     

// True if we are a forked child process
function isFork() { return typeof process.send == "function"; }

// See if we can find a running process with the given ID like 94215, returns "yes", "no", or "maybe" if we couldn't prove it either way
function isProcessRunning(pid) {
	checkType(pid, "number"); // Make sure the process ID is a number
	try {
		var r = process.kill(pid, 0); // Doesn't kill the process, just sends a signal
		if (r === true) return "yes"; // Running process found
	} catch (e) {
		if (e.errno === "ESRCH") return "no"; // Running process not found
	}
	return "maybe"; // That code acted in a way we didn't expect
}

expose.core({isFork, isProcessRunning});





















});
console.log("state core/");