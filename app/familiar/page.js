
var $ = require("jquery");
var platformChildProcess = require("child_process");

require("../../load").library();

log("page pid #, dirname #".fill(process.pid, __dirname));

var liveReload = false;




var app = {};

window.addEventListener("beforeunload", function(e) {
	close(app.watch);
	closeCheck();//TODO make this able to complain somehow, like writing a file and opening notepad
});



$(document).ready(function() {
	var h = template(`
		<input type="button" value="Refresh" onClick="window.location.reload()"/>
		<div id="page">
			<div id="command"></div>
			<div id="log"></div>
			<div id="stick"></div>
		</div>
	`);
	$("body").html(h);

	if (liveReload) {
		app.watch = Watch(".", {ignored: ["node_modules", "electron"]}, "change", function(event, path) {
			window.location.reload();
		});
	}

	main();
});

function printLog(s) {
	var h = template(`
		<p><span class="line">{{line}}</span></p>
	`,{
		line:s
	});
	$("#log").append(h);
}






function logPage() {

	//one big line that starts wiht the timestamp
	var s = sayDateTemplate(now().time, "ddHH12:MMaSS.TTT") + "  ";
	for (var i = 0; i < arguments.length; i++)
		s += say(arguments[i]);

	//at this point, it's ready to hand to the terminal
	//console.log(t);

	//but for the page...
	//the given line might include newlines, we need to break them up for the html

	var lines = s.ripLines();
	for (var i = 0; i < lines.length; i++) {
		var h = template(`
			<p><span class="line">{{line}}</span></p>
		`,{
			line:lines[i]
		});
		$("#log").append(h);
	}
}

function stickPage() {

	var a = []; // Separate lines of text and put them in a
	a.add(""); // Start stick text with a blank line to keep it visually separate from log lines above
	if (!arguments.length) a.add(""); // Make stick() the same as stick("")

	for (var i = 0; i < arguments.length; i++) {
		var s = say(arguments[i]); // Turn each argument into text
		a = a.concat(s.swap("\r\n", "\n").swap("\r", "\n").rip("\n")); // Separate multiple lines in a single string
	}

	for (var i = 0; i < a.length; i++) {
		if (a[i] == "") a[i] = " ";//give empty lines height on the page
	}

	var h = template(`
		{{#each line}}
			<p><span class="line">{{this}}</span></p>
		{{/each}}
	`,{
		line: a
	});

	$("#stick").html(h);



}









function printStick(s) {
	var h = Template(`
		<p><span class="line">{{line}}</span></p>
	`,{
		line:s
	});
	$("#stick").html(h);
}


function main() {



	log("hello you");


	logPage("log 1");
	stickPage("stick 1");
	logPage("log 2", " log2b");
	stickPage("stick 2", "stick 2b", "", "stick 2c");


/*
	wait(Time.second, function() {
		stickPage("stick 2 edited a moment later, this is awesome");
	});
*/







}







function runAllTheTests() {

	runTest("hide_test.js", function(r) {

		printLog(r.allPassed ? "GREEN" : "RED");
		printLog("assertions # failed, # total".fill(r.failedAssertions, r.totalAssertions));
		printLog("-");

		if (!r.allQuiet) {
			for (var i = 0; i < r.lines.length; i++) {
				printLog(r.lines[i]);
			}
		}

		printStick("here is the stick text");


	});


}







function runTest(name, next) {
	platformChildProcess.exec("nodeunit #".fill(name), function(error, bufferOut, bufferError) {
		var r = {};
		r.error = error;
		r.bufferOut = bufferOut;
		r.bufferError = bufferError;

		r.dataOut = Data(bufferOut);
		r.dataError = Data(bufferError);

		r.lines = say(r.dataOut).ripLines();
		for (var i = 0; i < r.lines.length; i++) {
			while (true) {
				var c = r.lines[i].parse("\u001b[", "m");
				if (!c.found) break;
				r.lines[i] = c.before + c.after;
			}
		}

		r.allPassed = error ? false : true;
		r.allQuiet = true;
		for (var i = 2; i < r.lines.length - 3; i++) {
			if (!r.lines[i].starts("✔")) r.allQuiet = false;
		}

		var c = r.lines[r.lines.length - 2].parse(": ", " ");
		if (c.before == "OK") {
			r.failedAssertions = 0;
			r.totalAssertions = int(c.middle).toNumber();
		} else if (c.before == "FAILURES" && c.middle.has("/")) {
			var d = c.middle.cut("/");
			r.failedAssertions = int(d.before).toNumber();
			r.totalAssertions = int(d.after).toNumber();
		} else {
			r.failedAssertions = 0;
			r.totalAssertions = 0;
		}

		next(r);
	});
}




