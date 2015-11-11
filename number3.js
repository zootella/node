








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








