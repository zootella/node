
















/*
TODO design for and purpose of the Timer object
turn this into a blog entry

it's easy to create an infinite loop of individual calls to setImmediate
if you forget to stop it and just null your references to the object that was doing it, it won't get garbage collected or stop, and there will be no way for you to stop it!

watch out for this on setImmediate, setTimeout, setInterval, process.nextTick, requestAnimationFrame
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
and once shut, an event coming in from the platform won't call f, either
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
setImmediate
setTimeout
setInterval
requestAnimationFrame
process.nextTick
TODO: Promise, and async and await





















































