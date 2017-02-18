console.log("run test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };
var thisFile = "run_test.js"; //the name of this file

































//   _____               
//  | ____|_  _____  ___ 
//  |  _| \ \/ / _ \/ __|
//  | |___ >  <  __/ (__ 
//  |_____/_/\_\___|\___|
//                       

//exec runs a separate process, returning all the output when it's done

expose.main("p10", function() { p10(); }); //try it: runs pwd in a separate process
function p10() {
    required.child_process.exec("pwd", function(error, bufferOut, bufferError) {
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

expose.main("c20", function() { c20(); }); //try it: logs up to terminal
expose.main("p20", function() { p20(); }); //try it: terminal runs p, p runs c, c logs up to p, p logs up to terminal
function p20(name) {
    log("in p, log hi");

    var c = required.child_process.spawn("node", [thisFile, "demo", "c20"]);
    c.stdout.on("data", function(d) { log("in p, c.out got:  " + Data(d).quote()); });
    c.on("exit", function(d) { log("in p, c got exit: " + Data(d).quote()); });
}
function c20() {
    log("in c, log hi");
}

expose.main("c21", function() { c21(); }); //try it: logs and exits
expose.main("c22", function() { c22(); }); //try it: runs forever, see the process with '$ ps | grep node', Ctrl+C to kill it
expose.main("p21", function() { p2("c21"); }); //try it: use spawn on log
expose.main("p22", function() { p2("c22"); }); //try it: use spawn on clock, see the 2 processes with ps, Ctrl+C kills them both
function p2(name) {
    var c = required.child_process.spawn("node", [thisFile, "demo", name]);
    c.stdout.on("data", function(d) { log("in p, c.out got:  " + Data(d).quote()); });
    c.on("exit", function(d) { log("in p, c got exit: " + Data(d).quote()); });
}
function c21() {
    log("in c, log hi");
}
function c22() {
    function f() {
        log("in c, this is the time"); //log includes the timestamp
        wait(Time.second, f); //run again in a second
    }
    f(); //start
}

//   _____          _    
//  |  ___|__  _ __| | __
//  | |_ / _ \| '__| |/ /
//  |  _| (_) | |  |   < 
//  |_|  \___/|_|  |_|\_\
//                       

//fork is like spawn but made for node, letting you send and receive messages

expose.main("c30", function() { c30(); }); //try it: logs
expose.main("p30", function() { p30(); }); //try it: logs and forks c, which logs up through p and to the terminal
function p30() {
    console.log("from p"); //use console.log() directly
    var c = required.child_process.fork("./" + thisFile, ["demo", "c30"]);
}
function c30() {
    console.log("from c");
}

//messages can be javascript types
expose.main("c31", function() { c31(); }); //don't run: this is just for fork to run, not for you to run directly from the terminal
expose.main("p31", function() { p31(); }); //try it: p sends a message down to c, c echos it back up, p logs it up to terminal, Ctrl+C to kill them both
function p31() {
    var c = required.child_process.fork("./" + thisFile, ["demo", "c31"]);
    c.send({ name: "a name", amount: 7, several: ["a", "b", "c"] }); //messages can be strings, numbers, arrays, and objects
    c.on("message", function(m) { log(m); });
}
function c31() {
    process.on("message", function(m) {
        process.send(say("name #, amount #, several #".fill(m.name, m.amount, m.several)));
    });
}

//detect if you're forked or not
expose.main("c32", function() { c32(); }); //don't run
expose.main("p32", function() { p32(); }); //try it: detect if you're forked or not
function p32() {
    log(say("in p, isFork() returns ", isFork()));
    var c = required.child_process.fork("./" + thisFile, ["demo", "c32"]);
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
expose.main("c33", function() { c33(); }); //try it: does nothing and exits
expose.main("p33", function() { p33(); }); //try it: stays running waiting for another message, you have to Ctrl+C
function p33() {
    var c = required.child_process.fork("./" + thisFile, ["demo", "c33"]);
    c.send("hello");
    c.on("message", function(m) { log(m); });
}
function c33() {
    process.on("message", function(m) {
        process.send(say("in c, got message '#'".fill(m)));
    });
}

//after p disconnects, both exit naturally
expose.main("c34", function() { c34(); }); //don't run
expose.main("p34", function() { p34(); }); //try it: after 6 seconds, both exit naturally
function p34() {
    var c = required.child_process.fork("./" + thisFile, ["demo", "c34"]);
    c.on("message", function(m) {
        log(m);
        if (m == "special done code") c.disconnect(); //allows both c and p to exit naturally
    });
    c.on("close", function(m) { log("close: ", inspect(m)); });
    c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
    c.on("error", function(m) { log("error: ", inspect(m)); });
    c.on("exit", function(m) { log("exit: ", inspect(m)); });
}
function c34() {
    process.send("will do one more thing in 6 seconds..."); //long enough to check with '$ ps | grep node'
    wait(6 * Time.second, function() { process.send("special done code"); }); //c can't close itself, but it can tell p when it's done
}

//p uses the keyboard, c finishes and exits naturally really fast
expose.main("c38", function() { c38(); }); //try it
expose.main("p38", function() { p3("c38"); }); //try it
function c38() {
    log("hi");
}
/*
c logs and exits naturally, you never even see it on activity monitor
p stays open because it's got the keyboard, "e" frees the keyboard and lets it exit
*/

//p uses the keyboard, all c does is listen for events
expose.main("c37", function() { c37(); }); //don't run
expose.main("p37", function() { p3("c37"); }); //try it
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
expose.main("c38_2", function() { c38_2(); }); //try it
expose.main("p38_2", function() { p3("c38_2"); }); //try it
function c38_2() {
    var o = {};
    o.notFound(); //throws typeerror
}
/*
all c does is throw an exception right away
node exits c, you never see it in activity monitor
"e" closes the keyboard, letting p exit naturally
*/
//TODO added _2 to make unique without figuring out why there's a duplicate

//p uses the keyboard, c stays open for 6 seconds, type "q" before and after to try out isProcessRunning()
expose.main("c39", function() { c39(); }); //try it
expose.main("p39", function() { p3("c39"); }); //try it
function c39() {
    log("set a timer to do nothing in 6 seconds...");
    wait(6 * Time.second, function() { });
}

//disconnect, kill, and sigkill with a timer and a busy loop
expose.main("c35", function() { c35(); }); //don't run
expose.main("c36", function() { c36(); }); //don't run
expose.main("p35", function() { p3("c35"); }); //try it: uses timers
expose.main("p36", function() { p3("c36"); }); //try it: uses busy loops
function p3(name) {
    var c = required.child_process.fork("./" + thisFile, ["demo", name]);
    c.on("message", function(m) { log("message: ", inspect(m)); });
    c.on("close", function(m) { log("close: ", inspect(m)); });
    c.on("disconnect", function(m) { log("disconnect: ", inspect(m)); });
    c.on("error", function(m) { log("error: ", inspect(m)); });
    c.on("exit", function(m) { log("exit: ", inspect(m)); });

    keyboard("h", function() { log("hi"); });
    keyboard("e", function() { log("closeKeyboard()"); closeKeyboard(); }); //let p exit naturally

    keyboard("d", function() { log("c.disconnect()"); c.disconnect(); });
    keyboard("w", function() { log("c.kill()"); c.kill(); }); //sends SIGTERM, which c could catch and ignore
    keyboard("s", function() { log("c.kill(SIGKILL)"); c.kill("SIGKILL"); }); //sends SIGKILL, which man signal(7) says can't be blocked or ignored

    keyboard("q", function() { log("pid type #, value #, running #".fill(typeof c.pid, c.pid, isProcessRunning(c.pid))); });
}
function c35() {
    var cycles = 3; //do this many timers
    var duration = 8 * Time.second; //each of which will take this long
    function f() {
        log("timer # before...".fill(cycles));
        wait(duration, function() {
            log("              ...after #".fill(cycles));
            cycles--;
            if (cycles) f();
        });
    }
    f(); //get started
}
function c36() {
    var cycles = 3; //do this many busy loops
    var duration = 8 * Time.second; //each of which will take this long
    function f() {
        var t = Date.now();
        log("while # before...".fill(cycles));
        while (Date.now() < t + duration); //execution sticks here for several seconds
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
























});
console.log("run test/");