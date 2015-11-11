
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
*/



//here's what you do next right now
//get log() and stick() working with charm, make a sample that just counts up time and takes keystrokes to reset and exit
//you already have task.cancel(), make task.text() that says how long we've been waiting for each step, have step A take 5 seconds, B 2 seconds, C 4 seconds in a demo














/*
to set a timeout on a promise, just do .timeout(time)
to cancel a promise, just call .reject() on it
try these with method 2



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







/*
method 5: customized promise
refactored customizations underneath q promises, with extra objects added
*/






//youre going to need a custom closer function
//for instance, ask to open a file, it times out, then it finishes, custom closer function you passed in earlier knows what platform call to call to close what you got







if (demo("snippet")) { demoSnippet(); }
function demoSnippet() {

	transformer(platform1, "a");
	transformer(platform2, "a", "b");
	transformer(platform3, "a", "b", "c");
}





function transformer() {//arguments like transformer(f, p1, p2, p3), no callback

	var f = arguments[0];

	var a = [];
	for (var i = 1; i < arguments.length; i++) a.push(arguments[i]);
	a.push(callback);

	f.apply(this, a);

	function callback(result) {
		log(result);
	}
}





function platform1(p1, callback) {
	callback("1: " + p1);
}

function platform2(p1, p2, callback) {
	callback("2: " + p1 + p2);
}

function platform3(p1, p2, p3, callback) {
	callback("3: " + p1 + p2 + p3);
}













//name your promise library improvements 'step' because it's like step 1, step 2, etc








