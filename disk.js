
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("disk", function() { return this; });




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









//   ____       _   _     
//  |  _ \ __ _| |_| |__  
//  | |_) / _` | __| '_ \ 
//  |  __/ (_| | |_| | | |
//  |_|   \__,_|\__|_| |_|
//                        

// An absolute file system path that looks right for the kind of computer we're running on
// Give this an absolute path and it will confirm that it looks right, give it a relative path, and it will throw data
// Calling this doesn't use the disk
function Path(s) {

	// Resolve to make sure it's absolute
	checkType(s, "string");  // Make sure s is a string
	var r = _pathPrepare(s); // Have only system, drive and share roots end with a slash
	var p = _pathResolve(r); // Resolve to an absolute path
	if (p != r) toss("data", {note:"resolve changed path", watch:{s:s, r:r, p:p}}); // If the path changed, it was a relative path

	// Platform type
	var o = {}; // The object we will fill, freeze, and return
	if      (p.starts("\\\\")) o.platform = "network"; // Like \\computer\share\folder
	else if (p.starts("/"))    o.platform = "unix";    // Like /folder
	else if (p.get(1) == ":")  o.platform = "windows"; // Like C:\folder
	else toss("data", {note:"can't determine platform", watch:{p:p}});

	// Containing folders
	o.step = [o]; // An array of paths starting with this one, then the containing folders, ending with the root
	var i = p; // Start here
	while (true) {
		var j = _pathFolder(i); // j is the path one step higher than i
		if (j == i) { // We reached the root
			break;
		} else if (j.length < i.length && i.starts(j)) { // Shorter and starting, j is the folder above
			o.step.add(Path(j)); // Parse and save it in the step array
			i = j; // Move up and loop again to get the next higher containing folder or root
		} else { // If j isn't the same as i, make sure it's shorter and matches the start
			toss("data", {note:"step", watch:{p:p, i:i, j:j}});
		}
	}
	o.up = null; // The path above this one, null if this is the root
	if (o.step.length > 1) o.up = o.step[1];
	o.root = o.step[o.step.length - 1]; // The path to the drive or share root above us, a link to this one if this is the root

	// File name parts
	o.name_ext = _pathNameDotExt(p), // "file.ext"
	o.name = _pathName(p),           // "file"
	o._ext = _pathDotExt(p),         // ".ext"
	o.ext = _pathExt(p),             // "ext"

	// Finished object
	o.text = function() { return p; }, // The entire absolute path
	o.type = function() { return "Path"; }
	Object.freeze(o.step);
	Object.freeze(o);
	return o;
}

function _pathPrepare(s) {

	if (s.length > 2 && (s.ends(_pathSeparator()))) s = s.chop(1); // Remove one trailing slash

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
function _pathSeparator()   { return platformPath.sep; }
function _pathResolve(s)    { return platformPath.resolve(s); }
function _pathFolder(s)     { return platformPath.dirname(s); }
function _pathNameDotExt(s) { return platformPath.basename(s); }
function _pathName(s)       { return platformPath.basename(s, _pathDotExt(s)); }
function _pathDotExt(s)     { return platformPath.extname(s); }
function _pathExt(s) {
	var t = _pathDotExt(s);
	if (t.starts(".")) t = t.beyond(1);
	return t;
}

exports.Path = Path;
exports._pathSeparator = _pathSeparator; // Exported for testing
exports._pathPrepare = _pathPrepare;
exports._pathResolve = _pathResolve;
exports._pathFolder = _pathFolder;
exports._pathNameDotExt = _pathNameDotExt;
exports._pathName = _pathName;
exports._pathDotExt = _pathDotExt;
exports._pathExt = _pathExt;









//   ____       _   _       __  __       _   _     
//  |  _ \ __ _| |_| |__   |  \/  | __ _| |_| |__  
//  | |_) / _` | __| '_ \  | |\/| |/ _` | __| '_ \ 
//  |  __/ (_| | |_| | | | | |  | | (_| | |_| | | |
//  |_|   \__,_|\__|_| |_| |_|  |_|\__,_|\__|_| |_|
//                                                 

/*
Parameter and variable names for path math functions:

folder  C:\folder                     Absolute path to a folder
file    C:\folder\subfolder\file.ext  Absolute path to something in that folder
name              subfolder\file.ext  Relative path of the file in the folder

Use the functions like this:

file = pathAdd(folder, name);
name = pathSubtract(folder, file);
pathCheck(folder, file);              Make sure file is in folder, or throw data
*/

function pathAdd(folder, name) {
	checkType(folder, "Path"); // Make sure folder is an absolute Path object
	checkType(name, "string"); // The relative path name is just a string

	var file = Path(_pathResolveTo(folder.text(), name));

	var i = folder.text() + _pathSeparator() + name; // Confirm adding the strings is the same
	if (file.text() != i) toss("data", {note:"round trip", watch:{folder:folder, name:name}});
	pathCheck(folder, file); // Check after
	return file;
}

function pathSubtract(folder, file) {
	pathCheck(folder, file); // Check before

	var name = file.text().beyond(folder.text().length + 1); // Beyond slash

	var i = pathAdd(folder, name); // Confirm adding it back is the same
	if (file.text() != i.text()) toss("data", {note:"round trip", watch:{folder:folder, file:file}});
	return name;
}

function pathCheck(folder, file) {
	checkType(folder, "Path");
	checkType(file, "Path");

	var o = folder.text();
	var i = file.text();
	var s = i.get(o.length);

	if (o.length >= i.length)  toss("data", {note:"short",  watch:{folder:folder, file:file}});
	if (!i.starts(o))          toss("data", {note:"starts", watch:{folder:folder, file:file}});
	if (s != _pathSeparator()) toss("data", {note:"slash",  watch:{folder:folder, file:file}});
}

function _pathResolveTo(from, to) { return platformPath.resolve(from, to); }

exports.pathAdd = pathAdd;
exports.pathSubtract = pathSubtract;
exports.pathCheck = pathCheck;
exports._pathResolveTo = _pathResolveTo; // Exported for testing









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


















