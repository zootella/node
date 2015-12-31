











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
//you're not checking numbers in text, what happens if you put in "potato" for l?
//have a test that shows this

//TOSS
/*
//maybe throw "number" on number problems, or something uniform at least, "data" and then details
yeah, only have like 5 kinds of exceptions, saying whose fault it is, like it's the data's fault, it's the peer's fault, it's the wire's fault, it's the disk's fault, it's the platform's fault, it's the programmer's fault
this is a good way to do it
and then additional details are in the call stack and the extra stuff you put in toss
*/

//NUMBER
//write tests with really small numbers, less than 0.0, and big numbers, more than 1000
//for both percents and not

//NUMBER
//step 1: refactor the insides of old* to use sayTypePerType with patterns, see that the tests still pass
//step 2: refactor the code and tests to not use old* anymore
//step 3: combine the old test cases into the new tests

//NUMBER
//write a test that calls i.inside() to watch type sin use like "--s", watch something grow into big and then fall back down again

//SAY FRACTION
//quickly go through all the saySize and so on and make them all work with no options in parameters


















//NUMBER
/*
unit per unit // Average test score, like "5.000 (15/3)"
unit per size    number of somethings per byte, like requests, reads, failures per mb
unit per time // Events per second, like "1.500/s (90/1m 0.000s)"

size per unit // Average packet size, like "146b (1kb 0b/7)"
size per size    number of pieces in a file, compression performance
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
sayFraction(f, "# #/#", {r:"whole", sayF:commas, sayN:commas, sayD:commas})
this will discourage customization, and make it clearer what is happening
*/

//SAY FRACTION
/*
there is no _fill function
if you call sayFraction, you have to specify everything

sayFraction(pattern, round, sayFraction, sayNumerator, sayDenominator)

if you call sayUnitPerUnit and those, you get pattern and round by default, and can't specify say

sayUnitPerUnit("#.###%", "round");

this is actually simple enough to use and test, and you can still do everything granular and custom with sayFraction directly
options objects are cool, but you always have to read the instructions to use them, so they're not that practical

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
*/






















/*
// Calculate n1 * n2
// Make sure the answer doesn't overflow the largest value a number can hold
function multiply(n1, n2) {
	check(n1, 0);
	check(n2, 0);

	var a = n1 * n2;

	check(a, 0);
	return a;
}

// Calculate n / d
// Make sure n and d are positive integers, and d is not 0
// Calculate numerator / denominator
// Return the integer division and remainder
function divide(n, d, a) { // Takes optional answer object loaded with additional details
	check(n, 0);
	check(d, 0); // Who says you can't divide by zero? OH SHI-
	if (d === 0) return null; // Return null instead of throwing an exception

	if (!a) var a = {};
	a.numerator   = n; // Numerator and denominator
	a.denominator = d;
	a.whole       = Math.floor(n / d); // Round down
	a.ceiling     = Math.ceil(n / d);  // Round up
	a.round       = Math.round(n / d); // Round to nearest
	a.remainder   = n % d;             // Remainder
	a.decimal     = n / d;             // Floating point number

	check(a.whole, 0); // Check our answer before returning it
	check(a.remainder, 0);
	if ((d * a.whole) + a.remainder !== n)                     mistakeLog(Mistake("platform", {note:"remainder", watch:{n:n, d:d}}));
	if (a.whole + ((a.remainder === 0) ? 0 : 1) !== a.ceiling) mistakeLog(Mistake("platform", {note:"ceiling",   watch:{n:n, d:d}}));
	return freeze(a);
}

// Calculate (n * m) / d
function scale(n, m, d, a) { return divide(multiply(n, m), d, a); } // Optional answer object to fill with more and return
*/




/*
// Make sure i is a whole number with a minimum value of min or larger
function check(i, min) {

	function _check(n) {
		checkType(n, "number");                     // Make sure n is a number
		if (isNaN(n))             toss("bounds");   // Not the weird not a number thing
		if (!isFinite(n))         toss("overflow"); // Not too big for floating point
		if (n > 9007199254740992) toss("overflow"); // Not too big for int
		if (n + 1 === n)          toss("overflow"); // Not too big for addition to work
		if (Math.floor(n) !== n)  toss("type");     // A whole number
	}

	_check(i);
	_check(min);
	if (i < min) toss("bounds"); // With the minimum value or larger
}

exports.check = check;
*/










//things to change with check
//name it checkNumber, and use it elsewhere in the code
//have min be optional, if !min min = 0, change check(n, 0) to just check(n)

//maybe rename check to integer, check is a little too generic, and what it does is confirm that you've got an integer

/*already above
// Determine which should appear first in sorted order
// Zero if same, negative if n1 then n2, positive if n2 first
function compareNumber(n1, n2) {
	check(n1, 0);
	check(n2, 0);
	return n1 - n2;
}

exports.compareNumber = compareNumber;
*/












//using check(), tests on your mac take right around 700ms
//switching to min0 slowed them down maybe about 30ms




//with this architecture, you can unify Int and _3type, actually













//no, that didnt' make it faster
//for the love of everything, stop working on int
//it's fast enough for display, and you can avoid using it for saving values in meter
//so it's good enough


/*

ok, but what if this were faster
no int type, math(a, c, b) checkNumerals(a) and b each time
and then always use BigNumber
all of the checks, a lot less code, and crazy if that works

and then just use numeralsToNumber
this assumes that's what's slow is adding stuff to the Int object

ugh, you feel that you are going to code that up seprately now



*/









































































