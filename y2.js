


var log = console.log;





function KB() { return 1024; }        // Number of bytes in a kilobyte
function MB() { return 1024 * KB(); } // Number of bytes in a megabyte
function GB() { return 1024 * MB(); } // Number of bytes in a gigabyte
function TB() { return 1024 * GB(); } // Number of bytes in a terabyte

function Second() { return 1000;          } // Number of milliseconds in a second
function Minute() { return 60 * Second(); } // Number of milliseconds in a minute
function Hour()   { return 60 * Minute(); } // Number of milliseconds in an hour
function Day()    { return 24 * Hour();   } // Number of milliseconds in a day








function Slice(z) { // Takes the size of the file in bytes
	if (z < 1) throw "bounds"; // File size must be 1 byte or more

	var _size = z;

	// The file size in bytes
	function size() { return _size; }

	// How many pieces the file has
	// Pieces can be 1 MB or smaller, so a file just over 1 MB has 2 pieces
	function pieces() { return Math.ceil(size() / MB()); }

	// The distance in bytes from the start of the file to the boundary of the given piece index i
	// For instance, the first piece starts at piece(0), the second starts at piece(1), and so on
	// If a file has n pieces, piece(n) will be the size of the file
	function piece(index) {
		if (index < 0 || index > pieces()) throw "bounds";
		return Math.floor((index * size()) / pieces()) // Multiply before we divide, and round down to the nearst byte
	}

	return {
		size:size,
		pieces:pieces,
		piece:piece
	};
}


exports.testSlice = function(test) {

	//confirm we're getting as many pieces as we should
	test.ok(Slice(1).pieces() == 1);//a 1 byte file is 1 piece

	test.ok(Slice(MB() - 1).pieces() == 1);//one less
	test.ok(Slice(MB()).pieces()     == 1);//and exactly 1 MB are 1 piece, while
	test.ok(Slice(MB() + 1).pieces() == 2);//one more bumps up to 2 pieces

	test.ok(Slice((2 * MB()) - 1).pieces() == 2);//same thing around 2mb
	test.ok(Slice((2 * MB())).pieces()     == 2);
	test.ok(Slice((2 * MB()) + 1).pieces() == 3);

	test.ok(Slice((5 * GB()) - 1).pieces() == 5120);//and around 5gb
	test.ok(Slice((5 * GB())).pieces()     == 5120);
	test.ok(Slice((5 * GB()) + 1).pieces() == 5121);

	//make sure we can scan exactly to the end of the file
	function edge(z) {
		var s = Slice(z);
		test.ok(s.piece(s.pieces()) == s.size());//if a file has n pieces, piece(n) should be exactly beyond the final byte
	}
	edge(1);//one byte
	edge(MB() - 1);//around a megabyte
	edge(MB());
	edge(MB() + 1);
	edge((789 * MB()) - (123 * KB()) + 456);//some large files
	edge((789 * GB()) - (123 * KB()) + 456);

	//make sure the piece boundaries are what we expect
	var file1 = Slice(1804787);
	test.ok(file1.pieces() == 2);
	test.ok(file1.piece(0) == 0);
	test.ok(file1.piece(1) == 902393);
	test.ok(file1.piece(2) == 1804787);

	var file2 = Slice(8030559);
	test.ok(file2.pieces() == 8);
	test.ok(file2.piece(4) == 4015279);
	test.ok(file2.piece(5) == 5019099);
	test.ok(file2.piece(6) == 6022919);

	var file3 = Slice(1417407005);
	test.ok(file3.pieces() == 1352);
	test.ok(file3.piece(999)  == 1047329584);
	test.ok(file3.piece(1000) == 1048377962);
	test.ok(file3.piece(1001) == 1049426340);

	test.done();
}








