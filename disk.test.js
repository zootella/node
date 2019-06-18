//console.log("disk test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO



//at long last, you can open a file
//you can see what it's like to write functions that go from file to string and from string to file

//on mac, try some paths like this
//		l("/folder1", "folder2\\..\\file.ext", "/folder1/folder2\\..\\file.ext");
//and confirm you really get a file with a name that contains backslashes and dots, rather than navigation happening
//if navigation happens, then it's even more important to have the check in open that makes sure the path of the file that was opened is the same as the path you tried to open
























//don't use realpath
//the cache means its slow
//rather, just go right to the actual thing you want to do with the path, like open it or create it
//then, query the object node gives you back to see what the path became
//and if it changed at all, or in a bad way, close and throw

//have a demo that follows a symlink and detects it this way
//your demo probably can't make the symlink, so have a comment with instructions about how to do that





//be careful on start, cancel, done below
//you open a file, stop caring probably because of timeout, the system opens it
//at that point you've likely tried to open it again, and that worked
//if code in the first request closes the file, could that close your handle from the second request

//it's your guess that none of the calls are cancellable
//rather, you start it, stop caring, and then ignore or deal with the answer when it arrives

//imagine you'r eopening a file on a hard drive that's warming up, the task fails in 4s, then 2s later, node gets the open file handle
//this would actually happen with your hard drive, even







//sources: if you have all the features, and deal with all the concerns of these libraries, your node disk library will be very complete
//posix man pages
//node docs
//java chan
//win32 backup.exe
//win32 lwire.dll

//in the api, but not used in this first pass
//truncate a file without opening it
//get and change permissions
//deal with symbolic links
//get and modify timestamps
//fsync flush to disk
//watch for changes on a file or directory




//write tests to show you can deal with:
//unicode paths with non english characters
//really big files, larger than a dword
//really long paths, longer than max path characters, win32 has the unicode path that starts with a bunch of slashes
//illegal characters on the filesystem you happen to be saving to, could be an ntfs disk mounted on a mac
//node cant read or set the windows readonly attribute, does this prevent it from deleting a read only file, is there a solution other than a child process


//things that might take a long time, and what to do about it
//wake up a sleeping usb hard drive, try again if the first 4s didn't work out
//write one byte several gigabytes out into a new file, read or write every 100mb or so so you can get progress on the way there to tell if its stuck and not autoquit at 4s
//get a directory listing for a folder that has thousands of files, get the files in groups of several hundred so you can get progress incrementally rather than it taking more than 4s and a lot of memory to bring in the whole list at once



//plan for illegal filenames
//replace known shortlist of illegal characters with unicode lookalikes
//then try it on the disk, if it doesn't work, go character by character, replacing illegal charcters wtih [0f] codes
//remember the user could have a windows ntfs drive mapped to a /path on their mac, so you have to try what works, rather than proving something will




//at this level, everything is a single adjustment, no recursion to deal with trees




// OBJECTS
// PATH
// FILE
// FUNCTIONS that get used as methods

//first bit to spec it all out
//figure out: Close, Task, Result
//make: File, fileOpen, fileClose



//when you open the file, see what path it has, sort of like fs.realpath
//and if realpath != path, maybe close the file and throw data














//use as a guide as you write the posix level 11




/*
function pathOpen(path, flags, mode, next) {
	try {

		var task = Task(next);
		if (getType(path) == "string") path = Path(path);
		checkType(path, "Path");
		required.fs.open(path.text, flags, mode, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(error, file) {
		if (task.isClosed()) {
			mistakeLog();//describe the cancelled task that finished, but don't close a descriptor
		} else {
			if (error) {
				task.fail(error);
			} else {
				task.done(file);
			}
		}
	}
}

function fileClose(descriptor, next) {
	try {

		var task = Task(next);
		required.fs.close(descriptor, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(error) {
		if (task.isClosed()) {
		} else if (error) {
			task.fail(error);
		} else {
			task.done();
		}
	}
}








function pathLook(path, next) {
	try {

		var task = Task(next);
		required.fs.stat(absolute(path).text, callback);
		return task;

	} catch (e) { task.fail(e); }//(parse)
	function callback(e, statistics) {
		if (task.isClosed()) {//(cancel)
		} else {

			var a = {};//answer object we'll put in the result
			a.statistics = statistics; // Save the complete statistics object from the platform

			if (e && e.code == "ENOENT") { // Error no entry
				a.type = "available";
				task.done(a);

			} else if (e) { // Some other error
				task.fail(e);

			} else if (s.isDirectory()) { // Folder
				a.type = "folder";
				a.accessed = s.atime;
				a.modified = s.mtime;
				a.created = s.ctime;
				task.done(a);

			} else if (s.isFile()) { // File
				a.type = "file";
				a.size = s.size; // Size
				a.accessed = s.atime;
				a.modified = s.mtime;
				a.created = s.ctime;
				task.done(a);

			} else { // Something else like a link or something

				a.type = "other";
				task.done(a);
			}
		}
	}
}

function pathDelete(path, next) {
	try {

		var task = Task(next);
		required.fs.unlink(absolute(path).text, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {
		if (isClosed(m)) return;
		if (e) task.fail(e);
		else task.done();
	}
}

function pathMove(source, target, next) {
	try {

		var task = Task(next);
		required.fs.rename(absolute(source).text, absolute(target).text, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {
		if (isClosed(m)) return;
		if (e) task.fail(e);
		else task.done();
	}
}

//open
function pathOpen(path, flags, mode, next) {
	try {

		var task = Task(next);
		required.fs.open(absolute(path).text, flags, mode, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {


	}
}



*/







































































