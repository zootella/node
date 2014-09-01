
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

























