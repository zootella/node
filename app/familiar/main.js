
var platformElectron = require("electron");

require("../../load").load("base", function() { return this; });

log("main pid #, dirname #".fill(process.pid, __dirname));






var app = platformElectron.app;
var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window

app.on("ready", function() { // Electron has finished starting and is ready to make windows
	win = new platformElectron.BrowserWindow({width: 900, height: 1100}); // Create the browser window
	win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
	win.webContents.openDevTools(); // Open the developer tools

	win.on("closed", function() { // The user closed the window
		win = null; // Discard our reference to the window object
	});
});

app.on("window-all-closed", function() { // All the windows are closed
	app.quit();
});















