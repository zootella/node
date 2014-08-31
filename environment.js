
require("./load").load("environment", function() { return this; });






//   _____            _                                      _   
//  | ____|_ ____   _(_)_ __ ___  _ __  _ __ ___   ___ _ __ | |_ 
//  |  _| | '_ \ \ / / | '__/ _ \| '_ \| '_ ` _ \ / _ \ '_ \| __|
//  | |___| | | \ V /| | | | (_) | | | | | | | | |  __/ | | | |_ 
//  |_____|_| |_|\_/ |_|_|  \___/|_| |_|_| |_| |_|\___|_| |_|\__|
//                                                               

// The operating system platform we're running on, "windows", "mac", or "unix"
function platform() {
	var s = process.platform; // "darwin", "freebsd", "linux", "sunos" or "win32"
	if      (s == "darwin")   return "mac";     // Darwin contains win, irony
	else if (s.starts("win")) return "windows"; // Works in case s is "win64"
	else                      return "unix";
}

// The path to the present working directory our process was started with
function working() {
	try {
		return Path(process.cwd());
	} catch (e) { toss("platform", {caught:e}); } // Not a data exception because the platform should have been able to give us text that we can correctly parse into a Path object
}

exports.platform = platform;
exports.working = working;

//TODO wrap and demo other environment querying platform functions
//both from node and node webkit, which has some of it's own, you think
//here's also where you could profile memory and other performance stats of the platform your js is running on
//in addition to process.cwd(), there is also __dirname, which may be the same here, different in node webkit, you need to figure it out


