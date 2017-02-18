console.log("conversion test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };








});
console.log("conversion test/");