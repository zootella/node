
require("./load").load("base", function() { return this; });

var platformChildProcess = require("child_process");




var thisFile = "run_test.js";//the name of this file














if (demo("spawn-c")) { demoSpawnC(); }
function demoSpawnC() {
	log("in c, log hi");
}
/*
$ node run_test.js demo spawn-c
u02:51p33.099  in c, log hi

c logs up to terminal
*/

if (demo("spawn-p")) { demoSpawnP(); }
function demoSpawnP(name) {
	log("in p, log hi");

	var c = platformChildProcess.spawn("node", [thisFile, "demo", "spawn-c"]);
	c.stdout.on("data", function(d) { log("in p, c.out got '#'".fill((d+"").trim()));  });
	c.on("exit",        function(d) { log("in p, c got exit '#'".fill((d+"").trim())); });
}
/*
$ node run_test.js demo spawn-p
u02:52p21.558  in p, log hi
u02:52p21.681  in p, c.out got 'u02:52p21.673  in c, log hi'
u02:52p21.688  in p, c got exit '0'

terminal runs p, p runs c, c logs up to p, p logs up to terminal
*/









//exec runs a shell command, giving you the results when it exits

if (demo("exec-pwd"))    { demoExecPwd();    }//use exec on pwd
function demoExecPwd() {
	platformChildProcess.exec("pwd", function(error, bufferOut, bufferError) {
		log("error:        " + say(error));
		log("buffer out:   " + Data(bufferOut).quote());
		log("buffer error: " + Data(bufferError).quote());
	});
}



//spawn lets you listen for data from streams as it arrives

if (demo("log"))         { demoLog();        }//logs and exits
if (demo("clock"))       { demoClock();      }//runs forever, Ctrl+C to stop it
if (demo("spawn-log"))   { demoSpawnLog();   }//use spawn on log
if (demo("spawn-clock")) { demoSpawnClock(); }//use spawn on clock, see the 2 processes with $ ps | grep node

function demoLog() {
	log("in child, log hi");
}
function demoClock() {
	function f() {
		log("in child, this is the time");//log includes the timestamp
		wait(Time.second, f);//run again in a second
	}
	f();//start
}

function demoSpawnLog() {
	var child = platformChildProcess.spawn("node", [thisFile, "demo", "log"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got #".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit #".fill(trim(d))); });

}
function demoSpawnClock() {
	var child = platformChildProcess.spawn("node", [thisFile, "demo", "clock"]);
	child.stdout.on("data", function(d) { log("in parent, child.out got #".fill(trim(d)));  });
	child.on("exit",        function(d) { log("in parent, child got exit #".fill(trim(d))); });
}





//fork is like spawn but made for node, letting you send and receive messages


//1 basic example keeps running                top bottom
//2 sendign and receiving the close message
//3 what types you can send and which arrive

/*

simple-top
simple-bottom

close-top
close-bottom

type-top
type-bottom


c can run by itself, or p can run c


*/



//name type-notForTerminal, fork-type

if (demo("type-c_not-for-terminal")) { demoTypeC(); }
function demoTypeC() {
	process.on("message", function(m) {
		process.send(say("name #, amount #, several #".fill(m.name, m.amount, m.several)));
	});
}
if (demo("type-p")) { demoTypeP(); }
function demoTypeP() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "type-c_not-for-terminal"]);
	c.on("message", function(m) { log(m); });
	c.send({ name:"a name", amount:7, several:["a", "b", "c"] });//messages can be strings, numbers, arrays, and objects
}





function isFork() { return typeof process.send == "function"; }


//name detectNotForTerminal, fork-detect

if (demo("detect-c_not-for-terminal")) { demoDetectC(); }//not meant to be run from the terminal
if (demo("detect-p")) { demoDetectP(); }//run this one from the terminal to see both answers
function demoDetectC() {
	process.send(say("in c, isFork() returns ", isFork()));
}
function demoDetectP() {
	log(say("in p, isFork() returns ", isFork()));
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "detect-c_not-for-terminal"]);
	c.on("message", function(m) { log(m); });
}


//name log, fork-log

if (demo("log-c")) { demoDetectC(); }
if (demo("log-p")) { demoDetectP(); }
function demoDetectC() {
	console.log("from c");//yes, console.log in c goes up through p to the terminal
}
function demoDetectP() {
	console.log("from p");//use console.log() directly
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "log-c"]);
}



//name throw, fork-throw
//TODO write these






//name close-empty, fork-close-empty



if (demo("close1c")) { demoClose1C(); }//does nothing and exits
function demoClose1C() {
	process.on("message", function(m) {
		process.send(say("in c, got message '#'".fill(m)));
	});
}
if (demo("close1p")) { demoClose1P(); }//stays running waiting for another message, you have to Ctrl+C
function demoClose1P() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "close1c"]);
	c.on("message", function(m) { log(m); });
	c.send("hello");
}



//name close-disconnect-notForTerminal, fork-close-disconnect
//TODO all c is doing is listening for messages, then p disconnects, does c close or stay open?



//name close-code-notForTerminal, fork-close-code

