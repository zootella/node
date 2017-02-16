console.log("name3 main\\");
contain(function(expose) {











expose.main("electron-browser", function() {

	var app = required.electron.app;
	var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window
	app.on("ready", function() { // Electron has finished starting and is ready to make windows
		win = new required.electron.BrowserWindow({width: 900, height: 1100}); // Create the browser window
		win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
		win.webContents.openDevTools(); // Open the developer tools
		win.on("closed", function() { // The user closed the window
			win = null; // Discard our reference to the window object
		});
	});
	app.on("window-all-closed", function() { // All the windows are closed
		app.quit();
	});


});

expose.main("electron-renderer", function() {

	$(document).ready(function() {
		$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');
	});

	
});



expose.main("test", function() {



});


expose.main("name1", function() {



});






expose.main("main2", function() {



});


expose.main("name7", function(a, b, c) {
	console.log("hello from name 7");
	console.log(a);
	console.log(b);
	console.log(c);



});





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