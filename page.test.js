//console.log("page test\\");
if (process.argv[1].endsWith("nodeunit")) require("./load");//TODO
contain(function(expose) {
if (process.argv[1].endsWith("nodeunit")) { expose.test = function(n, f) { exports[nameTest(n, exports)] = function(t) { f(t.ok, function() { customDone(t); }); }; }; };//TODO





expose.test("page require", function(ok, done) {

/*
	var $ = require("jquery");
	var required.handlebars = require("handlebars");

	ok(typeof $ == "function");//command line node can require jquery and handlebars
	ok(typeof required.handlebars.compile == "function");

	//and it can use handlebars
	ok(required.handlebars.compile("<p>{{content}}</p>")({content:"Some content."}) == "<p>Some content.</p>");
	try {
		var d = $("<div/>");//but not jquery
		ok(false);
	} catch (e) { ok(e.message == "jQuery requires a window with a document"); }
*/
//TODO only run this one in the electron page, if ($)

	done();
});









expose.test("page template", function(ok, done) {

	var t = "<p>{{name}} is a <b>{{color}}</b> {{animal}}.</p>";//template
	var c = {name:"Morris", color:"red", animal:"fox"};//content
	ok(template(t, c) == "<p>Morris is a <b>red</b> fox.</p>");//merge

	ok(template(t, {name:"Ben", color:"yellow", animal:"bird"})  == "<p>Ben is a <b>yellow</b> bird.</p>");
	ok(template(t, {name:"Tom", color:"blue",   animal:"whale"}) == "<p>Tom is a <b>blue</b> whale.</p>");

	done();
});

expose.test("page template blank", function(ok, done) {

	var t = "l{{a}}r";
	ok(template(t, {a:"A"})        == "lAr");//correct
	ok(template(t, {})             == "lr");//missing
	ok(template(t, {a:"A", b:"B"}) == "lAr");//extra
	ok(template(t, {b:"B"})        == "lr");//missing and extra

	done();
});










expose.main("snip-page", function() {



	var content = {
		color: "blue",
		people: [
			"Yehuda Katz",
			"Alan Johnson",
			"Charles Jolley"
		],
		region: "west"
	};

	var h = Template(`
		<ul class="class_name">
			{{#each people}}
				<li>{{this}}</li>
			{{/each}}
		</ul>
		<p>{{color}} and {{region}}</p>
	`,
	content);

	log(h);


	/*

	log("log1a", "log1b");
	stick("stick1a", "stick1b");
	log("log2a", "log2b");
	stick("stick2a", "stick2b");

	log("first\r\nsecond");
//	stick("first\r\nsecond");
*/


	//what happens when you do two arguments
	//and what happens when there are \r\n in the strings
	//make it work the same on terminal and page
});
















//see the arguments in node and electron renderer
expose.main("arguments", function(a, b, c) {
	log("got the arguments: '#', '#', and '#'".fill(a, b, c));//see the arguments in node and electron renderer
});

//check which global names are already in use by node and electron
expose.main("reserved", function() {
	function check(n) {
		if (undefined === global[n]) log("ok: '#'".fill(n));
		else                         log("no: '#' is already a # that as text is: #".fill(n, typeof global[n], say(global[n]).pilcrow()));
		log();
	}

	check("setTimeout");//obviously taken everywhere
	check("_very_obscure_2");//probably not taken anywhere

	check("File");//ok in node and electron browser, but not in electron renderer
	check("Range");
	check("close");

	check("done");//ok each place
	check("end");
	check("shut");//this is why i had to rename close() to shut(), but the new name is shorter and more unique
	check("free");
});









});
//console.log("page test/");