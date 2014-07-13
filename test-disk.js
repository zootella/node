
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("disk_test", function() { return this; });
/*
var requireText = require("./text");
var toss = requireText.toss;

var requireMeasure = require("./measure");
var log = requireMeasure.log;

var requireState = require("./state");
var demo = requireState.demo;
var mistakeLog = requireState.mistakeLog;
var mistakeStop = requireState.mistakeStop;
var closeCheck = requireState.closeCheck;
var done = requireState.done;
var close = requireState.close;
var isClosed = requireState.isClosed;
var isOpen = requireState.isOpen;
var makeState = requireState.makeState;
var listState = requireState.listState;

var requireDisk = require("./disk");
*/


//sources, if you have all the features, and deal with all the concerns of these libraries, your node disk library will be very complete
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







//   _____            _                                      _   
//  | ____|_ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | |___| | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ 
//  |_____|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__|
//                                                               

/*
var platform = requireDisk.platform;
var working = requireDisk.working;
*/

if (demo("platform")) { demoPlatform(); }
function demoPlatform() {

	log("process.platform  ", process.platform);
	log("platform()        ", platform());
}
//TODO see what this says on ubuntu

if (demo("working")) { demoWorking(); }
function demoWorking() {

	log("process.cwd()  ", process.cwd());
	log("working()      ", working()); // working() returns a Path that log calls text() on
}














//   ____       _   _       ____                 _           
//  |  _ \ __ _| |_| |__   |  _ \ ___  ___  ___ | |_   _____ 
//  | |_) / _` | __| '_ \  | |_) / _ \/ __|/ _ \| \ \ / / _ \
//  |  __/ (_| | |_| | | | |  _ <  __/\__ \ (_) | |\ V /  __/
//  |_|   \__,_|\__|_| |_| |_| \_\___||___/\___/|_| \_/ \___|
//                                                           

/*
var _pathPrepare = requireDisk._pathPrepare;
var _pathResolve = requireDisk._pathResolve;
*/

exports.testPathPrepare = function(test) {

	function d(b, a) {//document
		log();
		log("before: '", b, "'");
		log("after:  '", _pathPrepare(b), "'");
	}
	function f(b, a) {//test
		test.ok(_pathPrepare(b) == a);
	}

	/*
	_pathPrepare() gets text ready before handing it to node's resolve below
	uppercase drive letters, just for show
	remove a single trailing slash
	put a trailing slash on the root of the unix filesystem, a windows drive, and a network share, only

	before                              after

	c:                                  C:\
	c:\                                 C:\
	c:\folder                           C:\folder
	c:\folder\                          C:\folder
	c:\folder\subfolder                 C:\folder\subfolder
	c:\folder\subfolder\                C:\folder\subfolder

	\\computer\share                    \\computer\share\
	\\computer\share\                   \\computer\share\
	\\computer\share\folder             \\computer\share\folder
	\\computer\share\folder\            \\computer\share\folder
	\\computer\share\folder\subfolder   \\computer\share\folder\subfolder
	\\computer\share\folder\subfolder\  \\computer\share\folder\subfolder

	/                                   /
	/folder                             /folder
	/folder/                            /folder
	/folder/subfolder                   /folder/subfolder
	/folder/subfolder/                  /folder/subfolder

	this way, node's path.resolve(), in our _pathResolve(), which removes trailing slashes from non drive root paths, will only change the path when it makes a relative path absolute, which we notice and guard against
	*/

	f("c:",                      "C:\\");
	f("c:\\",                    "C:\\");
	f("c:\\folder",              "C:\\folder");
	f("c:\\folder\\",            "C:\\folder");
	f("c:\\folder\\subfolder",   "C:\\folder\\subfolder");
	f("c:\\folder\\subfolder\\", "C:\\folder\\subfolder");

	f("\\\\computer\\share",                      "\\\\computer\\share\\");
	f("\\\\computer\\share\\",                    "\\\\computer\\share\\");
	f("\\\\computer\\share\\folder",              "\\\\computer\\share\\folder");
	f("\\\\computer\\share\\folder\\",            "\\\\computer\\share\\folder");
	f("\\\\computer\\share\\folder\\subfolder",   "\\\\computer\\share\\folder\\subfolder");
	f("\\\\computer\\share\\folder\\subfolder\\", "\\\\computer\\share\\folder\\subfolder");

	f("/",                  "/");
	f("/folder",            "/folder");
	f("/folder/",           "/folder");
	f("/folder/subfolder",  "/folder/subfolder");
	f("/folder/subfolder/", "/folder/subfolder");

	done(test);
}

exports.testPathResolve = function(test) {

	//resolve flips slashes on windows, but not on mac
	if (platform() == "windows") {
		test.ok(_pathResolve("a/b").ends("a\\b"));//on windows, both become back
		test.ok(_pathResolve("a\\b").ends("a\\b"));
	} else {
		test.ok(_pathResolve("a/b").ends("a/b"));//on mac, backslash is allowed and preserved
		test.ok(_pathResolve("a\\b").ends("a\\b"));
	}

	done(test);
}

//   ____       _   _       ____  _                                 
//  |  _ \ __ _| |_| |__   |  _ \(_)_ __ _ __   __ _ _ __ ___   ___ 
//  | |_) / _` | __| '_ \  | | | | | '__| '_ \ / _` | '_ ` _ \ / _ \
//  |  __/ (_| | |_| | | | | |_| | | |  | | | | (_| | | | | | |  __/
//  |_|   \__,_|\__|_| |_| |____/|_|_|  |_| |_|\__,_|_| |_| |_|\___|
//                                                                  

