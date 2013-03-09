
var log = console.log;





// Takes an integer 0 through 255, 0x00 through 0xff, or throws bounds
// Returns a node buffer with a single byte in it with that value
var intToByte = function(i) {
	if (i < 0x00 || i > 0xff) throw "bounds";
	var b = new Buffer(1);
	b.writeUInt8(i, 0)
	return b;
}

// Takes a node buffer with a single byte in it
// Returns value of that byte, an integer 0x00 0 through 0xff 255
var byteToInt = function(b) {
	return b.readUInt8(0);
}




// Make a Data to look at the bytes of some binary data
var Data = function Data(d) {

	var buffer; // Our node buffer which views some binary data

	// ----

	// Try to get the binary data out of b
	switch (typeof d) {
		case "undefined"; // The call here was Data() with nothing given
			buffer = new Buffer(0); // Make an empty buffer that holds 0 bytes
			break;
		case "boolean": // Like true or false
			buffer = new Buffer(d ? "t" : "f"); // Hold the boolean as the text "t" or "f"
			break;
		case "number": // Like 5 or -1.1
			buffer = new Buffer(d + ""); // Hold the number as numerals like "786" or "-3.1"
			break;
		case "string": // Like "hi"
			buffer = new Buffer(d); // UTF8 encoding by default
			break;
		case "object": // Like {}, [], or null
			if (Buffer.isBuffer(d)) {
				buffer = d.slice(); // Make a new buffer that views the same memory
			} else {
				buffer = d.toBuffer(); // Try to get a buffer from it, or throw TypeError
				if (!Buffer.isBuffer(buffer)) throw "type"; // Make sure we got a buffer
			}
			break;
		default:
			throw "type"; // We don't know how to get data from it
			break;
	}

	// ----

	// Make a Clip object around this Data
	// You can remove bytes from the start of the clip to keep track of what you've processed
	// The size of a Data object cannot change, while Clip can.
	function wrapClip() { return Clip(buffer); }

	// Make a copy of the memory this Data object views
	// Afterwards, the object that holds the data can close, and the copy will still view it
	function copyData() {
		return Bay(buffer).data(); // Make a Bay object which will copy the data
	}

	// ----

	// Convert this Data into a node Buffer object
	function toBuffer() {
		return buffer.slice(); // Return a new buffer that views the same memory
	}

	// If you know this Data has text bytes, look at them all as a String using UTF-8 encoding
	// On binary data, toString() produces lines of gobbledygook but doesn't throw an exception, you may want base16() instead
	function toString() {
		return toBuffer().toString();//TODO confirm the lines of gobbledygook
	}

	// Get the number in this Data, throw if it doesn't view text numerals like "786"
	function toNumber() {
		var i = parseInt(toString(), 10); // Base 10
		if (isNaN(i)) throw "data";
		return i;
	}

	// Get the boolean in this Data, throw if it doesn't view the text "t" or "f"
	function toBoolean() {
		var s = toString();
		if      (s == "t") return true;
		else if (s == "f") return false;
		else throw "data";
	}

	// ----
	
	function size() { return buffer.length; } // The number of bytes of data this Data object views
	function isEmpty() { return buffer.length == 0; } // True if this Data object is empty, it has a size of 0 bytes
	function hasData() { return buffer.length != 0; } // True if this Data object views some data, it has a size of 1 or more bytes

	// ----

	function start(n) { return clip(0, n); }          // Clip out the first n bytes of this Data, start(3) is DDDddddddd	
	function end(n)   { return clip(size() - n, n); } // Clip out the last n bytes of this Data, end(3) is dddddddDDD	
	function after(i) { return clip(i, size() - i); } // Clip out the bytes after index i in this Data, after(3) is dddDDDDDDD	
	function chop(n)  { return clip(0, size() - n); } // Chop the last n bytes off the end of this Data, returning the start before them, chop(3) is DDDDDDDddd	
	function clip(i, n) {                             // Clip out part this Data, clip(5, 3) is dddddDDDdd
		if (i < 0 || n < 0 || i + n > size()) throw "chop"; // Make sure the requested index and number of bytes fits inside this Data
		return Data(buffer.slice(i, i + n)); // Make and return a Data that clips around the requested part of this one
	}

	// ----
	
	function first() { return get(0); } // Get the first byte in this Data
	function get(i) {                   // Get the byte i bytes into this Data
		if (i < 0 || i >= size()) throw "chop"; // Make sure i is in range
		return buffer.readUInt8(i);
	}

	// ----

	// True if this Data object views the same data as the given one
	function same(d) {
		if (size() != d.size()) return false; // Compare the sizes
		else if (size() == 0) return true;    // If both are empty, they are the same
		return search(d, true, false) != -1;  // Search at the start only
	}
	
	function starts(Data d) { return search(d, true,  false) != -1; } // True if this Data starts with d
	function ends(Data d)   { return search(d, false, false) != -1; } // True if this Data ends with d
	function has(Data d)    { return search(d, true,  true)  != -1; } // True if this Data contains d

	function find(Data d) { return search(d, true,  true); } // Find the distance in bytes from the start of this Data to where d first appears, -1 if not found
	function last(Data d) { return search(d, false, true); } // Find the distance in bytes from the start of this Data to where d last appears, -1 if not found

	// Find where in this Data d appears
	// 
	// d       The tag to search for
	// forward true to search forwards from the start
	//         false to search backwards from the end
	// scan    true to scan across all the positions possible in this Data
	//         false to only look at the starting position
	// return  The byte index in this Data where d starts
	//         -1 if not found
	function search(d, forward, scan) {
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

	// ----
	
	function split(d)     { return searchSplit(d, true);  } // Split this Data around d, clipping out the parts before and after it
	function splitLast(d) { return searchSplit(d, false); } // Split this Data around the place d last appears, clipping out the parts before and after it
	
	// Split this Data around d, clipping out the parts before and after it.
	// 
	// d       The tag to search for
	// forward true to find the first place d appears
	//         false to search backwards from the end
	// return  A Split object that tells if d was found, and clips out the parts of this Data before and after it
	//         If d is not found, split.before will clip out all our data, and split.after will be empty
	function searchSplit(d, forward) {

		var i = search(d, forward, true); // Search this Data for d
		if (i == -1)
			return {
				found:  false, // Not found
				before: Data(buffer), // Make a copy of this Data object
				tag:    Data(), // Two empty Data objects
				after:  Data()
			};
		else
			return {
				found:  true, // We found d at i, clip out the parts before and after it
				before: start(i),
				tag:    clip(i, d.size()),
				after:  after(i + d.size()));
			};
	}

	// ----

	function compare(d) { throw "todo"; }
	function same(d) { throw "todo"; }

	// ----
	
	function base16() { return encodeToBase16(buffer); } // Encode this Data into text using base 16, each byte will become 2 characters, "00" through "ff"
	function base32() { return encodeToBase32(buffer); } // Encode this Data into text using base 32, each 5 bits will become a character a-z and 2-7
	function base62() { return encodeToBase62(buffer); } // Encode this Data into text using base 62, each 4 or 6 bits will become a character 0-9, a-z, and A-Z
	function quote()  { return encodeQuote(buffer);    } // Encode this Data into text like --"hello"0d0a-- base 16 with text in quotes
	function strike() { return encodeStrike(buffer);   } // Turn this Data into text like "hello--" striking out non-text bytes with hyphens

	// Compute the SHA1 hash of this Data, return the 20-byte, 160-bit hash value
	function hash() {
		throw "todo";
	}

	return {
		wrapClip:wrapClip, copyData:copyData,
		toBuffer:toBuffer, toString:toString, toNumber:toNumber, toBoolean:toBoolean,
		size:size, isEmpty:isEmpty, hasData:hasData,
		start:start, end:end, after:after, chop:chop, clip:clip,
		first:first, get:get,
		same:same, starts:starts, ends:ends, has:has, find:find, last:last,
		split:split, splitLast:splitLast,
		compare:compare, same:same,
		base16:base16, base32:base32, base62:base62, quote:quote, strike:strike, hash:hash,
	};
};







