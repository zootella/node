


//you have so many old notes in load*.note.js and page*.note.js, go through and delete stuff you've done or don't need!











function() {
	function() {
		function() {

			/*
			for page templates, outline text format, and more, the new multiline template text literal is great
			you've have them in your code like this
			*/

			var t = `
				first line
					second line, indented
					second indented line
				third line which uses javascript's new ${some.expression} thing
				fourth line
				fifth line
			`;

			/*
			so that's fine, except
			-you don't want the tabs indenting the whole block, indents beyond that you do want
			-you don't want the starting newline, the ending one is fine, and
			-you want to control the newline character if it's different when the code runs on different platforms

			so write a function called unindent() and use it like this
			*/

			var t2 = unindent(`
				first line
					line 1a
					line 1b
				second line
				third line
				fourth line
				`);

			/*
			and have it fix all those things

			and have an object that represents an array of strings, with methods on that to
			set the newline character if you want something different than the default, which should be windows on all platforms
			ask and set if there are starting, trailing, both of those, blank lines, remove all those
			detect and remove a global indent, and freak out if there's something that looks wrong with it
			say into a string
			loop by getting the array
			get size of number of lines

			and that's how you implement unindent, it goes into a Lines and back to a string again

			this is a cool idea and likely a good design for this problem with multiple lines that you've been thinking about since the start
			*/
		}
	}
}
















/*
kry noticed
$ electron/win/electron.exe load
works as well as
$ electron/win/electron.exe .
so that's better


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

imagine the hasing program, for instance
a link shortcut hands command line arguments to electron.exe, starting the browser process
that in turn hands a query string to index.html, telling it what to do

better because
-you don't have to share process.argv anymore
-two different renderer windows can get different messages from the browser process

ok, so code up that
and then figure out how the different renderers can talk to each other, and how they're identified even
and remember its fine if it's all synchronous


*/





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




to run an electron app
on mac
from the node folder
execute the Electron binary
giving it a path to the folder with package.json
like this:

node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron app/electron-hello
*/



/*
==a.js

(the puzzle of everything that can happen with a callback)

==b.js

demo cycle

==hide_test.js

demo random
demo unique
demo unique-speed
demo random-limit

==list_test.js

demo sort
demo add

==load.js

(naming which parts of the app depend on which parts in a single place)

==measure_test.js

demo speed

==path.js

(the three different kinds of paths)
(the directory traversal attack)

==state_test.js

demo example, example-loop
*/

























































/*
now, transition
leave the terminal behind for a bit
you can return to it later

don't worry about multiple processes either
just focus on and do everything in page.js

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





















/*
ok, so here's how electron works

electron looks at package.json
package.json says main.js
main.js opens index.html
index.html script srcs page.js

so that's fine, and you can probably have a single main.js
to do demos, you need to get command line arguments in page.js
log them everywhere to see if you can still get them


*/


/*
icarus
get load in page.js, be able to use Data and your stuff





icarus is a tall narrow cyan window with just
$
it's all one process
you can type demos there and then run, becomign divs, and you can close them

code that for awhile and then worry about compatibility back to just node and just the terminal
remember that you don't really need terminal

also, electron 
you can type

>soon
any scrolled area of any js file in the root can define an electron demo
that demo contains handlebars html the demo squirts in
but there's jsut one css



*/



//since scrolling is wonky, flip the order of everything, add new logs to top, put stick above that
//yeah, that's the rigth idea here



