//console.log("page core\\");
contain(function(expose) {








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