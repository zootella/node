
var systemFile = require("fs");
var systemCrypto = require("crypto");
var systemStream = require("stream");
var systemUtil = require("util");

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var scale = requireMeasure.scale;
var now = requireMeasure.now;
var Time = requireMeasure.Time;
var Speed = requireMeasure.Speed;
var items = requireMeasure.items;
var Duration = requireMeasure.Duration;
var Average = requireMeasure.Average;
var saySize = requireMeasure.saySize;
var sayTime = requireMeasure.sayTime;
var saySpeed = requireMeasure.saySpeed;

var multiply = requireMeasure.multiply;
var divide = requireMeasure.divide;
var check = requireMeasure.check;





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
var average = Average();//average size of a chunk


var timeStart = now();
var timeFirstData;
var timeEnd;


hasher.on("data", function(data) {
	chunks++;
	size += data.length;
	/*
	size += data.length;
	chunks++;
	average.add(data.length);
	*/
});
//if this is a no-op, the whole thing goes a lot faster, not sure why

hasher.on("end", function(digest) {//receive the "end" event when hasher is done
	var time = Duration(start).time();

	log(digest);
	log(items(chunks, "chunk"));
	log(saySize(size), " (", items(size, "byte"), ")");
	log(sayTime(time));
	log(saySpeed(scale(time, 1000, size).));

//bytes/chunk
//does say fraction produce error text, not throw, on divide by 0? if not, code it, you need it for bytes/chunk
	/*
	log("hashed ", saySize(size), " in ", sayTime(time), " at ", saySpeed(scale(size, Time.second, time)));
	log(items(chunks, "chunks"), " of average size ", saySize(average.average()));
	*/

});



var file = systemFile.createReadStream(process.argv[2]);//command line like "node hasher2.js /c/folder/file.ext", so 2 is the path to the file
file.pipe(hasher);//of the form source.pipe(target) to move data from file to hasher

log("started");








//in divide, have a round that rounds up or down depending on what's closer, up if exactly half, don't need to worry about negative because divide doesn't support negative anyway





