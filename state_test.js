
var platformEvent = require("events");
var platformFile = require("fs");

require("./load").library();















//   ____                         ____                      _   _                      
//  |  _ \  ___ _ __ ___   ___   / ___| _ __   ___  ___  __| | | |    ___   ___  _ __  
//  | | | |/ _ \ '_ ` _ \ / _ \  \___ \| '_ \ / _ \/ _ \/ _` | | |   / _ \ / _ \| '_ \ 
//  | |_| |  __/ | | | | | (_) |  ___) | |_) |  __/  __/ (_| | | |__| (_) | (_) | |_) |
//  |____/ \___|_| |_| |_|\___/  |____/| .__/ \___|\___|\__,_| |_____\___/ \___/| .__/ 
//                                     |_|                                      |_|    

//example of synchronous code
if (demo("example")) { example(); }
function example() {

	function f() {//example synchronous code makes a guid
		log("a unique value: ", unique().base62());
	}

	f();//just call our synchronous function once
}

//example using that synchronous code with speedLoop
if (demo("example-loop")) { exampleLoop(); }
function exampleLoop() {

	function f() {//example synchronous code makes a guid
		var s = unique().base62();
	}

	speedLoop8("unique", f);//give our synchronous function to speed loop, which will call it over and over
}

//example of asynchronous code
if (demo("example-next")) { exampleNext(); }
function exampleNext() {

	function f() {//example asynchronous code looks at a file on the disk
		platformFile.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			log("exception '#', resolved path '#'".fill(e, resolvedPath));
		}
	}

	f();//just call our asynchronous function once
}

//example using that asynchronous code with speedLoopNext
if (demo("example-loop-next")) { exampleLoopNext(); }
function exampleLoopNext() {

	function f() {//example asynchronous code looks at a file on the disk
		platformFile.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			callWhenDone();
		}
	}

	var callWhenDone = speedLoopNext("look", f);//get the function we have to call when our code is done
	f();//call our asynchronous function once to get the whole thing started
}

//empty speedLoop to see maximum speed
if (demo("example-empty")) { exampleEmpty(); }
function exampleEmpty() {

	function f() {
	}

	speedLoop8("empty", f);
}

//empty speedLoopNext to see maximum speed
if (demo("example-empty-next")) { exampleEmptyNext(); }
function exampleEmptyNext() {

	function f() {
		callWhenDone();//ordinarily, f would call callWhenDone in a callback, but it's ok to call it directly too
	}

	var callWhenDone = speedLoopNext("empty", f);
	f();
}

//empty speedLoopForever to see average settle
if (demo("example-empty-forever")) { exampleEmptyForever(); }
function exampleEmptyForever() {

	function f() {
	}

	speedLoopForever("empty", f);
}














//   _____                               _   __  __ _     _        _        
//  |_   _|__  ___ ___    __ _ _ __   __| | |  \/  (_)___| |_ __ _| | _____ 
//    | |/ _ \/ __/ __|  / _` | '_ \ / _` | | |\/| | / __| __/ _` | |/ / _ \
//    | | (_) \__ \__ \ | (_| | | | | (_| | | |  | | \__ \ || (_| |   <  __/
//    |_|\___/|___/___/  \__,_|_| |_|\__,_| |_|  |_|_|___/\__\__,_|_|\_\___|
//                                                                          

//demos of basic use

//run code that throws an exception
if (demo("throw")) { demoThrow(); }
function demoThrow() {

	Data("hello").start(6);//throws chop
}

//catch an exception and sand it to mistakeLog(e)
if (demo("mistake-log")) { demoMistakeLog(); }
function demoMistakeLog() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }

	log("code after runs");
}

//catch an exception and sand it to mistakeStop(e)
if (demo("mistake-stop")) { demoMistakeStop(); }
function demoMistakeStop() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }

	log("code after does not run");
}

