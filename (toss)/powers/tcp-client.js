
//the client socket which sends data to the tcp server

var net = require('net');

//make a new socket for this client
var client = new net.Socket();
client.setEncoding('utf8');

//connect to server
client.connect('8124', 'localhost', function() {
	console.log('client: connected up to server');
	client.write('who needs a browser to communicate?');
});

// preapre for input from terminal
process.stdin.resume();

//when the user types data, send it to the server
process.stdin.on('data', function(data) {
	client.write(data);
});

//when we get data back from the server, print it to the console
client.on('data', function(data) {
	console.log('client: downloaded ' + data);
});

//when the server closed the connection
client.on('close', function(data) {
	console.log('client: the server closed our connection');
});



