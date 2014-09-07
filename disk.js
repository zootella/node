
var platformUtility = require("util");
var platformFile = require("fs");
var platformPath = require("path");

require("./load").load("disk", function() { return this; });























// An open file on the disk with access to its data
// Wrap a file descriptor d in a File object to notice if you forget to close it
function File(descriptor) {
	var o = mustClose();

	o.close = function() { // Close the open disk file
		if (o.alreadyClosed()) return;

		fileClose(o.descriptor); // No callback provided
		o.descriptor = null;
	}

	o.descriptor = function() { return descriptor; } // Access to the platform file descriptor we hold

	o.type = "File";
	return o;
}

exports.File = File;











function parsePath(s, next) {
	fs.realpath(path, null, callback);

	function callback(error, resolvedPath) {

	}
}


/*
fs.realpath(path, [cache], callback)#
Asynchronous realpath(2). The callback gets two arguments (err, resolvedPath). May use process.cwd to resolve relative paths. cache is an object literal of mapped paths that can be used to force a specific path resolution or avoid additional fs.stat calls for known real paths.

Example:

var cache = {'/etc':'/private/etc'};
fs.realpath('/etc/passwd', cache, function (err, resolvedPath) {
	if (err) throw err;
	console.log(resolvedPath);
});
*/








function pathLook(path, next) {
	try {

		var task = Task(next);
		platformFile.stat(absolute(path).text, callback);
		return task;

	} catch (e) { task.fail(e); }//(parse)
	function callback(e, statistics) {
		if (task.isClosed()) {//(cancel)
		} else {

			var a = {};//answer object we'll put in the result
			a.statistics = statistics; // Save the complete statistics object from the platform

			if (e && e.code == "ENOENT") { // Error no entry
				a.type = "available";
				task.done(a);

			} else if (e) { // Some other error
				task.fail(e);

			} else if (s.isDirectory()) { // Folder
				a.type = "folder";
				a.accessed = s.atime;
				a.modified = s.mtime;
				a.created = s.ctime;
				task.done(a);

			} else if (s.isFile()) { // File
				a.type = "file";
				a.size = s.size; // Size
				a.accessed = s.atime;
				a.modified = s.mtime;
				a.created = s.ctime;
				task.done(a);

			} else { // Something else like a link or something

				a.type = "other";
				task.done(a);
			}
		}
	}
}

function pathDelete(path, next) {
	try {

		var task = Task(next);
		platformFile.unlink(absolute(path).text, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {
		if (isClosed(m)) return;
		if (e) task.fail(e);
		else task.done();
	}
}

function pathMove(source, target, next) {
	try {

		var task = Task(next);
		platformFile.rename(absolute(source).text, absolute(target).text, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {
		if (isClosed(m)) return;
		if (e) task.fail(e);
		else task.done();
	}
}

//open
function pathOpen(path, flags, mode, next) {
	try {

		var task = Task(next);
		platformFile.open(absolute(path).text, flags, mode, callback);
		return task;

	} catch (e) { task.fail(e); }
	function callback(e) {


	}
}









//given a File
//size
function fileSize(f, next) {
	fs.fstat(fd, callback)
}
//read
function fileRead(f, next) {
	fs.read(fd, buffer, offset, length, position, callback)
	fs.createReadStream(path, options)
}
//write
function fileWrite(f, next) {
	fs.write(fd, buffer, offset, length, position, callback)
	fs.createWriteStream(path, options)
}
//add stripe
function fileWroteStripe(f, stripe) {

}
//close
function fileClose(f, next) {
	fs.close(fd, callback)
}

//given a Path to a folder
//list
function folderList(p, next) {
	fs.readdir(path, callback)
}
//make a single folder
function folderMake(p, next) {
	fs.mkdir(path, mode, callback)
}
//delete
function folderDelete(p, next) {
	fs.rmdir(path, callback)
}



exports.pathLook = pathLook;














































































