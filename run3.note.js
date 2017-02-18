
require("./load").library();

















//CLOSE
//rename closeCheck something definitive, like exit() or goodnight() or byebye()

//CLOSE
/*
refactor keyboard() and closeKeyboard() to be not global, and compatible with close, like this
var k = keyboard();
close(k);
have everything that needs to be closed use close(a, b, c) to be simple and consistant, and be taken along when you update close
*/















//INT
if (demo("snip-run3")) { demoSnip(); }
function demoSnip() {

	var r1 = 94906265;
	var r2 = 10000000;

	log(int(Number.MAX_SAFE_INTEGER));
	log(int(r1, "*", r1));
	log(int(r2, "*", r2));

	//9007199254740991
	//100000000000000
	//10000000

	//annoyingly, this didn't make it fast
	//you still want to see how many times _bothFitProduct returns true or false with the different high range to understand it better
}

//INT
//here's why int might be slow
//your random number generator, under the square root of max int, but is that big enough that 90% is done with bignumber.js?
//find out
//fix it so that it doesn't go into bignumber.js
//this might get your code back into the millions, which would be great
























//METER
//give meters string names like "histogram" instead of function names like HistogramMeter
//Meter is the box, Instrument is one thing inside it
























//JQUERY
//read a jquery book online, or watch jquery videos to learn it, i bet all you need for everything front-end is provided by jquery and easy to learn in just a few days

//JQUERY
//there's keyboard stuff right in jquery, that might be enough for the browser/electron side of those demos

//JQUERY
//use css to color two spans that flow next to each other so that you can see them distinctly, with no borders
//do this with a shine dot or gradient background
//http://www.colorzilla.com/gradient-editor/
//just diagonal, probably

//JQUERY
/*
make a page that uses jquery
it has some divs on it
get the div with the keyboard focus to turn a different color
have the divs show information about the last keyboard thing that happened
*/













//ICARUS
//measure how long the process took in the high resolution timer

//ICARUS
/*
blue, not run yet
yellow, running
green, done
red, done with error return code, actually use the return code
*/

















//TUI
/*

starts with a box

[text area] [go] (or press enter)

starts that process, piping log and error back here, and sending keyboard commands

yellow while running, blue when done

red [x] terminates early

shows at the top how long it's been running
once done, says how long it took

design buttons and text fields so they work in text mode in the regular terminal, too
here's how
all you have to do to make a button is say [Button]
then in the browser, if the mouse clicks that, it's the same as typing "[Button]"(enter)
ok, so how do you move the focus to a text box and type in it
shows the focus like this
[ ]  no focus
[>]  has focus
[>typed]  typing in the box
use tab to cycle the focus, also through the buttons, this will work over the server, too
in the browser, clicking sets the focus also
and then enter to click a button
or also, shortcut keys
[@Button], now b will hit that one
[>@Button], you tabbed to the button, enter will hit it

this is stick ui, essentially

ok, a command line app can not use keyboard() at all, that's fine
or it can use keyboard() as apps currently do, where you get every key
or you can instead use this new thing, which sits between your code and the keyboard, and lets stick() contain ui
instead of getting every keystroke, now you just get called with strings of completed ui events, like a button got clicked or a form field got entered with text in it

Path: [  ] normal
Path: [> ] focused
[@Go ] button, must have unique shortcut key
[!Go!] clicked, goes away after 500ms or whatever
[~Go~] unavailable
[-Pause-] not pressed
[+Pause+] pressed

>stuff the app tells the system
what the ui and buttons are, just from their ascii markup

>stuff the ui system takes care of itself
moving the focus around
translating a shortcut key into a button press
showing the recent press exclimation mark

>stuff the ui system tells the app beneath
when the user presses enter, so it can get the text in all the form fields
when the user presses a button, either by enter or by a shortcut key

this is really wild

probably don't let them type the square braces, limit at the start to just letters and numbers and spaces, for simplicity and security
there is no insertion pointer
backspace deletes the last character, delete clears the text field
the arrow keys are like tab and shift tab, up and left are shift tab, down and right are tab
caps lock and shift work for upper and lowercase
trying to think of a time when you would need to send an app punctuation symbols, ah, slashes for paths, so allow those

make a little calculator with this, that's a cool idea

your app gets the text that was clicked, the whole line so you can see context, with the ! on the one that got entered or clicked

don't use form fields, rather, use keypress browser side to show when a div has the focus, and grow with the keys it gains

code this up in two halves
(1) browser only: keypress gets the input, jquery updates the boxes
(2) node only: all works through the command line
and only then combine them with
(3) electron
*/

