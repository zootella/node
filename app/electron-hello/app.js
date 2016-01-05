
//use node
var util = require("util");
var fs = require("fs");

//show the developer tools
require('remote').getCurrentWindow().toggleDevTools();

//write to the page
document.write(paragraph("process.versions: " + util.inspect(process.versions)));

//read from the disk
var contents = fs.readFileSync("./app/electron-hello/readme.txt", "utf8");
document.write(paragraph(contents));

//define a function
function paragraph(s) { return "<p>" + s + "<p>"; }//compose some html

//have trouble with log
var log2 = console.log;//point to the existing function
function log3(s) { console.log(s); }//wrap with a function
console.log("said using console.log");
//log2("said using log2");//uncomment to see "Uncaught TypeError: Illegal invocation"
log3("said using log3");

//make a mistake
//{}.notfound;//uncomment and none of this seems to run

//run to the end
console.log("app.js ran to the end");
