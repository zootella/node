
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













var platformChildProcess = require("child_process");

function demo(name) { return process.argv[2] == "demo" && process.argv[3] == name; }
var log = console.log;
function trim(d) { return (d+"").trim(); }

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









if (demo("child2")) { demoChild2(); }
function demoChild2() {
	log("in child, log hi");

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in child, process.in got '"  + trim(d) + "'");
		if (trim(d) == "exit") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo child2
in child, log hi
message                             <- type 'message' and press Enter
in child, process.in got 'message'
exit
in child, process.in got 'exit'
in child, pausing process.in
*/

if (demo("parent2")) { demoParent2(); }
function demoParent2(name) {
	log("in parent, log hi");

	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child2"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '"  + trim(d) + "'"); });
	child.on("exit",        function(d) { log("in parent, child got exit '" + trim(d) + "'"); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '" + trim(d) + "'");//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo parent2
in parent, log hi
in parent, child.out got 'in child, log hi'
message
in parent, process.in got 'message'
in parent, child.out got 'in child, process.in got 'message''
exit
in parent, process.in got 'exit'
in parent, pausing process.in
in parent, child.out got 'in child, process.in got 'exit'
in child, pausing process.in'

TODO but then, it keeps running
*/






if (demo("child3")) { demoChild3(); }
function demoChild3() {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log(d.toString("hex"));
		if (d.toString("hex") == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
/*
$ node run.js demo child3
61                            <- a
41                               Shift+a, produced a single byte with the ASCII value for A
1b5b337e                         Delete produces 4 bytes
1b                               Escape, which is the exit trigger
in child, pausing process.in
*/

/*
if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child3"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '"  + trim(d) + "'"); });
	child.on("exit",        function(d) { log("in parent, child got exit '" + trim(d) + "'"); });
}
*/
/*
$ node run.js demo parent3
in parent, child got exit '1'

TODO exits with an error right away
*/






if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	var child = platformChildProcess.spawn("node", ["run.js", "demo", "child3"]);
	process.stdin.pipe(child.stdin);
	child.stdout.pipe(process.stdout);
}











if (demo("parent4")) { demoParent4(); }
function demoParent4(name) {
	platformChildProcess.exec("pwd", function(error, bufferOut, bufferError) {
		log("error:        " + trim(error));
		log("buffer out:   " + trim(bufferOut));
		log("buffer error: " + trim(bufferError));
	});
}
/*
$ node run.js demo parent4
error:        null
buffer out:   /Users/Name/program/node
buffer error: 
*/







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



















require("./load").load("base", function() { return this; });

var platformChildProcesses = require("child_process");















if (demo("child2")) { demoChild2(); }
function demoChild2() {
	log("in child, log hi");

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in child, process.in got '#'".fill(trim(d)));
		if (trim(d) == "exit") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
//works

if (demo("parent2")) { demoParent2(); }
function demoParent2(name) {
	log("in parent, log hi");

	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child2"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
//TODO both pause stdin, but nothing exits





if (demo("child3")) { demoChild3(); }
function demoChild3() {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log("got # bytes quoted #".fill(Data(d).size(), Data(d).quote()));
		if (Data(d).quote() == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
//works

if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	log("in parent, log hi");

	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child3"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
//TODO exits right away



if (demo("child4")) { demoChild4(); }
function demoChild4() {
	keyboard("any", function(key) { log(inspect(key)); });
	keyboard("exit", function() { log("got exit"); closeKeyboard(); });
}
//works

if (demo("parent4")) { demoParent4(); }
function demoParent4(name) {
	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child4"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

/*
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		log("got # bytes quoted #".fill(Data(d).size(), Data(d).quote()));
		if (Data(d).quote() == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
*/
}











/*



if (demo("child5")) { demoChild5(); }
function demoChild5() {
	keyboard("any", function(key) { log("child ", inspect(key)); });
	keyboard("exit", function() { log("got exit"); closeKeyboard(); });
}

if (demo("parent5")) { demoParent5(); }
function demoParent5(name) {
	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child5"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});


	//for this, why not use keyboard() top and bottom, then you don't have to worry about this stuff directly
	//will it work?
	//will both close?

	//and these are node processes, actually, so you should stop writing these demos and just use fork with keyboard() messages going back and forth, that's all you need to get working for this, duh, stop using time on more general cases

	//ok, the top can't use keypress, because it needs raw data like shift being held down and stuff


}




//child3 use raw mode to see the individual keystrokes
//child4 use keyboard() and then remote control keyboard



//read a jquery book online, or watch jquery videos to learn it, i bet all you need for everything front-end is provided by jquery and easy to learn in just a few days




//run.js, run_test.js, run3_test.js

/*
ok, that works fine
now make one that can use the keyboard through it
use child.stdin.write


and then do the same sets of stuff the node way, with fork instead of spawn, and send and receive javascript objects


looks like raw mode is to get every byte, not just the bunch that end with the EOF that Ctrl+D sends


node docs are saying to not call .resume() as it swiches the stream to old mode


icarus could actually show the bytes that went back and forth to the process it's running, which would be better than terminal's weird echoing thing


there's keyboard stuff right in jquery, that might be enough for the browser/electron side of those demos

*/









//http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin/12506613#12506613





if (demo("snip")) { demoSnip(); }
function demoSnip() {

}










//use css to color two spans that flow next to each other so that you can see them distinctly, with no borders
//do this with a shine dot or gradient background
//http://www.colorzilla.com/gradient-editor/
//just diagonal, probably













/*

here's the demo progression

child logs and exits
parent runs child

child talks back and accepts exit command
parent runs child and sends exit command

demo runs pwd
demo runs notepad

child uses keyboard()
parent goes raw and works as remote





*/

















//https://github.com/krasimir/yez














































