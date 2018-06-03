//console.log("page core\\");
contain(function(expose) {

// Use jQuery and Vue by their common names in the code here
var $ = required.jquery;
var Vue = required.vue;

// Add the given CSS to the top of the HTML page Electron is showing
function appendHead(s) {
	$(s).appendTo("head"); // Have jQuery add it to the end of what's inside <head>
}

// Register a new global Vue component from the given tag name like <someTag>, template text, and an object of properties and methods
function tag(name, t) {

	// Parse tag name like "<someTag>" into name like "someTag"
	t.name = name.parse("<", ">").middle;
	if (!is(t.name)) toss("code");

	// Register it as a global Vue component
	Vue.component(t.name, { props: t.properties, template: t.template });

	// If this is the root <pageTag>, add another step to its make() method to put it on the page
	if (name == "<pageTag>") {
		var m = t.make; // Point m at the pageTag.make() method
		t.make = function() { // Replace it with this make() method instead
			var p = m.apply(this, arguments); // Like var p = pageTag.make()
			p.rootVueInstance = new Vue({ // All index.html has is <div id="page"></div>, create the root Vue instance there, and save it in p
				el: '#page',
				template: `<div id="page"><pageTag :key="p.id" :p="p"/></div>`, // All index.html has is 
				data: { p: p }
			});
			return p;
		}
	}

	return t;
}

// Make a unique identifier for a new element on the page, from "idn1" through "idn9000000000000000" and then "idnn1", quick and infinite
var idn_i, idn_s;
function idn() {
	if (!idn_s) idn_s = "id"; // Starting prefix
	if (!idn_i || idn_i > 9000000000000000) { idn_s += "n"; idn_i = 1; } // It's over nine thousand! actually quadrillion
	return idn_s + idn_i++; // Increment number for next time
}

expose.core({appendHead, tag, idn});

});
//console.log("page core/");