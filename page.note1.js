






/*
without style, what if you reinvented the repl
sort of an in-place, same process, tree-expanding, names and values repl
mock that up and start experimenting, improving
*/




/*
make a few electron windows
get them to call functions in each other
for now, it's totally fine if everything is blocking and synchronous even though they're actually separate processes
it's ok to act like it's all happening in the same process
*/


/*
the browser process gets commadn line arguments
the renderer process doesn't, but you load index.html
can you put a query string on that, and then read arguments that way
make it so you can pass an arbitrary js object that way, like 3+ levels deep or whatever

this way, you can make two different pages, and hand them different arguments

imagine the hashing program, for instance
a link shortcut hands command line arguments to electron.exe, starting the browser process
that in turn hands a query string to index.html, telling it what to do

better because
-you don't have to share process.argv anymore
-two different renderer windows can get different messages from the browser process

ok, so code up that
and then figure out how the different renderers can talk to each other, and how they're identified even
and remember its fine if it's all synchronous

what are the things that only the main process can do again?
if it's just the file open dialog box, you could do drag in or type target for real single process purity
*/








/*
node-library: Access the node library from a subfolder (done)

page-speed: See how fast JavaScript can update text on a page
page-jquery: Use JQuery on a page

page-keyboard: A page that gets keystrokes from the keyboard
page-type: Parts of the page can hold keyboard focus, and get keystrokes

electron-hello: Put an Electron window on the screen (done)

electron-library: Use the node library in Electron
electron-demo: Run a node demo in Electron
electron-unit: Run all the unit tests in Electron

electron-jquery: Use JQuery with Electron
electron-app: Playground for more advanced Electron experiments
icarus: The terminal, improved
*/








/*
don't worry about terminal compatibility, or multiple processes

run icarus
you get a square featureless cyan window with just
$
type the name of a demo, and it runs, with another $ below

imagine a new kind of demo
the icarus demo, the div app, dap

each demo has log and stick
additonally, give them buttons and text fields

(so, how will you make that?)

first, just worry about getting one running
later, figure out how to keep them from clobbering each other
*/










/*
here's why you should just keep to one window
doing multiple windows right means doing multiple processes right, and that means:

a monitor to make sure you don't have too many processes
enhanced bluebird to make async calls easily
flow monitoring to make sure you don't sent too many messages too fast
meter to see how many messages you've sent, and so on
but all that will be much later
*/









/*
the user launches a dap
inject the scaffolding of the dap into the right spot on the page
it's got log and stick parts
now you do dap.log() and dap.stick()
*/










/*
what the hell happens in electron when you refresh the page?
does that end and restart the process?
which code gets rerun?
can you notice beforehand and stop it?
figure out how to do node's process lifecycle management along with this weird lifecycle
you'd like to check that everything's closed, for instance
*/









/*
make the brick window
make the log and stick api that works for both brick and bash

>rush to make now
familiar spirit
superepl
brick
*/






/*
it looks like electron is going to do processes like this
the browser process is first, and can't have a window
each window beyond that has its own process

and then to pass info and calls between them, electron reccommends ipc
and has all these conveninence methods that actually just do synchronous ipc for you

this breaks your rule of never doing anything synchronous
anything outside the memory space of this process should be treated with the same protections as a call across the internet, anticipating
it not working
needing to do it again
being careful to not do it too many times or too frequently
restarting something that's crashed on the other side
closing resources
making sure you don't seen too many messages too quickly to fill up a buffer on the other side
and so on

ok, so you could worry about that
or just not try to make your thing better than the platform it's on, and treat neighboring electron processes as though they're in your own
so that means make these blocking ipc calls as much as you want, and don't worry about it

or even better, never do the stuff that requires ipc, keep everything in one renderer window, like slack
*/












//TODO attack
/*
confirm that vue protects you from a rendered script attack

dangerous things
"
'
</div>
&
<script>alert()</script>
*/










//clock
/*
all in all, here's what you're trying to make and make sure about with clock (now spin)

make sure that the fancy stack you end up choosing isn't a lot slower than just jquery changing the page as fast as it can

make sure that you don't spend all of your time changing the page, write something that measures how long events take, versus how long the program isn't processing an event

don't update more frequently than request animation frame, but do update more frequently than the current 200ms pulse screen
eventually don't have the 200ms pulse screen at all
have individual parts of the core and gui update as soon as they have new information for the user

200ms works ok for showing a changing speed, but doesn't work for listing subpaths within in a folder, for that, the user will want to see text blur by faster then they can read
*/

