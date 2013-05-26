
var log = console.log;

var measure = require("./measure");
var Size = measure.Size;
var multiply = measure.multiply;
var divide = measure.divide;
var scale = measure.scale;

var text = require("./text");
var parseCheck = text.parseCheck;
var parseCheckMatch = text.parseCheckMatch;
var number = text.number;
var numerals = text.numerals;
var numerals16 = text.numerals16;














//   ____         __  __           
//  | __ ) _   _ / _|/ _| ___ _ __ 
//  |  _ \| | | | |_| |_ / _ \ '__|
//  | |_) | |_| |  _|  _|  __/ |   
//  |____/ \__,_|_| |_|  \___|_|   
//                                 

// Shift n bytes at i to the start of buffer
function bufferShift(buffer, i, n) { bufferCopy(n, buffer, i, buffer, 0); }

// Copy n bytes from the source buffer to the target buffer a distance i bytes into each
function bufferCopy(n, sourceBuffer, sourceI, targetBuffer, targetI) {

	// Nothing to copy
	if (!n) return;

	// Check bounds
	if (n < 0 || sourceI < 0 || targetI < 0) throw "bounds";
	if (sourceI + n > sourceBuffer.length) throw "bounds";
	if (targetI + n > targetBuffer.length) throw "bounds";

	// Copy the memory
	sourceBuffer.copy(targetBuffer, targetI, sourceI, sourceI + n);
}
















//   ____        _        
//  |  _ \  __ _| |_ __ _ 
//  | | | |/ _` | __/ _` |
//  | |_| | (_| | || (_| |
//  |____/ \__,_|\__\__,_|
//                        

