console.log("task test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO



//TODO when done, move this into state_test.js





//first, make sure closure does what close needs it to

function addCore() {
	var o = {};//the object we will fill and return

	var _color = "white";//local variable not attached to o
	o.getColor = function () { return _color; }
	o.setColor = function (c) { _color = c; }

	return o;
}

function addMore(o) {//the object we will add more to

	var _shape = "amorphous";//another local variable also not attached to o
	o.getShape = function () { return _shape; }
	o.setShape = function (s) { _shape = s; }
}

expose.test("task double closure", function(ok, done) {//omg what does it mean

	var o = addCore();//make a new object that has color
	addMore(o);//add to it the ability to hold shape

	var p = addCore();//make another one to show they don't clash
	addMore(p);

	ok(o.getColor() == "white");//reading the defaults works
	ok(o.getShape() == "amorphous");

	o.setColor("blue");//and you can change them both
	o.setShape("triangle");
	ok(o.getColor() == "blue");
	ok(o.getShape() == "triangle");

	ok(o.getColor());
	ok(o.getShape());
	ok(!o._color);//the enclosed local variables are really private
	ok(!o._shape);

	ok(p.getColor() == "white");//none of that changed the second object
	ok(p.getShape() == "amorphous");
	p.setColor("red");
	p.setShape("circle");
	ok(p.getColor() == "red");//which can be changed independently
	ok(p.getShape() == "circle");
	ok(o.getColor() == "blue");//separate of the first one
	ok(o.getShape() == "triangle");

	done();
});

























//possible scenarios
//demonstrate these in open, like this
//also make a simulation resource object that demonstrates all 8 cases exactly

//1. throws before go (parse)
//ask to open the widgit
//there's a problem before the request to open even goes through, like invalid path
//no widget to close later on

//2. check progress (check)
//ask to open the widgit
//check the progress to see how long it's been taking
//leads to done, fail, or stuck

//3. never finishes (stuck)
//ask to open the widgit
//the platform never finishes, the callback is never called
//no widget to close later on

//4. simple success (done)
//ask to open the widgit
//a little while later, it opens successfully
//remember to close the widget

//5. simple failure (fail)
//ask to open the widgit
//a little while later, it fails with error
//no widget to close later on

//6. start, cancel, stuck (cancel stuck)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform never gets back to you
//no widget to close later on

//7. start, cancel, done (cancel done)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform completes the request successfully
//remember to close the widget

//8. start, cancel, fail (cancel fail)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform encounters error
//no widget to close later on


/*
function resourceOpen(path, next) {
	try {

		var task = Task(next);
		platformResource.open(path, callback);
		return task;//(check)

	} catch (e) { task.fail(e); }//(parse)
	function callback(error, file) {
		if (task.isClosed()) {
			if (error) {//(cancel fail)
			} else {//(cancel done)
				//maybe close unwanted resource
			}
		} else {
			if (error) {
				task.fail(error);//(fail)
			} else {
				task.done(file);//(done)
			}
		}
	}//or never calls (stuck), (cancel stuck)
}
*/



























//notes




//probably rename done(test) to testDone(test) so you can use done in the actual program




/*
//let more of the call stack show through
//have a setting that shows or hides the raw call stack

//TODO, ok, if you look at the whole call stack, is there anywhere that it says 751
//yes:

here:'true' file:'text.js' line:'79' function:'toss()'
here:'true' file:'data.js' line:'125' function:'_clip()'
here:'true' file:'data.js' line:'120' function:'start()'
here:'true' file:'state_test.js' line:'751' function:'pulse()'
here:'true' file:'state.js' line:'484' function:'_pulse [as _onImmediate]()'
here:'false' file:'timers.js' line:'330' function:'processImmediate [as _immedia
teCallback]()'

remove " [as _onImmediate]"
have files and lines on all of them, like this
remove Object. and o., but don't have it just take the last part, you want Data.get(), not get()

state.js:484 _pulse()
state_test.js:751 pulse()
data.js:120 start()
data.js:125 _clip()
*/




//thinking about next and result
//make it so that next can only get called once, if code tries to call it a second time, the call doesn't go through
//for instance, required.fs.stat throws, the top try block catches, next gets called with an error result
//later, node successfully finishes, and calls the callback somehow, your code somewhere stops this

//you might be able to combine next(resultWhatever(time into a single thing
//at the very top of the function, make a new local Monitor object that takes and wraps the given next function
//when you make it, it records the starting time
//then, whenever you want, synchronously or in callbacks, you can call methods on it like .fail(e) and .done(a)

//this smart Result object also looks at the time and times itself out if necessary
//maybe you can even give it a list of things to closeOnYes, .closeOnNo at the top, and then things close themselves

//this is a really interesting design




//ok, to be really crazy, what you woudl do now is have two functions, before and after
//and then have monitor take next, before, after, and do the whole thing
//ok, here's why to not do that
//because in its current state, it's pretty clean but it still looks like node examples, which is good
//becuase you have the ability to easily access parameters in both before and after, and make local variables that both can get to, which is good
//of course, this is exactly what q and async and all the libraries are doing


//confirm you can do something wrong in a callback, not catch it, and node will shut you down
//do an actual example, easiest is {}.notfound;
//demonstrate this in a demo for safe keeping, also




//have list State check that you added a close method
//well, can't do that anymore, see what happens if you mustClose and then don't, it should be an exception that leads to mistakeStop





//this is a good test, uncomment and fix and use it
/*
exports.testResult = function(test) {

	var t = now();

	//timeout
	var r = Result(t, Mistake("timeout"), null);
	test.ok(r.isError());//binary outcome
	test.ok(!r.isDone());
	test.ok(r.e);//contained exception
	test.ok(r.e.name == "timeout");
	test.ok(!r.result);//no result
	try {
		r.get();//get throws
		test.fail();
	} catch (e) { test.ok(r.e.name == "timeout"); }

	//mistake
	r = Result(t, Mistake("data"), null);
	test.ok(r.isError());//binary outcome
	test.ok(!r.isDone());
	test.ok(r.e);//contained exception
	test.ok(r.e.name == "data");
	test.ok(!r.result);//no result
	try {
		r.get();//get throws
		test.fail();
	} catch (e) { test.ok(r.e.name == "data"); }

	//success with no details
	r = Result(t, null, null);
	test.ok(!r.isError());//binary outcome
	test.ok(r.isDone());
	test.ok(!r.e);//contained exception
	test.ok(!r.result);//result not required
	test.ok(!r.get());//get returns undefined, but doesn't throw

	//success with details
	r = Result(t, null, {color:"blue"});
	test.ok(!r.isError());//binary outcome
	test.ok(r.isDone());
	test.ok(!r.e);//contained exception
	test.ok(r.result);
	test.ok(r.result.color == "blue");
	test.ok(r.get().color == "blue");//get doesn't throw

	done(test);
}
*/



//see what happens when you forget to add a close, you expect that the next pulse will just throw



//you don't need confirmOpen, but see where you were using it in the java code just in case




//equally acceptable ways to close o are
//close(o), using the a, b, c, that doesn't complain if you hand it anything
//o.close(), calling the method directly
//have close(a, b, c) be fine if a is null or undefined, but if it's a string, or an object that doesnt' have a close(), have it throw, because that's a coding error that should be noticed





//actually, use
//https://github.com/kriskowal/q-io/
//and see what it's like to add the global 4s timeout

//node gives you asynchronous and streams, use
//q gives you promises, q-io wraps the fs package
//async gives you ways to flatten the pyramid
//iced coffeescript gives you the await keyword
//bluebird gives you promises and C# style async/await

//figure out which of these you should use, how they overlapp, and which work well together
//before you do that, just try out file open 3 ways: your Task, q-io, and bluebird

//q-io talks about handling file system oddities like links, probably in the right way

//go through these exercises
//https://www.npmjs.org/package/promise-it-wont-hurt

//ok, here's the plan
//get q and qio
//code up little demos that demonstrate a few things from q, qio, and collections
//that's it for today



//remember that streams are going to come right after tasks
//q talks about promise streams, it may make sense to learn plain node streams first



//see how fileClose doesn't provide a callback
//have task be able to deal with this
//on task.fail with no callback, task message logs the error instead of telling another part of the program











//and here are some notes about charm
//charm is easy
//build it next to log
//the process keeps a global about how many charm lines there are
//functions can add them, probably not remove them, and set them
//log still works, it puts it above the charm lines
//a blank line makes it look nice
//actually, just a function charm() that you give an array of strings
//and you can call it as many times as you want
//and on pulseScreen, it updates lines that have changed
//and keeps on console logging right on top
//and there is a blank line above the charm lines
//and if you give it a longer array, it makes a new line
//and if you give it a shorter array, it just keeps things at the top, with blank lines beneath, but it really can't get rid of them
//this is a cool simple design for log and charm, it's great how you can use them both at once






//at the top of close, explain
//this isn't about closing your objects for you automatically
//this is not like reference counting or garbage collection
//quite the opposite: it's the full responsibility of your code to keep track of what you don't need anymore and close it when you're done with it
//what this does is let you know when you've made a mistake with that, and let the process exit with something still open that you forget to close







//don't time out on open because that's dangerous, time out on the others because they can retry without breaking stuff later
//write the posix 11 using q promises
//the way to figure out promises is to just concentrate on how they work, returns a promise, function name, etc


/*
//couldn't this:
function oldWay() {
	try {
		//your code
	} catch (e) { mistakeStop(e); }
}
//be instead something like this:
function newWay() {
	catchAndStop(function() {

	});
}
//and then you also have catchAndLog
//or names like perfect() and relentless()
*/
//instead, figure out how to attach a handler to find out about every uncaught exception in node on a server and node webkit
//and then send those to mistakeStop, and delete all the catchStop(function(){}) everywhere
//and have a set of demos that confirm you can throw all the different places there are in the code, and the handler catches every one

//promises look like the way to go
//now just figure out how to add to them, in your own little functions on top of q promises, the features you want, namely:
//duration, start and stop time
//resources that have to get closed
//timeouts, just try using q's timeouts
//progress, don't use q's progress, rather have granular events so progress is which one you're on
//status, figure out how to call text on the promise whenever you want and get text like "7 seconds since response from server"
//but build this all on top of q. don't do task and result. don't try to code your own system of promises. promisize node functions, or use q's prepromisized functions
//and for streams, be able to shake it all away easily to learn streams from the node up








//ok, now imagine you're calling these, and design a Task and Result that make calling these easy
//start out with behaviorGood0, it's the simplest


//the idea here is you don't know which behavior it's going to be, so design a wrapping that deals with all of them







//level 1: a function that has a callback that behaves in custom ways, like a platfomr function
//level 2: that wrapped into a q promise, like a q function
//level 3: your code that uses that in tests to test each behavior








//when you have a ui, you will be really interested to see the results of this speed test
//update a text field on the page
//when it changes, the core finds out, and updates it again
//how many ui updates can you do a second compared to how many loops of code, and other speed looops
//how fast does it look for the user, can you get the numbers to count up faster than the user can see, so fast it's a blur, fast enough it looks cool






/*
function read(name) {

	var d = Q.defer();
	required.fs.readFile("test/" + name, "utf-8", function(error, text) {
		if (error) {
			d.reject(error);
		} else {
			d.resolve(text);
		}
	});
	return d.promise;

}


if (demo("snippet")) { demoSnippet(); }
function demoSnippet() {

	log("mark start");


	var a, b, c;



	return read("a.txt")
	.then(function (valuea) {
		a = valuea;
		log("step 1:", a);

		return read("b.txt");
	}).then(function (valueb) {
		b = valueb;
		log("step 2: ", a, " ", b);

		return read("c.txt");
	}).then(function (valuec) {

		c = valuec;
		log(a, b, c);

		throw "custom";//throwing here works, it will go to fail below

	}).fail(function (error) {
		try {

			log("mark fail");
			log(error);

		} catch (e) { mistakeStop(e); }
	}).fin(function () {
		try {

			log("mark fin");

		} catch (e) { mistakeStop(e); }
	});


	log("mark bottom");

}
*/

/*
return getName().then(function (name) {
	return getUser(name).then(function (user) {
	})
});

return getName().then(function (name) {
	return getUser(name);
}).then(function (user) {
});
*/





//write a demo that opens a series of text files, printing their contents to console.log
//then, delete one of the text files on teh disk, and watch how the error flows
//the idea here is use Q instead of task and result, still use node filesystem, still use close




//prove you can code with primises by making the following stuff
//turn a callback into a promise
//do a chain of promises, opening one text file after another
//loop with promises, creating 200 files with text in them
//have one function perform two asynchronous steps, and a third also perform two, the second of which is calling the first







/*
//try these parts of q
//just a few useful functions from each
//-collections, (done)
//-basic q, turning callbacks into promises
//-q io on the filesystem


var q = require("q");
var qfs = require("q-io/fs");





function useQ() {

	log(q);


}


function copyFile() {

	var promise = qfs.copy("E:\\test\\source.txt", "E:\\test\\target.txt");
}

exports.useQ = useQ;
exports.copyFile = copyFile;
*/







/*
//example of synchronous code
if (demo("snippet")) { snippet(); }
function snippet() {


var outputPromise = getInputPromise().then(function done(input) {}, function fail(reason) {});

//then() returns a promise, outputPromise
//a function can only return a value, or throw an exception

//three things can happen
//if your handler returns a value, outputPromise gets fulfilled
//if your handler throws an exception, outputPromise gets rejected
//if your handler returns a promise, outputPromise becomes that promise

var error = getInputPromise().then(function done(input) {});//omit the error handler, and then() returns the error
var value = getInputPromise().then(null, function (error) {});//omit the fulfillment handler, and then() returns the success value

var value = getInputPromise().fail(function (error) {});//use fail() when you just want to pass the error handler

//the fin function is like the finally clause
//the function fin takes gets called when the getInputPromise promise returns a value or throws an error
//this is where you can close files, database connections, stop servers, conclude tests
var output = getInputPromise().fin(function () {/*close everything*/ /*});

//there are two ways to chain promises: inside handlers, and outside handlers
//these two examples are the same

/*
return getName().then(function (name) {//get the name
	return getUser(name).then(function (user) {//use the name to get the user
		//now we've got the user
	})
});

return getName().then(function (name) {//get the name
	return getUser(name);//use the name to get the user
}).then(function (user) {
	//now we've got the user
});




function authenticate() {
	return getName().then(function (name) {//get the name
		return getUser(name);//use the name to get the user
	})
	// chained because we will not need the name in the next event
	.then(function (user) {
		return getPass()
		// nested because we need both user and password next
		.then(function (pass) {
			if (user.passwordHash !== hash(pass)) {
				throw new Error("Can't authenticate");
			}
		});
	});
}

//bookmark "Combination"
//https://github.com/kriskowal/q/tree/v1#combination







}
*/





//the tutorial promised you'd learn
//how to write your own functions that return promises


//this is in the section "create a promise from scratch"











//larger things to change
//let close(a, b, c) take null, an object that can't be closed, and an object that can, so you can hand it anything
//see how many objects are using the old style, and maybe switch them all to o = {}, o.member, return o


/*
the big questions

what is the relationship/overlap/interaction between these things

	error answer callbacks, like in node:
	http://docs.nodejitsu.com/articles/getting-started/control-flow/what-are-callbacks

	futures, like with q:
	https://github.com/kriskowal/q

	streams, like in node:
	http://maxogden.com/node-streams.html

	async, like in the npm async module:
	https://www.npmjs.org/package/async

	keywords, like in iced coffeescript:
	http://maxtaco.github.io/coffee-script/

example mystery interaction, what are q "promise streams"?!: https://github.com/kriskowal/q-io
npm shows the async module is 5x more popular than q!
*/






//charm is part of log
//the function is stick(), takes an array of strings, or a string with newlines
//they stick to the bottom of the teletype, wiht log messages continuing to appear and scroll above
//so then you have stick and log



//remember, you can't choose an architecture here until later, when you've seen streams, so it's find to bring all 4 forward







/*
//all of those work
//ok, that's probably how you should do the first draft of this, then
//all you have to do is add your own cancel, progress, and custom timeout

https://github.com/kriskowal/q/wiki/API-Reference

>cancel
can't find how to do this
you should do it with close

ok, ending the chain is easy when you're in the chain, just throw and exception
but how does it work when you are outside of/above the chain, when you have the promise object and want to end it
essentially you need a way to mark it for conclusion, so the next time a step returns, it throws to get out

looking at it again, you pretty much already have it
task already has a cancel method, which fails the task, which calls sendResult, which fails the promise
so all you need to do is expose that through the promise, and you're good

>progress
done with notify, progress pushed upwards
you should do it in the other direction

>timeout
done with promise.timeout(ms)
you've already got it working wiht your own code underneath defer

//next steps
you've confirmed that the strategy of wrapping your task and result into a callback, and then putting a q promise on top of that, works
just tack the task on the promise object, and confirm you can add the features of cancel and progress this way
then, copy and refactor task and result for promises in method4, for instance, you don't need a result object that can contain an error or an answer, because promise code splits this into different handlers, but you still don't want the raw answer alone because you may want to see how long it took or other stats about how it was finished, so maybe you do want result to be the same as it is now
*/



//show the 10 behaviors with
//method1 plain callback, done
//method2 plain promise, done
//method3 callback with task and result, done
//method4 promise with customizations added on top, TODO

//1 time unit afterwards get progress, 2 units cancel, TODO
//do step1,2,3,4, where 3 fails, TODO

//extra features added by method2 and method4
//default 4 time unit timeout
//get progress status text whenver you want
//ability for the caller to cancel
//autoclose late returned resource from an unstoppable platform call that returns after timeout or cancel





/*
see how q does cancel, progress, and timeout
it looks like progress notifications get pushed to the caller, where you want that to work the other way around
how does cancel work
how does timeout work

actually, at this point, just add your features to q promises the easiest, dumbest way, and then get back to the 11 entry points to the posix file system
you can and probably will change the async system underneath later, and the beauty of all these tests, demos, and simulations is they actually let you do that
or, head over to a totally different part to work on, like charm, or the ui, or spray and stripe pattern or something

*/


//have a third example where you have f1() call step 1 and 2, and step 2 calls f2(), which includes steps 3 and 4, and step3 calls f3(), which has 5 and 6
//see how the different methods work when you call into a tree of steps
//the goal is to end up with a system that makes coding this as easy and natural as if it were all synchronous code


//you could hook these up to run as tests just by
//having a log function at the top which switches between loging to console and loging to test-readable string, which doesn't have date codes
//having a function that returns the number of objects currently on the pulse list









});
console.log("task test/");