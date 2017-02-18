console.log("environment test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };




//   _____            _                                      _   
//  | ____|_ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | |___| | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ 
//  |_____|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__|
//                                                               

expose.main("platform", function() {

	log("process.platform  ", process.platform);
	log("platform()        ", platform());

	//todo new stuff
	log(process.platform);
	log(process.version);
	log(inspect(process.versions));
});

expose.main("working", function() {

	log("process.cwd()  ", process.cwd());
	log("working()      ", working());//working() returns a Path that log calls text() on
});

//TODO try these on every platform, including:
//command lines: desktop windows git, windows dos, desktop mac, desktop ubuntu, linode debian or whatever
//node webkit windows: desktop windows drive, desktop windows network share, desktop mac, desktop ubuntu

//get node webkit going so you can run it from windows disk, windows share, and mac, and linux
//see what paths look like from the file open and choose folder dialog boxes




/*
3 ways to do the same thing:

working()
__dirname
and the way you build in path

so that's fine, just make a test that shows that they're all the same, and then use path, probably
*/




/*
jquery doesn't work when window is undefined
write tests that show this in the three processes:
-node (undefined)
-electron main (undefined)
-electron page (defined)
and include that in environment, is there a page or not, essentially
*/
expose.main("snip-environment", function() {
	log(typeof window);//undefined when run by node
});














expose.main("watch", function() {

	var w = Watch(".", {ignored: ["node_modules", "electron"]}, "all", function(event, path) {
		log(event, ": ", path);
	});

	keyboard("exit", function() {
		close(w);
		closeKeyboard();
		closeCheck();
	});
});











});
console.log("environment test/");