// Make a Data to look at the bytes of some binary data
function Data(d) {

	var buffer; // Our node buffer which views some binary data

	// Try to get the binary data out of b
	switch (typeof d) {
		case "undefined": // The call here was Data() with nothing given
			buffer = new Buffer(0); // Make an empty buffer that holds 0 bytes
			break;
		case "boolean": // Like true or false
			buffer = new Buffer(d ? "t" : "f"); // Hold the boolean as the text "t" or "f"
			break;
		case "number": // Like 5 or -1.1
			buffer = new Buffer(numerals(d)); // Hold the number as numerals like "786" or "-3.1"
			break;
		case "string": // Like "hi"
			buffer = new Buffer(d, "utf8");
			break;
		case "object": // Like {}, [], or null
			if (Buffer.isBuffer(d)) {
				buffer = d.slice(0, d.length); // Make a new buffer that views the same memory
			} else {
				buffer = d.toBuffer(); // Try to get a buffer from it, or throw TypeError
				if (!Buffer.isBuffer(buffer)) throw "type"; // Make sure we got a buffer
			}
			break;
		default:
			throw "type"; // We don't know how to get data from it
			break;
	}

	// Make a Clip object around this Data
	// You can remove bytes from the start of the clip to keep track of what you've processed
	// The size of a Data object cannot change, while Clip can.
	function take() { return Clip(buffer); }

	// Make a copy of the memory this Data object views
	// Afterwards, the object that holds the data can close, and the copy will still view it
	function copyMemory() { return Bay(buffer).data(); } // Make a Bay object which will copy the data

	// Convert this Data into a node Buffer object
	function toBuffer() { return buffer; } // Let the caller access our internal buffer object, they can't change it

	// If you know this Data has text bytes, look at them all as a String using UTF-8 encoding
	// On binary data, toString() produces lines of gobbledygook but doesn't throw an exception, you may want base16() instead
	function toString() { return toBuffer().toString("utf8"); } //TODO confirm the lines of gobbledygook

	// Get the number in this Data, throw if it doesn't view text numerals like "786"
	function toNumber() { return number(toString()); }

	// Get the boolean in this Data, throw if it doesn't view the text "t" or "f"
	function toBoolean() {
		var s = toString();
		if      (s == "t") return true;
		else if (s == "f") return false;
		else throw "data";
	}
	
	function size() { return buffer.length; } // The number of bytes of data this Data object views
	function isEmpty() { return buffer.length == 0; } // True if this Data object is empty, it has a size of 0 bytes
	function hasData() { return buffer.length != 0; } // True if this Data object views some data, it has a size of 1 or more bytes

	function start(n) { return clip(0, n); }          // Clip out the first n bytes of this Data, start(3) is DDDddddddd	
	function end(n)   { return clip(size() - n, n); } // Clip out the last n bytes of this Data, end(3) is dddddddDDD	
	function after(i) { return clip(i, size() - i); } // Clip out the bytes after index i in this Data, after(3) is dddDDDDDDD	
	function chop(n)  { return clip(0, size() - n); } // Chop the last n bytes off the end of this Data, returning the start before them, chop(3) is DDDDDDDddd	
	function clip(i, n) {                             // Clip out part this Data, clip(5, 3) is dddddDDDdd
		if (i < 0 || n < 0 || i + n > size()) throw "chop"; // Make sure the requested index and number of bytes fits inside this Data
		return Data(buffer.slice(i, i + n)); // Make and return a Data that clips around the requested part of this one
	}
	
	function first() { return get(0); } // Get the first byte in this Data
	function get(i) {                   // Get the byte i bytes into this Data, returns a number 0x00 0 through 0xff 255
		if (!i) i = 0;                          // Turn undefined into 0 so math below works
		if (i < 0 || i >= size()) throw "chop"; // Make sure i is in range
		return buffer.readUInt8(i);
	}

	// True if this Data object views the same data as the given one
	function same(d) {
		if (size() != d.size()) return false; // Compare the sizes
		else if (size() == 0) return true;    // If both are empty, they are the same
		return _search(d, true, false) != -1; // Search at the start only
	}
	
	function starts(d) { return _search(d, true,  false) != -1; } // True if this Data starts with d
	function ends(d)   { return _search(d, false, false) != -1; } // True if this Data ends with d
	function has(d)    { return _search(d, true,  true)  != -1; } // True if this Data contains d

	function find(d) { return _search(d, true,  true); } // Find the distance in bytes from the start of this Data to where d first appears, -1 if not found
	function last(d) { return _search(d, false, true); } // Find the distance in bytes from the start of this Data to where d last appears, -1 if not found

	// Find where in this Data d appears
	// forward true to search forwards from the start, false to search backwards from the end
	// scan true to scan across all the positions possible in this Data, false to only look at the starting position
	// return the byte index in this Data where d starts, -1 if not found
	function _search(d, forward, scan) {
		if (!d.size() || size() < d.size()) return -1; // Check the sizes
		
		var start = forward ? 0                 : size() - d.size(); // Our search will scan this Data from the start index through the end index
		var end   = forward ? size() - d.size() : 0;
		var step  = forward ? 1                 : -1;
		if (!scan) end = start; // If we're not allowed to scan across this Data, set end to only look one place
		
		for (var i = start; i != end + step; i += step) { // Scan i from the start through the end in the specified direction
			for (var j = 0; j < d.size(); j++) {            // Look for d at i
				if (get(i + j) != d.get(j)) break;            // Mismatch found, break to move to the next spot in this Data
			}
			if (j == d.size()) return i; // We found d, return the index in this Data where it is located
		}
		return -1; // Not found
	}

	function cut(d)     { return _cut(d, true);  } // Split this Data around d, clipping out the parts before and after it
	function cutLast(d) { return _cut(d, false); } // Split this Data around the place d last appears, clipping out the parts before and after it
	function _cut(d, forward) { // Cut this Data around d, separating the parts before and after it
		var i = _search(d, forward, true); // Search this Data for d
		if (i == -1)
			return {
				found:  false,        // Not found, make before this and after blank
				before: Data(buffer), // Copy this Data object
				tag:    Data(),       // Two empty Data objects
				after:  Data()
			};
		else
			return {
				found:  true, // We found d at i, clip out the parts before and after it
				before: start(i),
				tag:    clip(i, d.size()),
				after:  after(i + d.size())
			};
	}
	
	function base16() { return toBase16(Data(buffer)); } // Encode this Data into text using base 16, each byte will become 2 characters, "00" through "ff"
	function base32() { return toBase32(Data(buffer)); } // Encode this Data into text using base 32, each 5 bits will become a character a-z and 2-7
	function base62() { return toBase62(Data(buffer)); } // Encode this Data into text using base 62, each 4 or 6 bits will become a character 0-9, a-z, and A-Z
	function base64() { return toBase64(Data(buffer)); } // Encode this Data into text using base 64

	function quote()  { return quote(Data(buffer));  } // Encode this Data into text like --"hello"0d0a-- base 16 with text in quotes
	function say() { return base16(); } // d.say() is base 16, and d.toString() is UTF8
	
	function hash() { throw "todo"; } // Compute the SHA1 hash of this Data, return the 20-byte, 160-bit hash value

	return {
		take:take, copyMemory:copyMemory,
		toBuffer:toBuffer, toString:toString, toNumber:toNumber, toBoolean:toBoolean,
		size:size, isEmpty:isEmpty, hasData:hasData,
		start:start, end:end, after:after, chop:chop, clip:clip,
		first:first, get:get,
		same:same, starts:starts, ends:ends, has:has, find:find, last:last,
		cut:cut, cutLast:cutLast,
		base16:base16, base32:base32, base62:base62, base64:base64, quote:quote, say:say,
		hash:hash,
		isData:function(){}
	};
};
exports.Data = Data;

