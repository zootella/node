
require("./load").load("path_test", function() { return this; });


if (demo("snippet")) { demoSnippet(); }
function demoSnippet() {




/*




//	pathLook("E:\\Desk\\test\\hello.txt", next);
//	pathLook("E:\\Desk\\test\\folder", next);
//	pathLook("E:\\Desk\\test\\notfound.ext", next);
//	pathLook("potato", next);//grows into an absolute path
//	pathLook([], next);//throws an exception right away

	function next(info) {
		log(platformUtility.inspect(info));
	}
	*/


/*
	//try with windows disk, windows share, and mac
	function f(s) {
		log();
		log("before ", s);
		log("after  ", platformPath.resolve(s));
	}

	//nonstring
	f([]);

	//relative
	f("hi");

	//windows
	f("c:");
	f("c:\\");
	f("c:\\folder");
	f("c:\\folder\\");//trailing slash
	f("c:\\folder\\file.ext");

	//share
	f("\\\\computer\\share");
	f("\\\\computer\\share\\");//trail
	f("\\\\computer\\share\\folder");
	f("\\\\computer\\share\\folder\\");//trail
	f("\\\\computer\\share\\folder\\file.ext");
	*/


	//make sure Path catches and avoids these errors
	//nonstring like () and []
	//relative, like "potato"
	//see how it deals with leading spaces and double slashes throughout





}

//TODO make this a demo so you don't ahve to hard copy drive, working, and user
//have text out say what it is supposed to do

if (demo("resolve")) { demoResolve(); }
function demoResolve() {

	function n(note) {//log a note
		log();
		log(note);
	}
	function l(note) {
		log(note);
	}
	function d(b) {//log text before and after path.resolve()
		log();
		log("  ", b);
		log("  ", _pathResovle(b));
	}
	function q(b) {//same thing, but with single quotes so you can see spaces
		log();
		log("  '", b, "'");
		log("  '", _pathResovle(b), "'");
	}

	n("a demo of how node's path.resolve() function works");

	n("1. relative paths");

	n("blank becomes the present working directory");
	q("");

	n("words become local files in the working directory");
	d("folder");

	n("a starting slash becomes the working drive root");
	d("/");
	d("\\");
	d("/folder");
	d("\\folder");

	n("resolve removes trailing slashes");
	d("folder/");
	d("folder\\");
	d("folder/subfolder");
	d("folder/subfolder/");

	n("multiple slashes are condensed");
	d("folder//");
	d("folder//subfolder//");
	d("folder\\subfolder");
	d("folder\\//\\subfolder");

	n("relative spaces remain");
	q(" space before");
	q("space after ");

	n("2. windows hard drive");

	n("for some reason, windows drive letter becomes user home");
	d("c:");
	d("C:");

	n("but later drive letters are ok");
	d("D:");
	d("M:");

	n("and adding a ending slash keeps it the same");
	l("on windows, node makes all the slashes backslashes");
	d("c:\\");
	d("c:/");

	n("spaces before and after absolute paths");
	l("space before makes resolve think the path is a local filename");
	q("C:\\folder");
	q(" C:\\space before");
	q("C:\\space after ");

	n("same thing, but with unix paths");
	l("on windows, note how node adds the pwd drive letter")
	q("/folder");
	q(" /space before");
	q("/space after ");

	n("3. windows network share");

	n("resolve adds a trailing slash to a share root");
	l("corrects it down to a single slash");
	l("and removes trailing slashes from shared folders");

	d("\\\\computer\\share");
	d("\\\\computer\\share\\");
	d("\\\\computer\\share\\\\");
	d("\\\\computer\\share\\folder");
	d("\\\\computer\\share\\folder\\");
	d("\\\\computer\\share\\folder\\\\");
	d("\\\\computer\\share\\folder\\subfolder");
	d("\\\\computer\\share\\folder\\subfolder\\");
	d("\\\\computer\\share\\folder\\subfolder\\\\");

	n("4. mac and unix paths");

	n("resolve removes trailing slashes from folders");
	l("and on windows, adds the pwd drive letter");
	l("and makes slashes backslashes");

	d("/");
	d("/folder");
	d("/folder/");
	d("/folder/subfolder");
	d("/folder/subfolder/");

	n("same set with backslashes");

	d("\\");
	d("\\folder");
	d("\\folder\\");
	d("\\folder\\subfolder");
	d("\\folder\\subfolder\\");

	n("spaces before make resolve think its relative");

	q(" /");
	q(" /space before");
	q(" /space before/");
	q(" /space before/subfolder");
	q(" /space before/subfolder/");

	n("spaces after remain");

	q("/ ");
	q("/space after ");
	q("/space after/ ");
	q("/space after/subfolder ");
	q("/space after/subfolder/ ");

	n("5. navigation codes");

	n("here and up");

	d(".");
	d("..");

	n("from that, slashes go down");

	d(".name");
	d("./");
	d("./name");
	d("..name");
	d("../");
	d("../name");

	n("full navigation");
	l("notice how you can't go higher than the root");

	d("..");
	d("../folder");
	d("../..");
	d("../../folder");
	d("../../..");
	d("../../../folder");
	d("../../../..");
	d("../../../../folder");
}


