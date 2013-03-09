
//a simple tcp server, with a socket listening for connections

var net = require('net');

var server = net.createServer(function(connection) {

	//a client connected up to us
	console.log("server: accepted connection");

	//the client sent us some data
	connection.on('data', function(data) {
		console.log('server: received ' + data + ' from ' + connection.remoteAddress + ':' + connection.remotePort);
		connection.write('right back at you: ' + data);

	});

	//the client closed the connection
	connection.on('close', function() {
		console.log('server: the client closed the connection, it was: ' + connection.remoteAddress + ':' + connection.remotePort);

	});

}).listen(8124); //have our server listen on this port

console.log('server: server listening');


