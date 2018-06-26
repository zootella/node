
//Latest commit a44a980 on Dec 12, 2012




//app.js

var fs       = require('fs');
var crypto   = require('crypto');
var Hasher   = require('./lib/hasher');
var keyboard = require('./lib/keyboard');

var hasher = new Hasher();

// The meat of the app
var input = fs.createReadStream(process.argv[2], {bufferSize: 50 * 1024 * 1024});
input.pipe(hasher);

// Hasher fires 'end' event when it is complete
hasher.on('end', function(hex) {
	console.log("sha1 sum is: " + hex);
	process.exit();
});

// Just some logging
var dataLength = 0;
hasher.on('data', function(data) {
	dataLength += data.length;
	console.log('hashed ' + dataLength + ' bytes');
});

keyboard.on('p', function() {
 if(!input.paused) {
		console.log('pausing');
		input.pause();
	}
});

keyboard.on('r', function() {
	if(input.paused) {
		console.log('resuming');
		input.resume();
	}
});




//lib/hasher.js

var crypto = require('crypto');
var stream = require('stream');
var util   = require("util");

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
	if(data) this.write(data);
	var digest = this.shasum.digest('hex');
	this.emit('end', digest);
};

module.exports = Hasher;




//lib/keyboard.js

var stdin = process.stdin;
stdin.setRawMode(true); // so that we don't need a newline to receive data
stdin.setEncoding('utf8'); // no binary

// stdin is paused by default
exports.listen = function() {
	stdin.resume();
}

// fake event emitter...
exports.on = function(key, cb) {
	stdin.resume();

	stdin.on('data', function (k) {
		if (k === key) {
			cb();
		}

		if (k === '\u0003') process.exit();
	});
}







