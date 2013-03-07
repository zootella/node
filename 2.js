
// Look at some binary data
var newData = function(d) {

	var buffer = null; // Our node buffer which views some binary data
	var hold = 0;

	if (d) {

		// Convert the given d into buffer b so it's easy to add
		if (typeof d == "string") { // Works if a is a string
			buffer = new Buffer(d);   // Default UTF8
		} else {                    // Or some kind of object that has a toBuffer() method
			buffer = a.toBuffer();    // Throws TypeError if a doesn't have that method
		}
	}


/*
	/** Clip out the first n bytes of this Data, start(3) is DDDddddddd. *
	public Data start(int n) { return clip(0, n); }
	/** Clip out the last n bytes of this Data, end(3) is dddddddDDD. *
	public Data end(int n) { return clip(size() - n, n); }
	/** Clip out the bytes after index i in this Data, after(3) is dddDDDDDDD. *
	public Data after(int i) { return clip(i, size() - i); }
	/** Chop the last n bytes off the end of this Data, returning the start before them, chop(3) is DDDDDDDddd. *
	public Data chop(int n) { return clip(0, size() - n); }
	/** Clip out part this Data, clip(5, 3) is dddddDDDdd. *
	public Data clip(int i, int n) {

		// Make sure the requested index and number of bytes fits inside this Data
		if (i < 0 || n < 0 || i + n > size()) throw new ChopException();

		// Make and return a new Data that clips around the requested part of this one
		ByteBuffer b = toByteBuffer(); // Make a new ByteBuffer b that looks at our data too
		b.position(b.position() + i);  // Move its position and limit inwards to clip out the requested part
		b.limit(b.position() + n);
		return new Data(b);            // Wrap a new Data object around it, and return it
	}
*/


	function size() { return hold; }

	function toString() { return toBuffer().toString(); }
	function toBuffer() {
		if (!buffer) return new Buffer(0);
		return buffer.slice(); // Make a new buffer without copying the memory
	}


	return {
		toBuffer:toBuffer
	};
}


// A bay holds data, and grows to hold more you add to it
var newBay = function(a) {

	var buffer = null; // Our node buffer which has an allocated block of memory
	var capacity = 0;  // The size of the memory block, the maximum amount of data we can hold
	var start = 0;     // Look start bytes into buffer for hold bytes of data there
	var hold = 0;

	if (a) add(a);

	function hasData() { return hold != 0; } // True if this bay has some data
	function size() { return hold; } // How many bytes of data this bay contains

	// Copy the data in the given object to the end of the data this bay holds
	function add(a) {
		if (!a) return; // Nothing to add
		var b = newData(a).toBuffer(); // Convert the given a into buffer b so it's easy to add
		prepare(b.length);
		b.copy(buffer, start + hold, 0, b.length); // Append the given data to what we already have
		hold += b.length;
	}

	// Prepare this bay to hold the given number of bytes of additional data
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

	// Remove data from the start of this bay, keeping only the last n bytes
	function keep(n) { remove(hold - n); }
	// Remove n bytes from the start of the data this bay holds
	function remove(n) {
		if (!n) return; // No remove requested
		if (n < 0 || n > hold) throw "chop";
		if (n == hold) { // Remove everything
			clear();
		} else { // Remove from the start
			start += n;
		}
	}

	// Make this bay empty of data
	function clear() {
		start = 0; // Record that we have no data, capacity is the same, though
		hold = 0;
	}

	// Look at the data this bay object holds
	function data() {
		return newData(buffer.slice(start, start + hold)); // Make a new buffer without copying the memory
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


