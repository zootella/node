
require("./load").load("base", function() { return this; });







exports.testRequire = function(test) {

	var $ = require("jquery");
	var platformHandlebars = require("handlebars");

	test.ok(typeof $ == "function");//command line node can require jquery and handlebars
	test.ok(typeof platformHandlebars.compile == "function");

	//and it can use handlebars
	test.ok(platformHandlebars.compile("<p>{{content}}</p>")({content:"Some content."}) == "<p>Some content.</p>");
	try {
		var d = $("<div/>");//but not jquery
		test.fail();
	} catch (e) { test.ok(e.message == "jQuery requires a window with a document"); }

	done(test);
}









exports.testTemplate = function(test) {

	var t = "<p>{{name}} is a <b>{{color}}</b> {{animal}}.</p>";//template
	var c = {name:"Morris", color:"red", animal:"fox"};//content
	test.ok(Template(t, c) == "<p>Morris is a <b>red</b> fox.</p>");//merge

	test.ok(Template(t, {name:"Ben", color:"yellow", animal:"bird"})  == "<p>Ben is a <b>yellow</b> bird.</p>");
	test.ok(Template(t, {name:"Tom", color:"blue",   animal:"whale"}) == "<p>Tom is a <b>blue</b> whale.</p>");

	done(test);
}

exports.testTemplateBlank = function(test) {

	var t = "l{{a}}r";
	test.ok(Template(t, {a:"A"})        == "lAr");//correct
	test.ok(Template(t, {})             == "lr");//missing
	test.ok(Template(t, {a:"A", b:"B"}) == "lAr");//extra
	test.ok(Template(t, {b:"B"})        == "lr");//missing and extra

	done(test);
}










if (demo("snip")) { demoSnip(); }
function demoSnip() {



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
}









//TODO attack
/*
does handlebars protect you from a mistake template that has broken html, like no closing div tag or something

confirm that nothing can get through handlebars, and then always use handlebars with jquery, and you'll be fine
write a test to show that " and ' and the others can make it through jquery, but not handlebars, that handlebar's protection is better

dangerous things
"
'
</div>
&
<script>alert()</script>

push through
jquery text
jquery html
handlebars template

all you have to do with safety is confirm that nothing can get through handlebars, and then always use handlebars
see where you can sneak in a < or an alert(), and where you are protected from that
in jquery in a test, make a new p, add some inner text, then get the html
move this into a test, see how handlebars protects you better than query does
*/



























