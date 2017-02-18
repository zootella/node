
var Q = require("q");
require("./load").library();







/*
goals

code as easily as if everything were synchronous, being able to:
-do sequential steps
-call subroutines and have them return to you
-throw and catch exceptions

easily deal with resources that you must remember to close, like an open file

have a default timeout of 4 seconds for individual disk and network tasks
be able to set it to forever for a task that asks the user a question

whenever you want:
-query an ongoing task to get its current status and progress information
-cancel an ongoing task to have it put things away instead of continuing and finishing
compose several small tasks into a single larger one, and have progress and cancel work

protect against functions that finish in a callback but misbehave, including:
-call the callback directly, instead of in a separate event
-never call the callback, just hang forever
-call the callback with both an error and a resource that needs to be closed

protect against race conditions related to resources that need to be closed, including:
-a task times out, or
-you cancel a task
and then finishes, returning a resource that needs to be closed

make the code even cleaner and easier with es6 yield and es7 await
*/











//notes and scraps


/*
timeout

to set a timeout on a promise, just do .timeout(time)
to cancel a promise, just call .reject() on it
try these with method 2
*/

/*
closer function

you're going to need a custom closer function
for instance, ask to open a file, it times out, then it finishes, custom closer function you passed in earlier knows what platform call to call to close what you got
*/

























if (demo("snip-step4"))  { demoSnip(); }
function demoSnip() {
	log("start");
	wait(6*Time.second, function () { closeCheck(); });//wait for everything to finish

	var promise = simulateMethod2("ds")//will finish in 5 seconds
	.then(function(answer) {
		log("done '#'".fill(answer));
		if (answer) answer.close();

	}).fail(function(error) {
		log("fail '#'".fill(error));

	});


	wait(4*Time.second, function () {//what you're trying to do here is, at 4 seconds, force cancel the promise yourself
		log(typeof promise.reject);
	});

	log("return");
	return promise;
}













//play around with method 3 with cancel and progress, and custom timeout

if (demo("method3fs")) { demoMethod3("fs"); }//fail slow

function demoMethod3(behavior) {
	log("start");
	wait(SimulateTime.limit, function () { closeCheck(); });//wait for everything to finish

	var task = simulateMethod3(behavior, next);
	function next(result) {
		log(result);
		if (result.isDone()) close(result.answer);//after using the answer, we would close it
	}

	//down here we could call methods on task to get progress or cancel it
	log("return");
}









//instead of using log, have it add to a global string, and then log that out
//this way, be able to run a whole set of them at once, instead of looking at them one at a time
//or have it add to an array, and then use table to print the array nicely
//yeah, this is a cool idea





//watch youtube videos on promises at the keyboard, and copy over examples as you go
//read through all the bluebird official documentation, writing examples and tests, and blog entries on that
//an early one to do is promises with seaquential steps, exceptions, subroutines, if, while, and recursion

















//see how slow this stuff is
//something that may take a really long time has to always be a callback
//something that will work reliably because it's all in memory, but takes 10-100ms, you might want to have synchronous and event options
//unless calling it a lot warms it up and then it starts going fast, then you can just use the synchronous option
//so, for instance, see how long it takes to generate 100 guids, and if it's more than 100ms, you should probably have an event option










