
var platformFile = require("fs");

require("./load").load("disk_test", function() { return this; });

//at long last, you can open a file
//you can see what it's like to write functions that go from file to string and from string to file

//on mac, try some paths like this
//		l("/folder1", "folder2\\..\\file.ext", "/folder1/folder2\\..\\file.ext");
//and confirm you really get a file with a name that contains backslashes and dots, rather than navigation happening
//if navigation happens, then it's even more important to have the check in open that makes sure the path of the file that was opened is the same as the path you tried to open

//probably rename done(test) to testDone(test) so you can use done in the actual program








//thinking about next and result
//make it so that next can only get called once, if code tries to call it a second time, the call doesn't go through
//for instance, platformFile.stat throws, the top try block catches, next gets called with an error result
//later, node successfully finishes, and calls the callback somehow, your code somewhere stops this

//you might be able to combine next(resultWhatever(time into a single thing
//at the very top of the function, make a new local Monitor object that takes and wraps the given next function
//when you make it, it records the starting time
//then, whenever you want, synchronously or in callbacks, you can call methods on it like .fail(e) and .done(a)

//this smart Result object also looks at the time and times itself out if necessary
//maybe you can even give it a list of things to closeOnYes, .closeOnNo at the top, and then things close themselves

//this is a really interesting design










//   ____                 _ _   
//  |  _ \ ___  ___ _   _| | |_ 
//  | |_) / _ \/ __| | | | | __|
//  |  _ <  __/\__ \ |_| | | |_ 
//  |_| \_\___||___/\__,_|_|\__|
//                              











//given a Path
//type, like folder or file or available
function pathLook(path, next) {
	var m = Monitor(next);
	try {

		checkType(path, "Path");
		platformFile.stat(p.text, callback);

	} catch (e) { m.fail(e); }
	function callback(e, statistics) { // Error e, file statistics s
		if (isClosed(m)) return;

		var a = {};//answer object we'll put in the result
		a.statistics = statistics; // Save the complete statistics object from the platform

		if (e && e.code == "ENOENT") { // Error no entry
			a.type = "available";
			m.done(a);

		} else if (e) { // Some other error
			m.fail(e);

		} else if (s.isDirectory()) { // Folder
			a.type = "folder";
			a.accessed = s.atime;
			a.modified = s.mtime;
			a.created = s.ctime;
			m.done(a);

		} else if (s.isFile()) { // File
			a.type = "file";
			a.size = s.size; // Size
			a.accessed = s.atime;
			a.modified = s.mtime;
			a.created = s.ctime;
			m.done(a);

		} else { // Something else like a link or something

			a.type = "other";
			m.done(a);
		}
	}
}



function pathDelete(path, next) {
	var m = Monitor(next);
	try {

		//before
		checkType(path, "Path");
		platformFile.unlink(path.text, callback);
		//

	} catch (e) { m.fail(e); }
	function callback(e, statistics) { // Error e, file statistics s
		if (isClosed(m)) return;

		//after
		if (e) m.fail(e);
		else m.done();
		//
	}
}



//ok, to be really crazy, what you woudl do now is have two functions, before and after
//and then have monitor take next, before, after, and do the whole thing
//ok, here's why to not do that
//because in its current state, it's pretty clean but it still looks like node examples, which is good
//becuase you have the ability to easily access parameters in both before and after, and make local variables that both can get to, which is good






//rename Monitor m to Task task, if everything is a single letter, they all get to look the same
//the pair then is Task and Result


//next step
//write a demo Resource that uses the o method of objects, which is what you should probably standardize on everywhere, and closes itself using close(o), to confirm that you can


//the problem with isClosed(o) is, it should throw or whatever if o is bad, not just return false
//so maybe instead have callback() {
//if (task.state.isClosed()) return;
//and if that's useful, maybe makeState(o), which mixes in state, and isClosed, isOpen, close
//now that you're using o, there are more options


//confirm you can do something wrong in a callback, not catch it, and node will shut you down
//do an actual example, easiest is {}.notfound;
//demonstrate this in a demo for safe keeping, also


//yeah, instead of
/*
current design:

var o = {};
o.state = makeState();

new possible design:

var o = makeState();

gives you one that already has the state variables and methods
this is a lot more like a base class
*/


//have listState check that you added a close method





