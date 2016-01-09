
require("./load").load("base", function() { return this; });

var platformChildProcesses = require("child_process");


















if (demo("child1")) { demoChild1(); }
function demoChild1() {
	log("in child, log hi");
}
//works

if (demo("parent1")) { demoParent1(); }
function demoParent1(name) {
	log("in parent, log hi");

	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child1"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });
}
//works



if (demo("child2")) { demoChild2(); }
function demoChild2() {
	log("in child, log hi");

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in child, process.in got '#'".fill(trim(d)));
		if (trim(d) == "exit") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
//works

if (demo("parent2")) { demoParent2(); }
function demoParent2(name) {
	log("in parent, log hi");

	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child2"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
//TODO both pause stdin, but nothing exits





if (demo("child3")) { demoChild3(); }
function demoChild3() {
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log("got # bytes quoted #".fill(Data(d).size(), Data(d).quote()));
		if (Data(d).quote() == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
}
//works

if (demo("parent3")) { demoParent3(); }
function demoParent3(name) {
	log("in parent, log hi");

	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child3"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});
}
//TODO exits right away



if (demo("child4")) { demoChild4(); }
function demoChild4() {
	keyboard("any", function(key) { log(inspect(key)); });
	keyboard("exit", function() { log("got exit"); closeKeyboard(); });
}
//works

if (demo("parent4")) { demoParent4(); }
function demoParent4(name) {
	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child4"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

/*
	process.stdin.resume();
	process.stdin.setRawMode(true);
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		log("got # bytes quoted #".fill(Data(d).size(), Data(d).quote()));
		if (Data(d).quote() == "1b") { log("in child, pausing process.in"); process.stdin.pause(); }
	});
*/
}











/*



if (demo("child5")) { demoChild5(); }
function demoChild5() {
	keyboard("any", function(key) { log("child ", inspect(key)); });
	keyboard("exit", function() { log("got exit"); closeKeyboard(); });
}

if (demo("parent5")) { demoParent5(); }
function demoParent5(name) {
	var child = platformChildProcesses.spawn("node", ["run_test.js", "demo", "child5"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got '#'".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit '#'".fill(trim(d))); });

	process.stdin.resume();
	process.stdin.on("data", function(d) {
		log("in parent, process.in got '#'".fill(trim(d)));//log it up ourselves
		child.stdin.write(d);//send it down to child
		if (trim(d) == "exit") { log("in parent, pausing process.in"); process.stdin.pause(); }
	});


	//for this, why not use keyboard() top and bottom, then you don't have to worry about this stuff directly
	//will it work?
	//will both close?

	//and these are node processes, actually, so you should stop writing these demos and just use fork with keyboard() messages going back and forth, that's all you need to get working for this, duh, stop using time on more general cases

	//ok, the top can't use keypress, because it needs raw data like shift being held down and stuff


}




//child3 use raw mode to see the individual keystrokes
//child4 use keyboard() and then remote control keyboard



//read a jquery book online, or watch jquery videos to learn it, i bet all you need for everything front-end is provided by jquery and easy to learn in just a few days




//run.js, run_test.js, run3_test.js

/*
ok, that works fine
now make one that can use the keyboard through it
use child.stdin.write


and then do the same sets of stuff the node way, with fork instead of spawn, and send and receive javascript objects


looks like raw mode is to get every byte, not just the bunch that end with the EOF that Ctrl+D sends


node docs are saying to not call .resume() as it swiches the stream to old mode


icarus could actually show the bytes that went back and forth to the process it's running, which would be better than terminal's weird echoing thing


there's keyboard stuff right in jquery, that might be enough for the browser/electron side of those demos

*/









//http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin/12506613#12506613





if (demo("snip")) { demoSnip(); }
function demoSnip() {

}










//use css to color two spans that flow next to each other so that you can see them distinctly, with no borders
//do this with a shine dot or gradient background
//http://www.colorzilla.com/gradient-editor/
//just diagonal, probably













/*

here's the demo progression

child logs and exits
parent runs child

child talks back and accepts exit command
parent runs child and sends exit command

demo runs pwd
demo runs notepad

child uses keyboard()
parent goes raw and works as remote





*/
















