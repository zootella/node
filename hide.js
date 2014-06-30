



var platformCrypto = require("crypto");

var requireData = require("./data");
var Data = requireData.Data;

var requireMeasure = require("./measure");
var log = requireMeasure.log;
var Size = requireMeasure.Size;
var check = requireMeasure.check;









//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

// True with the chances of n in d
function chance(n, d) {
	check(n, 1);
	check(d, n);
	return random(1, d) <= n;
}

// A random integer min through and including max
function random(min, max) {
	check(min, 0);   // The minimum must be 0+
	check(max, min); // The maximum must be the minimum or larger
	var i = Math.floor(Math.random() * (max - min + 1)) + min; // From the Mozilla Developer Network
	if (i < min || i > max) toss("platform"); // Astronomically rare, but documented as possible
	return i;
}





function unique() {
	return randomData(Size.value);
} // 20 bytes of random data should be globally unique
function randomData(n) {
	return Data(platformCrypto.randomBytes(n));
} // Make n bytes of random data

exports.chance = chance;
exports.random = random;
exports.unique = unique;
exports.randomData = randomData;




//write hash, use it to have data.hash()



//see how slow this stuff is
//something that may take a really long time has to always be a callback
//something that will work reliably because it's all in memory, but takes 10-100ms, you might want to have synchronous and event options
//unless calling it a lot warms it up and then it starts going fast, then you can just use the synchronous option
//so, for instance, see how long it takes to generate 100 guids, and if it's more than 100ms, you should probably have an event option






//random number
//use underscore, _.random(a, b)














