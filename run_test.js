
require("./load").load("base", function() { return this; });

var platformChildProcess = require("child_process");

var thisFile = "run_test.js";//the name of this file

































//   _____               
//  | ____|_  _____  ___ 
//  |  _| \ \/ / _ \/ __|
//  | |___ >  <  __/ (__ 
//  |_____/_/\_\___|\___|
//                       

//exec runs a separate process, returning all the output when it's done

if (demo("p10")) { p10(); }//try it: runs pwd in a separate process
function p10() {
	platformChildProcess.exec("pwd", function(error, bufferOut, bufferError) {
		log("error:        " + say(error));
		log("buffer out:   " + Data(bufferOut).quote());
		log("buffer error: " + Data(bufferError).quote());
	});
}

//   ____                             
//  / ___| _ __   __ ___      ___ __  
//  \___ \| '_ \ / _` \ \ /\ / / '_ \ 
//   ___) | |_) | (_| |\ V  V /| | | |
//  |____/| .__/ \__,_| \_/\_/ |_| |_|
//        |_|                         

//spawn runs a separate process, sending data and exit events

if (demo("c20")) { c20(); }//try it: logs up to terminal
if (demo("p20")) { p20(); }//try it: terminal runs p, p runs c, c logs up to p, p logs up to terminal
function p20(name) {
	log("in p, log hi");

	var c = platformChildProcess.spawn("node", [thisFile, "demo", "c20"]);
	c.stdout.on("data", function(d) { log("in p, c.out got:  " + Data(d).quote()); });
	c.on("exit",        function(d) { log("in p, c got exit: " + Data(d).quote()); });
}
function c20() {
	log("in c, log hi");
}

if (demo("c21")) { c21();     }//try it: logs and exits
if (demo("c22")) { c22();     }//try it: runs forever, see the process with '$ ps | grep node', Ctrl+C to kill it
if (demo("p21")) { p2("c21"); }//try it: use spawn on log
if (demo("p22")) { p2("c22"); }//try it: use spawn on clock, see the 2 processes with ps, Ctrl+C kills them both
function p2(name) {
	var c = platformChildProcess.spawn("node", [thisFile, "demo", name]);
	c.stdout.on("data", function(d) { log("in p, c.out got:  " + Data(d).quote()); });
	c.on("exit",        function(d) { log("in p, c got exit: " + Data(d).quote()); });
}
function c21() {
	log("in c, log hi");
}
function c22() {
	function f() {
		log("in c, this is the time");//log includes the timestamp
		wait(Time.second, f);//run again in a second
	}
	f();//start
}

//   _____          _    
//  |  ___|__  _ __| | __
//  | |_ / _ \| '__| |/ /
//  |  _| (_) | |  |   < 
//  |_|  \___/|_|  |_|\_\
//                       

//fork is like spawn but made for node, letting you send and receive messages

if (demo("c30")) { c30(); }//try it: logs
if (demo("p30")) { p30(); }//try it: logs and forks c, which logs up through p and to the terminal
function p30() {
	console.log("from p");//use console.log() directly
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c30"]);
}
function c30() {
	console.log("from c");
}

//messages can be javascript types
if (demo("c31")) { c31(); }//don't run: this is just for fork to run, not for you to run directly from the terminal
if (demo("p31")) { p31(); }//try it: p sends a message down to c, c echos it back up, p logs it up to terminal, Ctrl+C to kill them both
function p31() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c31"]);
	c.send({ name:"a name", amount:7, several:["a", "b", "c"] });//messages can be strings, numbers, arrays, and objects
	c.on("message", function(m) { log(m); });
}
function c31() {
	process.on("message", function(m) {
		process.send(say("name #, amount #, several #".fill(m.name, m.amount, m.several)));
	});
}

//detect if you're forked or not
if (demo("c32")) { c32(); }//don't run
if (demo("p32")) { p32(); }//try it: detect if you're forked or not
function p32() {
	log(say("in p, isFork() returns ", isFork()));
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c32"]);
	c.on("message", function(m) { log(m); });
}
function c32() {
	process.send(say("in c, isFork() returns ", isFork()));
}

//   _____      _ _   
//  | ____|_  _(_) |_ 
//  |  _| \ \/ / | __|
//  | |___ >  <| | |_ 
//  |_____/_/\_\_|\__|
//                    

//stays running waiting for another message
if (demo("c33")) { c33(); }//try it: does nothing and exits
if (demo("p33")) { p33(); }//try it: stays running waiting for another message, you have to Ctrl+C
function p33() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c33"]);
	c.send("hello");
	c.on("message", function(m) { log(m); });
}
function c33() {
	process.on("message", function(m) {
		process.send(say("in c, got message '#'".fill(m)));
	});
}