/*
can you measure how busy the page is running your code with the high resolution timer?

make a little thing at the top that shows the current ratio of working versus idle
test it by running the busy loop that takes a second, that should record a full additional second of busy each time it happens

node has
process.hrtime([time])
The process.hrtime() method returns the current high-resolution real time in a [seconds, nanoseconds] tuple Array
billionth of second

the browser has
t = performance.now();
measured in milliseconds, accurate to one thousandth of a millisecond
billionth of second
*/

/*
update every 200ms
have 50, 100, 200, 400 clocks
and use a span for each 50, so there's wrapping that has to be calculated, too

imagine a system that works variably
watches the working/idle ratio
uses getAnimationFrame
updates between that and 1s, depending on how slow the computer is
always obeys soon() or whatever, when something finishes, the whole thing updates immediately
*/






/*
icarus
you open a window, and then you can create a stack of these things
they're green while the're running, blue afterwards
they show how long they took
there's a refresh button, and you can set an autorefresh on files change
*/








/*
>environments

terminal
electron window

>elements

log
stick
keyboard

button
text box

outline with plus, subscroll, and instafilter
*/









/*
$ electron load.js
will start the default
and then you get a window that has just
$
and there you load demos, dialogs, and even apps that take over the whole page
and familiar is the first of those apps
and backup is a later app
*/





/*
the single file can be huge, it's always human-readable in both the browser and a text editor, and lots of fun
have ascii art everywhere
have a choose your own adventure book with find and replace
have print shop style giant vertical separators for the really big sections

kinds of sections of the single file
program1, name of the program
program2, name of another program, there might be more than one program in here
library, currently called core
test, include all the tests
manual, like test, but about documenting how it works and how to use it rather than full coverage, and with big prose sections in comments, and with a dap that renders it inot a tab in the app for easy reading and navigating around
book, a novel or historical nonfiction or fiction, interspersed throughout
and have a world map at the start that shows what depends on what, and prettily formatted documentation throughout
*/





/*
make with css

lines that wrap with a hanging indent
shadow across some words
a button word that looks normal, hot, pressed, and unavailable
a text box that's the same height as normal text
a text box that grows to hold the contents
helvetica and circular fonts
*/












/*
here's what your going to make with vue
1 log and stick for exploringnode examples
2 the visual repl and subapps in the running process for backup/everpipe/pchan
3 the full ui for backup/everpipe/pchan
*/







/*
>load steps
you've got it so that the main doesn't run until $ says ready
but you still need to get it to that it builds and shows the whole page, and then makes the window visible
goals are to be snap-quick to not need a progress bar, but also not blink the screen which looks like a website not a client app
if its not snap-quick, show electron rendering the password field or even just the background color, and then load everything after that

right now both electron main and electron renderer load all your library code, *.core.js
you'd like to keep everything in one electron renderer process
if you accomplish that, and electron main doesn't do anything
have electron main run a script without all those extra libraries and library code
*/





/*
what's the only thing the electron main process can do?
if it's prompt system dialogs like file open, file save, maybe don't use those and then never use it

it's ok to leave the command line behind
if you want a command line interface to something later on, you'll code up a blessed ui for it

maybe make the tabs at the top early on
mains can become about:name in one of those tabs
and from there you can start coding more sophisticated mains, run them at the same time

alternatively to tabs, code up the command line
$ is a prompt to start something
but then it grows into html which continues to be interactive
you can have as many as you want, all on top of one another
*/





/*
your page system really only needs to do 3 things
-never slow down the core waiting for a return from a call into the gui
-update the gui 60fps
-measure how long that takes, and reduce to 10fps or even 1fps if there's so much on the page updating it takes a really long time

additionally, hopefully vue is already doing all this for you, but find out and prove it somehow
-don't double-change the page when the data underneath gets repeatedly set to the same current value
-don't waste time trying to change the page faster than window.requestAnimationFrame
-don't spend any time updating something that's hidden, or (harder) scrolled away (but what if it changes height to come partially into view)
*/




















/*
vue
try out tabs, and see if they keep the scroll position

how will you keep the view separate from the data down below?
for instance, imagining running the whole engine headless, because instead of a user here clicking a page, the same commands are arriving from a remote control

you probably should never show 10k items, and instead have pagination and an instant filter style search box when that happens
for a small list, render all the elements, and use show to hide the ones off page or filtered away
but a big list might exist only in couch. there, you'll render just the elements on the page that match the filter
*/

