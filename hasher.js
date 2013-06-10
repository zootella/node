
var log = console.log;


var fs = require('fs');
var crypto = require('crypto');
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
	this.shasum = crypto.createHash('sha1');
};

util.inherits(Hasher, stream);

Hasher.prototype.write = function(data) {
	this.shasum.update(data);
	this.emit('data', data);
};

Hasher.prototype.end = function(data) {
	if (data) this.write(data);
	var digest = this.shasum.digest('hex');
	this.emit('end', digest);
};

var hasher = new Hasher();



// The meat of the app
var input = fs.createReadStream(process.argv[2], {bufferSize: 50 * 1024 * 1024});
input.pipe(hasher);

// Hasher fires 'end' event when it is complete
hasher.on("end", function(hex) {
	log("sha1 sum is: " + hex);
	process.exit();
});

// Just some logging
var hashed = 0;
hasher.on("data", function(data) {
	hashed += data.length;
	log("Hashed " + hashed + " bytes");
});

keyboard.on("p", function() {
	if (!input.paused) {
		log("pausing");
		input.pause();
	}
});

keyboard.on("r", function() {
	if (input.paused) {
		log("resuming");
		input.resume();
	}
});




//change this in steps without breaking it
//make the command line dialog box which can take input and show progress in place
//be able to run it standalone from the command line, and in a unit test from nodeunit
//you don't need pause and resume, just range, progress and stop



