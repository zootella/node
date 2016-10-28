
var platformCrypto = require("crypto");
















//   ____                 _                 
//  |  _ \ __ _ _ __   __| | ___  _ __ ___  
//  | |_) / _` | '_ \ / _` |/ _ \| '_ ` _ \ 
//  |  _ < (_| | | | | (_| | (_) | | | | | |
//  |_| \_\__,_|_| |_|\__,_|\___/|_| |_| |_|
//                                          

// True with the chances of n in d
function chance(n, d) {
	min1(n);                    // The numerator must be 1+
	checkMin(d, n);             // The denominator must be the numerator or larger
	return _randomUnder(d) < n; // May the odds be ever in your favor
}

// Pick a random value a through b, like 1-6 for a dice to get 1 2 3 4 5 6
function randomThrough(a, b) {
	min0(a);        // The minimum must be 0+
	checkMin(b, a); // The maximum must be the minimum or larger
	return _randomUnder(b - a + 1) + a;
}

// Pick a random value from amongst v possibilities, like 10 to get 0-9, or 256 to get 0-255, exact powers of 2 are the fastest
function randomUnder(v) { min1(v); return _randomUnder(v); }
function _randomUnder(v) {
	while (true) { // Loop until we roll an r small enough to use
		var r = _randomPower(v);
		if (r < v) return r;
	}
}
function _randomPower(v) { // Given a number of values, pick a random from amongst a power of 2 that is v or bigger
	var h = 0, r = 0, p = 0;
	while (true) {             // Loop until h is big enough to cover v, return random r which might work
		h += p;                  // High h gets every p
		if (randomBit()) r += p; // Random r gets p half the time
		if (h > v - 2) return r; // Ok if v - 2 is negative, h + 2 could go over max safe int
		p = !p ? 1 : 2*p;        // Double power what we add each time, p 0 1 2 4 8 16...
	}
}

// Get a random bit 0 or 1
var _randomBuffer = null; // Caching more than Size.value 20 bytes doesn't make it faster
var _bitIndex  = 0;
var _byteIndex = 0;
function randomBit() {
	if (!_randomBuffer)           { _randomBuffer = _randomBytes(Size.value);                                } // First make
	if (_bitIndex  == 8)          {                                           _bitIndex = 0; _byteIndex++;   } // Next byte
	if (_byteIndex == Size.value) { _randomBuffer = _randomBytes(Size.value); _bitIndex = 0; _byteIndex = 0; } // Refresh cache
	var b = (_randomBuffer.readUInt8(_byteIndex) & (1 << _bitIndex)) >>> _bitIndex; // Read a bit
	_bitIndex++; // Move to the next bit for next time
	return b;
}

function unique()      {          return Data(_randomBytes(Size.value)); } // 20 bytes of random data should be unique across all space and time
function randomData(n) { min1(n); return Data(_randomBytes(n));          } // Make n bytes of random data
function _randomBytes(n) { // Generate n bytes of random data
	try {
		return platformCrypto.randomBytes(n); // Try high quality random
	} catch (e) { mistakeLog(Mistake("platform", {note:"using pseudo random instead", caught:e, watch:{n:n}})); }
	return platformCrypto.pseudoRandomBytes(n); // Fall back to lower quality random
}
//TODO make a RandomValve that writes random data into a stream forever, or for as long as the Range you give it

exports.chance = chance;
exports.randomThrough = randomThrough;
exports.randomUnder = randomUnder;
exports.randomBit = randomBit;
exports.unique = unique;
exports.randomData = randomData;

























