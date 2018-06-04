





/*
run the tests, run a demo, run in electron, run in nodemon

$ ./node_modules/nodeunit/bin/nodeunit *_test.js
$ nodeunit *_test.js
$ node file.js demo name
$ ./electron/win/electron.exe app-name/
$ ./electron/mac/Electron.app/Contents/MacOS/Electron app-name/
$ node node_modules/nodemon/bin/nodemon.js file.js demo name

								node >           demo (works) $ node environment_test.js demo platform
								node > nodemon > demo (works) $ node node_modules/nodemon/bin/nodemon.js environment_test.js demo platform
									win electron > demo (works) $ electron/win/electron.exe environment_test.js demo platform
									mac electron > demo (works) $ electron/mac/Electron.app/Contents/MacOS/Electron environment_test.js demo platform

		 node >           nodeunit > test (works) $ node node_modules/nodeunit/bin/nodeunit text_test.js
		 node > nodemon > nodeunit > test (works) $ node node_modules/nodemon/bin/nodemon.js node_modules/nodeunit/bin/nodeunit text_test.js
			 win electron > nodeunit > test (works) $ electron/win/electron.exe node_modules/nodeunit/bin/nodeunit text_test.js
			 mac electron > nodeunit > test (works) $ electron/mac/Electron.app/Contents/MacOS/Electron node_modules/nodeunit/bin/nodeunit text_test.js

node >           nodeunit > all tests (works) $ node node_modules/nodeunit/bin/nodeunit *_test.js
node > nodemon > nodeunit > all tests (works) $ node node_modules/nodemon/bin/nodemon.js node_modules/nodeunit/bin/nodeunit *_test.js
	win electron > nodeunit > all tests (works) $ electron/win/electron.exe node_modules/nodeunit/bin/nodeunit *_test.js
	mac electron > nodeunit > all tests (works) $ electron/mac/Electron.app/Contents/MacOS/Electron node_modules/nodeunit/bin/nodeunit *_test.js

			 node >           myunit > test (todo)  $ node myunit.js text_test.js
			 node > nodemon > myunit > test (todo)  $ node node_modules/nodemon/bin/nodemon.js myunit.js text_test.js
				 win electron > myunit > test (todo)  $ electron/win/electron.exe myunit.js text_test.js
				 mac electron > myunit > test (todo)  $ electron/mac/Electron.app/Contents/MacOS/Electron myunit.js text_test.js

	node >           myunit > all tests (works) $ node myunit.js *_test.js
	node > nodemon > myunit > all tests (works) $ node node_modules/nodemon/bin/nodemon.js myunit.js *_test.js
		win electron > myunit > all tests (works) $ electron/win/electron.exe myunit.js *_test.js
		mac electron > myunit > all tests (works) $ electron/mac/Electron.app/Contents/MacOS/Electron myunit.js *_test.js

									 win electron > app (works) $ electron/win/electron.exe app/hello
									 mac electron > app (works) $ electron/mac/Electron.app/Contents/MacOS/Electron app/hello

>todo
make the electron app named hello so the bottom two work
improve myunit.js to take arguments like text_test.js and *_test.js
make an electron app named "demo" that runs a demo the same way you can on the command line
*/





{
	var t = dent(`
		first line
			line 1a
			line 1b
		second line
		third line
		fourth line
	`);
}
/*
maybe have an object that represents an array of strings, with methods on that to
set the newline character if you want something different than the default, which should be windows on all platforms
ask and set if there are starting, trailing, both of those, blank lines, remove all those
detect and remove a global indent, and freak out if there's something that looks wrong with it
say into a string
loop by getting the array
get size of number of lines

and that's how you implement unindent, it goes into a Lines and back to a string again

this is a cool idea and likely a good design for this problem with multiple lines that you've been thinking about since the start
*/







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









