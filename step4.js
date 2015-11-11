
var Q = require("q");
require("./load").load("base", function() { return this; });







/*
goals

code as easily as if everything were synchronous, using:
-sequential steps
-call subroutines
-throw and catch exceptions

whenever you want:
-query an ongoing task to get its current status and progress information
-cancel an ongoing task to have it put things away instead of continuing and finishing

protect against functions that finish in a callback but misbehave, including:
-call the callback directly, instead of in a separate event
-never call the callback, just hang forever
-call the callback with both an error and a resource that needs to get closed

protect against race conditions related to resources that need to be closed, including:
-a task times out, or
-code cancels a task
and then finishes, returning a resource that needs to be closed

use es6 yield and/or es7 await to make the code even cleaner and easier
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

























if (demo("snip"))  { demoSnip(); }
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