//TUI
/*
the markup is a little bit more, like <checkbox:&Automatic>
rendered to charm text, it's like [>X Automatic]
rendered to page html, it does actually use html form elements
*/





















//ELECTRON
//remember that all of this is for icarus
//it's even more exciting to see your existing demos and tests run in electron, right there in the electron process




























//FORK
//The exception to this is the SIGKILL and SIGSTOP signals, which are handled by the operating system, and cannot be overridden by the child process.

//FORK
/*
goals

you've got lots of command line apps that use
https://www.npmjs.com/package/keypress  to get keyboard input and
https://github.com/substack/node-charm  to update text output without scrolling

and they work great in 2 environments:
-local shell
-remote shell, obviously

get them working in 2 more environments:
-through a parent node app, using child_process
-through a webpage, using electron
*/

//FORK
/*
doesn't work, and doesn't matter
you wouldn't have been able to emulate charm on the page, anyway
use fork and messages
extend your keyboard() and stick() to act for either standard streams, or icarus custom
you can probably detect which ran you, or have a switch like $

to have icarus use nodeunit, ls, stuff like that, you don't need charm or interactive keyboard

so put this back under load
and write some demos with fork and message passing
*/

//FORK
/*
pids are short but count upwards as more processes get made
so you can use them to identify a process

you really only need two ways to close
the nice way, with a signal up and then disconnect down
the strongest way, with sigkill

write code that closes nice
then waits 4s, and if still open, closes strong, and mistake logs it
then waits 4s, and if still open, and mistake logs that
*/

//FORK
if (demo("count")) { count(); }
function count() {
	keyboard("c", function() { listProcesses("node"); });
	keyboard("e", function() { closeKeyboard();       });
}
//and make one that acts just like process monitor, keeping itself up to date using pulseScreen() and stick()

//FORK
/*
ok, time to design and code it for real

>the software stack for icarus
on top, you type onto electron
a page there uses jquery to get the keystrokes
some node code in the electron page forks a process
your custom messages communicate keystrokes down, and get log and stick messages up
on bottom, the forked node process knows it's forked
keyboard, log, and stick act differently to send messages up to p

>ways c can behave
sends the 'im done' message, or doesn't
runs out, or throws
closes everything that would keep the process open, or forgets something
busy loops forever

>ways p will shut down c
send down 'exit' command, send up 'im done'
disconnect
sigkill
wait 4s, see if it's still running, sigkill again

>simpler without imdone
p sends down the exit command and disconnects
wait 4s, if still running sigkill and log
wait 4s, if still running sigkill and log a second time, that's it

>if forked
keyboard doesn't use keypress, and listens for keyboard messages from above
log and stick don't use console.log or charm, and sends log and stick messages upwards
closeCheck does the same stuff, and also sends the 'im done' message updwards, and also calls process exit just in case
logException communicates upwards also, but you haven't written that at all yet, so just make a todo
*/

//FORK
/*
how forked processes work if everything works

c starts, and opens something that will keep it open
p tells it to exit, essentially clicking the x downwards on c
c closes everything, and then says 'im done' upwards
p calls disconnect, and c exits naturally

this is demo p34
and now, think about all the ways that it can go wrong

c forgets to close something, keeping it open (you've demoed that then p can kill it)
c doesn't send the im done message upwards (your design will let p kill it)
c doesn't call process exit itself (your design will let p kill it)

ok, if that happens, then p checks 4 seconds later, and it's still running, then it sigkills it, and mistakelogs this
and then checks again 4 seconds later, and it's still running, and mistakelogs this again

make demos that get the process id, see if it's still running or not
*/

//FORK
//to close naturally, c can't close itself, but it can tell p when it's done, this is the special done code
//or, to be simpler, have closeCheck if forked kill the process, and you don't need a special done code

