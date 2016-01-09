
require("./load").load("base", function() { return this; });





/*
var log = console.log;
log("running child");






while (true);//run forever


/*
// Unpause the stdin stream:
process.stdin.resume();

// Listen for incoming data:
process.stdin.on('data', function(data) {
	console.log('Received data: ' + data);
});
*/


/*
var platformChildProcesses = require("child_process");

var log = console.log;
log("running parent");
*/






/*
var child = platformChildProcesses.spawn("node", ["child.js"]);

child.stdin.write("hello you");

child.stdout.on("data", function(d) {
	log("parent got data:");
	log(d+"");
})

child.stderr.on("data", function(d) {
	log("parent got error:");
	log(d+"");
});

child.on("exit", function (exitCode) {
	log("child exited:");
	log(exitCode+"");
});


setTimeout(function() {
	log("killing child process");
	child.kill();
}, 4000);
*/










/*
require("./load").load("base", function() { return this; });




log("running child");






while (true);//run forever
*/

/*
// Unpause the stdin stream:
process.stdin.resume();

// Listen for incoming data:
process.stdin.on('data', function(data) {
	console.log('Received data: ' + data);
});
*/








/*
require("./load").load("base", function() { return this; });

var platformChildProcesses = require("child_process");





if (demo("snip")) { demoSnip(); }
function demoSnip() {
	log("hi from parent");

	keyboard("n", function(key) {
		log("ennnn!");
	});
	keyboard("exit", function() {
		child.kill("SIGKILL");//have the operating system kill the process

		closeKeyboard();
	});


	var child = platformChildProcesses.spawn("node", ["hide_test.js", "demo", "math-speed"]);

	child.stdin.write("hello you");

	child.stdout.on("data", function(d) {
		log("parent got data:");
		log(d+"");
	})

	child.stderr.on("data", function(d) {
		log("parent got error:");
		log(d+"");
	});

	child.on("exit", function (exitCode) {
		log("child exited:");
		log(exitCode+"");

		closeKeyboard();
	});



}


//measure how long the process took in the high resolution timer



if (demo("keyboard")) { demoKeyboard(); }
function demoKeyboard() {
	keyboard("n", function(key) {
		log("ennnn!");
	});
	keyboard("exit", function() { closeKeyboard(); });
}





/*
setTimeout(function() {
	log("killing child process");
	child.kill();
}, 4000);


The exception to this is the SIGKILL and SIGSTOP signals, which are handled by the operating system, and cannot be overridden by the child process.
*/


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



/*
if (demo("ui")) { demoUi(); }
function demoUi() {
	var typed = "";
	keyboard("any", function(key) {
		typed += key.character;
		stick(typed);
	});
	keyboard("exit", function() { closeKeyboard(); });//let the process exit
}
*/





