/*
stress test spin with hundreds of clocks
figure out if vue is already using requestAnimationFrame
*/

/*
instead of matching up idn7 numbers with data-specific ids, you can instead do this
call idn() once for a list of items to get the prefix
then add unique data-specific suffixes, like a file hash
*/

/*
do more with button
normal/hot/pressed/set

try out checkbox and radio control

try out image, actually
*/

/*
in vue, some of the ideas from your own earlier design might make sense
what if you designed it so that everything is a Thing
and a Thing always has a unique id
and a template
and a div where a list of subthings can grow (or if this thing doesn't need subthings, then just leave it blank)
so there's only one kind of thing
and then here's where you start to wrap and simplify vue, i guess
*/

/*
so how would you ship the hasher to a friend?
do you use webpack to turn all your code and all the node_modules into a single huge file?
figure this out, it's the non-hacker build

maybe this is it
https://github.com/electron-userland
https://github.com/electron-userland/electron-webpack
https://github.com/electron-userland/electron-webpack-quick-start
*/

/*
you don't have to solve the 500 clocks slow down the page problem right now
you do need to make sure that showing quick status doesn't slow down a single clock, or a single hash
*/

/*
style for mac
*/
	appendHead(`
		<style type="text/css">
			div, p {
				margin: 8px 0 8px 0;
			}
			button {
				background-color: #ddd;
				border: 1px solid #aaa;
				font-size: 14px;
				cursor: pointer;
			}
			button:hover {
				border: 1px solid #888;
			}
			input[type = text] {
				font-size: 14px;
				width: 300px;
			}
			.box {
				border: 1px solid #ccc;
				padding: 8px;
				background: #eee;
				margin: 4px;
			}
		</style>
	`).appendTo("head");

/*
you've got node and electron, now
you've got library and tests and mains
you don't have an application
and you don't have the application's data, either a big javascript object or a collection of documents in CouchDB or something

is 'var win' local in expose main electron-main good enough? probably also loadCopy that onto global to really pin it
no, attach it to a program object that load already put on global
*/

/*
try index.html?serialized js object of parameters so you don't have to transfer global arguments over ipc

do real ipc with node core module and bluebird
rather than all the synchronous electron cheats

look at the ipc stuff you did a year ago
update that with bluebird
*/

/*
wait, does electron have child and modal windows now?
https://github.com/electron/electron/blob/master/docs/api/browser-window.md
try that out

const {BrowserWindow} = require('electron')
let top = new BrowserWindow()
let child = new BrowserWindow({parent: top})
child.show()
top.show()

how many processes is that?
*/
















/*
make familiar, a little thing in the corner that runs all the tests when you change a file
have it show log output, too
to do this, probably, just run nodeunit in a separate process
later on, it would be cool to run all the tests in the same process, dealing with tests that finish in the next event
but now as you code, you'll actually run that as a separate process, using it rather than building it, even if both are coming from the same code
*/

/*
make log and stick
*/

/*
style to look like the terminal
learn some css and see if you can make Brick
*/
div, p
{
	margin: 0;
	font-family: "Consolas", "Andale Mono", sans-serif;
	font-size: 10pt;
}
.line
{
	background-color: lightblue;
	white-space: pre-wrap;
}

/*
dialog, log, stick, and [Button]
*/
{
	var d = Dialog();
	d.log("log in a dialog");
	d.stick("stick in a dialog with a [button] perhaps");
}

/*
>is the keybaord focus, dont' worry about this for web

Color:[blue]
takes name and starting text
you can get and set the text
notifies on text change

[Start]
[~Start~]
takes name

before you write the whole ui language, make some simple examples using normal handlebars and jquery first
think about what timer needs

previous recorded durations in a log
current time
running or stopped timer
[Start] which changes to Stop

what does hasher need
Path:[] [Open]

yeah, make this really simple
the goal is not to be complete, it's to make ui for demos really, really quickly
there is no way to set buttons to set or unavailable
the first letter presses that button, so just keep them unique

TWO
here's the first one you write
you pressed a
you pressed b
you pressed c
[A] [B] [C]
and it works from clicking the buttons or pressing the keyboard keys
write that first just in handlebasr and jquery
and that's it, there is no button component, that's exactly what you're trying to avoid
make it so you don't get all keystrokes, just the keystrokes for the buttons that you've put on the dialog

THREE
a simple one that introduces text box
you entered 'your text'
you entered 'your text'
Box:[your text] [Enter]
also, if you name a button [Enter] or [Esc], that key also hits it
yes, this is the kind of stupid direct obviousness that you want, when you're doing anything real later you won't use it

ONE, code this next with jquery and handlebars
in jquery in the page, have some divs, have the color set to the one that has the focus, and log the keyboard keys that you press in them

don't ahve a push button, that's what the checkbox is for
make it all cool and mobile-like
[off]Pause
[on]Pause
*/

