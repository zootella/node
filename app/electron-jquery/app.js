

/*
document.write("The current version of io.js " + process.version);

var fs = require("fs");

var contents = fs.readFileSync("./package.json", "utf-8");
alert(contents);
*/


require('remote').getCurrentWindow().toggleDevTools();

var util = require("util");

window.$ = window.jQuery = require("jquery");
elog("added this");
elog("and this");
elog(util.inspect(process.versions));
elog("one line\r\nand another, in the same elog");//TODO doesn't work, fix by splitting on lines and calling individually below



function elog(s) {
	$("#output-container").append("<div class=\"output-line\"><span class=\"output-text\"></span></div>");
	$(".output-text:last").text(s);
}


/*
two ways to run something

for the benefit of doing it, run it in the electron process. do your demos and tests work in electron as well as the command line?

for icarus, run it in a separate process



*/



/*
yeah, do separate processes
otherwise, you'll have to close icarus to close a long-running process
and update log and stick to use standard in and out so they work

icarus
you open a window, and then you can create a stack of these things
they're green while the're running, blue afterwards
they show how long they took
there's a refresh button, and you can set an autorefresh on files change


*/




