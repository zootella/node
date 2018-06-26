




/*
nodeunit and tape figure out that a test didn't done() right away, while mocha can't do that
but how do they do that?
look in the tape code to figure it out



you still don't know how to make pop quiz, running the tests in the current process
but, you could still make familiar spirit--just run nodeunit in another process, and parse the results







*/
































/*
$ node familiar.js

http://localhost:5000/

do you get index.html? yes
change a file, save, control+c the server, refresh




$ nodemon familiar.js

http://localhost:5000/
change familiar.js, save, nodemon restarts, refresh manually
change index.html, and you have to restart nodemon manually





$ gulp familiar

http://localhost:5000/   the server that doesn't refresh
http://localhost:7000/   browsersync's view of the page that autoreloads
http://localhost:3001/   a huge browsersync control panel

change anything and the page changes, too
but what about a distant and unrelated js file, does taht do it? a text file doesn't
*/

























/*
var platformHttp = require("http");

require("./load").load("base", function() { return this; });



var port = 1337;

function handleRequest(request, response){

	response.writeHead(200, { "Content-Type": "text/html" });
	response.end("hello");
}

var server = platformHttp.createServer(handleRequest);

server.listen(port, function () {
	log("listening");
});



log("hello");
*/











/*
make familiar spirit now as a winxp-compatible one-off

browsersync
express
hello world website
modify to run all tests
show any lines that aren't ok
color code to green and red

that's all you have to do! it could take one focused session







webpack makes a bundle file
browser-sync examples also use gulp, which makes a bundle file
so how do you do it without a bundle file?
possibly pretty hard

1
figure this out, find or separate out the live browser reload thing with sockjs or something

2
ok, what if you used webpack
adn dont' worry about the bundle file
because it isn't even really generated, it stays in memory

3
full on icarus in electron
what you were going to do, using child processes and nodemon
https://github.com/remy/nodemon/blob/master/doc/requireable.md

of course, icarus lives in electron, and so it can't run in xp
another thing could be icarus-server, which is the same thing but runs on localhost:1337

either way, familiar spirit wasn't built in a night, so try the webpack thing, then get back to full icarus



/*
or maybe gulp isn't so bad
the tasks can be anything, like maybe not making a bundle

gulp + expressjs + nodemon + browser-sync
https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

do that tutorial by itself
then see what it would look like to add it here, and make xp-compatible in browser familiar spirit that way

this one also looks good
https://zellwk.com/blog/gulp-tutorial/
https://css-tricks.com/gulp-for-beginners/
*/









//first gulpfile that worked on a static file, but not a dynamic return string
`
var gulp = require("gulp");
var platformBrowserSync = require("browser-sync");
var platformNodemon = require("gulp-nodemon");

gulp.task("familiar", ["nodemon-task"], function() {//do nodemon-task first
	platformBrowserSync.init(null, {
		proxy: "http://localhost:5000",
		files: ["app/familiar/**/*.*"],
		port: 7000,
	});
});

gulp.task("nodemon-task", function(givenCallback) {
	var once = false;
	return platformNodemon({
		script: "app/familiar/server.js"
	}).on("start", function () {
		if (!once) {//only start nodemon once
			givenCallback();
			once = true; 
		} 
	});
});
`








/*
//myunit.js

var reporter = require('nodeunit').reporters.default;
var fs = require('fs');

var files = fs.readdirSync('.');
var testFiles = files.filter((name) => { return name.match(/_test/); });

reporter.run(testFiles);

//reporter.run(["text_test.js"]);

/*

run a demo with node and electron command line

$ node environment_test.js demo platform
$ ./electron/win/electron.exe environment_test.js demo platform

run tests with node, nodeunit, and electron command line

$ node nodeunit.js
$ node_modules/nodeunit/bin/nodeunit *_test.js
$ ./electron/win/electron.exe nodeunit.js

the electron command line ones work, but you have to control+c to close them

*/























expose.test("text words lines Lines dent", function(ok, done) {

	log("hi");

	done();
});

/*
ok, no part of your actual code uses ripWords, ripLines, or rip
comparing platform to custom is unnecessary
and it doesn't do newlines correctly

"a b c".words();
returns an array
never includes blank elements
always splits and trims on text
no additional options or features, do that custom and carefully

`
line1
line2
line3
`.lines();
splits on \r\n or \r or \n
doesn't trim lines or exclude blank lines

returns a Lines object with methods
l.trimAll()
l.skipBlanks()
l.text() default platform separator, see how that works
l.text("\r\n") custom separator

dent(`
	something
	something
		something
	something
`);
returns an edited, but still multiline, single string
removes starting and trailing blank lines
doesn't remove internal blank lines
removes whitespace from first line on all later lines, throws if not exactly the same whitespace (combination of spaces and tabs)
(do this by trimming, then finding, then clipping, that's a cool idea)

something\r\n
something\r\n
	something\r\n
something\r\n

actually, that's not going to work with ${} because those are going to hit first
and then if one of them contains a newline
dent is going to get something not indented
so maybe it should ignore incorrectly indented lines instead of deindenting them

or no, just use dent for Outline and not for Vue
either way, this is enough to scare you away from working on words lines Lines and dent right now
*/






















