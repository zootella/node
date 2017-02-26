


/*
think of a way to turn off loading neighboring files if the program is shipping in a single file
just if (true) and then change that to false
or, if there is a main named main, then don't do it
*/

/*


yeah--convert local nodeunit to centralized tape
and make sure command line reporting is no worse



ok, you can't make familiar spirit yet
but that's ok, proceed with load
and for a test file, plop your own contain up top which directs the tests to exports
and use nodeunit
but when when you go thrugh teh tests, convert them to function(ok, done), so that it'll be easy to change to tape later
yeah, this is a cool idea

or wait, do switch to centralized tests, and switch to tape
and then you run all the tests always with $ node load test, which runs tape across all the tests
and logs tap to standard out, or no, use the pretty mocha style output that works
and dont worry about pop quiz until later

make sure the mocha style output shows
-filename and line number
-call stacks
-exception that got thrown

and also work on refresh button in main, there are lots of areas you can whittle away at at this point, no need to be fusturated







[load]

if this is electron, run electron-main, with BrowserWindow
if there is a main named main, run that
else look at the command line

required.fs with each part of node, and each module from package.json

popquiz means you don't put anything on exports
you also dont need remoteExports
and now there's no backrequiring, too

make a main that puts the refresh button on the page

if you still need page.js to keep from double-loading, have global._loaded as a flag

finish apart and then try together


[run]

*/




/*
you can inject css using $
try this out actually, but you're sure you can
so now you don't need a css file or css section of the html file at all


yeah, have really little separate files
have the user make index.html
and then rename productname.txt to productname.js





(1) apart

package.json
index.html
load.js

name1.core.js
name1.test.js
name2.core.js
name2.test.js

(2) together

package.json
index.html
name.js

(3) boxed

name.txt







also have .note.js, which doesn't get run or loaded, but hangs out for development next to the others
*/





/*
have another kind of thing: page
it's a main that runs in electron
yeah, this is cool and it's four letters
or will that make it harder later to make a cross platform demo
or who cares, do that later if ever, that was kind of an overreaching but cool idea
first, get it working as a main, then split it if it makes sense


what are you doing here?

you want to do all the page stuff right inline with the regular stuff
so you're going to run a main that only works in electron, and puts the refresh button on the page



*/



/*
still to do

-looploader, done
-mainrunner, done
-electron integration, interesting, now all you need to do is have the main put the Refresh button on the page

main.js -> electron.js
page.js -> load.js       this didn't work because load double-loaded, but it doesn't matter because it will in one page

-single page test, interesting (use copy and paste to see what these same parts look like in a smaller set of files, that's condensed4)

then you have a working prototype

git commit - working container prototype and notes

-cleanup
delete and distill files and notes
lots of stuff can be collapsed flat now
pull non actual files from the root to a folder
make instructions somewhere how to setup a live reload static html page, you'll want to do that for css experiments

git commit - before containers

-merge the prototype into the root

git commit - after containers

then make familiar spirit
maybe with tape even though it's in a separate process



(1)
get the refresh button from a main

(2)
see what it's actually like to get it all in one file, combination4

(3)
okay, why not try tape
command line like linode, and
pop quiz

(4)
oh, and the thing that puts $ on electron and lets you run two timer mains at the same time
and you can run the same mains one at a time on the command line




write a tape sample on the side that
confirms you can do
ok(false) for fail, now you don't need fail actually
throws(f), that's cool, switch to that
several tests in a row that take 1s each, last doesn't finish, does tape notice
does nodeunit notice for that matter, actually



oh, centralize require, too
load() has required.
and then it's teh most common name
and then that's put on global manually, and once
>this is a great idea
first parts of node
then the same as your json



maybe try to eliminate page.js
check this out
https://nodejs.org/api/modules.html
require.main === module

When a file is run directly from Node.js, require.main is set to its module. That means that you can determine whether a file has been run directly by testing

require.main === module
For a file foo.js, this will be true if run via node foo.js, but false if run by require('./foo').

Because module provides a filename property (normally equivalent to __filename), the entry point of the current application can be obtained by checking require.main.filename.







*/



