// Clip around some data to remove bytes you're done with from the start until it's empty
// Data is immutale, but Clip is not
// Clip isn't exported, call data.take() to get one
function Clip(b) {

	var d = Data(b); // Make a Data from what we were given and save it

	function data() { return d;       } // The data we have left
	function copy() { return Clip(d); } // Make a copy of this Clip so you can change it without changing this one

	function size()    { return d.size();    } // The number of bytes of data this Clip views
	function isEmpty() { return d.isEmpty(); } // True if this Clip is empty, it has a size of 0 bytes
	function hasData() { return d.hasData(); } // True if this Clip views some data, it has a size of 1 or more bytes

	function remove(n) { // Remove n bytes from the start this Clip, and return a Data that views what you removed
		var s = d.start(n);
		d = d.after(n);
		return s;
	}
	function keep(n) { d = d.end(n); } // Remove data from the start of this Clip, keeping only the last n bytes

	return {
		data:data, copy:copy,
		size:size, isEmpty:isEmpty, hasData:hasData,
		remove:remove, keep:keep,
		isClip:function(){}
	};
}

// Determine which should appear first in sorted order
// Zero if same, negative if d1 then d2, positive if d2 first
// Compare each byte value 0 through 255 to sort the lowest different byte first, or shortest Data if all the bytes are a tie
function sortData(d1, d2) {
	var i = 0; // Start at the first byte
	while (true) {
		if (i < d1.size() && i < d2.size()) { // Compare two bytes
			var b = d1.get(i) - d2.get(i);
			if (b != 0) return b;
		} else if (i < d2.size()) { // d2 has a byte at i but d1 is shorter
			return -1; // Negative for d1 then d2
		} else if (i < d1.size()) { // d1 has a byte at i but d2 is shorter
			return 1; // Positive to sort d2 first
		} else { // Both ran out of bytes at the same time
			return 0; // Same
		}
		i++; // Move to the next byte
	}
}

exports.sortData = sortData;
























//   ____              
//  | __ )  __ _ _   _ 
//  |  _ \ / _` | | | |
//  | |_) | (_| | |_| |
//  |____/ \__,_|\__, |
//               |___/ 

// A Bay holds data, and grows to hold more you add to it
function Bay(a) {

	var buffer = null; // Our node buffer which has an allocated block of memory
	var start = 0;     // Look start bytes into buffer for hold bytes of data there
	var hold = 0;

	if (a) add(a);

	function size()    { return hold; }      // How many bytes of data this Bay contains
	function isEmpty() { return hold == 0; } // True if this Bay has 0 bytes
	function hasData() { return hold != 0; } // True if this Bay has 1 or more bytes of data

	// Copy the data in the given object to the end of the data this Bay holds
	function add(a) {
		if (!a) return; // Nothing to add
		var b = Data(a).toBuffer(); // Convert the given a into buffer b so it's easy to add
		prepare(b.length);
		bufferCopy(b.length, b, 0, buffer, start + hold); // Append the given data to what we already have
		hold += b.length;
	}

	// Prepare this Bay to hold the given number of bytes of additional data
	function prepare(more) {

		// Check the input
		if (more < 0) throw "check"; // Can't be negative
		if (!more) return; // No more space requested

		// We don't have a buffer to hold any data yet
		if (!buffer) {

			// Make a new one exactly the right size
			buffer = new Buffer(more);

		// Our buffer isn't big enough to hold that much more data
		} else if (hold + more > buffer.length) {

			// Calculate how big our new buffer should be
			var c = scale((size() + more), 3, 2).whole; // It will be 2/3rds full
			if (c < 64) c = 64;                         // At least 64 bytes

			// Replace our old buffer with a bigger one
			var target = new Buffer(c);
			bufferCopy(hold, buffer, start, target, 0); // Copy our data from buffer to target
			buffer = target; // Point buffer at the new one, discarding our reference to the old one
			start = 0; // There's no removed data at the start of our new buffer

		// Our buffer will have enough space at the end once we shift the data to the start
		} else if (start + hold + more > buffer.length) {

			// Copy hold bytes at start in buffer to position 0
			bufferShift(buffer, start, hold);
			start = 0; // Now the data is at the start
		} // Otherwise, there's room for more after start and hold at the end
	}

	// Remove data from the start of this Bay, keeping only the last n bytes
	function keep(n) { remove(hold - n); }

	// Remove n bytes from the start of the data this Bay holds
	function remove(n) {
		if (!n) return; // No remove requested
		if (n < 0 || n > hold) throw "chop";
		if (n == hold) { // Remove everything
			clear();
		} else { // Remove from the start
			start += n;
			hold -= n;
		}
	}

	// Remove data from the end of this Bay, keeping only the first n bytes
	function only(n) {
		if (!n) { clear(); return; } // Only nothing
		if (n < 0 || n > hold) throw "chop";
		hold = n; // Remove from the end
	}

	// Make this Bay empty of data
	function clear() {
		start = 0; // Record that we have no data, capacity is the same, though
		hold = 0;
	}

	// Look at the data this Bay object holds
	function data() {
		if (!buffer) return Data(); // If we don't have a buffer yet, return an empty data object
		else return Data(buffer.slice(start, start + hold)); // Make a new buffer without copying the memory
	}

	return {
		size:size, isEmpty:isEmpty, hasData:hasData,
		add:add, prepare:prepare,
		keep:keep, remove:remove, only:only, clear:clear,
		data:data,
		isBay:function(){}
	};
};
exports.Bay = Bay;




















