
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("path", function() { return this; });








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

	// Methods
	o.add      = function(name)   { return pathAdd(o, name);        } // "C:\a".add("b") == "C:\a\b"
	o.subtract = function(folder) { return pathSubtract(folder, o); } // "C:\a\b".subtract("C:\a") == "b"
	o.number   = function(n)      { return pathNumber(o, n);        } // "C:\folder\file (2).ext"

	// Finished object
	o.text = function() { return p; }, // The entire absolute path
	o.type = "Path";
	freeze(o);
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

	var file1t = _pathResolveTo(folder.text(), name); // Method 1, use platform
	var file2t = folder.text().onEnd(_pathSeparator()) + name; // Method 2, add strings

	var file1p = Path(file1t); // Send both through Path
	var file2p = Path(file2t);
	var file1pt = file1p.text();
	var file2pt = file2p.text();

	if (!(file1t == file2t && file2t == file1pt && file1pt == file2pt)) toss("data", {note:"round trip", watch:{folder:folder, name:name}}); // Confirm all 4 are the same
	pathCheck(folder, file1p); // Check after
	return file1p;
}

function pathSubtract(folder, file) {
	pathCheck(folder, file); // Check before

	var name = file.text().beyond(folder.text().length + (folder.text().ends(_pathSeparator()) ? 0 : 1)); // Beyond separator

	var i = pathAdd(folder, name); // Confirm adding it back is the same
	if (file.text() != i.text()) toss("data", {note:"round trip", watch:{folder:folder, file:file}});
	return name;
}

function pathCheck(folder, file) {
	checkType(folder, "Path");
	checkType(file, "Path");

	var o = folder.text();
	var i = file.text();
	if (!(o.length < i.length)) toss("data", {note:"short",  watch:{folder:folder, file:file}});
	if (!i.starts(o))           toss("data", {note:"starts", watch:{folder:folder, file:file}});

	var s = i.get(o.ends(_pathSeparator()) ? o.length - 1 : o.length); // Roots end with slash
	if (s != _pathSeparator())  toss("data", {note:"slash",  watch:{folder:folder, file:file}});
}

function _pathResolveTo(from, to) { return platformPath.resolve(from, to); }

exports.pathAdd = pathAdd;
exports.pathSubtract = pathSubtract;
exports.pathCheck = pathCheck;
exports._pathResolveTo = _pathResolveTo; // Exported for testing









//   _____ _ _        _   _                      
//  |  ___(_) | ___  | \ | | __ _ _ __ ___   ___ 
//  | |_  | | |/ _ \ |  \| |/ _` | '_ ` _ \ / _ \
//  |  _| | | |  __/ | |\  | (_| | | | | | |  __/
//  |_|   |_|_|\___| |_| \_|\__,_|_| |_| |_|\___|
//                                               

// Replace characters not allowed in file names with acceptable ones
function replaceReservedCharacters(s, p) {
	if (!p) p = platform(); // If the caller didn't choose a platform, use the one we're running on

	if (p == "windows") { // Make the filename safe for Windows

		s = s.swap("<",  "‹"); // Pick Unicode characters that look similar
		s = s.swap(">",  "›");
		s = s.swap(":",  "։");
		s = s.swap("\"", "”");
		s = s.swap("/",  "⁄");
		s = s.swap("\\", "﹨");
		s = s.swap("|",  "।");
		s = s.swap("?",  "﹖");
		s = s.swap("*",  "﹡");

	} else if (p == "mac") { // Make the filename safe for mac

		s = s.swap(":",  "։"); // Only the colon is not allowed

	} // Unix allows everything in a filename, so don't change it

	return s;
}

// Add a number to a path like "C:\folder\file (2).ext" to avoid a file already there
function pathNumber(path, n) {
	check(n, 1); // Must be 1 or more
	if (n == 1) return path; // No number 1, just the path
	return path.up.add("# (#)#".fill(path.name, n, path._ext)); // Compose the new path
}

exports.replaceReservedCharacters = replaceReservedCharacters;
exports.pathNumber = pathNumber;