//FORK
//run all these demos on windows, too, xp and 7, to make sure they work there

//FORK
/*
your wrap of fork() includes these protections
-if there are too many node processes, throw
-if this process is forked, it can't fork another one. only allow non forked processes to fork, throw
*/












/*
>if forked
measure.js keyboard doesn't use keypress, and listens for keyboard messages from above
measure.js log and stick don't use console.log or charm, and sends log and stick messages upwards
state.js closeCheck does the same stuff, and also sends the 'im done' message updwards
state.js _logException communicates upwards also, but you haven't written that at all yet, so just make a todo

get started on that before icarus
instead of a web client on top, it'll be a command line client
p isn't forked, and uses real keypress, charm, console.log, all that
c can tell it's forked, and switches to forked mode
yeah, that'll work
*/


/*
>with the imdone message (do it this way)
there is still an "exit" message downwards
this is like p clicking the x down on c
c gets it, closes everything, calls closeCheck(), and then sends im done upwards
p closes the connection, now c should exit naturally
p waits 4s and then looks, if c is still running, it sigkills it and logs a message that it had to do that
p waits 4s more and then looks again, if c is still running, it logs a message that its sigkill failed

>without the imdone message
p sends "exit" down to c, like clicking the x down on it
c closes everything, calls closeCheck(), which includes process.exit
p can't close the channel anymore because it doesn't know when to, this is why you need the imdone message

what happens if c suddenly calls process.exit
there's no communication channel that works anymore
p will notice
*/

/*
fork message protocol

>down
["key", s]
["exit"]

>up
["log", s]
["stick", a]
["error", e]
["exit"]
*/

















//you can do more with charm, like color and inverse video





/*
all this is about making icarus to run tests and demos in that improved terminal
beyond this, imagine being able to sort of shell into the running local instance of the app
imagine running demos and viewing and adjusting parts of the app as its running
at some point you'll want to build that, too
*/




/*
big thinking about fork and log and keyboard and the text ui language
all this uses globals and groups of functions right now because the design assumes that there's exactly one terminal, exactly one app, and one communication channel between them
and fork makes it so that you can have a second special case, a child process beneath the main process
but what about multiple apps running in the same process, talking to the terminal and each other
what about shelling into a single process, and starting and stopping different apps with the same terminal

this is big to think about, but also feels like it done simply and correctly and extensibly would be just a few hundred lines of code
they really just send messages to each other

you are just reinventing the unix standard streams here
when you start a process, you define what streams are around it
likewise, when you call a function using this system, you'd be placing these same sorts of standard streams around it

this might be the end of the issues related to globals and performance, too
when something logs, where does it go? does it go to console.log, or does it go to forkSendUp(), that's what this is about

for right now it would be ok to just make this work so you can make icarus and then the backup program, though

ok, done like this, you can't call the global log() anymore, because it needs to remember where it's logging to
you can't call any function that uses a global, because there aren't any globals
when you call a function, you need to pass in the library of useful environment-specific stuff for it to use

//using globals
function main() {
	f2();
}
function f2() {
	f3();	
}
function f3() {
	log("hi");
}

//using worlds
function main(world) {
	f2(world);
}
function f2(world) {
	f3(world);	
}
function f3(world) {
	world.log("hi");
}

it's not too bad to pass in world when you run the app, and it's ok to have to pick log off it each time
but passing it through every function call is really annoying

ok, so then all you need to do is make a preprocessor where the first 

or, maybe it's not annoying if it's _
f2();//before
f5(a, b, c);
f2(_);//after
f5(_,a, b, c)
and then inside, _.log

and then there really are no globals!
and you can tell when you are calling a function that is going to need the world or not

and to force the good behavior, you'd make it so that you actually can't define or use a global
you don't right now know how you'd do that

so maybe you've actually solved it, and this is one of the coolest ideas in snap
in snap, you'd have different parenthesis or something

you still need to figure out how and when you create new worlds
and if that makes a mess, creating new worlds all the time
*/

















//   _                
//  | |    ___   __ _ 
//  | |   / _ \ / _` |
//  | |__| (_) | (_| |
//  |_____\___/ \__, |
//              |___/ 

