









function load(m) {//given a module, load it into global or exports


}


//and then load looks through every .js file in the same folder it's in, loading them all
/*
so now you can make new files, and stuff in files, and then just run them by their unique names
this will be great
*/




load({name:"name.subname #tag1 #tag2"}, function() {



function custom1() {
	return "hi from custom 1";
}

function custom2() {
	return "hi from custom 3";
}







return {
	main://apps in this balloon
	{ custom1, custom2 }
	test://test functions in this balloon
	core://library functions in this balloon
	only://library functions in this balloon that should be expoed only for tests


};
});






//test out the property value initializer shorthand thing in your own file right now


//get sublime to use this color in a plain text file, that should be the same as comment in js




















//alternatively

load({main:"name of demo or app, must be unique"});//name of demo or app, must be unique
load({test:"name"});//tags of what's being tested, doesn't have to be unique
load({core:"name"});





















//design without scrolling




load(function(reg) {




function app1() {

}
function app2() {

}
reg.app(app1, app2);




function core1() {

}
function core2() {

}
function core2helper() {

}
reg.core(core1, core2);
reg.coreForTest(core2helper);





function test1(test) {

}
function test2(test) {

}
reg.test(test1, test2);


exports.test1 = function(test)









});





















//current stuff, see how it changes

//call chance forever in place
if (demo("in-place")) { demoInPlace(1, 2); }
function demoInPlace(n, d) {

	var screen = pulseScreen(function() {
		stick("chance # in # is #".fill(n, d, sayUnitPerUnit(Fraction(wins, rolls), "#.######% #/#")));
	});

	var wins = 0;
	var rolls = 0;

	var go = true;
	f1();
	function f1() {
		if (go) {
			rolls++;
			if (chance(n, d)) wins++;
			wait(0, f1);
		}
	}

	keyboard("exit", function() {
		go = false;//stop generating random data
		close(screen);
		closeKeyboard();
		closeCheck();
	});
}







exports.testMax = function(test) {

	function f(v) {
		test.ok(chance(v, v));
		test.ok(randomThrough(v, v) == v);
	}

	f(Number.MAX_SAFE_INTEGER);
	f(Number.MAX_SAFE_INTEGER-1);
	f(Number.MAX_SAFE_INTEGER-2);
	f(Number.MAX_SAFE_INTEGER-50);

	done(test);
}


reg.test(function(test) {


	done(test);
})

//now you don't have to name your test functions anymore!



//reg should probably be called load
//and load should be called isolate or code or something




function load() {
	//always sticks it on exports.
	//if something, also sticks it on global, somehow
}






load(function(expose) {





function unique1() {

}
function unique2() {

}
function _uniqueHelper() {

}
expose.core({unique1, unique2});
expose.coreForTest({_uniqueHelper});




expose.main("unique1", function() {//here's a demo, choose name/demo/app

});

expose.test(function(test) {//you don't have to name your tests anymore

	done(test);
});






});



function Expose() {
	var o = {};

	o.main = function(name, f) {

	}
	o.test = function(f) {

	}
	o.core = function(m) {

	}
	o.coreForTest = function(m) {

	}



	return o;
}


function contain(f) {
	//the code below calls this once for each container
	//the given function is the container, which we can call with an expose object

	var expose = {};
	expose.main = function(name, f) {
		//make sure the name is unique
		//add it to a global list of mains
		//after loading, we'll look at the command line parameters and run the one main that's specified

	}
	expose.test = function(f) {
		//give it a sequential name
		//export it for nodeunit

	}
	expose.core = function(m) {
		//check to see the function names are available in global
		//add them

		//ok, but how do you do the non-global traditional method? how do you detect that, and then what does it mean to export them rather than adding them to global
		//can you pass one module's exports reference into another file? write a little sample taht does just that
		/*
		library1 and library2 both export some different stuff
		then pass their exports reference back up to load
		and load looks at them, and then adds more stuff to each
		does that work? it would be cool if that worked
		otherwise you'll have to have more boilerplate


		answer to question above:
		you tell if you're doing global or not from command line arguments or something
		either way, you put everything on exports
		if you're



		$ node load.js ...        this means you're using the load system, go global
		$ node something-else.js  this means you're doing it traditional, stay away from global


		$ node load main name with spaces   load core, run the uniquely named main
		$ node load test all                load core and coreForTest, run all tests
		$ node load test name with spaces
		$ node something-else.js
		$ nodeunit *.test.js                load corea nd coreForTest, run all tests

		*/



	}
	expose.coreForTest = function(m) {
		//if we're running tests, not a main, then add them like core

	}
	f(expose);//run the container, giving it the expose object, causing the code above to run


}
exports.contain = contain;





contain(function(expose) {

expose.main("unique name", function(a, b) {

});

expose.test(function(test) {

	done(test);
});

function core1() {

}
function core2() {

}
function _core2helper() {

}
expose.core({core1, core2});
expose.coreForTest({_core2helper});

});

/*
start out really light
you don't name containers
you don't name tests
main programs have unique text names, maybe with spaces
core functions have unique names




*/



