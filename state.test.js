console.log("state test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO














//   ____                         ____                      _   _                      
//  |  _ \  ___ _ __ ___   ___   / ___| _ __   ___  ___  __| | | |    ___   ___  _ __  
//  | | | |/ _ \ '_ ` _ \ / _ \  \___ \| '_ \ / _ \/ _ \/ _` | | |   / _ \ / _ \| '_ \ 
//  | |_| |  __/ | | | | | (_) |  ___) | |_) |  __/  __/ (_| | | |__| (_) | (_) | |_) |
//  |____/ \___|_| |_| |_|\___/  |____/| .__/ \___|\___|\__,_| |_____\___/ \___/| .__/ 
//                                     |_|                                      |_|    

//example of synchronous code
expose.main("example", function() {

	function f() {//example synchronous code makes a guid
		log("a unique value: ", unique().base62());
	}

	f();//just call our synchronous function once
});

//example using that synchronous code with speedLoop
expose.main("example-loop", function() {

	function f() {//example synchronous code makes a guid
		var s = unique().base62();
	}

	speedLoop8("unique", f);//give our synchronous function to speed loop, which will call it over and over
});

//example of asynchronous code
expose.main("example-next", function() {

	function f() {//example asynchronous code looks at a file on the disk
		required.fs.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			log("exception '#', resolved path '#'".fill(e, resolvedPath));
		}
	}

	f();//just call our asynchronous function once
});

//example using that asynchronous code with speedLoopNext
expose.main("example-loop-next", function() {

	function f() {//example asynchronous code looks at a file on the disk
		required.fs.realpath("state.js", {}, next);
		function next(e, resolvedPath) {
			callWhenDone();
		}
	}

	var callWhenDone = speedLoopNext("look", f);//get the function we have to call when our code is done
	f();//call our asynchronous function once to get the whole thing started
});

//empty speedLoop to see maximum speed
expose.main("example-empty", function() {

	function f() {
	}

	speedLoop8("empty", f);
});

//empty speedLoopNext to see maximum speed
expose.main("example-empty-next", function() {

	function f() {
		callWhenDone();//ordinarily, f would call callWhenDone in a callback, but it's ok to call it directly too
	}

	var callWhenDone = speedLoopNext("empty", f);
	f();
});

//empty speedLoopForever to see average settle
expose.main("example-empty-forever", function() {

	function f() {
	}

	speedLoopForever("empty", f);
});














//   _____                               _   __  __ _     _        _        
//  |_   _|__  ___ ___    __ _ _ __   __| | |  \/  (_)___| |_ __ _| | _____ 
//    | |/ _ \/ __/ __|  / _` | '_ \ / _` | | |\/| | / __| __/ _` | |/ / _ \
//    | | (_) \__ \__ \ | (_| | | | | (_| | | |  | | \__ \ || (_| |   <  __/
//    |_|\___/|___/___/  \__,_|_| |_|\__,_| |_|  |_|_|___/\__\__,_|_|\_\___|
//                                                                          

//demos of basic use

//run code that throws an exception
expose.main("throw", function() {

	Data("hello").start(6);//throws chop
});

//catch an exception and sand it to mistakeLog(e)
expose.main("mistake-log", function() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeLog(e); }

	log("code after runs");
});

//catch an exception and sand it to mistakeStop(e)
expose.main("mistake-stop", function() {

	try {
		Data("hello").start(6);
	} catch (e) { mistakeStop(e); }

	log("code after does not run");
});

//code in a timeout function that throws an exception
//confirms that an uncaught exception in a timeout function ends the node process, even if there are more events that might work later
expose.main("timeout-throw", function() {
	log("setting timeouts for 2 and 4 seconds from now");

	wait(4000, function() {//in 4 seconds, this function will run successfully

		log("ran after 4 seconds");//never runs, the uncaught exception at 2 seconds ends the node process

	});

	wait(2000, function() {//in 2 seconds, this function will run and throw

		log("ran after 2 seconds");
		Data("hello").start(6);//throws chop

	});
});

//test of basic use

expose.test("state toss", function(ok, done) {

	try {
		toss();//blank ok
		ok(false);//this line doesn't run
	} catch (e) {}

	try {
		toss("custom");
		ok(false);
	} catch (e) { ok(e.name == "custom"); }//the name we expect

	done();
});

//demos of real exceptions with details

expose.main("path-1", function() {
	try {

		pathCheck(Path("C:\\name"), Path("C:\\name2"));

	} catch (e) { log(e); }
});