// Log the given list of anything on the console, prefixed with the day and time
function log() {

	var s = sayDateTemplate(now().time, "ddHH12:MMaSS.TTT") + "  "; // Log the given arguments on a single line of text after the day and time
	for (var i = 0; i < arguments.length; i++) s += say(arguments[i]);

	if (isFork()) {
		forkSendUp("log", s);      // If we're a forked process, don't mess with the console, send the log line up in a message
	} else if (!platformCharm) { // Before code calls stick(), we're just using console.log
		console.log(s);            // Pass stamp the same arguments we were given
	} else {                     // We're using charm, and may have text to stick on the end of the console
		stickErase();
		console.log(s);
		stickDraw();
	}
}

//   ____  _   _      _    
//  / ___|| |_(_) ___| | __
//  \___ \| __| |/ __| |/ /
//   ___) | |_| | (__|   < 
//  |____/ \__|_|\___|_|\_\
//                         

var lines = []; // Array of lines of text to keep stuck to the end of the terminal

// Stick the given lines of text to the end of the console
// Each line can be an argument, like stick("line1", "line2"), or a single string with newlines
function stick() {

	var a = []; // Separate lines of text and put them in a
	a.add(""); // Start stick text with a blank line to keep it visually separate from log lines above
	if (!arguments.length) a.add(""); // Make stick() the same as stick("")

	for (var i = 0; i < arguments.length; i++) {
		var s = say(arguments[i]); // Turn each argument into text
		a = a.concat(s.swap("\r\n", "\n").swap("\r", "\n").rip("\n")); // Separate multiple lines in a single string
	}

	if (!isFork()) {
		l = []; // Wrap long lines and put them in l
		for (var i = 0; i < a.length; i++) {
			var s = a[i];
			var indent = ""; // No indent before the line wraps
			var wrap = process.stdout.columns - 2; // Make 2 narrower to keep a newline from wrapping onto the next line
			if (s.length) { // This line has text
				while (s.length) {
					var before, after;
					if (s.length <= wrap) { before = s;             after = "";             }
					else                  { before = s.start(wrap); after = s.beyond(wrap); }
					l.add(indent + before);
					s = after;
					if (!indent.length) { // Wrapped lines get a hanging indent
						indent = "  ";
						wrap -= indent.length;
					}
				}
			} else { // We're on a blank line
				l.add(s); // Add the blank line to the finished array
			}
		}
		a = l; // Point a at the new array of wrapped lines
	}

	if (!arraySame(lines, a)) {            // Only update the text if it's actually changed
		if (isFork()) {
			forkSendUp("stick", a);
		} else {
			if (lines.length != a.length) {    // Different number of lines, redraw the whole thing
				stickErase();
				lines = a;
				stickDraw();
			} else {                           // Same number of lines, redraw only the lines that have changed
				charmCursor(false);     // Hide the cursor, otherwise you can see it moving to each line
				charmDown(-lines.length);
				for (var i = 0; i < lines.length; i++) {
					if (lines[i] != a[i]) {        // Line different
						charmErase("line");
						console.log(a[i]);           // Write the line and move down to the next one
						lines[i] = a[i];             // Remember what we have on the screen
					} else {                       // Line same
						charmDown(1);       // Move down without blinking the line
					}
				}
				charmCursor(true);      // Show the cursor again
			}
		}
	}
}

function stickErase() {
	if (lines.length > 0) {
		charmDown(-lines.length);
		charmErase("down");
	}
}
function stickDraw() {
	for (var i = 0; i < lines.length; i++) console.log(lines[i]); // Stick lines at the end of the console
}

function charmCursor(b)   { charmLoad(); platformCharm.cursor(b);   }
function charmDown(y)     { charmLoad(); platformCharm.up(y);       }
function charmErase(name) { charmLoad(); platformCharm.erase(name); }
function charmLoad() {
	if (!platformCharm) { // Load the charm module to start using it, if we haven't already
		platformCharm = require("charm")(); // Charm wants us to execute the returned function and save that result
		platformCharm.pipe(process.stdout);
		// Charm documentation reccommends platformCharm.on("^C", process.exit); but demos are closing naturally without it
	}
}
var platformCharm; // Undefined until we start using charm

