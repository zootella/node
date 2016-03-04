
require("./load").load("base", function() { return this; });

var platformChildProcess = require("child_process");




var thisFile = "run_test.js";//the name of this file








if (demo("p1")) { demoP1(); }
if (demo("c1")) { demoC1(); }
function demoP1(name) {
	log("in p, log hi");

	var c = platformChildProcess.spawn("node", [thisFile, "demo", "c1"]);
	c.stdout.on("data", function(d) { log("in p, c.out got '#'".fill((d+"").trim()));  });
	c.on("exit",        function(d) { log("in p, c got exit '#'".fill((d+"").trim())); });
}
function demoC1() {
	log("in c, log hi");
}
/*
$ demo c1
u02:51p33.099  in c, log hi

c logs up to terminal

$ demo p1
u02:52p21.558  in p, log hi
u02:52p21.681  in p, c.out got 'u02:52p21.673  in c, log hi'
u02:52p21.688  in p, c got exit '0'

terminal runs p, p runs c, c logs up to p, p logs up to terminal
*/







if (demo("p2")) { demoP2(); }
function demoP2() {
	platformChildProcess.exec("pwd", function(error, bufferOut, bufferError) {
		log("error:        " + say(error));
		log("buffer out:   " + Data(bufferOut).quote());
		log("buffer error: " + Data(bufferError).quote());
	});
}
/*
$ demo p2
h05:41p09.496  error:        null
h05:41p09.504  buffer out:   "/Users/Kevin/Dropbox/node"0a
h05:41p09.507  buffer error: 

exec runs a shell command, giving you the results when it exits
*/















//spawn lets you listen for data from streams as it arrives

if (demo("c3"))         { c3();        }//logs and exits
if (demo("c4"))       { c4();      }//runs forever, Ctrl+C to stop it
if (demo("p3"))   { p3("c3");   }//use spawn on log
if (demo("p4")) { p4("c4"); }//use spawn on clock, see the 2 processes with $ ps | grep node
function p3(name) {
	var child = platformChildProcess.spawn("node", [thisFile, "demo", name]);
	child.stdout.on("data", function(d) { log("in parent, child.out got #".fill((d+"").trim));  });
	child.on("exit",        function(d) { log("in parent, child got exit #".fill((d+"").trim)); });
}
function c3() {
	log("in child, log hi");
}
function c4() {
	function f() {
		log("in child, this is the time");//log includes the timestamp
		wait(Time.second, f);//run again in a second
	}
	f();//start
}
/*
$ demo c3
h05:45p52.207  in child, log hi

$ demo p3
$ demo c4
$ demo p4


*/
















if (demo("snip")) { demoSnip(); }
function demoSnip() {


	var r1 = 94906265;
	var r2 = 10000000;

	log(int(Number.MAX_SAFE_INTEGER));
	log(int(r1, "*", r1));
	log(int(r2, "*", r2));

	//9007199254740991
	//100000000000000
	//10000000

	//annoyingly, this didn't make it fast
	//you still want to see how many times _bothFitProduct returns true or false with the different high range to understand it better


}

































