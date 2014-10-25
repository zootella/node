
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
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait for everything to finish

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

if (demo("method100t"))  { demoMethod1Multiple("df","t", "df"); }
if (demo("method100n"))  { demoMethod1Multiple("df","n", "df"); }
if (demo("method100dd")) { demoMethod1Multiple("df","dd","df"); }
if (demo("method100di")) { demoMethod1Multiple("df","di","df"); }
if (demo("method100df")) { demoMethod1Multiple("df","df","df"); }
if (demo("method100ds")) { demoMethod1Multiple("df","ds","df"); }
if (demo("method100fd")) { demoMethod1Multiple("df","fd","df"); }
if (demo("method100fi")) { demoMethod1Multiple("df","fi","df"); }
if (demo("method100ff")) { demoMethod1Multiple("df","ff","df"); }
if (demo("method100fs")) { demoMethod1Multiple("df","fs","df"); }

function demoMethod1Multiple(behavior1, behavior2, behavior3) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.multiple);//wait for everything to finish

	var a1, a2, a3;//vars to point to answer objects, or null before we get them

	f0();//call the first function to start the chain
	function f0() {
		try {
			simulateMethod1(behavior1, f1);
		} catch (e) { log("catch '#'".fill(e)); close(a1, a2, a3); }
	}
	function f1(error, answer) {
		try {
			if (error) {
				log("step1fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step1done '#'".fill(answer));
				a1 = answer;
				simulateMethod1(behavior2, f2);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}
	function f2(error, answer) {
		try {
			if (error) {
				log("step2fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step2done '#'".fill(answer));
				a2 = answer;
				simulateMethod1(behavior3, f3);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}
	function f3(error, answer) {
		try {
			if (error) {
				log("step3fail '#'".fill(error));
				close(answer, a1, a2, a3);
			} else {
				log("step3done '#'".fill(answer));
				a3 = answer;
				close(answer, a1, a2, a3);
			}
		} catch (e) { log("catch '#'".fill(e)); close(answer, a1, a2, a3); }
	}

	log("return");
}

/*
method 1 multiple results

t:   [start, return, step1done, catch,                check closed    ]
n:   [start, return, step1done,                       check not closed]
dd:  [start, return, step1done, step2done, step3done, check closed    ]
di:  [start, return, step1done, step2done, step3done, check closed    ]
df:  [start, return, step1done, step2done, step3done, check closed    ]
ds:  [start, return, step1done, step2done, step3done, check closed    ]
fd:  [start, return, step1done, step2fail,            check closed    ]
fi:  [start, return, step1done, step2fail,            check closed    ]
ff:  [start, return, step1done, step2fail,            check closed    ]
fs:  [start, return, step1done, step2fail,            check closed    ]
*/






























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
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait for everything to finish

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

if (demo("method200t"))  { demoMethod2Multiple("df","t", "df"); }
if (demo("method200n"))  { demoMethod2Multiple("df","n", "df"); }
if (demo("method200dd")) { demoMethod2Multiple("df","dd","df"); }
if (demo("method200di")) { demoMethod2Multiple("df","di","df"); }
if (demo("method200df")) { demoMethod2Multiple("df","df","df"); }
if (demo("method200ds")) { demoMethod2Multiple("df","ds","df"); }
if (demo("method200fd")) { demoMethod2Multiple("df","fd","df"); }
if (demo("method200fi")) { demoMethod2Multiple("df","fi","df"); }
if (demo("method200ff")) { demoMethod2Multiple("df","ff","df"); }
if (demo("method200fs")) { demoMethod2Multiple("df","fs","df"); }

function demoMethod2Multiple(behavior1, behavior2, behavior3) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.multiple);//wait for everything to finish

	var a1, a2, a3;//vars to point to answer objects, or null before we get them

	var promise = simulateMethod2(behavior1)
	.then(function (answer) {
		log("step1done '#'".fill(answer));
		a1 = answer;

		return simulateMethod2(behavior2);
	}).then(function (answer) {
		log("step2done '#'".fill(answer));
		a2 = answer;

		return simulateMethod2(behavior3);
	}).then(function (answer) {
		log("step3done '#'".fill(answer));
		a3 = answer;

	}).fail(function (answer) {
		log("fail '#'".fill(answer));

	}).fin(function () {
		log("fin");
		close(a1, a2, a3);

	});

	log("return");
	return promise;
}

/*
method 2 multiple results

t:   [start, return, step1done, fail,                 fin, check closed    ]
n:   [start, return, step1done,                            check not closed]
dd:  [start, return, step1done, step2done, step3done, fin, check closed    ]
di:  [start, return, step1done, step2done, step3done, fin, check closed    ]
df:  [start, return, step1done, step2done, step3done, fin, check closed    ]
ds:  [start, return, step1done, step2done, step3done, fin, check closed    ]
fd:  [start, return, step1done, fail,                 fin, check not closed]
fi:  [start, return, step1done, fail,                 fin, check not closed]
ff:  [start, return, step1done, fail,                 fin, check not closed]
fs:  [start, return, step1done, fail,                 fin, check not closed]

what needs improvement:
if a callback takes forever, fin never gets called, none of the functions do, actually
if a callback returns an error and a resource, there isn't a way to get and close the resource
*/























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
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait for everything to finish

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








//play around with method 3 with cancel and progress, and custom timeout

if (demo("method3fs")) { demoMethod3("fs"); }//fail slow

function demoMethod3(behavior) {
	log("start");
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait for everything to finish

	var task = simulateMethod3(behavior, next);
	function next(result) {
		log(result);
		if (result.isDone()) close(result.answer);//after using the answer, we would close it
	}

	//down here we could call methods on task to get progress or cancel it
	log("return");
}











































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
	setTimeout(function () { closeCheck(); }, SimulateTime.limit);//wait for everything to finish

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































