//   ____  _       
//  | __ )(_)_ __  
//  |  _ \| | '_ \ 
//  | |_) | | | | |
//  |____/|_|_| |_|
//                 

function mediumBin() { return Bin(Size.medium); } // Get a new empty 8 KB Bin
function bigBin()    { return Bin(Size.big);    } // Get a new empty 64 KB Bin
function testBin()   { return Bin(8);           } // A bin that only holds 8 bytes used for testing

// Move data from source to target, do nothing if either are null
function moveBin(source, target) {
	if (!source || !target) return;
	target.add(source); // Move data from the source Bin to the target Bin
}

exports.mediumBin = mediumBin;
exports.bigBin = bigBin;
exports.testBin = testBin;
exports.moveBin = moveBin;

// Single global recycleBin object
var recycleBin = {};
recycleBin.medium = []; // Up to 8 previously used medium sized buffers
recycleBin.big    = []; // Up to 8 previously used big buffers
recycleBin.capacity = 8;

function Bin(c) { // Make a new Bin with a capacity of c bytes

	var buffer = null; // Our node buffer which has an allocated block of memory
	var hold = 0; // There are hold bytes of data at the start of buffer

	if (c == Size.medium && recycleBin.medium.length) buffer = recycleBin.medium.pop();
	if (c == Size.big    && recycleBin.big.length)    buffer = recycleBin.big.pop();
	if (!buffer) buffer = new Buffer(c); // Custom size or empty recycle bins

	// Recycle our buffer so the program can use it again instead of allocating a new one
	// Only call recycle() when the task has finished successfully and as expected
	// If there was an error or timeout, Node may still use the buffer
	function recycle() {
		if      (buffer.length == Size.medium && recycleBin.medium.length < recycleBin.capacity) { recycleBin.medium.add(buffer); buffer = null; }
		else if (buffer.length == Size.big    && recycleBin.big.length    < recycleBin.capacity) { recycleBin.big.add(buffer);    buffer = null; }
	}

	function getBuffer() { return { buffer:buffer, hold:hold }; } // Access our buffer and hold
	function setBuffer(o) { buffer = o.buffer; hold = o.hold; } // Set our buffer and hold from the given ones

	function data() { return Data(buffer.slice(0, hold)); } // Look at the Data in this Bin
	
	function size()     { return hold;                 } // The number of bytes of data in this Bin, 0 if empty
	function capacity() { return buffer.length;        } // The total number of bytes this Bin is capable of holding
	function space()    { return buffer.length - hold; } // The amount of free space in this Bin, 0 if totally full
	
	function hasData()  { return hold != 0;             } // True if this Bin has at least 1 byte of data
	function isEmpty()  { return hold == 0;             } // True if this Bin has no data, not even 1 byte
	function hasSpace() { return hold != buffer.length; } // True if this Bin has at least 1 byte of space
	function isFull()   { return hold == buffer.length; } // True if this Bin is completely full of data, with no space for even 1 more byte

	// Move as much data as fits from b to this Bin
	function add(b) {

		// Move as much data as fits from bin to this one
		if (b.hasOwnProperty("isBin")) {

			if (b.isEmpty() || isFull()) {                        // Nothing given or no space here
			} else if (isEmpty() && capacity() == b.capacity()) { // We're empty and have the same capacity
				var a = getBuffer();      // Save our buffer and hold in a
				setBuffer(b.getBuffer()); // Take b's buffer and hold
				b.setBuffer(a);           // Give b our buffer and hold, which we saved in a
			} else {                                              // Move some data in
				var clip = b.data().take();
				add(clip);                // Call this same function with the Clip
				b.keep(clip.size());      // Have b keep only what add didn't take
			}

		// Move as much data as fits from bay to this Bin, removing what we take from bay
		} else if (b.hasOwnProperty("isBay")) {

			var clip = b.data().take();
			add(clip);           // Call this same function with the Clip
			b.keep(clip.size()); // Have b keep only what add didn't take

		// Move as much data as fits from data to this Bin, removing what we take from data
		} else if (b.hasOwnProperty("isClip")) {

			if (b.isEmpty() || isFull()) return;          // Nothing given or no space here
			var n = Math.min(b.size(), space());          // Figure out how many bytes we can move
			var d = b.data().start(n);                    // Clip d around that size
			bufferCopy(n, d.toBuffer(), 0, buffer, hold); // Copy in the data
			hold += n;                                    // Record that we hold n more bytes
			b.remove(n);                                  // Remove what we took from the given Clip object

		// Whatever b is, we can't add from it
		} else {
			throw "type"; // Block adding from a Data, for instance, because we can't remove from the Data what we took
		}
	}

	// Remove size bytes from the start of the data in this Bin
	function remove(n) {
		if (n < 0 || n > size()) throw "bounds"; // Can't be negative or more data than we have
		if (!n) return; // Nothing to remove
		bufferShift(buffer, n, hold - n); // Shift the data after n to the start of buffer
		hold -= n; // Record that we hold n fewer bytes
	}
	
	// Remove data from the start of this Bin, keeping only the last size bytes
	function keep(n) { remove(size() - n) }

	// Remove all the data this Bin is holding, leaving it empty
	function clear() { hold = 0; }

	//TODO
	function inPrepare(space) {} // Copy our buffer clipped around space bytes of space for moving data in
	function inCheck(did, space) {} // Make sure we did at least 1 byte and position moved forward correctly
	function inDone(space) {} // Save our buffer after moving data in
	function outPrepare(size) {} // Copy our buffer clipped around size bytes of data at the start for moving data out
	function outCheck(did, data) {} // Make sure we did at least 1 byte and position moved forward correctly
	function outDone(data) {} // Save our buffer after moving data out

	function read(file, pattern, range) {} // Read 1 byte or more from file to this Bin
	function write(file, range) {} // Write 1 byte or more from this Bin to file
	function download(socket, range) {} // Download 1 byte or more from socket, adding it to this Bin
	function upload(socket, range) {} // Upload 1 byte or more from this Bin into socket
	function receive(listen) {} // Receive the data of a single UDP packet from listen, 0 or more bytes, putting it in this empty Bin
	function send(listen, p) {} // Use listen to send the data in this Bin, 0 or more bytes, as a UDP packet to p

	return {
		getBuffer:getBuffer, setBuffer:setBuffer, // Don't use these methods, ideally they would be private

		recycle:recycle,
		data:data, size:size, capacity:capacity, space:space,
		hasData:hasData, isEmpty:isEmpty, hasSpace:hasSpace, isFull:isFull,
		add:add, remove:remove, keep:keep, clear:clear,
		isBin:function(){}
	};
}




















