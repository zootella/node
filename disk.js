
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
		type:function(){ return "File"; }
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
		platformFile.stat(p, f);
		var started = now();
	} catch (e) { f(e); }

	//you need a separate timer to call f yourself if it times out, and then if that happens, to prevent f from running later

	function f(e, r) {

		var info = {};
		info.request = { path: p };
		info.result = { error: e, details: r };
		info.duration = Duration(started);

		if (e && e.code == "ENOENT") { // Error no entry
			info.type = "available";

		} else if (e) { // Some other error
			info.type = "error";

		} else if (r.isDirectory()) { // Folder
			info.type = "folder";
			info.accessed = r.atime;
			info.modified = r.mtime;
			info.created = r.ctime;

		} else if (r.isFile()) { // File
			info.type = "file";
			info.size = r.size; // Size
			info.accessed = r.atime;
			info.modified = r.mtime;
			info.created = r.ctime;

		} else { // Something else like a link or something
			info.type = "other";
		}

		next(info);
	}
}
//delete
function pathDelete(p, next) {
	fs.unlink(path, callback)
}
//move
function pathMove(source, target, next) {
	fs.rename(oldPath, newPath, callback)
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














//before tasks, you're going to have to get streams going in here


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

//make sure you can deal with
//unicode paths
//avoid files already there
//illegal characters on the filesystem you happen to be on
//windows disk and network neighborhood paths
//paths longer than max path characters
//get present working directory
//see what kind of paths you get in node webkit running from disk and a network share
//node cant read or set the windows readonly attribute, does this prevent it from deleting a read only file, is there a solution other than a child process

//does it work with really big files, larger than a dword
//does it work with really long paths, longer than max path characters

//maybe don't throw exceptions at all, maybe exceptions dont work well with async, just catch them and keep them and read them as values

//bake util.inspect into log

//don't make this more complicated than you need it to be--all you need to do is make sure that functions only get passed absolute paths, you don't have to naviagate or add or substract paths, or compare paths, or change capitalization, and if you did, node's path library is there to help
//get node webkit going so you can run it from windows disk, windows share, and mac, and linux, and see what the current path looks like and portable paths, and see what kinds of paths you get from the file open dialog box
//don't use realpath, the cache means its slow, just go right to the actual thing you want to do with the path, like open it or create it or see if it's available or list it

//once path is done, that's where you could add in methods like up, down, so on, the path arithmatic offered by the node path module