//after p disconnects, both exit naturally
if (demo("c34")) { c34(); }//don't run
if (demo("p34")) { p34(); }//try it: after 6 seconds, both exit naturally
function p34() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "c34"]);
	c.on("message", function(m) {
		log(m);
		if (m == "special done code") c.disconnect();//allows both c and p to exit naturally
	});
	c.on("close",      function(m) { log("close: ",      inspect(m)); });
	c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
	c.on("error",      function(m) { log("error: ",      inspect(m)); });
	c.on("exit",       function(m) { log("exit: ",       inspect(m)); });
}
function c34() {
	process.send("will do one more thing in 6 seconds...");//long enough to check with '$ ps | grep node'
	wait(6*Time.second, function() { process.send("special done code"); });//c can't close itself, but it can tell p when it's done
}

//p uses the keyboard, c finishes and exits naturally really fast
if (demo("c38")) { c38();     }//try it
if (demo("p38")) { p3("c38"); }//try it
function c38() {
	log("hi");
}
/*
c logs and exits naturally, you never even see it on activity monitor
p stays open because it's got the keyboard, "e" frees the keyboard and lets it exit
*/

//p uses the keyboard, all c does is listen for events
if (demo("c37")) { c37();     }//don't run
if (demo("p37")) { p3("c37"); }//try it
function c37() {
	process.on("message", function(m) {
		process.send(say("in c, got message '#'".fill(m)));
	});
}
/*
all c is doing is listening for events
"d" disconnects, c exits naturally
"e" closes the keyboard, p exits naturally
*/

//p uses the keyboard, c throws
if (demo("c38")) { c38();     }//try it
if (demo("p38")) { p3("c38"); }//try it
function c38() {
	var o = {};
	o.notFound();//throws typeerror
}
/*
all c does is throw an exception right away
node exits c, you never see it in activity monitor
"e" closes the keyboard, letting p exit naturally
*/

//p uses the keyboard, c stays open for 6 seconds, type "q" before and after to try out isProcessRunning()
if (demo("c39")) { c39();     }//try it
if (demo("p39")) { p3("c39"); }//try it
function c39() {
	log("set a timer to do nothing in 6 seconds...");
	wait(6*Time.second, function() {});
}

//disconnect, kill, and sigkill with a timer and a busy loop
if (demo("c35")) { c35();     }//don't run
if (demo("c36")) { c36();     }//don't run
if (demo("p35")) { p3("c35"); }//try it: uses timers
if (demo("p36")) { p3("c36"); }//try it: uses busy loops
function p3(name) {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", name]);
	c.on("message",    function(m) { log("message: ",    inspect(m)); });
	c.on("close",      function(m) { log("close: ",      inspect(m)); });
	c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
	c.on("error",      function(m) { log("error: ",      inspect(m)); });
	c.on("exit",       function(m) { log("exit: ",       inspect(m)); });

	keyboard("h", function() { log("hi");                                 });
	keyboard("e", function() { log("closeKeyboard()"); closeKeyboard();   });//let p exit naturally

	keyboard("d", function() { log("c.disconnect()");  c.disconnect();    });
	keyboard("w", function() { log("c.kill()");        c.kill();          });//sends SIGTERM, which c could catch and ignore
	keyboard("s", function() { log("c.kill(SIGKILL)"); c.kill("SIGKILL"); });//sends SIGKILL, which man signal(7) says can't be blocked or ignored

	keyboard("q", function() { log("pid type #, value #, running #".fill(typeof c.pid, c.pid, isProcessRunning(c.pid))); });
}
function c35() {
	var cycles = 3;//do this many timers
	var duration = 8*Time.second;//each of which will take this long
	function f() {
		log("timer # before...".fill(cycles));
		wait(duration, function() {
			log("              ...after #".fill(cycles));
			cycles--;
			if (cycles) f();
		});
	}
	f();//get started
}
function c36() {
	var cycles = 3;//do this many busy loops
	var duration = 8*Time.second;//each of which will take this long
	function f() {
		var t = Date.now();
		log("while # before...".fill(cycles));
		while (Date.now() < t + duration);//execution sticks here for several seconds
		log("              ...after #".fill(cycles));
		cycles--;
		if (cycles) wait(0, f);
	}
	f();
}
/*
on mac, open activity monitor and search node to watch to watch the two process appear and disappear

c works on several events that each take several seconds, and then exits naturally
p will keep running until you press 'e' to close the keyboard

press 'h' to see p log hi even when c is in the middle of a long event
press 'q' to see p query if c is running

the timer demo p35 uses a timer to make each event happen several seconds later
'de' disconnect and exit keyboard, doesn't cause c to stop early
'we' weak kill and exit keyboard, causes c to exit right away, even with a timer still set to expire
'se' strong kill and exit keyboard, same behavior

the while demo p36 uses a busy loop to make each event take several seconds, and you can see 99% cpu usage in activity monitor
'de' causes p to get the disconnect event right away, while c is in the middle of its loop, but doesn't stop c at all
'we' and 'se' both cause c to exit immediately, even while in the middle of a loop
*/






































