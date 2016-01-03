
require("./load").load("base", function() { return this; });

var platformBigNumber = require('bignumber.js');














//CLOSE
/*
big ideas for a new design on close

close means
knows if its open
has a close method
only closes once
close(a) will try to close it
you can ask the program if everything is closed

all timers get set through wait(0, f)
if f is closed, f won't get called
any exception that gets thrown up to f will exit the process
the program will keep track of how many events happened and how long they took

so like main actually calls wait(0, main)
the step system with your promises uses the same system to meter how many events and how long, and catch uncaught exceptions

pulse and pulseScreen can probably go away, or get included optionally

singletons that need to get closed, like keyboard, use close, so you can close(keyboard) and if you forget to, closeCheck will complain

stuff you don't need anymore
pulseSoon, and the system where a bunch of pulses run and then one pulseScreen at the end
because promises and callbacks will work so that they will call the next thing themselves
*/


















//INSPECT
//can you make that f, can you do f+"" to get just the name

//yeah, if you function+"" you get multiple lines of text, which might look ok if you put them through the thing you need to write that single lines and wraps and indents and hanging indents stuff
//once you write that, you also need to go back and go to town on saying exceptions, which you spent a lot of time on last summer, parsing, but it didn't work

//INSPECT
/*
characters to use for your better inspect()
these are just extended ascii, so they are likely to work everywhere

¶ newline
» tab
¦ wraps to the next line

*/

//INSPECT
/*
merge say into inspect
say(object) prints out the object
say(array) prints out teh array

objects look like this

{
	name:value
	name2:value2
}

arrays look like this

[first, second, third]
calling say on each one, of course

if it goes deeper than say will go, have ... to indicate you need to say more
no, have say always go all the way deep

have it do one line or multiple lines based on length
have it watch out for loops that would make it be able to go deeper forever
*/

//INSPECT
/*
easy solution

have log do all the wrapping itself
don't wrap before log
when you send to the browser, log won't wrap, css will

have log see how many spaces are at thes tart of the line, and then hanging indent with 2 more spaces
be fancy and break on spaces
don't worry about special characters, leave that to encodings and whatnot

obviously deal with the case of a word longer than the columns, and then break the word
*/



















//TOSS
/*
if operator not found, toss("code"), this means, there is a mistake in the source code
as opposed to "data", which means error in incoming data, external to the program, from the wire or disk
as opposed to "platform", which means node or a library did something that it promised not to
get fewer different kinds of errors
have each mean something specific
and have what you throw in text, data, and number consistant wiht this new plan
*/

//TOSS
/*
here's how to do exceptions

toss("data", "bounds");
toss("data", "overflow");
toss("data", "type");
toss("data.overflow");//toss looks for dot and then parses that into subtype
data.illegal for an illegal character
code.math
code.

don't invent them, if you can't think of one, just have the high level classification

or no, put it all in note, just have large type, and then if you need a subtype, put it in note

	if (typeof n != "number")        toss("data.type",     {watch:{n:n}, note:"type"});     // Make sure n is a number
	if (isNaN(n))                    toss("data.overflow",   {watch:{n:n}, note:"nan"});      // Not the weird not a number thing
	if (!isFinite(n))                toss("data.overflow", {watch:{n:n}, note:"infinity"}); // Not too big for floating point
	if (n > Number.MAX_SAFE_INTEGER) toss("overflow", {watch:{n:n}, note:"max"});      // Not too big to keep as an integer
	if (n + 1 === n)                 toss("overflow", {watch:{n:n}, note:"plus"});     // Not too big for addition to work
	if (Math.floor(n) !== n)         toss("type",     {watch:{n:n}, note:"floor"});    // A whole number
	if (n < 0)                       toss("bounds",   {watch:{n:n}, note:"negative"}); // Not negative
*/

//TOSS
/*
//maybe throw "number" on number problems, or something uniform at least, "data" and then details
yeah, only have like 5 kinds of exceptions, saying whose fault it is, like it's the data's fault, it's the peer's fault, it's the wire's fault, it's the disk's fault, it's the platform's fault, it's the programmer's fault
this is a good way to do it
and then additional details are in the call stack and the extra stuff you put in toss
*/























//ENCODE
/*
additional encodings to add

-base58
https://github.com/jimeh/node-base58/blob/master/src/base58.coffee
but that's for numbers, not binary data of arbitrary length
https://en.wikipedia.org/wiki/Base58
hm, base58 seems to be for large integers, not binary data

-a generalized base256 that uses unicode characters, starting where you want
starting at cuneiform, here
http://unicode-table.com/en/blocks/cuneiform/
starting at asian characters, here
http://unicode-table.com/en/blocks/cjk-unified-ideographs/

and check them all round trip, it's ok to make that required for all of them
and you don't have to support strings, have these just work on given blocks of text and data only
*/




















//TEXT
//you're not checking numbers in text.js, what happens if you put in "potato" for l?
//have a test that shows this















//TIME
//duration should be an object, but when should just be the number
//and just check it with max0
//refactor when into functions that do that stuff
//and now() just returns the number, it's just an alias for Date.now or whatever







if (demo("snip")) { demoSnip(); }
function demoSnip() {

}

































































































