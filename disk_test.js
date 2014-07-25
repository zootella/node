
require("./load").load("disk_test", function() { return this; });







//actually, the next thing you need to do is check out node webkit
//see what path you get for running from here when using the app as a usb portable
//see what the file open dialog box is like, and what kind of path it gives you




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
		t(81, "C:\\folder\\\\file.ext", "C:\\folder\\file.ext");//both of these get corrected
		t(82, "C:\\folder/file.ext",    "C:\\folder\\file.ext");

		note("case");
		t(81, "c:\\Folder", "c:\\Folder");//drive letter case stays the same
		t(82, "C:\\Folder", "C:\\Folder");

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

//second, show how we prepare text before handing it to the platform functions
exports.testPathPrepare = function(test) {

	function l(s) { log("'", _pathPrepare(s), "'"); }//log the result
	function t(s, r) { test.ok(_pathPrepare(s) == r); }//test the result

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
		t("/",                   "/");//doesn't mess with unix root
		t("/folder",             "/folder");
		t("/folder/",            "/folder");//removes trailing slash from folder
		t("/folder/file.ext",    "/folder/file.ext");

		//backslash
		t("/folder/backslash\\", "/folder/backslash\\");//mac filenames can contain backslash
	}

	done(test);
}

//finally, test Path as a whole, in valid, invalid, and attack situations
exports.testPathValid = function(test) {

	function g(s, r) { test.ok(Path(s).text() == r); }//good source and intended result
	function b(s) { try { Path(s); } catch (e) { test.ok(e.name == "data"); } }//bad source

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
		b("\\");
		b("\\name");
		b("name\\");
		g("/",     "/");//these two are valid unix paths, of course
		g("/name", "/name");
		b("name/");
		b("/folder//file.ext", "/folder/file.ext");
		b("/folder\\file.ext", "/folder\\file.ext");
	}

	done(test);
}

exports.testPathPlatform = function(test) {

	done(test);
}

exports.testPathUp = function(test) {

	done(test);
}

exports.testPathRoot = function(test) {

	done(test);
}

exports.testPathParts = function(test) {

	function g(s, name_ext, name, _ext, ext) {//test the result
		var p = Path(s);
		test.ok(p.name_ext == name_ext);
		test.ok(p.name     == name);
		test.ok(p._ext     == _ext);
		test.ok(p.ext      == ext);
	}
	function b(s) { try { Path(s); } catch (e) { test.ok(e.name == "data"); } }//bad source
/*
	if (platform() == "windows") {

		//windows
		t("C:\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t("C:\\folder\\IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t("C:\\folder\\database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t("C:\\folder\\none",    "none",    "none",    "",  "");//no extension
		t("C:\\folder\\.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t("C:\\folder\\start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		t("C:\\folder\\.",       ".",       ".",       "",  "");//invalid, treats dot as the filename

		//network
		t("\\\\computer\\share\\folder\\image.jpg", "image.jpg", "image", ".jpg", "jpg");

		//unix
		t("/folder/image.jpg", "image.jpg", "image", ".jpg", "jpg");

	} else {

		//unix
		t("/folder/image.jpg", "image.jpg", "image", ".jpg", "jpg");//common
		t("/folder/IMAGE.JPG", "IMAGE.JPG", "IMAGE", ".JPG", "JPG");//caps
		t("/folder/database.backup.bin", "database.backup.bin", "database.backup", ".bin", "bin");//double extension
		t("/folder/none",    "none",    "none",    "",  "");//no extension
		t("/folder/.hidden", ".hidden", ".hidden", "",  "");//no name, but basename correctly understands this is the name
		t("/folder/start.",  "start.",  "start",   ".", "");//invalid, but handled correctly
		t("/folder/.",       ".",       ".",       "",  "");//invalid, treats dot as the filename
	}
*/





	done(test);
}






//test path up
//test path attack


//have path root, a link directly to the highestmost up, the up that has no up above it













//have one which is just the most straightforward directory traversal attack, thwarted

