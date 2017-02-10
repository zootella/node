


//load.js

// Prepare and return the single expose object that we'll pass into every container
function Expose() {

	// Keep references to all the program's main, core, and test functions
	var mains = {}; // Must have unique names, we'll run a single one after loading
	var cores = {}; // Must have unique names, added to global so code everywhere can use them
	var tests = {}; // We'll give a test a unique name, added to exports for a command line test runner

	// Determine if we can use the given name for a new main, core, or test
	function mainNameAvailable(n) { return typeof n == "string" && n != "" && mains[n] === undefined; }
	function coreNameAvailable(n) { return typeof n == "string" && n != "" && cores[n] === undefined && global[n] === undefined && n != "exports" && n != "module" && n != "require"; }
	function testNameAvailable(n) { return typeof n == "string" && n != "" && tests[n] === undefined && exports[n] === undefined; }

	var o = {};
	o.main = function(n, f) { // Takes a single main function, and its unique name
		if (!mainNameAvailable(n)) throw new Error("duplicate main: " + n);
		mains[n] = f;
	}
	o.core = function(l) { // Takes an object of one or more core functions with unique names
		var k = Object.keys(l);
		for (var i = 0; i < k.length; i++) { // Loop for each core function in the given object
			var n = k[i];      // Get the name
			var f = l[k[i]];   // Get the function
			if (!coreNameAvailable(n)) throw new Error("duplicate core: " + n); // Make sure we don't change something on global
			cores[n] = f;
			global[n] = f;
		}
	}
	o.test = function(n, f) { // Takes a single test function that doesn't even need a name
		if (n == "") { n = "test"; } else { n = "test_" + n; } // Prefix with "test_"
		while (n.includes(" ")) n = n.replace(" ", "_"); // Turn tags separated by spaces into a function name with underscores
		var i = 1;
		function compose(n, i) { return i == 1 ? n : n + "_" + i; } // Stick _2 or _3 on the end if necessary
		while (!testNameAvailable(compose(n, i))) i++; // Loop until we find a unique name
		n = compose(n, i);
		if (!testNameAvailable(n)) throw new Error("duplicate test: " + n); // Make sure we don't replace an export
		tests[n] = f;
		exports[n] = f;
		console.log(n);
	}
	return o;
}
var _expose = Expose(); // Make one expose object
function contain(container) { container(_expose); } // Use it for each container


(function() { // Contain the code below in a function without a name, function()
})(); // Run the code above, the () on the end runs the function





/*
solution package
contain load in a custom one-off way like this

function load() {
}
load();//run this file

or like this


then you can factor out main/core/testNameAvailable
use it to check and then globalize contain
build up var expose inline, rather than in an Expose object

stuff load does
1 make the expose object
2 define and globalize the contain function
3 find all the local files, and require each of them, they call contain back at us
4 run a main, if one was requested


*/



/*
don't worry about those tests of coreNameAvailable, keep it separate from here
check and then put contain on global
how does load work, is that in a container too, proably not

see that you can convert tests, running them halfway through, all with nodeunit on the commadn line
see that you can run demos
see that you can merge in electron files and run electron

overall what you're trying to build is
tests and demos from the commadn line
from electron
and then, familiar spirit
*/



















//name1.core.js

//var contain = require("load").contain;


/*
ok, how does this work?
the command line always calls load
$ node load arg1 arg2 arg3

load looks in the current file for *.core.js, *.main.js, *.test.js
it loops through that list, require()ing them all
at the top of each of those files is

var contain = require("load").contain;
this gets them contain, the only export they need

yeah, this will probably be how it works


>simpler
put contain on global, duh
$ node load
is always the starting point
that code loops through *.core.js etc, requiring each one
they run on require, they don't have to require anything back, because all they need is contain, which is already on global
this is great, you've got a unidirectional require system in place




alternatively, of course, there are no files with those names, and the whole thing is just right in the one file, load.js


*/


/*
the electron files

standard         --> yours
----                 ----
index.html           index.html
main.js              electron.js
package.json         package.json
page.js              load.js
style.css            style.css


develop configuration
==
package.json

electron.js
load.js

name1.main.js
name2.main.js
name3.main.js

name4.core.js
name4.test.js

name5.core.js
name5.test.js

name6.core.js
name6.test.js

index.html
style.css
==

ship configuration
==
package.json
electron.js
name.html
==

instructions configuration
==
name.txt
==




*/





//name2.core.js



//name1.test.js
//name2.test.js


/*
make to work with
-converting tests part way through, with old ones in the container
-multiple files
-electron
*/


























