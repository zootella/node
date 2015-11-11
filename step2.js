
var Q = require("q");
require("./load").load("base", function() { return this; });
















//   ____                 
//  | __ )  __ _ ___  ___ 
//  |  _ \ / _` / __|/ _ \
//  | |_) | (_| \__ \  __/
//  |____/ \__,_|___/\___|
//                        

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










//   __  __      _   _               _   _ 
//  |  \/  | ___| |_| |__   ___   __| | / |
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | | |
//  | |  | |  __/ |_| | | | (_) | (_| | | |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_|
//                                         

/*
method 1: node callback
request(parameters, callback) later calls callback(error, answer)
*/

if (demo("method1t"))  { demoMethod1("t");  }//throw
if (demo("method1n"))  { demoMethod1("n");  }//never
if (demo("method1dd")) { demoMethod1("dd"); }//done direct
if (demo("method1di")) { demoMethod1("di"); }//done instant
if (demo("method1df")) { demoMethod1("df"); }//done fast
if (demo("method1ds")) { demoMethod1("ds"); }//done slow
if (demo("method1fd")) { demoMethod1("fd"); }//fail direct
if (demo("method1fi")) { demoMethod1("fi"); }//fail instant
if (demo("method1ff")) { demoMethod1("ff"); }//fail fast
if (demo("method1fs")) { demoMethod1("fs"); }//fail slow

function demoMethod1(behavior) {
	log("start");
	wait(SimulateTime.limit, function () { closeCheck(); });//wait for everything to finish

	try {
		simulateMethod1(behavior, callback);
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
method 1 results

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













//   __  __      _   _               _   ____  
//  |  \/  | ___| |_| |__   ___   __| | |___ \ 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` |   __) |
//  | |  | |  __/ |_| | | | (_) | (_| |  / __/ 
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |_____|
//                                             

/*
method 2: q promise
callback wrapped into a q promise
*/

if (demo("method2t"))  { demoMethod2("t");  }//throw
if (demo("method2n"))  { demoMethod2("n");  }//never
if (demo("method2dd")) { demoMethod2("dd"); }//done direct
if (demo("method2di")) { demoMethod2("di"); }//done instant
if (demo("method2df")) { demoMethod2("df"); }//done fast
if (demo("method2ds")) { demoMethod2("ds"); }//done slow
if (demo("method2fd")) { demoMethod2("fd"); }//fail direct
if (demo("method2fi")) { demoMethod2("fi"); }//fail instant
if (demo("method2ff")) { demoMethod2("ff"); }//fail fast
if (demo("method2fs")) { demoMethod2("fs"); }//fail slow

function demoMethod2(behavior) {
	log("start");
	wait(SimulateTime.limit, function () { closeCheck(); });//wait for everything to finish

	var promise = simulateMethod2(behavior)
	.then(function(answer) {
		log("done '#'".fill(answer));
		if (answer) answer.close();

	}).fail(function(error) {
		log("fail '#'".fill(error));

	});

	log("return");
	return promise;
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

















//   __  __      _   _               _   _____ 
//  |  \/  | ___| |_| |__   ___   __| | |___ / 
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` |   |_ \ 
//  | |  | |  __/ |_| | | | (_) | (_| |  ___) |
//  |_|  |_|\___|\__|_| |_|\___/ \__,_| |____/ 
//                                             

/*
method 3: customzied callback
simple node-style callback, customized with your task and response objects to add safety and features
*/

if (demo("method3t"))  { demoMethod3("t");  }//throw
if (demo("method3n"))  { demoMethod3("n");  }//never
if (demo("method3dd")) { demoMethod3("dd"); }//done direct
if (demo("method3di")) { demoMethod3("di"); }//done instant
if (demo("method3df")) { demoMethod3("df"); }//done fast
if (demo("method3ds")) { demoMethod3("ds"); }//done slow
if (demo("method3fd")) { demoMethod3("fd"); }//fail direct
if (demo("method3fi")) { demoMethod3("fi"); }//fail instant
if (demo("method3ff")) { demoMethod3("ff"); }//fail fast
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


















//   __  __      _   _               _   _  _   
//  |  \/  | ___| |_| |__   ___   __| | | || |  
//  | |\/| |/ _ \ __| '_ \ / _ \ / _` | | || |_ 
//  | |  | |  __/ |_| | | | (_) | (_| | |__   _|
//  |_|  |_|\___|\__|_| |_|\___/ \__,_|    |_|  
//                                              

/*
method 4: customized promise
callbacks wrapped into q promises, customized to add safety and features
*/

if (demo("method4t"))  { demoMethod4("t");  }
if (demo("method4n"))  { demoMethod4("n");  }
if (demo("method4dd")) { demoMethod4("dd"); }
if (demo("method4di")) { demoMethod4("di"); }
if (demo("method4df")) { demoMethod4("df"); }
if (demo("method4ds")) { demoMethod4("ds"); }
if (demo("method4fd")) { demoMethod4("fd"); }
if (demo("method4fi")) { demoMethod4("fi"); }
if (demo("method4ff")) { demoMethod4("ff"); }
if (demo("method4fs")) { demoMethod4("fs"); }

function demoMethod4(behavior) {
	log("start");
	wait(SimulateTime.limit, function () { closeCheck(); });//wait for everything to finish

	var promise = simulateMethod4(behavior)
	.then(function(answer) {
		log("done '#'".fill(answer));
		if (answer) answer.close();

	}).fail(function(error) {
		log("fail '#'".fill(error));

	}).fin(function() {
		log("fin");

	});

	log("return");
	return promise;
}

/*
method 4 custom promise results

t:   [start, return, fail, fin, check closed]  
n:   [start, return, fail, fin, check closed]  
dd:  [start, return, done, fin, check closed]  
di:  [start, return, done, fin, check closed]  
df:  [start, return, done, fin, check closed]  
ds:  [start, return, fail, fin, check closed]  
fd:  [start, return, fail, fin, check closed]  
fi:  [start, return, fail, fin, check closed]  
ff:  [start, return, fail, fin, check closed]  
fs:  [start, return, fail, fin, check closed]  

what works:

what needs improvement:

*/







































































