/*


//no, it's fine, the reason the order seems wrong is because the exception is happening in the start
//have task call next on next tick or whatever so that even if node really does what you thought it was doing, the code will happen later like you expect

//you are going to have to catch exceptions both palces
function somethingLater() {
	try {

		//setup

	} catch (e) { task.fail(e); }
	function callback() {
		try {

			//callback

		} cach (e) { task.fail(e); }
	}
}
//also, you need to close stuff in a finally{}
//and, you need to not run the return function at all if the task times out or gets cancelled
//so, this probably should go one level more and be your own promise system

function somethingLater(done) {
	var o1, o2, o3;//undefined, or need to close
	var task = Task(done, [setup, good, bad, cleanup], [o1, o2, o3]);
	function setup() {
		platformSomething.commandAsync(task.callback);
	}
	function good(answer) {
	}
	function bad(error) {
	}
	function cleanup() {
		close(o1, o2, o3);
	}
}
//done is the function that will get called when everything's done
//task first calls setup, which makes the system call
//if it works, code in good runs
//if it fails, code in bad runs
//after either of those, code in cleanup runs
//then task calls done with a summary of what happened here

//task deals with exceptions thrown from setup, good, bad, and cleanup
//task makes sure that either good or bad is called, not both
//task makes sure that if the task is cancelled, neither good nor bad are called
//task makes sure that cleanup always gets called
//closure means they can all share local variables

//and then once you've got this going, you'll probably figure out how to chain them together like q promises can


*/



//the callback gets two arguments (err, resolvedPath)
//callback(error, answer)



//possible scenarios
//demonstrate these in open, like this
//also make a simulation resource object that demonstrates all 8 cases exactly

//1. throws before go (parse)
//ask to open the widgit
//there's a problem before the request to open even goes through, like invalid path
//no widget to close later on

//2. check progress (check)
//ask to open the widgit
//check the progress to see how long it's been taking
//leads to done, fail, or stuck

//3. never finishes (stuck)
//ask to open the widgit
//the platform never finishes, the callback is never called
//no widget to close later on

//4. simple success (done)
//ask to open the widgit
//a little while later, it opens successfully
//remember to close the widget

//5. simple failure (fail)
//ask to open the widgit
//a little while later, it fails with error
//no widget to close later on

//6. start, cancel, stuck (cancel stuck)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform never gets back to you
//no widget to close later on

//7. start, cancel, done (cancel done)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform completes the request successfully
//remember to close the widget

//8. start, cancel, fail (cancel fail)
//ask to open the widgit
//decide that you don't want to have opened the widgit anymore or it was taking too long
//platform encounters error
//no widget to close later on























//demos of the posix 11

expose.main("resolve", function() {

	resolve("E:\\test\\file.ext", next);

	function next(result) {

		log("made it to next");
	}


});







//yesterday, you learned how to turn a callback function into a promise
//and you learned how to chain multiple promises together to perform multiple steps, and catch exceptions at the end
//keep going, learning how to do the following things, which shouldn't be too hard
//add your own timeout, have the promise finish on timeout, and then close the too late resource if the inner promise finishes
//wrap raw resources in objects that have mustShut











/*
2018oct

ok, so js and node have unlimited size integers now, 9999999999999999999999999999999n
and all the fs functions can use them, if you hand them an options object that says you're game

but, why would you need to?
isn't the largest hard drive possibly for sale still many orders of magnitute smaller than olde fashioned max integer?

see if this is the case, and then use them normally, using int() backed by 9n just for math with the numbers you get from fs

*/













































});
//console.log("disk test/");