//   _____                     _      
//  | ____|_ __   ___ ___   __| | ___ 
//  |  _| | '_ \ / __/ _ \ / _` |/ _ \
//  | |___| | | | (_| (_) | (_| |  __/
//  |_____|_| |_|\___\___/ \__,_|\___|
//                                    

// Takes an integer 0 through 255, 0x00 through 0xff, or throws bounds
// Returns a Data object with a single byte in it with that value
function toByte(i) {
	if (i < 0x00 || i > 0xff) throw "bounds";
	var b = new Buffer(1); // Make a Buffer that can hold one byte
	b.writeUInt8(i, 0); // Write the byte at the start, position 0
	return Data(b);
}

// Turn data into text using base 16, each byte will become 2 characters, "00" through "ff"
function toBase16(d) { return d.toBuffer().toString("hex"); }

// Turn data into text using base 32, each 5 bits will become a character a-z and 2-7
function toBase32(d) {

	// Use a-z and 2-7, 32 different characters, to describe the data
	var alphabet = "abcdefghijklmnopqrstuvwxyz234567"; // Base 32 encoding omits 0 and 1 because they look like uppercase o and lowercase L
	
	// Loop through the memory, encoding its bits into letters and numbers
	var byteIndex, bitIndex;                    // The bit index i as a distance in bytes followed by a distance in bits
	var pair, mask, code;                       // Use the data bytes a pair at a time, with a mask of five 1s, to read a code 0 through 31
	var s = "";                                 // Target string to build up and return
	for (var i = 0; i < d.size() * 8; i += 5) { // Move the index in bits forward across the memory in steps of 5 bits
		
		// Calculate the byte and bit to move to from the bit index
		var a = divide(i, 8);
		byteIndex = a.whole;     // Divide by 8 and chop off the remainder to get the byte index
		bitIndex  = a.remainder; // The bit index within that byte is the remainder
		
		// Copy the two bytes at byteIndex into pair
		pair = (d.get(byteIndex) & 0xff) << 8; // Copy the byte at byteindex into pair, shifted left to bring eight 0s on the right
		if (byteIndex + 1 < d.size()) pair |= (d.get(byteIndex + 1) & 0xff); // On the last byte, leave the right byte in pair all 0s
		
		// Read the 5 bits at i as a number, called code, which will be 0 through 31
		mask = 31 << (11 - bitIndex);    // Start the mask 11111 31 shifted into position      0011111000000000
		code = pair & mask;              // Use the mask to clip out just that portion of pair --10101---------
		code = code >>> (11 - bitIndex); // Shift it to the right to read it as a number       -----------10101
		
		// Describe the 5 bits with a numeral or letter
		s += alphabet.charAt(code);
	}
	return s;
}

