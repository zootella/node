
var platformElectron = require("electron");

var app = platformElectron.app;
var BrowserWindow = platformElectron.BrowserWindow;

app.on("ready", createWindow); // Electron has finished starting and is ready for you to make windows

app.on("window-all-closed", function() { // All the windows are closed
	if (process.platform != "darwin") app.quit(); // On Mac, closing the window doesn't exit the app
});

app.on("activate", function() {
	if (win == null) createWindow(); // On Mac, clicking the dock icon makes the window
});

var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window

function createWindow() {
	win = new BrowserWindow({width: 800, height: 600}); // Create the browser window
	win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
	win.webContents.openDevTools(); // Open the developer tools

	win.on("closed", function() { // The user closed the window
		win = null; // Discard our reference to the window object
	});
}