// A Bay holds data, and grows to hold more you add to it
var Bay = function(a) {

	var buffer = null; // Our node buffer which has an allocated block of memory
	var capacity = 0;  // The size of the memory block, the maximum amount of data we can hold
	var start = 0;     // Look start bytes into buffer for hold bytes of data there
	var hold = 0;

	if (a) add(a);

	function hasData() { return hold != 0; } // True if this Bay has some data
	function size() { return hold; } // How many bytes of data this Bay contains

	// Copy the data in the given object to the end of the data this Bay holds
	function add(a) {
		if (!a) return; // Nothing to add
		var b = Data(a).toBuffer(); // Convert the given a into buffer b so it's easy to add
		prepare(b.length);
		b.copy(buffer, start + hold, 0, b.length); // Append the given data to what we already have
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
		} else if (hold + more > capacity) {

			// Calculate how big our new buffer should be
			var c = ((size() + more) * 3) / 2; // It will be 2/3rds full
			if (c < 64) c = 64                 // At least 64 bytes

			// Replace our old buffer with a bigger one
			var target = new Buffer(c);
			buffer.copy(target, 0, start, start + hold); // Copy our data from buffer to target
			buffer = target; // Point buffer at the new one, discarding our reference to the old one
			start = 0; // There's no removed data at the start of our new buffer

		// Our buffer will have enough space at the end once we shift the data to the start
		} else if (start + hold + more > capacity) {

			// Copy hold bytes at start in buffer to position 0
			buffer.copy(buffer, 0, start, start + hold);
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
		}
	}

	// Make this Bay empty of data
	function clear() {
		start = 0; // Record that we have no data, capacity is the same, though
		hold = 0;
	}

	// Look at the data this Bay object holds
	function data() {
		return Data(buffer.slice(start, start + hold)); // Make a new buffer without copying the memory
	}

	return {
		hasData:hasData,
		size:size,
		add:add,
		prepare:prepare,
		keep:keep,
		remove:remove,
		clear:clear,
		data:data
	};
};


