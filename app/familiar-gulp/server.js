
var fs = require('fs');
var cp = require("child_process");
var app = require("express")();
var reporter = require("nodeunit").reporters.default;
var intercept = require("intercept-stdout");

require("../../load").load("base", function() { return this; });



var unhook_intercept = intercept(function(s) {
	return s;
});


//ok, that's nice, but how do you now push that new text up to the page?
 




app.get("/", function(request, response) {
	response.send(html);
});

app.listen(5000);

log("listening on 5000...");





var t = Template(`
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>familiar</title>
<style>

div, p
{
	margin: 0;
	font-family: "Consolas", "Andale Mono", sans-serif;
	font-size: 10pt;
}

</style>
</head>
<body>
<div id="page">

<p>{{now}}</p>
<p>{{name}}</p>

</div>
</body>
</html>
`);

var html = t.merge({
	now:say(now()),
	name:"kevin"
});





function p10() {
	cp.exec("nodeunit text_test.js", function(error, bufferOut, bufferError) {
		log("error:        " + say(error));
		log("buffer out:   " + say(bufferOut));
		log("buffer error: " + Data(bufferError).quote());
	});
}


p10();


//reporter.run(["text_test.js"]);


/*
var files = fs.readdirSync('.');
var testFiles = files.filter((name) => { return name.match(/_test/); });

reporter.run(testFiles);
*/




/*

grab stdout
send it to the page, after the server has delivered the page

or is that harder than icarus, so just do icarus




ok, you could ask around, or follow the socket.io example
but you're already banned from xp on this, so maybe back to icarus
yeah, probably back to icarus
the nice thing there is there's only one process, and no http





*/











