
var disk = require('fs');

//timer to open file and read contents to http response object
function open(filename) {
	console.log('opening ' + filename);

	//open and read in file contents
	disk.readFile(filename, 'utf8', function(error, data) {
		if (error) {
			console.log('could not find or open file');
		} else {
			console.log(data);
		}
	})
}

setTimeout(open, 0, 'hello.txt');