//this is a good test, uncomment and fix and use it
/*
exports.testResult = function(test) {

	var t = now();

	//timeout
	var r = Result(t, Mistake("timeout"), null);
	test.ok(r.isError());//binary outcome
	test.ok(!r.isDone());
	test.ok(r.e);//contained exception
	test.ok(r.e.name == "timeout");
	test.ok(!r.result);//no result
	try {
		r.get();//get throws
		test.fail();
	} catch (e) { test.ok(r.e.name == "timeout"); }

	//mistake
	r = Result(t, Mistake("data"), null);
	test.ok(r.isError());//binary outcome
	test.ok(!r.isDone());
	test.ok(r.e);//contained exception
	test.ok(r.e.name == "data");
	test.ok(!r.result);//no result
	try {
		r.get();//get throws
		test.fail();
	} catch (e) { test.ok(r.e.name == "data"); }

	//success with no details
	r = Result(t, null, null);
	test.ok(!r.isError());//binary outcome
	test.ok(r.isDone());
	test.ok(!r.e);//contained exception
	test.ok(!r.result);//result not required
	test.ok(!r.get());//get returns undefined, but doesn't throw

	//success with details
	r = Result(t, null, {color:"blue"});
	test.ok(!r.isError());//binary outcome
	test.ok(r.isDone());
	test.ok(!r.e);//contained exception
	test.ok(r.result);
	test.ok(r.result.color == "blue");
	test.ok(r.get().color == "blue");//get doesn't throw

	done(test);
}
*/




//yes, change state to be like this

//var o = mustClose();
//and o comes at you preloaded with _closed, isClosed, and so on

//don't have o.isOpen(), use !o.isClosed()

//write close(a, b, c), that's the only function
//don't have global functions isClosed, isOpen, use the method o.isClosed()

//done this way, you don't need listState anymore, mustClose adds it to the list right at the start, and the caller will put in the close method before pulse runs on that
//see what happens when you forget to add a close, you expect that the next pulse will just throw

//name wise, it's not called State anymore, it's called Close
//make that the magic word to avoid elsewhere, have all the premixed in members contain the word close
//rename already to alreadyClosed

//you don't need confirmOpen, but see where you were using it in the java code just in case

//equally acceptable ways to close o are
//close(o), using the a, b, c, that doesn't complain if you hand it anything
//o.close(), calling the method directly
//have close(a, b, c) be fine if a is null or undefined, but if it's a string, or an object that doesnt' have a close(), have it throw, because that's a coding error that should be noticed


//all of closed is this
/*

//preloaded
o._closed
o.isClosed()
o.alreadyClosed()

//required for you to add
o.close()

//optional for you to add
o.pulse()
o.pulseScreen()

*/
//that's pretty tight and simple

//names to say: close, pulse
//names to avoid: state, open, done



//start out with a test to make sure that double closure oh my god what does it mean works
//see if an outsider can call functions that can access a local variable in the innermost, and outer, function
//if so, this is an awesome way to make _closed private
//even see what happens if the outermost user has their own _closed variable, or doesnt' matter, really





function addCore() {
	var o = {};//the object we will fill and return

	var _color = "white";//local variable not attached to o
	o.getColor = function () { return _color; }
	o.setColor = function (c) { _color = c; }

	return o;
}

function addMore(o) {//the object we will add more to

	var _shape = "amorphous";//another local variable also not attached to o
	o.getShape = function () { return _shape; }
	o.setShape = function (s) { _shape = s; }
}

exports.testDoubleClosure = function(test) {//omg what does it mean

	var o = addCore();//make a new object that has color
	addMore(o);//add to it the ability to hold shape

	var p = addCore();//make another one to show they don't clash
	addMore(p);

	test.ok(o.getColor() == "white");//reading the defaults works
	test.ok(o.getShape() == "amorphous");

	o.setColor("blue");//and you can change them both
	o.setShape("triangle");
	test.ok(o.getColor() == "blue");
	test.ok(o.getShape() == "triangle");

	test.ok(o.getColor());
	test.ok(o.getShape());
	test.ok(!o._color);//the enclosed local variables are really private
	test.ok(!o._shape);

	test.ok(p.getColor() == "white");//none of that changed the second object
	test.ok(p.getShape() == "amorphous");
	p.setColor("red");
	p.setShape("circle");
	test.ok(p.getColor() == "red");//which can be changed independently
	test.ok(p.getShape() == "circle");
	test.ok(o.getColor() == "blue");//separate of the first one
	test.ok(o.getShape() == "triangle");

	done(test);
}





































