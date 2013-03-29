var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) { //call this function when a web browser navigates to us

	fs.readFile('powers/text.txt', 'utf8', function(err, data) { //call this function when the file is done

		res.writeHead(200, {'Content-Type': 'text/plain'});

		if (err) {
			res.write('Unable to find or open file for reading\n');
		} else {
			res.write(data); // no error, write the file to the client
		}
		
		res.end();
	});
}).listen(8124);

console.log('Server running on 8124');