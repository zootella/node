








//RANDOM
/*
TODO

this seems to always crash after printing 25 lines of text, is it always crashing on the 12500th generation? that would be really weird

you need a better way to generate random numbers, this one doesn't work well on large numbers for two reasons now:
-it crashes
-and when it doesn't, the big numbers are multiples of kilobytes and megabytes

openssl has
int BN_rand_range(BIGNUM *rnd, BIGNUM *range);
you just need a node library that lets you at that
*/

//RANDOM
//move this alongside random tests, and put a warning on random to only use with small numbers, not file sizes















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



























//NUMBER
/*
decide what to do with Fraction divide by zero
return null, and then have a describe turn that into blank
*/

//NUMBER
//add speed loop tests for Int using small numbers

//NUMBER
//you're not checking numbers in text, what happens if you put in "potato" for l?
//have a test that shows this

//NUMBER
//use n+"" or say(n) instead of numerals(), get rid of that function entirely

//NUMBER
/*
//maybe throw "number" on number problems, or something uniform at least, "data" and then details
yeah, only have like 5 kinds of exceptions, saying whose fault it is, like it's the data's fault, it's the peer's fault, it's the wire's fault, it's the disk's fault, it's the platform's fault, it's the programmer's fault
this is a good way to do it
and then additional details are in the call stack and the extra stuff you put in toss
*/

//NUMBER
//keep Int in measure, but split measure into two so both the code and the tests can be shorter
//split into number and measure
//so then the start is like text, number, measure, state

//NUMBER
//refactor all the saySize and sayTime so that there are no options in the parameters, rather, they are separate functions that you call by name
//this way, you can specify them in a sayFraction that's really custom

//NUMBER
// 1/81 is good, as is 22/7

//NUMBER
//write tests with really small numbers, less than 0.0, and big numbers, more than 1000
//for both percents and not

//NUMBER
/*
unit per unit // Average test score, like "5.000 (15/3)"
unit per size    number of somethings per byte, not sure what that would be, but include it for completeness and write like one test
unit per time // Events per second, like "1.500/s (90/1m 0.000s)"

size per unit // Average packet size, like "146b (1kb 0b/7)"
size per size    number of pieces in a file
size per time // Data transfer speed, like "1kb 512b/s (90kb 0b/1m 0.000s)"

time per unit    number of milliseconds per bucket, this one could be useful
time per size    yes, do this one, this is seconds per mb
time per time    like percent complete on an hourglass


put good defaults up there, cool patterns and whole versus round where it makes sense
maybe do have default patterns ^up there, a default custom pattern for each one that includes the answer and the fraction

you are pretty sure below it makes no sense to use sayNumerator in the percent one, for a percent to make sense, the numerator and denominator have to be the same unit

if the numeator is a size or a time, #.### doesn't make sense, only # does
so, make this the default pattern, and dont' specify a pattern when you use those

maybe instead of _fill and more default filling in sayFraction, call sayUnitPerUnit with no options, or call sayFraction with all options specified
and then just have sayFraction check that you filled out all the defaults
sayUnitPerUnit(f)
orFraction(f, "# #/#", {r:"whole", sayF:commas, sayN:commas, sayD:commas})
this will discourage customization, and make it clearer what is happening
*/

//NUMBER
//step 1: refactor the insides of old* to use sayTypePerType with patterns, see that the tests still pass
//step 2: refactor the code and tests to not use old* anymore
//step 3: combine the old test cases into the new tests








/*
you can't do operator overloading, but here are 4 alternatives
multiply, full word
m, short word
unicode symbols that can be function names, have to copy and paste
Int(7).o("+", 12).o(">=", 20), strings, crazy idea, maybe do it
yeah, this is cool/wacky/creative enough you have to do it
comment is // Who says JavaScript can't do operator overloading?

instead of i.o(), use i._() maybe

Int(7).add(12).greaterThanOrEqualTo(20), shorter sometimes

if operator not found, toss("code"), this means, there is a mistake in the source code
as opposed to "data", which means error in incoming data, external to the program, from the wire or disk
as opposed to "platform", which means node or a library did something that it promised not to
get fewer different kinds of errors
have each mean something specific
and have what you throw in text, data, and number consistant wiht this new plan
*/