// Turn data into text using base 62, each 4 or 6 bits will become a character 0-9, a-z, and A-Z
function toBase62(d) {

	// Use 0-9, a-z and A-Z, 62 different characters, to describe the data
	var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	// Loop through the memory, encoding its bits into letters and numbers
	var i = 0;                 // The index in bits, from 0 through all the bits in the given data
	var byteIndex, bitIndex;   // The same index as a distance in bytes followed by a distance in bits
	var pair, mask, code;      // Use the data bytes a pair at a time, with a mask of six 1s, to read a code 0 through 63
	var s = "";                // Target string to build up and return
	while (i < d.size() * 8) { // When the bit index moves beyond the memory, we're done
		
		// Calculate the byte and bit to move to from the bit index
		var a = divide(i, 8);
		byteIndex = a.whole;     // Divide by 8 and chop off the remainder to get the byte index
		bitIndex  = a.remainder; // The bit index within that byte is the remainder
		
		// Copy the two bytes at byteIndex into pair
		pair = (d.get(byteIndex) & 0xff) << 8; // Copy the byte at byteindex into pair, shifted left to bring eight 0s on the right
		if (byteIndex + 1 < d.size()) pair |= (d.get(byteIndex + 1) & 0xff); // On the last byte, leave the right byte in pair all 0s
		
		// Read the 6 bits at i as a number, called code, which will be 0 through 63
		mask = 63 << (10 - bitIndex);    // Start the mask 111111 63 shifted into position     0011111100000000
		code = pair & mask;              // Use the mask to clip out just that portion of pair --101101--------
		code = code >>> (10 - bitIndex); // Shift it to the right to read it as a number       ----------101101
		
		// Describe the 6 bits with a numeral or letter, 111100 is 60 and Y, if more than that use Z and move forward 4, not 6
		if (code < 61) { s += alphabet.charAt(code); i += 6; } // 000000  0 '0' through 111100 60 'Y'
		else           { s += alphabet.charAt(61);   i += 4; } // 111101 61, 111110 62, and 111111 63 are 'Z', move past the four 1s
	}
	return s; // Combine the characters in the array into a string
}

// Turn data into text using base 64
function toBase64(d) { return d.toBuffer().toString("base64"); }

// Turn base 16-encoded text back into the data it was made from
function base16(s, bay) {
	var t = ParseToBay(bay);
	try {

		try {
			t.add(new Buffer(s, "hex"));
		} catch (e) {
			if (e.message == "Invalid hex string") throw "data"; // Throw data for the exception we expect
			else throw e; // Throw up some other exception we didn't expect
		}
		var d = t.data();
		parseCheckMatch(d.base16(), s);
		return d;

	} catch (e) { t.reset(); throw e; }
}

// Turn base 32-encoded text back into the data it was made from
function base32(s, bay) {
	var t = ParseToBay(bay);
	try {

		// Loop for each character in the text
		var c;           // The character we are converting into bits
		var code;        // The bits the character gets turned into
		var hold = 0;    // A place to hold bits from several characters until we have 8 and can write a byte
		var bits = 0;    // The number of bits stored in the right side of hold right now
		for (var i = 0; i < s.length; i++) {

			// Get a character from the text, and convert it into its code
			c = s.get(i).upper();                                          // Accept uppercase and lowercase letters
			if      (c.range("A", "Z")) code = c.code() - "A".code();      // 'A'  0 00000 through 'Z' 25 11001
			else if (c.range("2", "7")) code = c.code() - "2".code() + 26; // '2' 26 11010 through '7' 31 11111
			else throw "data";                                             // Invalid character

			// Insert the bits from code into hold
			hold = (hold << 5) | code; // Shift the bits in hold to the left 5 spaces, and copy in code there
			bits += 5;                 // Record that there are now 5 more bits being held

			// If we have enough bits in hold to write a byte
			if (bits >= 8) {

				// Move the 8 leftmost bits in hold to our Bay object
				t.add(toByte((hold >>> (bits - 8)) & 0xff));
				bits -= 8; // Remove the bits we wrote from hold, any extra bits there will be written next time
			}
		}
		var d = t.data();
		parseCheckMatch(d.base32(), s);
		return d;

	} catch (e) { t.reset(); throw e; }
}

// Turn base 62-encoded text back into the data it was made from
function base62(s, bay) {
	var t = ParseToBay(bay);
	try {

		// Loop for each character in the text
		var c;           // The character we are converting into bits
		var code;        // The bits the character gets turned into
		var hold = 0;    // A place to hold bits from several characters until we have 8 and can write a byte
		var bits = 0;    // The number of bits stored in the right side of hold right now
		for (var i = 0; i < s.length; i++) {

			// Get a character from the text
			c = s.get(i);
			if      (c.range("0", "9")) code = c.code() - "0".code();      // '0'  0 000000 through '9'  9 001001
			else if (c.range("a", "z")) code = c.code() - "a".code() + 10; // 'a' 10 001010 through 'z' 35 100011
			else if (c.range("A", "Y")) code = c.code() - "A".code() + 36; // 'A' 36 100100 through 'Y' 60 111100
			else if (c.range("Z", "Z")) code = 61;                         // 'Z' indicates 61 111101, 62 111110, or 63 111111 are next, we will just write four 1s
			else throw "data";                                             // Invalid character

			// Insert the bits from code into hold
			if (code == 61) { hold = (hold << 4) | 15;   bits += 4; } // Insert 1111 for 'Z'
			else            { hold = (hold << 6) | code; bits += 6; } // Insert 000000 for '0' through 111100 for 'Y'

			// If we have enough bits in hold to write a byte
			if (bits >= 8) {

				// Move the 8 leftmost bits in hold to our Bay object
				t.add(toByte((hold >>> (bits - 8)) & 0xff));
				bits -= 8; // Remove the bits we wrote from hold, any extra bits there will be written next time
			}
		}
		var d = t.data();
		parseCheck(d.base62(), s);
		return d;

	} catch (e) { t.reset(); throw e; }
}

