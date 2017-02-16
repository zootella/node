console.log("page\\");
console.log("process.pid:     " + process.pid);
console.log("__dirname:       " + __dirname);
console.log("__filename:      " + __filename);
console.log("module.filename: " + module.filename);

var $ = require("jquery");




$(document).ready(function() {
	$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');
});







console.log("page/");