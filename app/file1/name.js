console.log("main\\");
console.log("process.pid:     " + process.pid);
console.log("__dirname:       " + __dirname);
console.log("__filename:      " + __filename);
console.log("module.filename: " + module.filename);




if (process.type == "browser") {//main
	console.log("browser role ----");

	var platformElectron = require("electron");
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

	available();

} else if (process.type == "renderer") {//page
	console.log("renderer role ----");

	var $ = require("jquery");
	$(document).ready(function() {
		$("body").html('<input type="button" value="Refresh" onClick="window.location.reload()"/>');

		available();
	});

} else {
	console.log("shell role ----");

	available();
}


function available() {
	console.log("let's see what's available");
	console.log();


	function check(n) {
		if (undefined === global[n]) {
			console.log(n + " ok!");
		} else {
			console.log(n + " <---- taken :(");
			console.log(typeof global[n]);
			console.log(global[n]+"");


			console.log(".");
		}
	}

	check("nobodyWouldUseThis");
	check("File");
	check("Range");
	check("close");
	check("done");
	check("end");
	check("shut");
	check("free");




















	console.log();
}












console.log("main/");