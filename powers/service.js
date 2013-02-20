
//new service that prints out a sequence of numbers and then contents of a file

var http = require('http');
var fs = require('fs');

var counter;

function writeNumbers(res) {
	counter = 0;

	for (var i = 0; i < 100; i++) { //loop to delay the application, like blocking through a computationally intensive process
		counter++;
		res.write(counter.toString() + '\n');
	}
}

http.createServer(function(req, res) {

	var query = require('url').parse(req.url).query;
	var app = require('querystring').parse(query).file + ".txt"; //call this variable app

	res.writeHead(200, {'Content-Type': 'text/plain'});

	writeNumbers(res);

	//timer to open file and read contents
	setTimeout(function() {

		console.log('opening ' + app);
		fs.readFile(app, 'utf8', function(err, data) {

			if (err) {
				res.write('Unable to find or open file for reading\n');
			} else {
				res.write(data); // no error, write the file to the client
			}

			res.end();
		});

	}, 2000); //give 2000 to setTimeout

}).listen(8124);

console.log('Server running at 8124');