//ok, now just get all that going in electron
/*
big picture, and it's easy, here's what you want
css is actually separate, there's one css file for the whole and every project
html is minimal, there's one tiny html file with nothing in it for the whole and every project

lots of demos can exist in one file
a demo has a block of html at the start, which is tempaltes up with handlebars, adn then squirts into the page
this sets up log and stick and everything like that

this is clock2 right now
get this much working in clock3, with jquery, and then go from there

run from the command line, there can be only one log and stick, because there's only one terminal
but run from electron, there can be 0+ windows, and 1 command line
maybe make one window the terminal
or keep the terminal as the terminal, and additionally deal with the windows



here's what you want, it's simple:
a node demo that creates a new electron window
and then can squirt some html into it

also, it's fine if now you always use the electron binary, not the node binary
even when you're just on the command line, because remember, electron has the command line also

additionally, npm lets you shortcut longer commands, so you can do stuff that way, too







ok, yeah, every electron window has to be it's own process, and all of them are separate from the main process
you don't have your multiprocess thing setup, and eventually you'd like to do it with:
a monitor to make sure you don't have too many processes
enhanced bluebird to maek async calls easily
flow monitoring to make sure you don't sent too many messages too fast
meter to see how many messages you've sent, and so on
but all that will be much later

so for now, just do it this way
electron main.js just starts one window
when you close that window, electron main.js also exits
main.js is wired to go crazy if anything strange happens
your demos and apps are all one process and one window
at the start, they're also terminal-style and terminal compatible
later one, they can stack divs to have more than one app running at a time





eventually, maybe this afternoon, merge icarus into the node root folder
obviously git commit before that
and afterwards, make sure that all the pure command line stuff in windows xp still works, too
then you can run it with
$ electron/win/electron.exe .
still have other electron apps in the app folder, but this one is the general one that maybe is simple and general enough that it can become anything


*/




/*
go with the grain on electron and multiprocess
electron runs main.js, which loads load, and is super minimal and always the same
get that down to very few lines of code, and don't worry about it

that then leads to page.js, which is in a separate process
page.js is icarus, with $ that accepts input from the user
the user can type demos and run them right there, but instead of running in a new process that exits, they run in the current process, you can run more than one at a time


*/









/*
the user launches a dap
inject the scaffolding of the dap into the right spot on the page
the id is a guid or something so you can keep track of it
it's got log and stick parts
now you do dap.log() and dap.stick()







*/











/*
3 ways to run icarus
-terminal, behind 7 proxies
-electron, on win7
-server to localhost:6969, on win xp

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

$ node load main potato

>shell
potato

>browser
potato-electron-browser
potato

>renderer
potato-electron-renderer
potato

1 decide what main to run
2 if this is electron browser or renderer, see if there's a 

but does that let you make a simple sample which works both in brick and bash?
but does this work when there's one browser process and 0+ renderer processes, like dialog boxes and whatnot


no, just have potato
and then in there, it does if (required.electron && !$)
else if (required.electron && $)
and then after that, the normal
yeah, this makes load shorter, and lets you do everything



make the brick window
make the log and stick api that works for both brick and bash




in load, make the program object
attach window to it here

>rush to make now
familiar spirit
superepl
brick




*/




/*
having the single mains
electron-browser and
electron-renderer
is good enough for now

but it's not good enough to run 'available' in all three roles, for instance

pretty soon, though, you'll want to have multiple windows
like the program window
and another window which is running brick for a demo or your repl

also, imagine in the shipping program, there are shortcut programs, like hash this folder
that get started by right clicking and then send to with different command line shortcuts

also, imagine writing a main that uses brick and works well from both the teletype shell, and the brick window in electron

so you'll have to redesign that part of load soon, but not until you know more about how you're going to use it
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
*/












//TODO attack
/*
does handlebars protect you from a mistake template that has broken html, like no closing div tag or something

confirm that nothing can get through handlebars, and then always use handlebars with jquery, and you'll be fine
write a test to show that " and ' and the others can make it through jquery, but not handlebars, that handlebar's protection is better

dangerous things
"
'
</div>
&
<script>alert()</script>

push through
jquery text
jquery html
handlebars template

all you have to do with safety is confirm that nothing can get through handlebars, and then always use handlebars
see where you can sneak in a < or an alert(), and where you are protected from that
in jquery in a test, make a new p, add some inner text, then get the html
move this into a test, see how handlebars protects you better than query does
*/


























