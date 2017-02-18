






//previous load
/*
// The modules that make up the library
var worldMap = [
	"text.core.js",        // Search, convert, and adjust text
	"measure.core.js",     // Measure and communicate time, distance, and speed
	"state.core.js",       // Notice something has changed, and remember to close everything
	"list.core.js",        // Organize objects into lists and dictionaries
	"data.core.js",        // Search, encode, and manipulate binary data
	"hide.core.js",        // Encrypt, decrypt, and sign data
	"path.core.js",        // Parse file system paths
	"disk.core.js",        // Look at and change the files and folders on the disk
	"environment.core.js", // Get information about the computer we're running on
	"meter.core.js",       // Record, analyize and show how events happened over time
	"step.core.js",        // Complete processes where it's not sure what will happen later
	"flow.core.js",        // Compose and direct streams of data
	"page.core.js"         // Show the user information with HTML
];

var loaded = false;

// Load the library modules in order, avoiding duplicates
function library() {
	if (loaded) return;
	loaded = true;
	for (var i = 0; i < worldMap.length; i++) { // Loop for each file
		var module = require("./" + worldMap[i]); // Run the file and get the module with its exports
		var a = Object.keys(module);
		for (var j = 0; j < a.length; j++) {                                           // Loop for each export in the module
			var k = a[j];                                                                // The export name
			if (global[k]) {                                                             // Already in use
				console.log("Not overwriting " + k + " with duplicate in " + worldMap[i]); // Report and don't overwrite
			} else {                                                                     // Available
				global[k] = module[k];                                                     // Make it available everywhere
			}
		}
	}
}
exports.library = library;
*/







/*
// Instead of scattering which modules require which all over the place, this world map documents and defines the structure of the entire application in a single place
var worldMap = {

	// Application

	//TODO

	// Demos

	// demo_here: [], // Determine our IP addresses on the Internet
	// demo_hash: [], // Hash a file, showing speed and progress
	//stopwatch.js should be here, probably, demo of curses, time, update
	//secure erase disk task, secure erase an entire folder
	//TODO find the document and code list of larger demos, and list them all here

	// Tests and small demos

	disk_test:        ["disk", "path", "environment", "data", "state", "measure", "text"],
	path_test:        ["disk", "path", "environment", "data", "state", "measure", "text"],
	environment_test: ["disk", "path", "environment", "data", "state", "measure", "text"],


	hide_test:    ["hide",                 "state", "measure", "text"],
	data_test:    ["hide",         "data", "state", "measure", "text"],
	list_test:    ["hide", "list", "data", "state", "measure", "text"],
	state_test:   ["path", "hide",         "data", "state", "measure", "text"],
	measure_test: [                "data", "state", "measure", "text"],
	text_test:    ["disk", "environment", "data", "state", "measure", "text"],

	//TODO replace this whole section with a single core: [everything in order], and have all the tests load that, it's silly and arbitrary to cherry pick here
	base: ["page", "flow", "step", "meter", "environment", "disk", "path", "hide", "data", "list", "state", "measure", "text"],

	// Base

	net: [], // Communicate to distant peers with packets and sockets
	//TODO list more upcoming modules here, look at the old code to plan this out

	page: ["text"],


	environment: ["path"],      // Get information about the computer we're running on
	disk:  ["measure", "text"], // Look at and change the files and folders on the disk
	path:  ["measure", "text"], // Parse file system paths

	hide: ["data", "measure"],  // Encrypt, decrypt, and sign data
	data:  ["measure", "text"], // Search, encode, and manipulate binary data
	list:  ["measure", "text"], // Organize objects into lists and dictionaries
	state: ["measure", "text"], // Notice something has changed, and remember to close everything

	measure: ["text"],          // Measure and communicate time, distance, and speed
	text: []                    // Search, convert, and adjust text
}

// Load into module m all the exported functions of all the modules m requires
function load(m, f) { use(worldMap[m], f); } // Look up the calling module in the world map above to get the list of what it requires

// Load all the exported functions of the given list of modules into the calling module
function use(l, f) {
	var t = f();                              // Call the given function to get the this pointer of the calling module
	for (var i = l.length - 1; i >= 0; i--) { // Loop through the names of the modules m requires, last to first to load more fundamental things earlier
		var r = require("./" + l[i]);           // Call require() here, calling into the required module and creating more calls back here
		for (e in r) {                          // Loop for each exported function
			t[e] = r[e];                          // Enable the calling module to use the exported function
		}
	}
}

exports.load = load;
exports.use = use;
*/



/*
make this simpler
first, confirm that if you've got a b c, all of them can load all 3
node deals with circular and self references, those are fine
so then the only thing that matters is the order, so text, then measure, then everything else
once you've got that, then organize the code into groups
right now you've really only got one or two groups, base, and tests
then define a group called "base", and just have all of base include base, and each test include base
in the future, when you have uis and different apps, you'll have more groups
and in the distant future, it would be cool to have an automatic system that shows you what depends on what, granular to the function
*/

