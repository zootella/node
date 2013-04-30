


var log = console.log;

var crypto = require("crypto");

var data = require("./data");
var Data = data.Data;

var measure = require("./measure");
var Size = measure.Size;



function uniqueData() { return randomData(Size.value); } // 20 bytes of random data should be globally unique
function randomData(n) { return Data(crypto.randomBytes(n)); } // Make n bytes of random data

exports.uniqueData = uniqueData;
exports.randomData = randomData;




//write hash, use it to have data.hash()



//see how slow this stuff is
//something that may take a really long time has to always be a callback
//something that will work reliably because it's all in memory, but takes 10-100ms, you might want to have synchronous and event options
//unless calling it a lot warms it up and then it starts going fast, then you can just use the synchronous option
//so, for instance, see how long it takes to generate 100 guids, and if it's more than 100ms, you should probably have an event option