/*
later, when you do more ui, here are some ideas

[Button]  normal button
~Button~  unavailable

[x]Checkbox  checked
[ ]Checkbox  unchecked

Path:[default path]

all radio options have to be touching
(x)Red( )Green( )Blue

make
[Start] ~Stop~
~Start~ [Stop]
to demonstrate available and unavailable
[x]Pause
[ ]Pause
is the other one
*/

function dream() {

	var d = Dialog(f);
	d.stick("[A] [B] [C]");
	function f(e) {
		if      (e == "[A]") d.log("you hit a");
		else if (e == "[B]") d.log("you hit b");
		else if (e == "[C]") d.log("you hit c");
		else if (e == "[Esc]") d.log("you hit escape or control+c");//this one works even if you don't have a button
	}

	d.get("Path")//returns the current text or boolean contents
	d.set("Button", false)//set the button unavailable
	//or instead, just stick different text with ~Button~
	//you can always use stick to totally change the ui, of course
}










/*
what does it look like for two page elements to be driven by the same data
do they share the same vue model object? according to vue, yes. according to what you build here, probably not
and make sure they don't have the same idn number
you've got an example above that already breaks all this
*/





/*
should you code a global screen update list?

a design might look like this
-a little local object isolates setting the vars that vue is watching
-and remembers what's on the screen
-if you set it to something different, it adds itself, indexed by the vue variable, to the global update list
-if you set it back to the same thing, it removes itself from the global update list
-when the global update list has contents, the list requests the next animation frame, and updates everything at once
-the list keeps track of how long the whole update takes, and throttles down the frame rate if it gets too big and slow

ok, that sounds pretty good, but you're not ready yet, because
-does showing hash or local loopback progress as fast and simple and dumb as you can slow the i/o down at all?
-are you really going to have 10,000 clocks? even if you've got a tree of 10,000 files, how many are going to be in the dom at a time? (with correct navigation/filter box/pagination, just a few dozen) how many are going to change constantly and quickly? (just those that are getting hashed/uploaded/downloaded right now, not all of them)
-does a js object keyed to vars work, and is it fast
-if not, can you make sure your idn()s are one per page text output (now one per component), and always unique (not in the current example of two views of the same model)
-how are tabs going to work? switching back and forth probably hides dom elements, not adds and removes them
-how is pagination going to work? here going to the next page probably generates new dom elements
-how are trees going to work? imagine clicking through a file manager of a collection of 10,000 files nested in folders
-how would two changes in the same update work when one depends on the other? imagine adding a new component to a list that needs to be filled out with nested sub components
-and, of course, isn't this just the forbidden polling?

other ideas and thoughts on this
-it's ok if progress takes 200ms to update, but a button you click should appear clicked immediately
-some elements are dependent on time, while others are dependent on state change (clocklike and non-clocklike)
-some updates are for your information only (97% to 98% done) while others are important changes of state (99% to 100%, now you can open it)
*/

/*
more ideas later

make an animation frame system that's just for progress, not state
'progress' is a few more bytes on a stream, hashing from 86 to 87%
'state' is everything else, a button click, a folder listing, a close dialog, hashing to 100%
state doesn't use the system at all, going right to vue and the variables it's watching

inside the progress system, there's an object keyed on the vued-variable
it's empty
got some new progress to show the user? add your change to that
a bunch of changes build up over the course of a short moment
code might edit one already there, this works because they're keyed to the vued variable
once the list gets its first item, code calls window.requestAnimationFrame
when that goes off, it goes down the list, telling vue about everything
the items don't stay on the list, each pass clears it entirely
if a pass takes to long or there are too many items, the system puts a delay before requesting the animation frame, throttling it down

ok, that isn't too complex
but are you sure that 'state' code that affects vue directly and immediately can't get messed up with some 'progress' changes happening later, like even 200ms later?
probably not, right, because if it's off the page vue will just not do anything about it
and then your code won't give it another progress update later, the list gets cleared every pass, which should also be fast, it's built up, looked up, and then tossed entirely

got a progress update? here's what you need to tell the system about
-vued variable, this is the key
-text currently on the screen right now, yeah, this is only for text
-new text you'd like to change it to, you've already composed this, if it's the same calling this will be a no-op, unless the vued variable is already there, then calling this will knock it off the list
*/

