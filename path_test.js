
require("./load").load("path_test", function() { return this; });








//   ____       _   _       ____                                             
//  |  _ \ __ _| |_| |__   / ___| _   _ _ __ ___  _ __ ___   __ _ _ __ _   _ 
//  | |_) / _` | __| '_ \  \___ \| | | | '_ ` _ \| '_ ` _ \ / _` | '__| | | |
//  |  __/ (_| | |_| | | |  ___) | |_| | | | | | | | | | | | (_| | |  | |_| |
//  |_|   \__,_|\__|_| |_| |____/ \__,_|_| |_| |_|_| |_| |_|\__,_|_|   \__, |
//                                                                     |___/ 

//before a thousand lines of detail, the most common and important use and protection of the path functions
exports.testPathSummary = function(test) {

	var p;
	function badPath(s)                { try { Path(s);                    test.fail(); } catch (e) {} }
	function badAdd(folder, name)      { try { pathAdd(folder, name);      test.fail(); } catch (e) {} }
	function badSubtract(folder, file) { try { pathSubtract(folder, file); test.fail(); } catch (e) {} }
	function badCheck(folder, file)    { try { pathCheck(folder, file);    test.fail(); } catch (e) {} }

	//validation

	if (platform() == "windows") {

		//running on windows, path accepts and validates drive and network absolute paths
		test.ok(Path("C:\\").text() == "C:\\");//makes sure it's absolute or throws data
		test.ok(Path("C:\\folder").text() == "C:\\folder");
		test.ok(Path("C:\\folder\\file.ext").text() == "C:\\folder\\file.ext");

		test.ok(Path("\\\\computer\\share\\").text() == "\\\\computer\\share\\");//also works for network paths
		test.ok(Path("\\\\computer\\share\\folder").text() == "\\\\computer\\share\\folder");
		test.ok(Path("\\\\computer\\share\\folder\\file.ext").text() == "\\\\computer\\share\\folder\\file.ext");

		//drive and share roots get corrected to have a trailing slash
		test.ok(Path("C:").text() == "C:\\");//adds the missing slash
		test.ok(Path("\\\\computer\\share").text() == "\\\\computer\\share\\");

		//folders get corrected to not have a trailing slash
		test.ok(Path("C:\\folder\\").text() == "C:\\folder");//removes the trailing slash
		test.ok(Path("\\\\computer\\share\\folder\\").text() == "\\\\computer\\share\\folder");
		badPath("C:\\folder\\\\");//only one extra trailing slash is allowed, however

		//blank, individual filenames, relative paths, and path navigation are importantly blocked
		badPath("");//blank, blocked
		badPath("file.ext");//just a filename, blocked
		badPath("folder\\file.ext");//relative path down, blocked
		badPath("..\\file.ext");//relative path trying to go up, blocked
		badPath("C:\\folder\\..\\file.ext");//absolute but has navigation, blocked

		//on windows, mac and unix paths are blocked
		badPath("/");
		badPath("/name");

	} else {

		//running on mac, absolute paths have to be unix style, which are a lot better
		test.ok(Path("/").text() == "/");
		test.ok(Path("/folder").text() == "/folder");
		test.ok(Path("/folder/file.ext").text() == "/folder/file.ext");

		//a single extra trailing slash on a folder is removed
		test.ok(Path("/folder/").text() == "/folder");
		badPath("/folder//");//double not ok

		//on mac and unix, backslash is a valid character for a filename
		test.ok(Path("/has\\backslash").text() == "/has\\backslash");
		test.ok(Path("/\\").text() == "/\\");//a file or folder named just backslash at the unix root

		//blank, individual filenames, relative paths, and path navigation are importantly blocked
		badPath("");//blank, blocked
		badPath("file.ext");//just a filename, blocked
		badPath("folder/file.ext");//relative path down, blocked
		badPath("../file.ext");//relative path trying to go up, blocked
		badPath("/folder/../file.ext");//absolute but has navigation, blocked

		//on mac and unix, windows drive and network paths are blocked
		badPath("C:\\");
		badPath("C:\\name");
		badPath("\\\\computer\\share\\");
		badPath("\\\\computer\\share\\name");
	}

	//parts

	if (platform() == "windows") {

		//use path.platform to see what type it is
		test.ok(Path("C:\\file.ext").platform == "windows");
		test.ok(Path("\\\\computer\\share\\file.ext").platform == "network");

		//it's easy to get at all the parts of the file name and extension
		p = Path("C:\\folder\\file.ext");
		test.ok(p.name_ext == "file.ext");
		test.ok(p.name     == "file"    );
		test.ok(p._ext     ==     ".ext");
		test.ok(p.ext      ==      "ext");

		p = Path("C:\\folder\\file");//a folder, or a file with no extension
		test.ok(p.name_ext == "file");
		test.ok(p.name     == "file");
		test.ok(p._ext     ==     "");
		test.ok(p.ext      ==     "");

		p = Path("C:\\folder\\file.backup.ext");//two extensions
		test.ok(p.name_ext == "file.backup.ext");
		test.ok(p.name     == "file.backup"    );
		test.ok(p._ext     ==            ".ext");
		test.ok(p.ext      ==             "ext");

		p = Path("C:\\folder\\.hidden");//named to be hidden on unix
		test.ok(p.name_ext == ".hidden");//the name is the name, not the extension
		test.ok(p.name     == ".hidden");
		test.ok(p._ext     ==        "");
		test.ok(p.ext      ==        "");

		p = Path("\\\\computer\\share\\folder\\file.ext");//works the same on network shares
		test.ok(p.name_ext == "file.ext");
		test.ok(p.name     == "file"    );
		test.ok(p._ext     ==     ".ext");
		test.ok(p.ext      ==      "ext");

	} else {

		//use path.platform to see what type it is
		test.ok(Path("/file.ext").platform == "unix");

		//it's easy to get at all the parts of the file name and extension
		p = Path("/folder/file.ext");
		test.ok(p.name_ext == "file.ext");
		test.ok(p.name     == "file"    );
		test.ok(p._ext     ==     ".ext");
		test.ok(p.ext      ==      "ext");

		p = Path("/folder/file");//a folder, or a file with no extension
		test.ok(p.name_ext == "file");
		test.ok(p.name     == "file");
		test.ok(p._ext     ==     "");
		test.ok(p.ext      ==     "");

		p = Path("/folder/file.backup.ext");//two extensions
		test.ok(p.name_ext == "file.backup.ext");
		test.ok(p.name     == "file.backup"    );
		test.ok(p._ext     ==            ".ext");
		test.ok(p.ext      ==             "ext");

		p = Path("/folder/.hidden");//named to be hidden on unix
		test.ok(p.name_ext == ".hidden");//the name is the name, not the extension
		test.ok(p.name     == ".hidden");
		test.ok(p._ext     ==        "");
		test.ok(p.ext      ==        "");
	}

	//up

	if (platform() == "windows") {

		//use up, root, and step to get all the paths up to the root
		p = Path("C:\\f1\\f2\\file.ext");
		test.ok(p.up.text()    == "C:\\f1\\f2");//up is the containing folder
		test.ok(p.up.up.text() == "C:\\f1");//go up twice
		test.ok(p.root.text()  == "C:\\");//root is the highest containing path
		test.ok(!p.root.up);//root has no up

		test.ok(p.step.length == 4);//there is also an array with all the paths
		test.ok(p.step[0].text() == "C:\\f1\\f2\\file.ext");//starting with this one
		test.ok(p.step[1].text() == "C:\\f1\\f2");
		test.ok(p.step[2].text() == "C:\\f1");
		test.ok(p.step[3].text() == "C:\\");//and ending with the drive root

		//also works for network shares
		p = Path("\\\\c\\s\\f1\\f2\\file.ext");
		test.ok(p.up.text()    == "\\\\c\\s\\f1\\f2");//up is the containing folder
		test.ok(p.up.up.text() == "\\\\c\\s\\f1");//go up twice
		test.ok(p.root.text()  == "\\\\c\\s\\");//root is the highest containing path
		test.ok(!p.root.up);//root has no up

		test.ok(p.step.length == 4);//there is also an array with all the paths
		test.ok(p.step[0].text() == "\\\\c\\s\\f1\\f2\\file.ext");//starting with this one
		test.ok(p.step[1].text() == "\\\\c\\s\\f1\\f2");
		test.ok(p.step[2].text() == "\\\\c\\s\\f1");
		test.ok(p.step[3].text() == "\\\\c\\s\\");//and ending with the share root

	} else {

		//use up, root, and step to get all the paths up to the root
		p = Path("/f1/f2/file.ext");
		test.ok(p.up.text()    == "/f1/f2");//up is the containing folder
		test.ok(p.up.up.text() == "/f1");//go up twice
		test.ok(p.root.text()  == "/");//root is the highest containing path
		test.ok(!p.root.up);//root has no up

		test.ok(p.step.length == 4);//there is also an array with all the paths
		test.ok(p.step[0].text() == "/f1/f2/file.ext");//starting with this one
		test.ok(p.step[1].text() == "/f1/f2");
		test.ok(p.step[2].text() == "/f1");
		test.ok(p.step[3].text() == "/");//and ending with the filesystem root
	}

	//math methods

	if (platform() == "windows") {

		test.ok(Path("C:\\a").add("b").text() == "C:\\a\\b");//add a file or folder name to the end of a path
		test.ok(Path("C:\\a\\b").subtract(Path("C:\\a")) == "b");//subtract a shorter path from a longer one to get the relative path between them

		test.ok(Path("\\\\c\\s\\a").add("b").text() == "\\\\c\\s\\a\\b");//also works for network paths
		test.ok(Path("\\\\c\\s\\a\\b").subtract(Path("\\\\c\\s\\a")) == "b");

	} else {

		test.ok(Path("/a").add("b").text() == "/a/b");//and unix paths
		test.ok(Path("/a/b").subtract(Path("/a")) == "b");
	}

	//add

	if (platform() == "windows") {

		//use path add to add a relative path to an absolute one
		test.ok(pathAdd(Path("C:\\f1"), "file").text() == "C:\\f1\\file");
		test.ok(pathAdd(Path("C:\\"), "f1\\f2\\file").text() == "C:\\f1\\f2\\file");

		//very importantly, pathAdd guards against the directory traversal attack
		badAdd(Path("C:\\downloads"), "..\\autoexec.bat");
		badAdd(Path("C:\\f1"), "f2\\..\\file");//all navigation is blocked, even this example which still lands in f1
		badAdd(Path("C:\\folder"), "\\file");//strict about file names, doesn't like the starting slash
		badAdd(Path("C:\\folder"), "file\\");//or an ending one

		//same for network paths
		test.ok(pathAdd(Path("\\\\c\\s\\f1"), "file").text() == "\\\\c\\s\\f1\\file");
		test.ok(pathAdd(Path("\\\\c\\s\\"), "f1\\f2\\file").text() == "\\\\c\\s\\f1\\f2\\file");
		badAdd(Path("\\\\c\\s\\downloads"), "..\\autoexec.bat");
		badAdd(Path("\\\\c\\s\\f1"), "f2\\..\\file");
		badAdd(Path("\\\\c\\s\\folder"), "\\file");
		badAdd(Path("\\\\c\\s\\folder"), "file\\");

	} else {

		//use path add to add a relative path to an absolute one
		test.ok(pathAdd(Path("/f1"), "file").text() == "/f1/file");
		test.ok(pathAdd(Path("/"), "f1/f2/file").text() == "/f1/f2/file");

		//very importantly, pathAdd guards against the directory traversal attack
		badAdd(Path("/downloads"), "../autoexec.bat");
		badAdd(Path("/f1"), "f2/../file");//all navigation is blocked, even this example which still lands in f1
		badAdd(Path("/folder"), "/file");//strict about file names, doesn't like the starting slash
		badAdd(Path("/folder"), "file/");//or an ending one
	}

	//subtract

	if (platform() == "windows") {

		//drive
		test.ok(pathSubtract(Path("C:\\"),     Path("C:\\file.ext"))             == "file.ext");
		test.ok(pathSubtract(Path("C:\\a\\b"), Path("C:\\a\\b\\c\\d\\file.ext")) == "c\\d\\file.ext");

		//network
		test.ok(pathSubtract(Path("\\\\c\\s\\"),     Path("\\\\c\\s\\file.ext"))             == "file.ext");
		test.ok(pathSubtract(Path("\\\\c\\s\\a\\b"), Path("\\\\c\\s\\a\\b\\c\\d\\file.ext")) == "c\\d\\file.ext");

	} else {

		//unix
		test.ok(pathSubtract(Path("/"),    Path("/file.ext"))         == "file.ext");
		test.ok(pathSubtract(Path("/a/b"), Path("/a/b/c/d/file.ext")) == "c/d/file.ext");
	}

	//check

	if (platform() == "windows") {

		//add and subtract use path check to make sure a second path is within a first one
		pathCheck(Path("C:\\"),   Path("C:\\name"));
		pathCheck(Path("C:\\f1"), Path("C:\\f1\\name"));

		//the file path must be
		badCheck(Path("C:\\folder"), Path("C:\\folder"));//longer
		badCheck(Path("C:\\folder"), Path("C:\\folde2"));//must start with the folder path
		badCheck(Path("C:\\folder"), Path("C:\\folder2"));//and have a separating backslash between them

		//case is strict, this would be inside on windows, but maybe not on mac
		badCheck(Path("C:\\folder"), Path("C:\\Folder\\file"));

	} else {

		//add and subtract use path check to make sure a second path is within a first one
		pathCheck(Path("/"),   Path("/name"));
		pathCheck(Path("/f1"), Path("/f1/name"));

		//the file path must be
		badCheck(Path("/folder"), Path("/folder"));//longer
		badCheck(Path("/folder"), Path("/folde2"));//must start with the folder path
		badCheck(Path("/folder"), Path("/folder2"));//and have a separating slash between them

		//backslash is a valid file name character on unix
		badCheck(Path("/folder"), Path("/folder\\file"));//you can't use it to sneak in something that looks like a subfolder
	}

	done(test);
}








