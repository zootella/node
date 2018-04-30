//console.log("disk core\\");
contain(function(expose) {

























// An open file on the disk with access to its data
// Wrap a file descriptor d in a File object to notice if you forget to shut it
function File2(descriptor) {
	var o = mustShut(o.shut = function() { // Close the open disk file

		fileClose(o.descriptor); // No callback provided
		o.descriptor = null;
	});

	o.descriptor = function() { return descriptor; } // Access to the platform file descriptor we hold

	o.type = "File2";
	return o;
}

expose.core({File2});//TODO renamed to File2 to avoid overwriting a native function electron renderer has on global.File






















//the node posix level



function resolve(path, next) {//easy

	required.fs.realpath(path, null, callback);

	function callback(error, resolvedPath) {

		log("error ", error);
		log("resolvedPath ", resolvedPath);
		next();
	}
}

expose.core({resolve});



















//try to open a file, stop caring because of timeout, then node actually gets it open, code in teh callback doesn't bother the program but immediately closes it
//the worry here is that if a retry opened it, and it's the same file descriptor, then the automatic close will mess up the valid and being used open
//or if you don't close it, then the risk is you leak an open file
//go wtih closing it, even if it messes up the open file, which it probably won't, that will just fail and that part of the program will retry the whole thing





function look(path, next) {//hard because lots of return information and errors that are actually ok
	/*
fs.stat(path, callback)#
Asynchronous stat(2). The callback gets two arguments (err, stats) where stats is a fs.Stats object. See the fs.Stats section below for more information.	*/

}
function list(path, next) {//hard because return information in multiple events, probably
	/*
fs.readdir(path, callback)#
Asynchronous readdir(3). Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.	*/

}
function makeFolder(path, next) {//easy
	/*
fs.mkdir(path, [mode], callback)#
Asynchronous mkdir(2). No arguments other than a possible exception are given to the completion callback. mode defaults to 0777.	*/

}
function deleteFile(path, next) {//easy
	/*
fs.unlink(path, callback)#
Asynchronous unlink(2). No arguments other than a possible exception are given to the completion callback.	*/

}
function deleteFolder(path, next) {//easy
	/*
fs.rmdir(path, callback)#
Asynchronous rmdir(2). No arguments other than a possible exception are given to the completion callback.	*/

}
function rename(sourcePath, targetPath, next) {//easy
	/*
fs.rename(oldPath, newPath, callback)#
Asynchronous rename(2). No arguments other than a possible exception are given to the completion callback.	*/

}
function open(path, flags, mode, next) {//hard because combines create, and produces descriptor that needs to be closed
	/*
fs.open(path, flags, [mode], callback)#
Asynchronous file open. See open(2). flags can be:

The callback gets two arguments (err, fd).	*/

}
function read(file, stripe, bay, next) {//hard because buffers and streams
	/*
fs.read(fd, buffer, offset, length, position, callback)#
Read data from the file specified by fd.

buffer is the buffer that the data will be written to.

offset is the offset in the buffer to start writing at.

length is an integer specifying the number of bytes to read.

position is an integer specifying where to begin reading from in the file. If position is null, data will be read from the current file position.

The callback is given the three arguments, (err, bytesRead, buffer).	*/

}
function write(file, stripe, data, next) {//hard because buffers and streams
	/*
fs.write(fd, buffer, offset, length, position, callback)#
Write buffer to the file specified by fd.

offset and length determine the part of the buffer to be written.

position refers to the offset from the beginning of the file where this data should be written. If position is null, the data will be written at the current position. See pwrite(2).

The callback will be given three arguments (err, written, buffer) where written specifies how many bytes were written from buffer.

Note that it is unsafe to use fs.write multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream is strongly recommended.

On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.	*/

}
function close(file, next) {//easy
	/*
fs.close(fd, callback)#
Asynchronous close(2). No arguments other than a possible exception are given to the completion callback.	*/

}






//do the easy ones first




























































});
//console.log("disk core/");