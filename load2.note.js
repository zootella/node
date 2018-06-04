






//previous load
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






/*
if you do function+"" you get the source code
use this to make the map that shows what depends on what
a little trick like this might be all you need
this is short of finding jquery for javascript, something that turns your code into a dom you can walk
*/

/*
i've got a package.json that has minimum required semantic versions, like "^1.0.0", which is nice
and a node_modules folder, with the 11 modules i need in there, which is also nice
what i don't like is, i've actually got 73 node_modules folders nested deep inside there
as one module requires another, which requires the first, all different versions, and so on
has anybody written anything to flatten this?
all the modules in a single folder, a single json that shows what requires what, and a require() loader that finds it in the single list
the current way node does it, if A requires B and B requires A again, A will be there twice

ok, so now it's flat, thanks npm5
but has anyone written something that shows me what depends on what
*/

/*
eventually, you want to make a system that lets you create blobs of code, tag them, and then they just swim off
name something and it'll get automatically imported, and a map always shows what depends on what
that's a big idea within Flow

for now, though, replace this load with a simple global implementation
all it does is
1 put everything on the global object
2 make sure that you never clobber anything, doing that (just like augment already does)
3 have a map in load.js that shows the order to load everything in when you load everything
that's it
*/