//   ____       _   _       ____  _       _    __                      
//  |  _ \ __ _| |_| |__   |  _ \| | __ _| |_ / _| ___  _ __ _ __ ___  
//  | |_) / _` | __| '_ \  | |_) | |/ _` | __| |_ / _ \| '__| '_ ` _ \ 
//  |  __/ (_| | |_| | | | |  __/| | (_| | |_|  _| (_) | |  | | | | | |
//  |_|   \__,_|\__|_| |_| |_|   |_|\__,_|\__|_|  \___/|_|  |_| |_| |_|
//                                                                     

//first, demonstrate how the platform functions Path uses change different kinds of possible input text
exports.testPathSeparator = function(test) {

	if (platform() == "windows") test.ok(_pathSeparator() == "\\");
	else                         test.ok(_pathSeparator() == "/");

	done(test);
}

exports.testPathResolve = function(test) {

	var show = false;//set to true to turn on the output a test can't easily check
	function note(s) { if (show) { log(); log(s); } }//make a note
	function l(n, s) { if (show) log(n, " '", _pathResolve(s), "'"); }//log the result
	function t(n, s, r) { test.ok(_pathResolve(s) == r); }//test the result

	if (platform() == "windows") {//test running on windows

		note("windows");
		l(11, "C:")//strangely, resolves to user's home folder
		t(12, "C:\\",                 "C:\\");
		t(13, "C:\\folder",           "C:\\folder");
		t(14, "C:\\folder\\",         "C:\\folder");//resolve removes trailing slash
		t(15, "C:\\folder\\file.ext", "C:\\folder\\file.ext");

		note("network");
		l(21, "\\\\");//strangely, becomes the root of the drive the pwd is on
		l(22, "\\\\computer");
		l(23, "\\\\computer\\");//and then builds up folders from there
		t(24, "\\\\computer\\share",                   "\\\\computer\\share\\");//adds slash to root
		t(25, "\\\\computer\\share\\",                 "\\\\computer\\share\\");
		t(26, "\\\\computer\\share\\folder",           "\\\\computer\\share\\folder");
		t(27, "\\\\computer\\share\\folder\\",         "\\\\computer\\share\\folder");//removes slash from folder
		t(28, "\\\\computer\\share\\folder\\file.ext", "\\\\computer\\share\\folder\\file.ext");

		note("unix");
		l(31, "/");//slash becomes the root of the drive the present working directory is on
		l(32, "/folder");//and then builds up from there
		l(33, "/folder/");
		l(34, "/folder/file.ext");

		note("simple");
		l(41, "");//resolves to path to present working directory
		l(42, "name");//path to name in present working directory

		note("navigation");
		l(51, ".");//present working directory
		l(52, "./");//present working directory
		l(53, "..");//one up from present working directory
		l(54, "../");//one up from present working directory
		l(55, "../name");//one up, then to folder named name
		l(56, "~");//file named ~ in present working directory, not user's home folder
		t(57, "C:\\folder\\..\\name", "C:\\name");//resolve does navigation in the middle of a path

		note("spaces");
		l(61, " ");
		l(62, " name");
		l(63, "name ");
		l(64, " C:\\folder");//all become files in the present working directory
		t(65, "C:\\folder ", "C:\\folder ");//no change

		note("slashes");
		l(71, "\\");//starting slash becomes root of pwd folder
		l(72, "\\\\");
		l(73, "\\\\\\");
		l(74, "//");
		l(75, "///");//as do all these multiple forward and back slashes
		l(76, "\\name");
		l(77, "name\\");//name in pwd, trailing slash removed
		l(78, "/");//same as with backslash
		l(79, "/name");
		l(80, "name/");

		note("flip");
		t(81, "C:\\a\\b",         "C:\\a\\b");//backslash is correct
		t(82, "C:\\a\\\\b",       "C:\\a\\b");//resolve corrects double backslash
		t(83, "C:\\a/b",          "C:\\a\\b");//on windows, resolve flips forward slash backwards
		t(84, "C:\\a//b",         "C:\\a\\b");//resolve corrects all of these as well
		t(85, "C:\\a//\\b",       "C:\\a\\b");
		t(86, "C:\\a\\//b",       "C:\\a\\b");
		t(87, "C:\\a\\/\\\\///b", "C:\\a\\b");

		note("case");
		t(91, "c:\\Folder", "c:\\Folder");//drive letter case stays the same
		t(92, "C:\\Folder", "C:\\Folder");

	} else {//test running on mac and unix

		note("windows");
		l(11, "C:");//all of these are seen as filenames in the present working directory
		l(12, "C:\\",                 "C:\\");
		l(13, "C:\\folder",           "C:\\folder");
		l(14, "C:\\folder\\",         "C:\\folder");
		l(15, "C:\\folder\\file.ext", "C:\\folder\\file.ext");

		note("network");
		l(21, "\\\\");//also all seen as filenames in pwd
		l(22, "\\\\computer");
		l(23, "\\\\computer\\");
		l(24, "\\\\computer\\share",                   "\\\\computer\\share\\");
		l(25, "\\\\computer\\share\\",                 "\\\\computer\\share\\");
		l(26, "\\\\computer\\share\\folder",           "\\\\computer\\share\\folder");
		l(27, "\\\\computer\\share\\folder\\",         "\\\\computer\\share\\folder");
		l(28, "\\\\computer\\share\\folder\\file.ext", "\\\\computer\\share\\folder\\file.ext");

		note("unix");
		t(31, "/",                "/");
		t(32, "/folder",          "/folder");
		t(33, "/folder/",         "/folder");//resolve removes trailing slash
		t(34, "/folder/file.ext", "/folder/file.ext");

		note("simple");
		l(41, "");//resolves to path to present working directory
		l(42, "name");//path to name in present working directory

		note("navigation");
		l(51, ".");//present working directory
		l(52, "./");//present working directory
		l(53, "..");//one up from present working directory
		l(54, "../");//one up from present working directory
		l(55, "../name");//one up, then to folder named name
		l(56, "~");//file named ~ in present working directory, not user's home folder
		t(57, "/folder/../name", "/name");//resolve does navigation in the middle of a path

		note("spaces");
		l(61, " ");
		l(62, " name");
		l(63, "name ");
		l(64, " /folder");//all become files in the present working directory
		t(65, "/folder ", "/folder ");//no change

		note("slashes");
		l(71, "\\");//names in present working directory
		l(72, "\\name");
		l(73, "name\\");//trailing slash remains
		t(74, "/",     "/");//these two are valid unix paths, of course
		t(75, "/name", "/name");
		l(76, "name/");//name in pwd, but trailing slash removed
		t(77, "/folder//file.ext", "/folder/file.ext");//double forward slash corrected
		t(78, "/folder\\file.ext", "/folder\\file.ext");//backslash remains in file name

		note("flip");
		t(81, "/a/b",          "/a/b");//forward slash is correct
		t(82, "/a\\b",         "/a\\b");//backslash can be in a filename
		t(83, "/a//b",         "/a/b");//resolve corrects double slash
		t(84, "/a//b",         "/a/b");//multiple forward slashes become a single forward slash
		t(85, "/a//\\b",       "/a/\\b");
		t(86, "/a\\//b",       "/a\\/b");
		t(87, "/a\\/\\\\///b", "/a\\/\\\\/b");
	}

	done(test);
}