/*
each folder contains a single demo composed of multiple files that don't use code elsewhere


>once
each file only runs once even if you require it lots of times

>reach
a uses b, b uses c, a can't get to c

>grow

load.js has the map
two kinds of files: named and on the map, app and just use the entire library
notice and stop if you try to overwrite something

function in load that has an exports

a can reach c, but for this example we're saying that's ok







notice and stop if you try to overwrite something
baloons that can be written in any file and in any order
commands to combine and separate
modes to import explicitly, or just use global



>1normal









3 kinds of things
-library module
-demo
-test

be able to make any of these in any file, everything works, duplicates are noticed right away, and you can run everything from load.js, rather than giving node the file the demo is in


do all this on the command line, and then figure out what it looks like when electron is involved











ok, at this point you could stop, or you could play around here with baloon(metadata, function, more metadata like exports)
you like the idea of allow duplicate names, easily find anything

the three kinds of baloons are
app, demo, main
library module
test

the tests work with you runner or nodeunit








name the files in the root like this



main-something1.js
main-something2.js

test-text.js
test-hide.js
test-path.js

load.js

core-text.js
core-hide.js
core-path.js

(and from unify.js)

electron-main.js
electron-page.js
electron.html
electron.css



and of course none of the names inside matter because it's all in baloons
you found 3 four letter words for these things, "main", "test", and "core", and you think you like them


load.js

main.sun.js
main.moon.js
main.star.js


core.mountain.js
core.plain.js
core.ocean.js

test.mountain.js
test.plain.js
test.ocean.js



note.other.js
node.more.js




here's what a baloon might look like



load({type:"main", name:"something", tags:["tag1", "tag2", "tag3"]}, function() {
	

your existing code goes in here
hopefully you can keep it not indented, just as though you were writing it as you did before



return {
	//down here somehow you've got an object that exports stuff for use and tests
	//use that new es6 thing where you can mention each thing once, and get both the name and the value in an object
}});




a baloon just keeps some code separate, protecting it from other baloons
and then in the return, you describe what can be exported what different ways

app - run this to run a program or a unit of usefullness within a program
test - run these to test your code
library - core functions made available for apps and other library code to use
helper - parts of the library that only test code should use, not app code, exported just for tests

ok, and then you can only export functions
and load() takes care of exporting them
and by default it dumps them all in global
unless you're doing it the default node way, when they're added to export properly

ok, first, jsut make up the normal example to refamiliarize yourself with how you're supposed to do it



app1.js
app2.js


library1.js
library2.js


test1.js
test2.js






















in the return, 


and then, you see, it needs to work with both your system, and the default node stuff
for instance, if you do
$ nodeunit test.mountain.js
that should work
so the tests in there need to get exported in teh same way that nodeunit expects

likewise, make it so that you can export your node libraries the normal node way

















try out these frameworks
-nodeunit
-mocha and chai
-tape and tap

in the code
-test.ok(true)
-test.done()

run the tests
-from the command line
-from inside the running process
*/
















/*


you can replace all "test." to "" likely

expose.test("data, some other detail, tag1, tag2")
first is group
second is description
after that are tags

test_data_some-other-detail_tag1_tag2

or "data tag1 tag2:some other detail"

or "data:and here's the note"



why not go crazy with the titles, a function can be named any string after all, and if it work sin nodeunit, you can make it work in pop quiz


"data tag1 tag2, functionName note"

"platform"
"number, nan, infinity"

number big
int min
int checkNumber
int checkNumberMath
int checkNumerals


int, description in several words, checkNumberMath



what, essentially, do you want to do
run all the tests
run just the tests in the area you're changing, so they run really quickly


remember that overrunning tests ins't a problem at all
so then maybe the way you have it is fine, sometimes it's tags, sometimes its a sentence, who cares




*/






/*
a sample of what a halfway-converted apart test file might look like

the whole file is wrapped in the new contain()
inside at the bottom, legacy tests are still exports.testWhatever, and nodeunit runs them
inside at the top, converted tests use expose.test(), and tape runs them centrally through load

also mixed in are demos that become mains, the load system runs those

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







