// Require the http module that ships with node.js, and make it available through the variable http
var http = require("http");
var url = require("url");

function begin(route, handle) {
	function onRequest(request, response) {
		console.log("");

		var pathname = url.parse(request.url).pathname;
		var content = route(handle, pathname);
		console.log("request for: " + pathname + ", telling the browser: " + content);

		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(content);
		response.end();
	}

	var server;
	server = http.createServer(onRequest);
	server.listen(8888);

	console.log("server has started");
}

function hello() {
	console.log("hello from another file");
}

exports.begin = begin;
exports.hello = hello;