exports.testPathFolder = function(test) {

	var show = false;//set to true to turn on the output a test can't easily check
	function note(s) { if (show) { log(); log(s); } }//make a note
	function l(n, s) { if (show) log(n, " '", _pathFolder(s), "'"); }//log the result
	function t(n, s, r) { test.ok(_pathFolder(s) == r); }//test the result

	if (platform() == "windows") {

		note("simple");
		t(11, "",     ".");//relative paths become just dot, strangely
		t(12, "name", ".");

		note("windows");
		t(21, "C:\\folder\\file.ext", "C:\\folder");//works
		t(22, "C:\\folder",           "C:\\");//works
		t(23, "C:\\",                 "C:\\");//drive root stays the same

		note("network");
		t(31, "\\\\computer\\share\\folder\\file.ext", "\\\\computer\\share\\folder");
		t(32, "\\\\computer\\share\\folder",           "\\\\computer\\share\\");//leaves trailing slash on share root
		t(33, "\\\\computer\\share\\",                 "\\\\computer\\share\\");//share root stays the same
		t(34, "\\\\computer\\share",                   "\\\\computer\\share");//doesn't add trailing slash
		t(35, "\\\\computer\\",                        "\\");//these just become a single backslash for some reason
		t(36, "\\\\computer",                          "\\");
		t(37, "\\\\",                                  "\\");

		note("unix");
		t(41, "/folder/file.ext", "/folder");//works
		t(42, "/folder/",         "/");//invalid input with the trailing slash, but works
		t(43, "/folder",          "/");//works
		t(44, "/",                "/");//unix root stays the same, like the other roots

	} else {

		note("simple");
		t(11, "",     ".");//all of these become dot because on mac they look like filenames
		t(12, "name", ".");

		note("windows");
		t(21, "C:\\folder\\file.ext", ".");
		t(22, "C:\\folder",           ".");
		t(23, "C:\\",                 ".");

		note("network");
		t(31, "\\\\computer\\share\\folder\\file.ext", ".");
		t(32, "\\\\computer\\share\\folder",           ".");
		t(33, "\\\\computer\\share\\",                 ".");
		t(34, "\\\\computer\\share",                   ".");
		t(35, "\\\\computer\\",                        ".");
		t(36, "\\\\computer",                          ".");
		t(37, "\\\\",                                  ".");

		note("unix");
		t(41, "/folder/file.ext", "/folder");//works
		t(42, "/folder/",         "/");//invalid input with the trailing slash, but works
		t(43, "/folder",          "/");//works
		t(44, "/",                "/");//unix root stays the same
	}

	done(test);
}

