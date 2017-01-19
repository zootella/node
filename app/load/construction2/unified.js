






//load



var _populateGlobal = true;
var _isTest = false;


function contain(container) {//takes the container function we call with the expose object

	//you could do that once, not once for each call here to contain()
	var expose = {};//setup the expose object so the container has methods to call to give us stuff
	expose.core = function(functions) {//an object of core functions
		var keys = Object.keys(functions);
		for (var i = 0; i < keys.length; i++) {

			if (exports[keys[i]] === undefined) {
				exports[keys[i]] = functions[keys[i]];
				console.log("exported " + keys[i]);
			} else {
				console.log("can't export duplicate " + keys[i]);
			}

			if (_populateGlobal) {
				if (global[keys[i]] === undefined && module[keys[i]] === undefined) {
					global[keys[i]] = functions[keys[i]];
					console.log("globalized " + keys[i]);
				} else {
					console.log("can't globalize duplicate " + keys[i]);
				}
			}
		}
	}
	expose.testOnly = function(functions) {//an object of core functions that should only be public for testing
	}
	expose.test = function(test) {//a single unnamed test routine
	}
	expose.main = function(name, main) {//given one uniquely named main function the command line may have told us to run
	}

	container(expose);//this call causes the functions above to run

}




//main

contain(function(expose) {

});

contain(function(expose) {

});

//core

contain(function(expose) {

function core1() {
	if (core4() == "hi from core4")
		return "hi from core1";
}
function core2() {
	if (_core2helper() == "help")
		return "hi from core2";
}
function _core2helper() {
	return "help";
}
expose.core({core1, core2});
expose.testOnly({_core2helper});

});



contain(function(expose) {

function core3() {
	if (core2() == "hi from core2")
		return "hi from core1";
}
function core4() {
	return "hi from core4";
}
expose.core({core3, core4});

});

//test

contain(function(expose) {

});

contain(function(expose) {

});





function _globalAvailable(name) {
	return ( // Parenthesis necessary because semicolons are optional
		global[name] === undefined && // Name isn't in use on global
		module[name] === undefined && // Or module, which "require" is
		name != "module" &&           // Nor is it the obviously taken "module" and "exports"
		name != "exports");//TODO figure out a way to detect these instead of listing them
}
function _exportsAvailable(name) {
	return exports[name] === undefined;
}







/*
important, have a test that shows that you can't replace global node stuff
even the stuff that's actually not on the global object
like setTimer and stuff
start from the list of global and module that you can get off the command line


show how exports isn't on global, but



*/