//   _  __          _                         _ 
//  | |/ /___ _   _| |__   ___   __ _ _ __ __| |
//  | ' // _ \ | | | '_ \ / _ \ / _` | '__/ _` |
//  | . \  __/ |_| | |_) | (_) | (_| | | | (_| |
//  |_|\_\___|\__, |_.__/ \___/ \__,_|_|  \__,_|
//            |___/                             

var keyMap = {}; // keyMap["n"] is the array of functions we'll call when the user presses the n key

// Call f when the user presses the key for a character like "n", "8", "*", "tab", or "escape"
// "any" to get all the events, "exit" to get escape and control+c
function keyboard(character, f) {
	if (isFork()) {
		if (!forkKeyboardReady) {
			forkKeyboardReady = true;
			process.on("message", function(m)) {
				if (m.length && m[0] == "key") keyPressed(m[1].character, m[1].key);
			}
		}
	} else {
		if (!platformKeypress) {                    // Load the keypress module to start using it, if we haven't already
			platformKeypress = require("keypress");
			platformKeypress(process.stdin);          // Have standard in emit "keypress" events
			process.stdin.setRawMode(true);           // Change other standard in settings for using the keypress module
			process.stdin.resume();
			process.stdin.on("keypress", keyPressed); // Call keyPressed() below on "keypress" events
		}
	}
	if (!keyMap[character]) keyMap[character] = []; // Make an array for the first function
	keyMap[character].add(f);
}

// The user pessed a key on the keyboard
function keyPressed(character, key) {
	soon(); // Pulse soon on user input
	if (!key) key = {}; // On some keys, like numbers, keypress only gives us character
	key.character = character; // Group the two parameters together

	callAll(keyMap["any"], key); // Call the functions that want to know about any key
	callAll(keyMap[key.character], key); // Just one key
	if (key.name && key.name != key.character) callAll(keyMap[key.name], key); // The key by a different name
	if (key.name == "escape" || (key.name == "c" && key.ctrl)) callAll(keyMap["exit"], key); // Call the exit functions on escape and control+c

	function callAll(a, p) { if (a) for (var i = 0; i < a.length; i++) a[i](p); } // Call all the functions in array a, giving each one parameter p
}

function keyPressedFork(message) {
	soon(); // Pulse soon on user input


	callAll(keyMap["any"], key); // Call the functions that want to know about any key
	callAll(keyMap[m[1]], key); // Just one key
	if (key.name && key.name != key.character) callAll(keyMap[key.name], key); // The key by a different name
	if (key.name == "escape" || (key.name == "c" && key.ctrl)) callAll(keyMap["exit"], key); // Call the exit functions on escape and control+c

	function callAll(a, p) { if (a) for (var i = 0; i < a.length; i++) a[i](p); } // Call all the functions in array a, giving each one parameter p
}

// Stop listening for keyboard keys
function closeKeyboard() {
	keyMap = {};
	process.stdin.pause(); // Tell standard in to stop sending us keypress events, allowing the process to close
}




/*
["key", {character, key}] //what the key message downwards looks like
//just send the raw keypress message downwards, and then only have one function parse it from wherever it came

if we have a fork, then we send our keystrokes down, until we get rid of the fork
they don't go multiple places, it's like shelling from the terminal

//new standardized design
var keyboard = watchKeyboard();
keyboard.on("h", function() {});
close(keyboard);

//lone, this is as written
watchKeyboard() starts up keypress and resumes stdin
add to and use keyMap
close(keyboard) pauses stdin

//we're p, and we have c below
watchKeyboard() startsup keypress and stdin
avoid keyMap, send messages down to c instead
close(keyboard) pauses stdin

//p is above, we're c below
watchKeyboard() doesn't use keypress or stdin, it just listens for process messages
add to and use keyMap
close(keyboard) stops listening for process messages
*/




function watchKeyboard() { return isFork() ? FarKeyboard() : NearKeyboard(); }



var platformKeypress; // The keypress module, once we load it

