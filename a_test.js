
var Q = require("q");
require("./load").load("base", function() { return this; });

































/*
base materials
*/

//make sure simulate resource notices if we forget to close it

if (demo("close-remember")) { demoCloseRemember(); }//close it, and check passes
function demoCloseRemember() {

	var r = SimulateResource("remember");
	log(r.answer);
	r.close();

	closeCheck();
}

if (demo("close-forget")) { demoCloseForget(); }//forget to close it, and check notices
function demoCloseForget() {

	var r = SimulateResource("forget");
	log(r.answer);

	closeCheck();
}

















/*
method 1: node callback
request(parameters, callback) later calls callback(error, answer)
*/

//1 demonstrate using a callback that behaves each different possible way

if (demo("method1t"))  { demoMethod1("step1:t");  }//throw
if (demo("method1n"))  { demoMethod1("step1:n");  }//never
if (demo("method1dd")) { demoMethod1("step1:dd"); }//done direct
if (demo("method1di")) { demoMethod1("step1:di"); }//done instant
if (demo("method1df")) { demoMethod1("step1:df"); }//done fast
if (demo("method1ds")) { demoMethod1("step1:ds"); }//done slow
if (demo("method1fd")) { demoMethod1("step1:fd"); }//fail direct
if (demo("method1fi")) { demoMethod1("step1:fi"); }//fail instant
if (demo("method1ff")) { demoMethod1("step1:ff"); }//fail fast
if (demo("method1fs")) { demoMethod1("step1:fs"); }//fail slow

function demoMethod1(instructions) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait around 8 time units for everything to finish

	try {
		simulateMethod1(instructions, callback);
	} catch (e) {
		log("catch '#'".fill(e));
	}

	function callback(error, answer) {
		if (error) {
			log("fail '#'".fill(error));
			if (answer) answer.close();
		} else {
			log("done '#'".fill(answer));
			if (answer) answer.close();
		}
	}

	log("return");
}

/*
method 1 callback results

t:   [start, catch, return,       check closed]  needs improvement, catch should be fail, happen after return
n:   [start,        return,       check closed]  needs improvement, should notice taking forever
dd:  [start, done,  return,       check closed]  needs improvement, done should happen after return
di:  [start,        return, done, check closed]  works
df:  [start,        return, done, check closed]  works
ds:  [start,        return, done, check closed]  needs improvement, takes longer than default timeout
fd:  [start, fail,  return,       check closed]  needs improvement, fail should happen afer return
fi:  [start,        return, fail, check closed]  works
ff:  [start,        return, fail, check closed]  works
fs:  [start,        return, fail, check closed]  needs improvement, takes longer than default timeout

what works:
the resource always gets closed

what needs improvement:
start and return should always happen first and second, throw and good and bad call let this happen wrong
catch should be part of fail, not separate
there is no default timeout to notice that good and bad 6 take too long and never takes forever
there is no way to cancel the request after making it
there is no way to see the current progress of the request
*/







//sequence of method1 node-style calls looks like this

if (demo("method1m1")) { demoMethod1Multiple("step1:df,step2:df,step3:df,step4:df"); }
if (demo("method1m2")) { demoMethod1Multiple("step1:df,step2:df,step3:ff,step4:df"); }//step 3 fails
if (demo("method1m3")) { demoMethod1Multiple("step1:df,step2:t,step3:ff,step4:df"); }//step 2 throws

function demoMethod1Multiple(instructions) {
	log("start");
	setTimeout(function () { closeCheck(); }, 2*Time.second);//wait around for everything to finish

	var a1, a2, a3, a4;//vars to point to answer objects, or null before we get them

	f1();//call the first function to start the chain
	function f1() {
		try {
			simulateMethod1(instructions, f2);
		} catch (e) { log("catch '#'".fill(e)); close(a1, a2, a3, a4); }
	}
	function f2(error, answer) {
		try {
			if (error) {
				log("step1 fail '#'".fill(error));
				close(answer, a1, a2, a3, a4);
			} else {
				log("step1 done '#'".fill(answer));
				a1 = answer;
				simulateMethod1(answer.answer, f3);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3, a4); }
	}
	function f3(error, answer) {
		try {
			if (error) {
				log("step2 fail '#'".fill(error));
				close(answer, a1, a2, a3, a4);
			} else {
				log("step2 done '#'".fill(answer));
				a2 = answer;
				simulateMethod1(answer.answer, f4);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3, a4); }
	}
	function f4(error, answer) {
		try {
			if (error) {
				log("step3 fail '#'".fill(error));
				close(answer, a1, a2, a3, a4);
			} else {
				log("step3 done '#'".fill(answer));
				a3 = answer;
				simulateMethod1(answer.answer, f5);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3, a4); }
	}
	function f5(error, answer) {
		try {
			if (error) {
				log("step4 fail '#'".fill(error));
				close(answer, a1, a2, a3, a4);
			} else {
				log("step4 done '#'".fill(answer));
				a4 = answer;
				close(answer, a1, a2, a3, a4);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3, a4); }
	}

	log("return");
}





//switch instructions back to behavior
//pass in paremeters like
/*
simulateMethod1("df", callback)
demoMethod1Multiple("df", "df", "df", "df")

you don't need to pass name "step1" into simulateMethod at all

*/





























/*
method 2: q promise
callback wrapped into a q promise
*/

