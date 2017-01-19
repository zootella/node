







//stuff to test, compare to what you end up putting in the real project

function _globalAvailable(name) {
	return (                        // Parenthesis necessary because semicolons are optional
		global[name] === undefined && // Name isn't in use on global
		name != "exports" &&          // Nor is name one of these, which aren't on global but are availale without a prefix
		name != "module"  &&
		name != "require");//TODO figure out a way to detect these instead of listing them
}
function _exportsAvailable(name) {
	return exports[name] === undefined;
}





//unit tests of that, move into real project also obviously

function ok(result) {
	console.log(result);
}
function test() {

	//we can add something to global, and then see that it's there, remove it, and see that's it's gone
	var name = "_testAddThenRemove";
	function f() { return "hi"; }
	ok((undefined === global[name]) == true);//available
	global[name] = f;//add
	ok((undefined === global[name]) == false);//occupied
	global[name] = undefined;//remove
	ok((undefined === global[name]) == true);//available once again

	//using or own functions
	ok(_globalAvailable(name) && _exportsAvailable(name));
	global[name] = f;//add to global
	ok(!_globalAvailable(name) && _exportsAvailable(name));
	exports[name] = f;//export
	ok(!_globalAvailable(name) && !_exportsAvailable(name));
	global[name] = undefined;//remove from global
	ok(_globalAvailable(name) && !_exportsAvailable(name));
	exports[name] = undefined;//unexport
	ok(_globalAvailable(name) && _exportsAvailable(name));//back to the start

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

	//make sure we block global itself
	ok(!_globalAvailable("global"));

	//stuff on global in the documentation
	ok(!_globalAvailable("Buffer"));
	ok(!_globalAvailable("clearImmediate"));
	ok(!_globalAvailable("console"));
	ok(!_globalAvailable("process"));

	//and these three, which are on global in the documentation, definitely work, but we have to block by name
	ok(!_globalAvailable("exports"));
	ok(!_globalAvailable("module"));
	ok(!_globalAvailable("require"));
}





//until then running this file runs the test

test();








