










































//ZEROITH: INLINE MUST CLOSE, AND SCREEN RESORUCE

//see if you can make minimal changes to the close and pulse system to enable these shortcuts
//if you can, then switch to these shortcuts
//later, you'll take another look at if the global close list should be separate from pulse, if you need pulse at all, and so on

//instead of
{
	var o = mustClose();
	o.close = function() {
		if (o.alreadyClosed()) return;
		//close stuff
	};
}
//couldn't it just be
{
	var o = mustClose(function() {
		//close stuff
	});
}

//and instead of
{
	function ScreenResource() {
		var o = mustClose();
		o.close = function() {
			if (o.alreadyClosed()) return;
			//contains nothing to close
		};
		o.pulseScreen = function() {
			//code that gets pulsed for the screen
		}
		return o;
	};
	var screen = ScreenResource();
}
//couldn't it just be
{
	var screen = mustCloseScreen(function() {
		//code that gets pulsed for the screen
	});
}

//new design for all three
{
	//1
	//something you can close, but don't have to
	//doesn't support pulse
	//doesn't add it to the list
	var o = canCloseBeta(function() {
		//close stuff
	});

	//2
	//standard current close with pulse and pulse screen
	//but the close function is required and defined as a parameter
	var o = mustCloseBeta(function() {
		//close stuff
	});
	o.pulse = function() {
		//pulse stuff
	}
	o.pulseScreen = function() {
		//pulse screen stuff
	}

	//3
	//shortcut when you just need to update the screen
	//there's nothing to close, so there's no close function
	var o = pulseScreenBeta(function() {
		//pulse screen stuff
	});
}

























































//FIRST: NEWLINES, LINES AND ARRAYS OF STRINGS

/*
ok, to be able to do this refactor well, you need the following text functions

s = line(s) takes s and puts a newline after it, specific to teh current platform, line() is just the newline
a = s.ripLines() returns an array of strings, separated by \r\n, \r, and \n, with settings to trim the start, end, blank lines in the middle
a = s.wrap(80) returns an array of 1 or more strings, wrapping the text to the number of characters, more features for not wrapping, keeping a hanging indent, including the arrow back character maybe, stuff like that

start out by writing stubs of these that do just the most basic thing
and have TODO to add the features and behavior later


here's how you do this
have a single line(s) and s.ripLines() that doesn't have options
then have functions that are meant to act on arrays of strings, which do things like
trim each string
remove starting and ending blanks
remove all blanks



now node can tell you the line separator of the platform, so that'll be easy to add
in your code, the way to get it is to just call line()
*/




















































//SECOND: LISTS OF OBJECTS

//make a [], add some {}, make sure you can remove the same one by object reference
//and then wait a moment, you made List so you wouldn't have to use [], but it's designed to use a comparison function
//maybe you can pass in "==" and "===" instead of a comparison function to get defaults that use those

//write tests that show {message="7"} and {message="7"} and {message=7} being the same and different with ==, ===, and a custom comparison function

//idea to have list.remove() or [].remove() and it returns the number of items it removed

//and don't go crazy with this, just do what close and FunctionList need
//sometimes it's an array of {}, sometimes functions, see if you can combine those and the references are all still unique, and that's ok
//test it not just with object references, but also function references









































//THIRD: LIST OF LISTENERS

//really, you need a standard way to add and remove listeners
//and a standard listener list
//and the individual connections are all mustClose
//this would be really powerful and probably just a few lines of code
//ok, thinking about that now

function Listener(list, f) {
	var o = mustClose(function() {
		//remove o from list, here's where you need object equality and to test all that
	});
	o._f = f;
	return o;
}

function ListenerList() {
	var o;

	o.add(f) {

	}



	return o;
}

//make a listener list
var list = ListenerList();
//add a listener to it
var listener = list.add(f);//returns a Listener object which you must close
//tell everybody on the list something happened
list.send(message);//calls each f.message()
//user is done with it, closes the listener, which removes it from the list
close(listener);//removes the listener from the list


















































//FOURTH: PARENT AND CHILD POST OFFICE

//use as P

//send a message down to every C below
function sendToForks(message) {
	if (isFork()) toss("state");

}

//receive a message from a C below
function listenForMessageFromFork(f) {
	if (isFork()) toss("state");

}

//use as C

//send a message up to P above
function sendToParent(message) {
	if (!isFork()) toss("state");

}

//receive a message from P above
function listenForMessageFromParent(f) {
	if (!isFork()) toss("state");


		process.on("message", function(m) {


}


































//FIFTH: KEYBOARD SUBSCRIBE


















































//SIXTH: LIST PROCESSES WITH BLUEBIRD

//don't wait for your own custom awesome flow step system
//just start using bluebird directly everywhere
//this lets you get around the async roadblock
//and lets you learn async so you can write flow step later on

function listProcesses(name) {//given a name like "node"
	//TODO
	/*
	have fork use this to detect and avoid an infinite loop of making processes that would wreck the computer
	do this once you've got promises going, as this is asynchronous
	wrap execFile and exec to detect error and throw an exception that has bufferError, or return success and include bufferOut
	use promises so that even though it splits on windows or not windows, after that, code comes together
	some users will just want the number, others will want the list itself
	beyond that, this works on mac and windows xp
	*/

	if (platform() == "windows") {
		platformChildProcess.execFile("tasklist.exe", function(error, bufferOut, bufferError) {
//		log("error:        " + say(error));
			_report(_filter(bufferOut));
//		log("buffer error: " + Data(bufferError).quote());
		});
	} else {
		platformChildProcess.exec("ps | grep node", function(error, bufferOut, bufferError) {
//		log("error:        " + say(error));
			_report(_filter(bufferOut));
//		log("buffer error: " + Data(bufferError).quote());
		});
	}

	function _filter(b) {
		var a = (b+"").ripLines(true, true);
		var n = [];
		for (var i = 0; i < a.length; i++) {
			if (a[i].has(name) && !a[i].has("grep")) n.add(a[i]);
		}
		return n;
	}
	function _report(n) {
		var s = line(items(n.length, name));
		for (var i = 0; i < n.length; i++) s += line(n[i]);
		log(s);
	}
}

/*
TODO
wrap with promises
-exec
-execFile
-spawn
-fork
and then, make your own fork that checks listProcesses first to protect against an infinite loop of process generation
*/







































