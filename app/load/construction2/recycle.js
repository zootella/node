






//load

/*
var _populateGlobal = true;//true to not have to manually import things everywhere
doesn't matter anymore because we have to use global all the time even when all the containers are in the same file
later, you could change just the top of this and switch to something that preprocessed var unpacking in each container, removing the need for global and not having to change any code
ok, but let's say you want to use this in a normal node app. ok, you'd have to write new code for that, too

var _isTest = true;//true when a test runner is running us from the command line
you don't need this anymore
only the tests get exported, so any test runner can hit this, in separate files or one single unified file
*/












contain(function(expose) {

expose.test("data", function(ok, done) {
	ok(true);
	done();
});

expose.test("data", function(ok, done) {
	ok(true);
	done();
});
expose.test("data", function(ok, done) {
	ok(true);
	done();
});

expose.test("", function(ok, done) {
	ok(true);
	done();
});
expose.test("", function(ok, done) {
	ok(true);
	done();
});

});








var testFunctions = {};

function composeTestName(n, f) {

	var name = n.replace(" ", "_");
	var number = 1;

	function composeNameAndNumber(name, number) {
		if (number == 1) return name;
		else return name + "_" + number;
	}

	while (true) {
		var nameAndNumber = composeNameAndNumber(name, number);
		if (testFunctions[nameAndNumber] === undefined) {
			testFunctions[nameAndNumber] = f;
		} else {
			number++;
		}
	}
}

function snip() {
	console.log(composeTestName("hi there"));



}
//snip();




/*
there are only three things
main - gets run from the file being run, top to bottom
core - gets globalized
test - gets exported
so there are only 3, and they can all be separate

stay with nodeunit
have a light way, and a heavy way to update one of your existing tests
no wait the light way is no change at all, and the heavy way is to switch it over to the container system
write a sample test file and then take a look at what that might look like

ok, mocha isn't what you want, tape is great
but for now just stay with nodeunit, and don't worry about pop quiz
later, switch to tape, and make pop quiz





where do you then run a main?
this is also where you give the function all the extra command line arguments
so then it doesn't have to parse them itself


ok, now try to run a test the old fashioned way, with nodeunit

all you have to do is run this file, detect nodeunit, and then export none of the core functions, but all of the tests
and that won't work in a combined file, of course, but you can write tests here that don't actually use core at all, and so they will work
*/




//main

contain(function(expose) {

expose.main("unique-name", function(a, b, c) {

});

expose.main("unique-name-2", function(a, b, c) {
	
});

});

//core

contain(function(expose) {

function testCore1(test) {
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
expose.core({testCore1, core2});
expose.core({_core2helper});//only for tests, though

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

/*
expose.test("group tag1 tag2", function(test) {
	test.ok(true);
	test.done();
});

function helper() {
	return "helped";
}
expose.test("group tag3", function(test) {
	test.ok(true);
	test.done();
});
expose.test("group tag3", function(test) {//duplicate allowed
	test.ok(helper() == "helped");
	test.done();
});
*/

});

//turn those into functions named group_tag1_tag2_2 where the last is the uniquer
//after you get this working, change "test" to "ok done"
//make sure when one fails, can you see its name enough to find it in the code, so you don't have to use line numbers
//can you use line numbers anyways, they're still there the same, right?
//compare throwing and failing in classic and new tests


//legacy tests in lots of files and the same file, below

exports.testClassic1 = function(test) {
	test.ok(true);
	test.ok(true);
	test.done();
}

exports.testClassic2 = function(test) {
	test.ok(true);
	test.ok(true);
	test.ok(true);
	test.done();
}



/*
important, have a test that shows that you can't replace global node stuff
even the stuff that's actually not on the global object
like setTimer and stuff
start from the list of global and module that you can get off the command line


show how exports isn't on global, but



*/




/*
there are test names, they are tags
then you can run all the tests tagged "text" or data or something
duplicate names are fine, the system adds -2 as needed
*/







































/*
dont worry about files
it can all be in 1 file
or you can split it into lots of files
and it doesn't matter











as many containers as you want
as many or few files as you want
anything in any file

any number of three kinds of things in a container
-main
-core
-test

*/




contain(function(expose) {




	expose.main("name", function(parameter1, parameter2) {

		console.log("starting the real program");
		if (core2() == 2)
			console.log("works as expected");


	});

	expose.main("name2", function(parameter1, parameter2) {

		console.log("oh look, it's another different program");


	});


	function core1() {
		return "hi from core1";
	}
	function core2() {
		return 2;
	}
	expose.core({core1, core2});








});

contain(function(expose) {


	function core3() {
		if (core1() == "hi from core1")
			return 3;
	}
	function core4() {
		return "four";
	}
	expose.core({core3, core4});

/*
	expose.test("area tag1 tag2 disk", function(ok, done) {
		ok(core3() == 3);
		ok(true);//all fine here
		ok(false);//explozions!
		done();
	});

	expose.test("area tag1 disk", function(ok, done) {
		ok(true);
		ok(true);
		done();
	});
	*/




	
});















