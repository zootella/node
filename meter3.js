










//no, prove that the shortcut works using a test, not a demo
/*
function demoShortcutMeter() {

	function ScreenResource() {
		var o = mustClose();
		o.close = function() {
			if (o.alreadyClosed()) return;
		};
		o.pulseScreen = function() {
			stick("meter.n: #".fill(meter.n()));
		}
		return o;
	};
	var r = ScreenResource();

	var meter = meterExampleShortcut();

	keyboard("any", function(key) {//blank to get all the events
		var i;
		try { i = numeralsToNumber(key.character); } catch (e) { return; }//the user typed a key other than 0-9
		meter.record(i);
	});

	keyboard("exit", function() {
		close(r);
		closeKeyboard();
		closeCheck();
	});
}
*/




/*



don't change divide at all except
add a.n and a.d
replace divide by zero with returns null, you'll ahve to fix tests for that probably
then outside, make two functions old-Divide, oldDivideTime, which can use scale

or just one, old-Divide(result, nUnit, dUnit)
the units are optional
or specify them like "none" "byte" "millisecond"
composes text like

1,234.567 (47mb 0kb 0b/2m 22.345s)
if n is numbers, show decimals
if n is bytes, show time

and put a big todo to get a bignum involved that will perform valid math if it overflows, and throw only if the answer is too big


and do {}.notfound; to get a caught and logged exception that has no context, get a call stack in there, for crying out loud, before process exit


and what about all that weird old sayAverage nonsense, that hsould all come in here as well

numerator could be bytes, or numbers
denominator could be milliseconds, or numbers




how about this



*/





//no, this should be code based, like date
//call .text on a divide, hand it a pattern, or it uses a default one
/*

N numerator
NS numerator as a size
NT numerator as a time

D denominator
DS demonimator as a size
DT demonimator as a time

answers

W	a.whole     = Math.floor(n / d); // Round down
C	a.ceiling   = Math.ceil(n / d);  // Round up
R	a.round     = Math.round(n / d); // Round to nearest
E	a.remainder = n % d;             // Remainder
	a.decimal   = n / d;             // Floating point number

WS
CS
RS
ES

WT
CT
RT
ET

and after any of those, you can put p

NSppp that's the numerator as a size, with 0.000b at the end

percent is just W% or Wppp%

commas are added by default


P








*/



//TODO have the thing that scale() and divide() returns have a .text() method that puts it exactly on one line




//make demos to show the different parts of the average meter, rather than the whole thing
//have these:
//basic, including records, total, and averagePerRecord
//lowest and highest
//earliest, average per second since made, averageper second since earliest
//recent, recentvalue, recentwhen





/*
	o.records = o.m.count.records;//TODO move this somewhere else
	//and yeah, you dont' need units at all, you'll make custom functions that prepare meters for unit-specific special purposes, and then have shortcut functions that have unit-specific names like size and so on


*/













//make the demo where you press 0-9 in real time and see meter.text() in a stick


//what if mustClose provided a default empty close function you could replace with your own
/*
then instead of wrapping o from mustClose, you could use it directly

var screen = mustClose()
screen.pulseScreen = function() {
	
}

and then you don't need ExitResource anymore
yeah, you can change this



*/


/*
start out with the easy fun ones
max, min, count, total, average



*/









/*
meters to make

AverageMeter
SpeedMeter
EdgeMeter
SampleMeter (median)
ScaleMeter (histogram)
ColumnMeter (histogram)
*/


/*
pass a now function into the submeters, they can call it to get the most recent uniform time to use
when you make a meter, pass in a hash of names and values, letting you do different speeds, like "speed250ms", "speed4s"
have a bunch of functions at the top with all the premade sets of submeters, don't do this in the code

do for each name in hash
make a meter, then fill it with a prepared hash, have it naturally throw if you use it before filling it, or try to chagne it afterwards, or maybe not, let them do that, whatever

have demos that test each kind of meter in a little way that you can see, using small presets that aren't real
*/


/*
meter component m must have the following functions

m.distance(d) we will call when we've recorded a distance traveled of d units
m.name is the kind of component, must be unique and valid as js label, m.name accesses it directly
m.text() prints out user readable text about what this component has measured



*/


//there is no add, you ahve to name all the analyizers in the function


/*
in use, you'll probably want, when you make a meter, to add the names of the components
Meter(Average, Histogram, Whatever, Etc) like that
also maybe add light, add heavy


*/