/*
now you kind of want to build this

w00t! here it is without any object lookups at all

pushing f into the list, then setting direct so f.inTheList is false, then pushing again, you could get f in the list several places
but even if you did, it would only actually get updated once, because nextValue != currentlyOnScreen once
*/

var list;//the list for the next single animation frame pass

function Flicker(vuedVar) {

	var f = {};//make the new flicker object to fill and return
	f.pointAtVuedVar = vuedVar;//copies the reference because vuedVar is actually an object

	f.direct = function(directValue) {//first, last, or important change, do it right now
		f.pointAtVuedVar    = directValue;//sets the value
		f.currentlyOnScreen = directValue;//remember what we've got on screen
		f.nextValue         = directValue;//no need to change it right now
		f.inTheList         = false;//if we are in the list, this will ignore it, faster than removing it from the list
	}

	f.delayed = function(delayedValue) {//another step along the progress bar, do it a little later on
		if (!list) {//no list yet
			list = [];//make it
			window.requestAnimationFrame(updateTheList);//TODO run after an additional delay
		}
		if (!f.inTheList) {//we're not in the list yet
			list.push(f);//add us
			f.inTheList = true;//mark us as in there
		}
		f.nextValue = delayedValue;//another call to delayed right away will just do this line
	}

	f.direct(vuedVar);//the current value is the default and starting value
	return f;
}

function updateTheList() {
	//TODO measure how long this takes, setting an additional delay
	for (var i = 0; i < list.length; i++) {//make one pass down the list
		var f = list[i];
		if (f.inTheList && f.nextValue != f.currentlyOnScreen) f.direct(f.nextValue);//only update if necessary
	}
	list = null;//toss out the list, we build it up anew for every pass
}

/*
throw code if not typeof string
*/




































/*
TODO design for and purpose of the Timer object

it's easy to create an infinite loop of individual calls to setImmediate
if you forget to stop it and just null your references to the object that was doing it, it won't get garbage collected or stop, and there will be no way for you to stop it!

watch out for this on setImmediate, setTimeout, setInterval, process.nextTick, window.requestAnimationFrame
and promises and async await and all that, too
*/
var count = 0;
function f() {
	count++;
	setImmediate(f);//go again
}
setImmediate(f);//get started
/*
even though the 'get started' and 'go again' calls to setImmediate are separate, together, they create an infinite loop

to notice this, make a Timer object that you have to shut(t)
call t.immediate(f) instead of setImmediate(f)
after shut(t), a call to t.immediate(f) on the ragged end won't do anything, ending the infinite loop
*/
var count = 0;
var t = Timer();
function f() {
	count++;
	t.immediate(f);//go again
}
t.immediate(f);//get started
//later, when done with whatever thing this is inside and for
shut(t);
/*
wrap all the time stuff that node and javascript can do in Timer
*/
window.setImmediate
window.setTimeout
window.setInterval
window.requestAnimationFrame
process.nextTick
//Promise and async await stuff
/*
are there any others?
which of these can you call without window. or process.
*/
var t = Timer();
t.immediate(f);//uses setImmediate
t.after(200, f);//uses setTimeout
t.every(4*Time.second, f);//uses setInterval
t.nextAnimationFrame(f);//uses requestAnimationFrame
t.processNextTick(f);//uses process.nextTick
shut(t);
/*
and once you start doing something with it, if there's a call to do something else with it, toss code

let's say you call setImmediate twice in the same even on the same function
who knows what setImmediate does
Timer can only setImmediate once, and note a coding error when this happens
*/
t.immediate(f);
t.immediate(f);//you could log this as a coding error, and only set it once
/*
let's say you've got some code where you know you're not using setImmediate in a loop
it's really actually only going to happen one time
*/
//standard use
var t = Timer();
t.immediate(f);
shut(t);
//shortcut use
var t = Timer();
t.once(f);
/*
uses setImmediate(f) and shut(t) all in the once method
also, could toss code if you try to do anything else with this t, instead of just not doing it
not completely sure about having this shortcut, as now you don't have to simply look for a shut() after every Timer()
*/
























