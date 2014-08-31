



var platformCrypto = require("crypto");

require("./load").load("hide", function() { return this; });








//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

// True with the chances of n in d
function chance(n, d) {
	check(n, 1); // The numerator must be 1+
	check(d, n); // The denominator must be the numerator or larger
	return random(1, d) <= n; // May the odds be ever in your favor
}

// A random integer min through and including max
function random(min, max) {
	check(min, 0);   // The minimum must be 0+
	check(max, min); // The maximum must be the minimum or larger
	var i = Math.floor(Math.random() * (max - min + 1)) + min; // From the Mozilla Developer Network
	if (i < min || i > max) toss("platform", {note:"random outside bounds"}); // Astronomically rare, but documented as possible
	return i;
}

// 20 bytes of random data should be unique across all space and time
function unique() { return randomData(Size.value); }

// Make n bytes of random data
function randomData(n) {
	check(n, 1); // Can't request 0 random bytes
	try {
		return Data(platformCrypto.randomBytes(n)); // Try high quality random
	} catch (e) {
		mistakeLog({ name:"platform", caught:e, note:"using pseudo random instead" });
	}
	return Data(platformCrypto.pseudoRandomBytes(n)); // Fall back to lower quality random
}

exports.chance = chance;
exports.random = random;
exports.unique = unique;
exports.randomData = randomData;

/*
bridge.add(chance, random, unique, randomData);
bridge.addForTest(_somethingForTests);
*/

//TODO randomBytes has an async form, maybe you should be using it instead


//write hash, use it to have data.hash()



//see how slow this stuff is
//something that may take a really long time has to always be a callback
//something that will work reliably because it's all in memory, but takes 10-100ms, you might want to have synchronous and event options
//unless calling it a lot warms it up and then it starts going fast, then you can just use the synchronous option
//so, for instance, see how long it takes to generate 100 guids, and if it's more than 100ms, you should probably have an event option


//random number
//use the underscore library, _.random(a, b)



//make a RandomValve that writes random data forever, or for as long as the range you give it
//this is the only asynchronous random you'll need












