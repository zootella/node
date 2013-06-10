
var log = console.log;

var fs = require("fs");
var crypto = require("crypto");
var stream = require("stream");
var util = require("util");




var stdin = process.stdin;
stdin.setRawMode(true); // so that we don't need a newline to receive data
stdin.setEncoding("utf8"); // no binary

var keyboard = {};

// stdin is paused by default
keyboard.listen = function() {
	stdin.resume();
}

// fake event emitter...
keyboard.on = function(key, cb) {
	stdin.resume();

	stdin.on("data", function (k) {
		if (k === key)
			cb();

		if (k === "\u0003")
			process.exit();
	});
}






var Hasher = function() {
	stream.Stream.call(this);
	this.writable = true;
	this.shasum = crypto.createHash("sha1");
};
util.inherits(Hasher, stream);

Hasher.prototype.write = function(data) {
	this.shasum.update(data);
	this.emit("data", data);
};

Hasher.prototype.end = function(data) {
	if (data) this.write(data);
	var digest = this.shasum.digest("hex");
	this.emit('end', digest);//send the "end" event when we're done
};




var hasher = new Hasher();

hasher.on("end", function(digest) {//receive the "end" event when hasher is done
	log("sha1 sum is: " + digest);
	process.exit();//otherwise the user will have to press control+c to get their command prompt back
});

var hashed = 0;//count how many bytes we've hashed
hasher.on("data", function(data) {
	hashed += data.length;
	log("Hashed " + hashed + " bytes");
});

keyboard.on("p", function() {
	if (!file.paused) {
		log("pausing");
		file.pause();
	}
});

keyboard.on("r", function() {
	if (file.paused) {
		log("resuming");
		file.resume();
	}
});






// The meat of the app
var file = fs.createReadStream(process.argv[2]);//command line like "node hasher.js /c/folder/file.ext", so 2 is the path to the file
file.pipe(hasher);//of the form source.pipe(target) to move data from file to hasher


//change this in steps without breaking it
//make the command line dialog box which can take input and show progress in place
//be able to run it standalone from the command line, and in a unit test from nodeunit
//you don't need pause and resume, just range, progress and stop