function NearKeyboard() {
	if (platformKeypress) toss("state");      // You can only watch the keyboard once

	platformKeypress = require("keypress");   // Load the keypress module to start using it, if we haven't already
	platformKeypress(process.stdin);          // Have standard in emit "keypress" events
	process.stdin.setRawMode(true);           // Change other standard in settings for using the keypress module
	process.stdin.resume();
	process.stdin.on("keypress", keyPressed); // Call keyPressed() below on "keypress" events

	var o = mustClose(function() {
		keyMap = {};
		process.stdin.pause(); // Tell standard in to stop sending us keypress events, allowing the process to close
	});

	o.on = function()
	return o;
}

function FarKeyboard() {







	var o = mustClose(function() {
		keyMap = {};
	});


	process.on("message", function(m) {
		if (!o.isClosed()) {

		}
	});




	return o;
}
















var inspect = platformUtility.inspect; // Rename instead of wrapping

exports.log = log;
exports.stick = stick;
exports.keyboard = keyboard;
exports.closeKeyboard = closeKeyboard;
exports.inspect = inspect;



/*
>current


>we're p
in addition to hitting keyboard handlers, send "key" messages down

>we're c
if (isFork()) don't use keypress at all, it won't tell us when keys are hit, incoming "key" messages will



*/








































/*
["key", {character, key}] //what the key message downwards looks like
//just send the raw keypress message downwards, and then only have one function parse it from wherever it came

if we have a fork, then we send our keystrokes down, until we get rid of the fork
they don't go multiple places, it's like shelling from the terminal

//new standardized design
var keyboard = watchKeyboard();                done
keyboard.on("h", function() {});               done
close(keyboard);                               done

//lone, this is as written
watchKeyboard() starts up keypress and resumes stdin      done
add to and use keyMap                                     done
close(keyboard) pauses stdin                              done

//we're p, and we have c below
watchKeyboard() startsup keypress and stdin               done
avoid keyMap, send messages down to c instead
close(keyboard) pauses stdin                              done

//p is above, we're c below
watchKeyboard() doesn't use keypress or stdin, it just listens for process messages   done
add to and use keyMap                                                                 done
close(keyboard) stops listening for process messages                                  done

//todo
make sure that keyMap = {} is true not false
make sure that you can process.on message twice and they both get called
*/




var keyMap; // keyMap["n"] is the array of functions we'll call when the user presses the n key
var platformKeypress; // The keypress module, once we load it

//open the keyboard to find out when the user presses keys
function watchKeyboard() {
	if (keyMap) toss("state");//make sure the keyboard isn't already open
	keyMap = {};

	var keyboard = isFork() ? _nearKeyboard() : _farKeyboard();
	keyboard.on = function(character, f) {
		if (!keyMap[character]) keyMap[character] = []; // Make an array for the first function
		keyMap[character].add(f);
	};
	return keyboard;
}

//we're p at the top, start up keypress and resume stdin
function _nearKeyboard() {
	platformKeypress = require("keypress");
	platformKeypress(process.stdin);           // Have standard in emit "keypress" events
	process.stdin.setRawMode(true);            // Change other standard in settings for using the keypress module
	process.stdin.resume();
	process.stdin.on("keypress", _keyPressed); // Call _keyPressed() below on "keypress" events

	var o = mustClose(function() {
		keyMap = null;
		process.stdin.pause(); // Tell standard in to stop sending us keypress events, allowing the process to close
	});
	return o;
}

//we're c at the bottom, tell p above to open the keyboard, and listen for key messages from above
function _farKeyboard() {
	process.send("open keyboard");
	process.on("message", function(m) {
		if (!o.isClosed()) {
			if (m[0] && m[0] === "key" && m[1]) _keyPressed(m[1].character, m[1].key);
		}
	});

	var o = mustClose(function() {
		process.send("close keyboard");
		keyMap = null;
	});
	return o;
}

// The user pressed a key on the keyboard
function _keyPressed(character, key) {
	soon(); // Pulse soon on user input
	if (!key) key = {}; // On some keys, like numbers, keypress only gives us character
	key.character = character; // Group the two parameters together

	callAll(keyMap["any"], key); // Call the functions that want to know about any key
	callAll(keyMap[key.character], key); // Just one key
	if (key.name && key.name != key.character) callAll(keyMap[key.name], key); // The key by a different name
	if (key.name == "escape" || (key.name == "c" && key.ctrl)) callAll(keyMap["exit"], key); // Call the exit functions on escape and control+c

	function callAll(a, p) { if (a) for (var i = 0; i < a.length; i++) a[i](p); } // Call all the functions in array a, giving each one parameter p
}