//what about time the meter was created, and how long that is before the first value arrived
//should that count towards the longest time between two records or not? have it both ways

//what about average in time, average total values recorded per second, not per record
//average record is useful if these are tests
//average per second is useful if this is a download and we want to see how fast it went

//or no, actually, have the starting time count, for both of the comments above






//have a powers of 2 histogram
//also a histogram you can setup once you know what to expect where you say the start, column width, and number of columns, and you get 2 more, lower than that, higher than that

//have functions that return premade mixes of meters, with all the right stuff included



//pass in what the units are, like bytes, events, milliseconds, scores


//another benefit of doing o is you can have variables and methods of exactly the same name, FTW


































/*
Make a meter to discover patterns from a great number of 0+ values delivered across time

pass in a time for testing, or leave it blank to use now

lots of things produce numbers in time
for instance, test scores in a class, or bytes downloaded from a socket


up here, talk about the different shapes of data
just vertical: test scores, values matter, time doesn't
just horizontal: events, time matters, all the values are 1 event
both vertical and horizontal: bytes downloaded

talk about how a meter can contain another meter, which looks at the time intervals
make this, it's called IntervalMeter, access it like meter.m.interval.m.m.answer()
*/



/*
what if you used units as the name of the dictionary of meters
this is kind of cool, actually
meter.bytes.count.total()
meter.bytes.interval.meter.milliseconds.count.averagePerRecord()

also, you can't call average average, you have ot call it something like simple or basic or count

ok, because these are long and complicated, you might want to have shortcut functions prepared
instead of return Meter(), it's var o = Meter; o.shortcut = o.bytes.count.total
and that way you can give them really long descriptive custom names
this is a cool idea
*/







/*

organize these three side by side, be able to change them independently
also be able to pass in a custom one, or if none passed in, then it uses the global

culture formatting, affected by what culture the user is in
newline characters, affected by what kind of computer it is
half or full spaces, affected by whether the text output is to a browser or a file/console

*/










/*
why does this crash
log(sayScaleProgress(divide(123456789, 987654321), 6));// 12% 117mb/941mb
is this enough to overflow?
that's not a big file in bytes, you migth want to get that to 6 decimal points
so implement bignum in scale, i guess

you've got another one that overflows, it's
test.ok(saySpeedKbps(divide(Size.tb, Time.hour)) == "298,261kb/s");//TODO have scale() use bignum to be able to do this one

saySpeedKbps has got 3 numerators and 3 denominators
have a single function divide(n, d) that works like this
n and d can be numbers, or arrays of numbers
arrays get multiplied together

divide([1, 3], 2)
divide([1, 3], [2, 4])

use Array.isArray(n)

uses bignum inside, only throws if any of the answer integers are larger than js maximum int

probably this one
https://www.npmjs.com/package/bignum
*/





//have speed test on each meter
//start with a blank one that just creates the random numbers








































//TESTS


//you can write tests, not just demos, for everything meter does that isn't dependent on randomness or time
//actually, you can also feed simulated times, and test everything, yeah, do that actually

exports.testMeterCount = function(test) {

	//average 4, 5, and 6
	var meter = meterSingleCount();
	test.ok(!meter.m.count.hasLowest());
	meter.record(4);
	meter.record(5);
	test.ok(meter.m.count.recentValue() == 5);
	test.ok(meter.m.count.highestValue() == 5);
	meter.record(6);

	test.ok(meter.m.count.records() == 3);
	test.ok(meter.m.count.total() == 15);
	test.ok(meter.m.count.lowestValue() == 4);
	test.ok(meter.m.count.highestValue() == 6);
	test.ok(meter.m.count.recentValue() == 6);

	test.ok(meter.m.count.averagePerRecord().whole == 5);

	test.done();
}












if (demo("snippet")) { demoSnippet(); }
function demoSnippet() {





	//biggest number javascript keeps as an int is 8pb
	//so let's have the last column be, bigger than 4pb

/*
	var i = 4*Size.pb;
	var n = 0;

	while (i) {
		log(n, " ", saySize(i));
		i = divide(i, 2).whole;
		n++;
	}
	*/

	var limit = 2*Size.pb

	var i = 0;
	var n = 1;

	var k = [];
	var v = [];

	while (n < limit) {

		k[i] = n;
		v[i] = 0;

		i++;
		n = Fraction([n, 2], 1).whole.toNumber();
	}
	k[i] = 0;
	v[i] = 0;



	log(k.length);

	for (var j = 0; j < k.length; j++) {
		log("index #, key #, value #".fill(j, saySize(k[j]), v[j]));
	}



	//ok, now values will be coming in, and you need to increment the count in the right index
	//so let's write a function that does that


	function record(value) {

		for (var i = 0; i < k.length; i++) {
			if (i == k.length - 1) {
				v[i]++;
				break;
			} else if (value < k[i]) {
				v[i]++;
				break;
			}
		}
	}


	//and to get in a slot, the value is less than
	//to count in index 0, the value is <1

	//doubling all the way to 4pb only takes 52 slots in an array
	//and, you get 10 columns for every size, like 10 for kb, 10 for mb, etc, which is also great









}










