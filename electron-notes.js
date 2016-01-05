

/*

empty folder

npm init
makes package.json

npm install electron-prebuilt --save-dev

"main": "index.js",
scripts, start, electron .

index.js

var app = require("app");
var BrowserWindow = require("browser-window");
app.on("ready", function() {
	var mainWindow = new BrowserWindow({
		width:  800,
		height: 600
	});
	mainWindow.loadUrl("file://" + __dirname + "//index.html")
});

npm start

index.html





*/





