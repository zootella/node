
var platformHandlebars = require("handlebars");







// Make a string of HTML from the given Mustache template like "<p>{{color}}</p>" and optional content like {color: "blue"}
// Remember to call say() on each part of content to turn it into text
function Template(template, content) {
	if (!content) content = {};
	var compiledTemplate = platformHandlebars.compile(template);
	return compiledTemplate(content);
}

exports.Template = Template;













