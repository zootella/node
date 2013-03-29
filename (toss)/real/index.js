var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.begin;
handle["/begin"] = requestHandlers.begin;
handle["/upload"] = requestHandlers.upload;

server.hello();
server.begin(router.route, handle);