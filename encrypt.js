


var log = console.log;

var crypto = require("crypto");




try {
	var buffer = crypto.randomBytes(256);
	console.log('Have %d bytes of random data: %s', buffer.length, buffer);
} catch (e) {
	log(e);
}




