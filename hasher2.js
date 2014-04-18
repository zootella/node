
var systemFile = require("fs");
var systemCrypto = require("crypto");
var systemStream = require("stream");
var systemUtil = require("util");

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var now = requireMeasure.now;
var items = requireMeasure.items;
var Duration = requireMeasure.Duration;
var saySizeBytes = requireMeasure.saySizeBytes;
var sayTime = requireMeasure.sayTime;
var saySpeedDivide = requireMeasure.saySpeedDivide;
var divideByZero = requireMeasure.divideByZero;




var Hasher = function() {
	systemStream.Stream.call(this);
	this.writable = true;
	this.shasum = systemCrypto.createHash("sha1");
};
systemUtil.inherits(Hasher, systemStream);

Hasher.prototype.write = function(data) {
	this.shasum.update(data);
	this.emit("data", data);
};

Hasher.prototype.end = function(data) {
	if (data) this.write(data);
	var digest = this.shasum.digest("hex");
	this.emit("end", digest);//send the "end" event when we're done
};

var hasher = new Hasher();

var start = now();
var size = 0;//how many bytes we've hashed
var chunks = 0;//how many chunks passed through

hasher.on("data", function(data) {
	chunks++;
	size += data.length;
});

hasher.on("end", function(digest) {//receive the "end" event when hasher is done
	var time = Duration(start).time();

	log(digest);
	log(saySpeedDivide(size, time), ": ", saySizeBytes(size), " in ", sayTime(time));
	log(items(chunks, "chunk"), ", ", saySizeBytes(divideByZero(size, chunks).round), " average chunk size");
});



var file = systemFile.createReadStream(process.argv[2]);//command line like "node hasher2.js /c/folder/file.ext", so 2 is the path to the file
file.pipe(hasher);//of the form source.pipe(target) to move data from file to hasher

log("started");



//try on an empty file
//compare speed to raw command line, where do you have sha1sum anyways?