//TODO really understand how require works, what order and how many times modules are loaded

//TODO alas, this doesn't work
//or more correctly, it works too well: if A needs B, and B needs C, A has access to C, when it shouldn't
//somehow the this pointer is becomming the global pointer, which you want to stay away from
//if you say if (t === global) that will be true
//after a full evening of trying to fix it, you can't get the module pointer
//you can't add something to this in a file so that naming myFunction works without this.myFunction
//even experiments where you wrapped each entire module in a function didn't yield a solution
//using eval("var ...") does work, but that's even worse than global, for security and speed
//so, keeping it like this now. you can easily change it later if you ever figure out it's possible





/*

>applications and libraries
group into applications and libraries
in a library, everything can read everything else, and things get loaded in a defined order
when an application uses a library, it loads everything from that library in that order
for instance, everything you've written so far is in a single library called Base
make each file of demos and tests just load Base, not individual files of it

>each demo is a folder
to demo load, make groups of files in separate folders, one folder for each demo

>understand using stuff defined later
below in the same file
in a file that's later in the load order

>understand load order
log top and bottom of each file to confirm things get loaded once, and in what order
see what can use stuff defined earlier, and what can't

>confirm file isolation
confirm that if a uses b and b uses c, a can see b but not c

>preprocessor solution
the current way uses global
eval would wreck optimization
there is a way, write your own preprocessor, run load.js and it will write javascript into the top of all of the other files
it'll go between comments like // Automatically generated by load.js, so don't edit this part
have a comment in load.js that each time you change load.js you need to run load.js

>unfortunate realization to confirm first
i bet as soon as you pass out this, even when everything is in a single file, it's the global pointer
so then the only way to define local stuff is one line per function that uses the name twice
put this single file question on stack exchange
and if its impossible, then the choices are the single line global that you have, or a preprocessor that makes really big sections at the top, and i guess reads exports statements from the files

*/







/*
bridge.add(chance, random, unique, randomData);
bridge.addForTest(_somethingForTests);
*/









//flow modules
/*
exports.module.add("module name", function() {
	
//put the existing section in here
//all the code and comments for everything

return {use:{name, name, name}, test:{name, name, name}}
}

notice how code here doesn't run the function, just defines it, load runs the function
and then code in load executes all those in the right order, and tells which depend on which
and then you don't have any globals at all, coding this may offer clues into your ideas of unifying static singleton and multiple instances, and figuring out the right way to do globals
also, it no longer matters what file anything's in, it's all just about the module name, so that's easier
*/

//if you do function+"" you get the source code
//use this to make the map that shows what depends on what
//a little trick like this might be all you need
//this is short of finding jquery for javascript, something that turns your code into a dom you can walk








/*
in each file, around each group, put a function

unit("name", function() {

//don't indent
//starts with the big name
//and all the code
//what was once global is now local to the newly enclosing function, which is great

});

load.js has the unit() function
at this point, it doesn't matter what file anything's in
notice how that doesn't run the funciton in there, unit() does that, and in the prescribed order
and now maybe more code can try different dependencies and determine what depends on what with a solver, which would be really cool
you may have notes about this idea elsewhere
*/






/*
i've got a package.json that has minimum required semantic versions, like "^1.0.0", which is nice
and a node_modules folder, with the 11 modules i need in there, which is also nice
what i don't like is, i've actually got 73 node_modules folders nested deep inside there
as one module requires another, which requires the first, all different versions, and so on
has anybody written anything to flatten this?
all the modules in a single folder, a single json that shows what requires what, and a require() loader that finds it in the single list
the current way node does it, if A requires B and B requires A again, A will be there twice
*/



/*
-right now, it's easiest to always just load "base", and that's ok
-when you ship a client app, it'll be cool to have it all one file, app.js, so instead of downloading installers or portable, the user can follow easy instructions to assemble the working app, getting binaries from other places, running npm somehow, and then dropping in just one file from the user, this way they can be sure it hasn't been tapered with
-but the goal of load is beyond that, to seaprate and show exactly what depends on what, many small granular modules, and show which functions within a module
-additionally, each module should work in browser/node/electron, it should say which of those it's ready for, and automated tests should then hit it from 1, 2, or all 3, this would be really cool. you mark up at the top which environments are supported of those
*/








/*
eventually, you want to make a system that lets you create blobs of code, tag them, and then they just swim off
name something and it'll get automatically imported, and a map always shows what depends on what

for now, though, replace this load with a simple global implementation
all it does is
1 put everything on the global object
2 make sure that you never clobber anything, doing that (just like augment already does)
3 have a map in load.js that shows the order to load everything in when you load everything

that's it
*/












