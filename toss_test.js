
var platformEvent = require("events");
var platformFile = require("fs");

require("./load").load("state_test", function() { return this; });

//TODO write here, then move into state_test.js








//   _____                               _   __  __ _     _        _        
//  |_   _|__  ___ ___    __ _ _ __   __| | |  \/  (_)___| |_ __ _| | _____ 
//    | |/ _ \/ __/ __|  / _` | '_ \ / _` | | |\/| | / __| __/ _` | |/ / _ \
//    | | (_) \__ \__ \ | (_| | | | | (_| | | |  | | \__ \ || (_| |   <  __/
//    |_|\___/|___/___/  \__,_|_| |_|\__,_| |_|  |_|_|___/\__\__,_|_|\_\___|
//                                                                          






//examples of how exceptions behave

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

	setTimeout(function() {//in 4 seconds, this function will run successfully

		log("ran after 4 seconds");//never runs, the uncaught exception at 2 seconds ends the node process

	}, 4000);

	setTimeout(function() {//in 2 seconds, this function will run and throw

		log("ran after 2 seconds");
		Data("hello").start(6);//throws chop

	}, 2000);
}






//demos that catch or receive example exceptions

if (demo("mistake-1")) { catchMistake(mistake1); }
if (demo("mistake-2")) { catchMistake(mistake2); }
if (demo("mistake-3")) { catchMistake(mistake3); }
if (demo("mistake-4")) { catchMistake(mistake4); }
if (demo("mistake-5")) { getMistake(mistake5); }
if (demo("mistake-6")) { getMistake(mistake6); }
if (demo("mistake-7")) { getMistake(mistake7); }
function catchMistake(f) {//synchronous behavior
	try {
		f();//call the given function f
	} catch (e) { mistakeStop(e); }//and catch the exception e that it throws
}
function getMistake(f) {//asynchronous behavior
	f(function (e) { mistakeStop(e); });//call the given function f, giving it a function that will receive the exception e later
}

function mistake1() {//throw a simple mistake
	toss("data");
}

function mistake2() {//throw a detailed mistake, with all the bells and whistles
	var a = "apple";
	var b = "banana";
	var c = "carrot";
	var d = Data("Text in a Data object");
	toss("data", {note:"note about what happened", watch:{a:a, b:b, c:c, d:d}});
}

function mistake3() {//throw a deep mistake, with a long call stack of program functions
	function a() { b(); }
	function b() { c(); }
	function c() { toss("data"); }
	a();
}

function mistake4() {//throw a nested mistake, with a caught mistake inside
	try {
		Data("hello").start(6);//throws chop
	} catch (e) { toss("data", {caught:e}); }//catch chop, wrap it in a data exception, and throw that
}

function mistake5(f) {//pass to f(e) a platform error, no program mistake at all, nothing thrown
	platformFile.open("notfound.ext", "r", function(error, file) {
		if (error) f(error);
	});
}

function mistake6(f) {//pass to f(e) a platform error enclosed in a tossed and then caught mistake
	platformFile.open("notfound.ext", "r", function(error, file) {
		if (error) {
			try {
				toss("data", {caught:error});
			} catch (e) { f(e); }
		}
	});
}