// Turn base 64-encoded text back into the data it was made from
function base64(s, bay) {
	var t = ParseToBay(bay);
	try {

		t.add(new Buffer(s, "base64"));
		var d = t.data();
		parseCheck(d.base64(), s);
		return d;

	} catch (e) { t.reset(); throw e; }
}

exports.toByte = toByte;
exports.base16 = base16;
exports.base32 = base32;
exports.base62 = base62;
exports.base64 = base64;



















//   ____                     
//  |  _ \ __ _ _ __ ___  ___ 
//  | |_) / _` | '__/ __|/ _ \
//  |  __/ (_| | |  \__ \  __/
//  |_|   \__,_|_|  |___/\___|
//                            

// Parse text or objects into data and add it to bay
// Give it a bay you've alrady been parsing into, or leave b blank and it will make a new bay
// If there's an exception, call reset() to put bay back the way it was
function ParseToBay(b) {
	if (!b) b = Bay(); // No bay given, make a new empty one

	var _bay = b; // Save the given bay
	var _existing = b.size(); // Remember how much data was in it before we changed it

	function add(d) { _bay.add(d); } // Add some data we just parsed
	function bay() { return _bay; } // Get our bay, probably to pass to a function we're calling to parse data into it for us
	function data() { return _bay.data().after(_existing); } // Just the data we added to bay, not everything there
	function reset() { _bay.only(_existing); } // There was a problem parsing data, put bay back the way it was when we got it

	return { add:add, bay:bay, data:data, reset:reset };
}

// Parse the data in clip into text or objects
// When you're done without exception, call valid() to remove the parsed data from clip
function ParseFromClip(clip) {

	var _clip = clip; // Save the given clip
	var _edit = clip.copy(); // Make a copy we will change

	function remove(n) { return _edit.remove(n); } // Remove n bytes we parsed from the start
	function removed() { return _clip.data().start(_clip.size() - _edit.size()); } // All the data we removed
	function valid() { _clip.keep(_edit.size()); } // Parsed valid data, remove it from clip

	return { remove:remove, removed:removed, valid:valid }
}

exports.ParseToBay = ParseToBay;
exports.ParseFromClip = ParseFromClip;



















//    ___        _   _ _            
//   / _ \ _   _| |_| (_)_ __   ___ 
//  | | | | | | | __| | | '_ \ / _ \
//  | |_| | |_| | |_| | | | | |  __/
//   \___/ \__,_|\__|_|_|_| |_|\___|
//                                  

// rules for designing your outline
// tag names can only be numbers and lowercase letters, as short as possible
// blank ok, duplicate tag names ok
// order can't matter
// tag names can't contain data, or be generated from data, that's what values are for
// values can't contain outline data, that's what contents are for
// numbers are text numerals in values, no numbers in bits
// values shouldn't have compression or encoding that requires more transformation, data in its most raw form
// values shouldn't have structure that requires more parsing, data in its most granular form
// no version numbers, the outline grows without breaking compatibility
// no vendor codes, the outline is a single unified common area
// an outline should be short, 8k or less when turned into data



//here's where you could actually use isData() and isOutline to check the inputs when building an outline
//also do this in sortText, sortData, sortOutline so you make sure you know what you're sorting

//make the outline object really small, just the members, and the functions
//and have the functions defined seprately outside


//use ParseToBay in base16, 32, 62, 64, it should be easy to start using it, and you won't need to change any of the tests
//but you could add a test that demonstrates using the same bay multiple times, getting thrown data, and the invalid fragment not being there


//Outline
//Outline and Text
//Outline and Data
//Span
//Quote














//   ____                    
//  / ___| _ __   __ _ _ __  
//  \___ \| '_ \ / _` | '_ \ 
//   ___) | |_) | (_| | | | |
//  |____/| .__/ \__,_|_| |_|
//        |_|                

