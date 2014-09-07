
var platformFile = require("fs");

require("./load").load("disk_test", function() { return this; });

//at long last, you can open a file
//you can see what it's like to write functions that go from file to string and from string to file

//on mac, try some paths like this
//		l("/folder1", "folder2\\..\\file.ext", "/folder1/folder2\\..\\file.ext");
//and confirm you really get a file with a name that contains backslashes and dots, rather than navigation happening
//if navigation happens, then it's even more important to have the check in open that makes sure the path of the file that was opened is the same as the path you tried to open
















function pathOpen(path, flags, mode, next) {
	try {

		var task = Task(next);
		if (getType(path) == "string") path = Path(path);
		checkType(path, "Path");
		platformFile.open(path.text, flags, mode, callback);
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
		platformFile.close(descriptor, callback);
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








//    ___  _     _           _   
//   / _ \| |__ (_) ___  ___| |_ 
//  | | | | '_ \| |/ _ \/ __| __|
//  | |_| | |_) | |  __/ (__| |_ 
//   \___/|_.__// |\___|\___|\__|
//            |__/               

// Objects



//   ____       _   _     
//  |  _ \ __ _| |_| |__  
//  | |_) / _` | __| '_ \ 
//  |  __/ (_| | |_| | | |
//  |_|   \__,_|\__|_| |_|
//                        

// Functions that take a path



//   _____ _ _      
//  |  ___(_) | ___ 
//  | |_  | | |/ _ \
//  |  _| | | |  __/
//  |_|   |_|_|\___|
//                  

// Functions that take a file