if (demo("close2c_not-for-terminal")) { demoClose2C(); }
function demoClose2C() {
	process.send("will do one more thing in 6 seconds...");//long enough to check with $ ps | grep node
	wait(6*Time.second, function() { process.send("special done code"); });//c can't close itself, but it can tell p when it's done
}
if (demo("close2p")) { demoClose2P(); }
function demoClose2P() {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", "close2c_not-for-terminal"]);
	c.on("message", function(m) {
		log(m);
		if (m == "special done code") c.disconnect();//allows both c and p to exit on their own
	});
	c.on("close",      function(m) { log("close: ",      inspect(m)); });
	c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
	c.on("error",      function(m) { log("error: ",      inspect(m)); });
	c.on("exit",       function(m) { log("exit: ",       inspect(m)); });
}

//ok, does this work if it's in the middle of something, like a speed test
//write a c that counts to 20 seconds, sending a log every second
//write a c that does a 5 second busy loop 5 times
//and then write ps that can't close it, can close it between loops, and can close it immediately

//name close1c, close1p, close2c-not-for-terminal, close2p, and so on



//name close-timer-notForTerminal, fork-close-timer
//name close-while-notForTerminal, fork-close-while

if (demo("close3p-timer")) { demoClose3P("close3c-timer_not-for-terminal"); }
if (demo("close3p-while")) { demoClose3P("close3c-while_not-for-terminal"); }
if (demo("close3c-timer_not-for-terminal")) { demoClose3CTimer(); }
if (demo("close3c-while_not-for-terminal")) { demoClose3CWhile(); }
function demoClose3CTimer() {
	var cycles = 3;//do this many events
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
function demoClose3CWhile() {
	var cycles = 3;//do this many events
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
function demoClose3P(name) {
	var c = platformChildProcess.fork("./"+thisFile, ["demo", name]);
	c.on("message",    function(m) { log("message: ",    inspect(m)); });
	c.on("close",      function(m) { log("close: ",      inspect(m)); });
	c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
	c.on("error",      function(m) { log("error: ",      inspect(m)); });
	c.on("exit",       function(m) { log("exit: ",       inspect(m)); });

	keyboard("h", function() { log("hi");                                 });
	keyboard("e", function() { log("closeKeyboard()"); closeKeyboard();   });//let p exit

	keyboard("d", function() { log("c.disconnect()");  c.disconnect();    });
	keyboard("w", function() { log("c.kill()");        c.kill();          });//sends SIGTERM, which c could catch and ignore
	keyboard("s", function() { log("c.kill(SIGKILL)"); c.kill("SIGKILL"); });//sends SIGKILL, which man signal(7) says can't be blocked or ignored
}
/*
on mac, open activity monitor and search node to watch to watch the two process appear and disappear

c works on several events that each take several seconds, and then exits naturally
p will keep running until you press 'e' to close the keyboard

press 'h' to see p log hi even when c is in the middle of a long event

the timer demo uses a timer to make each event happen several seconds later
'de' disconnect and exit keyboard, doesn't cause c to stop early
'we' weak kill and exit keyboard, causes c to exit right away, even with a timer still set to expire
'se' strong kill and exit keyboard, same behavior

the while demo uses a busy loop to make each event take several seconds, and you can see 99% cpu usage in activity monitor
'de' causes p to get the disconnect event right away, while c is in the middle of its loop, but doesn't stop c at all
'we' and 'se' both cause c to exit immediately, even while in the middle of a loop
*/












//write one where c fights to stay open
//code that sends the signal, the signal is ignored, waits 4 seconds, the default timeout, then force kills it
//and sees that it's closed now, and logs if it's not
//do you do this with the process id, or the handle, or whatever


//do one where you get and log the process id, this is how you match it up in activity monitor, that's cool



//remember that all of this is for icarus, and simultaneously it's even more exciting to see your existing demos and tests run in electron, right there in the electron process


//if c throws, does p get to see the exception
//write a c that does {}.notfound;
//here you can call c directly



//since process.send can throw if p has closed, try and mistakeIgnore





/*
what you need to add, and where
code this so you can really see the changes in a diff

isForked() returns true if we're a child
closeCheck() if everything is good, sends all done up to parent
log() logs instead to parent if we have one
stick() logs instead to parent if we have one
keyboard() gets keys instead from parent if we have one
*/










/*
make a page that uses jquery
it has some divs on it
get the div with the keyboard focus to turn a different color
have the divs show information about the last keyboard thing that happened



*/


//how come in example 2 c.disconnect() is all you need, while in example 3 it's not enough



/*
pids are short but count upwards as more processes get made
so you can use them to identify a process

you really only need two ways to close
the nice way, with a signal up and then disconnect down
the strongest way, with sigkill

write code that closes nice
then waits 4s, and if still open, closes strong, and mistake logs it
then waits 4s, and if still open, and mistake logs that







*/






//here you are in sf



/*

blue, not run yet
yellow, running
green, done
red, done with error return code, actually use the return code

*/


















//little int

/*
unify 3type and Int into int
contents are absolute minimum
everything else is _functions

int(7)
int(7, "+", 3)






*/




exports.testIntMath = function(test) {


	function v(f) { f(); test.ok(true); }//valid
	function i(f) { try { f(); test.fail(); } catch (e) { test.ok(true); } }//invalid


	i(function() { int(); });//blank is invalid
	v(function() { int(7); });//single number is valid
	i(function() { int(7, "="); });//invalid operator
	i(function() { int(7, "+"); });//valid operator but nothing afterwards
	v(function() { int(7, "++"); });//valid operator that doesn't need anything else
	v(function() { int(7, "+", 4); });//valid operator and something else
	i(function() { int(7, "=", 4); });//invalid operator









	test.done();
}
































