exports.testPathNameDotExt = function(test) {

	var show = false;//set to true to turn on the output a test can't easily check
	function note(s) { if (show) { log(); log(s); } }//make a note
	function l(n, s) {//log the result
		if (show) {
			log();
			log(n, " '", s, "'");
			log("  name.ext  '", _pathNameDotExt(s), "'");
			log("  name      '", _pathName(s),       "'");
			log("      .ext  '", _pathDotExt(s),     "'");
			log("       ext  '", _pathExt(s),        "'");
		}
	}
	function t(n, s, nameDotExt, name, dotExt, ext) {//test the result
		test.ok(_pathNameDotExt(s) == nameDotExt);
		test.ok(_pathName(s)       == name);
		test.ok(_pathDotExt(s)     == dotExt);
		test.ok(_pathExt(s)        == ext);
	}

	if (platform() == "windows") {

		note("windows");
		t(11, "C:\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t(12, "C:\\folder\\IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t(13, "C:\\folder\\database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t(14, "C:\\folder\\none",    "none",    "none",    "",  "");//no extension
		t(15, "C:\\folder\\.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t(16, "C:\\folder\\start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		t(17, "C:\\folder\\.",       ".",       ".",       "",  "");//invalid, treats dot as the filename

		note("network");
		t(21, "\\\\computer\\share\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");

		note("unix");
		t(31, "/folder/image.jpg", "image.jpg", "image", ".jpg", "jpg");

	} else {

		note("unix");
		t(11, "/folder/image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t(12, "/folder/IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t(13, "/folder/database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t(14, "/folder/none",    "none",    "none",    "",  "");//no extension
		t(15, "/folder/.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t(16, "/folder/start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		t(17, "/folder/.",       ".",       ".",       "",  "");//invalid, treats dot as the filename
	}

	done(test);
}








//   ____       _   _       ____                                
//  |  _ \ __ _| |_| |__   |  _ \ _ __ ___ _ __   __ _ _ __ ___ 
//  | |_) / _` | __| '_ \  | |_) | '__/ _ \ '_ \ / _` | '__/ _ \
//  |  __/ (_| | |_| | | | |  __/| | |  __/ |_) | (_| | | |  __/
//  |_|   \__,_|\__|_| |_| |_|   |_|  \___| .__/ \__,_|_|  \___|
//                                        |_|                   

//second, show how we prepare text before handing it to the platform functions
exports.testPathPrepare = function(test) {

	function l(s) { log("'", _pathPrepare(s), "'"); }//log the result
	function t(s, r) { test.ok(_pathPrepare(s) == r); }//test the result

	/*
	_pathPrepare() gets text ready before handing it to the platform's resolve
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

	this way, the platform's resolve(), which removes trailing slashes from non drive root paths, will only change the path when it makes a relative path absolute, which we notice and guard against
	*/

	if (platform() == "windows") {

		//simple
		t("",     "");
		t("name", "name");

		//windows
		t("C:",                   "C:\\");//adds trailing slash to drive root
		t("C:\\",                 "C:\\");
		t("C:\\folder",           "C:\\folder");
		t("C:\\folder\\",         "C:\\folder");//removes trailing slash from folder
		t("C:\\folder\\file.ext", "C:\\folder\\file.ext");

		//case
		t("c:\\Folder", "C:\\Folder");//uppercases drive letters
		t("C:\\Folder", "C:\\Folder");

		//network
		t("\\\\",                                  "\\\\\\");//adds a third slash, but invalid anyways
		t("\\\\computer",                          "\\\\computer\\");
		t("\\\\computer\\",                        "\\\\computer\\");
		t("\\\\computer\\share",                   "\\\\computer\\share\\");//adds trailing slash to share root
		t("\\\\computer\\share\\",                 "\\\\computer\\share\\");
		t("\\\\computer\\share\\folder",           "\\\\computer\\share\\folder");
		t("\\\\computer\\share\\folder\\",         "\\\\computer\\share\\folder");//removes trailing slash from folder
		t("\\\\computer\\share\\folder\\file.ext", "\\\\computer\\share\\folder\\file.ext");

	} else {

		//simple
		t("",     "");
		t("name", "name");

		//unix
		t("/",                "/");//doesn't mess with unix root
		t("/folder",          "/folder");
		t("/folder/",         "/folder");//removes trailing slash from folder
		t("/folder/file.ext", "/folder/file.ext");

		//backslash
		t("/folder/backslash\\", "/folder/backslash\\");//mac filenames can contain backslash
		t("/\\", "/\\");//valid file named just backslash in the mac root
	}

	done(test);
}








//   ____       _   _     
//  |  _ \ __ _| |_| |__  
//  | |_) / _` | __| '_ \ 
//  |  __/ (_| | |_| | | |
//  |_|   \__,_|\__|_| |_|
//                        

//finally, test Path as a whole, in valid, invalid, and attack situations
exports.testPathValid = function(test) {

	function g(s, r) { test.ok(Path(s).text() == r); }//good source and intended result
	function b(s) { try { Path(s); test.fail(); } catch (e) { test.ok(e.name == "data"); } }//bad source

	if (platform() == "windows") {

		//windows
		g("C:",                   "C:\\");//adds trailing slash to drive root
		g("C:\\",                 "C:\\");
		g("C:\\folder",           "C:\\folder");
		g("C:\\folder\\",         "C:\\folder");//removes trailing slash from folder
		g("C:\\folder\\file.ext", "C:\\folder\\file.ext");

		//network
		b("\\\\");
		b("\\\\computer");
		b("\\\\computer\\");
		g("\\\\computer\\share",                   "\\\\computer\\share\\");//adds slash to root
		g("\\\\computer\\share\\",                 "\\\\computer\\share\\");
		g("\\\\computer\\share\\folder",           "\\\\computer\\share\\folder");
		g("\\\\computer\\share\\folder\\",         "\\\\computer\\share\\folder");//removes slash from folder
		g("\\\\computer\\share\\folder\\file.ext", "\\\\computer\\share\\folder\\file.ext");

		//unix
		b("/");//unix style paths not valid when running on windows
		b("/folder");
		b("/folder/");
		b("/folder/file.ext");

		//backslash
		b("/folder/backslash\\");//valid on mac, but not on windows
		b("/\\");//valid file named just backslash in the mac root

		//simple
		b("");
		b("name");

		//navigation
		b(".");
		b("./");
		b("..");
		b("../");
		b("../name");
		b("~");
		b("C:\\folder\\..\\name");

		//spaces
		b(" ");
		b(" name");
		b("name ");
		b(" C:\\folder");
		g("C:\\folder ", "C:\\folder ");//space at the end of foldername acceptable

		//slashes
		b("\\");
		b("\\\\");
		b("\\\\\\");
		b("//");
		b("///");
		b("\\name");
		b("name\\");
		b("/");
		b("/name");
		b("name/");
		b("C:\\folder\\\\file.ext");
		b("C:\\folder/file.ext");

		//case
		g("c:\\Folder", "C:\\Folder");//uppercases drive letter
		g("C:\\Folder", "C:\\Folder");

	} else {

		//windows
		b("C:");
		b("C:\\");
		b("C:\\folder");
		b("C:\\folder\\");
		b("C:\\folder\\file.ext");

		//network
		b("\\\\");
		b("\\\\computer");
		b("\\\\computer\\");
		b("\\\\computer\\share");
		b("\\\\computer\\share\\");
		b("\\\\computer\\share\\folder");
		b("\\\\computer\\share\\folder\\");
		b("\\\\computer\\share\\folder\\file.ext");

		//unix
		g("/",                "/");
		g("/folder",          "/folder");
		g("/folder/",         "/folder");//removes trailing slash
		g("/folder/file.ext", "/folder/file.ext");

		//backslash
		g("/folder/backslash\\", "/folder/backslash\\");//on mac, a filename can end with a backslash
		g("/\\", "/\\");//valid file named just backslash in the mac root

		//simple
		b("");
		b("name");

		//navigation
		b(".");
		b("./");
		b("..");
		b("../");
		b("../name");
		b("~");
		b("/folder/../name");

		//spaces
		b(" ");
		b(" name");
		b("name ");
		b(" /folder");
		g("/folder ", "/folder ");//no change

		//slashes
		b("\\");//valid names on mac, but relative not absolute paths
		b("\\name");
		b("name\\");
		g("/",     "/");//these two are valid unix paths, of course
		g("/name", "/name");
		b("name/");
		b("/folder//file.ext");
		g("/folder\\file.ext", "/folder\\file.ext");
	}

	done(test);
}

exports.testPathPlatform = function(test) {

	if (platform() == "windows") {

		test.ok(Path("C:\\").platform == "windows");
		test.ok(Path("C:\\file.ext").platform == "windows");
		test.ok(Path("C:\\folder\\file.ext").platform == "windows");
		test.ok(Path("Z:\\file.ext").platform == "windows");

		test.ok(Path("\\\\computer\\share\\").platform == "network");
		test.ok(Path("\\\\computer\\share\\file.ext").platform == "network");
		test.ok(Path("\\\\computer\\share\\folder\\file.ext").platform == "network");

	} else {

		test.ok(Path("/").platform == "unix");
		test.ok(Path("/file.ext").platform == "unix");
		test.ok(Path("/folder/file.ext").platform == "unix");
	}

	done(test);
}

exports.testPathUp = function(test) {

	var p;

	if (platform() == "windows") {

		//windows
		p = Path("C:\\folder1\\folder2\\folder3\\file.ext");
		test.ok(p.step.length == 5);
		test.ok(p.step[0].text() == "C:\\folder1\\folder2\\folder3\\file.ext");
		test.ok(p.step[1].text() == "C:\\folder1\\folder2\\folder3");
		test.ok(p.step[2].text() == "C:\\folder1\\folder2");
		test.ok(p.step[3].text() == "C:\\folder1");
		test.ok(p.step[4].text() == "C:\\");
		test.ok(p.up.text()   == "C:\\folder1\\folder2\\folder3");
		test.ok(p.root.text() == "C:\\");

		p = Path("C:\\file.ext");
		test.ok(p.step.length == 2);
		test.ok(p.step[0].text() == "C:\\file.ext");
		test.ok(p.step[1].text() == "C:\\");
		test.ok(p.up.text()   == "C:\\");
		test.ok(p.root.text() == "C:\\");

		p = Path("C:\\");
		test.ok(p.step.length == 1);
		test.ok(p.step[0].text() == "C:\\");
		test.ok(!p.up);
		test.ok(p.root.text() == "C:\\");

		//network
		p = Path("\\\\computer\\share\\folder1\\folder2\\file.ext");
		test.ok(p.step.length == 4);
		test.ok(p.step[0].text() == "\\\\computer\\share\\folder1\\folder2\\file.ext");
		test.ok(p.step[1].text() == "\\\\computer\\share\\folder1\\folder2");
		test.ok(p.step[2].text() == "\\\\computer\\share\\folder1");
		test.ok(p.step[3].text() == "\\\\computer\\share\\");
		test.ok(p.up.text()   == "\\\\computer\\share\\folder1\\folder2");
		test.ok(p.root.text() == "\\\\computer\\share\\");

		p = Path("\\\\computer\\share\\file.ext");
		test.ok(p.step.length == 2);
		test.ok(p.step[0].text() == "\\\\computer\\share\\file.ext");
		test.ok(p.step[1].text() == "\\\\computer\\share\\");
		test.ok(p.up.text()   == "\\\\computer\\share\\");
		test.ok(p.root.text() == "\\\\computer\\share\\");

		p = Path("\\\\computer\\share\\");
		test.ok(p.step.length == 1);
		test.ok(p.step[0].text() == "\\\\computer\\share\\");
		test.ok(!p.up);
		test.ok(p.root.text() == "\\\\computer\\share\\");

	} else {

		//unix
		p = Path("/folder1/folder2/folder3/file.ext");
		test.ok(p.step.length == 5);
		test.ok(p.step[0].text() == "/folder1/folder2/folder3/file.ext");
		test.ok(p.step[1].text() == "/folder1/folder2/folder3");
		test.ok(p.step[2].text() == "/folder1/folder2");
		test.ok(p.step[3].text() == "/folder1");
		test.ok(p.step[4].text() == "/");
		test.ok(p.up.text()   == "/folder1/folder2/folder3");
		test.ok(p.root.text() == "/");

		p = Path("/file.ext");
		test.ok(p.step.length == 2);
		test.ok(p.step[0].text() == "/file.ext");
		test.ok(p.step[1].text() == "/");
		test.ok(p.up.text()   == "/");
		test.ok(p.root.text() == "/");

		p = Path("/");
		test.ok(p.step.length == 1);
		test.ok(p.step[0].text() == "/");
		test.ok(!p.up);
		test.ok(p.root.text() == "/");

		//backslash
		p = Path("/folder/backslash\\");//on mac, a filename can end with a backslash
		test.ok(p.step.length == 3);
		test.ok(p.step[0].text() == "/folder/backslash\\");
		test.ok(p.step[1].text() == "/folder");
		test.ok(p.step[2].text() == "/");
		test.ok(p.up.text()   == "/folder");
		test.ok(p.root.text() == "/");

		p = Path("/\\");//valid file named just backslash in the mac root
		test.ok(p.step.length == 2);
		test.ok(p.step[0].text() == "/\\");
		test.ok(p.step[1].text() == "/");
		test.ok(p.up.text()   == "/");
		test.ok(p.root.text() == "/");
	}

	done(test);
}

exports.testPathParts = function(test) {

	function l(s) {//look at the result
		var p = Path(s);
		log();
		log(p.text());
		log("  name_ext  '", p.name_ext, "'");
		log("  name      '", p.name,     "'");
		log("      _ext  '", p._ext,     "'");
		log("       ext  '", p.ext,      "'");
	}
	function t(s, name_ext, name, _ext, ext) {//test the result of good input
		var p = Path(s);
		test.ok(p.name_ext == name_ext);
		test.ok(p.name     == name);
		test.ok(p._ext     == _ext);
		test.ok(p.ext      == ext);
	}
	function b(s) { try { Path(s); test.fail(); } catch (e) { test.ok(e.name == "data"); } }//bad input

	if (platform() == "windows") {

		//windows
		t("C:\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t("C:\\folder\\IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t("C:\\folder\\database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t("C:\\folder\\none",    "none",    "none",    "",  "");//no extension
		t("C:\\folder\\.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t("C:\\folder\\start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		b("C:\\folder\\.");//invalid, navigation code

		//network
		t("\\\\computer\\share\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");

		//dots
		b("C:\\.");//bad because contains navigation codes . and ..
		b("C:\\..");
		t("C:\\...",  "...",  "..",  ".", "");//more dots let through
		t("C:\\....", "....", "...", ".", "");
		t("C:\\name1.name2",   "name1.name2",   "name1",   ".name2", "name2");
		t("C:\\name1..name2",  "name1..name2",  "name1.",  ".name2", "name2");
		t("C:\\name1...name2", "name1...name2", "name1..", ".name2", "name2");

		//                     name_ext         name            _ext      ext
		t( "C:\\name1.name2.",  "name1.name2.", "name1.name2",  ".",      "");
		t("C:\\.name1.name2",  ".name1.name2",  ".name1",       ".name2", "name2");
		t("C:\\.name1.name2.", ".name1.name2.", ".name1.name2", ".",      "");

	} else {

		//unix
		t("/folder/image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t("/folder/IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t("/folder/database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t("/folder/none",    "none",    "none",    "",  "");//no extension
		t("/folder/.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t("/folder/start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		b("/folder/.");//invalid, navigation code

		//backslash
		t("/folder/backslash\\", "backslash\\", "backslash\\", "", "");//mac filenames can contain backslash
		t("/\\",                 "\\",          "\\",          "", "");
	}

	done(test);
}








//   ____       _   _       __  __       _   _     
//  |  _ \ __ _| |_| |__   |  \/  | __ _| |_| |__  
//  | |_) / _` | __| '_ \  | |\/| |/ _` | __| '_ \ 
//  |  __/ (_| | |_| | | | | |  | | (_| | |_| | | |
//  |_|   \__,_|\__|_| |_| |_|  |_|\__,_|\__|_| |_|
//                                                 

exports.testPathResolveTo = function(test) {

	function l(from, to) { log(_pathResolveTo(from, to)); }
	function t(from, to, result) { test.ok(_pathResolveTo(from, to) == result); }

	if (platform() == "windows") {

		//drive
		t("C:\\folder",     "file.ext", "C:\\folder\\file.ext");//intended use
		t("C:\\folder\\",   "file.ext", "C:\\folder\\file.ext");//allows trailing backslash
		t("C:\\folder",   "\\file.ext", "C:\\file.ext");//on filename causes it to go up
		t("C:\\folder/",    "file.ext", "C:\\folder\\file.ext");//same behavior with the wrong slash
		t("C:\\folder",    "/file.ext", "C:\\file.ext");
		t("C:\\",         "\\file.ext", "C:\\file.ext");//can't go up, so stays beneath root
		t("C:\\",          "/file.ext", "C:\\file.ext");

		//network
		t("\\\\computer\\share\\folder",     "file.ext", "\\\\computer\\share\\folder\\file.ext");//intended use
		t("\\\\computer\\share\\folder\\",   "file.ext", "\\\\computer\\share\\folder\\file.ext");//allows trailing backslash
		t("\\\\computer\\share\\folder",   "\\file.ext", "\\\\computer\\share\\file.ext");//on filename causes it to go up
		t("\\\\computer\\share\\folder/",    "file.ext", "\\\\computer\\share\\folder\\file.ext");//same behavior with the wrong slash
		t("\\\\computer\\share\\folder",    "/file.ext", "\\\\computer\\share\\file.ext");
		t("\\\\computer\\share\\",         "\\file.ext", "\\\\computer\\share\\file.ext");//can't go up
		t("\\\\computer\\share\\",          "/file.ext", "\\\\computer\\share\\file.ext");

	} else {

		//unix
		t("/folder",     "file.ext", "/folder/file.ext");//backslash is valid for a filename on mac
		t("/folder\\",   "file.ext", "/folder\\/file.ext");
		t("/folder",   "\\file.ext", "/folder/\\file.ext");
		t("/folder/",    "file.ext", "/folder/file.ext");
		t("/folder",    "/file.ext", "/file.ext");
		t("/",         "\\file.ext", "/\\file.ext");
		t("/",          "/file.ext", "/file.ext");
	}

	done(test);
}

exports.testPathCheck = function(test) {

	function l(folder, file) {
		try {
			pathCheck(Path(folder), Path(file));
			log("ok");
		} catch (e) { log(e.name, ": ", e.note); }//also show the exception note
	}
	function g(folder, file) { pathCheck(Path(folder), Path(file)); }
	function b(folder, file) {
		try {
			pathCheck(Path(folder), Path(file));
			test.fail();
		} catch (e) { test.ok(e.name == "data"); }
	}

	if (platform() == "windows") {

		//drive
		g("C:\\folder1\\folder2", "C:\\folder1\\folder2\\file.ext");//good
		b("C:\\folder1\\folder2", "C:\\folder1\\file.ext");//bad because neighboring
		b("C:\\folder1\\folder2", "C:\\file.ext");//bad because above

		//checks
		b("C:\\folder",  "C:\\folder");//data short, invalid because file must be longer
		b("C:\\folderA", "C:\\folderB\\file.ext");//data starts, invalid because file must start with folder
		b("C:\\folder1", "C:\\folder1-file.ext");//data slash, invalid because after folder in file must be a slash

		//separator
		b("C:\\folder", "C:\\folder\\");//not shorter, Path removes trailing slash
		b("C:\\folder", "C:\\folder2");//missing separating slash

		//slash
		g("C:\\folder", "C:\\folder\\file.ext");//correct slash
		b("C:\\folder", "C:\\folder/file.ext");//wrong slash, stopped by Path function

		b("C:\\folder", "C:\\folder\\");
		b("C:\\folder", "C:\\folder\\\\");
		b("C:\\folder", "C:\\folder\\/");
		g("C:\\folder", "C:\\folder\\a");

		//root
		g("C:\\", "C:\\file.ext");
		b("C:\\", "D:\\");//different drives
		b("C:\\", "D:\\file.ext");

		//case
		b("C:\\Folder", "C:\\folder\\file.ext");//actually the same folder on windows, but not ok on unix, where Folder and folder are two different folders side by side. pathCheck blocks on all platforms to be extra careful
		g("c:\\Folder", "C:\\Folder\\file.ext");//ok because Path uppercases drive letters

		//network
		g("\\\\computer\\share\\folder1\\folder2", "\\\\computer\\share\\folder1\\folder2\\file.ext");
		b("\\\\computer\\share\\folder1\\folder2", "\\\\computer\\share\\folder1\\file.ext");
		b("\\\\computer\\share\\folder1\\folder2", "\\\\computer\\share\\file.ext");

		//checks
		b("\\\\computer\\share\\folder",  "\\\\computer\\share\\folder");
		b("\\\\computer\\share\\folderA", "\\\\computer\\share\\folderB\\file.ext");
		b("\\\\computer\\share\\folder1", "\\\\computer\\share\\folder1-file.ext");

		//separator
		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\");
		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder2");

		//slash
		g("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\file.ext");
		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder/file.ext");

		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\");
		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\\\");
		b("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\/");
		g("\\\\computer\\share\\folder", "\\\\computer\\share\\folder\\a");

		//root
		g("\\\\computer\\shareC\\", "\\\\computer\\shareC\\file.ext");
		b("\\\\computer\\shareC\\", "\\\\computer\\shareD\\");//different shares
		b("\\\\computer\\shareC\\", "\\\\computer\\shareD\\file.ext");

		//case
		b("\\\\Computer\\Share", "\\\\computer\\share\\file.ext");

	} else {

		//unix
		g("/folder1/folder2", "/folder1/folder2/file.ext");//good
		b("/folder1/folder2", "/folder1/file.ext");//bad because neighboring
		b("/folder1/folder2", "/file.ext");//bad because above

		//checks
		b("/folder",  "/folder");//data short, invalid because file must be longer
		b("/folderA", "/folderB/file.ext");//data starts, invalid because file must start with folder
		b("/folder1", "/folder1-file.ext");//data slash, invalid because after folder in file must be a slash

		//separator
		b("/folder", "/folder/");//not shorter, Path removes trailing slash
		b("/folder", "/folder2");//missing separating slash

		//slash
		g("/folder", "/folder/file.ext");//correct slash
		b("/folder", "/folder\\file.ext");//wrong slash, file path is valid for mac, but stopped by pathCheck

		b("/folder", "/folder/");
		b("/folder", "/folder//");
		g("/folder", "/folder/\\");//ok because a mac file can be named just backslash
		g("/folder", "/folder/a");

		//root
		g("/", "/file.ext");

		//case
		b("/Folder", "/folder/file.ext");//importantly blocked on unix, where Folder and folder are two different folders side by side
	}

	done(test);
}

exports.testPathAdd = function(test) {

	function l(folder, name) {
		try {
			log(pathAdd(Path(folder), name));
		} catch (e) {
			log(e.name, ": ", e.note);
		}
	}
	function b(folder, name) {
		try {
			pathAdd(Path(folder), name);
			test.fail();
		} catch (e) { test.ok(e.name == "data"); }
	}
	function g(folder, name, file) {
		test.ok(file == pathAdd(Path(folder), name).text());
		test.ok(name == pathSubtract(Path(folder), Path(file)));//also use these to test subtract
		test.ok(Path(folder).add(name).text() == file);//also test using the methods on path
		test.ok(Path(file).subtract(Path(folder)) == name);
	}

	if (platform() == "windows") {

		//drive
		g("C:\\",           "file.ext", "C:\\file.ext");
		g("C:\\",        "a\\file.ext", "C:\\a\\file.ext");
		g("C:\\",     "b\\a\\file.ext", "C:\\b\\a\\file.ext");

		g("C:\\y",          "file.ext", "C:\\y\\file.ext");
		g("C:\\y",       "a\\file.ext", "C:\\y\\a\\file.ext");
		g("C:\\y",    "b\\a\\file.ext", "C:\\y\\b\\a\\file.ext");

		g("C:\\y\\z",       "file.ext", "C:\\y\\z\\file.ext");
		g("C:\\y\\z",    "a\\file.ext", "C:\\y\\z\\a\\file.ext");
		g("C:\\y\\z", "b\\a\\file.ext", "C:\\y\\z\\b\\a\\file.ext");

		//attack
		b("C:\\downloads", "..\\autoexec.bat");//directory traversal attack thwarted

		//blank
		b("C:\\folder", "");//fails round trip test

		//navigation
		b("C:\\folder", "../file.ext");//variations
		g("C:\\folder", "..file.ext", "C:\\folder\\..file.ext");//dots allowed in filename
		b("C:\\folder", ".\\file.ext");
		b("C:\\folder", "./file.ext");
		g("C:\\folder", ".file.ext",  "C:\\folder\\.file.ext");//dots allowed in filename
		b("C:\\folder1", "folder2\\..\\file.ext");//navigation valid, but blocked by round trip check

		//slashes
		b("C:\\folder", "\\file.ext");
		b("C:\\folder", "\\\\file.ext");
		b("C:\\folder", "/file.ext");
		b("C:\\", "\\file.ext");
		b("C:\\", "\\\\file.ext");
		b("C:\\", "/file.ext");

		//network
		g("\\\\c\\s\\",           "file.ext", "\\\\c\\s\\file.ext");
		g("\\\\c\\s\\",        "a\\file.ext", "\\\\c\\s\\a\\file.ext");
		g("\\\\c\\s\\",     "b\\a\\file.ext", "\\\\c\\s\\b\\a\\file.ext");

		g("\\\\c\\s\\y",          "file.ext", "\\\\c\\s\\y\\file.ext");
		g("\\\\c\\s\\y",       "a\\file.ext", "\\\\c\\s\\y\\a\\file.ext");
		g("\\\\c\\s\\y",    "b\\a\\file.ext", "\\\\c\\s\\y\\b\\a\\file.ext");

		g("\\\\c\\s\\y\\z",       "file.ext", "\\\\c\\s\\y\\z\\file.ext");
		g("\\\\c\\s\\y\\z",    "a\\file.ext", "\\\\c\\s\\y\\z\\a\\file.ext");
		g("\\\\c\\s\\y\\z", "b\\a\\file.ext", "\\\\c\\s\\y\\z\\b\\a\\file.ext");

	} else {

		//unix
		g("/",        "file.ext", "/file.ext");
		g("/",      "a/file.ext", "/a/file.ext");
		g("/",    "b/a/file.ext", "/b/a/file.ext");

		g("/y",       "file.ext", "/y/file.ext");
		g("/y",     "a/file.ext", "/y/a/file.ext");
		g("/y",   "b/a/file.ext", "/y/b/a/file.ext");

		g("/y/z",     "file.ext", "/y/z/file.ext");
		g("/y/z",   "a/file.ext", "/y/z/a/file.ext");
		g("/y/z", "b/a/file.ext", "/y/z/b/a/file.ext");

		//attack
		b("/downloads", "../autoexec.bat");//directory traversal attack thwarted

		//navigation
		b("/folder",  "../file.ext");
		g("/folder",  "..file.ext",            "/folder/..file.ext");//dot allowed in filename
		g("/folder",  ".\\file.ext",           "/folder/.\\file.ext");//dot and backslash allowed in filename
		b("/folder",  "./file.ext");
		g("/folder",  ".file.ext",             "/folder/.file.ext");
		g("/folder1", "folder2\\..\\file.ext", "/folder1/folder2\\..\\file.ext");

		//slashes
		b("/folder", "/file.ext");
		b("/folder", "//file.ext");
		g("/folder", "\\file.ext", "/folder/\\file.ext");//ok because backslash valid filename character
		b("/", "/file.ext");
		b("/", "//file.ext");
		g("/", "\\file.ext", "/\\file.ext");
	}

	done(test);
}

exports.testPathSubtract = function(test) {

	function l(folder, file) {
		try {
			log(pathSubtract(Path(folder), Path(file)));
		} catch (e) { log(e.name, ": ", e.note); }
	}
	function b(folder, file) {
		try {
			pathSubtract(Path(folder), Path(file));
			test.fail();
		} catch (e) { test.ok(e.name == "data"); }
	}
	function g(folder, file, name) {
		test.ok(name == pathSubtract(Path(folder), Path(file)));
		test.ok(file == pathAdd(Path(folder), name).text());//also use these to test add
		test.ok(Path(file).subtract(Path(folder)) == name);//also test using the methods on path
		test.ok(Path(folder).add(name).text() == file);
	}

	if (platform() == "windows") {

		//drive
		g("C:\\",     "C:\\file.ext",             "file.ext");
		g("C:\\",     "C:\\a\\file.ext",          "a\\file.ext");
		g("C:\\",     "C:\\b\\a\\file.ext",       "b\\a\\file.ext");

		g("C:\\y",    "C:\\y\\file.ext",          "file.ext");
		g("C:\\y",    "C:\\y\\a\\file.ext",       "a\\file.ext");
		g("C:\\y",    "C:\\y\\b\\a\\file.ext",    "b\\a\\file.ext");

		g("C:\\y\\z", "C:\\y\\z\\file.ext",       "file.ext");
		g("C:\\y\\z", "C:\\y\\z\\a\\file.ext",    "a\\file.ext");
		g("C:\\y\\z", "C:\\y\\z\\b\\a\\file.ext", "b\\a\\file.ext");

		//network
		g("\\\\c\\s\\",     "\\\\c\\s\\file.ext",             "file.ext");
		g("\\\\c\\s\\",     "\\\\c\\s\\a\\file.ext",          "a\\file.ext");
		g("\\\\c\\s\\",     "\\\\c\\s\\b\\a\\file.ext",       "b\\a\\file.ext");

		g("\\\\c\\s\\y",    "\\\\c\\s\\y\\file.ext",          "file.ext");
		g("\\\\c\\s\\y",    "\\\\c\\s\\y\\a\\file.ext",       "a\\file.ext");
		g("\\\\c\\s\\y",    "\\\\c\\s\\y\\b\\a\\file.ext",    "b\\a\\file.ext");

		g("\\\\c\\s\\y\\z", "\\\\c\\s\\y\\z\\file.ext",       "file.ext");
		g("\\\\c\\s\\y\\z", "\\\\c\\s\\y\\z\\a\\file.ext",    "a\\file.ext");
		g("\\\\c\\s\\y\\z", "\\\\c\\s\\y\\z\\b\\a\\file.ext", "b\\a\\file.ext");

		//bad
		b("C:\\folder", "C:\\folderfile");//fails pathCheck

	} else {

		//unix
		g("/",    "/file.ext",         "file.ext");
		g("/",    "/a/file.ext",       "a/file.ext");
		g("/",    "/b/a/file.ext",     "b/a/file.ext");

		g("/y",   "/y/file.ext",       "file.ext");
		g("/y",   "/y/a/file.ext",     "a/file.ext");
		g("/y",   "/y/b/a/file.ext",   "b/a/file.ext");

		g("/y/z", "/y/z/file.ext",     "file.ext");
		g("/y/z", "/y/z/a/file.ext",   "a/file.ext");
		g("/y/z", "/y/z/b/a/file.ext", "b/a/file.ext");

		//bad
		b("/folder/subfolder", "/folder/subfolder\\file");//fails pathCheck
	}

	done(test);
}
















