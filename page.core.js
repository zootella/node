//console.log("page core\\");
contain(function(expose) {




// Make a unique identifier for a new element on the page, from "idn1" through "idn9000000000000000" and then "idnn1", quick and infinite
var unique_i, unique_s;
function makeUnique() {
	if (!unique_s) unique_s = "id"; // Starting prefix
	if (!unique_i || unique_i > 9000000000000000) { unique_s += "n"; unique_i = 1; } // It's over nine thousand! actually quadrillion
	return unique_s + unique_i++; // Increment number for next time
}

expose.core({makeUnique});





// Make a string of HTML from the given Mustache template like "<p>{{color}}</p>" and optional content like {color: "blue"}
// Remember to call say() on each part of content to turn it into text
function template(template, content) {
	if (!content) content = {};
	var compiledTemplate = required.handlebars.compile(template);
	return compiledTemplate(content);
}

expose.core({template});













});
//console.log("page core/");