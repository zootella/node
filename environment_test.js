
require("./load").load("environment_test", function() { return this; });






//   _____            _                                      _   
//  | ____|_ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | |___| | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ 
//  |_____|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__|
//                                                               

if (demo("platform")) { demoPlatform(); }
function demoPlatform() {

	log("process.platform  ", process.platform);
	log("platform()        ", platform());

	//todo new stuff
	log(process.platform);
	log(process.version);
	log(inspect(process.versions));
}

if (demo("working")) { demoWorking(); }
function demoWorking() {

	log("process.cwd()  ", process.cwd());
	log("working()      ", working());//working() returns a Path that log calls text() on
}

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
if (demo("snip")) { demoSnip(); }
function demoSnip() {
	log(typeof window);//undefined when run by node
}














if (demo("watch")) { demoWatch(); }
function demoWatch() {

	var w = Watch(".", {ignored: ["node_modules", "electron"]}, "all", function(event, path) {
		log(event, ": ", path);
	});

	keyboard("exit", function() {
		close(w);
		closeKeyboard();
		closeCheck();
	});
}












