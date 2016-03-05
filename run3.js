
require("./load").load("base", function() { return this; });

















//CLOSE
//rename closeCheck something definitive, like exit() or goodnight() or byebye()
















//INT
if (demo("snip")) { demoSnip(); }
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













/*
>if forked
keyboard doesn't use keypress, and listens for keyboard messages from above
log and stick don't use console.log or charm, and sends log and stick messages upwards
closeCheck does the same stuff, and also sends the 'im done' message updwards, and also calls process exit just in case
logException communicates upwards also, but you haven't written that at all yet, so just make a todo

get started on that before icarus
instead of a web client on top, it'll be a command line client
p isn't forked, and uses real keypress, charm, console.log, all that
c can tell it's forked, and switches to forked mode
yeah, that'll work
*/
































































