



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




//notes about the anatomy of load and the single huge illustrated text file
function load() {

/*
welcome message

assembly instructions
8 easy steps that take about x minutes and x clicks
you don't have to be a programmer, just a computer user comfortable with stuff like zip files and installing programs

[1] check the hash

first, make sure no one has edited this file
line0 is a hash container, line1 is a null spacer
open notepad and copy line0 there
replace letters and numbers in line0 with #s so it looks the same as line1 below
save, check file size same number of bytes, windows line endings \r\n 0d0a
sha1sum command on win, mac, linux
remove the middle line, identity.hash, to check that hash of this file, then put it back so the program can, too
*/

var identity = {};
identity.name = "zootella";
identity.line = "----------------------------------------";
identity.hash = "da39a3ee5e6b4b0d3255bfef95601890afd80709"; // Remove this line to check this hash
identity.line = "----------------------------------------";
identity.date = 20171001;

/*
[2] decide if you trust the hash, decide if you trust the code

then, decide if you trust this file
where did you get this from
search for the hash, do other people say its ok
do a diff, to a previous version, or another source
read the code
search the news

[3] install node and npm

[4] run npm init

what if one of these libraries has been tampered with?
npm shows popularity, the less popular ones are more vulnerable

[5] download electron

[6] make some more files

notepad, mac, leafpad
copy from these parts to those files
rename this file to index.html
from the { to the } and from the < to the >
*/

identity["package.json"] = `
	...
`;

identity["index.html"] = `
	...
`;

/*
[7] download artwork

optional, works fine without
icons for mac and windows, probably .ico and .icns
have web download locations
have hashes you can check, these hashes won't change

[8] run

steps to run on win, mac, pi
make shortcuts
what files it makes while it's running
how to carry it with you
*/

//rest of load

}
load();

contain(function(expose) {

//container contents

});

contain(function(expose) {

//container contents

});

contain(function(expose) {

//container contents

});












/*
you figured out how to distribute the entire working application
-as a single file
-that resists tampering
-that is entirely human readable
-that can contain lot of extra stuff

the single text file contains
-instructions
-application code
-demos and apps
-librarty code
-tests
-interactive code and documentation browser
-story novel
-how to code book
-structure maps
-ascii art
-poetry

there are diagrams and maps like rogue
there are headings and borders like gamefaqs

there are contents and hyperlinks with control+f
there could be a choose your own adventure book with control+f
*/

/*
zootella.txt
at the start are instructions for validating and assembly
say, you can do this in x minutes with about x clicks
change the top to xxxx
then sha1 sum, find the command on windows, mac, and rasbperry pi

check the hash
do you trust the hash, search for the hash
read the news
read the code
diff the code

first, make sure no one has edited this file
then, decide if you trust that hash
make some more files
get electron
get node modules
*/

/*
ways to get the program
-download preassembeled from the website
-download single file, follow assembly instructions
-reproduction system: your friend clicks distribute in their running app, then ims you the zip file the program creates, and this contains a list of peers so it works without a central bootstrapping server running
*/

/**
in the huge text file of everything, double asterisk is a special code

in here, a postprocessor wraps neighboring lines

#Header
gets expanded into bubble letters

and a bookreader app written within can pull these sections out, and turn them into nice html
there's no code in here, rather, code is between them
this is how you make the demo sections, for instance

[Data>] is a link, and
[>Data] is a link target
in the reader, these become wiki style hyperlinks
but you can also just ctrl+f them
[Google>http://www.google.com/] is how you'd do a web link, except you might not have any of those
**/

/*
 .= .-_-. =.
((_/)o o(\_))
 `-'(. .)`-'
  /| \_/ |\
 ( | GNU | )
 /"\_____/"\
 \__)   (__/

format the gpl into two columns, with the gnu in the middle between them
and lots of scallops and frames around the top and bottom
*/











//previous load
// The modules that make up the library
var worldMap = [
	"text.core.js",        // Search, convert, and adjust text
	"measure.core.js",     // Measure and communicate time, distance, and speed
	"state.core.js",       // Notice something has changed, and remember to close everything
	"list.core.js",        // Organize objects into lists and dictionaries
	"data.core.js",        // Search, encode, and manipulate binary data
	"hide.core.js",        // Encrypt, decrypt, and sign data
	"path.core.js",        // Parse file system paths
	"disk.core.js",        // Look at and change the files and folders on the disk
	"environment.core.js", // Get information about the computer we're running on
	"meter.core.js",       // Record, analyize and show how events happened over time
	"step.core.js",        // Complete processes where it's not sure what will happen later
	"flow.core.js",        // Compose and direct streams of data
	"page.core.js"         // Show the user information with HTML
];






/*
if you do function+"" you get the source code
use this to make the map that shows what depends on what
a little trick like this might be all you need
this is short of finding jquery for javascript, something that turns your code into a dom you can walk
*/

/*
i've got a package.json that has minimum required semantic versions, like "^1.0.0", which is nice
and a node_modules folder, with the 11 modules i need in there, which is also nice
what i don't like is, i've actually got 73 node_modules folders nested deep inside there
as one module requires another, which requires the first, all different versions, and so on
has anybody written anything to flatten this?
all the modules in a single folder, a single json that shows what requires what, and a require() loader that finds it in the single list
the current way node does it, if A requires B and B requires A again, A will be there twice

ok, so now it's flat, thanks npm5
but has anyone written something that shows me what depends on what
*/