//code in a timeout function that throws an exception
//confirms that an uncaught exception in a timeout function ends the node process, even if there are more events that might work later
if (demo("timeout-throw")) { demoTimeoutThrow(); }
function demoTimeoutThrow() {
	log("setting timeouts for 2 and 4 seconds from now");

	wait(4000, function() {//in 4 seconds, this function will run successfully

		log("ran after 4 seconds");//never runs, the uncaught exception at 2 seconds ends the node process

	});

	wait(2000, function() {//in 2 seconds, this function will run and throw

		log("ran after 2 seconds");
		Data("hello").start(6);//throws chop

	});
}

//test of basic use

exports.testToss = function(test) {

	try {
		toss();//blank ok
		test.fail();//this line doesn't run
	} catch (e) {}

	try {
		toss("custom");
		test.fail();
	} catch (e) { test.ok(e.name == "custom"); }//the name we expect

	done(test);
}

//demos of real exceptions with details

if (demo("path-1")) { demoPath1(); }
function demoPath1() {
	try {

		pathCheck(Path("C:\\name"), Path("C:\\name2"));

	} catch (e) { log(e); }
}

if (demo("path-2")) { demoPath2(); }
function demoPath2() {

	try { a(); } catch (e) { log(e); }
	function a() { b(); }
	function b() { c(); }
	function c() { Path("file.ext"); }
}

//demos and tests that catch or receive example exceptions

if (demo("mistake-1")) { catchMistake(mistake1); }
if (demo("mistake-2")) { catchMistake(mistake2); }
if (demo("mistake-3")) { catchMistake(mistake3); }
if (demo("mistake-4")) { catchMistake(mistake4); }
if (demo("mistake-5")) { getMistake(mistake5); }
if (demo("mistake-6")) { getMistake(mistake6); }
if (demo("mistake-7")) { getMistake(mistake7); }
if (demo("mistake-8")) { catchMistake(mistake8); }
function catchMistake(f) {//synchronous behavior
	try {
		f();//call the given function f
	} catch (e) { mistakeStop(e); }//and catch the exception e that it throws
}
function getMistake(f) {//asynchronous behavior
	f(function (e) { mistakeStop(e); });//call the given function f, giving it a function that will receive the exception e later
}

//1. throw a simple mistake
/*
data
catchMistake() mistake1() toss_test.js:164

*/
function mistake1() {
	toss("data");
}
exports.testMistake1 = function(test) {
	try {
		mistake1();
		test.fail();
	} catch (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "data");

		var s = say(e);//check text form
		test.ok(s.starts("data"));
		test.ok(s.has("mistake1()"));

		done(test);
	}
}

//2. throw a detailed mistake, with all the bells and whistles
/*
data
catchMistake() mistake2() toss_test.js:172
note about what happened
a: apple
b: banana
c: carrot
d: Text in a Data object

*/
function mistake2() {
	var a = "apple";
	var b = "banana";
	var c = "carrot";
	var d = Data("Text in a Data object");
	toss("data", {note:"note about what happened", watch:{a:a, b:b, c:c, d:d}});
}
exports.testMistake2 = function(test) {
	try {
		mistake2();
		test.fail();
	} catch (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "data");
		test.ok(e.note == "note about what happened");

		var s = say(e);//check text form
		test.ok(s.starts("data"));
		test.ok(s.has("mistake2()"));
		test.ok(s.has("a: apple"));
		test.ok(s.has("d: Text in a Data object"));

		done(test);
	}
}

//3. throw a deep mistake, with a long call stack of program functions
/*
data
catchMistake() mistake3() a() b() c() toss_test.js:178

*/
function mistake3() {
	function a() { b(); }
	function b() { c(); }
	function c() { toss("data"); }
	a();
}
exports.testMistake3 = function(test) {
	try {
		mistake3();
		test.fail();
	} catch (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "data");

		var s = say(e);//check text form
		test.ok(s.starts("data"));
		test.ok(s.has("mistake3() a() b() c()"));

		done(test);
	}
}