function mistake7(done) {//a combination of everything fancy

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






//   _____             
//  |_   _|__  ___ ___ 
//    | |/ _ \/ __/ __|
//    | | (_) \__ \__ \
//    |_|\___/|___/___/
//                     

exports.testToss = function(test) {

	try {
		toss();
		test.fail();
	} catch (e) {}

	try {
		toss("custom");
		test.fail();
	} catch (e) { test.ok(e.name == "custom"); }

	try {
		toss("custom", {note:"a note about what happened"});
		test.fail();
	} catch (e) { test.ok(e.name == "custom"); }

	test.done();
}

if (demo("toss")) { demoToss(); }
function demoToss() {
	try {

		pathCheck(Path("C:\\name"), Path("C:\\name2"));//tosses because name2 is longer, and starts with name, but doesn't have a slash to actually be inside

	} catch (e) { log(e); }//see how much you get just from logging e, like name, note, watch, from, and stack
}
//TODO have toss inject e.text() to show name, note, watch, from, and stack





















//text has toss
//state has mistake
//you're writing new tests here in disk, but obviously put them in the right place afterwards










//Object.Data.o.get (e:\Desk\Dropbox\node\data.js:131:31)
//is turning, quite correctly, into just get() 131
//but that's not enough, so maybe include the filename at the end, get() data.js:131



/*
exports.testSayToss = function(test) {


	try {

		toss("data");
	} catch (e) { test.ok(e.name == "data"); }

	var d = base16("aabbccddeeff");
	try { d._clip(6, 1); test.fail(); } catch (e) { test.ok(e.name == "chop"); }//clipping 1 from the end is not



	done(test);
}
*/

/*
exports.testHasMethod = function(test) {

//	test.ok(hasMethod(Data(), "base62"));//there

/*
	fuzz(Data(), "base62", "function");

	var o = Data();
	var name = 

	log("square ", (o && typeof o[name] == result);
	log("dot    ", (o && typeof o.name == result);





	test.done();
}
*/



exports.testDataOut = function(test) {

	//buffer
	var d = base16("0d0a");


	test.done();
};






/*
exports.testSayToss = function(test) {

	var a = "apple";
	var b = "banana";
	var c = "carrot";
	var d;
	if (platform() == "windows") d = Path("D:\\downloads");
	else                         d = Path("/downloads");


	try {
		toss("data", {note:"situation explained", watch:{a:a, b:b, c:c, d:d}});
	} catch (e) { log(e); }

	test.done();
}
*/












if (demo("say-toss")) { demoSayToss(); }
function demoSayToss() {

	try { a(); } catch (e) { log(e); }
	function a() { b(); }
	function b() { c(); }
	function c() { Path("file.ext"); }
}





// Show the given raw call stack text, and what we can parse from it
function sayStack(stack) {
	var a = parseCallStack(stack);
	var s = "";
	s += line();
	s += line(stack);
	s += line();
	for (var i = 0; i < a.length; i++)
		s += line("here:'#' file:'#' line:'#' function:'#'".fill(a[i].here, a[i].file, a[i].line, a[i].functionName))
	return s;
}






//TODO
//test in node webkit, the our code means a path in pwd trick might not work
//pull the last function name from the call stack so you can write code like if (e.from == "pathCheck")
//get a common platform error like file not found to see what those look like
//later, the one line summary would be a cool part of an asynchronous call stack
//combine toss and mistake
//rename path's underscore functions to not have underscores, you're overusing underscore unnecessarily

//get the stack trace from the exception, keep stuff you get by default like file, line number, and ^ by line of code
//show the error to the user, like write a .txt file and shell execute it before exiting
//send the error in a packet to the programmer
//in describe exception, pull out the type and note, and have wrap at the end and then document that lower, or can you just loop through all the keys in the hash actually

//if it's just throw("data"), confirm that is just one line on the log, not even a newline, if you want it that way
//write tests, not just demos, because the summary form doesn't incldue paths that are specific to where we're running now

//try out and improve sayError, maybe use inspect




//here's how to make your error
/*
fs.open(path, flags, [mode], callback)#
Asynchronous file open. See open(2). flags can be:

'r' - Open file for reading. An exception occurs if the file does not exist.
*/




//an easy way to figure out what's going on with . and [] would be to install the other in each, and have it log when somethign comes in that works for the primary but not the secondary
//then maybe you can really understand it, write tests that demonstrate what you found out, and have a single safe consistant way for both
//yeah, that's worth doing





//ok, you moved mistake to state, but then data tests started failing, until you adjusted something in load
//you don't like this--write a little function near the top of text, have it use toss, call it from a demo in disk, and confirm that text functions can use toss
//because toss is called in exceptional circumstances, it would be bad if it didn't work reliably, because you might not find out until data arrives that causes a toss line to run, and only then would it not work, and you'd never know
//and then also, just move this whole section back to the top of text
//mistake stays, toss goes back to the top of text, mistake in state gets a little simpler, you can roll back the change you made to load, this is a great solution


//have mistakeLog(name, e), which calls Mistake, and then logs it



































//some more text and data

if (demo("more-data")) { demoData(); }
function demoData() {

	log("hi");

	log("hello".data().size());





}




















































