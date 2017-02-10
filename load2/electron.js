console.log("electron\\");


console.log("electron pid " + process.pid + ", dirname " + __dirname);

require("./load");

var platformElectron = require("electron");









var app = platformElectron.app;
var win; // Keep a global reference to the window object so it's not garbage collected, which would close the window

app.on("ready", function() { // Electron has finished starting and is ready to make windows
	win = new platformElectron.BrowserWindow({width: 800, height: 1100}); // Create the browser window
	win.loadURL("file://" + __dirname + "/index.html"); // Load the page of the app
	win.webContents.openDevTools(); // Open the developer tools

	win.on("closed", function() { // The user closed the window
		win = null; // Discard our reference to the window object
	});
});

app.on("window-all-closed", function() { // All the windows are closed
	app.quit();
});


/*
this doesn't have to be in this file at all!
require(load) up top runs the whole single file
the single file can detect it's electron's main, and do whatever

so now you cna have the instructions with the files to make really, really short!


*/




/*
page ipc asks main for the arguments
*/






console.log("electron/");