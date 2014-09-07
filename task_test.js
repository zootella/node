
require("./load").load("state_test", function() { return this; });

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

exports.testDoubleClosure = function(test) {//omg what does it mean

	var o = addCore();//make a new object that has color
	addMore(o);//add to it the ability to hold shape

	var p = addCore();//make another one to show they don't clash
	addMore(p);

	test.ok(o.getColor() == "white");//reading the defaults works
	test.ok(o.getShape() == "amorphous");

	o.setColor("blue");//and you can change them both
	o.setShape("triangle");
	test.ok(o.getColor() == "blue");
	test.ok(o.getShape() == "triangle");

	test.ok(o.getColor());
	test.ok(o.getShape());
	test.ok(!o._color);//the enclosed local variables are really private
	test.ok(!o._shape);

	test.ok(p.getColor() == "white");//none of that changed the second object
	test.ok(p.getShape() == "amorphous");
	p.setColor("red");
	p.setShape("circle");
	test.ok(p.getColor() == "red");//which can be changed independently
	test.ok(p.getShape() == "circle");
	test.ok(o.getColor() == "blue");//separate of the first one
	test.ok(o.getShape() == "triangle");

	done(test);
}

























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
//for instance, platformFile.stat throws, the top try block catches, next gets called with an error result
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