expose.main("path-2", function() {

	try { a(); } catch (e) { log(e); }
	function a() { b(); }
	function b() { c(); }
	function c() { Path("file.ext"); }
});

//demos and tests that catch or receive example exceptions

expose.main("mistake-1", function() { catchMistake(mistake1); });
expose.main("mistake-2", function() { catchMistake(mistake2); });
expose.main("mistake-3", function() { catchMistake(mistake3); });
expose.main("mistake-4", function() { catchMistake(mistake4); });
expose.main("mistake-5", function() { getMistake(mistake5);   });
expose.main("mistake-6", function() { getMistake(mistake6);   });
expose.main("mistake-7", function() { getMistake(mistake7);   });
expose.main("mistake-8", function() { catchMistake(mistake8); });
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
expose.test("state mistake 1", function(ok, done) {
	try {
		mistake1();
		ok(false);
	} catch (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "data");

		var s = say(e);//check text form
		ok(s.starts("data"));
		ok(s.has("mistake1()"));

		done();
	}
});

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
expose.test("state mistake 2", function(ok, done) {
	try {
		mistake2();
		ok(false);
	} catch (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "data");
		ok(e.note == "note about what happened");

		var s = say(e);//check text form
		ok(s.starts("data"));
		ok(s.has("mistake2()"));
		ok(s.has("a: apple"));
		ok(s.has("d: Text in a Data object"));

		done();
	}
});

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
expose.test("state mistake 3", function(ok, done) {
	try {
		mistake3();
		ok(false);
	} catch (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "data");

		var s = say(e);//check text form
		ok(s.starts("data"));
		ok(s.has("mistake3() a() b() c()"));

		done();
	}
});

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
expose.test("state mistake 4", function(ok, done) {
	try {
		mistake4();
		ok(false);
	} catch (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "data");

		ok(e.caught.name == "chop");//look at e.caught
		ok(isType(e.caught, "Mistake"));

		var s = say(e);//check text form
		ok(s.starts("data"));
		ok(s.has("caught chop"));
		ok(s.has("mistake4() start() _clip()"));

		done();
	}
});

//5. pass to f(e) a platform error, no program mistake at all, nothing thrown or caught
/*
{ [Error: ENOENT, open 'c:\node\notfound.ext']
  errno: -4058,
  code: 'ENOENT',
  path: 'c:\\node\\notfound.ext' }
*/
function mistake5(f) {
	required.fs.open("notfound.ext", "r", function(error, file) {
		if (error) f(error);
	});
}
expose.test("state mistake 5", function(ok, done) {
	mistake5(function (e) {

		ok(isType(e, "Error"));//look at e
		ok(e.errno == -2 || e.errno == -4058);//getting -2 on mac, -4058 on windows
		ok(e.code == "ENOENT");
		ok(e.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		ok(s.has("[Error: ENOENT"));
		ok(s.has("errno: -4058,"));
		ok(s.has("code: 'ENOENT',"));
		*/
		done();//mark the text done in the callback to make sure it gets called
	});
});

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
	required.fs.open("notfound.ext", "r", function(error, file) {
		if (error) {
			try {
				toss("data", {caught:error});
			} catch (e) { f(e); }
		}
	});
}
expose.test("state mistake 6", function(ok, done) {
	mistake6(function (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "data");

		ok(isType(e.caught, "Error"));//look at the caught and contained error
		ok(e.caught.errno == -2 || e.caught.errno == -4058);
		ok(e.caught.code == "ENOENT");
		ok(e.caught.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		ok(s.starts("data"));
		ok(s.has("caught { [Error: ENOENT"));
		ok(s.has("errno: -4058,"));
		ok(s.has("code: 'ENOENT',"));
		*/
		done();
	});
});

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
	required.fs.open(name, access, next);//try to open a file that doesn't exist

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
expose.test("state mistake 7", function(ok, done) {
	mistake7(function (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(e.name == "program");
		ok(e.note == "settings not available");

		ok(isType(e.caught, "Mistake"));//caught and kept inside
		ok(e.caught.name == "disk");
		ok(e.caught.note == "couldnt open file");
		ok(e.caught.watch.name == "notfound.ext");
		ok(e.caught.watch.access == "r");

		ok(isType(e.caught.caught, "Error"));//inside again
		ok(e.caught.caught.errno == -2 || e.caught.caught.errno == -4058);
		ok(e.caught.caught.code == "ENOENT");
		ok(e.caught.caught.path.ends("notfound.ext"));

		/*TODO
		var s = say(e);//check text form
		ok(s.starts("program"));
		ok(s.has("a() b() c() d() e() f()"));
		ok(s.has("settings not available"));

		ok(s.has("caught disk"));
		ok(s.has("couldnt open file"));
		ok(s.has("name: notfound.ext"));

		ok(s.has("caught { [Error: ENOENT"));
		ok(s.has("errno: -4058,"));
		ok(s.has("code: 'ENOENT',"));
		*/
		done();
	});
});