/*
eventually, you want to make a system that lets you create blobs of code, tag them, and then they just swim off
name something and it'll get automatically imported, and a map always shows what depends on what
that's a big idea within Flow

for now, though, replace this load with a simple global implementation
all it does is
1 put everything on the global object
2 make sure that you never clobber anything, doing that (just like augment already does)
3 have a map in load.js that shows the order to load everything in when you load everything
that's it
*/















/*
think of a way to turn off loading neighboring files if the program is shipping in a single file
just if (true) and then change that to false, probably
*/

/*
convert local nodeunit to centralized tape
and make sure command line reporting is no worse

or wait, do switch to centralized tests, and switch to tape
and then you run all the tests always with $ node load test, which runs tape across all the tests
and logs tap to standard out, or no, use the pretty mocha style output that works
and dont worry about pop quiz until later

make sure the mocha style output shows
-filename and line number
-call stacks
-exception that got thrown
*/

/*
have another kind of thing: page
it's a main that runs in electron
yeah, this is cool and it's four letters

but no, because lots of your pages will be small enough you want them all in the same file
and others will be so big you want them in separate files
*/

/*
write a tape sample on the side that
confirms you can do
ok(false) for fail, now you don't need fail actually
throws(f), that's cool, switch to that
several tests in a row that take 1s each, last doesn't finish, does tape notice
does nodeunit notice for that matter, actually
*/

/*
notice and stop if you try to overwrite something
baloons that can be written in any file and in any order
commands to combine and separate
modes to import explicitly, or just use global
*/

/*
try out these frameworks
-nodeunit
-mocha and chai
-tape and tap

in the code
-ok(true)
-done()

run the tests
-from the command line
-from inside the running process
*/

/*
make sure that tape works as well as nodeunit, showing
-file names
-test names
-number of passed assertions
-milliseconds the whole thing took to run
-failures in red
-logged lines from a test that's logging
-exceptions with call stack
-call stack with file names and line numbers
*/











/*
use webpack to live reload a html page
$ git clone https://github.com/zootella/reload
$ cd reload
$ npm install
$ npm run dev

run your tests
$ npm install -g nodeunit
$ nodeunit --version
$ nodeunit *.test.js

make a new package.json, and rebuild node_modules from one
$ mkdir name1
$ cd name1
$ npm init -y
$ npm install

install node
$ node --version
$ npm --version
$ npm install -g npm

install electron globally
$ npm install -g electron
$ electron --version
$ electron -i
$ electron
$ electron .

install electron locally
$ npm install -S electron
"scripts": {
	"electron-version": "electron --version",
	"electron-repl":    "electron -i",
	"electron-empty":   "electron",
	"electron-here":    "electron ."
},
$ npm run electron-version
$ npm run electron-repl
> .exit
$ npm run electron-empty
$ npm run electron-here

place electron manually
https://electronjs.org/releases
electron-v1.8.4-win32-x64.zip  50.3 MB
electron-v1.8.4-darwin-x64.zip 48.3 MB
$ electron/win/electron.exe --version
$ electron/mac/Electron.app/Contents/MacOS/Electron --version

run electron three ways, dirname is the same
$ electron .
$ npm run electron-here
$ electron/win/electron.exe .
*/

/*
update mistake 

for promises and electron, understand and control the behavior of
the system streams, like log and error
exceptions, like {}.notHere.nope;

write {}.notHere.nope; different places to see how it throws
in node
in electron main and renderer
after setImmediate
after promises
and figure out where you want it to go
probably not causing node to exit the process
and not in a message box before the electron window shows up
and not in command tools, either
*/

/*
global electron works on windows, but not mac, fix your mac somehow
electron interactive, the repl, works on mac but not windows, by design

github wrote the electron repl -i to work on mac, but haven't made it work on widnows yet
installing electron globally on windows works, and on your mac it doesn't, because your computer is messed up somehow
npm gets windows electron on windows and mac electron on mac, so if you npm installed on windows, you can't npm run on mac
if you unzip electron on mac, the binary executable Electron will have the last x bit set, and it works, not so from dropbox

right now on windows, the electron in npm_modules is from mac, because dropbox brought it over
and yet $ npm run electron-version still works somehow
probably just because npm uses global before node_modules, maybe?
*/

/*
ways to code and run this include:
-for development,
-the secure build for advanced computer users from a single text file,
-and the downloadable consumer packages that install normally mac/win/raspbian,
-and the portable usb version you can carry between mac/win/raspbian

launch from usb key portable between mac and windows
launch from installed location on windows, and a shortcut on the start menu
launch from installed location on mac, dragged into the applications folder, then drag a document onto it
and check command line arguments getting passed through with all that
*/

/*
a useful project would be:
make a little notepad editor that edits a file it keeps in its folder
package it as a portable application, and edit the file as you carry it from window, mac, and raspbian
if you can do that, you can make all the installers, too
*/













/*

all you want to do is run something that turns your code and node_modules code into a single really long file that isn't minified
does that include webpack?

you found:
https://github.com/electron-userland/electron-webpack
https://github.com/electron-userland/electron-webpack-quick-start

reccomended:
https://github.com/electron-userland/electron-forge
https://electronforge.io/

*/










































