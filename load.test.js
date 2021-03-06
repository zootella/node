//console.log("load test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO






expose.test("load platform", function(ok, done) {

	//we can add something to global, and then see that it's there, remove it, and see that's it's gone
	var name = "_testAddThenRemove";
	function f() { return "hi"; }
	ok((undefined === global[name]) == true);//available
	global[name] = f;//add
	ok((undefined === global[name]) == false);//occupied
	global[name] = undefined;//remove
	ok((undefined === global[name]) == true);//available once again

	//to avoid clobbering parts of the platform, we need to detect stuff that's already there
	ok((undefined === global["Buffer"])     == false);//works, occupied
	ok((undefined === global["setTimeout"]) == false);//works, occupied
	ok((undefined === global["process"])    == false);//works, occupied
	ok((undefined === global["global"])     == false);//works, global itself shows up as occupied, which is good
	ok((undefined === global["require"])    == true);//broken, looks available
	ok((undefined === global["module"])     == true);//broken, looks available
	ok((undefined === global["exports"])    == true);//broken, looks available

	//that works fine, but these three don't
	ok((typeof require) == "function");//require is a function that we can call here
	ok((undefined === global["require"]) == true);//but it wrongly shows up as available!
	ok((undefined === module["require"]) == false);//because it's actually on module

	ok((typeof module) == "object");//module is an object
	ok((typeof module.filename) == "string");//we can use it here
	ok((undefined === global["module"]) == true);//but it wrongly shows up as available as well!

	ok((typeof exports) == "object");//exports is an object
	ok((undefined === global["exports"]) == true);//it also wrongly shows up as available

	//typeof only works when we have the questionable name explicitly written here in the code
	var nameToCheck;//undefined, trying to dereference like nameToCheck.something() would throw
	ok(typeof nameToCheck == "undefined");//detectable
	var n = "nameToCheck";
	ok(typeof n == "string");//it's the type of the variable, not the type of the name the variable contains

	done();
});
//TODO that all uses 'undefined === o["name"]' but what does it look like if you use 'n in o'

expose.test("load platform", function(ok, done) {

	function f(n) {
		try {
			function c(){}//empty function named c
			var l = {};//list of functions to copy from
			l[n] = c;//add c to the list under the given name n
			copyAllToEach(l, [global]);//try to load the list into the global
			ok(false);//make sure that throws
		} catch (e) { ok(true); }//count that it threw
	}

	//make sure we block global itself
	f("global");

	//stuff on global in the documentation
	f("Buffer");
	f("clearImmediate");
	f("console");
	f("process");

	//and these three, which are on global in the documentation, definitely work, but we have to block by name
	f("exports");
	f("module");
	f("require");

	//blank is also not ok
	f("");

	done();
});

expose.test("load copyAllToEach", function(ok, done) {

	function a() {}//empty functions named a, b, c, and d
	function b() {}
	function c() {}
	function d() {}
	function e() {}

	var d1 = {};//empty destination object
	var d2 = {d};//destination object with d already there

	ok(Object.keys(d1).length == 0);//before
	ok(Object.keys(d2).length == 1);
	copyAllToEach({a, b, c}, [d1, d2]);//copy functions a, b, and c into objects d1 and d2
	ok(Object.keys(d1).length == 3);//after, more stuff in there
	ok(Object.keys(d2).length == 4);

	try {
		copyAllToEach({e, d}, [d1, d2]);//second function has conflict on the second object
		ok(false);
	} catch (e) { ok(true); }

	done();
});

expose.test("load nameTest", function(ok, done) {

	ok(nameTest('',      {}) == 'test ""');
	ok(nameTest('name',  {}) == 'test "name"');
	ok(nameTest('a b c', {}) == 'test "a b c"');

	var o = {};
	o['test "a"'] = '';//preload the object
	o['test "c"'] = '';
	o['test "c" (2)'] = '';
	ok(nameTest('a', o) == 'test "a" (2)');//find the lowest available number
	ok(nameTest('b', o) == 'test "b"');
	ok(nameTest('c', o) == 'test "c" (3)');

	done();
});















