


var $ = require("jquery");






$(document).ready(function() {
	$("#snip").click(function() { snip(); });
	main();
});
function log(s) {
	$("#log").append($("<p>").text(s));
	console.log(s);
}
function stick(s) {
	$("#stick").text(s);
}




function main() {

	log("hello log");




}

function snip() {

	log("my log");
	stick("my stick");





}



console.log("hi from page.js");