// Turn n into 1 or more bytes of data added to bay
function spanMake(n, bay) {
	var t = ParseToBay(bay);
	try {

		for (var height = (spanSize(n) - 1) * 7; height >= 0; height -= 7) { // Loop up to 4 times with height 21, 14, 7, 0
			var y = ((0x7f << height) & n) >> height;                          // Clip out 7 bits in n
			if (height) y = y | 0x80;                                          // Mark bytes up to the last one with a leading 1
			t.add(toByte(y & 0xff));                                           // Add the byte we made to the target bay
		}
		return t.data();

	} catch (e) { t.reset(); throw e; }
}

// Parse 1 or more bytes at the start of clip into a number, remove them from clip, and return the number
function spanParse(clip) {
	var c = ParseFromClip(clip);

	var n = 0;
	for (var i = 0; i < 4; i++) {  // Loop up to 4 times
		var y = c.remove(1).first(); // Cut one byte from the start of d, or throw chop if there isn't one
		n = (n << 7) | (y & 0x7f);   // Move 7 bits into the bottom of n
		if ((y & 0x80) == 0) break;  // If the leading bit is 0, we're done
	}
	if (n < 0 || n > 0x0fffffff) throw "data";
	if (!spanMake(n).same(c.removed())) throw "data"; // Round trip check
	c.valid();
	return n;
}

// Predict how big the number n will be turned into data, 1 or more bytes
// While the span format is unlimited, JavaScript does bit manipulation on 32 bit integers
function spanSize(n) {
	if (n < 0) throw "bounds";
	if (n <       0x80) return 1; //  7 1s will fit in 1 byte
	if (n <     0x4000) return 2; // 14 1s will fit in 2 bytes
	if (n <   0x200000) return 3; // 21 1s will fit in 3 bytes
	if (n < 0x10000000) return 4; // 28 1s will fit in 4 bytes
	throw "bounds";
}

exports.spanMake = spanMake;
exports.spanParse = spanParse;
exports.spanSize = spanSize;




















//    ___              _       
//   / _ \ _   _  ___ | |_ ___ 
//  | | | | | | |/ _ \| __/ _ \
//  | |_| | |_| | (_) | ||  __/
//   \__\_\\__,_|\___/ \__\___|
//                             

// Turn data into text using base 16, and put text characters in quotes
// 'The quote " character\r\n' becomes '"The quote "22" character"0d0a'
function quote(d) {
	if (!quoteMore(d))    // The given data is mostly data bytes, like random data
		return d.base16();  // Present it as a single block of base 16 without quoting out the text it may contain

	var c = d.take();     // Clip around d to remove what we've encoded
	var t = "";
	while (c.hasData()) { // Loop until c is empty
		if (quoteIs(c.data().first()))
			t += '"' + c.remove(quoteCount(c.data(), true)).toString() + '"'; // Surround bytes that are text characters with quotes
		else
			t += c.remove(quoteCount(c.data(), false)).base16(); // Encode other bytes into base 16 outside the quotes
	}
	return t;
}

// Turn quoted text back into the data it was made from
function unquote(s) {
	var bay = Bay(); // Make a new empty Bay if the caller didn't pass us one
	while (s.length) {     // Loop until we're out of source text

		var q1 = s.cut('"'); // Split on the first opening quote to look for bytes before text

		var c = q1.before.cut("#");         // Look for a comment outside the quotes
		if (c.found) {                      // Found a comment
			bay.add(base16(c.before.trim())); // Only bytes and spaces can be before the comment
			break;                            // Hitting a comment means we're done with the line
		}

		bay.add(base16(q1.before)); // Only bytes can be before the opening quote
		if (!q1.found) break;       // No opening quote, so we got it all

		var q2 = q1.after.cut('"');  // Split on the closing quote
		if (!q2.found) throw "data"; // Must have closing quote

		bay.add(q2.before); // Copy the quoted text across, using UTF8 encoding
		s = q2.after;       // The remaining text is after the closing quote
	}
	return bay.data(); // If you passed us a Bay, ignore the Data we return
}

// Count how many bytes at the start of d are quotable text characters, or false to count data bytes
function quoteCount(d, quotable) {
	var i = 0;
	while (i < d.size()) {
		var y = d.get(i);
		if (quotable ? !quoteIs(y) : quoteIs(y)) break;
		i++; // Count this character and check the next one
	}
	return i;
}

// True if d has more text than data bytes
function quoteMore(d) {
	var text = 0; // The number bytes in d we could encode as text or data
	var data = 0; // The number bytes in d we have to encode as data
	for (var i = 0; i < d.size(); i++) {
		var y = d.get(i);
		if (quoteIs(y)) text++; // 94 of 255 bytes can be encoded as text, that's 37%
		else            data++;
	}
	return text > data; // Picks true for a single byte of text, false for random bytes of data
}

// True if byte y is a text character " " through "~" but not the double quote character
function quoteIs(y) {
	return (y >= ' '.code() && y <= '~'.code()) && y != '"'.code(); // Otherwise we'll have to encode y as data
}

exports.quote = quote;
exports.unquote = unquote;
exports.quoteCount = quoteCount;
exports.quoteMore = quoteMore;
exports.quoteIs = quoteIs;













































