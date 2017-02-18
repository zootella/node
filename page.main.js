console.log("page main\\");
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


expose.main("program7", function(a, b, c) {
	console.log("hello from program 7");
	console.log(a);
	console.log(b);
	console.log(c);



});


//here's where you put electron-browser and electron-renderer







});
console.log("page main/");