//clock
/*
clock0 - node on the terminal
clock1 - html page, javascript keeps the time up to date
clock2 - html page, jquery updates the time
clock3 - html page, react updates the time

clock1e - electron app, javascript updates the time
clock2e - electron app, jquery updates teh time
clock3e - electron app, react updates the time

1 html
2 jquery and handlebars
	ember
3 react



html, css and js are separate files in every case

the browser ones have libraries as save as, the node ones use node_modules


the electron ones tap into the flow javascript in the root, format the time using your time formatter, for instance


here also it would be interesting to set your spin check on updating the page, see if some methods are much faster or slower




>all in all, here's what you're trying to make and make sure about with clock

make sure that the fancy stack you end up choosing isn't a lot slower than just jquery changing the page as fast as it can

make sure that you don't spend all of your time changing the page, write something that measures how long events take, versus how long the program isn't processing an event

don't update more frequently than request animation frame, but do update more frequently than the current 200ms pulse screen
eventually don't have the 200ms pulse screen at all
have individual parts of the core and gui update as soon as they have new information for the user

200ms works ok for showing a changing speed, but doesn't work for listing subpaths within in a folder, for that, the user will want to see text blur by faster then they can read







(notes from demos)

		//TODO make two separate html files so you can watch them side by side
		//also, have the count be the time, or high resolution time even, so timeout doesn't win because it's a bigger number


//updates by event: how fast does it look? how much processor does it take?


//updates by animation frame, how fast does it look? how much processor does it take?

//first, make one that alternates 2 seconds using event, 2 seconds using animation frame, always counting up, and see if it looks any different
//then, try to measure how busy the page is, how much time javascript is running versus how much time it's idle--maybe by using the high resolution timer










make a little thing at the top that shows the current ratio of working versus idle
test it by running the busy loop that takes a second, that should record a full additional second of busy each time it happens




update every 200ms
have 50, 100, 200, 400 clocks

imagine a system that works variably
watches the working/idle ratio
uses getAnimationFrame
updates between that and 1s, depending on how slow the computer is
always obeys soon() or whatever, when something finishes, the whole thing updates immediately

and use a span for each 50, so there's wrapping that has to be calculated, too







also, for clock2, which uses
jquery
handlebars
underscore
bluebird

see how fast you can change a number on the screen with bluebird, does bluebird implement nexttick, essentially?
you're really surprised that setImmediate is a node-only thing

also, you can just do the ones that don't freeze the page








node has
process.hrtime([time])
The process.hrtime() method returns the current high-resolution real time in a [seconds, nanoseconds] tuple Array
billionth of second

the browser has
t = performance.now();
measured in milliseconds, accurate to one thousandth of a millisecond
billionth of second
*/
















//electron
/*
two ways to run something

for the benefit of doing it, run it in the electron process. do your demos and tests work in electron as well as the command line?

for icarus, run it in a separate process



*/


//electron
/*
yeah, do separate processes
otherwise, you'll have to close icarus to close a long-running process
and update log and stick to use standard in and out so they work

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








to see log and stick:
$ node measure_test.js demo cycle
*/




































/*
the two package.json's easily go together
yes, you could get it all in one folder

main.js -> electron-main.js
index.html -> electron.html
page.js -> electron.js
style.css -> electron.css

then, figure out how to have it just like
$ node some_file.js demo something
you can enter anywhere you want

$ electron/win/electron.exe .
will start the default
and then you get a window that has just
$
and there you load demos, dialogs, and even apps that take over the whole page
and familiar is the first of those apps
and backup is a later app





when you ship, think about how few files you can put this all in


readme.txt (contains hashes and build info, and instructions how to get working with npm and electron)
package.json
start.js
index.html
style.css
code.js (with app and library sections, and a map at the start that shows what depends on what, and prettily formatted documentation throughout)




and it's al in there, even if it's like 2mb, all the
application code
library code
workspace code, like chucking stuff back and forth
tests
documentation, including the thing where you can open the file in a browser and see the source code

ok, how do you do that? can you  make code.js actually code.html, can index.html



and then have an app built into familiar that organizes all the components, and let's you chuck






of course, because the user has npm, and npm can make files from parts of files, you could probably get it down to even fewer files
but you don't like it that it changes when it runs, so you'r eimaging the architecture that doesn't change when it runs

what if it were all in index.html, and when electron runs index.html it runs the app, and when the browser opens index.html it shows the code






you can do it as three files

index.html (combines readme, style, app, library, tests, documentation)
package.json
start.js

runs without editing these files or making more files

and then your development system builds index.html, chucking stuff into and out of that big file, letting you run the app either way
and index.html is huge, but always human-readable in both the browser and a text editor, and lots of fun
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



//you can use npm global installed browser-sync to setup live reload on these pages, no server