//8. a completely blank toss
/*
exception
catchMistake() mistake8() toss_test.js:237

*/
function mistake8() {
	toss();//not even a name
}
expose.test("state mistake 8", function(ok, done) {
	try {
		mistake8();
		ok(false);
	} catch (e) {

		ok(isType(e, "Mistake"));//look at e
		ok(!e.name);//no name, not even a blank name

		var s = say(e);//check text form
		ok(s.starts("exception"));//say labels it an exception when there is no name
		ok(s.has("mistake8()"));

		done();
	}
});
















//   ____  _           _   
//  / ___|| |__  _   _| |_ 
//  \___ \| '_ \| | | | __|
//   ___) | | | | |_| | |_ 
//  |____/|_| |_|\__,_|\__|
//                         

expose.test("state shutCount", function(ok, done) {

	ok(shutCount() == 0);
	var r = mustShut();
	ok(shutCount() == 1);
	shut(r);
	ok(shutCount() == 0);
	var r1 = mustShut();
	var r2 = mustShut();
	ok(shutCount() == 2);
	shut(r1, r2);
	ok(shutCount() == 0);

	done();
});

expose.test("state shut once", function(ok, done) {

	var r = mustShut();
	ok(!r.isShut());//not shut
	shut(r);
	ok(r.isShut());//shut
	shut(r);
	ok(r.isShut());//still shut

	var n = 0;
	r = mustShut(function() {
		n++;
	});
	ok(n == 0);
	shut(r);
	ok(n == 1);
	shut(r);
	ok(n == 1);//only ran once

	done();
});

//example object that needs to get shut
function Resource(name) {
	if (!name) name = "resource";
	var o = mustShut();//we have to remember to shut it
	o.pulse = function() { log("pulse " + name); }//the program will pulse it for us
	o.text = name;
	return o;
};

expose.test("state shut cycle", function(ok, done) {

	var r;
	ok(!r);//not made yet
	r = Resource();
	ok(!r.isShut());//new and open
	shut(r);
	ok(r.isShut());//shut
	r = null;
	ok(!r);//discarded

	done();		
});

expose.test("state shut separate", function(ok, done) {

	var r1 = Resource();//make two resources
	var r2 = Resource();
	ok(!r1.isShut());//both start out open
	ok(!r2.isShut());

	shut(r2);//shut one
	ok(!r1.isShut());//confirm this didn't change the first one

	shut(r1);//shut the other one
	ok(r1.isShut());//now they're both shut
	ok(r2.isShut());

	done();
});

expose.test("state shut several", function(ok, done) {

	var r1 = Resource();//make two resources
	var r2 = Resource();
	var r3 = Resource();
	shut(r3);//this one will be already shut
	var d = Data();//and lots of other stuff
	var s = "hello";
	var n = null;
	var u = undefined;
	shut(d, s, r1, r2, n, u);//shut will try to shut them all

	done();
});

//shut logs exceptions but keeps going
expose.main("shut-throw", function() {

	var r1 = mustShut(function() { log("closing r1, which will work");                      });
	var r2 = mustShut(function() { log("closing r2, which will throw"); undefined.notFound; });
	var r3 = mustShut(function() { log("closing r3, which will work");                      });
	shut(r1, r2, r3);

	shutCheck();
});
















//   ____        _          
//  |  _ \ _   _| |___  ___ 
//  | |_) | | | | / __|/ _ \
//  |  __/| |_| | \__ \  __/
//  |_|    \__,_|_|___/\___|
//                          

//an object getting pulsed
expose.main("pulse", function() {

	function ExamplePulse() {
		var o = mustShut();
		o.pulse = function() {
			log("pulse");
		}
		return o;
	};

	log("here we go");
	var u = ExamplePulse();
});

//code in a pulse function that throws an exception
//pulse will catch the exception so we don't need to catch it here
expose.main("pulse-throw", function() {

	function ExamplePulseThrow() {
		var o = mustShut();
		o.pulse = function() {
			Data("hello").start(6);//throws chop
		}
		return o;
	};

	var u = ExamplePulseThrow();//make a new object which will throw on the first pulse
});

//make an object that needs to be shut, and shut it
expose.main("shut", function() {

	var m = Resource();
	shut(m);
	shutCheck();
	//with no more code to run here, the process exits normally
});