/*

bring over speed
use for pulse efficiency
write comments about what to look for when running the various number tests
use wiht a metronome


>some node
at spotify, update node to version 0.12.0 in a separate vm that also has dropbox
and then see if you dont also start getting errno -4058 instead of 34, and if so, switch to that, and put back the line that checks for it in text
also, both before and after the upgrade, see if text_test testSort starts failing, perhaps because localeCompare is not defined to be the same across browsers, instead, maybe compare the data representations of the strings

>moar
have mustClose return a default empty close so you don't have ot make your own
and then once you do this, you dont' need ScreenResource everywhere it appears
trivialize chunk and piece





*/








//have your exception to text, which doesnt' work, print it out like this
/*

(your summary which doesn't work)
--
(node's full normal text which does work)
==



*/



//search "return {" to find a lot of objects you need to make the new way with o = {} and return o






//to make the meter presets more self describing, have them all take their parameters in a map
/*
makeSomeMeter({highestCeiling:1000000})
and then have if (!p) p = {}, the defaults, right at the top
this is a great idea
*/








//have the speed array meter, 50 speed meters with doubling sizes
//have a nested demo meter, a speed, and then a sample of all the speeds reported, and a count of the highest, lowest, and average speeds reported

//you might have to code a custom meter for pulse, you think you want to record how much time is spent inside versus outside a pulse, rather than dividing by total time







/*
// Count the number of values that are beneath powers of 2, like <1, <2, <4, <8, all the way up to <4pb
function ScaleMeter(made) {

	// Change this from 4*Size.pb to just 8 to be able to see 8 and 9 land in the higher column in a keyboard demo
	var highestCeiling = 4*Size.pb;

	// Hold
	var records = 0; // Number of records
	var c = [];      // Value ceilings
	var f = [];      // Frequency of records with values under those ceilings
	var i = 0;       // Index of the first column
	var n = 1;       // Ceiling of the first column
	while (n <= highestCeiling) {
		c[i] = n;      // Ceiling of this column
		f[i] = 0;      // No values recorded yet
		i++;           // Move to the next column
		n *= 2;        // The ceiling will be twice as high there
	}
	c[i] = "higher"; // The final column is for values that are higher than the highest ceiling
	f[i] = 0;

	// Get
	var o = {};
	o.length = function() { return c.length; } // Loop through the current results
	o.get = function(i) {                      // Get a result
		if (i < 0 || i > c.length) return null;
		return { ceiling:c[i], records:f[i] };
	}
	o.records = function() { return records; } // Number of records, not the total of the values
	o.text = function() { return sayColumnMeter(o); }

	// Set
	o.record = function(v) { // This meter doesn't care when any values were recorded
		for (var i = 0; i < c.length; i++) {
			if (i < c.length - 1) { // i is before the last column
				if (v < c[i]) {       // The new value is under the ceiling for this column
					f[i]++;             // Count it
					records++;
					break;              // leave to only count it here
				}
			} else {                // i is on the last column
				f[i]++;               // no ceiling here, count it
				records++;
			}
		}
	}
	return o;
}

// Record values in a histogram
function ColumnMeter(made, columnI, columnW, columnN) { // Index where columns start, width of each column, and number of columns
	min0(columnI); // Columns can start at the beginning, value 0, or to the right of that
	min1(columnW); // Columns have to be at least 1 unit wide
	min1(columnN); // There has to be at least 1 column

	// Hold
	var records = 0; // Number of records
	var c = [];      // Value ceilings
	var f = [];      // Frequency of records with values under those ceilings
	var i = 0;       // Index of the first column, and each column as we loop
	var n = columnI;    // Ceiling of the first column, and each column as we loop
	if (!n) n += columnW; // Now margin column at the start
	while (n <= columnI + (columnW * columnN)) { // Loop through n pointing to the last ceiling
		c[i] = n;      // Ceiling of this column
		f[i] = 0;      // No values recorded yet
		i++;           // Move to the next column
		n += columnW;
	}
	c[i] = "higher"; // The final column is for values that are higher than the highest ceiling
	f[i] = 0;

	// Get
	var o = {};
	o.length = function() { return c.length; } // Loop through the current results
	o.get = function(i) {                      // Get a result
		if (i < 0 || i > c.length) return null;
		return { ceiling:c[i], records:f[i] };
	}
	o.records = function() { return records; } // Number of records, not the total of the values
	o.text = function() { return sayColumnMeter(o); }

	// Set
	o.record = function(v) {
	}
	return o;
}
*/