/*
var _pathFolder = requireDisk._pathFolder;
var _pathNameDotExt = requireDisk._pathNameDotExt;
var _pathName = requireDisk._pathName;
var _pathDotExt = requireDisk._pathDotExt;
var _pathExt = requireDisk._pathExt;
*/

exports.testDirname = function(test) {

	function d(s) {
		log("'", _pathFolder(s),     "'");
		log("'", _pathNameDotExt(s), "'");
		log("'", _pathName(s),       "'");
		log("'", _pathDotExt(s),     "'");
		log("'", _pathExt(s),        "'");
	}
	function f(s, f, ne, n, de, e) {
		test.ok(_pathFolder(s)     == f);
		test.ok(_pathNameDotExt(s) == ne);
		test.ok(_pathName(s)       == n);
		test.ok(_pathDotExt(s)     == de);
		test.ok(_pathExt(s)        == e);
	}
	function n(){}//empty function to switch a line below off without having to comment it

	if (platform() == "windows") {

		//s                                  folder                   name.ext     name         .ext    ext
		f("C:\\",                            "C:\\",                  "",          "",          "",     "");//drive root is the same, not blank
		f("C:\\folder",                      "C:\\",                  "folder",    "folder",    "",     "");
		f("C:\\folder\\subfolder",           "C:\\folder",            "subfolder", "subfolder", "",     "");
		f("C:\\folder\\subfolder\\file.ext", "C:\\folder\\subfolder", "file.ext",  "file",      ".ext", "ext");

		//s                                                   folder                                    name.ext     name         .ext    ext
		f("\\\\computer\\share\\",                            "\\\\computer\\share\\",                  "",          "",          "",     "");//root is the same, not blank
		f("\\\\computer\\share\\folder",                      "\\\\computer\\share\\",                  "folder",    "folder",    "",     "");
		f("\\\\computer\\share\\folder\\subfolder",           "\\\\computer\\share\\folder",            "subfolder", "subfolder", "",     "");
		f("\\\\computer\\share\\folder\\subfolder\\file.ext", "\\\\computer\\share\\folder\\subfolder", "file.ext",  "file",      ".ext", "ext");

	} else {

		//s                             folder               name.ext     name         .ext    ext
		f("/",                          "/",                 "",          "",          "",     "");//root is the same, not blank
		f("/folder",                    "/",                 "folder",    "folder",    "",     "");
		f("/folder/subfolder",          "/folder",           "subfolder", "subfolder", "",     "");
		f("/folder/subfolder/file.ext", "/folder/subfolder", "file.ext",  "file",      ".ext", "ext");
	}

	done(test);
}









//   ____       _   _     
//  |  _ \ __ _| |_| |__  
//  | |_) / _` | __| '_ \ 
//  |  __/ (_| | |_| | | |
//  |_|   \__,_|\__|_| |_|
//                        

/*
var Path = requireDisk.Path;
*/




exports.testPathUp = function(test) {

	if (platform() == "windows") {

		var p = Path("C:\\folder\\subfolder\\file.ext");
		test.ok(p.text() == "C:\\folder\\subfolder\\file.ext"); p = p.up;
		test.ok(p.text() == "C:\\folder\\subfolder");           p = p.up;
		test.ok(p.text() == "C:\\folder");                      p = p.up;
		test.ok(p.text() == "C:\\");
		test.ok(!p.up);

		p = Path("\\\\computer\\share\\folder\\subfolder\\file.ext");
		test.ok(p.text() == "\\\\computer\\share\\folder\\subfolder\\file.ext"); p = p.up;
		test.ok(p.text() == "\\\\computer\\share\\folder\\subfolder");           p = p.up;
		test.ok(p.text() == "\\\\computer\\share\\folder");                      p = p.up;
		test.ok(p.text() == "\\\\computer\\share\\");
		test.ok(!p.up);

	} else {

		p = Path("/folder/subfolder/file.ext");
		test.ok(p.text() == "/folder/subfolder/file.ext"); p = p.up;
		test.ok(p.text() == "/folder/subfolder");          p = p.up;
		test.ok(p.text() == "/folder");                    p = p.up;
		test.ok(p.text() == "/");
		test.ok(!p.up);
	}

	done(test);
}






//   ____       _   _       __  __       _   _     
//  |  _ \ __ _| |_| |__   |  \/  | __ _| |_| |__  
//  | |_) / _` | __| '_ \  | |\/| |/ _` | __| '_ \ 
//  |  __/ (_| | |_| | | | | |  | | (_| | |_| | | |
//  |_|   \__,_|\__|_| |_| |_|  |_|\__,_|\__|_| |_|
//                                                 

/*
var pathAdd = requireDisk.pathAdd;
var pathSubtract = requireDisk.pathSubtract;
var pathCheck = requireDisk.pathCheck;
*/




//   ____       _   _       ____  _     _    
//  |  _ \ __ _| |_| |__   |  _ \(_)___| | __
//  | |_) / _` | __| '_ \  | | | | / __| |/ /
//  |  __/ (_| | |_| | | | | |_| | \__ \   < 
//  |_|   \__,_|\__|_| |_| |____/|_|___/_|\_\
//                                           

/*
var pathLook = requireDisk.pathLook;
*/