//4. throw a nested mistake, with a caught mistake inside
/*
data
catchMistake() mistake4() toss_test.js:185

caught chop
catchMistake() mistake4() start() _clip() data.js:125

*/
function mistake4() {
	try {
		Data("hello").start(6);//throws chop
	} catch (e) { toss("data", {caught:e}); }//catch chop, wrap it in a data exception, and throw that
}
exports.testMistake4 = function(test) {
	try {
		mistake4();
		test.fail();
	} catch (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "data");

		test.ok(e.caught.name == "chop");//look at e.caught
		test.ok(isType(e.caught, "Mistake"));

		var s = say(e);//check text form
		test.ok(s.starts("data"));
		test.ok(s.has("caught chop"));
		test.ok(s.has("mistake4() start() _clip()"));

		done(test);
	}
}

//5. pass to f(e) a platform error, no program mistake at all, nothing thrown or caught
/*
{ [Error: ENOENT, open 'c:\node\notfound.ext']
  errno: -4058,
  code: 'ENOENT',
  path: 'c:\\node\\notfound.ext' }
*/
function mistake5(f) {
	platformFile.open("notfound.ext", "r", function(error, file) {
		if (error) f(error);
	});
}
exports.testMistake5 = function(test) {
	mistake5(function (e) {

		test.ok(isType(e, "Error"));//look at e
		test.ok(e.errno == -2 || e.errno == -4058);//getting -2 on mac, -4058 on windows
		test.ok(e.code == "ENOENT");
		test.ok(e.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		test.ok(s.has("[Error: ENOENT"));
		test.ok(s.has("errno: -4058,"));
		test.ok(s.has("code: 'ENOENT',"));
		*/
		done(test);//mark the text done in the callback to make sure it gets called
	});
}

//6. pass to f(e) a platform error enclosed in a tossed and then caught mistake
/*
data
toss_test.js:198

caught { [Error: ENOENT, open 'c:\node\notfound.ext']
  errno: -4058,
  code: 'ENOENT',
  path: 'c:\\node\\notfound.ext' }
*/
function mistake6(f) {
	platformFile.open("notfound.ext", "r", function(error, file) {
		if (error) {
			try {
				toss("data", {caught:error});
			} catch (e) { f(e); }
		}
	});
}
exports.testMistake6 = function(test) {
	mistake6(function (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "data");

		test.ok(isType(e.caught, "Error"));//look at the caught and contained error
		test.ok(e.caught.errno == -2 || e.caught.errno == -4058);
		test.ok(e.caught.code == "ENOENT");
		test.ok(e.caught.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		test.ok(s.starts("data"));
		test.ok(s.has("caught { [Error: ENOENT"));
		test.ok(s.has("errno: -4058,"));
		test.ok(s.has("code: 'ENOENT',"));
		*/
		done(test);
	});
}

//7. a combination of everything fancy
/*
program
next() a() b() c() d() e() f() toss_test.js:228
settings not available

caught disk
next() a() b() c() toss_test.js:219
couldnt open file
name: notfound.ext
access: r

caught { [Error: ENOENT, open 'c:\node\notfound.ext']
  errno: -4058,
  code: 'ENOENT',
  path: 'c:\\node\\notfound.ext' }
*/
function mistake7(done) {

	var name   = "notfound.ext";
	var access = "r";
	platformFile.open(name, access, next);//try to open a file that doesn't exist

	function next(e1, file) {//in a new event, the platform gives us e1 here
		if (e1) a(e1);
	}

	function a(e1) { b(e1); }//build up a call stack
	function b(e1) { c(e1); }
	function c(e1) {
		try {

			toss("disk", {note:"couldnt open file", watch:{name:name, access:access}, caught:e1});//wrap and toss

		} catch (e2) {//catch
			try {

				d(e2);
				function d(e2) { e(e2); }
				function e(e2) { f(e2); }
				function f(e2) {
					toss("program", {note:"settings not available", caught:e2});//wrap and toss again
				}

			} catch (e3) { done(e3); }//catch and pass out
		}
	}
}
exports.testMistake7 = function(test) {
	mistake7(function (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(e.name == "program");
		test.ok(e.note == "settings not available");

		test.ok(isType(e.caught, "Mistake"));//caught and kept inside
		test.ok(e.caught.name == "disk");
		test.ok(e.caught.note == "couldnt open file");
		test.ok(e.caught.watch.name == "notfound.ext");
		test.ok(e.caught.watch.access == "r");

		test.ok(isType(e.caught.caught, "Error"));//inside again
		test.ok(e.caught.caught.errno == -2 || e.caught.caught.errno == -4058);
		test.ok(e.caught.caught.code == "ENOENT");
		test.ok(e.caught.caught.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		test.ok(s.starts("program"));
		test.ok(s.has("a() b() c() d() e() f()"));
		test.ok(s.has("settings not available"));

		test.ok(s.has("caught disk"));
		test.ok(s.has("couldnt open file"));
		test.ok(s.has("name: notfound.ext"));

		test.ok(s.has("caught { [Error: ENOENT"));
		test.ok(s.has("errno: -4058,"));
		test.ok(s.has("code: 'ENOENT',"));
		*/
		done(test);
	});
}

//8. a completely blank toss
/*
exception
catchMistake() mistake8() toss_test.js:237

*/
function mistake8() {
	toss();//not even a name
}
exports.testMistake8 = function(test) {
	try {
		mistake8();
		test.fail();
	} catch (e) {

		test.ok(isType(e, "Mistake"));//look at e
		test.ok(!e.name);//no name, not even a blank name

		var s = say(e);//check text form
		test.ok(s.starts("exception"));//say labels it an exception when there is no name
		test.ok(s.has("mistake8()"));

		done(test);
	}
}
















//    ____ _                
//   / ___| | ___  ___  ___ 
//  | |   | |/ _ \/ __|/ _ \
//  | |___| | (_) \__ \  __/
//   \____|_|\___/|___/\___|
//                          

exports.testCloseCount = function(test) {

	test.ok(closeCount() == 0);
	var r = mustClose();
	test.ok(closeCount() == 1);
	close(r);
	test.ok(closeCount() == 0);
	var r1 = mustClose();
	var r2 = mustClose();
	test.ok(closeCount() == 2);
	close(r1, r2);
	test.ok(closeCount() == 0);

	done(test);
}

exports.testCloseOnce = function(test) {

	var r = mustClose();
	test.ok(!r.isClosed());//not closed
	close(r);
	test.ok(r.isClosed());//closed
	close(r);
	test.ok(r.isClosed());//still closed

	var closed = 0;
	r = mustClose(function() {
		closed++;
	});
	test.ok(closed == 0);
	close(r);
	test.ok(closed == 1);
	close(r);
	test.ok(closed == 1);//only ran once

	done(test);
}

//example object that needs to get closed
function Resource(name) {
	if (!name) name = "resource";
	var o = mustClose();//we have to remember to close it
	o.pulse = function() { log("pulse " + name); }//the program will pulse it for us
	o.text = name;
	return o;
};

exports.testCloseCycle = function(test) {

	var r;
	test.ok(!r);//not made yet
	r = Resource();
	test.ok(!r.isClosed());//new and open
	close(r);
	test.ok(r.isClosed());//closed
	r = null;
	test.ok(!r);//discarded

	done(test);		
}

exports.testCloseSeparate = function(test) {

	var r1 = Resource();//make two resources
	var r2 = Resource();
	test.ok(!r1.isClosed());//both start out open
	test.ok(!r2.isClosed());

	close(r2);//close one
	test.ok(!r1.isClosed());//confirm this didn't change the first one

	close(r1);//close the other one
	test.ok(r1.isClosed());//now they're both closed
	test.ok(r2.isClosed());

	done(test);
}

exports.testCloseSeveral = function(test) {

	var r1 = Resource();//make two resources
	var r2 = Resource();
	var r3 = Resource();
	close(r3);//this one will be already closed
	var d = Data();//and lots of other stuff
	var s = "hello";
	var n = null;
	var u = undefined;
	close(d, s, r1, r2, n, u);//close will try to close them all

	done(test);
}

//close logs exceptions but keeps going
if (demo("close-throw")) { demoCloseThrow(); }
function demoCloseThrow() {

	var r1 = mustClose(function() { log("closing r1, which will work");                      });
	var r2 = mustClose(function() { log("closing r2, which will throw"); undefined.notFound; });
	var r3 = mustClose(function() { log("closing r3, which will work");                      });
	close(r1, r2, r3);

	closeCheck();
}
















//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

//an object getting pulsed
if (demo("pulse")) { demoPulse(); }
function demoPulse() {

	function ExamplePulse() {
		var o = mustClose();
		o.pulse = function() {
			log("pulse");
		}
		return o;
	};

	log("here we go");
	var u = ExamplePulse();
}

//code in a pulse function that throws an exception
//pulse will catch the exception so we don't need to catch it here
if (demo("pulse-throw")) { demoPulseThrow(); }
function demoPulseThrow() {

	function ExamplePulseThrow() {
		var o = mustClose();
		o.pulse = function() {
			Data("hello").start(6);//throws chop
		}
		return o;
	};

	var u = ExamplePulseThrow();//make a new object which will throw on the first pulse
}

//make an object that needs to be closed, and close it
if (demo("close")) { demoClose(); }
function demoClose() {

	var m = Resource();
	close(m);
	closeCheck();
	//with no more code to run here, the process exits normally
}

//make an object that needs to be closed, and forget to close it
if (demo("forget")) { demoForget(); }
function demoForget() {

	var m = Resource("forgotten resource");
	closeCheck();//forgot to close it
}

//two objects that pulse and then close after 2 and 4 seconds
//when both objects are closed, the process will exit
if (demo("pulse-two")) { demoPulseTwo(); }
function demoPulseTwo() {

	function Pulse1() {
		var o = mustClose(function() {
			log("closed 1");
		});
		o.pulse = function() {
			log("pulse 1");
			if (start.expired(2*Time.second)) close(o);//close this pulse1 object
		}
		return o;
	};

	function Pulse2() {
		var o = mustClose(function() {
			log("closed 2");
		});
		o.pulse = function() {
			log("pulse 2");
			if (start.expired(4*Time.second)) close(o);
		}
		return o;
	};

	var start = now();//make a note of the start time

	var pulse1 = Pulse1();
	var pulse2 = Pulse2();
}



















//nodeunit persists values between different tests
//this example shows it in this file, but it also happens with global state in other files this file uses

var globalVariable;

exports.testPersists1 = function(test) {//runs first

	globalVariable = "value 1";//set the global variable
	test.ok(globalVariable == "value 1");
	done(test);
}

exports.testPersists2 = function(test) {//runs afterwards

	test.ok(globalVariable == "value 1");//it's still set to the value from the previous test
	done(test);
}
















//   _____                 _     ____                      _ 
//  | ____|_   _____ _ __ | |_  / ___| _ __   ___  ___  __| |
//  |  _| \ \ / / _ \ '_ \| __| \___ \| '_ \ / _ \/ _ \/ _` |
//  | |___ \ V /  __/ | | | |_   ___) | |_) |  __/  __/ (_| |
//  |_____| \_/ \___|_| |_|\__| |____/| .__/ \___|\___|\__,_|
//                                    |_|                    

//node events are synchronous
//this demo will log received before sent
//written both as a demo and a test
if (demo("event-order")) { demoEventOrder(); }
function demoEventOrder() {

	function f() {
		log("received");
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);

	e.emit("name");
	log("sent");
}
exports.testEventSynchronous = function(test) {

	var s = "";

	function f() {
		s += "received;";
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);

	e.emit("name");//works less like an event, more like just calling f()
	s += "sent;";

	test.ok(s == "received;sent;");//not the order you would expect
	test.done();
}

//sending an event is just like calling a function
//a speed loop causes a stack overflow
//"RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
if (demo("loop-event")) { demoLoopEvent(); }
function demoLoopEvent() {

	function f() {
		log("logging this slows it down so it doesn't complain immediately");
		e.emit("name");
	}

	var e = new platformEvent.EventEmitter();
	e.on("name", f);
	e.emit("name");
}

//we can't speed loop process.nextTick either, because node notices and complains
//"(node) warning: Recursive process.nextTick detected. This will break in the next  version of node. Please use setImmediate for recursive deferral. RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
if (demo("loop-tick")) { demoLoopTick(); }
function demoLoopTick() {

	function f() {
		process.nextTick(f);
	}

	f();
}

//see how fast node can notify itself asynchronously three different ways
if (demo("speed-timeout"))   { demoSpeed("timeout"); }
if (demo("speed-immediate")) { demoSpeed("immediate"); }
if (demo("speed-tick"))      { demoSpeed("tick"); }
function demoSpeed(method) {

	var l = 0;         //number of second long loops we've completed
	var t = Date.now();//time the current loop started
	var n = 0;         //events we've counted in the current loop
	start();

	function start() {
		if      (method == "timeout")   setTimeout(end, 0);   //~64 timeouts/s
		else if (method == "immediate") setImmediate(end);    //~480k immediates/s
		else if (method == "tick")      process.nextTick(end);//node warning and error
	}

	function end() {
		if (t + 1000 < Date.now()) {
			log(items(n, method), "/second");
			l++;
			if (l < 8) {
				t = Date.now();
				n = 0;
				start();
			}
		} else {
			n++;
			start();
		}
	}
}

//now let's use the pulse system
//~16k pulses/s, not as fast as immediate by itself, but plenty fast
if (demo("speed-pulse")) { demoSpeedPulse(); }
function demoSpeedPulse() {

	function SpeedResource() {//a resource that finishes on the first pulse
		var o = mustClose();
		o.pulse = function() {
			end();//close this resource on the first pulse
		}

		return o;
	};

	var r;
	function start() {
		r = SpeedResource();//make a resource
	}

	function end() {
		close(r);//close the resource
		callWhenDone();//have speedLoopNext record another cycle and maybe call start again
	}

	function allDone() {//speedLoopNext calls this once after the last cycle of the last second
		closeCheck();
	}

	var callWhenDone = speedLoopNext("pulse", start, allDone);
	start();
}










//   _____         _     ____                   
//  |_   _|__  ___| |_  |  _ \  ___  _ __   ___ 
//    | |/ _ \/ __| __| | | | |/ _ \| '_ \ / _ \
//    | |  __/\__ \ |_  | |_| | (_) | | | |  __/
//    |_|\___||___/\__| |____/ \___/|_| |_|\___|
//                                              

//keep these two at the end of the file so no code afterwards calls test(done)

//uncomment this test to see why test.done() doesn't work
//test.done() won't notice the unclosed resource
//all the tests will pass, but the process will stay open, and the resource will keep pulsing
/*
exports.testDoneNotGoodEnough = function(test) {
	var r = Resource("resource test done");
	test.done();
}
*/

//uncomment this test to see the right way to do it, done(test)
//done(test) will notice the unclosed resource, tell nodeunit the test failed, and exit the process
//nodeunit doesn't seem to respond to the failed test, but will complain that the process ended without a test being done
/*
exports.testUseDoneTestInstead = function(test) {
	var r = Resource("resource done test");
	done(test);
}
*/



//TODO rename done(test) to testDone(test)



































