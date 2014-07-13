
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("disk", function() { return this; });
/*
var requireText = require("./text");
var toss = requireText.toss;
var hasMethod = requireText.hasMethod;
var getType = requireText.getType;
var isType = requireText.isType;
var checkType = requireText.checkType;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
*/




//   _____            _                                      _   
//  | ____|_ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | |___| | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ 
//  |_____|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__|
//                                                               


// The operating system platform we're running on, "windows", "mac", or "unix"
function platform() {
	var s = process.platform; // "darwin", "freebsd", "linux", "sunos" or "win32"
	if      (s == "darwin")   return "mac";     // Darwin contains win, irony
	else if (s.starts("win")) return "windows"; // Works in case s is "win64"
	else                      return "unix";
}

// The path to the present working directory our process was started with
function working() {
	try {
		return Path(process.cwd());
	} catch (e) { toss("platform", {caught:e}); } // Not a data exception because the platform should have been able to give us text that we can correctly parse into a Path object
}

exports.platform = platform;
exports.working = working;

//TODO change to throw error("platform", e);, and have isError(e, "name") that works with both just throw "data" and the fancerier objects
//yes, you finally figured out how you want to do exception objects here











//   ____       _   _     
//  |  _ \ __ _| |_| |__  
//  | |_) / _` | __| '_ \ 
//  |  __/ (_| | |_| | | |
//  |_|   \__,_|\__|_| |_|
//                        



//at this level, everything is a single adjustment, no recursion to deal with trees

// OBJECTS



// PATH

// An absolute file system path that looks right for the kind of computer we're running on
// Give this an absolute path and it will confirm that it looks right, give it a relative path, and it will throw data
// Calling this doesn't use the disk
function Path(s) {

	checkType(s, "string");   // Make sure s is a string
	s = _pathPrepare(s);      // Have only system, drive and share roots end with a slash
	var r = _pathResolve(s);  // Resolve s to an absolute path
	if (r != s) toss("data"); // If s changed, it was a relative path
	var p = r;

	var platform;
	if      (p.starts("\\\\")) platform = "network"; // Like \\computer\share\folder
	else if (p.starts("/"))    platform = "unix";    // Like /folder
	else if (p.get(1) == ":")  platform = "windows"; // Like C:\folder
	else toss("data");

	var up = _pathFolder(p);
	if (up == p) up = null; // This is a drive, share, or the filesystem root
	else up = Path(up); // Recursive call makes paths of containing folders

	return Object.freeze({
		platform:platform,
		up:up, // The path to the folder that contains this one, or null if this is the path of the filesystem root, or a drive or network share root

		name_ext:_pathNameDotExt(p), // "file.ext"
		name:_pathName(p),           // "file"
		_ext:_pathDotExt(p),         // ".ext"
		ext:_pathExt(p),             // "ext"

		text:function() { return p; }, // The entire absolute path
		type:function(){ return "Path"; }
	});
}

function _pathPrepare(s) {

	if (s.length > 2 && (s.ends("/") || s.ends("\\"))) s = s.chop(1); // Remove one trailing slash

	if (s.first().isLetter() && s.get(1) == ":") { // Windows disk path, like "C:\folder"
		s = s.first().upper() + s.beyond(1); // Uppercase the drive letter for appearance
		if (s.length == 2) s += "\\"; // Trailing slash required and only on drive root
	}

	if (s.starts("\\\\")) { // Windows network share path, like "\\computer\share\folder"
		var c = s.beyond(2).cut("\\"); // Cut like "computer" and "share\folder"
		if (!c.after.has("\\")) s += "\\"; // Trailing slash required and only on share root
	}

	return s;
}
function _pathResolve(s)          { return platformPath.resolve(s); }
function _pathFolder(s)     { return platformPath.dirname(s);  }
function _pathNameDotExt(s) { return platformPath.basename(s); }
function _pathName(s)       { return platformPath.basename(s, _pathDotExt(s)); }
function _pathDotExt(s)     { return platformPath.extname(s);  }
function _pathExt(s) {
	var t = _pathDotExt(s);
	if (t.starts(".")) t = t.beyond(1);
	return t;
}

exports.Path = Path;
exports._pathPrepare = _pathPrepare; // Exported for testing
exports._pathResolve = _pathResolve;
exports._pathFolder = _pathFolder;
exports._pathNameDotExt = _pathNameDotExt;
exports._pathName = _pathName;
exports._pathDotExt = _pathDotExt;
exports._pathExt = _pathExt;







/*
function isSlash(c) {
	return c == "/" || c == "\\";
}
how about either("/", "\\"); returns true if s is equal to any of the given strings
if (s == "/" || s == "\\");//before
if (s.either("/", "\\"));//after
not a lot shorter, really
//make last() to go with first()
*/



// PATH MATH


/*
Some parameter and variable names for path math functions:

folder  C:\folder                     Absolute path to a root folder
file    C:\folder\subfolder\file.ext  Absolute path to something in that folder
name              subfolder\file.ext  Relative path of the file in the folder

use the functions like this:

file = pathAdd(folder, name);
name = pathSubtract(folder, file);
pathCheck(folder, file);              Make sure file is in folder, or throw data
*/

function pathAdd(folder, name) {
	checkType(folder, "Path"); // Make sure folder is an absolute Path object
	checkType(name, "string"); // The relative path name is just a string

	var s = platformPath.resolve(folder.text(), name);
	log(s);
	var file = Path(s);

	pathCheck(folder, file); // Make sure file is inside folder
	return file;
}

function pathSubtract(folder, file) {
	pathCheck(folder, file);

	var name = file.text().after(folder.text().length + 1); // Beyond slash
	log(name);

	var file2 = pathAdd(folder, name); // Confirm adding it back works
	if (file.text() != file2.text()) toss("data"); // And produces the given result
	return name;
}

function pathCheck(folder, file) {
	checkType(folder, "Path");
	checkType(file, "Path");

	var o = folder.text();
	var i = file.text();
	var c = i.get(o.length);

	if (o.length < i.length && // The file path must be longer
		i.starts(o) &&           // And start with the folder path
		(c == "/" || c == "\\")) // And have a slash between folder and name
		return;                  // To be inside
	toss("data");
}

exports.pathAdd = pathAdd;
exports.pathSubtract = pathSubtract;
exports.pathCheck = pathCheck;













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

