//make an object that needs to be shut, and forget to shut it
expose.main("forget", function() {

	var m = Resource("forgotten resource");
	shutCheck();//forgot to shut it
});

//two objects that pulse and then shut after 2 and 4 seconds
//when both objects are shut, the process will exit
expose.main("pulse-two", function() {

	function Pulse1() {
		var o = mustShut(function() {
			log("shut 1");
		});
		o.pulse = function() {
			log("pulse 1");
			if (start.expired(2*Time.second)) shut(o);//shut this pulse1 object
		}
		return o;
	};

	function Pulse2() {
		var o = mustShut(function() {
			log("shut 2");
		});
		o.pulse = function() {
			log("pulse 2");
			if (start.expired(4*Time.second)) shut(o);
		}
		return o;
	};

	var start = now();//make a note of the start time

	var pulse1 = Pulse1();
	var pulse2 = Pulse2();
});



















//nodeunit persists values between different tests
//this example shows it in this file, but it also happens with global state in other files this file uses

var globalVariable;

expose.test("state persists 1", function(ok, done) {//runs first

	globalVariable = "value 1";//set the global variable
	ok(globalVariable == "value 1");
	done();
});

expose.test("state persists 2", function(ok, done) {//runs afterwards

	ok(globalVariable == "value 1");//it's still set to the value from the previous test
	done();
});
















//   _____                 _     ____                      _ 
//  | ____|_   _____ _ __ | |_  / ___| _ __   ___  ___  __| |
//  |  _| \ \ / / _ \ '_ \| __| \___ \| '_ \ / _ \/ _ \/ _` |
//  | |___ \ V /  __/ | | | |_   ___) | |_) |  __/  __/ (_| |
//  |_____| \_/ \___|_| |_|\__| |____/| .__/ \___|\___|\__,_|
//                                    |_|                    

//node events are synchronous
//this demo will log received before sent
//written both as a demo and a test
expose.main("event-order", function() {

	function f() {
		log("received");
	}

	var e = new required.events.EventEmitter();
	e.on("name", f);

	e.emit("name");
	log("sent");
});
expose.test("state event synchronous", function(ok, done) {

	var s = "";

	function f() {
		s += "received;";
	}

	var e = new required.events.EventEmitter();
	e.on("name", f);

	e.emit("name");//works less like an event, more like just calling f()
	s += "sent;";

	ok(s == "received;sent;");//not the order you would expect
	done();
});

//sending an event is just like calling a function
//a speed loop causes a stack overflow
//"RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
expose.main("loop-event", function() {

	function f() {
		log("logging this slows it down so it doesn't complain immediately");
		e.emit("name");
	}

	var e = new required.events.EventEmitter();
	e.on("name", f);
	e.emit("name");
});

//we can't speed loop process.nextTick either, because node notices and complains
//"(node) warning: Recursive process.nextTick detected. This will break in the next  version of node. Please use setImmediate for recursive deferral. RangeError: Maximum call stack size exceeded"
//having f and g call each other doesn't avoid this, either
expose.main("loop-tick", function() {

	function f() {
		process.nextTick(f);
	}

	f();
});

//see how fast node can notify itself asynchronously three different ways
expose.main("speed-timeout",   function() { demoSpeed("timeout");   });
expose.main("speed-immediate", function() { demoSpeed("immediate"); });
expose.main("speed-tick",      function() { demoSpeed("tick");      });
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
expose.main("speed-pulse", function() {

	function SpeedResource() {//a resource that finishes on the first pulse
		var o = mustShut();
		o.pulse = function() {
			end();//shut this resource on the first pulse
		}

		return o;
	};

	var r;
	function start() {
		r = SpeedResource();//make a resource
	}

	function end() {
		shut(r);//shut the resource
		callWhenDone();//have speedLoopNext record another cycle and maybe call start again
	}

	function allDone() {//speedLoopNext calls this once after the last cycle of the last second
		shutCheck();
	}

	var callWhenDone = speedLoopNext("pulse", start, allDone);
	start();
});










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
expose.test("state done() not good enough", function(ok, done) {
	var r = Resource("resource test done");
	test.done();
});
*/

//uncomment this test to see the right way to do it, done(test)
//done(test) will notice the unclosed resource, tell nodeunit the test failed, and exit the process
//nodeunit doesn't seem to respond to the failed test, but will complain that the process ended without a test being done
/*
expose.test("state use done(test) instead", function(ok, done) {
	var r = Resource("resource done test");
	done(test);
});
*/



//TODO rename done(test) to testDone(test)


































});
console.log("state test/");