//check which global names are already in use by node and electron
expose.main("reserved", function() {
	function check(n) {
		if (undefined === global[n]) log("ok: '#'".fill(n));
		else                         log("no: '#' is already a # that as text is: #".fill(n, typeof global[n], say(global[n]).pilcrow()));
		log();
	}

	check("setTimeout");//obviously taken everywhere
	check("_very_obscure_2");//probably not taken anywhere

	check("File");//ok in node and electron browser, but not in electron renderer
	check("Range");
	check("close");

	check("done");//ok each place
	check("end");
	check("shut");//this is why i had to rename close() to shut(), but the new name is shorter and more unique
	check("free");
});

/*
pass arguments to node, or through electron main to electron renderer
$ node load.js main process-arguments apple banana carrot
$ electron load.js main process-arguments apple banana carrot
*/
expose.main("process-arguments", function(a, b, c) {
	log("process-arguments got '#', '#', and '#'".fill(a, b, c));
});

expose.test("load function arguments", function(ok, done) {

	//two ways to get function arguments
	function f(a, b, c) {
		ok("# # #".fill(a, b, c) == "value1 value2 value3");//using named function parameters
		ok("# # #".fill(arguments[0], arguments[1], arguments[2]) == "value1 value2 value3");//using the arguments array
	};
	f("value1", "value2", "value3");//call directly

	//two ways to send function arguments
	var r = ["value1", "value2", "value3"];//prepare an array of arguments
	f.apply(this, r);//use apply to call, giving a this and the prepared array

	//example of using apply
	function f1(s) {//gets a function argument by naming it
		ok(s == "value");
	}
	function f2() {//calls f1, giving it the same arguments, without naming any of them
		f1.apply(this, arguments);
	}
	f1("value");
	f2("value");

	done();
});
//move that to wherever you put core javascript language things, actually




























expose.main("electron-x", function() {

	var pageTag = tag("<pageTag>", {
		properties: ["m"],
		template: `
			<div>
				<input type="button" value="Refresh" onClick="window.location.reload()"/>
				<p>
					<button @click="m.method1">Method 1</button>
				</p>
				<p>{{ m.message }}</p>
			</div>
		`,
		make() {
			var m = {
				id: idn(),
				message: "starting message",
				method1() {
					log("hello from method 1");
				}
			}
			return m;
		}
	});

	var page = pageTag.make();
});

/*

bookmark, electron X and notepad txt, or, everything you'll ever need to do with the window and application lifecycle
try this out in a little side folder like you did when you started with electron

how can you run your function on electron X
and how can it write a .txt file, and open it in notepad to deliver a message on shutdown

https://electronjs.org/docs/api/browser-window
close
closed
session-end, windows only

so far, you've got:

var win; // Keep a reference to the window object so it's not garbage collected, which would close the window
required.electron.app.on("ready", function() { // Electron has finished starting and is ready to make windows
	win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
	win.on("closed", function() { // The user closed the window
		win = null; // Discard our reference to the window object
	});
});
required.electron.app.on("window-all-closed", function() { // All the windows are closed
	required.electron.app.quit();
});

which is great, except, you're plan is to do everything from the renderer process
so how do you detect close there

if you want to right now write the little sample which is everything you'll ever need, it's this

the renderer process does everything
the main process doesn't even load the library, really short and simple in straight javascript (or maybe it does)

adds a tray icon (windows only), clicking shows or brings forward window
setting in code makes X and (red) quit instead of hiding
you can save and pop a notepad/textedit note
you can use the file open dialog (do you have to ipc back to main for this?)
quit button on page
you get events for window show, minimize, X, and quit
second instance shows running window and exits (with notepad note)
second instance gets the send-to path
main passes to renderer with query string instead of ipc (can you never do ipc?)
drop target on page


"When a BrowserWindow closes, a series of events will fire. I am not 100% sure about the order, but it goes like this:

onbeforeunload (renderer process)
onunload (renderer process)
close (main process on browserwindow)
closed (main process on browserwindow)"

so, just program a log that pops notepad
log from browser process.txt
log from renderer process.txt
just see them update in sublime

have everything try to listen to every event
do tests on mac and win where you show and hide things and quit and whatnot
and use that to guide a strategy, and google to see if that strategy is used





program/tray
following electron getting started
not going to unify load.js

https://electronjs.org/docs/tutorial/first-app





*/









































});
//console.log("load test/");