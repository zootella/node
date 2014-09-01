
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("disk", function() { return this; });













//   ____       _   _       ____  _     _    
//  |  _ \ __ _| |_| |__   |  _ \(_)___| | __
//  | |_) / _` | __| '_ \  | | | | / __| |/ /
//  |  __/ (_| | |_| | | | | |_| | \__ \   < 
//  |_|   \__,_|\__|_| |_| |____/|_|___/_|\_\
//                                           


//here's where you do the resolve that has next and looks at the disk actually


//don't use realpath
//the cache means its slow
//rather, just go right to the actual thing you want to do with the path, like open it or create it
//then, query the object node gives you back to see what the path became
//and if it changed at all, or in a bad way, close and throw

//have a demo that follows a symlink and detects it this way
//your demo probably can't make the symlink, so have a comment with instructions about how to do that










//   _____ _ _      
//  |  ___(_) | ___ 
//  | |_  | | |/ _ \
//  |  _| | | |  __/
//  |_|   |_|_|\___|
//                  



//at this level, everything is a single adjustment, no recursion to deal with trees

// OBJECTS



// PATH

// FILE

// An open file on the disk with access to its data
function File() {


	//when you open the file, see what path it has, sort of like fs.realpath
	//and if realpath != path, maybe close the file and throw data

	return {
		type:"File"
	};
}

exports.File = File;

// FUNCTIONS that get used as methods

//given a String
//make a path
function parsePath(s) {
	/*
	fs.realpath(path, cache, callback);
	path.resolve(p) === p;//true if p is absolute
	*/
}

//given a Path
//type, like folder or file or available
function pathLook(p, next) {
	try {

		checkType(p, "Path");
		var t = now();
		platformFile.stat(p.text, callback);

	} catch (e) { next(resultError(time, e)); }
	function callback(e, s) { // Error e, file statistics s

		var i = {};
		i.statistics = s; // Save the complete statistics object from the platform

		if (e && e.code == "ENOENT") { // Error no entry
			i.type = "available";
			next(resultDone(t, i));

		} else if (e) { // Some other error
			next(resultError(t, e));

		} else if (s.isDirectory()) { // Folder
			i.type = "folder";
			i.accessed = s.atime;
			i.modified = s.mtime;
			i.created = s.ctime;
			next(resultDone(t, i));

		} else if (s.isFile()) { // File
			i.type = "file";
			i.size = s.size; // Size
			i.accessed = s.atime;
			i.modified = s.mtime;
			i.created = s.ctime;
			next(resultDone(t, i));

		} else { // Something else like a link or something

			i.type = "other";
			next(resultDone(t, i));
		}
	}
}
//delete
function pathDelete(path, next) {
	fs.unlink(path.text, function (e) {
		if (e) next(e);
		else   next();
	});
}
//move
function pathMove(source, target, next) {
	fs.rename(oldPath, newPath, callback)


fs.rename('/tmp/hello', '/tmp/world', function (err) {
  if (err) throw err;
  fs.stat('/tmp/world', function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });
});




}
//open
function pathOpen(p, next) {
	fs.open(path, flags, mode, callback)
}

//given a File
//size
function fileSize(f, next) {
	fs.fstat(fd, callback)
}
//read
function fileRead(f, next) {
	fs.read(fd, buffer, offset, length, position, callback)
	fs.createReadStream(path, options)
}
//write
function fileWrite(f, next) {
	fs.write(fd, buffer, offset, length, position, callback)
	fs.createWriteStream(path, options)
}
//add stripe
function fileWroteStripe(f, stripe) {

}
//close
function fileClose(f, next) {
	fs.close(fd, callback)
}

//given a Path to a folder
//list
function folderList(p, next) {
	fs.readdir(path, callback)
}
//make a single folder
function folderMake(p, next) {
	fs.mkdir(path, mode, callback)
}
//delete
function folderDelete(p, next) {
	fs.rmdir(path, callback)
}



exports.pathLook = pathLook;














//before tasks, you're going to have to get streams going in here, which is great


//   _____         _    
//  |_   _|_ _ ___| | __
//    | |/ _` / __| |/ /
//    | | (_| \__ \   < 
//    |_|\__,_|___/_|\_\
//                      






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












//   ____                 _ _   
//  |  _ \ ___  ___ _   _| | |_ 
//  | |_) / _ \/ __| | | | | __|
//  |  _ <  __/\__ \ |_| | | |_ 
//  |_| \_\___||___/\__,_|_|\__|
//                              

/*
Use a Result to communicate how an asynchronous task ended

t  The time when the asynchronous task was started
e  An Error or Mistake that describes why the task didn't complete successfully, null if success
r  Information about the successful result of the task, can be null
*/

/*
function resultTimeout(t) { return Result(t, Mistake("timeout"), null); }
function resultError(t, e)  { return Result(t, e, null); }
function resultDone(t, r) { return Result(t, null, r); }
*/

function Monitor(next) {//monitor the completion of an asynchronous call

	var t = now();//t start time


	var o = {};

	o.state = makeState();//a resource has state, meaning
	o.state.close = function() {//we have to remember to close it
		if (o.state.already()) return;
	};
	o.state.pulse = function() {//and the program will pulse it for us
		if (t.expired(Time.timeout)) {
			close(o);
			next(Result(t, Mistake("timeout"), null));
		}
	}

	o.fail = function (e) {//e error
		if (isClosed(o)) return;
		close(o);
		next(Result(t, e, null));
	}

	o.done = function (a) {//a answer
		if (isClosed(o)) return;
		close(o);
		next(Result(t, null, a));
	}

	return listState(o);
};



function Result(t, e, a) {//time, error, answer
	var o = {};

	// Properties you can look at directly
	o.duration = Duration(t);
	o.e = e;//error
	o.a = a;//answer

	// See if this result is about a successful completion or an error
	o.isError = function () { return o.e ? true : false; }
	o.isDone = function () { return o.e ? false : true; }

	// Call result.get() to be returned the successful outcome, or thrown the error
	o.get = function () {
		if (o.e) throw e;
		else return o.a;
	}

	o.type = "Result";
	return freeze(o);
}

exports.Monitor = Monitor;
exports.Result = Result;






//you need a separate timer to call f yourself if it times out, and then if that happens, to prevent f from running later



















































