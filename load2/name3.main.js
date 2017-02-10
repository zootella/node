console.log("name3 main\\");
contain(function(expose) {





expose.main("page1", function(a, b, c) {
	log("this is a main which is a page, so that's interesting");

	var platformElectron = require("electron");
	var $ = require("jquery");


	$(document).ready(function() {
		var t = `
			<input type="button" value="Refresh" onClick="window.location.reload()"/>
			<div id="page">
				<div id="stack"/>
			</div>
		`;
		$("body").html(t);
	});



});















});
console.log("name3 main/");