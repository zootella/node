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

	//TODO is 'var win' local here good enough? probably also loadCopy that onto global to really pin it
	//no, attach it to a program object that load already put on global
	//yeah, the application object, time to start thinking about that

//do real ipc with node core module and bluebird
//rather than all the synchronous electron cheats

/*
look at the ipc stuff you did a year ago
update that with bluebird



*/

});

expose.main("electron-renderer", function() {

	$(document).ready(function() {
		$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');
	});

	
});


expose.main("snip", function() {
	log("hello snip");


	
});





});
console.log("page main/");