//have a column of percents in scale and column meter


//ability to mark a meter, and then get averages from the start to the mark, probably only countmeter will do this


//SpinMeter, the one that throws an exception if stuff happens too fast




//have mustClose return one with an empty close() function
//and go everywhere you're just using pulseScreen and make it simpler now that it has that




//maybe make a speed array meter, a single meter that contains a bunch of speed meters of doubling widths from like 4ms to an hour





//make the one that has an array of speed meters, with lots of different window sizes
//what about the spin guard, the one that throws if it gets too many events in a single second, you could make that as a meter, too


























//here's how you do it
//inside speed, there is optionally another meter, with its own compoment meters
//and each time speed gets a record or is asked to produce a speed, it tells its meter
//confirm you can set this all up having a single starting time recorded through the whole tree


//see if you can make tests that feed in dummy times, nowhere in meter does it actually call now if you pass in a w, for instance
//obviously in production code, you won't pass in a w, you'll leave it blank



//hook the big meter into speedloop, feeding it random values as fast as you can, and see how slow that is










//maybe a cheater function you use rarely that removes all leading, trailing, and double newlines in a string
//you wouldn't use this in stick, but you might in test code that leads to stick, for instance












/*
one kind of inner meter is the time interval
if you're analyzing events, this is the only meter you care about, really

another use of an inner meter is seeing how jumpy different speed windows are
for this one, make sure that you count a speed reading each time code asks for the speed, or enters a new reading
also, deduplicate it so that if more than one call in a single tick get the speed, only one speed reading is recorded by the inner meter





*/



//in list, change .size to .length, size is bytes, length is number of elements, and matches [].length
//in list, maybe change to var o = {} return o form, instead of the old form





//write a demo for sample that throws in minority first, majority later, then the reverse, and shows that the samples are the same
//not a keyboard demo, but can't be a test because
//well, could be a test, just allow for variance in the results
//write tests for random that way, too, make sure you get all the edge numbers, for instance
//use columnMeter for these tests





/*
probably a quagmire to have more ideas about say divide, but here you go
the reason it's not working yet is
-you always want to do something custom different
-there are too many functions and you cant remember their names

new idea, what if you used a combination of function and pattern
sayUnitPerUnit(a, p)
and then p is a pattern like
"#"
"#%"
"#.###"
"#.######"//as many of those as you want, this is why you need bignum
"#.###%"
"# #/#"
"# (#/#)"
it just looks for .###### and fewer, then #/#, then just #, and knows what to do
and it looks for #% and knows to multiply by an extra 100
this is a pretty cool design, actually. you might have finally figured it out
"# thing(s)" looks for s and adds or doesn't

but these would still be outside this refactor
saySpeedKbps
saySpeedTimePerMegabyte

also have a {} setting to use ceiling or round, or just "whole", "ceiling" or "round", default is whole


once you do this, you can delete the notes in divide.txt






*/


/*
have list.getFirst() and .getLast()
see about switchign them to the var o = {} return o model


*/


/*
write a little test to make sure this works
divide 8/4 with 8 9 10 11 12
check .whole, round, and ceiling for each

important for sayUnitPerUnit
important for divide bignum, when that happens
*/


/*
probably change a the ansewr object to d the answer from a divide
this is when you've combined scale with divide, and are using bignum


*/






/*
be able to enter greater than 9

[0-9] or [l]onger numbers
'' [Enter] [Backspace] or [s]hort numbers

[0-9] or [*] long numbers
'' [0-9kmgtp] [Backspace] [Enter] or [*] short numbers

and have kmgtp work, like '4p' is 4 pedabytes

yeah, this is cool and pretty easy, code it up once in the demo, print it at the top of stick
it'll also be interesting to see how short and simple writing an text box is
*/