exports.testPath = function(test) {

	function g(b)    { test.ok(Path(b).text() == b); }//good paths that don't change
	function c(b, a) { test.ok(Path(b).text() == a); }//good paths that change slightly
	function t(s) {
		try {
			Path(s);
			test.fail();
		} catch (e) { test.ok(e.name == "type"); }//bad paths that throw type
	}
	function d(s) {
		try {
			Path(s);
			test.fail();
		} catch (e) { test.ok(e.name == "data"); }//bad paths that throw data
	}
	function l(s) {
		try {
			log(Path(s).text());
		} catch (e) { log(e); }
	}
/*
	if (platform() == "windows") {

		//good paths that don't change
		g("C:\\");
		g("C:\\folder");
		g("C:\\folder\\subfolder");
		g("\\\\computer\\share\\");
		g("\\\\computer\\share\\folder");
		g("\\\\computer\\share\\folder\\subfolder");

		g("C:\\file.ext");
		g("C:\\folder\\file.ext");
		g("C:\\folder\\subfolder\\file.ext");
		g("\\\\computer\\share\\file.ext");
		g("\\\\computer\\share\\folder\\file.ext");
		g("\\\\computer\\share\\folder\\subfolder\\file.ext");

		//uppercase the drive letter
		c("c:\\",                  "C:\\");
		c("c:\\folder",            "C:\\folder");
		c("c:\\folder\\subfolder", "C:\\folder\\subfolder");
		c("m:\\",                  "M:\\");
		c("m:\\folder",            "M:\\folder");
		c("m:\\folder\\subfolder", "M:\\folder\\subfolder");

		//remove a single slash from the end
		c("C:\\folder\\",                             "C:\\folder");
		c("C:\\folder\\subfolder\\",                  "C:\\folder\\subfolder");
		c("\\\\computer\\share\\folder\\",            "\\\\computer\\share\\folder");
		c("\\\\computer\\share\\folder\\subfolder\\", "\\\\computer\\share\\folder\\subfolder");

	} else {

		//good paths that don't change
		g("/");
		g("/folder");
		g("/folder/subfolder");

		g("/file.ext");
		g("/folder/file.ext");
		g("/folder/subfolder/file.ext");

		//remove a single slash from the end
		c("/folder/",           "/folder");
		c("/folder/subfolder/", "/folder/subfolder");
	}

	//string required
	t();
	t([]);
	t(7);

	//relative paths not allowed
	d("");
	d("folder");
	d("file.ext");
/*
	//some weird input not allowed
	d(" ");
	d(".");
	d("..");
	d("\\.");
	d("/.");
	d(".\\");
	d("./");
	d("\\..");
	d("/..");
	d("..\\");
	d("../");

	d(" name");
	d(".name");
	d("..name");
	d("\\.name");
	// "/.name" handled below
	d(".\\name");
	d("./name");
	d("\\..name");
	// "/..name" handled below
	d("..\\name");
	d("../name");

	if (platform() == "windows") {
		d("/.name");
		d("/..name");
	} else {
		g("/.name");
		g("/..name");
	}

	d("name ");
	d("name.");
	d("name..");
	d("name\\.");
	d("name/.");
	d("name.\\");
	d("name./");
	d("name\\..");
	d("name/..");
	d("name..\\");
	d("name../");

	//navigation codes not allowed
	d("./");
	d("./name");
	d("..");
	d("/folder/../subfolder");
	d("../../../folder/subfolder");
	d("/../../../folder/subfolder");

	//double slashes not allowed
	if (platform() == "windows") {

		c("C:\\\\", "C:\\");//works, actually
		d("C:\\folder\\\\");
		d("C:\\folder\\subfolder\\\\");

		c("\\\\computer\\share\\\\", "\\\\computer\\share\\");//also works
		d("\\\\computer\\share\\folder\\\\");
		d("\\\\computer\\share\\folder\\subfolder\\\\");

	} else {

		c("//", "/");//works
		d("/folder//");
		d("/folder/subfolder//");
	}
*/
/*
	//shortest possible paths
	if (platform() == "windows") {

		d("");

		c("C:",      "C:\\");//add trailing slash
		c("C:\\",    "C:\\");//keep trailing slash
		c("C:\\f",   "C:\\f");
		c("C:\\f\\", "C:\\f");//remove trailing slash
		d("C:\\f\\\\");

		d("\\");
		d("\\\\");
		d("\\\\c");
		c("\\\\c\\s",      "\\\\c\\s\\");//add trailing slash
		c("\\\\c\\s\\",    "\\\\c\\s\\");//keep trailing slash
		c("\\\\c\\s\\f",   "\\\\c\\s\\f");
		c("\\\\c\\s\\f\\", "\\\\c\\s\\f");//remove trailing slash
		d("\\\\c\\s\\f\\\\");

	} else {

		d("");
		d("//");
		d("///");
		d("////");

		c("/",    "/");//keep trailing slash
		c("/f",   "/f");
		c("/f/",  "/f");//remove trailing slash
		d("/f//");
	}
*/





	done(test);
}








//path.dirname
//path.basename


//p.drive()

//p.up(), or returns null
//p.nameExt()
//p.name()
//p.ext()

//should you have up, or should you return an array of folders, or an array of paths up to the drive










//notice how it returns the same thing when you give it a drive root
//you could use that to parse out teh drive root, if you wanted






















//what if small immutable objects had .text instead of .text(), and say knew to look for both