/*
confirm switching to "*" doesn't slow Int down, then switch to it
comment out adding the 10 methods when you test the text based ones
*/



//make it i.hasNumber() and i.toNumber(), hasNumber means the value is small enough to fit in the number type



//write a test that calls i.inside() to watch type sin use like "--s", watch something grow into big and then fall back down again



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
*/
	if (typeof n != "number")        toss("data.type",     {watch:{n:n}, note:"type"});     // Make sure n is a number
	if (isNaN(n))                    toss("data.overflow",   {watch:{n:n}, note:"nan"});      // Not the weird not a number thing
	if (!isFinite(n))                toss("data.overflow", {watch:{n:n}, note:"infinity"}); // Not too big for floating point
	if (n > Number.MAX_SAFE_INTEGER) toss("overflow", {watch:{n:n}, note:"max"});      // Not too big to keep as an integer
	if (n + 1 === n)                 toss("overflow", {watch:{n:n}, note:"plus"});     // Not too big for addition to work
	if (Math.floor(n) !== n)         toss("type",     {watch:{n:n}, note:"floor"});    // A whole number
	if (n < 0)                       toss("bounds",   {watch:{n:n}, note:"negative"}); // Not negative








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




//quickly go through all the saySize and so on and make them all work with no options in parameters




/*
there is no _fill function
if you call sayFraction, you have to specify everything

sayFraction(pattern, round, sayFraction, sayNumerator, sayDenominator)

if you call sayUnitPerUnit and those, you get pattern and round by default, and can't specify say

sayUnitPerUnit("#.###%", "round");

this is actually simple enough to use and test, and you can still do everything granular and custom with sayFraction directly
options objects are cool, but you always have to read the instructions to use them, so they're not that practical
*/

function sayUnitPerUnit(f, s, r) { return sayFraction(f, s, "whole", commas,  commas,  commas);  }
function sayUnitPerSize(f, s, r) { return sayFraction(f, s, "whole", say,     say,     say);     }
function sayUnitPerTime(f, s, r) { return sayFraction(f, s, "whole", commas,  commas,  sayTime); }
function saySizePerUnit(f, s, r) { return sayFraction(f, s, "whole", saySize, saySize, commas);  }
function saySizePerSize(f, s, r) { return sayFraction(f, s, "whole", commas,  saySize, saySize); }
function saySizePerTime(f, s, r) { return sayFraction(f, s, "whole", saySize, saySize, sayTime); }
function sayTimePerUnit(f, s, r) { return sayFraction(f, s, "whole", say,     say,     say);     }
function sayTimePerSize(f, s, r) { return sayFraction(f, s, "whole", say,     say,     say);     }
function sayTimePerTime(f, s, r) { return sayFraction(f, s, "whole", commas,  sayTime, sayTime); }

function sayFraction(f, s, r, sayF, sayN, sayD) {
	if (!f) return ""; // Show the user blank on divide by 0

	if (!s) s = "#"; // Fill unspecified preferences with defaults
	if (!r) r = "whole";
	if (!sayF) sayF = commas;
	if (!sayN) sayN = commas;
	if (!sayD) sayD = commas;

	while (s.has("#/#")) f1();
	function f1() {
		s = s.swap("#/#", "#/#".fill(sayN(f.numerator), sayD(f.denominator))); // Turn #/# into 1/2
	}

	while (s.has("#")) f2();
	function f2() {
		var c = s.cut("#");
		var decimal = 0;
		if (c.after.starts(".#")) { // #.# or #.###
			while (c.after.get(decimal + 1) == "#") decimal++; // Count the number of decimal places, like # decimal 0, #.### decimal 3
			c = { before:c.before, after:c.after.beyond(1 + decimal) };
		}
		var t;
		if      (c.after.starts("%"))  { t = sayF(f.scale([        100, _tens(decimal)], 1)[r], decimal); } // #%  or #.###%
		else if (c.after.starts("/s")) { t = sayF(f.scale([Time.second, _tens(decimal)], 1)[r], decimal); } // #/s or #.###/s
		else                           { t = sayF(f.scale([             _tens(decimal)], 1)[r], decimal); } // #   or #.###
		s = say(c.before, t, c.after);
	}
	return s;
}