//ok, we're p on top, and we fork a c, and c says up to us that it wants keyboard events
/*
p runs
p forks c
c opens the keyboard
-instead of starting up keypress, c sends a message up to p, which starts up keypress

the real keyboard types on p
-p has keypress open, and sends keypress messages down to c

c closes the keyboard
-c sends a message up to p, which closes down keypress

so there are some new messages here
the downward message is 'key'
the new upward messages are 'keyboard open' and 'keyboard close'

ok, so fork is going to have to keep c and listen for messages up from it
and then when it gets 'open keyboard' or 'close keyboard', it does it

there's only one keyboard, so maybe it's ok to have a global
and you can open it multiple times, different parts of the program can start and stop listening
and then when everybody stops listening, that's when it does a shutdown

yeah, so the first thing you need to code is that, assuming just p alone with no c, but different parts below opening the keyboard and closing it again

*/




/*
time to come up with a new design which is as generalized and flexible as the problem

there can only be one P at the top
there can be 0+ Cs at the bottom
any of those can open the keyboard, submitting a function that will get every keystroke
and then later close it, at which point that function shouldn't get called anymore
later they can reoopen it, but they can't open it once it's already open

only p at the top uses keypress

so the messages are

up: ["key open"]
down: ["key press", {enhanced keypress message}]
up: ["key close"]
*/


var keyboardWatchers = [];//list of all the parts of this program that want to get all keystrokes

function watchKeyboard(f) {//give this the function that will get called with all keystrokes
	if (!keyboardWatchers.length) {
		//open the process' keyboard access, the first part of this program wants it
	}
	var o = KeyboardWatcher(f);
	keyboardWatchers.add(o);
	return o;
}//save the keyboard o you get, and close(keyboard) when you're done with it

//o is in the keyboardWatchers array, and what you need to do is remove it
function removeFromKeyboardWatchers(o) {
	//find o in the keyboardWatchers array and remove it, you'll need a test to confirm you can do that with === on object reference, write a remove() that takes a comparison function to use, returns how many got removed, and if no comparison function is given, uses ===, or have you already done this?
	//nowait, what about List, doesn't that already do this? can you even use list with object reference comparison? if not, update it there, rather than making stupid array better
	if (!keyboardWatchers.length) {
		//close the process' keyboard access, the last part of this program doesn't want it anymore
	}
}

//represents a single part of this process that wants to hear everything that happens on the keyboard
//and this is the thing you have to close
function KeyboardWatcher(f) {
	var o = mustClose(function() {
		removeFromKeyboardWatchers(o);
	});
	o.f = f;
	return o;
}

//down here, have the near access and the far access, this can all be global
//and you don't need to worry about duplicate opens or forgetting to close, because the code above checks and prevents all that

var platformKeyPress;
function _nearKeyboardOpen() {
	platformKeypress = require("keypress");
	platformKeypress(process.stdin);          // Have standard in emit "keypress" events
	process.stdin.setRawMode(true);           // Change other standard in settings for using the keypress module
	process.stdin.resume();
	process.stdin.on("keypress", keyPressed); // Call keyPressed() below on "keypress" events
}
function _nearKeyboardKeyPressed() {

}
function _nearKeyboardClose() {

}
function _farKeyboardOpen() {

}
function _farKeyboardKeyPressed() {

}
function _farKeyboardClose() {

}








//tell if you're P
if (!isFork())

//send a message down to every C below
sendToForks(message)

//receive a message from a C below
listenForMessageFromFork(f)

//tell if you're C
if (isFork())

//send a message up to P above
sendToParent(message)

//receive a message from P above
listenForMessageFromParent(f)

























function fork(module, arguments) {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c33"]);
	c.send("hello");
	c.on("message", function(m) { log(m); });
}
function c33() {
	process.on("message", function(m) {
		process.send(say("in c, got message '#'".fill(m)));
	});
}


function forkSend(name, body) {

}

function forkReceive(f) {

}



//have two keyboard systems, and then the hookup is 



//if you subscribe two of those guys, do they both get hit? write a demo to find out

































