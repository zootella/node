
var platformChildProcesses = require("child_process");

var log = console.log;
log("running parent");








var child = platformChildProcesses.spawn("node", ["child.js"]);

child.stdin.write("hello you");

child.stdout.on("data", function(d) {
	log("parent got data:");
	log(d+"");
})

child.stderr.on("data", function(d) {
	log("parent got error:");
	log(d+"");
});

child.on("exit", function (exitCode) {
	log("child exited:");
	log(exitCode+"");
});


setTimeout(function() {
	log("killing child process");
	child.kill();
}, 4000);