//2 wrap the callback into a simple q promise

if (demo("method2t"))  { demoMethod2("step1:t");  }//throw
if (demo("method2n"))  { demoMethod2("step1:n");  }//never
if (demo("method2dd")) { demoMethod2("step1:dd"); }//done direct
if (demo("method2di")) { demoMethod2("step1:di"); }//done instant
if (demo("method2df")) { demoMethod2("step1:df"); }//done fast
if (demo("method2ds")) { demoMethod2("step1:ds"); }//done slow
if (demo("method2fd")) { demoMethod2("step1:fd"); }//fail direct
if (demo("method2fi")) { demoMethod2("step1:fi"); }//fail instant
if (demo("method2ff")) { demoMethod2("step1:ff"); }//fail fast
if (demo("method2fs")) { demoMethod2("step1:fs"); }//fail slow

function demoMethod2(instructions) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait around 8 time units for everything to finish

	var promise = simulateMethod2(instructions)
	.then(function(answer) {
		log("done '#'".fill(answer));
		if (answer) answer.close();

	}).fail(function(error) {
		log("fail '#'".fill(error));

	});

	log("return");
}

/*
method 2 promise results

t:   [start, throw                         ]  needs improvement, uncaught exception
n:   [start, return,       check closed    ]  needs improvement, never notices taking forever
dd:  [start, return, done, check closed    ]  works, return before done even with direct call
di:  [start, return, done, check closed    ]  works
df:  [start, return, done, check closed    ]  works
ds:  [start, return, done, check closed    ]  needs improvement, takes too long
fd:  [start, return, fail, check not closed]  needs improvement, leaves resource open
fi:  [start, return, fail, check not closed]  needs improvement, leaves resource open
ff:  [start, return, fail, check not closed]  needs improvement, leaves resource open
fs:  [start, return, fail, check not closed]  needs improvement, leaves resource open

what works:
even when the function calls the callback directly, return happens before done or fail

what needs improvement:
if the function produces an error and answer resource, nothing closes the resource
nothing catches an exception before the callback, much less turns it into a promise failure
there is no default timeout to notice that good and bad 6 take too long and never takes forever
not sure how to cancel the promise
not sure how to see the current progress of the promise
*/























/*
method 3: customzied callback
simple node-style callback, customized with your task and response objects to add safety and features
*/

//3 add custom features to the callback using objects

if (demo("method3t"))  { demoMethod3("step1:t");  }//throw
if (demo("method3n"))  { demoMethod3("step1:n");  }//never
if (demo("method3dd")) { demoMethod3("step1:dd"); }//done direct
if (demo("method3di")) { demoMethod3("step1:di"); }//done instant
if (demo("method3df")) { demoMethod3("step1:df"); }//done fast
if (demo("method3ds")) { demoMethod3("step1:ds"); }//done slow
if (demo("method3fd")) { demoMethod3("step1:fd"); }//fail direct
if (demo("method3fi")) { demoMethod3("step1:fi"); }//fail instant
if (demo("method3ff")) { demoMethod3("step1:ff"); }//fail fast
if (demo("method3fs")) { demoMethod3("step1:fs"); }//fail slow

function demoMethod3(instructions) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait around 8 time units for everything to finish

	var task = simulateMethod3(instructions, next);
	function next(result) {
		log(result);
		if (result.isDone()) close(result.answer);//after using the answer, we would close it
	}

	//down here we could call methods on task to get progress or cancel it
	log("return");
}

/*
method 3 custom callback results

t:   [start, return, fail, check closed]  works
n:   [start, return, fail, check closed]  works
dd:  [start, return, done, check closed]  works
di:  [start, return, done, check closed]  works
df:  [start, return, done, check closed]  works
ds:  [start, return, fail, check closed]  works
fd:  [start, return, fail, check closed]  works
fi:  [start, return, fail, check closed]  works
ff:  [start, return, fail, check closed]  works
fs:  [start, return, fail, check closed]  works

what works:
these all work
*/

































/*
method 4: customized promise
callbacks wrapped into q promises, customized to add safety and features
*/

//4 add custom features to the promise using promises

if (demo("method4t"))  { demoMethod4("step1:t");  }//throw
if (demo("method4n"))  { demoMethod4("step1:n");  }//never
if (demo("method4dd")) { demoMethod4("step1:dd"); }//done direct
if (demo("method4di")) { demoMethod4("step1:di"); }//done instant
if (demo("method4df")) { demoMethod4("step1:df"); }//done fast
if (demo("method4ds")) { demoMethod4("step1:ds"); }//done slow
if (demo("method4fd")) { demoMethod4("step1:fd"); }//fail direct
if (demo("method4fi")) { demoMethod4("step1:fi"); }//fail instant
if (demo("method4ff")) { demoMethod4("step1:ff"); }//fail fast
if (demo("method4fs")) { demoMethod4("step1:fs"); }//fail slow

function demoMethod4(behavior) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait around 8 time units for everything to finish


	log("return");
}

/*
method 4 custom promise results

t:   [start, ]  
n:   [start, ]  
dd:  [start, ]  
di:  [start, ]  
df:  [start, ]  
ds:  [start, ]  
fd:  [start, ]  
fi:  [start, ]  
ff:  [start, ]  
fs:  [start, ]  

what works:

what needs improvement:

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











